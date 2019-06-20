import * as BABYLON from "babylonjs"

export default {
  /** Remove all the joints */
  resetPosenetJoints({ commit }) {
    commit("RESET_POSENET_JOINTS")
  },

  /** Joint between bones */
  setPosenetJoint(
    { commit },
    { jointName, position }: { jointName: String; position: BABYLON.Vector3 }
  ) {
    commit("SET_POSENET_JOINT", { jointName, position })
  },

  /** Remove all the bones */
  resetPosenetBones({ commit }) {
    commit("RESET_POSENET_BONES")
  },

  /** Bone between two joints */
  setPosenetBone(
    { commit },
    { jointNames, positions }: { jointNames: String; positions: BABYLON.Vector3[] }
  ) {
    commit("SET_POSENET_BONE", { jointNames, positions })
  }
}
