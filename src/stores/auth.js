import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  clearAuthSession,
  hasStoredAuthSession,
  loginWithPassword,
  persistAuthSession,
  readStoredAuth,
} from '../services/auth'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(readStoredAuth())
  const loginLoading = ref(false)
  const loginError = ref('')

  const isAuthenticated = computed(() => Boolean(session.value?.authData))

  function initializeAuth() {
    session.value = readStoredAuth()
  }

  async function login(credentials) {
    loginLoading.value = true
    loginError.value = ''

    try {
      const nextSession = await loginWithPassword(credentials)
      session.value = nextSession
      persistAuthSession(nextSession)
      return nextSession
    } catch (error) {
      loginError.value = error instanceof Error ? error.message : '登录失败，请稍后重试'
      throw error
    } finally {
      loginLoading.value = false
    }
  }

  function logout() {
    session.value = null
    loginError.value = ''
    clearAuthSession()
  }

  return {
    hasStoredAuthSession,
    initializeAuth,
    isAuthenticated,
    login,
    loginError,
    loginLoading,
    logout,
    session,
  }
})
