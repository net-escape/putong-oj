<script setup>
import { storeToRefs } from 'pinia'
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OJContestEdit from '@/components/ContestEdit'
import { useRootStore } from '@/store'
import { useContestStore } from '@/store/modules/contest'

const { t } = useI18n()
const rootStore = useRootStore()
const contestStore = useContestStore()

const { encrypt } = $(storeToRefs(rootStore))
const { create } = contestStore
const Message = inject('$Message')
const router = useRouter()

function now () {
  const timestamp = new Date().getTime()
  return timestamp - timestamp % (60 * 1000)
}

const contest = $ref({
  title: '',
  start: now(),
  end: now() + 60 * 1000 * 60,
  list: [],
  encrypt: encrypt.Public,
  argument: '',
})

async function submit () {
  if (!contest.title) {
    Message.error(t('oj.title_is_required'))
  } else if (!contest.start || !contest.end) {
    Message.error(t('oj.time_is_required'))
  } else {
    const cid = await create(contest)
    Message.success(t('oj.create_contest_success', contest))
    router.push({ name: 'contestOverview', params: { cid } })
  }
}
</script>

<template>
  <div>
    <h1>{{ t('oj.caution') }}</h1>
    <br>
    <Steps :current="5" :style="{ color: 'black' }">
      <Step :title="t('oj.difficulty')" :content="t('oj.difficulty_explanation')" status="process" />
      <Step :title="t('oj.correctness_of_the_problem')" :content="t('oj.correctness_of_the_problem_explanation')" icon="ios-star" status="process" />
    </Steps>
    <br>
    <OJContestEdit :contest="contest" />
    <Button type="primary" size="large" @click="submit">
      {{ t('oj.submit') }}
    </Button>
  </div>
</template>

<style lang="stylus" scoped>
</style>
