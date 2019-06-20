import * as BABYLON from "babylonjs"
import Painter from "./painter"

export default class PaintStickman extends Painter {
  /**
   * Representation of a join (cube atm)
   * @param color Joint color
   */
  createJoint(material: BABYLON.StandardMaterial, jointName = ""): BABYLON.Mesh {
    const sphere = BABYLON.MeshBuilder.CreateBox(jointName, { size: 10 }, this.scene)
    sphere.material = material
    sphere.position = new BABYLON.Vector3(0, 0, 0)
    return sphere
  }

  /**
   * Representation of a bone in skeleton (line atm)
   * @param color
   */
  createBone(from: BABYLON.Vector3, to: BABYLON.Vector3): BABYLON.LinesMesh {
    const line = BABYLON.MeshBuilder.CreateLines("", {
      points: [from, to]
    })
    return line
  }
}
