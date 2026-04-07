#!/bin/bash

# 平安证券体验报告打包脚本
# 用法: ./package.sh

# 创建 output 目录
mkdir -p output

# 生成时间戳 (格式: YYYYMMDD-HHMMSS)
TIMESTAMP=$(date "+%Y%m%d-%H%M%S")

# 打包文件名 (包含报告人信息)
REPORTER="小貘"
ZIP_FILENAME="平安证券体验报告_${REPORTER}_${TIMESTAMP}.zip"

# 打包文件（排除 md 文件、git、配置文件等）
zip -r "output/${ZIP_FILENAME}" \
    index.html \
    css \
    js \
    imgs \
    -x "*.DS_Store" \
    -x "*.git*" \
    -x "*.omc*" \
    -x ".claude*" \
    -x "*.md"

# 检查打包是否成功
if [ -f "output/${ZIP_FILENAME}" ]; then
    echo "✅ 打包成功!"
    echo "📦 文件: output/${ZIP_FILENAME}"
    echo "📊 大小: $(du -h "output/${ZIP_FILENAME}" | cut -f1)"
else
    echo "❌ 打包失败!"
    exit 1
fi
