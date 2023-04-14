<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, useMessage } from 'naive-ui'
// TODO
// 禁止重复选择（user-select无效@耿卓涵）
// 增加友好的提示tips

interface Props {
  promptHtml: string
}
interface Emit {
  (ev: 'update:promptHtml', prompt: string): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const message = useMessage()

const selectedText = ref('')
const showAddParamModal = ref(false)
const paramName = ref('')
const innerHTML = computed({
  get() {
    return props.promptHtml
  },
  set(promptHtml: string) {
    emit('update:promptHtml', promptHtml)
  },
})

function getSelection() {
  if (!window.getSelection())
    return
  //  获取html
  const rangeObj = window.getSelection().getRangeAt(0)
  const docFragment = rangeObj.cloneContents()
  const tempDiv = document.createElement('div')
  tempDiv.appendChild(docFragment)
  selectedText.value = tempDiv.innerHTML
}

function highlightSelection() {
  if (!selectedText.value)
    return
  innerHTML.value = innerHTML.value.replace(
    selectedText.value,
    `<span data-name="${paramName.value}" class="select-none bg-gray-600 p-0.5 m-1 overflow-auto rounded">${selectedText.value}</span>`,
  )
}

function changeText(event: any) {
  innerHTML.value = event.target.innerHTML
}

function addParam() {
  const spanRegex = new RegExp(`<span[^>]*data-name="${paramName.value}"[^>]*>`)
  if (spanRegex.test(innerHTML.value)) {
    message.error('重复输入参数名')
    return
  }

  // 添加成功，高亮选中块
  highlightSelection()
  paramName.value = ''
  selectedText.value = ''
  showAddParamModal.value = false
}
</script>

<template>
  <div class="w-full relative">
    <NButton class="!absolute right-0 -top-10" :disabled="!selectedText" @click="showAddParamModal = true">
      设置为参数
    </NButton>
    <div
      class="w-full h-36 p-4 overflow-y-scroll whitespace-pre-wrap text-left border rounded border-gray-500"
      contenteditable="true"
      @mouseup="getSelection"
      @focus="selectedText = ''"
      @blur="changeText($event)"
      v-html="innerHTML"
    />
    <NModal
      v-model:show="showAddParamModal"
      style="max-width: 400px;"
      :title="`将「${selectedText}」设置为参数`"
      preset="card"
    >
      <NInput v-model:value="paramName" maxlength="12" round />
      <NButton class="float-right !mt-4" :disabled="!paramName" @click="addParam">
        确认
      </NButton>
    </NModal>
  </div>
</template>
