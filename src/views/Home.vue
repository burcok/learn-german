<template>
  <div class="flex flex-col gap-8">
    <!-- Günün Bileşenleri ve AIPractice -->
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <WordOfTheDay />
      <IdiomOfTheDay />
      <GrammarTip />
      <MiniQuiz />
      <AIPractice />
      <NotificationSettings />
    </div>

    <!-- Sekmeli Arşivler -->
    <div class="mt-8">
      <div class="flex flex-wrap gap-2 mb-4">
        <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
          :class="['px-4 py-2 rounded-t font-semibold', activeTab === tab.key ? 'bg-blue-700 text-white dark:bg-yellow-400 dark:text-gray-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200']">
          {{ tab.label }}
        </button>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-b-xl shadow p-6">
        <div v-if="activeTab === 'words'">
          <ArchiveWordList :words="words" @tts="speak" />
        </div>
        <div v-else-if="activeTab === 'idioms'">
          <ArchiveIdiomList :idioms="idioms" @tts="speak" />
        </div>
        <div v-else-if="activeTab === 'grammar'">
          <ArchiveGrammarList :tips="tips" />
        </div>
        <div v-else-if="activeTab === 'readings'">
          <div class="grid gap-8">
            <div v-for="reading in readings" :key="reading.title" class="p-4 rounded bg-gray-100 dark:bg-gray-700 flex flex-col gap-2">
              <div class="font-bold text-blue-700">{{ reading.title }}</div>
              <div class="text-gray-700 dark:text-gray-200">{{ reading.text }}</div>
              <SentenceAnalysis :sentence="reading.text" :auto-analyze="true" />
            </div>
          </div>
        </div>
        <div v-else-if="activeTab === 'dialogs'">
          <ArchiveDialogList :dialogs="dialogs" @tts="speak" />
        </div>
        <div v-else-if="activeTab === 'listenings'">
          <ArchiveListeningList :listenings="listenings" @tts="tts" @play="playAudio" />
          <audio ref="audioRef" class="hidden" />
        </div>
        <div v-else-if="activeTab === 'phrases'">
          <ArchivePhraseList :phrases="phrases" @tts="speak" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import WordOfTheDay from '../components/WordOfTheDay.vue'
import IdiomOfTheDay from '../components/IdiomOfTheDay.vue'
import GrammarTip from '../components/GrammarTip.vue'
import MiniQuiz from '../components/MiniQuiz.vue'
import AIPractice from '../components/AIPractice.vue'
import NotificationSettings from '../components/NotificationSettings.vue'
import ArchiveWordList from '../components/ArchiveWordList.vue'
import ArchiveIdiomList from '../components/ArchiveIdiomList.vue'
import ArchiveGrammarList from '../components/ArchiveGrammarList.vue'
import ArchiveDialogList from '../components/ArchiveDialogList.vue'
import ArchiveListeningList from '../components/ArchiveListeningList.vue'
import ArchivePhraseList from '../components/ArchivePhraseList.vue'
import SentenceAnalysis from '../components/SentenceAnalysis.vue'

const words = ref([])
const idioms = ref([])
const tips = ref([])
const dialogs = ref([])
const listenings = ref([])
const phrases = ref([])
const readings = ref([])
const audioRef = ref(null)

const tabs = [
  { key: 'words', label: 'Kelime Arşivi' },
  { key: 'idioms', label: 'Deyim Arşivi' },
  { key: 'grammar', label: 'Gramer Arşivi' },
  { key: 'readings', label: 'Okuma Parçaları' },
  { key: 'dialogs', label: 'Diyalog Arşivi' },
  { key: 'listenings', label: 'Dinleme Alıştırmaları' },
  { key: 'phrases', label: 'Sık Kullanılan Kalıplar' },
]
const activeTab = ref('words')

onMounted(async () => {
  words.value = await (await fetch('/data/words.json')).json()
  idioms.value = await (await fetch('/data/idioms.json')).json()
  tips.value = await (await fetch('/data/grammar.json')).json()
  dialogs.value = await (await fetch('/data/dialogs.json')).json()
  listenings.value = await (await fetch('/data/listenings.json')).json()
  phrases.value = await (await fetch('/data/phrases.json')).json()
  readings.value = await (await fetch('/data/readings.json')).json()
})
function speak(text) {
  const utter = new window.SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  window.speechSynthesis.speak(utter)
}
function tts(text) {
  const utter = new window.SpeechSynthesisUtterance(text)
  utter.lang = 'de-DE'
  window.speechSynthesis.speak(utter)
}
function playAudio(url) {
  if (audioRef.value) {
    audioRef.value.src = url
    audioRef.value.play()
  }
}
</script> 