<script setup lang='ts'>
import { computed, ref } from 'vue'
import type { FormRules } from 'naive-ui'
import { NDynamicTags, NForm, NFormItem, NInput, NModal, useMessage } from 'naive-ui'
import type { Shortcut } from '../index.vue'
import EditDiv from './EditDiv.vue'

// TODO：
// input的校验
// 修改时回填（区分add模式跟modify模式）
interface Props {
  visible: boolean
}
interface Emit {
  (ev: 'update:visible', visible: boolean): void
  (ev: 'add', shortcut: Shortcut): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const message = useMessage()

const shortcut = ref<Shortcut>({
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

const show = computed({
  get() {
    return props.visible
  },
  set(visible: boolean) {
    emit('update:visible', visible)
  },
})

function addParamTag(name: string) {
  const isHasName = shortcut.value.params.includes(name)
  if (isHasName) {
    message.error('重复添加参数！')
    return false
  }
  shortcut.value.params.unshift(name)
  return true
}

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
</script>

<template>
  <NModal
    v-model:show="show" style="width: 90%; max-width: 600px;" preset="dialog" title="添加快捷指令"
    :show-icon="false"
    positive-text="确认"
    negative-text="取消"
    @positive-click="$emit('add', shortcut)"
  >
    <NForm ref="formRef" :model="shortcut" :rules="rules">
      <NFormItem path="name" label="指令名">
        <NInput v-model:value="shortcut.name" @keydown.enter.prevent />
      </NFormItem>
      <NFormItem path="promptHtml" label="指令详情">
        <EditDiv v-model:promptHtml="shortcut.promptHtml" @add-param-tag="addParamTag" />
      </NFormItem>
      <NFormItem path="params" label="参数列表">
        <NDynamicTags v-model:value="shortcut.params" @update:value="updateParamsTag" />
      </NFormItem>
    </NForm>
  </NModal>
</template>
