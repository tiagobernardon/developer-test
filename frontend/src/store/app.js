// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isAuthenticated: localStorage.getItem('auth') === 'true' ? true : false,
    drawer: false
  }),
  actions: {
    setDrawer(value) {
      this.drawer = value;
    },
    setIsAuthenticated(value) {
      this.isAuthenticated = value;
    }
  }
})