@echo off
REM Extract TIM SDK classes.jar from AAR for local compilation
REM Usage: double-click or run in cmd

set IM_VERSION=8.7.7201
set LIBS_DIR=%~dp0..\utssdk\app-android\libs
set AAR_FILE=%LIBS_DIR%\imsdk-plus-%IM_VERSION%.aar
set JAR_FILE=%LIBS_DIR%\classes.jar
set AAR_URL=https://repo1.maven.org/maven2/com/tencent/imsdk/imsdk-plus/%IM_VERSION%/imsdk-plus-%IM_VERSION%.aar

if not exist "%LIBS_DIR%" mkdir "%LIBS_DIR%"

if exist "%JAR_FILE%" (
    echo [OK] classes.jar already exists, skipping
    exit /b 0
)

echo [1/3] Downloading imsdk-plus %IM_VERSION% ...
curl -L -o "%AAR_FILE%" "%AAR_URL%"
if %ERRORLEVEL% neq 0 (
    echo [FAILED] Download failed
    exit /b 1
)

echo [2/3] Extracting classes.jar ...
tar -xf "%AAR_FILE%" -C "%LIBS_DIR%" classes.jar 2>nul
if %ERRORLEVEL% neq 0 (
    powershell -Command "Expand-Archive -Path '%AAR_FILE%' -DestinationPath '%LIBS_DIR%' -Force" 2>nul
)

echo [3/3] Extracting native libs ...
if exist "%LIBS_DIR%\jni" (
    xcopy /E /I /Y "%LIBS_DIR%\jni\*" "%LIBS_DIR%" >nul
    rmdir /S /Q "%LIBS_DIR%\jni"
)

if exist "%JAR_FILE%" (
    echo [OK] Done
    exit /b 0
) else (
    echo [FAILED] classes.jar not found after extraction
    exit /b 1
)
