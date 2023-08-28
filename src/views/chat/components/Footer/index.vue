<script lang="ts" setup>
import { NButton, useDialog } from 'naive-ui'
import { computed, ref } from 'vue'

import { PromptInput, ShortcutParamsInput, ShortcutPreviewList } from '../index'

import { useBasicLayout } from '@/hooks/useBasicLayout'
import { HoverButton, SvgIcon } from '@/components/common'
import { useChatStore } from '@/store'
import { t } from '@/locales'
import type { Shortcut } from '@/views/ShortcutSetting/index.vue'

interface Props {
  usingContext: boolean
  loading: boolean
  prompt: string
  uuid: string
}
interface Emit {
  (ev: 'export'): void
  (ev: 'submit'): void
  (ev: 'toggleUsingContext'): void
  (ev: 'update:prompt', prompt: string): void
  (ev: 'update:loading', loading: boolean): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const dialog = useDialog()
const chatStore = useChatStore()
const { isMobile } = useBasicLayout()
const shortcut = ref<Shortcut | undefined>(undefined)
const loading = computed({
  get() {
    return props.loading
  },
  set(loading: boolean) {
    emit('update:loading', loading)
  },
})
const prompt = computed({
  get() {
    return props.prompt
  },
  set(prompt: string) {
    emit('update:prompt', prompt)
  },
})
const buttonDisabled = computed(() => {
  return loading.value || ((!prompt.value || prompt.value.trim() === '') && !shortcut.value)
})
const footerClass = computed(() => {
  let classes = ['p-4']
  if (isMobile.value)
    classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-3', 'overflow-hidden']
  return classes
})

// 清空当前的会话内容
function handleClear() {
  if (loading.value)
    return

  dialog.warning({
    title: t('chat.clearChat'),
    content: t('chat.clearChatConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearChatByUuid(+props.uuid)
    },
  })
}

function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      emit('submit')
    }
  }
  else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      emit('submit')
    }
  }
}

function handleSubmit() {
  if (shortcut.value) {
    const regex = /<span[^>]*data-name="(.*?)"[^>]*>(.*?)<\/span>/g
    const finalPrompt = shortcut.value.promptHtml.replace(regex, (match, label) => {
      // params不包括该参数，则将span替换为文本，取消高亮
      const param = shortcut.value?.params.find(param => param.label === label)
      return param?.value
    })
    prompt.value = finalPrompt
  }
  emit('submit')
}

function handleShortCutInput(shortcutMsg: Shortcut) {
  shortcut.value = shortcutMsg
  const regex = /<span[^>]*data-name="(.*?)"[^>]*>(.*?)<\/span>/g
  const finalPrompt = shortcutMsg.promptHtml.replace(regex, (match, p1, p2) => {
    // params不包括该参数，则将span替换为文本，取消高亮
    return p2
  })
  prompt.value = finalPrompt
}
</script>

<template>
  <footer :class="footerClass">
    <div class="w-full max-w-screen-xl m-auto">
      <ShortcutPreviewList @handle-shortcut="handleShortCutInput" />
      <div class="flex items-center justify-between space-x-2">
        <HoverButton @click="handleClear">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:delete-bin-line" />
          </span>
        </HoverButton>
        <HoverButton v-if="!isMobile" @click="$emit('export')">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:download-2-line" />
          </span>
        </HoverButton>
        <HoverButton v-if="!isMobile" @click="$emit('toggleUsingContext')">
          <span
            class="text-xl"
            :class="{
              'text-[#4b9e5f]': usingContext,
              'text-[#a8071a]': !usingContext,
            }"
          >
            <SvgIcon icon="ri:chat-history-line" />
          </span>
        </HoverButton>
        <ShortcutParamsInput v-if="shortcut" v-model:params="shortcut.params" />
        <PromptInput v-else v-model:prompt="prompt" @enter="handleEnter" />
        <NButton
          type="primary"
          :disabled="buttonDisabled"
          @click="handleSubmit"
        >
          <template #icon>
            <span class="dark:text-black">
              <SvgIcon icon="ri:send-plane-fill" />
            </span>
          </template>
        </NButton>
      </div>
    </div>
  </footer>
</template>
