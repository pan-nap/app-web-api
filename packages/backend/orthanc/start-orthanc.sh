#!/usr/bin/env bash
# 本地启动 Orthanc 内核（P2，仅本地测试）。用法: bash start-orthanc.sh
# 启动后: REST/DICOMweb http://localhost:8042 （/dicom-web/）；DICOM C-STORE SCP HS_PACS@4242。
# 后端走内核: packages/backend/.env 设 PACS_BACKEND=orthanc 后重启后端（mini 可回退）。
# 二进制位于 bin/（已 gitignore），缺失时见 start-orthanc.ps1 头部下载/解压说明。
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
BIN="$ROOT/bin"
EXE="$BIN/Orthanc.exe"
if [ ! -f "$EXE" ]; then
  echo "未找到 $EXE。请先解压 Orthanc Windows 安装包到 bin/（见 start-orthanc.ps1 头部说明）。" >&2
  exit 1
fi
echo "启动 Orthanc: http://localhost:8042  (DICOMweb /dicom-web/, C-STORE HS_PACS@4242)"
cd "$BIN"
exec ./Orthanc.exe ../orthanc.json