<template>
  <div class="card bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-blue-700 dark:text-yellow-400 mb-2">Cümle Analizi</h2>
    <div v-if="!hasSentenceProp">
      <div class="mb-2">
        <input v-model="sentenceLocal" placeholder="Bir Almanca cümle girin veya seçin" class="input w-full" />
        <button @click="analyze" class="btn mt-2">Analiz Et</button>
      </div>
    </div>
    <div v-if="loading" class="flex flex-col gap-2 justify-center py-4">
      <span class="ai-loader flex flex-col items-center gap-2">
        <img src="../../public/assets/loading.gif" alt="Loading Gif">
        <span class="text-blue-400 dark:text-yellow-400 font-semibold">AI düşünüyor...</span>
      </span>
    </div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="result" class="mt-2 prose prose-sm dark:prose-invert max-w-none" v-html="formattedResult"></div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { marked } from 'marked'
const props = defineProps({
  sentence: String,
  autoAnalyze: Boolean
})
const hasSentenceProp = computed(() => typeof props.sentence === 'string' && props.sentence.length > 0)
const sentenceLocal = ref(props.sentence || '')
const result = ref('')
const loading = ref(false)
const error = ref('')

const API_KEY = import.meta.env.VITE_API_KEY

const formattedResult = computed(() => {
  if (!result.value) return ''
  return marked.parse(result.value)
})

async function analyze() {
  const sentenceToAnalyze = hasSentenceProp.value ? props.sentence : sentenceLocal.value
  if (!sentenceToAnalyze) return
  result.value = ''
  error.value = ''
  loading.value = true

  // LocalStorage anahtarı oluştur
  const storageKey = `sentenceAnalysis:${sentenceToAnalyze}`
  // LocalStorage'da kayıtlı veri var mı kontrol et
  const cached = localStorage.getItem(storageKey)
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (parsed && parsed.result && parsed.date) {
        result.value = parsed.result
        loading.value = false
        return
      }
    } catch (e) { /* ignore parse error */ }
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{
          role: 'user',
          content: `Almanca cümleyi çözümle: "${sentenceToAnalyze}"
1. Her kelimeyi ayır ve Türkçesini yaz.
2. Ekleri ve gramer yapılarını açıkla.
3. Varsa tamlama/deyim anlamını belirt.
4. En sonda tam Türkçe çevirisini ver.
Format:
- Kelime: ... (Türkçesi: ...), Ek/Gramer: ...
- ...
- Tamlama/Deyim: ...
- Tam çeviri: ...`
        }]
      })
    })
    const data = await res.json()
    result.value = data.choices?.[0]?.message?.content || 'Yanıt alınamadı.'
    // Sonucu ve tarihi localStorage'a kaydet
    localStorage.setItem(storageKey, JSON.stringify({
      result: result.value,
      date: new Date().toISOString()
    }))
  } catch (e) {
    error.value = 'AI servisine erişilemedi.'
  } finally {
    loading.value = false
  }
}

watch(() => props.sentence, (val) => {
  sentenceLocal.value = val || ''
  if (props.autoAnalyze && val) analyze()
})
onMounted(() => {
  if (props.autoAnalyze && hasSentenceProp.value) analyze()
})
</script>
<style scoped>
.ai-magnifier-glass {
  transform-origin: 75px 19px;
  animation: ai-magnifier-pulse 1.2s infinite cubic-bezier(.4,0,.6,1);
}
@keyframes ai-magnifier-pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.12); }
}
</style> 