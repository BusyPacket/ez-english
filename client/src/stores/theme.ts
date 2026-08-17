import { ref } from 'vue'
import { defineStore } from 'pinia'

const THEME_KEY = 'ez-english-theme'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem(THEME_KEY) === 'dark')

  function setDark(value: boolean) {
    isDark.value = value
    localStorage.setItem(THEME_KEY, value ? 'dark' : 'light')
  }

  function toggle() {
    setDark(!isDark.value)
  }

  return { isDark, setDark, toggle }
})
