import { orthancConfig } from '#config/orthanc';

// Orthanc REST / DICOMweb 客户端封装（P2）。
// Orthanc 的 REST 资源路径既接受内部 ID，也接受 DICOM UID（Study/Series/SOP Instance UID），
// 因此 BFF 可直接用前端契约里的 UID 调阅，无需额外映射。
const authHeaders = () => {
  if (!orthancConfig.username) return {};
  const token = Buffer.from(`${orthancConfig.username}:${orthancConfig.password}`).toString('base64');
  return { Authorization: `Basic ${token}` };
};

const buildQuery = (params = {}) => {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
};

async function request(pathname, { method = 'GET', body, headers = {}, raw = false, text = false } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), orthancConfig.timeoutMs);
  let res;
  try {
    res = await fetch(`${orthancConfig.baseUrl}${pathname}`, {
      method,
      headers: { ...authHeaders(), ...headers },
      body,
      signal: controller.signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error(`Orthanc 请求超时 (${orthancConfig.timeoutMs}ms): ${method} ${pathname}`);
    }
    throw new Error(`无法连接 Orthanc (${orthancConfig.baseUrl}): ${e.message}`);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Orthanc ${method} ${pathname} 失败 (${res.status}): ${text.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  if (raw) return Buffer.from(await res.arrayBuffer());
  const textBody = await res.text();
  if (text) return textBody;
  return textBody ? JSON.parse(textBody) : null;
}

const json = (obj) => ({ 'Content-Type': 'application/json' });
const id = (uid) => encodeURIComponent(uid);

export const OrthancClient = {
  // 连通性 / 系统信息
  system: () => request('/system'),

  // STOW：上传单份 DICOM 实例（原始 application/dicom 字节），返回 { ID, Status, ... }
  uploadInstance: (buffer) =>
    request('/instances', {
      method: 'POST',
      body: buffer,
      headers: { 'Content-Type': 'application/dicom' },
    }),

  // QIDO：按 Study 级别检索，Expand=true 直接返回完整 study 资源（含 MainDicomTags/Series）
  findStudies: (query = {}) =>
    request('/tools/find', {
      method: 'POST',
      headers: json(),
      body: JSON.stringify({ Level: 'Study', Query: query, Expand: true }),
    }),

  // 资源读取（uid 可为 DICOM UID 或 Orthanc 内部 ID）
  getStudy: (uid) => request(`/studies/${id(uid)}`),
  getStudySeries: (uid) => request(`/studies/${id(uid)}/series`),
  getSeries: (uid) => request(`/series/${id(uid)}`),
  getSeriesInstances: (uid, expand = false) =>
    request(`/series/${id(uid)}/instances${expand ? '?expand=true' : ''}`),
  getInstance: (uid) => request(`/instances/${id(uid)}`),

  // 实例完整 DICOM 标签（simplify => 关键字到值的扁平映射）与单项 Orthanc 元数据
  getInstanceTags: (uid) => request(`/instances/${id(uid)}/tags?simplify`),
  // 单项元数据端点返回纯文本（如 TransferSyntax UID、PixelDataOffset 数值），不做 JSON 解析
  getInstanceMetadata: (uid, key) => request(`/instances/${id(uid)}/metadata/${id(key)}`, { text: true }),

  // WADO：取回原始 DICOM 字节
  getInstanceFile: (uid) => request(`/instances/${id(uid)}/file`, { raw: true }),

  // UID -> Orthanc 内部 ID 兜底映射（返回 [{ ID, Level }]）
  lookup: (uid) =>
    request('/tools/lookup', { method: 'POST', body: String(uid), headers: { 'Content-Type': 'text/plain' } }),

  // DICOMweb QIDO-RS（返回 DICOM JSON 模型数组）
  dicomwebStudies: (params = {}) => request(`${orthancConfig.dicomwebRoot}/studies${buildQuery(params)}`),

  // 归档统计
  stats: () => request('/statistics'),
};

export default OrthancClient;