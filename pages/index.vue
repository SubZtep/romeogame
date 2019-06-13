<template lang="pug">
.container.max-w-full
  div(:class="{ [$style.mainGrid]: true, [$style.webcam]: panel.webcam }")

    //- Nav panel
    nav.bg-yellow-600.px-2.py-1.border-l-2.border-r-2.border-gray-800.border-dotted
      button(
        title="Toggle Webcam Panel"
        @click="toggleWebcamPanel()")
        fa(:icon="['far', panel.webcam ? 'webcam-slash' : 'webcam']")
      button(
        title="Stickman/Avatar Switch"
        @click="panel.stickman = !panel.stickman; panel.avatar = !panel.stickman")
        fa(v-if="panel.avatar" :icon="['fal', 'blind']")
        fa(v-if="panel.stickman" :icon="['fas', 'walking']")

    //- Webcam panel
    .bg-orange-900.p-2.border-l-2.border-r-2.border-gray-800.border-dotted(v-if="panel.webcam")
      WebcamStream(
        :width="352"
        :height="288"
        :adjacents="false")

    //- Game panel
    .bg-red-900.p-2.border-l-2.border-r-2.border-gray-800.border-dotted
      DrawStickman(
        v-if="panel.stickman"
        ref="stickmanPanel")
      DrawAvatar(
        v-if="panel.avatar"
        ref="avatarPanel")
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import WebcamStream from "~/components/WebcamStream.vue"
import DrawStickman from "~/components/DrawStickman.vue"
import DrawAvatar from "~/components/DrawAvatar.vue"
import DrawAvatarComponent from "~/components/DrawAvatar.vue"
import DrawStickmanComponent from "~/components/DrawStickman.vue"

@Component({ components: { WebcamStream, DrawStickman, DrawAvatar } })
export default class IndexPage extends Vue {
  // Visible panels
  panel = {
    webcam: false,
    stickman: false,
    avatar: true
  }

  toggleWebcamPanel() {
    this.panel.webcam = !this.panel.webcam
    this.$nextTick(() => {
      if (this.panel.stickman) {
        ;(this.$refs.stickmanPanel as DrawStickmanComponent).painter.engine.resize()
      }
      if (this.panel.avatar) {
        ;(this.$refs.avatarPanel as DrawAvatarComponent).painter.engine.resize()
      }
    })
  }
}
</script>

<style module>
.mainGrid {
  display: grid;
  height: var(--desktop-app-height);
  gap: 0.6rem;
  grid-template-columns: 80px 1fr;
}
.mainGrid.webcam {
  grid-template-columns: 80px 352px 1fr;
}
</style>
