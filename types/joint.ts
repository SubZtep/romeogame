import * as BABYLON from "babylonjs"

export interface IJoint {
  name: string
  transform: ITransform
  children: IJoint[]
  bone: BABYLON.Bone | null

  addChild(joint: IJoint): IJoint
  addChildren(joints: IJoint[]): IJoint[]
  hasChild(): boolean
  child(name: string): IJoint
}

export interface ITransform {
  position: BABYLON.Vector3
  rotation: BABYLON.Vector3
  //scaling: BABYLON.Vector3
}
