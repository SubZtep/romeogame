import { PlayerState } from "~/types/stores"
import * as BABYLON from "babylonjs"

export default {
  getPosenetJoints: (state: PlayerState): Map<string, BABYLON.Vector3> => state.posenetJoints,
  getPosenetBones: (state: PlayerState): Map<string, BABYLON.Vector3[]> => state.posenetBones
}
