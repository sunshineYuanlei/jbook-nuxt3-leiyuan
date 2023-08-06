import { defineStore } from "pinia"
import { persistedState } from "#imports"

export const useMyStore = defineStore("myStore", {
  state: () => ({
    counter: 1,
    token: "18874891381",
  }),
  getters: {
    doubleCounter: (state) => state.counter * 2,
  },
  actions: {
    add() {
      this.counter++
    },
  },
  // persist: {storage: persistedState.cookiesWithOptions()},
  // persist: {storage: persistedState.sessionStorage},
  persist: { storage: persistedState.localStorage, paths: ["token"] },
})
