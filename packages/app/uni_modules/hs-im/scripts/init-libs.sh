#!/bin/bash
# One-click download script for Tencent Cloud IM SDK (Android)
# Usage: chmod +x init-im-libs.sh && ./init-im-libs.sh
# Purpose: Download imsdk-plus AAR from Maven Central and extract classes.jar + so libs

set -e

# Version to download (update as needed)
IM_VERSION="8.7.7201"

# Paths
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LIBS_DIR="$SCRIPT_DIR/../utssdk/app-android/libs"
AAR_FILE="$LIBS_DIR/imsdk-plus-$IM_VERSION.aar"
JAR_FILE="$LIBS_DIR/classes.jar"
AAR_URL="https://repo1.maven.org/maven2/com/tencent/imsdk/imsdk-plus/$IM_VERSION/imsdk-plus-$IM_VERSION.aar"

# Check required tools
command -v curl >/dev/null 2>&1 || { echo "[ERROR] curl is required but not installed."; exit 1; }
command -v unzip >/dev/null 2>&1 || { echo "[ERROR] unzip is required but not installed. Install with: apt-get install unzip (Debian) or brew install unzip (macOS)"; exit 1; }

# Create target directory
mkdir -p "$LIBS_DIR"

# Skip if already exists
if [ -f "$JAR_FILE" ]; then
    echo "[OK] classes.jar already exists, skipping download"
    exit 0
fi

# Download AAR
echo "[Downloading] imsdk-plus $IM_VERSION ..."
curl -L -o "$AAR_FILE" "$AAR_URL"
if [ $? -ne 0 ]; then
    echo "[FAILED] Download failed"
    exit 1
fi

# Extract
echo "[Extracting] classes.jar and so libraries ..."
TMP_DIR="$LIBS_DIR/tmp_extract"
mkdir -p "$TMP_DIR"
unzip -q "$AAR_FILE" -d "$TMP_DIR"

# Move classes.jar
if [ -f "$TMP_DIR/classes.jar" ]; then
    mv "$TMP_DIR/classes.jar" "$JAR_FILE"
else
    echo "[FAILED] classes.jar not found in AAR"
    exit 1
fi

# Copy so libraries (if any)
if [ -d "$TMP_DIR/jni" ]; then
    echo "[Copying] so libraries..."
    cp -r "$TMP_DIR/jni"/* "$LIBS_DIR/"
fi

# Cleanup
rm -rf "$TMP_DIR"

# Final check
if [ -f "$JAR_FILE" ]; then
    echo "[OK] Done! classes.jar and so libraries are ready"
    exit 0
else
    echo "[FAILED] Extract failed"
    exit 1
fi