import * as BABYLON from "babylonjs"
import { PosenetBoneJoint } from "~/types/joints"
import { PlayerState } from "~/types/stores"

export default (): PlayerState => ({
  posenetJoints: new Map<PosenetBoneJoint, BABYLON.Vector3>(),
  posenetBones: new Map<string, BABYLON.Vector3[]>()
})
