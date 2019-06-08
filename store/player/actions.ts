import { Keypoint } from "@tensorflow-models/posenet"

export default {
  setKeypoints({ commit }, keypoints: Keypoint[]) {
    commit("SET_KEYPOINTS", keypoints)
  }
}
