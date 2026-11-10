import store from '#services/PacsService';
import { buildDemoStudy } from '#utils/demoDicom';
import { success, error } from '#utils/response';

// 读取原始二进制请求体（application/dicom），不经过 JSON bodyParser
const readRawBody = (ctx) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    ctx.req.on('data', (c) => chunks.push(c));
    ctx.req.on('end', () => resolve(Buffer.concat(chunks)));
    ctx.req.on('error', reject);
  });

// C-ECHO：连通性验证，返回 AE Title 与归档统计
export async function echo(ctx) {
  success(ctx, { aeTitle: store.aeTitle, ...(await store.stats()) }, 'PACS 节点在线');
}

// STOW-RS：接收 DICOM 实例并归档
export async function stow(ctx) {
  const buffer = await readRawBody(ctx);
  if (!buffer || buffer.length === 0) {
    error(ctx, '请求体为空，需上传 DICOM 文件（application/dicom）');
    return;
  }
  const meta = await store.store(buffer);
  success(ctx, { ...meta, stats: await store.stats() }, '影像归档成功');
}

// QIDO-RS：查询检查列表
export async function qido(ctx) {
  const { patientId, modality, studyDate } = ctx.query;
  const studies = await store.queryStudies({ patientId, modality, studyDate });
  success(ctx, studies, '查询成功');
}

// 检查详情（含序列与实例元数据）
export async function studyDetail(ctx) {
  const study = await store.getStudy(ctx.params.studyUid);
  if (!study) {
    error(ctx, '检查不存在');
    return;
  }
  success(ctx, study, '查询成功');
}

// WADO-RS：调阅原始 DICOM 字节
export async function wado(ctx) {
  const buffer = await store.getInstanceBuffer(ctx.params.studyUid, ctx.params.sopUid);
  if (!buffer) {
    ctx.status = 404;
    error(ctx, '实例不存在');
    return;
  }
  ctx.type = 'application/dicom';
  ctx.set('Content-Disposition', `attachment; filename="${ctx.params.sopUid}.dcm"`);
  ctx.body = buffer;
}

// 生成一个含多切片的演示检查并归档，供前端阅片页加载
export async function seed(ctx) {
  const { studyInstanceUid, seriesInstanceUid, instances } = buildDemoStudy(3);
  for (const inst of instances) await store.store(inst.buffer);
  success(
    ctx,
    {
      studyInstanceUid,
      seriesInstanceUid,
      instances: instances.map((i, idx) => ({ sopInstanceUid: i.sopInstanceUid, instanceNumber: idx + 1 })),
    },
    '演示检查已生成'
  );
}