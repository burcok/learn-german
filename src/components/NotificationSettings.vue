<template>
  <div class="card bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-2">
    <h2 class="text-lg font-semibold text-blue-700 dark:text-yellow-400 mb-2">Bildirim Ayarları</h2>
    <div class="flex flex-col gap-2 mb-2">  
      <span>Sabah</span>
      <input type="time" v-model="morning" class="input" /> 
      <span>Öğlen</span>
      <input type="time" v-model="noon" class="input" /> 
      <span>Akşam</span>
      <input type="time" v-model="evening" class="input" />   
    </div>
    <button @click="save" class="btn">Kaydet</button>
    <div v-if="saved" class="text-green-600 mt-2">Kaydedildi!</div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const morning = ref('09:00')
const noon = ref('13:00')
const evening = ref('18:00')
const saved = ref(false)
let notifTimers = []

async function getRandomWord() {
  const res = await fetch('/data/words.json')
  const words = await res.json()
  const idx = Math.floor(Math.random() * words.length)
  return words[idx]
}

function askNotificationPermission() {
  if (Notification.permission === 'default') {
    Notification.requestPermission()
  }
}

function clearTimers() {
  notifTimers.forEach(id => clearTimeout(id))
  notifTimers = []
}

function scheduleNotifications() {
  clearTimers()
  const times = [morning.value, noon.value, evening.value]
  times.forEach(timeStr => {
    if (!timeStr) return
    const [h, m] = timeStr.split(':').map(Number)
    const now = new Date()
    const target = new Date()
    target.setHours(h, m, 0, 0)
    if (target < now) target.setDate(target.getDate() + 1)
    const ms = target - now
    const id = setTimeout(async () => {
      const word = await getRandomWord()
      sendWordNotification(word)
      // Sonraki gün için tekrar kur
      scheduleNotifications()
    }, ms)
    notifTimers.push(id)
  })
}

function sendWordNotification(word) {
  if (Notification.permission !== 'granted') return
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(
        `Kelime: ${word.german}`,
        {
          body: `Anlamı: ${word.meaning}`,
          icon: '/assets/logo.svg',
          badge: '/assets/logo.svg',
          data: '/words'
        }
      )
    })
  } else {
    // Fallback
    new Notification(`Kelime: ${word.german}`, { body: `Anlamı: ${word.meaning}` })
  }
}

function save() {
  localStorage.setItem('notifTimes', JSON.stringify({ morning: morning.value, noon: noon.value, evening: evening.value }))
  saved.value = true
  setTimeout(() => saved.value = false, 2000)
  askNotificationPermission()
  scheduleNotifications()
}

onMounted(() => {
  askNotificationPermission()
  const savedTimes = localStorage.getItem('notifTimes')
  if (savedTimes) {
    const t = JSON.parse(savedTimes)
    morning.value = t.morning
    noon.value = t.noon
    evening.value = t.evening
  }
  scheduleNotifications()
})
</script> 