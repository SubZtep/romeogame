import * as BABYLON from "babylonjs"
import { ITransform } from "~/types/joint"
import { PlayerState } from "~/types/stores"

export default (): PlayerState => ({
  posenetJoints: new Map<string, ITransform>(),
  posenetBones: new Map<string, BABYLON.Vector3[]>()
})
