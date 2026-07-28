import { defineStore } from 'pinia'
import { ref ,computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')||'null'))
  const isLoggedIn = computed(()=> !!token.value)
  function login(newToken, newUserInfo) {
    token.value = newToken
    userInfo.value = newUserInfo
    localStorage.setItem('token', newToken)
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
  }

  function logout() {
  token.value = ''
  userInfo.value = null
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

return {token , userInfo , isLoggedIn , login,logout}
})

