import * as BABYLON from "babylonjs"
import { PlayerState } from "~/types/stores"

export default {
  RESET_POSENET_JOINTS(state: PlayerState) {
    state.posenetJoints = new Map<string, BABYLON.Vector3>()
  },

  SET_POSENET_JOINT(state: PlayerState, payload: { jointName: string; position: BABYLON.Vector3 }) {
    state.posenetJoints.set(payload.jointName, payload.position)
  },

  RESET_POSENET_BONES(state: PlayerState) {
    state.posenetBones = new Map<string, BABYLON.Vector3[]>()
  },

  SET_POSENET_BONE(
    state: PlayerState,
    payload: { jointNames: string; positions: BABYLON.Vector3[] }
  ) {
    state.posenetBones.set(payload.jointNames, payload.positions)
  }
}
