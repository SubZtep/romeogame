import { PlayerState } from "~/types/stores"
import { Keypoint } from "@tensorflow-models/posenet"

export default {
  SET_KEYPOINTS(state: PlayerState, keypoints: Keypoint[]) {
    state.keypoints = keypoints
  }
}
