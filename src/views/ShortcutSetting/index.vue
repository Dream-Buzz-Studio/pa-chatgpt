<script setup lang='ts'>
import { h, ref, watch } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NDataTable, NTag, useMessage } from 'naive-ui'
import { EditModal } from './components'
import { useShortcutStore } from '@/store/modules/shortcut'
import { t } from '@/locales'

// TODO
// 表格样式优化，考虑增加【一键尝试】功能

export interface ShortcutParams {
  label: string
  value: string
}

export interface Shortcut {
  name: string
  promptHtml: string
  params: Array<ShortcutParams>
}
export type EditModalMode = 'add' | 'modify'
const message = useMessage()
const shortcutStore = useShortcutStore()
const shortcutList = ref<any>(shortcutStore.shortcutList)
const showEditModal = ref(false)
// 当前选中的shortcut
const currentShortcut = ref<Shortcut | undefined>(undefined)
// 编辑弹窗的模式
const editModalMode = ref<EditModalMode>()

watch(
  () => shortcutList,
  () => {
    shortcutStore.updateShortcutList(shortcutList.value)
  },
  { deep: true },
)

// table相关
const createColumns = (): DataTableColumns<Shortcut> => {
  return [
    {
      title: '指令名',
      key: 'name',
      width: 100,
    },
    {
      title: '指令详情',
      key: 'promptHtml',
      width: 500,
      render(row) {
        return h('div', { innerHTML: row.promptHtml })
      },
    },
    {
      title: '指令参数',
      key: 'params',
      width: 100,
      render(row) {
        return h('div', { class: 'flex flex-row flex-wrap items-center gap-2' }, {
          default: () => row.params.map(item =>
            h(
              NTag,
              {
                size: 'small',
                bordered: false,
              },
              { default: () => item.label },
            ),
          ),
        })
      },
    },
    {
      title: t('common.action'),
      key: 'actions',
      width: 100,
      align: 'center',
      render(row) {
        return h('div', { class: 'flex flex-row items-center justify-center gap-2' }, {
          default: () => [h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => handleShowEditModal('modify', row),
            },
            { default: () => t('common.edit') },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => deleteShortcut(row),
            },
            { default: () => t('common.delete') },
          ),
          ],
        })
      },
    },
  ]
}
const columns = createColumns()

function handleShowEditModal(mode: EditModalMode, shortcut?: Shortcut) {
  editModalMode.value = mode
  showEditModal.value = true
  if (mode === 'add')
    currentShortcut.value = undefined
  if (mode === 'modify' && shortcut)
    currentShortcut.value = shortcut
}

function deleteShortcut(shortcut: Shortcut) {
  const index = shortcutList.value.indexOf(shortcut)
  shortcutList.value.splice(index, 1)
}

function editShortcut(shortcut: Shortcut) {
  if (editModalMode.value === 'add') {
    shortcutList.value.unshift(shortcut)
    message.success(t('common.addSuccess'))
  }
  if (editModalMode.value === 'modify') {
    const index = shortcutList.value.indexOf(shortcut)
    shortcutList.value.splice(index, 1, shortcut)
  }
  currentShortcut.value = undefined
}
</script>

<template>
  <div class="space-y-4 w-full h-full p-4">
    <NButton @click="handleShowEditModal('add')">
      添加shortcut
    </NButton>
    <NDataTable
      :columns="columns"
      :data="shortcutList"
      :bordered="false"
    />
  </div>
  <EditModal v-model:visible="showEditModal" :shortcut="currentShortcut" @edit-shortcut="editShortcut" />
</template>
