import { Keypoints } from "~/types/pose"
import { TPoseStorageName } from "~/scripts/settings"
import { PosenetBones } from "~/types/bones"
import * as BABYLON from "babylonjs"
import { Vector2D } from "@tensorflow-models/posenet/dist/types"

export default class Stickman {
  /** Raw user data */
  tPose: Keypoints | null = null
  /** Raw user data prepared */
  rawTPose: Map<string, BABYLON.Vector2> | null = null
  /** Transformed user data for Avatar */
  tPoser: Map<string, BABYLON.Vector2> | null = null

  constructor(tPose: Keypoints | null = null) {
    if (tPose !== null) {
      this.tPose = tPose
    }
  }

  /**
   * Load raw user keypoints
   */
  loadFromStorage(): boolean {
    const tPoseStr: string | null = localStorage.getItem(TPoseStorageName)
    if (tPoseStr !== null) {
      this.tPose = JSON.parse(tPoseStr)
      return true
    }
    return false
  }

  /**
   * Populate `rawTPose`
   */
  prepareRawData() {
    if (this.tPose === null) {
      throw new Error("No raw T-pose initialised")
    }

    this.rawTPose = new Map<string, BABYLON.Vector2>()
    Object.entries(this.tPose).forEach(item => {
      this.rawTPose.set(item[0], new BABYLON.Vector2(item[1].x, item[1].y))
    })
  }

  /**
   * Transform user keypoints for avatar
   */
  transformPositions() {
    if (this.rawTPose === null) {
      throw new Error("No prepared T-pose initialised")
    }

    const disposition = this.rawTPose.get("nose").clone()
    const scale = new BABYLON.Vector2(0.1, 0.1)
    this.tPoser = new Map<string, BABYLON.Vector2>()

    this.rawTPose.forEach((pos: BABYLON.Vector2, key: string) => {
      this.tPoser.set(key, pos.subtract(disposition).multiply(scale))
    })

    console.log("this.tPoser", this.tPoser)
  }
}
