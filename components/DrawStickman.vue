<template lang="pug">
canvas(ref="render" :class="$style.canvas")
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import PaintStickman from "~/scripts/paint-stickman"
import * as BABYLON from "babylonjs"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { TPoseStorageName } from "~/scripts/settings"
import { getPosenetJointNames } from "~/scripts/utils"

@Component
export default class DrawStickmanComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  @Getter("getPosenetJoints", { namespace: "player" }) getPosenetJoints
  @Getter("getPosenetBones", { namespace: "player" }) getPosenetBones

  painter: PaintStickman
  jointMeshes: Map<string, BABYLON.Mesh> = new Map<string, BABYLON.Mesh>()
  boneLines: BABYLON.LinesMesh[] = []
  materials: Map<string, BABYLON.StandardMaterial> = new Map<string, BABYLON.StandardMaterial>()

  @Watch("getPosenetJoints")
  onPosenetJointsChange(joints: Map<string, BABYLON.Vector3>) {
    this.updateJointMeshes(joints)
  }

  @Watch("getPosenetBones")
  onPosenetBonesChange(bones: Map<string, BABYLON.Vector3[]>) {
    this.updateBoneLines(bones)
  }

  mounted() {
    this.painter = new PaintStickman(this.$refs.render as HTMLCanvasElement)
    this.painter.addUniversalCamera()
    //this.painter.scene.debugLayer.show()

    this.createMaterials()
    this.drawJoints()
    this.painter.gameLoop()
  }

  beforeDestroy() {
    this.painter.stopBabylon()
  }

  createMaterials() {
    const red = new BABYLON.StandardMaterial("red", this.painter.scene)
    red.alpha = 1
    red.diffuseColor = new BABYLON.Color3(1, 0, 0)
    this.materials.set("red", red)

    const green = new BABYLON.StandardMaterial("green", this.painter.scene)
    green.alpha = 1
    green.diffuseColor = new BABYLON.Color3(0, 1, 0)
    this.materials.set("green", green)

    const white = new BABYLON.StandardMaterial("white", this.painter.scene)
    white.alpha = 1
    white.diffuseColor = new BABYLON.Color3(1, 1, 1)
    this.materials.set("white", white)

    const magenta = new BABYLON.StandardMaterial("magenta", this.painter.scene)
    magenta.alpha = 1
    magenta.diffuseColor = new BABYLON.Color3(1, 0, 1)
    this.materials.set("magenta", magenta)

    const black = new BABYLON.StandardMaterial("black", this.painter.scene)
    black.alpha = 1
    black.diffuseColor = new BABYLON.Color3(0, 0, 0)
    this.materials.set("black", black)
  }

  resizeEngine() {
    this.painter.engine.resize()
  }

  setJoints

  drawJoints() {
    this.jointMeshes.set("nose", this.painter.createJoint(this.materials.get("red"), "nose"))
    this.jointMeshes.set(
      "leftEye",
      this.painter.createJoint(this.materials.get("green"), "leftEye")
    )
    this.jointMeshes.set(
      "rightEye",
      this.painter.createJoint(this.materials.get("green"), "rightEye")
    )
    this.jointMeshes.set(
      "leftEar",
      this.painter.createJoint(this.materials.get("white"), "leftEar")
    )
    this.jointMeshes.set(
      "rightEar",
      this.painter.createJoint(this.materials.get("white"), "rightEar")
    )
    this.jointMeshes.set(
      "leftShoulder",
      this.painter.createJoint(this.materials.get("red"), "leftShoulder")
    )
    this.jointMeshes.set(
      "rightShoulder",
      this.painter.createJoint(this.materials.get("red"), "rightShoulder")
    )
    this.jointMeshes.set(
      "leftElbow",
      this.painter.createJoint(this.materials.get("red"), "leftElbow")
    )
    this.jointMeshes.set(
      "rightElbow",
      this.painter.createJoint(this.materials.get("red"), "rightElbow")
    )
    this.jointMeshes.set(
      "leftWrist",
      this.painter.createJoint(this.materials.get("magenta"), "leftWrist")
    )
    this.jointMeshes.set(
      "rightWrist",
      this.painter.createJoint(this.materials.get("magenta"), "rightWrist")
    )
    this.jointMeshes.set("leftHip", this.painter.createJoint(this.materials.get("red"), "leftHip"))
    this.jointMeshes.set(
      "rightHip",
      this.painter.createJoint(this.materials.get("red"), "rightHip")
    )
    this.jointMeshes.set(
      "leftKnee",
      this.painter.createJoint(this.materials.get("red"), "leftKnee")
    )
    this.jointMeshes.set(
      "rightKnee",
      this.painter.createJoint(this.materials.get("red"), "rightKnee")
    )
    this.jointMeshes.set(
      "leftAnkle",
      this.painter.createJoint(this.materials.get("black"), "leftAnkle")
    )
    this.jointMeshes.set(
      "rightAnkle",
      this.painter.createJoint(this.materials.get("black"), "rightAnkle")
    )
  }

  updateJointMeshes(joints: Map<string, BABYLON.Vector3>) {
    getPosenetJointNames().forEach(jointName => {
      const pos: BABYLON.Vector3 | undefined = joints.get(jointName)
      const mesh: BABYLON.Mesh = this.jointMeshes.get(jointName)
      if (pos !== undefined) {
        mesh.position = pos
        mesh.visibility = 1
        this.setCameraPos(pos.clone())
      } else {
        mesh.visibility = 0
      }
    })
  }

  isCameraPosed = false
  setCameraPos(pos: BABYLON.Vector3) {
    if (!this.isCameraPosed) {
      this.painter.camera.position = new BABYLON.Vector3(pos.x, pos.y, -500)
      this.isCameraPosed = true
    }
  }

  updateBoneLines(bones: Map<string, BABYLON.Vector3[]>) {
    // Delete all bones
    this.boneLines.forEach(line => {
      line.dispose()
    })
    this.boneLines = []

    // Create all bones
    bones.forEach((bones: BABYLON.Vector3[]) => {
      const line = this.painter.createBone(bones[0], bones[1])
      this.boneLines.push(line)
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
