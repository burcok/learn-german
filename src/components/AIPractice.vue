<template>
  <div class="card bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-blue-700 dark:text-yellow-400 mb-2">Yapay Zeka ile Alıştırma</h2>
    <input v-model="prompt" placeholder="Bir kelime veya konu girin" class="input mb-2" />
    <button @click="askAI" class="btn">Cümle Üret</button>
    <div v-if="loading" class="text-gray-400">Yükleniyor...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="result" class="mt-2 whitespace-pre-line">{{ result }}</div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const prompt = ref('')
const result = ref('')
const loading = ref(false)
const error = ref('')

const OPENAI_API_KEY = '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'

async function askAI() {
  if (!prompt.value) return
  result.value = ''
  error.value = ''
  loading.value = true
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [{ role: 'user', content: `"${prompt.value}" cümlesini incele. En doğru şekilde almanca bir örnek cümle nasıl oluşturulur anlat ve gerekirse doğru bir şekilde farklı bir cümle yaz. Bir cümle değil ve bir konu ise bu konuda detaylı bir örnek olabilecek cümle oluştur, ardından detaylı bir şekilde anlat.` }]
      })
    })
    const data = await res.json()
    result.value = data.choices?.[0]?.message?.content || 'Yanıt alınamadı.'
  } catch (e) {
    error.value = 'AI servisine erişilemedi.'
  } finally {
    loading.value = false
  }
}
</script> 