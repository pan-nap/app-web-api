<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ProviderInfo {
  id: string;
  name: string;
  description: string;
  models: string[];
  defaultModel: string;
}

const messages = ref<ChatMessage[]>([]);
const inputContent = ref('');
const isLoading = ref(false);
const currentProvider = ref<ProviderInfo | null>(null);
const errorMessage = ref('');
const chatContainer = ref<HTMLElement | null>(null);

function showError(message: string) {
  errorMessage.value = message;
  setTimeout(() => {
    errorMessage.value = '';
  }, 3000);
}

function sendMessage() {
  if (!inputContent.value.trim() || isLoading.value) return;
  
  const content = inputContent.value.trim();
  inputContent.value = '';
  
  isLoading.value = true;
  
  window.parent.postMessage({
    type: 'sendMessage',
    payload: { content }
  }, '*');
}

function clearChat() {
  window.parent.postMessage({
    type: 'clearChat'
  }, '*');
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

window.addEventListener('message', (event) => {
  const data = event.data;
  
  switch (data.type) {
    case 'messages':
      messages.value = data.payload.messages;
      isLoading.value = false;
      scrollToBottom();
      break;
    case 'streamChunk':
      if (messages.value.length > 0) {
        const lastMessage = messages.value[messages.value.length - 1];
        if (lastMessage.role === 'assistant') {
          lastMessage.content += data.payload.content;
        }
      }
      scrollToBottom();
      break;
    case 'error':
      showError(data.payload.message);
      isLoading.value = false;
      break;
    case 'configChange':
      currentProvider.value = data.payload.provider;
      break;
  }
});

onMounted(() => {
  window.parent.postMessage({ type: 'ready' }, '*');
});
</script>

<template>
  <div class="chat-app">
    <div class="header">
      <span class="header-title">AI智能体</span>
      <span class="header-provider" v-if="currentProvider">
        {{ currentProvider.name }} - {{ currentProvider.defaultModel }}
      </span>
    </div>
    
    <div class="chat-container" ref="chatContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <div class="empty-state-icon">🤖</div>
        <div class="empty-state-text">开始与AI聊天</div>
        <div class="empty-state-text" style="font-size: 12px; margin-top: 8px;">
          支持 OpenAI、Claude、Gemini、豆包
        </div>
      </div>
      
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="message-avatar">
          {{ message.role === 'user' ? '你' : 'AI' }}
        </div>
        <div class="message-content">{{ message.content }}</div>
      </div>
      
      <div v-if="isLoading" class="message assistant">
        <div class="message-avatar">AI</div>
        <div class="message-content">
          <div class="loading">
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
            <span class="loading-dot"></span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="input-container">
      <div class="input-wrapper">
        <input
          class="message-input"
          v-model="inputContent"
          @keydown="handleKeydown"
          :placeholder="isLoading ? 'AI正在思考...' : '输入消息...'"
          :disabled="isLoading"
          type="text"
        />
        <button class="send-button" @click="sendMessage" :disabled="!inputContent.trim() || isLoading">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
        <button class="clear-button" @click="clearChat">清空</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>