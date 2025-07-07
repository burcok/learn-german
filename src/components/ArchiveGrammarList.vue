<template>
  <div>
    <input v-model="search" placeholder="Gramer konusu ara..." class="input mb-4" />
    <div class="grid gap-3">
      <div v-for="tip in filteredTips" :key="tip.title" class="p-4 rounded bg-gray-100 dark:bg-gray-700 flex flex-col gap-1">
        <div class="font-bold text-blue-700">{{ tip.title }}</div>
        <div class="text-gray-700 dark:text-gray-200">{{ tip.explanation }}</div>
        <div class="italic text-gray-500">Örnek: "{{ tip.example }}"</div>
      </div>
      <div v-if="!filteredTips.length" class="text-gray-400">Sonuç bulunamadı.</div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ tips: Array })
const search = ref('')
const filteredTips = computed(() =>
  (props.tips || []).filter(t =>
    !search.value || t.title.toLowerCase().includes(search.value.toLowerCase()) || t.explanation.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script> 