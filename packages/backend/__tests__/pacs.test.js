import Koa from 'koa';
import request from 'supertest';
import { bodyParser } from '@koa/bodyparser';
import dicomParser from 'dicom-parser';
import pacsRouter from '../src/routes/pacs.js';
import { buildDicomFile } from './fixtures/dicom.js';
import { ensurePacsTables, cleanPacsData, closePacsPool } from './helpers/pacsDb.js';

// 自包含测试：仅挂载 PACS 路由（无认证）。P1 起服务落 MySQL + 磁盘，
// 故依赖开发库（与项目其它后端测试一致），beforeEach 仅清理 PACS 自有表与测试影像目录。
const app = new Koa();
app.use(bodyParser());
app.use(pacsRouter.routes()).use(pacsRouter.allowedMethods());
const client = request(app.callback());

beforeAll(async () => {
  await ensurePacsTables();
});
beforeEach(async () => {
  await cleanPacsData();
});
afterAll(async () => {
  await closePacsPool();
});

// 让 supertest 以 Buffer 接收 application/dicom 二进制响应
const binaryParser = (res, callback) => {
  const chunks = [];
  res.on('data', (c) => chunks.push(Buffer.from(c)));
  res.on('end', () => callback(null, Buffer.concat(chunks)));
};

const upload = (file) =>
  client.post('/pacs/studies').set('Content-Type', 'application/dicom').send(file.buffer);

describe('Mini-PACS DICOMweb 工作流', () => {
  it('GET /pacs/echo - C-ECHO 连通性验证', async () => {
    const res = await client.get('/pacs/echo');
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1);
    expect(res.body.data.aeTitle).toBe('HS_PACS_DEMO');
    expect(res.body.data).toMatchObject({ studies: 0, series: 0, instances: 0 });
  });

  it('POST /pacs/studies - STOW-RS 接收并解析影像', async () => {
    const file = buildDicomFile({ patientName: 'Zhang^San', patientId: 'PID-001', modality: 'CT' });
    const res = await upload(file);
    expect(res.status).toBe(200);
    expect(res.body.code).toBe(1);
    expect(res.body.data).toMatchObject({
      patientName: 'Zhang^San',
      patientId: 'PID-001',
      modality: 'CT',
      studyInstanceUid: file.studyInstanceUid,
      seriesInstanceUid: file.seriesInstanceUid,
      sopInstanceUid: file.sopInstanceUid,
      rows: 4,
      cols: 4,
      hasPixelData: true,
      pixelDataLength: 16,
    });
    expect(res.body.data.stats).toMatchObject({ studies: 1, series: 1, instances: 1 });
  });

  it('GET /pacs/studies - QIDO-RS 查询检查列表', async () => {
    const file = buildDicomFile({ patientId: 'PID-002', modality: 'MR' });
    await upload(file);
    const res = await client.get('/pacs/studies');
    expect(res.body.code).toBe(1);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({
      patientId: 'PID-002',
      modalities: ['MR'],
      numberOfSeries: 1,
      numberOfInstances: 1,
    });
  });

  it('GET /pacs/studies - 按 patientId/modality 过滤', async () => {
    await upload(buildDicomFile({ patientId: 'PID-A', modality: 'CT' }));
    await upload(buildDicomFile({ patientId: 'PID-B', modality: 'MR' }));

    const byPatient = await client.get('/pacs/studies').query({ patientId: 'PID-A' });
    expect(byPatient.body.data).toHaveLength(1);
    expect(byPatient.body.data[0].patientId).toBe('PID-A');

    const byModality = await client.get('/pacs/studies').query({ modality: 'MR' });
    expect(byModality.body.data).toHaveLength(1);
    expect(byModality.body.data[0].modalities).toEqual(['MR']);

    const none = await client.get('/pacs/studies').query({ patientId: 'PID-NONE' });
    expect(none.body.data).toHaveLength(0);
  });

  it('同一 Study/Series 下多实例自动聚合', async () => {
    const studyUid = '1.2.3.4.5.6.7.8.1';
    const seriesUid = '1.2.3.4.5.6.7.8.2';
    await upload(buildDicomFile({ studyInstanceUid: studyUid, seriesInstanceUid: seriesUid, instanceNumber: '1' }));
    await upload(buildDicomFile({ studyInstanceUid: studyUid, seriesInstanceUid: seriesUid, instanceNumber: '2' }));

    const res = await client.get('/pacs/studies');
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({ numberOfSeries: 1, numberOfInstances: 2 });
  });

  it('GET /pacs/studies/:uid - 检查详情含序列与实例', async () => {
    const file = buildDicomFile();
    await upload(file);
    const res = await client.get(`/pacs/studies/${file.studyInstanceUid}`);
    expect(res.body.code).toBe(1);
    expect(res.body.data.studyInstanceUid).toBe(file.studyInstanceUid);
    expect(res.body.data.series).toHaveLength(1);
    expect(res.body.data.series[0].instances).toHaveLength(1);
    expect(res.body.data.series[0].instances[0].sopInstanceUid).toBe(file.sopInstanceUid);
  });

  it('GET .../instances/:sopUid - WADO-RS 调阅原始字节并可回环解析', async () => {
    const file = buildDicomFile({ patientName: 'Li^Si', patientId: 'PID-003' });
    await upload(file);

    const res = await client
      .get(`/pacs/studies/${file.studyInstanceUid}/instances/${file.sopInstanceUid}`)
      .buffer(true)
      .parse(binaryParser);

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/dicom');
    expect(Buffer.isBuffer(res.body)).toBe(true);
    // 字节级回环：取回的文件与上传的完全一致
    expect(Buffer.compare(res.body, file.buffer)).toBe(0);
    // 重新解析验证
    const ds = dicomParser.parseDicom(new Uint8Array(res.body));
    expect(ds.string('x00100010')).toBe('Li^Si');
    expect(ds.string('x00100020')).toBe('PID-003');
  });

  it('WADO-RS 调阅不存在的实例返回 404', async () => {
    const res = await client.get('/pacs/studies/no-such-study/instances/no-such-sop');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe(0);
  });

  it('POST /pacs/studies - 非法 DICOM 被拒绝', async () => {
    const res = await client
      .post('/pacs/studies')
      .set('Content-Type', 'application/dicom')
      .send(Buffer.from('this is not a dicom file'));
    expect(res.body.code).toBe(0);
    expect(res.body.msg).toBeTruthy();
  });

  it('POST /pacs/studies - 空请求体被拒绝', async () => {
    const res = await client.post('/pacs/studies').set('Content-Type', 'application/dicom');
    expect(res.body.code).toBe(0);
    expect(res.body.msg).toContain('为空');
  });
});

describe('演示检查 seed', () => {
  it('POST /pacs/demo/seed - 生成含 3 切片的可解析检查', async () => {
    const res = await client.post('/pacs/demo/seed');
    expect(res.body.code).toBe(1);
    expect(res.body.data.instances).toHaveLength(3);
    const { studyInstanceUid, instances } = res.body.data;

    const qido = await client.get('/pacs/studies');
    expect(qido.body.data[0]).toMatchObject({ numberOfSeries: 1, numberOfInstances: 3 });

    const wado = await client
      .get(`/pacs/studies/${studyInstanceUid}/instances/${instances[0].sopInstanceUid}`)
      .buffer(true)
      .parse(binaryParser);
    const ds = dicomParser.parseDicom(new Uint8Array(wado.body));
    expect(ds.uint16('x00280010')).toBe(256);
    expect(ds.uint16('x00280011')).toBe(256);
    expect(ds.elements.x7fe00010.length).toBe(256 * 256);
  });
});

describe('批注 JSON 持久化', () => {
  const sample = (uid, studyUid, sopUid) => ({
    annotationUID: uid,
    studyUid,
    sopUid,
    toolName: 'Length',
    payload: { handles: { points: [[1, 2, 3], [4, 5, 6]] }, cachedStats: { length: 12.5 } },
  });

  it('POST /pacs/annotations - 保存单个批注', async () => {
    const res = await client.post('/pacs/annotations').send(sample('a1', 'study-1', 'sop-1'));
    expect(res.body.code).toBe(1);
    expect(res.body.data.annotationUID).toBe('a1');
  });

  it('GET /pacs/annotations - 按 studyUid/sopUid 过滤', async () => {
    await client.post('/pacs/annotations').send(sample('a1', 'study-1', 'sop-1'));
    await client.post('/pacs/annotations').send(sample('a2', 'study-1', 'sop-2'));
    await client.post('/pacs/annotations').send(sample('a3', 'study-2', 'sop-3'));

    const byStudy = await client.get('/pacs/annotations').query({ studyUid: 'study-1' });
    expect(byStudy.body.data).toHaveLength(2);

    const bySop = await client.get('/pacs/annotations').query({ studyUid: 'study-1', sopUid: 'sop-1' });
    expect(bySop.body.data).toHaveLength(1);
    expect(bySop.body.data[0].payload.cachedStats.length).toBe(12.5);
  });

  it('POST /pacs/annotations - 批量保存', async () => {
    const res = await client
      .post('/pacs/annotations')
      .send({ annotations: [sample('b1', 's', 'p'), sample('b2', 's', 'p')] });
    expect(res.body.code).toBe(1);
    expect(res.body.data).toHaveLength(2);
  });

  it('POST /pacs/annotations - 缺少 annotationUID 被拒绝', async () => {
    const res = await client.post('/pacs/annotations').send({ studyUid: 's' });
    expect(res.body.code).toBe(0);
  });

  it('DELETE /pacs/annotations/:uid - 删除批注', async () => {
    await client.post('/pacs/annotations').send(sample('a1', 'study-1', 'sop-1'));
    const del = await client.delete('/pacs/annotations/a1');
    expect(del.body.code).toBe(1);
    const list = await client.get('/pacs/annotations').query({ studyUid: 'study-1' });
    expect(list.body.data).toHaveLength(0);
  });

  it('DELETE /pacs/annotations?studyUid - 清空检查批注', async () => {
    await client.post('/pacs/annotations').send(sample('a1', 'study-1', 'sop-1'));
    await client.post('/pacs/annotations').send(sample('a2', 'study-1', 'sop-2'));
    const clear = await client.delete('/pacs/annotations').query({ studyUid: 'study-1' });
    expect(clear.body.data.count).toBe(2);
  });
});