<template>
  <div class="card bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-blue-700 dark:text-yellow-400 mb-2">Mini Quiz</h2>
    <div v-if="loading" class="text-gray-400">Yükleniyor...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="quiz">
      <div v-for="(q, idx) in quiz.questions" :key="idx" class="mb-4">
        <div class="font-medium mb-2">{{ idx + 1 }}. {{ q.question }}</div>
        <div class="flex flex-col gap-2">
          <button v-for="opt in q.options" :key="opt" :class="['btn', 'text-left',
            answered[idx] ? (opt === q.answer ? 'border-green-500 bg-green-50 dark:bg-green-900' : (opt === selected[idx] ? 'border-red-500 bg-red-50 dark:bg-red-900' : '')) : '']"
            :disabled="answered[idx]" @click="select(idx, opt)">
            {{ opt }}
            <span v-if="answered[idx] && opt === q.answer">✅</span>
            <span v-else-if="answered[idx] && opt === selected[idx]">❌</span>
          </button>
        </div>
      </div>
      <div v-if="score !== null" class="mt-2 font-semibold text-blue-700 dark:text-yellow-400">Skorunuz: {{ score }} / {{ quiz.questions.length }}</div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const quiz = ref(null)
const loading = ref(true)
const error = ref('')
const answered = ref([])
const selected = ref([])
const score = ref(null)
onMounted(async () => {
  try {
    const res = await fetch('/data/quizzes.json')
    if (!res.ok) throw new Error('Veri alınamadı')
    const data = await res.json()
    const today = new Date().toISOString().slice(5, 10)
    quiz.value = data.find(q => q.date.slice(5, 10) === today) || data[0]
    answered.value = Array(quiz.value.questions.length).fill(false)
    selected.value = Array(quiz.value.questions.length).fill(null)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
function select(idx, opt) {
  if (answered.value[idx]) return
  selected.value[idx] = opt
  answered.value[idx] = true
  if (answered.value.every(Boolean)) {
    score.value = quiz.value.questions.filter((q, i) => selected.value[i] === q.answer).length
  }
}
</script> 