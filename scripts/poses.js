import * as posenet from "@tensorflow-models/posenet"
import { drawBoundingBox, drawKeypoints, drawSkeleton } from "~/scripts/demo_util"

export default class Poses {
  constructor(video, ctx, isMobile = false) {
    this.video = video
    this.ctx = ctx
    this.isMobile = isMobile
  }

  // constructor() {
  //   return async () => {
  //     this.net = await posenet.load({
  //       architecture: this.isMobile ? "MobileNetV1" : "ResNet50",
  //       outputStride: this.isMobile ? 16 : 32,
  //       inputResolution: 257,
  //       multiplier: this.isMobile ? 0.5 : 1.0
  //     })
  //     return this
  //   }
  // }

  async init() {
    // this.net = await posenet.load({
    //   architecture: this.isMobile ? "MobileNetV1" : "ResNet50",
    //   outputStride: this.isMobile ? 16 : 32,
    //   inputResolution: 257,
    //   multiplier: this.isMobile ? 0.5 : 1.0
    // })
    this.net = await posenet.load()
    console.log("NET", this.net)
  }

  async poseDetectionFrame() {
    let poses = []
    const minPoseConfidence = 0.1
    const minPartConfidence = 0.5

    // Single pose
    const pose = await this.net.estimateSinglePose(this.video, 1, {
      flipHorizontal: true,
      decodingMethod: "single-person"
    })
    poses = poses.concat(pose)

    console.log("POSES", poses)

    this.ctx.clearRect(0, 0, this.videoWidth, this.videoHeight)

    // show video (?)
    this.ctx.save()
    this.ctx.scale(-1, 1)
    this.ctx.translate(-this.videoWidth, 0)
    this.ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight)
    this.ctx.restore()

    poses.forEach(({ score, keypoints }) => {
      if (score >= minPoseConfidence) {
        // Points
        drawKeypoints(keypoints, minPartConfidence, this.ctx)

        // Skeleton
        drawSkeleton(keypoints, minPartConfidence, this.ctx)

        // Bounding box
        drawBoundingBox(keypoints, this.ctx)
      }
    })
  }
}
