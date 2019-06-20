import { DudeJoints } from "~/types/joints"
import * as BABYLON from "babylonjs"
import { IJoint } from "~/types/joint"
import { Keypoint } from "@tensorflow-models/posenet/dist/types"

export function getDudeJointNames(): string[] {
  return Object.keys(DudeJoints).filter(item => Number.parseInt(item).toString() !== item)
}

export function* jointWalker(joint: IJoint, level: number = 0): IterableIterator<IJoint> {
  yield joint
  for (const child of joint.children) {
    yield* jointWalker(child, level + 1)
  }
}

export function map2string(map: Map<string, any>): string {
  return JSON.stringify(Array.from(map.entries()))
}

export function string2map(str: string): Map<string, any> {
  return new Map(JSON.parse(str))
}

export function poseFlipXY(pose: Map<string, BABYLON.Vector3>): void {
  pose.forEach(position => {
    position.x = -position.x
    position.y = -position.y
  })
}

export function keypointsFlipY(keypoints: Keypoint[]): void {
  keypoints.forEach(kp => {
    kp.position.y = -kp.position.y
  })
}

export function poseMove(pose: Map<string, BABYLON.Vector3>, direction: BABYLON.Vector3) {
  pose.forEach(position => {
    position.x += direction.x
    position.y += direction.y
    position.z += direction.z
  })
}

/**
 * Get middle point between two coordinates
 */
export function v3dMiddle(p1: BABYLON.Vector3, p2: BABYLON.Vector3): BABYLON.Vector3 {
  if (!p1) p1 = BABYLON.Vector3.Zero()
  if (!p2) p2 = BABYLON.Vector3.Zero()
  return new BABYLON.Vector3((p1.x + p2.x) / 2.0, (p1.y + p2.y) / 2.0, (p1.z + p2.z) / 2.0)
}

/**
 * Get distance between two coordinates, check only x and y
 */
export function v2dDistance(p1: BABYLON.Vector3, p2: BABYLON.Vector3): number {
  if (!p1) p1 = BABYLON.Vector3.Zero()
  if (!p2) p2 = BABYLON.Vector3.Zero()
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

/**
 * Substract p2 position from p1 position, check only x and y
 */
export function v2dSubtract(p1: BABYLON.Vector3, p2: BABYLON.Vector3): BABYLON.Vector3 {
  if (!p1) p1 = BABYLON.Vector3.Zero()
  if (!p2) p2 = BABYLON.Vector3.Zero()
  return new BABYLON.Vector3(p1.x - p2.x, p1.y - p2.y)
}
