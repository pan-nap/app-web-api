<template>
  <div class="flex flex-col h-full">
    <!-- 搜索框 -->
    <div class="p-3 border-b border-gray-200">
      <el-input v-model="searchText" placeholder="搜索术语..." clearable />
    </div>
    <!-- 术语分组列表 -->
    <div class="flex-1 overflow-auto p-3">
      <div
        v-for="group in filteredGroups"
        :key="group.groupName"
        class="mb-4"
      >
        <div class="font-medium text-gray-700 mb-2 px-1">{{ group.groupName }}</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="term in group.terms"
            :key="term"
            class="text-left px-3 py-1.5 rounded border border-gray-200 text-sm text-gray-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            @click="selectTerm(term)"
          >
            {{ term }}
          </button>
        </div>
      </div>
      <div v-if="filteredGroups.length === 0" class="text-center text-gray-400 py-8">
        未找到匹配的术语
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { MEDICAL_TERMS } from "@/types/emr"

const props = defineProps<{
  close: (data?: "cancel" | string) => void
}>()

const searchText = ref("")

const filteredGroups = computed(() => {
  if (!searchText.value.trim()) return MEDICAL_TERMS
  const keyword = searchText.value.toLowerCase()
  return MEDICAL_TERMS
    .map((g) => ({
      ...g,
      terms: g.terms.filter((t) => t.toLowerCase().includes(keyword))
    }))
    .filter((g) => g.terms.length > 0)
})

function selectTerm(term: string): void {
  props.close(term)
}
</script>
