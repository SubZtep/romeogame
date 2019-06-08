import * as BABYLON from "babylonjs"
import { Joints } from "~/types/pose"

/**
 * Calculated joint data
 */
export default class {
  data: Joints = {
    head: BABYLON.Vector3.Zero(),
    leftShoulder: BABYLON.Vector3.Zero(),
    rightShoulder: BABYLON.Vector3.Zero(),
    leftElbow: BABYLON.Vector3.Zero(),
    rightElbow: BABYLON.Vector3.Zero()
  }

  update(joint: string, val: BABYLON.Vector3) {
    this.data[joint] = val
  }

  get(joint: string): BABYLON.Vector3 {
    const coord: BABYLON.Vector3 = this.data[joint].clone()

    coord.x = 0 + coord.x
    coord.y = 6 + coord.y
    coord.z = 5

    return coord
  }
}
