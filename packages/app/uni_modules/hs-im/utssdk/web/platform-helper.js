// platform-helper.js
// 纯 JS 辅助函数，返回 plain JS 对象
// 不经过 UTS 编译，因此没有 UTSJSONObject 包装
// TIM SDK 的 isPlainObject 检查可正常通过

export function createTextMsg(to, conversationType, text) {
  return {
    to: to,
    conversationType: conversationType,
    payload: {
      text: text
    }
  }
}

export function createImageMsg(to, conversationType, file) {
  return {
    to: to,
    conversationType: conversationType,
    payload: {
      file: file
    }
  }
}

export function createVideoMsg(to, conversationType, file, snapshotFile) {
  return {
    to: to,
    conversationType: conversationType,
    payload: {
      file: file,
      snapshotFile: snapshotFile
    }
  }
}

export function createAudioMsg(to, conversationType, file) {
  return {
    to: to,
    conversationType: conversationType,
    payload: {
      file: file
    }
  }
}

export function createCustomMsg(to, conversationType, data, description, extension) {
  return {
    to: to,
    conversationType: conversationType,
    payload: {
      data: data,
      description: description,
      extension: extension
    }
  }
}
