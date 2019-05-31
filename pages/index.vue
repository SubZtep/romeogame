<template lang="pug">
.container
  div(:class="$style.mainGrid")
    .bg-orange-900.p-2
        button(@click="showWebcam = !showWebcam") Toggle Webcam

        WebcamStream(
          v-if="showWebcam"
          :video-width="352"
          :video-height="288")
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import WebcamStream from "~/components/WebcamStream.vue"

@Component({ components: { WebcamStream } })
export default class IndexPage extends Vue {
  showWebcam = true
}
</script>

<style module>
.mainGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
