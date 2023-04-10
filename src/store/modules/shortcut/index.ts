import { defineStore } from 'pinia'
import type { ShortcutStore } from './helper'
import { getLocalShortcutList, setLocalShortcutList } from './helper'

export const useShortcutStore = defineStore('Shortcut-store', {
  state: (): ShortcutStore => getLocalShortcutList(),

  actions: {
    updateShortcutList(ShortcutList: []) {
      this.$patch({ ShortcutList })
      setLocalShortcutList({ ShortcutList })
    },
    getShortcutList() {
      return this.$state
    },
  },
})
