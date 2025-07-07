<template>
  <div>
    <div class="flex flex-col md:flex-row gap-2 mb-4">
      <input v-model="search" placeholder="Kelime ara..." class="input flex-1" />
      <select v-model="level" class="input w-32">
        <option value="">Seviye (Tümü)</option>
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="B1">B1</option>
      </select>
    </div>
    <div class="grid gap-3">
      <div v-for="word in filteredWords" :key="word.german" class="p-4 rounded bg-gray-100 dark:bg-gray-700 flex flex-col gap-1">
        <div class="font-bold text-blue-700">{{ word.german }}</div>
        <div class="text-gray-700 dark:text-gray-200">{{ word.meaning }}</div>
        <div class="italic text-gray-500">"{{ word.example }}"</div>
        <div class="text-xs text-gray-400">Seviye: {{ word.level }}</div>
        <button @click="$emit('tts', word.german)" class="btn w-max mt-1">🔊</button>
      </div>
      <div v-if="!filteredWords.length" class="text-gray-400">Sonuç bulunamadı.</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ words: Array })
const search = ref('')
const level = ref('')
const filteredWords = computed(() =>
  (props.words || []).filter(w =>
    (!search.value || w.german.toLowerCase().includes(search.value.toLowerCase()) || w.meaning.toLowerCase().includes(search.value.toLowerCase())) &&
    (!level.value || w.level === level.value)
  )
)
</script> 