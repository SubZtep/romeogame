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
import {
  jointWalker,
  getPosenetJointNames,
  getDudeJointNames,
  string2map,
  v2dSubtract
} from "~/scripts/utils"
import { IJoint } from "../types/joint"

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
  blue: BABYLON.Material
  yellow: BABYLON.Material
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

    // Create materials for joints
    this.blue = this.painter.createMaterial(BABYLON.Color4.FromColor3(BABYLON.Color3.Blue()))
    this.yellow = this.painter.createMaterial(BABYLON.Color4.FromColor3(BABYLON.Color3.Yellow()))
  }

  beforeDestroy() {
    this.painter.stopBabylon()
  }

  onAvatarImported(meshes, particleSystems, skeletons) {
    this.avatar = new Avatar(meshes[0], skeletons[0])
    this.avatar.scale(this.scaleAmount)
    this.avatar.setJoints()
    //this.avatar.jointWalker(this.avatar.rootJoint)
    this.doTPose()
  }

  /** Retrieve T-pose coordinated from local storage */
  getStoredTPose(): Map<string, BABYLON.Vector3> {
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
    const ojNames = getPosenetJointNames()
    for (const joint of jointWalker(this.stickman.rootJoint)) {
      this.stickmanSpheres.push(
        this.painter.createSphere(
          ojNames.includes(joint.name) ? this.blue : this.yellow,
          joint.position,
          0.3
        )
      )
    }
  }

  doTPose() {
    // Init stickman
    this.stickman = new Stickman()
    this.stickman.pose = this.getStoredTPose()
    this.stickman.dirtyResize()
    this.stickman.setJoints(this.avatar)
    this.drawStickmanJoints()

    // Follow basics
    const leftElbowPos = this.stickman.getJoint("leftElbow").position

    for (const joint of ["Elbow", "Wrist"]) {
      for (const side of ["left", "right"]) {
        const stickSide = side === "left" ? "right" : "left"
        let stickPos = this.stickman.getJoint(`${stickSide}${joint}`).position

        if (joint === "Elbow" && side === "right") {
          this.avatar
            .getJoint(`${side}${joint}`)
            .bone.setRotation(new BABYLON.Vector3(Math.PI / 2, 0, 0))
        }

        if (joint === "Wrist" && side === "right") {
          stickPos = v2dSubtract(leftElbowPos, this.stickman.getJoint(`right${joint}`).position)
        }

        this.avatar
          .getJoint(`${side}${joint}`)
          .bone.setPosition(
            new BABYLON.Vector3(
              stickPos.x / this.scaleAmount,
              stickPos.y / this.scaleAmount,
              stickPos.z / this.scaleAmount
            ),
            BABYLON.Space.WORLD,
            this.avatar.mesh
          )

        // this.avatar
        //   .getJoint(`${side}${joint}`)
        //   .bone.setPosition(
        //     new BABYLON.Vector3(
        //       stickPos.x / this.scaleAmount,
        //       stickPos.y / this.scaleAmount,
        //       stickPos.z / this.scaleAmount
        //     ),
        //     BABYLON.Space.WORLD,
        //     this.avatar.mesh
        //   )
      }
    }
  }

  doWebcamPose(pose: Map<string, BABYLON.Vector3> | null = null) {
    // Init stickman
    this.stickman = new Stickman()

    if (pose !== null) {
      this.stickman.pose = pose
    } else {
      const poseStr: string | null = localStorage.getItem(TPoseStorageName)
      if (poseStr === null) {
        throw new Error("No pose found")
      }
      this.stickman.pose = string2map(poseStr)
    }

    this.stickman.dirtyResize()
    this.stickman.setJoints(this.avatar)

    // Create materials for joints
    const blue: BABYLON.Material = this.painter.createMaterial(
      BABYLON.Color4.FromColor3(BABYLON.Color3.Blue())
    )
    const yellow: BABYLON.Material = this.painter.createMaterial(
      BABYLON.Color4.FromColor3(BABYLON.Color3.Yellow())
    )

    // Delete old spheres
    for (const sphere of this.stickmanSpheres) {
      sphere.dispose()
    }
    this.stickmanSpheres = []

    // Draw stickman joints
    const ojNames = getPosenetJointNames()
    for (const joint of jointWalker(this.stickman.rootJoint)) {
      this.stickmanSpheres.push(
        this.painter.createSphere(ojNames.includes(joint.name) ? blue : yellow, joint.position, 0.2)
      )
    }

    // Follow basics
    for (const side of ["left", "right"]) {
      const stickSide = side === "left" ? "right" : "left"
      const stickPos = this.stickman.getJoint(`${stickSide}Wrist`).position
      this.avatar.getJoint(`${side}Wrist`).bone.setPosition(
        //new BABYLON.Vector3(stickPos.x * 10, stickPos.y * 10, stickPos.z), // for T
        new BABYLON.Vector3(stickPos.x, stickPos.y, stickPos.z),
        BABYLON.Space.WORLD,
        this.avatar.mesh
      )
    }

    this.painter.scene.render()
  }
}
</script>

<style module>
.canvas {
  width: 100%;
  height: var(--desktop-app-height);
}
</style>
