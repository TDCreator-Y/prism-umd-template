<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-8 text-gray-800">
        Theme Switching Test
      </h1>
      
      <div class="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">
          External Control Panel
        </h2>
        <div class="flex items-center gap-4">
          <button 
            class="px-4 py-2 rounded transition-colors" 
            :class="currentTheme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            @click="setTheme('light')"
          >
            Light Mode
          </button>
          <button 
            class="px-4 py-2 rounded transition-colors" 
            :class="currentTheme === 'dark' ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            @click="setTheme('dark')"
          >
            Dark Mode
          </button>
          <span class="ml-auto text-sm text-gray-500">
            Current State: <span class="font-mono font-bold">{{ currentTheme }}</span>
          </span>
        </div>
      </div>

      <ThemeSwitchTest 
        :theme="currentTheme" 
        @toggle-theme="toggleTheme"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeSwitchTest from '@/build/components/ThemeSwitchTest.vue'

const currentTheme = ref<'light' | 'dark'>('light')

const setTheme = (theme: 'light' | 'dark') => {
  currentTheme.value = theme
}

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}
</script>
