import { PlayerState } from "./state"

export default {
  SET_KEYPOINTS(state: PlayerState, keypoints) {
    state.keypoints = keypoints
  }
}
