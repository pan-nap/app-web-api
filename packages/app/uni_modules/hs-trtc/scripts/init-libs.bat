@echo off
REM 一键下载 TRTC SDK 本地编译依赖（Windows 批处理版）
REM 用法: 双击运行 或 cmd 中执行 init-libs.bat
REM 作用: 从 Maven Central 下载 LiteAVSDK_Professional 并提取 classes.jar

set AAR_VERSION=13.3.0.20247
set LIBS_DIR=%~dp0..\utssdk\app-android\libs
set AAR_FILE=%LIBS_DIR%\LiteAVSDK_Professional-%AAR_VERSION%.aar
set JAR_FILE=%LIBS_DIR%\classes.jar
set AAR_URL=https://repo1.maven.org/maven2/com/tencent/liteav/LiteAVSDK_Professional/%AAR_VERSION%/LiteAVSDK_Professional-%AAR_VERSION%.aar

if not exist "%LIBS_DIR%" mkdir "%LIBS_DIR%"

if exist "%JAR_FILE%" (
    echo [OK] classes.jar already exists, skipping download
    exit /b 0
)

echo [Downloading] LiteAVSDK_Professional %AAR_VERSION% ...
curl -L -o "%AAR_FILE%" "%AAR_URL%"
if %ERRORLEVEL% neq 0 (
    echo [FAILED] Download failed
    exit /b 1
)

echo [Extracting] classes.jar ...
tar -xf "%AAR_FILE%" -C "%LIBS_DIR%" classes.jar 2>nul
if %ERRORLEVEL% neq 0 (
    REM fallback: use unzip if tar not available
    powershell -Command "Expand-Archive -Path '%AAR_FILE%' -DestinationPath '%LIBS_DIR%' -Force" 2>nul
)

if exist "%JAR_FILE%" (
    echo [OK] Done! classes.jar ready
    exit /b 0
) else (
    echo [FAILED] Extract failed
    exit /b 1
)
