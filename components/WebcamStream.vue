<template lang="pug">
div
  video(
    ref="video"
    :class="$style.video"
    playsinline)
  canvas(
    ref="output")


  button(v-if="poseDetection" @click="poseDetection = false") STOP POSE DETECTION
  button(v-else @click="detectPoseInRealTime") START POSE DETECTION
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"
import Poses from "~/scripts/poses"

//type navigator = any
//type posenet = any
//declare let posenet: any
declare let navigator: any

@Component
export default class WebcamStreamComponent extends Vue {
  @Prop({ default: 640 }) videoWidth!: number
  @Prop({ default: 480 }) videoHeight!: number

  poseDetection = false

  ctx!: CanvasRenderingContext2D
  video!: HTMLVideoElement
  poses!: any

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

    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: this.isMobile ? undefined : this.videoWidth,
        height: this.isMobile ? undefined : this.videoHeight
      }
    })

    // Webcam settings
    // https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints
    // console.log("Supported Constraints", navigator.mediaDevices.getSupportedConstraints())
    // await stream.getVideoTracks()[0].applyConstraints({
    //   frameRate: { exact: 30 }
    // })

    video.srcObject = stream

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
    await this.poses.poseDetectionFrame()
    if (this.poseDetection) {
      window.requestAnimationFrame(this.posesLoop)
    }
  }
}
</script>

<style module>
/* .video {
  transform: scaleX(-1);
} */
</style>
