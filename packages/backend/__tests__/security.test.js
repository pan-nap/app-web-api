import { apiClient, loginAsAdmin } from './testUtils.js';
import { ensurePacsTables, closePacsPool } from './helpers/pacsDb.js';
import EmployeeModel from '#models/EmployeeModel';
import { hashPassword } from '#utils/bcrypt';
import { getConnectionWithCharset } from '#config/database';

// 隔离安全测试：自建临时低权限账号，定向清理本测试数据。
// 绝不调用 cleanPacsData（会清空已灌影像），绝不 DROP 任何表。
const TEMP_USER = { username: '__pacs_viewer_test', name: '临时浏览测试', role: 'viewer' };
const TEST_ANNOTATION_UID = '__test_security_annotation_uid';
let tempUserId = null;
let adminToken = null;
let viewerToken = null;

beforeAll(async () => {
  await ensurePacsTables();
  adminToken = await loginAsAdmin();
  const password = await hashPassword('123456');
  tempUserId = await EmployeeModel.create({ ...TEMP_USER, password, status: 1 });
  const login = await apiClient
    .post('/login')
    .send({ username: TEMP_USER.username, password: '123456' });
  viewerToken = login.body.data.access_token;
});

afterAll(async () => {
  await getConnectionWithCharset(async (connection) => {
    await connection.query('DELETE FROM pacs_annotations WHERE annotation_uid = ?', [TEST_ANNOTATION_UID]);
    await connection.query('DELETE FROM pacs_audit_log WHERE username = ?', [TEMP_USER.username]);
  });
  if (tempUserId) await EmployeeModel.delete(tempUserId);
  await closePacsPool();
});

describe('P3 安全：认证 / RBAC / 审计', () => {
  it('登录响应包含 role', async () => {
    const res = await apiClient.post('/login').send({ username: 'admin', password: '123456' });
    expect(res.body.code).toBe(1);
    expect(res.body.data.role).toBe('admin');
  });

  it('未带 token 访问 PACS 查询被拒', async () => {
    const res = await apiClient.get('/pacs/studies');
    expect(res.body.code).toBe(0);
  });

  it('无效 token 被拒', async () => {
    const res = await apiClient
      .get('/pacs/studies')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.body.code).toBe(0);
  });

  it('admin 可查询检查', async () => {
    const res = await apiClient.get('/pacs/studies').set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.code).toBe(1);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('viewer 可读但不可写批注（RBAC 拒绝）', async () => {
    const read = await apiClient.get('/pacs/studies').set('Authorization', `Bearer ${viewerToken}`);
    expect(read.body.code).toBe(1);

    const write = await apiClient
      .post('/pacs/annotations')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ annotationUID: TEST_ANNOTATION_UID, studyUid: 'test-study', sopUid: 'test-sop', toolName: 'Length', payload: {} });
    expect(write.body.code).toBe(0);
    expect(write.body.msg).toContain('权限不足');
  });

  it('admin 可写批注并可删除', async () => {
    const save = await apiClient
      .post('/pacs/annotations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ annotationUID: TEST_ANNOTATION_UID, studyUid: 'test-study', sopUid: 'test-sop', toolName: 'Length', payload: { foo: 'bar' } });
    expect(save.body.code).toBe(1);

    const del = await apiClient
      .delete(`/pacs/annotations/${TEST_ANNOTATION_UID}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(del.body.code).toBe(1);
  });

  it('viewer 不能查询审计（仅 admin）', async () => {
    const res = await apiClient.get('/audit').set('Authorization', `Bearer ${viewerToken}`);
    expect(res.body.code).toBe(0);
  });

  it('admin 可查询审计，且记录了 study.list 与 login', async () => {
    await apiClient.get('/pacs/studies').set('Authorization', `Bearer ${adminToken}`);

    const res = await apiClient
      .get('/audit')
      .query({ action: 'study.list', pageSize: 5 })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.body.code).toBe(1);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].action).toBe('study.list');

    const loginAudit = await apiClient
      .get('/audit')
      .query({ action: 'login', username: 'admin', pageSize: 5 })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(loginAudit.body.code).toBe(1);
    expect(loginAudit.body.data.length).toBeGreaterThan(0);
  });
});