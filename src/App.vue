<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <main class="flex-1 container mx-auto px-2 py-4">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>
<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script> 