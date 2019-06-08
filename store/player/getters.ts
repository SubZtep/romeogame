import { PlayerState } from "~/types/stores"
import { Keypoint } from "@tensorflow-models/posenet/dist/types"

export default {
  getKeypoints: (state: PlayerState): Keypoint[] => state.keypoints,
  getAdjacents: (state: PlayerState): Keypoint[][] => state.adjacents
}
