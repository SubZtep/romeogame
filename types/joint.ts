import * as BABYLON from "babylonjs"

export interface IJoint {
  name: string
  bone: BABYLON.Bone
  position: BABYLON.Vector3
  children: IJoint[]

  addChild(joint: IJoint): IJoint
  addChildren(joints: IJoint[]): IJoint[]
  hasChild(): boolean
  child(name: string): IJoint
}
