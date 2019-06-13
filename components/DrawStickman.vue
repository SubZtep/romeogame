<template lang="pug">
canvas(ref="render" :class="$style.canvas")
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import PaintStickman from "~/scripts/paint-stickman"
import * as BABYLON from "babylonjs"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { Keypoints, Keymeshes } from "~/types/pose"
import { TPoseStorageName } from "~/scripts/settings"

@Component
export default class DrawStickmanComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  @Getter("getKeypoints", { namespace: "player" }) getKeypoints
  @Getter("getAdjacents", { namespace: "player" }) getAdjacents

  painter: PaintStickman
  joints: Keymeshes
  skeletonLines: BABYLON.LinesMesh[]

  @Watch("getKeypoints")
  onKeypointsChange(keypoints: Keypoint[]) {
    this.updateJoints(keypoints)
  }

  @Watch("getAdjacents")
  onAdjacentsChange(adjacents: Keypoint[][]) {
    this.updateSkeleton(adjacents)
  }

  mounted() {
    this.painter = new PaintStickman(this.$refs.render as HTMLCanvasElement)
    this.initJoints()
    this.skeletonLines = []
    this.painter.gameLoop()
  }

  resizeEngine() {
    this.painter.engine.resize()
  }

  initJoints() {
    this.joints = {
      nose: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      leftEye: this.painter.createJoint(new BABYLON.Color3(0, 1, 0)),
      rightEye: this.painter.createJoint(new BABYLON.Color3(0, 1, 0)),
      leftEar: this.painter.createJoint(new BABYLON.Color3(1, 1, 1)),
      rightEar: this.painter.createJoint(new BABYLON.Color3(1, 1, 1)),
      leftShoulder: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      rightShoulder: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      leftElbow: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      rightElbow: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      leftWrist: this.painter.createJoint(new BABYLON.Color3(1, 0, 1)),
      rightWrist: this.painter.createJoint(new BABYLON.Color3(1, 0, 1)),
      leftHip: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      rightHip: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      leftKnee: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      rightKnee: this.painter.createJoint(new BABYLON.Color3(1, 0, 0)),
      leftAnkle: this.painter.createJoint(new BABYLON.Color3(0, 0, 0)),
      rightAnkle: this.painter.createJoint(new BABYLON.Color3(0, 0, 0))
    }
    const tPoseStr: string | null = localStorage.getItem(TPoseStorageName)
    if (tPoseStr !== null) {
      const tPose: Keypoints = JSON.parse(tPoseStr)
      for (let [key, value] of Object.entries(tPose)) {
        this.joints[key].position = new BABYLON.Vector3(value.x, value.y, 0)
      }
    }
  }

  updateJoints(keypoints: Keypoint[]) {
    let pos = BABYLON.Vector3.Zero()
    keypoints.forEach((point: Keypoint) => {
      pos = new BABYLON.Vector3(point.position.x, point.position.y, 0)
      this.joints[point.part].position = pos
    })
  }

  updateSkeleton(adjacents: Keypoint[][]) {
    // delete all bones
    this.skeletonLines.forEach(line => {
      line.dispose()
    })
    this.skeletonLines = []

    // create all bones
    adjacents.forEach((adjacent: Keypoint[]) => {
      const line = this.painter.createBone(adjacent[0], adjacent[1])
      this.skeletonLines.push(line)
    })
  }
}
</script>

<style module>
.canvasGrid {
  height: 400px;
  display: grid;
  grid-template-rows: auto min-content;
}
.formGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.canvas {
  width: 100%;
  height: 100%;
}
</style>
