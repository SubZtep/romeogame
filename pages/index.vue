<template lang="pug">
.container
  div(:class="$style.mainGrid")
    .bg-orange-900.p-2
      button(@click="showWebcam = !showWebcam") Toggle Webcam
      WebcamStream(
        v-if="showWebcam"
        :video-width="352"
        :video-height="288")
    .bg-red-900.p-2
      DrawAvatar
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import WebcamStream from "~/components/WebcamStream.vue"
import DrawAvatar from "~/components/DrawAvatar.vue"

@Component({ components: { WebcamStream, DrawAvatar } })
export default class IndexPage extends Vue {
  showWebcam = false
}
</script>

<style module>
.mainGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
