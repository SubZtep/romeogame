<template lang="pug">
div
  button(v-if="poseDetection" @click="poseDetection = false") STOP POSE DETECTION
  button(v-else @click="detectPoseInRealTime") START POSE DETECTION

  .relative(
    :class="$style.cb"
    :style="`width: ${videoWidth}px; height: ${videoHeight}px`")

    video.absolute.border-dashed.border-4.border-red-600(
      ref="video"
      :class="$style.video"
      :style="`width: ${videoWidth}px; height: ${videoHeight}px`"
      playsinline)

    canvas.absolute.border-dotted.border-4.border-red-800(
      ref="output"
      :class="$style.cb"
      :style="`width: ${videoWidth}px; height: ${videoHeight}px`")

</template>

<script lang="ts">
import { Component, Vue, Prop, Action } from "nuxt-property-decorator"
import Poses from "~/scripts/poses"

declare let navigator: any

@Component
export default class WebcamStreamComponent extends Vue {
  @Prop({ default: 352 }) videoWidth!: number
  @Prop({ default: 288 }) videoHeight!: number

  poseDetection = false

  ctx!: CanvasRenderingContext2D
  video!: HTMLVideoElement
  poses!: any

  @Action("setKeypoints", { namespace: "player" }) setKeypoints: Function
  async mounted() {
    this.video = await this.loadVideo()

    const canvas = this.$refs.output as HTMLCanvasElement
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    canvas.width = this.videoWidth
    canvas.height = this.videoHeight

    //await this.detectPoseInRealTime()
  }

  get isMobile(): boolean {
    return /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent)
  }

  async setupCamera(): Promise<HTMLVideoElement> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Browser API navigator.mediaDevices.getUserMedia not available")
    }

    const video: HTMLVideoElement = this.$refs.video as HTMLVideoElement
    video.width = this.videoWidth
    video.height = this.videoHeight
    // video.style.width = this.videoWidth + "px"
    // video.style.height = this.videoHeight + "px"

    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: this.videoWidth,
        height: this.videoHeight
        // width: this.isMobile ? undefined : this.videoWidth,
        // height: this.isMobile ? undefined : this.videoHeight
      }
    })

    // Webcam settings
    // https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints
    // console.log("Supported Constraints", navigator.mediaDevices.getSupportedConstraints())
    // await stream.getVideoTracks()[0].applyConstraints({
    //   frameRate: { exact: 30 }
    // })

    video.srcObject = stream

    //console.log("STREAM", stream.getVideoTracks()[0].getSettings())

    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        resolve(video)
      }
    })
  }

  async loadVideo() {
    const video: HTMLVideoElement = await this.setupCamera()
    video.play()
    return video
  }

  async detectPoseInRealTime() {
    this.poses = new Poses(this.video, this.ctx, this.isMobile)
    await this.poses.init()

    this.poseDetection = true
    await this.posesLoop()
  }

  async posesLoop() {
    const minPoseConfidence = 0.1

    const pose = await this.poses.poseDetectionFrame()
    if (pose.score >= minPoseConfidence) {
      this.setKeypoints(pose.keypoints)
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
}
</style>
