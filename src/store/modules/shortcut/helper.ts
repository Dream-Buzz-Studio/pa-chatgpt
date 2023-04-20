import { ss } from '@/utils/storage'

const LOCAL_NAME = 'shortcutStore'

export type ShortcutList = []

export interface ShortcutStore {
  shortcutList: ShortcutList
}

export function getLocalShortcutList(): ShortcutStore {
  const shortcutStore: ShortcutStore | undefined = ss.get(LOCAL_NAME)
  return shortcutStore ?? { shortcutList: [] }
}

export function setLocalShortcutList(shortcutStore: ShortcutStore): void {
  ss.set(LOCAL_NAME, shortcutStore)
}
