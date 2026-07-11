<template>
  <div class="upload-page">
    <el-card class="upload-card" title="文件上传">
      <!-- 上传区域 -->
      <div
        class="upload-area"
        :class="{ 'is-dragover': isDragover }"
        @dragover.prevent="isDragover = true"
        @dragleave="isDragover = false"
        @drop.prevent="handleDrop"
      >
        <div class="upload-icon">
          <bc-icon name="el-Upload" size="48" color="#409eff" />
        </div>
        <p class="upload-text">点击或拖拽文件到此处上传</p>
        <p class="upload-hint">支持单个或批量上传，支持压缩包、图片、PDF、视频、音频、Excel等格式</p>

        <el-button class="upload-btn" type="primary" size="large" @click="triggerFileInput">
          <bc-icon name="el-Upload" size="18" />
          选择文件
        </el-button>

        <input ref="fileInput" type="file" multiple class="file-input" @change="handleFileChange" />
      </div>

      <!-- 已选择文件列表 -->
      <div v-if="selectedFiles.length > 0" class="file-list">
        <h3 class="list-title">
          <bc-icon name="el-Files" size="18" color="#409eff" />
          已选择文件 ({{ selectedFiles.length }})
        </h3>
        <el-table :data="selectedFiles" border>
          <el-table-column prop="name" label="文件名" min-width="300">
            <template #default="{ row }">
              <bc-icon :name="getFileIconName(row.type)" class="file-icon" :color="getFileIconColor(row.type)" />
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="大小" width="120">
            <template #default="{ row }">{{ formatSize(row.size) }}</template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="120">
            <template #default="{ row }">{{ getFileType(row.type) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row, $index }">
              <el-button type="text" danger @click="removeFile($index)">
                <bc-icon name="el-Delete" size="16" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 上传按钮 -->
        <div class="upload-actions">
          <el-button type="default" @click="clearFiles">
            <bc-icon name="el-RefreshLeft" size="16" />
            清空全部
          </el-button>
          <bc-button type="primary" @click="uploadFiles" :disabled="uploading">
            <bc-icon name="el-Upload" size="18" />
            {{ uploading ? "上传中..." : "开始上传" }}
          </bc-button>
        </div>
      </div>

      <!-- 上传进度 -->
      <div v-if="uploading" class="upload-progress">
        <el-progress :percentage="uploadProgress" :status="uploadProgress === 100 ? 'success' : 'active'" show-text />
      </div>

      <!-- 上传结果 -->
      <div v-if="uploadResults.length > 0" class="upload-results">
        <h3 class="result-title">
          <bc-icon name="el-CheckCircle" size="18" color="#67c23a" />
          上传结果
        </h3>
        <el-table :data="uploadResults" border>
          <el-table-column prop="name" label="文件名" min-width="300" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="row.success ? 'success' : 'danger'">
                {{ row.success ? "成功" : "失败" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="message" label="提示" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTemplateRef } from "vue";
import { Utils, HsMessage } from "hs-admin-ui";

const fileInput = useTemplateRef<HTMLInputElement>("fileInput");
const isDragover = ref(false);
const uploading = ref(false);
const uploadProgress = ref(0);

interface FileItem {
  name: string;
  size: number;
  type: string;
  file: File;
}

interface UploadResult {
  name: string;
  success: boolean;
  message: string;
  url?: string;
}

const selectedFiles = reactive<FileItem[]>([]);
const uploadResults = reactive<UploadResult[]>([]);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    addFiles(Array.from(files));
  }
};

const handleDrop = (event: DragEvent) => {
  isDragover.value = false;
  const files = event.dataTransfer?.files;
  if (files) {
    addFiles(Array.from(files));
  }
};

const addFiles = (files: File[]) => {
  files.forEach((file) => {
    if (!selectedFiles.some((f) => f.name === file.name && f.size === file.size)) {
      selectedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    }
  });
  uploadResults.length = 0;
};

const removeFile = (index: number) => {
  selectedFiles.splice(index, 1);
};

const clearFiles = () => {
  selectedFiles.length = 0;
  uploadResults.length = 0;
  uploadProgress.value = 0;
};

const formatSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIconName = (type: string): string => {
  if (type.startsWith("image/")) return "el-FileImage";
  if (type.startsWith("video/")) return "el-FileVideo";
  if (type.startsWith("audio/")) return "el-FileAudio";
  if (type.includes("pdf")) return "el-FileText";
  if (type.includes("excel") || type.includes("spreadsheet")) return "el-FileSpreadsheet";
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return "el-FileZip";
  return "el-FileText";
};

const getFileIconColor = (type: string): string => {
  if (type.startsWith("image/")) return "#67c23a";
  if (type.startsWith("video/")) return "#e6a23c";
  if (type.startsWith("audio/")) return "#909399";
  if (type.includes("pdf")) return "#f56c6c";
  if (type.includes("excel") || type.includes("spreadsheet")) return "#67c23a";
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return "#409eff";
  return "#909399";
};

const getFileType = (type: string): string => {
  if (type.startsWith("image/")) return "图片";
  if (type.startsWith("video/")) return "视频";
  if (type.startsWith("audio/")) return "音频";
  if (type.includes("pdf")) return "PDF";
  if (type.includes("excel") || type.includes("spreadsheet")) return "Excel";
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return "压缩包";
  return "其他";
};

const uploadFiles = async () => {
  if (selectedFiles.length === 0) {
    HsMessage.warning("请先选择文件");
    return;
  }

  const token = await Utils.systemStore.get("userInfo").then((r) => r?.access_token);
  if (!token) {
    HsMessage.error("未登录，请先登录");
    return;
  }

  uploading.value = true;
  uploadProgress.value = 0;
  uploadResults.length = 0;

  const url = selectedFiles.length === 1 ? "http://localhost:3001/upload" : "http://localhost:3001/upload/batch";

  const formData = new FormData();
  formData.append("path", "images");
  selectedFiles.forEach((item, index) => {
    formData.append(selectedFiles.length === 1 ? "file" : "files", item.file, item.name);
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        authorization: "Bearer " + token
      }
    });

    const data = await response.json();

    if (data.code === 1) {
      if (selectedFiles.length === 1) {
        uploadResults.push({
          name: data.data.filename,
          success: true,
          message: data.msg,
          url: data.data.url
        });
      } else {
        data.data.files.forEach((file: UploadResult) => {
          uploadResults.push({
            name: file.filename,
            success: true,
            message: "上传成功",
            url: file.url
          });
        });
      }
      HsMessage.success(data.msg || "上传成功");
    } else {
      uploadResults.push({
        name: "批量上传",
        success: false,
        message: data.msg || "上传失败"
      });
      HsMessage.error(data.msg || "上传失败");
    }
  } catch (error) {
    uploadResults.push({
      name: "上传失败",
      success: false,
      message: "网络错误，请稍后重试"
    });
    HsMessage.error("上传失败，请稍后重试");
  } finally {
    uploading.value = false;
    uploadProgress.value = 100;
  }
};
</script>

<style scoped>
.upload-page {
  padding: 20px;
  min-height: 100vh;
  background: #f5f7fa;
}

.upload-card {
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #409eff;
  background: #f0f5ff;
}

.upload-area.is-dragover {
  border-color: #409eff;
  background: #e6f7ff;
  transform: scale(1.02);
}

.upload-icon {
  margin-bottom: 16px;
}

.upload-text {
  font-size: 18px;
  color: #606266;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 14px;
  color: #909399;
  margin-bottom: 24px;
}

.upload-btn {
  margin-top: 8px;
}

.file-input {
  display: none;
}

.file-list {
  margin-top: 24px;
}

.list-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-icon {
  margin-right: 8px;
  font-size: 16px;
}

.upload-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}

.upload-progress {
  margin-top: 20px;
}

.upload-results {
  margin-top: 24px;
}

.result-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-table) {
  margin-top: 0;
}

:deep(.el-progress__text) {
  font-size: 14px;
}
</style>
