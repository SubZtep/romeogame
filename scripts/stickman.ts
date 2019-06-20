import * as BABYLON from "babylonjs"
import { poseFlipXY, poseMove } from "~/scripts/utils"

export default class Stickman {
  pose: Map<string, BABYLON.Vector3>

  dirtyResize() {
    const nosePos: BABYLON.Vector3 = this.pose.get("nose")
    poseFlipXY(this.pose)
    poseMove(this.pose, new BABYLON.Vector3(-nosePos.x, -nosePos.y + 85, 1))
    this.pose.forEach(position => {
      position.x /= 30
      position.y /= 30
    })
  }
}
