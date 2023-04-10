<script setup lang='ts'>
import { ref } from 'vue'
import { NButton, NInput, NModal } from 'naive-ui'

const shortcutName = ref('')
const showAddModal = ref(false)
</script>

<template>
  <div class="space-y-4 w-full h-full p-4">
    ceshi
    <NButton @click="showAddModal = true">
      添加shortcut
    </NButton>
  </div>

  <NModal v-model:show="showAddModal" style="width: 90%; max-width: 600px;" preset="card">
    <NInput v-model="shortcutName" />
  </NModal>
</template>
