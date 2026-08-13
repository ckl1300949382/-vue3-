import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!token.value)
  function login(newToken, newUserInfo) {
    token.value = newToken
    userInfo.value = newUserInfo
  }

  function updateUserInfo(partial) {
    userInfo.value = { ...userInfo.value, ...partial }
  }

  function logout() {
    token.value = ''
    userInfo.value = null
  }

  return { token, userInfo, isLoggedIn, login, updateUserInfo, logout }
}, {
  persist: true
})

