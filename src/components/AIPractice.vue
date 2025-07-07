<template>
  <div class="card bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-blue-700 dark:text-yellow-400 mb-2">Yapay Zeka ile Alıştırma</h2>
    <input v-model="prompt" placeholder="Bir kelime veya konu girin" class="input mb-2" />
    <button @click="askAI" class="btn">Cümle Üret</button>
    <div v-if="loading" class="text-gray-400">Yükleniyor...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="result" class="mt-2 whitespace-pre-line">{{ result }}</div>
    <div v-if="recentSentences.length > 0" class="mt-2">
      <h3 class="text-lg font-semibold text-blue-700 dark:text-yellow-400 mb-4">Son Arananlar:</h3>
      <div v-for="sentence in recentSentences" :key="sentence" class="mb-2">
        <button @click="prompt = sentence" class="border-b border-gray-300 p-2 mb-2">{{ sentence }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const prompt = ref('')
const result = ref('')
const loading = ref(false)
const error = ref('')
const recentSentences = ref(JSON.parse(localStorage.getItem('recent-sentences') || '[]'))

const API_KEY = import.meta.env.VITE_API_KEY

async function askAI() {
  if (!prompt.value) return
  result.value = ''
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [{ role: 'user', content: `"${prompt.value}" cümlesini incele. En doğru şekilde almanca bir örnek cümle nasıl oluşturulur anlat ve gerekirse doğru bir şekilde farklı bir cümle yaz. Bir cümle değil ve bir konu ise bu konuda detaylı bir örnek olabilecek cümle oluştur, ardından detaylı bir şekilde anlat.` }]
      })
    })
    const data = await res.json()
    result.value = data.choices?.[0]?.message?.content

    if (!result.value) {
      error.value = data.error.message
    } else {
      localStorage.setItem('recent-sentences', JSON.stringify([...recentSentences, prompt.value]))
    }

  } catch (e) {
    error.value = 'AI servisine erişilemedi.'
  } finally {
    loading.value = false
  }
}
</script> 