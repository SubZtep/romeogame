<template lang="pug">
div
  canvas(ref="render" :class="$style.canvas")
  .mt-1
    button(@click="painter.toggleDebugLayer()") Toggle Debug Layer
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import PaintAvatar from "~/scripts/paint-avatar"
import Avatar from "~/scripts/avatar"
import * as BABYLON from "babylonjs"
import { Keypoint } from "@tensorflow-models/posenet/dist/types"
import { DudeBones as DB } from "~/types/bones"
import { TPoseStorageName } from "~/scripts/settings"

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
    this.initJoints()
  }

  initJoints() {
    const tPoseStr: string | null = localStorage.getItem(TPoseStorageName)
    if (tPoseStr !== null) {
      this.avatar.setJoints(JSON.parse(tPoseStr))
    }
    // this.avatar.rootJoint
    //   .child("crest")
    //   .child("waist")
    //   .child("upperBody1")
    //   .child("upperBody2")
    //   .child("upperBody3")
    //   .child("upperBody4")
    //   .child("head").position = BABYLON.Vector3.Zero()
  }
}
</script>

<style module>
.canvas {
  width: 100%;
  /*height: 100%;*/
  height: var(--desktop-app-height);
}
</style>
