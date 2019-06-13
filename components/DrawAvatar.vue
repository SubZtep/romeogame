<template lang="pug">
div
  canvas(ref="render" :class="$style.canvas")
  .mt-1.text-center
    button(@click="painter.toggleDebugLayer()") Toggle Debug Layer
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import PaintAvatar from "~/scripts/paint-avatar"
import Avatar from "~/scripts/avatar"
import * as BABYLON from "babylonjs"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { DudeBones as DB } from "~/types/bones"
import { Keypoints } from "~/types/pose"
import { TPoseStorageName } from "~/scripts/settings"
import { Vector3 } from "babylonjs"
import Stickman from "~/scripts/stickman"

@Component
export default class DrawAvatarComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  @Getter("getKeypoints", { namespace: "player" }) getKeypoints

  loaded = false
  painter: PaintAvatar
  avatar: Avatar

  @Watch("getKeypoints")
  onKeypointsChange(keypoints: Keypoint[]) {
    this.avatar.updateKeypoints(keypoints)
  }

  resizeEngine() {
    this.painter.engine.resize()
  }

  mounted() {
    this.painter = new PaintAvatar(this.$refs.render as HTMLCanvasElement)
    this.painter.gameLoop()

    // Load Dude model
    BABYLON.SceneLoader.ImportMesh(
      "him",
      "/models/Dude/",
      "dude.babylon",
      this.painter.scene,
      this.onAvatarImported
    )
  }

  onAvatarImported(meshes, particleSystems, skeletons) {
    this.avatar = new Avatar(meshes[0], skeletons[0])
    this.avatar.setJoints()
    this.avatar.jointWalker(this.avatar.rootJoint)
    this.doTPose()
  }

  doTPose() {
    // Init Stickman
    const stickman: Stickman = new Stickman()
    if (!stickman.loadFromStorage()) {
      throw new Error("No T-pose in local storage")
    }

    // Create material for joints
    const mat: BABYLON.Material = this.painter.createMaterial(
      BABYLON.Color4.FromColor3(BABYLON.Color3.Blue())
    )

    stickman.transformPositions()

    // Draw joints
    //console.log("tPoser", stickman.tPoser)
    // for (let [key, value] of Object.entries(stickman.tPoser)) {
    //   let x = this.painter.createSphere(mat, new BABYLON.Vector3(value.x, value.y, 0), 2)
    // }
  }
}
</script>

<style module>
.canvas {
  width: 100%;
  height: var(--desktop-app-height);
}
</style>
