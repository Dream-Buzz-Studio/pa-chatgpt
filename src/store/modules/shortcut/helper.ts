import { ss } from '@/utils/storage'

const LOCAL_NAME = 'ShortcutStore'

export type ShortcutList = []

export interface ShortcutStore {
  ShortcutList: ShortcutList
}

export function getLocalShortcutList(): ShortcutStore {
  const ShortcutStore: ShortcutStore | undefined = ss.get(LOCAL_NAME)
  return ShortcutStore ?? { ShortcutList: [] }
}

export function setLocalShortcutList(ShortcutStore: ShortcutStore): void {
  ss.set(LOCAL_NAME, ShortcutStore)
}
