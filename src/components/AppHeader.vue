<template>
  <header class="flex items-center gap-2 p-2 sm:gap-4 sm:p-4 bg-white dark:bg-gray-900 shadow relative">
    <img src="/assets/logo.svg" alt="Logo" class="w-8 h-8 sm:w-10 sm:h-10" />
    <h1 class="text-lg sm:text-2xl font-bold text-blue-700 dark:text-yellow-400">Almanca Öğren</h1>
    
    <button @click="toggleDark" class="ml-2 sm:ml-4">
      🌙
    </button>
  </header>
</template>
<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
function toggleDark() {
  document.documentElement.classList.toggle('dark')
}
</script>
<style scoped>
nav {
  transition: transform 0.2s;
}
</style> 