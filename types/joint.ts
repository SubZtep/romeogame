import * as BABYLON from "babylonjs"
import { BoneJoint } from "~/types/joints"

export interface IJoint {
  name: BoneJoint
  transform: ITransform
  children: IJoint[]
  bone: BABYLON.Bone | null

  addChild(joint: IJoint): IJoint
  addChildren(joints: IJoint[]): IJoint[]
  hasChild(): boolean
  child(name: BoneJoint): IJoint
}

export interface ITransform {
  position: BABYLON.Vector3
  rotation: BABYLON.Vector3
  //scaling: BABYLON.Vector3
}
