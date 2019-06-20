<template lang="pug">
canvas(ref="render" :class="$style.canvas")
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import PaintAvatar from "~/scripts/paint-avatar"
import Avatar from "~/scripts/avatar"
import * as BABYLON from "babylonjs"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { TPoseStorageName } from "~/scripts/settings"
import Stickman from "~/scripts/stickman"
import { getPosenetJointNames, string2map } from "~/scripts/utils"

@Component
export default class DrawAvatarComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  @Getter("getPosenetJoints", { namespace: "player" }) posenetJoints: Map<string, BABYLON.Vector3>
  @Getter("getPosenetBones", { namespace: "player" }) posenetBones: Map<string, BABYLON.Vector3[]>

  loaded = false
  painter: PaintAvatar
  avatar: Avatar
  stickman: Stickman

  resizeEngine() {
    this.painter.engine.resize()
  }

  mounted() {
    this.painter = new PaintAvatar(this.$refs.render as HTMLCanvasElement)
    this.painter.addArcRorateCamera()
    //this.painter.scene.debugLayer.show()
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

  beforeDestroy() {
    this.painter.stopBabylon()
  }

  onAvatarImported(meshes, particleSystems, skeletons) {
    this.avatar = new Avatar(meshes[0], skeletons[0])
    this.avatar.setJoints()
    //this.avatar.jointWalker(this.avatar.rootJoint)
    this.doTPose()
  }

  doTPose() {
    const poseStr: string | null = localStorage.getItem(TPoseStorageName)
    if (poseStr === null) return

    // Init stickman
    this.stickman = new Stickman()
    this.stickman.pose = string2map(poseStr) as Map<string, BABYLON.Vector3>
    this.stickman.dirtyResize()
    this.stickman.setJoints(this.avatar)

    // Create materials for joints
    const blue: BABYLON.Material = this.painter.createMaterial(
      BABYLON.Color4.FromColor3(BABYLON.Color3.Blue())
    )
    const yellow: BABYLON.Material = this.painter.createMaterial(
      BABYLON.Color4.FromColor3(BABYLON.Color3.Yellow())
    )

    // Draw joints
    // this.stickman.pose.forEach((position, jointName) => {
    //   this.painter.createSphere(blue, position, 0.5)
    // })
    const ojNames = getPosenetJointNames()
    this.stickman.jointsWalker(this.stickman.rootJoint)
    this.stickman.joints.forEach(joint => {
      this.painter.createSphere(ojNames.includes(joint.name) ? blue : yellow, joint.position, 0.5)
    })
  }
}
</script>

<style module>
.canvas {
  width: 100%;
  height: var(--desktop-app-height);
}
</style>
