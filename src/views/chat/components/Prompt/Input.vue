<script lang="ts" setup>
import type { Ref } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { NAutoComplete, NInput } from 'naive-ui'

import { useBasicLayout } from '@/hooks/useBasicLayout'
import { usePromptStore } from '@/store'
import { t } from '@/locales'

interface Props {
  prompt: string
}
interface Emit {
  (ev: 'enter', event: KeyboardEvent): void
  (ev: 'update:prompt', prompt: string): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const inputRef = ref<Ref | null>(null)
// 添加PromptStore
const promptStore = usePromptStore()
// 使用storeToRefs，保证store修改后，联想部分能够重新渲染
const { promptList: promptTemplate } = storeToRefs<any>(promptStore)
const { isMobile } = useBasicLayout()

const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})
const prompt = computed({
  get() {
    return props.prompt
  },
  set(prompt: string) {
    emit('update:prompt', prompt)
  },
})
const searchOptions = computed(() => {
  // TODO
  // 搜索选项计算，这里使用value作为索引项，所以当出现重复value时渲染异常(多项同时出现选中效果)
  // 理想状态下其实应该是key作为索引项,但官方的renderOption会出现问题，所以就需要value反renderLabel实现
  if (prompt.value.startsWith('/')) {
    return promptTemplate.value.filter((item: { key: string }) => item.key.toLowerCase().includes(prompt.value.substring(1).toLowerCase())).map((obj: { value: any }) => {
      return {
        label: obj.value,
        value: obj.value,
      }
    })
  }
  else {
    return []
  }
})

// value反渲染key
const renderOption = (option: { label: string }) => {
  for (const i of promptTemplate.value) {
    if (i.value === option.label)
      return [i.key]
  }
  return []
}

onMounted(() => {
  if (inputRef.value && !isMobile.value)
    inputRef.value?.focus()
})
</script>

<template>
  <NAutoComplete
    v-model:value="prompt"
    :options="searchOptions"
    :render-label="renderOption"
  >
    <template #default="{ handleInput, handleBlur, handleFocus }">
      <NInput
        ref="inputRef"
        v-model:value="prompt"
        type="textarea"
        :placeholder="placeholder"
        :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keypress="$emit('enter', $event)"
      />
    </template>
  </NAutoComplete>
</template>
