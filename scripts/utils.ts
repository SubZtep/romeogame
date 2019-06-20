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
