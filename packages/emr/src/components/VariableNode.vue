<template>
  <span
    class="emr-variable"
    :class="{
      'emr-variable-filled': hasValue,
      'emr-variable-empty': !hasValue,
      'emr-variable-select': widgetType === 'select'
    }"
    contenteditable="false"
    @click="handleClick"
  >
    {{ displayValue }}
    <span v-if="widgetType === 'select' && options.length > 0" class="emr-variable-arrow">▼</span>
  </span>

  <Teleport to="body">
    <div
      v-if="showDropdown && widgetType === 'select' && options.length > 0"
      class="emr-dropdown"
      @click.self="showDropdown = false"
    >
      <div class="emr-dropdown-content" ref="dropdownContent">
        <div
          v-for="option in options"
          :key="option.value"
          class="emr-dropdown-item"
          :class="{ 'emr-dropdown-item-selected': String(option.value) === String(extensionValue) }"
          @click="handleSelect(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { NodeViewProps } from "@tiptap/vue-3";

const props = defineProps<NodeViewProps>();

const showDropdown = ref(false);
const dropdownContent = ref<HTMLElement | null>(null);

const attrs = props.node.attrs as any;
const { refKey, widgetName, widgetType, extensionValue, options, placeholder } = attrs;

const hasValue = computed(() => !!extensionValue);

const displayValue = computed(() => {
  let value = extensionValue;
  
  if (widgetType === "select" && options && Array.isArray(options)) {
    const option = options.find((opt: any) => String(opt.value) === String(extensionValue));
    if (option) {
      value = option.label;
    }
  }
  
  if (!value) {
    value = placeholder || widgetName || refKey;
  }
  
  return value;
});

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  if (widgetType === "select" && options && options.length > 0) {
    showDropdown.value = !showDropdown.value;
    
    if (showDropdown.value) {
      setTimeout(() => {
        if (dropdownContent.value) {
          const span = e.currentTarget as HTMLElement;
          const rect = span.getBoundingClientRect();
          dropdownContent.value.style.top = `${rect.bottom}px`;
          dropdownContent.value.style.left = `${rect.left}px`;
        }
      }, 0);
    }
  }
};

const handleSelect = (option: { value: string; label: string }) => {
  props.updateAttributes({ extensionValue: String(option.value) });
  showDropdown.value = false;
};

const handleDocumentClick = () => {
  showDropdown.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<style scoped>
.emr-variable {
  display: inline;
  text-align: center;
  padding: 0 4px;
  border-bottom: 1px solid #000;
  cursor: pointer;
  line-height: inherit;
}

.emr-variable-filled {
  color: #000;
}

.emr-variable-empty {
  color: #7fbdff;
  background: rgba(184, 218, 255, 0.23);
}

.emr-variable-select {
  padding-right: 20px;
  position: relative;
}

.emr-variable-arrow {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #999;
}

.emr-dropdown {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.emr-dropdown-content {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  max-height: 300px;
  overflow-y: auto;
}

.emr-dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.emr-dropdown-item:hover {
  background-color: #f5f5f5;
}

.emr-dropdown-item-selected {
  background-color: #e0f2fe;
  color: #0369a1;
}
</style>
