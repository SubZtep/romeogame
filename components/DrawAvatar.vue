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
import { jointWalker, string2map, v2dSubtract } from "~/scripts/utils"
import { IJoint } from "~/types/joint"
import { PosenetBoneJoint, BoneJoint as BJ } from "~/types/joints"

@Component
export default class DrawAvatarComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  @Getter("getPosenetJoints", { namespace: "player" }) posenetJoints: Map<string, BABYLON.Vector3>
  @Getter("getPosenetBones", { namespace: "player" }) posenetBones: Map<string, BABYLON.Vector3[]>

  // @Watch("posenetJoints")
  // onPosenetJointsChange(joints: Map<string, BABYLON.Vector3>) {
  //   this.doTPose(joints)
  // }

  scaleAmount = 0.1
  loaded = false
  painter: PaintAvatar
  avatar: Avatar
  stickman: Stickman
  /** Stickman's joint spheres for debug  */
  stickmanSpheres: BABYLON.Mesh[] = []

  resizeEngine() {
    this.painter.engine.resize()
  }

  mounted() {
    this.painter = new PaintAvatar(this.$refs.render as HTMLCanvasElement)
    this.painter.addArcRorateCamera()
    this.painter.scene.debugLayer.show()
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
    this.avatar.scale(this.scaleAmount)
    this.avatar.setJoints()
    this.doTPose()
  }

  /** Retrieve T-pose coordinated from local storage */
  getStoredTPose(): Map<PosenetBoneJoint, BABYLON.Vector3> {
    const poseStr: string | null = localStorage.getItem(TPoseStorageName)
    if (poseStr === null) {
      throw new Error("No pose found")
    }
    return string2map(poseStr)
  }

  drawStickmanJoints() {
    // Delete old spheres
    for (const sphere of this.stickmanSpheres) {
      sphere.dispose()
    }
    this.stickmanSpheres = []

    // Draw stickman joints
    for (const joint of jointWalker(this.stickman.rootJoint)) {
      this.stickmanSpheres.push(
        this.painter.createSphere(
          this.painter.materials.get(
            Object.values(PosenetBoneJoint).includes(joint.name) ? "blue" : "yellow"
          ),
          joint.transform.position,
          0.3
        )
      )
    }

    console.log("stickmanSpheres", this.stickmanSpheres)
  }

  doTPose() {
    // Init stickman
    this.stickman = new Stickman()
    this.stickman.pose = this.getStoredTPose()
    this.stickman.dirtyResize()
    this.stickman.setJoints(this.avatar)
    this.drawStickmanJoints()

    // Follow basics
    // const pos1 = this.stickman.getJoint(BJ.leftElbow)
    // this.avatar.getJoint(BJ.leftElbow).transform = pos1.transform
    // const pos2 = this.stickman.getJoint(BJ.leftWrist)
    // this.avatar.getJoint(BJ.leftWrist).transform = pos2.transform
  }
}
</script>

<style module>
.canvas {
  width: 100%;
  height: var(--desktop-app-height);
}
</style>
