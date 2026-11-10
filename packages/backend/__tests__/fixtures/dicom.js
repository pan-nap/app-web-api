// 生成最小合法 DICOM Part10 文件（Explicit VR Little Endian），仅用于测试。
// 结构：128 字节 preamble + "DICM" + File Meta Information + Dataset。

const LONG_VRS = new Set(['OB', 'OW', 'OF', 'OD', 'OL', 'OV', 'SQ', 'UT', 'UN', 'SV', 'UV']);

const padEven = (buf, vr) => {
  if (buf.length % 2 === 0) return buf;
  // UI 用 null 填充，其余字符串 VR 用空格填充
  const pad = vr === 'UI' ? 0x00 : 0x20;
  return Buffer.concat([buf, Buffer.from([pad])]);
};

const us = (n) => {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n, 0);
  return b;
};

const ul = (n) => {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n, 0);
  return b;
};

// 编码单个数据元素：tag(4) + VR + length + value
const elem = (group, element, vr, value) => {
  const tag = Buffer.alloc(4);
  tag.writeUInt16LE(group, 0);
  tag.writeUInt16LE(element, 2);

  let val = Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf8');
  val = padEven(val, vr);

  const vrBuf = Buffer.from(vr, 'ascii');
  let header;
  if (LONG_VRS.has(vr)) {
    header = Buffer.alloc(8);
    vrBuf.copy(header, 0);
    header.writeUInt16LE(0, 2); // 2 字节保留位
    header.writeUInt32LE(val.length, 4);
  } else {
    header = Buffer.alloc(4);
    vrBuf.copy(header, 0);
    header.writeUInt16LE(val.length, 2);
  }
  return Buffer.concat([tag, header, val]);
};

let uidCounter = 0;
export const makeUid = (root = '1.2.826.0.1.3680043.10.543') =>
  `${root}.${Date.now()}.${++uidCounter}`;

// 默认值可被 overrides 覆盖；rows/cols 控制像素尺寸
export function buildDicomFile(overrides = {}) {
  const sopClassUid = '1.2.840.10008.5.1.4.1.1.7'; // Secondary Capture Image Storage
  const sopInstanceUid = overrides.sopInstanceUid || makeUid();
  const studyInstanceUid = overrides.studyInstanceUid || makeUid();
  const seriesInstanceUid = overrides.seriesInstanceUid || makeUid();
  const rows = overrides.rows ?? 4;
  const cols = overrides.cols ?? 4;

  const t = {
    patientName: 'Test^Patient',
    patientId: 'PID-0001',
    patientSex: 'O',
    studyDate: '20261109',
    studyTime: '120000',
    accessionNumber: 'ACC-0001',
    modality: 'SC',
    studyId: 'STUDY-001',
    seriesNumber: '1',
    instanceNumber: '1',
    ...overrides,
  };

  // File Meta Information（恒为 Explicit VR LE）
  const metaElements = [
    elem(0x0002, 0x0001, 'OB', Buffer.from([0x00, 0x01])),
    elem(0x0002, 0x0002, 'UI', sopClassUid),
    elem(0x0002, 0x0003, 'UI', sopInstanceUid),
    elem(0x0002, 0x0010, 'UI', '1.2.840.10008.1.2.1'), // Explicit VR Little Endian
  ];
  const groupLength = metaElements.reduce((sum, b) => sum + b.length, 0);
  const meta = Buffer.concat([elem(0x0002, 0x0000, 'UL', ul(groupLength)), ...metaElements]);

  // 4x4 8-bit 灰度像素
  const pixel = Buffer.alloc(rows * cols, 0);
  for (let i = 0; i < pixel.length; i++) pixel[i] = (i * 16) % 256;

  // Dataset（Explicit VR LE）
  const dataset = Buffer.concat([
    elem(0x0008, 0x0016, 'UI', sopClassUid),
    elem(0x0008, 0x0018, 'UI', sopInstanceUid),
    elem(0x0008, 0x0020, 'DA', t.studyDate),
    elem(0x0008, 0x0030, 'TM', t.studyTime),
    elem(0x0008, 0x0050, 'SH', t.accessionNumber),
    elem(0x0008, 0x0060, 'CS', t.modality),
    elem(0x0010, 0x0010, 'PN', t.patientName),
    elem(0x0010, 0x0020, 'LO', t.patientId),
    elem(0x0010, 0x0040, 'CS', t.patientSex),
    elem(0x0020, 0x000d, 'UI', studyInstanceUid),
    elem(0x0020, 0x000e, 'UI', seriesInstanceUid),
    elem(0x0020, 0x0010, 'SH', t.studyId),
    elem(0x0020, 0x0011, 'IS', t.seriesNumber),
    elem(0x0020, 0x0013, 'IS', t.instanceNumber),
    elem(0x0028, 0x0002, 'US', us(1)), // Samples per Pixel
    elem(0x0028, 0x0004, 'CS', 'MONOCHROME2'),
    elem(0x0028, 0x0010, 'US', us(rows)),
    elem(0x0028, 0x0011, 'US', us(cols)),
    elem(0x0028, 0x0100, 'US', us(8)), // Bits Allocated
    elem(0x0028, 0x0101, 'US', us(8)), // Bits Stored
    elem(0x0028, 0x0102, 'US', us(7)), // High Bit
    elem(0x0028, 0x0103, 'US', us(0)), // Pixel Representation
    elem(0x7fe0, 0x0010, 'OB', pixel),
  ]);

  const file = Buffer.concat([Buffer.alloc(128, 0), Buffer.from('DICM', 'ascii'), meta, dataset]);

  return {
    buffer: file,
    sopClassUid,
    sopInstanceUid,
    studyInstanceUid,
    seriesInstanceUid,
    patientName: t.patientName,
    patientId: t.patientId,
    modality: t.modality,
    rows,
    cols,
  };
}