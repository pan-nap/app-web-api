#!/bin/bash
# 一键下载 TRTC SDK 本地编译依赖
# 用法: bash scripts/init-libs.sh
# 作用: 从 Maven Central 下载 LiteAVSDK_Professional 并提取 classes.jar
#       供本地 HBuilderX 编译时使用（云打包只看 config.json，不受此脚本影响）

AAR_VERSION="13.3.0.20247"
LIBS_DIR="$(cd "$(dirname "$0")/../utssdk/app-android/libs" && pwd)"
AAR_FILE="$LIBS_DIR/LiteAVSDK_Professional-$AAR_VERSION.aar"
JAR_FILE="$LIBS_DIR/classes.jar"
AAR_URL="https://repo1.maven.org/maven2/com/tencent/liteav/LiteAVSDK_Professional/$AAR_VERSION/LiteAVSDK_Professional-$AAR_VERSION.aar"

mkdir -p "$LIBS_DIR"

# 检查是否已有
if [ -f "$JAR_FILE" ]; then
  echo "✅ classes.jar 已存在, 跳过下载"
  exit 0
fi

echo "📦 下载 LiteAVSDK_Professional $AAR_VERSION ..."
curl -L -o "$AAR_FILE" "$AAR_URL"
if [ $? -ne 0 ]; then
  echo "❌ 下载失败"
  exit 1
fi

echo "📂 提取 classes.jar ..."
unzip -o "$AAR_FILE" classes.jar -d "$LIBS_DIR" > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ 提取失败"
  exit 1
fi

echo "✅ 完成: $JAR_FILE"
ls -lh "$JAR_FILE"
