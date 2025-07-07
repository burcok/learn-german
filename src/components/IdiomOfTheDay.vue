<template>
  <div class="card bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-blue-700 dark:text-yellow-400 mb-2">Günün Deyimi</h2>
    <div v-if="loading" class="text-gray-400">Yükleniyor...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="idiom">
      <div class="font-bold text-blue-700 text-lg">{{ idiom.german }}</div>
      <div class="text-gray-700 dark:text-gray-200">{{ idiom.meaning }}</div>
      <div class="italic text-gray-500">"{{ idiom.example }}"</div>
      <button @click="speak(idiom.german)" class="btn mt-2">🔊 Dinle</button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const idiom = ref(null)
const loading = ref(true)
const error = ref('')
onMounted(async () => {
  try {
    const res = await fetch('/data/idioms.json')
    if (!res.ok) throw new Error('Veri alınamadı')
    const data = await res.json()
    const today = new Date().toISOString().slice(5, 10)
    idiom.value = data.find(i => i.date.slice(5, 10) === today) || data[0]
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
function speak(text) {
  const utter = new window.SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  window.speechSynthesis.speak(utter)
}
</script> 