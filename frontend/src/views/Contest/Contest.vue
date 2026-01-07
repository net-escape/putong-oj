<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRootStore } from '@/store'
import { useContestStore } from '@/store/modules/contest'
import { useSessionStore } from '@/store/modules/session'
import { onProfileUpdate, onRouteParamUpdate, purify } from '@/utils/helper'
import ContestVerificationDialog from './ContestVerificationDialog.vue'

const contestStore = useContestStore()
const sessionStore = useSessionStore()
const rootStore = useRootStore()
const route = useRoute()

const { contest, isParticipating, requiresVerification } = $(storeToRefs(contestStore))
const { findOne } = contestStore
const { changeDomTitle } = rootStore
const { profile } = sessionStore

// eslint-disable-next-line unused-imports/no-unused-vars
let loading = $ref(false)
const showVerificationDialog = ref(false)

async function fetch () {
  loading = true
  await findOne(purify({ cid: route.params.cid, uid: profile?.uid }))
  changeDomTitle(contest.name)
  if (!isParticipating && requiresVerification) {
    showVerificationDialog.value = true
  }
  loading = false
}

function onVerificationSuccess () {
  showVerificationDialog.value = false
  fetch()
}

fetch()
changeDomTitle({ title: `Contest ${route.params.cid}` })
onRouteParamUpdate(() => {
  changeDomTitle({ title: `Contest ${route.params.cid}` })
  fetch()
})
onProfileUpdate(fetch)
</script>

<template>
  <div
    class="contest-wrap" :class="{
      'contest-ranklist-wrap': route.name === 'contestRanklist',
      'contest-status-wrap': route.name === 'contestStatus',
    }"
  >
    <ContestVerificationDialog
      v-if="contest && contest.cid"
      v-model:visible="showVerificationDialog"
      :contest="contest"
      @verification-success="onVerificationSuccess"
    />
    <RouterView v-if="contest && contest.cid && isParticipating" class="contest-children" />
    <div v-else-if="contest && contest.cid && !isParticipating" class="contest-children">
      <div class="flex flex-col items-center justify-center gap-4 py-20">
        <i class="pi pi-lock text-6xl text-muted-color" />
        <h2 class="text-2xl font-semibold">{{ $t('ptoj.contest_requires_verification') }}</h2>
        <p class="text-muted-color">{{ $t('ptoj.contest_verification_desc') }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
.contest-children
  padding 40px 40px

@media screen and (max-width: 1024px)
  .contest-children
    padding 20px 20px
</style>

<style lang="stylus" scoped>
.contest-wrap
  padding 0
  max-width 1024px
.contest-ranklist-wrap
  max-width: 1920px
.contest-status-wrap
  max-width: 1280px
</style>
