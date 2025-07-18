<script setup>
import { storeToRefs } from 'pinia'
import VditorPreview from 'vditor/dist/method.min'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRootStore } from '@/store'
import 'vditor/dist/index.css'

const props = defineProps([ 'modelValue' ])
const { locale } = useI18n()
const rootStore = useRootStore()
const { vditorCDN } = $(storeToRefs(rootStore))

let rendering = $ref(false)
let renderPromise = $ref(Promise.resolve())
let waiting = $ref(false)

const preview = ref(null)
const config = $computed(() => ({
  after () {
    rendering = false
  },
  cdn: vditorCDN,
  lang: locale.value.replace('-', '_'),
  render: {
    media: {
      enable: false,
    },
  },
}))

async function render () {
  if (!preview.value || waiting
    || props.modelValue === undefined
  ) { return }

  waiting = true
  try {
    await renderPromise
  } catch (e) {
    console.error(e)
  }
  waiting = false
  rendering = true
  renderPromise = VditorPreview.preview(
    preview.value,
    props.modelValue,
    config,
  )
}

onMounted(render)
watch(() => props.modelValue, render)
</script>

<template>
  <div>
    <div v-if="rendering" class="vidtor-uninitialized">
      <Icon type="ios-loading" class="card-icon" />
      <span class="card-text">Rendering...</span>
    </div>
    <div v-show="!rendering" ref="preview" class="vditor-initialized" />
  </div>
</template>

<style lang="stylus" scoped>
.vidtor-uninitialized
  margin-bottom 20px
  padding 32px
  border-radius 4px
  display flex
  align-items center
  justify-content center
  .card-icon
    font-size 32px
  .card-text
    margin-left 32px

.vditor-initialized
  overflow visible
</style>
