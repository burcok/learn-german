<template>
  <div>
    <input v-model="search" placeholder="Deyim ara..." class="input mb-4" />
    <div class="grid gap-3">
      <div v-for="idiom in filteredIdioms" :key="idiom.german" class="p-4 rounded bg-gray-100 dark:bg-gray-700 flex flex-col gap-1">
        <div class="font-bold text-blue-700">{{ idiom.german }}</div>
        <div class="text-gray-700 dark:text-gray-200">{{ idiom.meaning }}</div>
        <div class="italic text-gray-500">"{{ idiom.example }}"</div>
        <button @click="$emit('tts', idiom.german)" class="btn w-max mt-1">🔊</button>
      </div>
      <div v-if="!filteredIdioms.length" class="text-gray-400">Sonuç bulunamadı.</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ idioms: Array })
const search = ref('')
const filteredIdioms = computed(() =>
  (props.idioms || []).filter(i =>
    !search.value || i.german.toLowerCase().includes(search.value.toLowerCase()) || i.meaning.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script> 