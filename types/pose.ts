import { Vector2D } from "@tensorflow-models/posenet/dist/types"
import * as BABYLON from "babylonjs"

/**
 * Posenet joint points
 */
export interface Keypoints {
  nose?: Vector2D
  leftEye?: Vector2D
  rightEye?: Vector2D
  leftEar?: Vector2D
  rightEar?: Vector2D
  leftShoulder?: Vector2D
  rightShoulder?: Vector2D
  leftElbow?: Vector2D
  rightElbow?: Vector2D
  leftWrist?: Vector2D
  rightWrist?: Vector2D
  leftHip?: Vector2D
  rightHip?: Vector2D
  leftKnee?: Vector2D
  rightKnee?: Vector2D
  leftAnkle?: Vector2D
  rightAnkle?: Vector2D
}

/**
 * Calculated avatar joint points
 */
export interface Joints {
  head?: BABYLON.Vector3
  leftShoulder?: BABYLON.Vector3
  rightShoulder?: BABYLON.Vector3
  leftElbow?: BABYLON.Vector3
  rightElbow?: BABYLON.Vector3
}
