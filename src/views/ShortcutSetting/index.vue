<script setup lang='ts'>
import { ref, watch } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NDataTable, useMessage } from 'naive-ui'
import AddModal from './components/AddModal.vue'
import { useShortcutStore } from '@/store/modules/shortcut'
import { t } from '@/locales'

// TODO
// 表格样式优化，考虑增加【一键尝试】功能

export interface Shortcut {
  name: string
  promptHtml: string
  params: string[]
}

const message = useMessage()
const shortcutStore = useShortcutStore()
const shortcutList = ref<any>(shortcutStore.shortcutList)
const showAddModal = ref(false)

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
    },
    {
      title: '指令详情',
      key: 'promptHtml',
    },
    {
      title: '指令参数',
      key: 'params',
    },
  ]
}
const columns = createColumns()

function addShortcut(shortcut: Shortcut) {
  shortcutList.value.unshift(shortcut)
  message.success(t('common.addSuccess'))
}
</script>

<template>
  <div class="space-y-4 w-full h-full p-4">
    <NButton @click="showAddModal = true">
      添加shortcut
    </NButton>
    <NDataTable
      :columns="columns"
      :data="shortcutList"
      :bordered="false"
    />
  </div>
  <AddModal v-model:visible="showAddModal" @add="addShortcut" />
</template>
