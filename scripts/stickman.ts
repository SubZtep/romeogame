import { Keypoints } from "~/types/pose"
import { TPoseStorageName } from "~/scripts/settings"
import { PosenetBones } from "~/types/bones"
import * as BABYLON from "babylonjs"
import { Vector2D } from "@tensorflow-models/posenet/dist/types"

export default class Stickman {
  tPose: Keypoints
  tPoser: Map<string, BABYLON.Vector2>

  constructor(tPose: Keypoints | null = null) {
    if (tPose !== null) {
      this.tPose = tPose
    }
  }

  loadFromStorage(): boolean {
    const tPoseStr: string | null = localStorage.getItem(TPoseStorageName)
    if (tPoseStr !== null) {
      this.tPose = JSON.parse(tPoseStr)
      return true
    }
    return false
  }

  transformPositions() {
    if (this.tPose === null) {
      throw new Error("No T-pose initialised")
    }

    const disposition = new BABYLON.Vector2(this.tPose.nose.x, this.tPose.nose.y)
    this.tPoser = new Map<string, BABYLON.Vector2>()
    Object.keys(PosenetBones).forEach((key: string) => {
      //const pos = new BABYLON.Vector2(this.tPose[key].x, this.tPose[key].y)
      //const pos: Vector2D = this.tPose[key]

      //TODO: dunno why it is not working im tired and i go to sleep, fix it l8r, cu me! :)

      const pos = this.tPose[key]
      console.log("XXX", pos)
      //console.log("YYY", Object.keys(pos))

      // const posePos = new BABYLON.Vector2(pos.x, pos.y)
      // console.log("posePos", posePos)

      //this.tPoser.set(key, new BABYLON.Vector2(pos.x, pos.y).subtract(disposition))
      //this.tPoser.set(key, new BABYLON.Vector2(pos.x, pos.y).subtract(disposition))
    })
    // console.log("this.tPoser", this.tPoser)
  }
}
