# 本地启动 Orthanc 内核（P2，仅本地测试）。
# 用法（PowerShell）: powershell -ExecutionPolicy Bypass -File start-orthanc.ps1
# 用法（Git Bash） : bash start-orthanc.sh
#
# 启动后:
#   REST / DICOMweb : http://localhost:8042  （DICOMweb 根 /dicom-web/，WADO-URI /wado）
#   DICOM C-STORE SCP: HS_PACS@<本机>:4242  （真实设备可推送影像到此 AE Title / 端口）
#
# 让后端走 Orthanc 内核: packages/backend/.env 设 PACS_BACKEND=orthanc 后重启后端；
#   设 PACS_BACKEND=mini 可回退到 P1 的磁盘+MySQL mini-PACS。
# 灌库: node packages/backend/scripts/ingestDicom.js <dicom目录> http://localhost:3001
#
# 二进制位于 bin/（已 gitignore）。若缺失，从 Orthanc 官方 CDN 下载 Windows 安装包并用
#   innoextract 解压到 bin/（免系统安装）：
#   https://public-files.orthanc.team/tmp-builds/win-installer/OrthancInstaller-Win64-master.exe
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$bin = Join-Path $root "bin"
$exe = Join-Path $bin "Orthanc.exe"
$config = Join-Path $root "orthanc.json"

if (-not (Test-Path $exe)) {
  Write-Error "未找到 $exe。请先解压 Orthanc Windows 安装包到 bin/（见脚本头部说明）。"
}

$listening = Get-NetTCPConnection -LocalPort 8042 -State Listen -ErrorAction SilentlyContinue
if ($listening) {
  Write-Host "Orthanc 已在运行: http://localhost:8042" -ForegroundColor Yellow
  exit 0
}

Write-Host "启动 Orthanc: http://localhost:8042  (DICOMweb /dicom-web/, C-STORE HS_PACS@4242)" -ForegroundColor Cyan
Push-Location $bin
try {
  & $exe $config
} finally {
  Pop-Location
}