<template>
  <div>
    <div class="flex flex-col md:flex-row gap-2 mb-4">
      <input v-model="search" placeholder="Dinleme alıştırması ara..." class="input flex-1" />
      <select v-model="level" class="input w-32">
        <option value="">Seviye (Tümü)</option>
        <option value="A1">A1</option>
        <option value="A2">A2</option>
        <option value="B1">B1</option>
      </select>
    </div>
    <div class="grid gap-3">
      <div v-for="listening in filteredListenings" :key="listening.title" class="p-4 rounded bg-gray-100 dark:bg-gray-700 flex flex-col gap-1">
        <div class="font-bold text-blue-700">{{ listening.title }}</div>
        <div class="text-gray-700 dark:text-gray-200">{{ listening.text }}</div>
        <div class="text-xs text-gray-400">Seviye: {{ listening.level }}</div>
        <button v-if="listening.audio" @click="$emit('play', listening.audio)" class="btn w-max mt-1">▶️ Dinle</button>
        <button v-else @click="$emit('tts', listening.text)" class="btn w-max mt-1">🔊 TTS</button>
      </div>
      <div v-if="!filteredListenings.length" class="text-gray-400">Sonuç bulunamadı.</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ listenings: Array })
const search = ref('')
const level = ref('')
const filteredListenings = computed(() =>
  (props.listenings || []).filter(l =>
    (!search.value || l.title.toLowerCase().includes(search.value.toLowerCase()) || l.text.toLowerCase().includes(search.value.toLowerCase())) &&
    (!level.value || l.level === level.value)
  )
)
</script> 