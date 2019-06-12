<template lang="pug">
.container
  div(:class="$style.mainGrid")

    //- Webcam view
    .bg-orange-900.p-2
      button(@click="showWebcam = !showWebcam") Toggle Webcam
      WebcamStream(
        v-if="showWebcam"
        :width="352"
        :height="288"
        :adjacents="false")

    //- Game view
    .bg-red-900.p-2
      //-DrawStickman(:running="showWebcam")
      DrawAvatar(:running="showWebcam")

    //- Debug console
    //-.bg-green-900.text-xs.text-yellow-500.p-2
      pre {{ debugKeypoints() }}
</template>

<script lang="ts">
import { Component, Vue, Getter } from "nuxt-property-decorator"
import WebcamStream from "~/components/WebcamStream.vue"
import DrawStickman from "~/components/DrawStickman.vue"
import DrawAvatar from "~/components/DrawAvatar.vue"

@Component({ components: { WebcamStream, DrawStickman, DrawAvatar } })
export default class IndexPage extends Vue {
  showWebcam = false
  @Getter("getKeypoints", { namespace: "player" }) keypoints

  debugKeypoints() {
    return this.keypoints.filter(keypoint =>
      ["nose", "leftElbow", "rightElbow"].includes(keypoint.part as string)
    )
  }
}
</script>

<style module>
.mainGrid {
  display: grid;
  /*grid-template-columns: 352px 1fr 300px;
  min-height: 500px;*/
  grid-template-columns: 352px 1fr;
  height: 500px;
}
</style>
