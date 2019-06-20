import { PlayerState } from "~/types/stores"
import * as BABYLON from "babylonjs"

export default (): PlayerState => ({
  posenetJoints: new Map<string, BABYLON.Vector3>(),
  posenetBones: new Map<string, BABYLON.Vector3[]>()
})
