<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { NInput, NInputGroup, NInputGroupLabel, NSpace } from 'naive-ui'

import { useBasicLayout } from '@/hooks/useBasicLayout'
import type { ShortcutParams } from '@/views/ShortcutSetting/index.vue'

interface Props {
  params: ShortcutParams
}
interface Emit {
  (ev: 'update:params', params: ShortcutParams): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const inputRef = ref<Ref | null>(null)
const { isMobile } = useBasicLayout()

const params = computed({
  get() {
    return props.params
  },
  set(params: ShortcutParams) {
    emit('update:params', params)
  },
})

onMounted(() => {
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})
</script>

<template>
  <NSpace vertical class="w-full">
    <NInputGroup v-for="item in params" :key="item.label">
      <NInputGroupLabel>{{ item.label }}</NInputGroupLabel>
      <NInput v-model:value="item.value" :placeholder="item.value" />
    </NInputGroup>
  </NSpace>
</template>
