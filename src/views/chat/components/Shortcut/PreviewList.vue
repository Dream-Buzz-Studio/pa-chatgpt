<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { NButton, NCard, NPopover, NSpace, NTag } from 'naive-ui'
import { computed, ref } from 'vue'
import Draggable from 'vuedraggable'

import { useScroll } from '../../hooks/useScroll'
import { SvgIcon } from '@/components/common'
import { useShortcutStore } from '@/store'
import type { Shortcut } from '@/views/ShortcutSetting/index.vue'

interface Emit {
  (ev: 'handleShortcut', shortcut: Shortcut): void
}
const emit = defineEmits<Emit>()

const shortcutListStore = useShortcutStore()
const { shortcutList } = storeToRefs<any>(shortcutListStore)
// 是否折叠所有指令
const collapsed = ref(true)
// 是否开始对指令排序
const startSort = ref(false)
const { scrollRef, scrollToTop } = useScroll()

const cardContentClass = computed(() => {
  const classes = ['!transition-all', '!duration-300', '!ease-linear']
  // 平滑的折叠收缩效果
  if (collapsed.value)
    return ['overflow-hidden', 'max-h-10', 'pr-8']
  else
    return ['overflow-auto', 'max-h-96']
})

function handleUpdateCollapsed() {
  collapsed.value = true
  startSort.value = false
  // 关闭时进度条回顶
  scrollRef.value = document.querySelector('#scrollRef')
  scrollToTop()
}
</script>

<template>
  <NCard
    v-if="shortcutList.length"
    :title="collapsed ? undefined : '快捷指令'"
    :closable="!collapsed"
    class="relative flex content-between mb-4"
    size="small"
    :segmented="{ content: true }"
    header-style="position: sticky; top: 0; background: var(--n-color) !important; z-index: 1"
    @close="handleUpdateCollapsed"
  >
    <SvgIcon
      v-if="collapsed"
      class="absolute top-0 right-3 h-14 text-2xl"
      icon="ri:list-settings-line"
      @click="collapsed = false"
    />
    <!-- 卡片头部 -->
    <template #header-extra>
      <NButton type="success" :dashed="startSort" class="!mr-4" size="small" @click="startSort = !startSort">
        {{ startSort ? ' 完成' : '编辑顺序' }}
      </NButton>
    </template>
    <!-- 卡片内容区 -->
    <NSpace id="scrollRef" class="!transition-all !duration-300 !ease-linear" :class="cardContentClass">
      <!-- 排序状态 -->
      <Draggable
        v-if="startSort"
        v-model="shortcutList"
        :force-fallback="true"
        item-key="key"
        chosen-class="!border-green-500"
      >
        <template #item="{ element }">
          <NTag :bordered="false" class="hover:border hover:border-[#4b9e5f]">
            {{ element.name }}
          </NTag>
        </template>
      </Draggable>
      <!-- 展示状态 -->
      <NPopover
        v-for="item in shortcutList"
        v-else
        :key="item.name"
        class="max-w-3xl"
        trigger="hover"
      >
        <template #trigger>
          <NTag :bordered="false" class="hover:border hover:border-[#4b9e5f]" @click="$emit('handleShortcut', item)">
            {{ item.name }}
          </NTag>
        </template>
        <span v-html="item.promptHtml" />
      </NPopover>
    </NSpace>
  </NCard>
</template>
