<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 flex flex-col items-center justify-center p-6">
      <div class="text-sm text-gray-600 mb-4">选择表格大小</div>
      <!-- 行列选择器 -->
      <div
        class="grid gap-1 mb-4"
        :style="{ gridTemplateColumns: `repeat(${maxCols}, 24px)` }"
      >
        <div
          v-for="cell in cells"
          :key="cell.key"
          class="w-6 h-6 rounded-sm cursor-pointer border"
          :class="cell.active ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'"
          @mouseenter="onHover(cell.row, cell.col)"
          @click="selectSize(cell.row, cell.col)"
        />
      </div>
      <div class="text-sm text-gray-500">{{ selectedLabel }}</div>
    </div>
    <footer class="flex items-center justify-end gap-3 px-3 py-3 border-t border-gray-200 bg-gray-50">
      <hs-button @click="close('cancel')">取消</hs-button>
      <bc-button type="primary" :disabled="!selectedRows" @click="confirm">插入</bc-button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"

const props = defineProps<{
  close: (data?: "cancel" | { rows: number; cols: number }) => void
}>()

const maxRows = 8
const maxCols = 8
const hoverRow = ref(0)
const hoverCol = ref(0)
const selectedRows = ref(0)
const selectedCols = ref(0)

const cells = computed(() => {
  const result: { key: string; row: number; col: number; active: boolean }[] = []
  const hr = selectedRows.value || hoverRow.value
  const hc = selectedCols.value || hoverCol.value
  for (let r = 1; r <= maxRows; r++) {
    for (let c = 1; c <= maxCols; c++) {
      result.push({
        key: `${r}-${c}`,
        row: r,
        col: c,
        active: r <= hr && c <= hc
      })
    }
  }
  return result
})

function onHover(r: number, c: number): void {
  hoverRow.value = r
  hoverCol.value = c
}

function selectSize(r: number, c: number): void {
  selectedRows.value = r
  selectedCols.value = c
}

const selectedLabel = computed(() => {
  if (selectedRows.value) {
    return `${selectedRows.value} 行 × ${selectedCols.value} 列`
  }
  if (hoverRow.value) {
    return `${hoverRow.value} 行 × ${hoverCol.value} 列`
  }
  return "请选择"
})

function confirm(): void {
  if (selectedRows.value) {
    props.close({ rows: selectedRows.value, cols: selectedCols.value })
  }
}
</script>
