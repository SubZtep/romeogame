import Painter from "./painter"
import * as BABYLON from "babylonjs"
import { Keypoint } from "@tensorflow-models/posenet/dist/types"

export default class PaintAvatar extends Painter {
  /**
   * Representation of a join (cube atm)
   * @param color Joint color
   */
  createJoint(color: BABYLON.Color3): BABYLON.Mesh {
    const mat = new BABYLON.StandardMaterial("red", this.scene)
    mat.alpha = 1
    mat.diffuseColor = color

    const sphere = BABYLON.MeshBuilder.CreateBox("", { size: 10 }, this.scene)
    sphere.material = mat
    sphere.position = new BABYLON.Vector3(0, 0, 0)

    return sphere
  }

  /**
   * Representation of a bone in skeleton (line atm)
   * @param color
   */
  createBone(from: Keypoint, to: Keypoint): BABYLON.LinesMesh {
    const line = BABYLON.MeshBuilder.CreateLines(`${from.part}_${to.part}`, {
      points: [
        new BABYLON.Vector3(from.position.x, from.position.y),
        new BABYLON.Vector3(to.position.x, to.position.y)
      ]
    })
    return line
  }
}
