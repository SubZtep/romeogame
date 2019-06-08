<template lang="pug">
canvas(ref="render" :class="$style.canvas")
//-div(:class="$style.canvasGrid")
  canvas(ref="render" :class="$style.canvas")
  //-div(:class="$style.formGrid")
    input(v-model="camPos.x")
    input(v-model="camPos.y")
    input(v-model="camPos.z")
    input(v-model="camRot.x")
    input(v-model="camRot.y")
    input(v-model="camRot.z")
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import Painter from "~/scripts/painter"
import * as BABYLON from "babylonjs"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { Keymeshes } from "~/types/pose"

@Component
export default class DrawAvatarComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  @Getter("getKeypoints", { namespace: "player" }) getKeypoints
  @Getter("getAdjacents", { namespace: "player" }) getAdjacents

  painter: Painter
  joints: Keymeshes
  skeletonLines: BABYLON.LinesMesh[]

  camPos = {
    x: 200,
    y: 200,
    z: 500
  }

  camRot = {
    x: 0,
    y: 3,
    z: 3
  }

  @Watch("getKeypoints")
  onKeypointsChange(keypoints: Keypoint[]) {
    this.updateJoints(keypoints)
  }

  @Watch("getAdjacents")
  onAdjacentsChange(adjacents: Keypoint[][]) {
    this.updateSkeleton(adjacents)
  }

  mounted() {
    this.painter = new Painter(this.$refs.render as HTMLCanvasElement)
    this.initJoints()
    this.skeletonLines = []
    this.painter.gameLoop()
    //this.painter.scene.debugLayer.show()

    this.painter.camera.position = new BABYLON.Vector3(this.camPos.x, this.camPos.y, this.camPos.z)
    this.painter.camera.rotation = new BABYLON.Vector3(this.camRot.x, this.camRot.y, this.camRot.z)
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
  }

  updateJoints(keypoints: Keypoint[]) {
    let pos = BABYLON.Vector3.Zero()
    keypoints.forEach((point: Keypoint) => {
      pos = new BABYLON.Vector3(point.position.x, point.position.y, 0)
      this.joints[point.part].position = pos
    })
  }

  updateSkeleton(adjacents: Keypoint[][]) {
    //FIXME: make it faster
    this.skeletonLines.forEach(line => {
      line.dispose()
    })
    this.skeletonLines = []
    adjacents.forEach((adjacent: Keypoint[]) => {
      const line = BABYLON.MeshBuilder.CreateLines(`${adjacent[0].part}_${adjacent[1].part}`, {
        points: [
          new BABYLON.Vector3(adjacent[0].position.x, adjacent[0].position.y),
          new BABYLON.Vector3(adjacent[1].position.x, adjacent[1].position.y)
        ]
      })
      this.skeletonLines.push(line)
    })

    // tired....
    // let names: { index: number; name: string }[] = [...this.skeletonLines.entries()].map(
    //   ([index, line]) => {
    //     return { index, name: line.name }
    //   }
    // )

    // console.log("NAMES0", names)

    // adjacents.forEach((adjacent: Keypoint[]) => {
    //   const name = `${adjacent[0].part}_${adjacent[1].part}`
    //   const options: any = {
    //     points: [
    //       new BABYLON.Vector3(adjacent[0].position.x, adjacent[0].position.y),
    //       new BABYLON.Vector3(adjacent[1].position.x, adjacent[1].position.y)
    //     ]
    //   }

    //   const item = names.find(item => item.name === name)
    //   const isNewLine = item === undefined

    //   if (isNewLine) {
    //     options.updatable = true
    //   } else {
    //     options.instance = this.skeletonLines[item.index]
    //   }

    //   const line = BABYLON.MeshBuilder.CreateLines(name, options)

    //   if (isNewLine) {
    //     this.skeletonLines.push(line)
    //   } else {
    //     names = names.filter(item => item.name === name)
    //   }
    // })

    // console.log("NAMES1", names)

    // // names.forEach(name => {
    // //   if (this.skeletonLines.length > 0) {
    // //     this.skeletonLines[0].dispose()
    // //   }
    // //   // this.skeletonLines.forEach(line => {
    // //   //   if (line.name === name.name) {
    // //   //     line.dispose()
    // //   //   }
    // //   // })
    // //   //this.skeletonLines = this.skeletonLines.filter(line => line.name === name.name)
    // // })
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
