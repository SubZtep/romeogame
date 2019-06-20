<template lang="pug">
.bg-orange-900.p-2.border-l-2.border-r-2.border-gray-800.border-dotted

  WebcamStream(
    :width="352"
    :height="288"
    :pose-detection="poseDetection"
    :adjacents="adjacents")

  label.block.mt-8.text-orange-500
    input.mr-2(
      type="checkbox"
      v-model="poseDetection")
    | Pose Detection

  label.block.mt-2.text-orange-500
    input.mr-2(
      type="checkbox"
      v-model="adjacents"
      :disabled="!poseDetection")
    | Set Bones

  RecordTPose.mt-3
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import WebcamStream from "~/components/webcam/WebcamStream.vue"
import RecordTPose from "~/components/webcam/RecordTPose.vue"

@Component({ components: { WebcamStream, RecordTPose } })
export default class WebcamPanelComponent extends Vue {
  poseDetection = false
  adjacents = false
}
</script>
