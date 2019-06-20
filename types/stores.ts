import * as BABYLON from "babylonjs"
import { PosenetBoneJoint } from "~/types/joints"

/**
 * Vuex player store
 */
export interface PlayerState {
  posenetJoints: Map<PosenetBoneJoint, BABYLON.Vector3>

  /** key: jointName1-jointName2 */
  posenetBones: Map<string, BABYLON.Vector3[]>
}
