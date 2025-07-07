<template>
  <div>
    <div class="flex flex-col md:flex-row gap-2 mb-4">
      <input v-model="search" placeholder="Okuma parçası ara..." class="input flex-1" />
      <select v-model="level" class="input w-32">
        <option value="">Seviye (Tümü)</option>
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="B1">B1</option>
      </select>
    </div>
    <div class="grid gap-3">
      <div v-for="reading in filteredReadings" :key="reading.title" class="p-4 rounded bg-gray-100 dark:bg-gray-700 flex flex-col gap-1">
        <div class="font-bold text-blue-700">{{ reading.title }}</div>
        <div class="text-gray-700 dark:text-gray-200">{{ reading.text }}</div>
        <div class="text-xs text-gray-400">Seviye: {{ reading.level }}</div>
        <button @click="$emit('tts', reading.text)" class="btn w-max mt-1">🔊</button>
      </div>
      <div v-if="!filteredReadings.length" class="text-gray-400">Sonuç bulunamadı.</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ readings: Array })
const search = ref('')
const level = ref('')
const filteredReadings = computed(() =>
  (props.readings || []).filter(r =>
    (!search.value || r.title.toLowerCase().includes(search.value.toLowerCase()) || r.text.toLowerCase().includes(search.value.toLowerCase())) &&
    (!level.value || r.level === level.value)
  )
)
</script> 