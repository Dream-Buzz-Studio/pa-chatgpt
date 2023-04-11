import { defineStore } from 'pinia'
import type { ShortcutStore } from './helper'
import { getLocalShortcutList, setLocalShortcutList } from './helper'

export const useShortcutStore = defineStore('shortcut-store', {
  state: (): ShortcutStore => getLocalShortcutList(),

  actions: {
    updateShortcutList(shortcutList: []) {
      this.$patch({ shortcutList })
      setLocalShortcutList({ shortcutList })
    },
    getShortcutList() {
      return this.$state
    },
  },
})
