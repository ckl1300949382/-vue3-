import { defineStore } from 'pinia'
import { ref ,computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  let saved
  try { saved = JSON.parse(localStorage.getItem('userInfo')) } catch { saved = null }
  const userInfo = ref(saved)
  const isLoggedIn = computed(()=> !!token.value)
  function login(newToken, newUserInfo) {
    token.value = newToken
    userInfo.value = newUserInfo
    localStorage.setItem('token', newToken)
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
  }

  function updateUserInfo(partial) {
    userInfo.value = { ...userInfo.value, ...partial }
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  function logout() {
  token.value = ''
  userInfo.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

return {token , userInfo , isLoggedIn , login, updateUserInfo, logout}
})

