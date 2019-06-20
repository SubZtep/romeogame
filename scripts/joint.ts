import * as BABYLON from "babylonjs"
import { IJoint, ITransform } from "~/types/joint"
import { BoneJoint } from "~/types/joints"

/**
 * Represent a joint between bones
 */
export class Joint implements IJoint {
  name: BoneJoint
  private _transform: ITransform
  children: IJoint[]
  bone: BABYLON.Bone | null
  mesh: BABYLON.AbstractMesh | null

  constructor(
    name: BoneJoint,
    transform: ITransform,
    children: IJoint[] = [],
    bone: BABYLON.Bone = null,
    mesh: BABYLON.AbstractMesh | null = null
  ) {
    this.name = name
    this.children = children
    this.bone = bone
    this.transform = transform
    this.mesh = mesh
  }

  set transform(transform: ITransform) {
    this._transform = transform
    if (this.bone !== null) {
      this.bone.setPosition(this._transform.position)
      //FIXME: do rotation
      //this.bone.setRotation(this._transform.rotation, BABYLON.Space.WORLD, this.mesh)
    }
  }

  get transform() {
    return this._transform
  }

  /**
   * Add new child joint
   * @param joint
   */
  addChild(joint: IJoint): IJoint {
    this.children.push(joint)
    return joint
  }

  /**
   * Add multiple children joint
   * @param joints
   */
  addChildren(joints: IJoint[]): IJoint[] {
    this.children.push(...joints)
    return joints
  }

  /**
   * Has any children?
   */
  hasChild(): boolean {
    return this.children.length > 0
  }

  /**
   * Return child joint by name
   * @param name
   */
  child(name: string): IJoint {
    const child: IJoint | undefined = this.children.find(child => child.name === name)
    if (child === undefined) {
      throw new Error(`Unkown child ${name}`)
    }
    return child
  }
}
