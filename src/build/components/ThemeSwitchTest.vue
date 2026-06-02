<template>
  <div
    :class="{ 'dark': isDark }"
    class="w-full transition-colors duration-300"
  >
    <div class="bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <i class="fas fa-palette text-indigo-500" />
          <span>Theme Switch Test Module</span>
        </h2>
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-500 dark:text-slate-400">Current Theme:</span>
          <span
            class="px-2 py-1 text-xs font-mono rounded border" 
            :class="isDark ? 'bg-slate-800 border-slate-700 text-yellow-400' : 'bg-slate-100 border-slate-200 text-slate-600'"
          >
            {{ theme }}
          </span>
        </div>
      </div>
      
      <p class="mb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
        This module demonstrates theme switching capabilities using pure Tailwind CSS. 
        The theme state is controlled externally via props, ensuring seamless integration with the parent application's state management.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Card 1: Standard -->
        <div class="p-5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm mb-3">
            <i class="fas fa-cube text-slate-400 dark:text-slate-500" />
          </div>
          <h3 class="font-semibold mb-2 text-slate-800 dark:text-slate-100">
            Standard Card
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Adapts to the base color scheme defined in the configuration.
          </p>
        </div>
        
        <!-- Card 2: Accent (Blue) -->
        <div class="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50 hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center shadow-sm mb-3">
            <i class="fas fa-layer-group text-blue-500 dark:text-blue-300" />
          </div>
          <h3 class="font-semibold mb-2 text-blue-800 dark:text-blue-100">
            Accent Card
          </h3>
          <p class="text-sm text-blue-600 dark:text-blue-300">
            Uses semantic colors for emphasis and highlights.
          </p>
        </div>

        <!-- Card 3: Success (Green) -->
        <div class="p-5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50 hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center shadow-sm mb-3">
            <i class="fas fa-check-circle text-emerald-500 dark:text-emerald-300" />
          </div>
          <h3 class="font-semibold mb-2 text-emerald-800 dark:text-emerald-100">
            Status Card
          </h3>
          <p class="text-sm text-emerald-600 dark:text-emerald-300">
            Demonstrates state-based styling in different modes.
          </p>
        </div>
      </div>
      
      <div class="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
        <div class="text-sm text-slate-500 dark:text-slate-400">
          <i class="fas fa-info-circle mr-1" />
          Controlled by parent component
        </div>
        <button 
          class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:ring-4 focus:ring-indigo-500/30 flex items-center gap-2"
          @click="$emit('toggle-theme')"
        >
          <i
            class="fas"
            :class="isDark ? 'fa-sun' : 'fa-moon'"
          />
          <span>Toggle Theme</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Manifest } from '@/build/types'

const manifest: Manifest = {
  name: 'ThemeSwitchTest',
  type: 'component',
  description: 'Test module for verifying theme switching capabilities with pure Tailwind CSS.',
  version: '1.0.0',
  author: 'Developer',
}

export interface Props {
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light'
})

const isDark = computed(() => props.theme === 'dark')

defineEmits<{ 'toggle-theme': [] }>()
defineExpose({ manifest })
</script>
