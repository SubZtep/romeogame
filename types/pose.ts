import { Vector2D } from "@tensorflow-models/posenet/dist/types"
import * as BABYLON from "babylonjs"

/**
 * Posenet joint points for 3D Avatar
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
 * Posenet joint points for Stickman
 */
export interface Keymeshes {
  nose?: BABYLON.Mesh
  leftEye?: BABYLON.Mesh
  rightEye?: BABYLON.Mesh
  leftEar?: BABYLON.Mesh
  rightEar?: BABYLON.Mesh
  leftShoulder?: BABYLON.Mesh
  rightShoulder?: BABYLON.Mesh
  leftElbow?: BABYLON.Mesh
  rightElbow?: BABYLON.Mesh
  leftWrist?: BABYLON.Mesh
  rightWrist?: BABYLON.Mesh
  leftHip?: BABYLON.Mesh
  rightHip?: BABYLON.Mesh
  leftKnee?: BABYLON.Mesh
  rightKnee?: BABYLON.Mesh
  leftAnkle?: BABYLON.Mesh
  rightAnkle?: BABYLON.Mesh
}
