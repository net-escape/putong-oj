import type { LoginParam, Profile } from '@/types'
import { defineStore } from 'pinia'
import api from '@/api'
import { privilege } from '@/utils/constant'

export const useSessionStore = defineStore('session', {
  state: () => ({
    loginDialog: false,
    profile: null as (null | Profile),
  }),
  getters: {
    isLogined: state => state.profile != null,
    // Return type must be set in order to use `this`
    // https://pinia.vuejs.org/core-concepts/getters.html#getters
    isAdmin (): boolean {
      return this.isLogined
        && (this.profile?.privilege === privilege.Admin
          || this.profile?.privilege === privilege.Root)
    },
    isRoot (): boolean {
      return this.isLogined
        && (this.profile?.privilege === privilege.Root)
    },
  },
  actions: {
    toggleLoginState () {
      this.loginDialog = !this.loginDialog
    },
    setLoginProfile (profile: Profile) {
      this.profile = profile
    },
    async userLogin (opt: LoginParam) {
      const { data } = await api.session.userLogin(opt)
      if (data.data !== null) {
        this.profile = data.data as Profile
      }
      return data
    },
    async logout () {
      await api.logout()
      this.profile = null
      sessionStorage.clear()
    },
    async fetch () {
      const { data } = await api.session.fetch()
      this.profile = data.profile
    },
  },
})
