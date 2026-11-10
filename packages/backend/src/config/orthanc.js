import 'dotenv/config';

// Orthanc 内核连接配置（P2）。沿用项目 dotenv + process.env 约定。
// PACS_BACKEND 决定 PACS 服务层走哪条链路：
//   mini    => P1 的磁盘 + MySQL mini-PACS（默认，保证未部署 Orthanc 时仍可运行）
//   orthanc => 经 OrthancClient 代理到 Orthanc 内核
export const orthancConfig = {
  backend: process.env.PACS_BACKEND || 'mini',
  baseUrl: (process.env.ORTHANC_URL || 'http://localhost:8042').replace(/\/+$/, ''),
  username: process.env.ORTHANC_USER || '',
  password: process.env.ORTHANC_PASSWORD || '',
  dicomAet: process.env.ORTHANC_AET || 'HS_PACS',
  dicomPort: Number(process.env.ORTHANC_DICOM_PORT || 4242),
  dicomwebRoot: (process.env.ORTHANC_DICOMWEB_ROOT || '/dicom-web').replace(/\/+$/, ''),
  timeoutMs: Number(process.env.ORTHANC_TIMEOUT_MS || 30000),
};

export const isOrthancBackend = () => orthancConfig.backend === 'orthanc';