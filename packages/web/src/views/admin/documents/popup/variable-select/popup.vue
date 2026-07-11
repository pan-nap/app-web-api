<template>
  <div class="flex flex-col h-full">
    <!-- 搜索框 -->
    <div class="p-3 border-b border-gray-200">
      <el-input
        v-model="searchText"
        placeholder="搜索变量..."
        prefix-icon="el-icon-search"
        clearable
      />
    </div>

    <!-- 变量分组列表 -->
    <div class="flex-1 overflow-auto p-3">
      <div
        v-for="group in filteredGroups"
        :key="group.groupKey"
        class="mb-4"
      >
        <div class="font-medium text-gray-700 mb-2 px-1">
          {{ group.groupName }}
          <span class="text-sm text-gray-400 ml-2">({{ group.variables.length }})</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="variable in group.variables"
            :key="variable.varKey"
            class="text-left px-3 py-2 rounded border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            :class="{ 'border-blue-400 bg-blue-50': selectedVar?.varKey === variable.varKey }"
            @click="selectVariable(variable)"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-700">{{ variable.varLabel }}</span>
              <span v-if="variable.required" class="text-red-500 text-xs">*</span>
            </div>
            <div class="text-xs text-gray-400 mt-1">{{ variable.varKey }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <footer class="flex items-center justify-end gap-3 px-3 py-3 border-t border-gray-200 bg-gray-50">
      <hs-button @click="close('cancel')">取消</hs-button>
      <bc-button
        type="primary"
        :disabled="!selectedVar"
        @click="confirmSelect"
      >
        插入
      </bc-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { Utils } from "hs-admin-ui"
import { VARIABLE_GROUPS } from "@/types/emr"
import type { VariableDef } from "@/types/emr"

const props = defineProps<{
  close: (data?: "cancel" | VariableDef) => void
}>()

const searchText = ref("")
const selectedVar = ref<VariableDef | null>(null)

const filteredGroups = computed(() => {
  if (!searchText.value.trim()) {
    return VARIABLE_GROUPS
  }
  const keyword = searchText.value.toLowerCase()
  return VARIABLE_GROUPS.map((group) => ({
    ...group,
    variables: group.variables.filter(
      (v) =>
        v.varLabel.toLowerCase().includes(keyword) ||
        v.varKey.toLowerCase().includes(keyword)
    )
  })).filter((group) => group.variables.length > 0)
})

function selectVariable(variable: VariableDef) {
  selectedVar.value = variable
}

function confirmSelect() {
  if (selectedVar.value) {
    props.close(selectedVar.value)
  }
}
</script>
