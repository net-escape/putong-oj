<script setup lang="ts">
import type { ContestEntityView } from '@backend/types/entity'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useContestStore } from '@/store/modules/contest'
import { useMessage } from '@/utils/message'

const props = defineProps<{
  visible: boolean
  contest: ContestEntityView
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'verification-success': []
}>()

const { t } = useI18n()
const message = useMessage()
const contestStore = useContestStore()

const password = ref('')
const loading = ref(false)

const isPasswordProtected = ref(false)
const isPrivate = ref(false)

watch(() => props.contest, (contest) => {
  if (!contest) return
  // encrypt: 1 = Public, 2 = Private, 3 = Password
  isPasswordProtected.value = contest.encrypt === 3
  isPrivate.value = contest.encrypt === 2
}, { immediate: true })

async function handleVerify () {
  loading.value = true
  try {
    const payload: { cid: number, pwd?: string } = { cid: props.contest.cid }
    if (isPasswordProtected.value) {
      if (!password.value) {
        message.error(t('ptoj.password_required'))
        loading.value = false
        return
      }
      payload.pwd = password.value
    }
    
    const isVerified = await contestStore.verify(payload)
    if (isVerified) {
      message.success(t('ptoj.contest_verified_success'))
      emit('verification-success')
      emit('update:visible', false)
    } else {
      if (isPasswordProtected.value) {
        message.error(t('ptoj.incorrect_password'))
      } else {
        message.error(t('ptoj.not_authorized'))
      }
    }
  } catch (error: any) {
    message.error(error.message || t('ptoj.verification_failed'))
  } finally {
    loading.value = false
  }
}

function handleClose () {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="visible"
    :header="t('ptoj.join_contest')"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="w-full max-w-md"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-4">
      <div v-if="isPrivate" class="text-muted-color">
        {{ t('ptoj.private_contest_desc') }}
      </div>
      <div v-else-if="isPasswordProtected" class="flex flex-col gap-2">
        <label for="contest-password">{{ t('ptoj.contest_password') }}</label>
        <InputText
          id="contest-password"
          v-model="password"
          type="password"
          :placeholder="t('ptoj.enter_password')"
          @keyup.enter="handleVerify"
        />
      </div>
      <div v-else class="text-muted-color">
        {{ t('ptoj.public_contest_desc') }}
      </div>
      
      <div class="flex justify-end gap-2">
        <Button
          :label="t('ptoj.cancel')"
          severity="secondary"
          @click="handleClose"
        />
        <Button
          :label="t('ptoj.join')"
          :loading="loading"
          @click="handleVerify"
        />
      </div>
    </div>
  </Dialog>
</template>
