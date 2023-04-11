<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NInput, NModal } from 'naive-ui'
// TODO
// 禁止重复选择（user-select无效@耿卓涵）
// 增加友好的提示tips
// 优化交互样式
// 禁止tags自带的添加功能

interface Props {
  promptHtml: string
}
interface Emit {
  (ev: 'update:promptHtml', prompt: string): void
  (ev: 'addParamTag', name: string): boolean
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const innerHTML = computed({
  get() {
    return props.promptHtml
  },
  set(promptHtml: string) {
    emit('update:promptHtml', promptHtml)
  },
})
const selectedText = ref('')
const showAddParamModal = ref(false)
const paramName = ref('')

function onMouseUp() {
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
  if (!paramName.value)
    return

  emit('addParamTag', paramName.value)
  // 添加成功，高亮选中块，同时增加一个参数列表
  highlightSelection()
  paramName.value = ''
  selectedText.value = ''
  showAddParamModal.value = false
}
</script>

<template>
  <div class="w-full relative">
    <NButton class="!absolute right-0 -top-6" :disabled="!selectedText" @click="showAddParamModal = true">
      设置为占位符
    </NButton>
    <div
      class="w-full h-36 p-4 mt-4 overflow-y-scroll whitespace-pre-wrap text-left border rounded border-gray-500"
      contenteditable="true"
      @mouseup="onMouseUp"
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
      <NButton class="float-right !mt-4" @click="addParam">
        确认
      </NButton>
    </NModal>
  </div>
</template>
