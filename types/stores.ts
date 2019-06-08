import { Keypoint } from "@tensorflow-models/posenet/dist/types"

export interface PlayerState {
  keypoints: Keypoint[]
  adjacents: Keypoint[][]
}
