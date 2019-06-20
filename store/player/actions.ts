import * as BABYLON from "babylonjs"

export default {
  resetPosenetJoints({ commit }) {
    commit("RESET_POSENET_JOINTS")
  },

  setPosenetJoint(
    { commit },
    { jointName, position }: { jointName: String; position: BABYLON.Vector3 }
  ) {
    commit("SET_POSENET_JOINT", { jointName, position })
  },

  resetPosenetBones({ commit }) {
    commit("RESET_POSENET_BONES")
  },

  setPosenetBone(
    { commit },
    { jointNames, positions }: { jointNames: String; positions: BABYLON.Vector3[] }
  ) {
    commit("SET_POSENET_BONE", { jointNames, positions })
  }
}
