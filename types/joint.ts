import * as BABYLON from "babylonjs"

export interface IJoint {
  name: string
  position: BABYLON.Vector3
  children: IJoint[]
  bone: BABYLON.Bone | null

  addChild(joint: IJoint): IJoint
  addChildren(joints: IJoint[]): IJoint[]
  hasChild(): boolean
  child(name: string): IJoint
}
