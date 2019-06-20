import * as BABYLON from "babylonjs"
import { IJoint } from "~/types/joint"

/**
 * Represent a joint between bones
 */
export class Joint implements IJoint {
  name: string
  private _position: BABYLON.Vector3
  children: IJoint[]
  bone: BABYLON.Bone | null

  constructor(
    name: string,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    children: IJoint[] = [],
    bone: BABYLON.Bone = null
  ) {
    this.name = name
    this.children = children
    this.bone = bone
    this.position = position || BABYLON.Vector3.Zero()
  }

  set position(pos: BABYLON.Vector3) {
    this._position = pos
    //this._position.x += 10 // makes avatar much taller (funny)
    if (this.bone !== null) {
      this.bone.setPosition(this._position)
    }
  }

  get position() {
    return this._position
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
