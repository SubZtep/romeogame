<template lang="pug">
div
  .relative(
    v-show="!loading && video !== null"
    :class="$style.cb"
    :style="`width: ${width}px; height: ${height}px`")

    video.absolute.border-dashed.border-4.border-red-600(
      ref="video"
      :class="{ [$style.video]: !haluCam }"
      playsinline
      :style="`width: ${width}px; height: ${height}px`")

    canvas.absolute.border-dotted.border-4.border-red-800(
      ref="output"
      v-show="poseDetection"
      :class="{ [$style.cb]: true, 'opacity-50': haluCam }"
      :style="`width: ${width}px; height: ${height}px`")

  .text-red-600.text-4xl.font-bold(v-if="!loading && video === null")
    | Webcam is in the hole with spiders!?
</template>

<script lang="ts">
import { Component, Vue, Prop, Action, Watch } from "nuxt-property-decorator"
import * as BABYLON from "babylonjs"
import { Pose, Keypoint } from "@tensorflow-models/posenet/dist/types"
import { getAdjacentKeyPoints } from "@tensorflow-models/posenet/dist/util"
import Poses from "~/scripts/poses"
import { keypointsFlipY } from "~/scripts/utils"
import { minPoseConfidence, minPartConfidence, haluCam } from "~/scripts/settings"

declare let navigator: any

/**
 * Webcam input, populate Vuex player store
 */
@Component
export default class WebcamStreamComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number
  @Prop({ default: false }) poseDetection!: boolean
  @Prop({ default: false }) skeleton!: boolean

  loading = true
  haluCam: boolean = haluCam

  ctx!: CanvasRenderingContext2D
  video!: HTMLVideoElement | null
  stream!: MediaStream
  poses!: Poses

  @Action("resetPosenetJoints", { namespace: "player" }) resetPosenetJoints: Function
  @Action("setPosenetJoint", { namespace: "player" }) setPosenetJoint: Function
  @Action("resetPosenetBones", { namespace: "player" }) resetPosenetBones: Function
  @Action("setPosenetBone", { namespace: "player" }) setPosenetBone: Function

  @Watch("poseDetection", { immediate: true })
  onPoseDetectionChanged(val: boolean) {
    if (val) {
      this.detectPoseInRealTime()
    }
  }

  async mounted() {
    // Load camera stream as video
    try {
      this.video = await this.setupCamera()
    } catch (e) {
      console.log("Error setup camera", e)
      this.video = null
    }
    if (this.video !== null) {
      this.video.play()
      const canvas = this.$refs.output as HTMLCanvasElement
      this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
      canvas.width = this.width
      canvas.height = this.height
    }
    this.loading = false
  }

  beforeDestroy() {
    // Destroy webcam stream
    if (this.video !== null) {
      this.video.pause()
      this.stream.getTracks()[0].stop()
    }
  }

  /** Setup webcam */
  async setupCamera(): Promise<HTMLVideoElement> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Browser API navigator.mediaDevices.getUserMedia not available")
    }

    const video: HTMLVideoElement = this.$refs.video as HTMLVideoElement
    video.width = this.width
    video.height = this.height

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: this.width,
        height: this.height
      }
    })

    video.srcObject = this.stream

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        resolve(video)
      }
    })
  }

  /** Init Posenet */
  async detectPoseInRealTime() {
    this.poses = new Poses(this.video, this.ctx, false)
    await this.poses.init()
    await this.posesLoop()
  }

  /** Pose detection frame */
  async posesLoop() {
    // Get keypoints and draw on camera view
    const pose: Pose = await this.poses.poseDetectionFrame(minPoseConfidence, minPartConfidence)
    keypointsFlipY(pose.keypoints) //FIXME: store with correct coords but doulecheck poseDetectionFrame

    this.resetPosenetJoints()
    this.resetPosenetBones()

    if (pose.score >= minPoseConfidence) {
      this.setPosenetJoints(pose.keypoints)

      // Set skeleton
      if (this.skeleton) {
        this.setPosenetBones(pose.keypoints)
      }
    }

    if (this.poseDetection && this.video && !this.video.paused) {
      window.requestAnimationFrame(this.posesLoop)
    }
  }

  setPosenetJoints(keypoints: Keypoint[]) {
    // Set keypoints
    keypoints.forEach((keypoint: Keypoint) => {
      if (keypoint.score >= minPartConfidence) {
        this.setPosenetJoint({
          jointName: keypoint.part,
          position: new BABYLON.Vector3(keypoint.position.x, keypoint.position.y)
        })
      }
    })
  }

  setPosenetBones(keypoints: Keypoint[]) {
    const bonesKeypoints: Keypoint[][] = getAdjacentKeyPoints(keypoints, minPartConfidence)
    bonesKeypoints.forEach((boneKeypoints: Keypoint[]) => {
      if (
        boneKeypoints[0].score >= minPartConfidence &&
        boneKeypoints[1].score >= minPartConfidence
      ) {
        this.setPosenetBone({
          jointNames: `${boneKeypoints[0].part}-${boneKeypoints[1].part}`,
          positions: [
            new BABYLON.Vector3(boneKeypoints[0].position.x, boneKeypoints[0].position.y),
            new BABYLON.Vector3(boneKeypoints[1].position.x, boneKeypoints[1].position.y)
          ]
        })
      }
    })
  }
}
</script>

<style module>
.video {
  transform: scaleX(-1);
}
.cb {
  box-sizing: content-box;
  filter: invert(100%) hue-rotate(250deg);
}
</style>
