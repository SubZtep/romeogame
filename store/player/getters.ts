import { PlayerState } from "~/types/stores"
import { Keypoint } from "@tensorflow-models/posenet"

export default {
  getKeypoints: (state: PlayerState): Keypoint[] => state.keypoints
}
