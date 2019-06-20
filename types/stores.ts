import * as BABYLON from "babylonjs"

/**
 * Vuex player store
 */
export interface PlayerState {
  posenetJoints: Map<string, BABYLON.Vector3>

  /** key: jointName1-jointName2 */
  posenetBones: Map<string, BABYLON.Vector3[]>
}
