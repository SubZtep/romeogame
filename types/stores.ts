import { Keypoint } from "@tensorflow-models/posenet/dist/types"

/**
 * Vuex player store
 */
export interface PlayerState {
  keypoints: Keypoint[]
  adjacents: Keypoint[][]
}
