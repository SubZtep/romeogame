<template lang="pug">
canvas(ref="render" :class="$style.canvas")
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import PaintAvatar from "~/scripts/paint-avatar"
import Avatar from "~/scripts/avatar"
import * as BABYLON from "babylonjs"
import Joints from "~/scripts/joints"
import Transform from "~/scripts/transform"
import { Keypoint } from "@tensorflow-models/posenet/dist/types"
import { DudeBones } from "~/types/bones"
import { transform } from "@babel/core"

@Component
export default class DrawAvatarComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number
  @Prop({ default: true }) running!: boolean

  @Getter("getKeypoints", { namespace: "player" }) getKeypoints

  loaded = false
  painter: PaintAvatar
  //transform: Transform
  avatar: Avatar

  @Watch("getKeypoints")
  onKeypointsChange(keypoints: Keypoint[]) {
    this.avatar.updateKeypoints(keypoints)
  }

  // @Watch("running")
  // onRunningChange(isRunning) {
  //   this.avatar.running = isRunning
  // }

  mounted() {
    // const joints = new Joints()
    // this.transform = new Transform(joints)

    this.painter = new PaintAvatar(this.$refs.render as HTMLCanvasElement)
    this.painter.gameLoop()

    BABYLON.SceneLoader.ImportMesh(
      "him",
      "/models/Dude/",
      "dude.babylon",
      this.painter.scene,
      this.onAvatarImported
    )
  }

  onAvatarImported(meshes, particleSystems, skeletons) {
    console.log("AVATAR LOADED")
    this.avatar = new Avatar(meshes[0], skeletons[0])
    //this.avatar.running = this.running
    this.loaded = true
  }
}
</script>

<style module>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
