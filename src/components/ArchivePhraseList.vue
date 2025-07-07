<template>
  <div>
    <input v-model="search" placeholder="Kalıp/cümle ara..." class="input mb-4" />
    <div class="grid gap-3">
      <div v-for="phrase in filteredPhrases" :key="phrase.german" class="p-4 rounded bg-gray-100 dark:bg-gray-700 flex flex-col gap-1">
        <div class="font-bold text-blue-700">{{ phrase.german }}</div>
        <div class="text-gray-700 dark:text-gray-200">{{ phrase.meaning }}</div>
        <button @click="$emit('tts', phrase.german)" class="btn w-max mt-1">🔊</button>
      </div>
      <div v-if="!filteredPhrases.length" class="text-gray-400">Sonuç bulunamadı.</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ phrases: Array })
const search = ref('')
const filteredPhrases = computed(() =>
  (props.phrases || []).filter(p =>
    !search.value || p.german.toLowerCase().includes(search.value.toLowerCase()) || p.meaning.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script> 