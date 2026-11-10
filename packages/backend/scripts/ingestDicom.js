import fs from 'fs/promises';
import path from 'path';

// 批量 STOW-RS 灌库：把目录下所有 .dcm 逐个 POST /pacs/studies。
// 用法: node scripts/ingestDicom.js <dicom目录> [baseUrl]
const folder = process.argv[2];
const base = process.argv[3] || 'http://localhost:3001';
if (!folder) {
  console.error('用法: node scripts/ingestDicom.js <dicom目录> [baseUrl]');
  process.exit(1);
}

async function collect(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await collect(full)));
    else if (/\.dcm$/i.test(e.name)) files.push(full);
  }
  return files;
}

const files = (await collect(folder)).sort();
console.log(`发现 ${files.length} 个 DICOM 文件，开始归档到 ${base} ...`);
let ok = 0;
let fail = 0;
for (const f of files) {
  const buf = await fs.readFile(f);
  try {
    const res = await fetch(`${base}/pacs/studies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/dicom' },
      body: buf,
    });
    const j = await res.json();
    if (j.code === 1) ok++;
    else { fail++; console.error(`失败: ${path.basename(f)} -> ${j.msg}`); }
  } catch (e) {
    fail++;
    console.error(`失败: ${path.basename(f)} -> ${e.message}`);
  }
}
console.log(`归档完成: 成功 ${ok}, 失败 ${fail}, 共 ${files.length}`);
const echo = await (await fetch(`${base}/pacs/echo`)).json();
console.log('当前统计:', JSON.stringify(echo.data));