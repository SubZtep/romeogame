<template lang="pug">
canvas(ref="render" :class="{ [$style.canvas]: true, [$style.jointError]: !hasAllJoints }")
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import PaintStickman from "~/scripts/paint-stickman"
import * as BABYLON from "babylonjs"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { TPoseStorageName } from "~/scripts/settings"
import { PosenetBoneJoint as PBJ } from "~/types/joints"

@Component
export default class DrawStickmanComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  @Getter("getPosenetJoints", { namespace: "player" }) posenetJoints
  @Getter("getPosenetBones", { namespace: "player" }) posenetBones

  painter: PaintStickman
  jointMeshes: Map<string, BABYLON.Mesh> = new Map<string, BABYLON.Mesh>()
  boneLines: BABYLON.LinesMesh[] = []
  hasAllJoints: boolean = true

  @Watch("posenetJoints")
  onPosenetJointsChange(joints: Map<string, BABYLON.Vector3>) {
    this.updateJointMeshes(joints)
  }

  @Watch("posenetBones")
  onPosenetBonesChange(bones: Map<string, BABYLON.Vector3[]>) {
    this.updateBoneLines(bones)
  }

  mounted() {
    this.painter = new PaintStickman(this.$refs.render as HTMLCanvasElement)
    this.painter.addUniversalCamera()
    //this.painter.scene.debugLayer.show()

    this.drawJoints()
    this.painter.gameLoop()
  }

  beforeDestroy() {
    this.painter.stopBabylon()
  }

  resizeEngine() {
    this.painter.engine.resize()
  }

  /** Create all the posenet joints, not on the fly coz of colours */
  drawJoints() {
    const mat = this.painter.materials
    const mes = this.jointMeshes
    mes.set(PBJ.nose, this.painter.createJoint(mat.get("red"), PBJ.nose))
    mes.set(PBJ.leftEye, this.painter.createJoint(mat.get("green"), PBJ.leftEye))
    mes.set(PBJ.rightEye, this.painter.createJoint(mat.get("green"), PBJ.rightEye))
    mes.set(PBJ.leftEar, this.painter.createJoint(mat.get("white"), PBJ.leftEar))
    mes.set(PBJ.rightEar, this.painter.createJoint(mat.get("white"), PBJ.rightEar))
    mes.set(PBJ.leftShoulder, this.painter.createJoint(mat.get("red"), PBJ.leftShoulder))
    mes.set(PBJ.rightShoulder, this.painter.createJoint(mat.get("red"), PBJ.rightShoulder))
    mes.set(PBJ.leftElbow, this.painter.createJoint(mat.get("red"), PBJ.leftElbow))
    mes.set(PBJ.rightElbow, this.painter.createJoint(mat.get("red"), PBJ.rightElbow))
    mes.set(PBJ.leftWrist, this.painter.createJoint(mat.get("magenta"), PBJ.leftWrist))
    mes.set(PBJ.rightWrist, this.painter.createJoint(mat.get("magenta"), PBJ.rightWrist))
    mes.set(PBJ.leftHip, this.painter.createJoint(mat.get("red"), PBJ.leftHip))
    mes.set(PBJ.rightHip, this.painter.createJoint(mat.get("red"), PBJ.rightHip))
    mes.set(PBJ.leftKnee, this.painter.createJoint(mat.get("red"), PBJ.leftKnee))
    mes.set(PBJ.rightKnee, this.painter.createJoint(mat.get("red"), PBJ.rightKnee))
    mes.set(PBJ.leftAnkle, this.painter.createJoint(mat.get("black"), PBJ.leftAnkle))
    mes.set(PBJ.rightAnkle, this.painter.createJoint(mat.get("black"), PBJ.rightAnkle))
  }

  /** Update joint mesh positions */
  updateJointMeshes(joints: Map<string, BABYLON.Vector3>) {
    const jointNames: string[] = Object.values(PBJ)
    this.hasAllJoints = jointNames.length === joints.size

    jointNames.forEach(jointName => {
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
  /** Set the camera position only once (for the first joint)  */
  setCameraPos(pos: BABYLON.Vector3) {
    if (!this.isCameraPosed) {
      this.painter.camera.position = new BABYLON.Vector3(pos.x, pos.y, -500)
      this.isCameraPosed = true
    }
  }

  /** Update skeleton */
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
  border: 5px solid transparent;
}

@keyframes blinking {
  0% {
    border: 5px solid transparent;
  }
  100% {
    border: 5px solid red;
  }
}

.jointError {
  animation: blinking 1s infinite;
}
</style>
