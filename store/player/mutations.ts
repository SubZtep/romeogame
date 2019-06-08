import { PlayerState } from "~/types/stores"
import { Keypoint } from "@tensorflow-models/posenet/dist/types"

export default {
  SET_KEYPOINTS(state: PlayerState, keypoints: Keypoint[]) {
    state.keypoints = keypoints
  },
  SET_ADJACENTS(state: PlayerState, adjacents: Keypoint[][]) {
    state.adjacents = adjacents
  }
}
