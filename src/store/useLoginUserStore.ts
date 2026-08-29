import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserVO } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref<UserVO | null>(null)
  const isLoggedIn = computed(() => !!token.value)
  function login(newToken: string, newUserInfo: UserVO) {
    token.value = newToken
    userInfo.value = newUserInfo
  }

  function updateUserInfo(partial: Partial<UserVO>) {
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

