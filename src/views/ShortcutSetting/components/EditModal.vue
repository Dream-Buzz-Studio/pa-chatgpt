<script setup lang='ts'>
import { computed, ref, watch } from 'vue'
import type { FormRules } from 'naive-ui'
import { NDynamicTags, NForm, NFormItem, NInput, NModal, useMessage } from 'naive-ui'
import type { Shortcut } from '../index.vue'
import EditDiv from './EditDiv.vue'

// TODO：
// input的校验
interface Props {
  visible: boolean
  shortcut: Shortcut | undefined
}
interface Emit {
  (ev: 'update:visible', visible: boolean): void
  (ev: 'confirm', shortcut: Shortcut): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const message = useMessage()

const shortcut = ref<Shortcut>(props.shortcut || {
  name: '',
  promptHtml: '请在这里输入prompt',
  params: [],
})

const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: ['input', 'blur'],
    },
  ],
  promptHtml: [
    {
      required: true,
      trigger: ['input', 'blur'],
    },
  ],
}

watch(
  () => props.shortcut,
  () => {
    if (!props.shortcut)
      return
    shortcut.value = { ...props.shortcut }
  },
)

watch(
  () => shortcut.value.promptHtml,
  (val) => {
    const paramsList: string[] = []
    const regex = /<span[^>]*\sdata-name="([^"]*)"[^>]*>(.*?)<\/span>/g
    const matches: RegExpMatchArray[] = [...val.matchAll(regex)]
    matches.forEach((match: RegExpMatchArray) => {
      // 包含span标签，则加入参数列表
      paramsList.push(match[1])
    })
    shortcut.value.params = paramsList
  },
  { deep: true },
)

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

// 这一段powerd by gpt，让我们谢谢openai谢谢美好的新时代！！
function updateParamsTag() {
  const regex = /<span[^>]*data-name="(.*?)"[^>]*>(.*?)<\/span>/g
  const newHtmlStr = shortcut.value.promptHtml.replace(regex, (match, p1, p2) => {
    // params不包括该参数，则将span替换为文本，取消高亮
    if (!shortcut.value.params.includes(p1))
      return p2
    else
      return match
  })
  shortcut.value.promptHtml = newHtmlStr
}

function handleCancel() {

}

function handleConfirm() {
  emit('confirm', shortcut.value)
}
</script>

<template>
  <NModal
    v-model:show="show" style="width: 90%; max-width: 600px;" preset="dialog" title="添加快捷指令"
    :show-icon="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="handleConfirm"
    @negative-click="handleCancel"
  >
    <NForm ref="formRef" :model="shortcut" :rules="rules" class="mt-8">
      <NFormItem path="name" label="指令名" class="space-y-2">
        <NInput v-model:value="shortcut.name" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="promptHtml" label="指令详情" class="space-y-2">
        <EditDiv v-model:promptHtml="shortcut.promptHtml" />
      </NFormItem>
      <NFormItem path="params" label="参数列表" class="space-y-2">
        <NDynamicTags v-model:value="shortcut.params" @update:value="updateParamsTag">
          <!-- 去掉添加按钮，传入空的slot -->
          <template #trigger />
        </NDynamicTags>
      </NFormItem>
    </NForm>
  </NModal>
</template>
