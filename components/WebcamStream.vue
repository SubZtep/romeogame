<template lang="pug">
div
  button(v-if="poseDetection" @click="poseDetection = false") STOP POSE DETECTION
  button(v-else @click="detectPoseInRealTime") START POSE DETECTION

  .relative(
    :class="$style.cb"
    :style="`width: ${width}px; height: ${height}px`")

    video.absolute.border-dashed.border-4.border-red-600(
      ref="video"
      :class="{ [$style.video]: !haluCam }"
      playsinline
      :style="`width: ${width}px; height: ${height}px`")

    canvas.absolute.border-dotted.border-4.border-red-800(
      ref="output"
      :class="{ [$style.cb]: true, 'opacity-50': haluCam }"
      :style="`width: ${width}px; height: ${height}px`")

</template>

<script lang="ts">
import { Component, Vue, Prop, Action } from "nuxt-property-decorator"
import Poses from "~/scripts/poses"
import { Pose } from "@tensorflow-models/posenet/dist/types"
import { getAdjacentKeyPoints } from "@tensorflow-models/posenet/dist/util"
import { minPoseConfidence, minPartConfidence, haluCam } from "~/scripts/settings"

declare let navigator: any

@Component
export default class WebcamStreamComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  haluCam: boolean = haluCam
  poseDetection = false

  ctx!: CanvasRenderingContext2D
  video!: HTMLVideoElement
  stream!: MediaStream
  poses!: Poses

  @Action("setKeypoints", { namespace: "player" }) setKeypoints: Function
  @Action("setAdjacents", { namespace: "player" }) setAdjacents: Function

  async mounted() {
    // Load video
    this.video = await this.setupCamera()
    this.video.play()

    const canvas = this.$refs.output as HTMLCanvasElement
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    canvas.width = this.width
    canvas.height = this.height

    this.detectPoseInRealTime()
  }

  beforeDestroy() {
    this.poseDetection = false
    this.video.pause()
    this.stream.getTracks()[0].stop()
  }

  get isMobile(): boolean {
    return /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent)
  }

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
        // width: this.isMobile ? undefined : this.width,
        // height: this.isMobile ? undefined : this.height
      }
    })

    // Webcam settings
    // https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints
    // console.log("Supported Constraints", navigator.mediaDevices.getSupportedConstraints())
    // await stream.getVideoTracks()[0].applyConstraints({
    //   frameRate: { exact: 30 }
    // })

    video.srcObject = this.stream

    //console.log("STREAM", stream.getVideoTracks()[0].getSettings())

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        resolve(video)
      }
    })
  }

  async detectPoseInRealTime() {
    this.poses = new Poses(this.video, this.ctx, this.isMobile)
    await this.poses.init()

    this.poseDetection = true
    await this.posesLoop()
  }

  async posesLoop() {
    const pose: Pose = await this.poses.poseDetectionFrame(minPoseConfidence, minPartConfidence)
    if (pose.score >= minPoseConfidence) {
      this.setKeypoints(pose.keypoints)
      this.setAdjacents(getAdjacentKeyPoints(pose.keypoints, minPartConfidence))
    }

    if (this.poseDetection) {
      window.requestAnimationFrame(this.posesLoop)
    }
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
