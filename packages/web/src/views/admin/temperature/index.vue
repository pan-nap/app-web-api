<template>
  <div class="h-full overflow-auto bg-gray-100 p-5">
    <div class="mx-auto" style="max-width: 820px">
      <canvas ref="canvasRef" class="block w-full bg-white shadow" style="aspect-ratio: 210 / 297"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { renderTemperatureSheet } from "./renderer";
import { mockSheetData } from "./mock";

const canvasRef = ref<HTMLCanvasElement>();

onMounted(() => {
  if (canvasRef.value) {
    renderTemperatureSheet(canvasRef.value, mockSheetData);
  }
});
</script>
<style scoped></style>
