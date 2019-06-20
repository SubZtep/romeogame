import { PosenetJoints } from "~/types/bones"
import * as BABYLON from "babylonjs"

export function getPosenetJointNames(): string[] {
  return Object.keys(PosenetJoints).filter(item => Number.parseInt(item).toString() !== item)
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
export function v2dMiddle(p1: BABYLON.Vector3, p2: BABYLON.Vector3): BABYLON.Vector3 {
  return new BABYLON.Vector3((p1.x + p2.x) / 2.0, (p1.y + p2.y) / 2.0, (p1.z + p2.z) / 2.0)
}

/**
 * Get distance between two coordinates, check only x and y
 */
export function v2dDistance(p1: BABYLON.Vector3, p2: BABYLON.Vector3): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}
