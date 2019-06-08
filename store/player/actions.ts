import { Keypoint } from "@tensorflow-models/posenet/dist/types"

export default {
  setKeypoints({ commit }, keypoints: Keypoint[]) {
    commit("SET_KEYPOINTS", keypoints)
  },
  setAdjacents({ commit }, adjacents: Keypoint[][]) {
    commit("SET_ADJACENTS", adjacents)
  }
}
