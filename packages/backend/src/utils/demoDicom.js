// 生成用于阅片演示的 DICOM 文件（256x256 8-bit 灰度，含渐变背景与模拟病灶）。
// 仅演示用：像素为合成图案，非真实医学影像。

const LONG_VRS = new Set(['OB', 'OW', 'OF', 'OD', 'OL', 'OV', 'SQ', 'UT', 'UN', 'SV', 'UV']);

const padEven = (buf, vr) => {
  if (buf.length % 2 === 0) return buf;
  return Buffer.concat([buf, Buffer.from([vr === 'UI' ? 0x00 : 0x20])]);
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
    header.writeUInt16LE(0, 2);
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

// 合成像素：径向渐变 + 一个亮病灶 + 一个暗区，随切片变化
function makePixels(rows, cols, slice) {
  const px = Buffer.alloc(rows * cols);
  const cx = cols / 2;
  const cy = rows / 2;
  const lesionX = cx + Math.sin(slice * 0.9) * 40;
  const lesionY = cy + Math.cos(slice * 0.7) * 30;
  const lesionR = 22 + slice * 3;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      let v = 40 + (dist / (cols * 0.7)) * 120; // 径向渐变背景
      const ld = Math.sqrt((x - lesionX) ** 2 + (y - lesionY) ** 2);
      if (ld < lesionR) v = 230 - (ld / lesionR) * 40; // 亮病灶
      const dark = Math.sqrt((x - cx + 60) ** 2 + (y - cy - 50) ** 2);
      if (dark < 18) v = 15; // 暗区
      px[y * cols + x] = Math.max(0, Math.min(255, Math.round(v)));
    }
  }
  return px;
}

export function buildDemoDicom(opts = {}) {
  const rows = opts.rows ?? 256;
  const cols = opts.cols ?? 256;
  const slice = opts.slice ?? 0;
  const sopClassUid = '1.2.840.10008.5.1.4.1.1.7'; // Secondary Capture
  const sopInstanceUid = opts.sopInstanceUid || makeUid();
  const studyInstanceUid = opts.studyInstanceUid || makeUid();
  const seriesInstanceUid = opts.seriesInstanceUid || makeUid();
  const patientName = opts.patientName ?? 'Demo^Patient';
  const patientId = opts.patientId ?? 'DEMO-0001';

  const metaElements = [
    elem(0x0002, 0x0001, 'OB', Buffer.from([0x00, 0x01])),
    elem(0x0002, 0x0002, 'UI', sopClassUid),
    elem(0x0002, 0x0003, 'UI', sopInstanceUid),
    elem(0x0002, 0x0010, 'UI', '1.2.840.10008.1.2.1'),
  ];
  const groupLength = metaElements.reduce((s, b) => s + b.length, 0);
  const meta = Buffer.concat([elem(0x0002, 0x0000, 'UL', ul(groupLength)), ...metaElements]);

  const dataset = Buffer.concat([
    elem(0x0008, 0x0016, 'UI', sopClassUid),
    elem(0x0008, 0x0018, 'UI', sopInstanceUid),
    elem(0x0008, 0x0020, 'DA', '20261109'),
    elem(0x0008, 0x0030, 'TM', '120000'),
    elem(0x0008, 0x0050, 'SH', 'DEMO-ACC-001'),
    elem(0x0008, 0x0060, 'CS', opts.modality ?? 'SC'),
    elem(0x0008, 0x1030, 'LO', 'PACS Demo Study'),
    elem(0x0010, 0x0010, 'PN', patientName),
    elem(0x0010, 0x0020, 'LO', patientId),
    elem(0x0010, 0x0040, 'CS', 'O'),
    elem(0x0020, 0x000d, 'UI', studyInstanceUid),
    elem(0x0020, 0x000e, 'UI', seriesInstanceUid),
    elem(0x0020, 0x0010, 'SH', 'DEMO-001'),
    elem(0x0020, 0x0011, 'IS', '1'),
    elem(0x0020, 0x0013, 'IS', String(slice + 1)),
    elem(0x0028, 0x0002, 'US', us(1)),
    elem(0x0028, 0x0004, 'CS', 'MONOCHROME2'),
    elem(0x0028, 0x0010, 'US', us(rows)),
    elem(0x0028, 0x0011, 'US', us(cols)),
    elem(0x0028, 0x0100, 'US', us(8)),
    elem(0x0028, 0x0101, 'US', us(8)),
    elem(0x0028, 0x0102, 'US', us(7)),
    elem(0x0028, 0x0103, 'US', us(0)),
    elem(0x0028, 0x1050, 'DS', '128'), // Window Center
    elem(0x0028, 0x1051, 'DS', '256'), // Window Width
    elem(0x7fe0, 0x0010, 'OB', makePixels(rows, cols, slice)),
  ]);

  const buffer = Buffer.concat([Buffer.alloc(128, 0), Buffer.from('DICM', 'ascii'), meta, dataset]);
  return { buffer, sopInstanceUid, studyInstanceUid, seriesInstanceUid, rows, cols };
}

// 生成一个含 numSlices 张切片的演示检查
export function buildDemoStudy(numSlices = 3) {
  const studyInstanceUid = makeUid();
  const seriesInstanceUid = makeUid();
  const instances = [];
  for (let i = 0; i < numSlices; i++) {
    instances.push(
      buildDemoDicom({ studyInstanceUid, seriesInstanceUid, slice: i, instanceNumber: i + 1 })
    );
  }
  return { studyInstanceUid, seriesInstanceUid, instances };
}