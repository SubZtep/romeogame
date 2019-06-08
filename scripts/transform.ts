/**
 * Transform class for mapping
 * joints data from video stream space
 * into Babylon 3D space
 *
 * Thanks for the math https://github.com/mishig25/3d-posenet
 */
import * as BABYLON from "babylonjs"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { Keypoints } from "~/types/pose"
import Joints from "./joints"

export default class Transform {
  joints: Joints

  // Raw keypoint coords
  keypoints: Keypoints = {}

  // Avatar distance from ...
  distance: number | null
  headCenter: Vector2D | null
  shouldersDistance: number | null
  shoulderCenter: Vector2D | null

  constructor(joints: Joints) {
    this.joints = joints
  }

  /**
   * Updates joints data
   * @param {array} keypoints raw joints data from posenet
   * @param {float} treshHoldScore (minPartConfidence) for determining whether to update or no
   */
  updateKeypoints(keypoints: Keypoint[], treshHoldScore: number = 0.5): void {
    this.keypoints = {}
    //FIXME: try with filter and do performance test (devtool line level execution time in dev tool)
    keypoints.forEach(({ score, part, position }) => {
      if (score > treshHoldScore) this.keypoints[part] = position
    })
    this.distance = null
    this.headCenter = null
    this.shouldersDistance = null
    this.shoulderCenter = null
    this.calibrate()
  }

  /**
   * Makes the system invariant to scale and translations,
   * given joints data
   */
  calibrate(): void {
    // Head
    if (this.keypoints["leftEye"] && this.keypoints["rightEye"]) {
      const left_x = this.keypoints["leftEye"].x
      const left_y = this.keypoints["leftEye"].y
      const right_x = this.keypoints["rightEye"].x
      const right_y = this.keypoints["rightEye"].y

      // Distance between the eyes
      this.distance = Math.sqrt(Math.pow(left_x - right_x, 2) + Math.pow(left_y - right_y, 2))

      this.headCenter = {
        x: (left_x + right_x) / 2.0,
        y: (left_y + right_y) / 2.0
      }
    }

    // Shoulder
    if (this.keypoints["leftShoulder"] && this.keypoints["rightShoulder"]) {
      const left_x = this.keypoints["leftShoulder"].x
      const left_y = this.keypoints["leftShoulder"].y
      const right_x = this.keypoints["rightShoulder"].x
      const right_y = this.keypoints["rightShoulder"].y

      // Distance between shoulders
      this.shouldersDistance = Math.sqrt(
        Math.pow(left_x - right_x, 2) + Math.pow(left_y - right_y, 2)
      )
      this.shoulderCenter = {
        x: (left_x + right_x) / 2.0,
        y: (left_y + right_y) / 2.0
      }
    }

    //console.log("centre", [this.headCenter, this.shoulderCenter])
  }

  /** Updates head joint data */
  head(): Vector2D | undefined {
    if (this.keypoints["nose"] && this.headCenter && this.shoulderCenter) {
      //console.log(this.distance) // 30.37155311525719

      let x = this.keypoints["nose"].x
      let y = this.keypoints["nose"].y
      // console.log([x, y]) // [ 122.84904503748052, 180.83352459265564 ]

      // get nose relative points from origin
      x = (this.headCenter.x - x) / (this.distance / 15)
      y = this.shoulderCenter.y - y
      //console.log([x, y]) // [ 1.2153144580672957, 77.42203934368919 ]

      //console.log([this.keypoints["nose"], { x, y }])

      // normalize (i.e. scale it)
      y = this.map(y, this.distance * 1.5, this.distance * 2.8, -2, 2)
      // console.log(140/this.distance,260/this.distance);
      //console.log([x, y]) // [ 1.2100734252226886, -1.1954414609919284 ]

      this.joints.update("head", new BABYLON.Vector3(x, y))
      return { x, y }
    }
  }

  /** Updates shoulder joint data */
  shoulder(): void {
    if (this.headCenter && this.shoulderCenter) {
      let leftShoulder: Vector2D = { ...this.keypoints["leftShoulder"] }
      let rightShoulder: Vector2D = { ...this.keypoints["rightShoulder"] }

      // move to middle
      //const x_shift: number = (leftShoulder.x - rightShoulder.x) / 2
      //leftShoulder.x = x_shift
      leftShoulder.x -= this.shoulderCenter.x
      leftShoulder.y -= this.shoulderCenter.y
      leftShoulder.x /= 100
      leftShoulder.y /= 100

      console.log("leftShoulder", leftShoulder)
      this.joints.update("leftShoulder", new BABYLON.Vector3(leftShoulder.x, leftShoulder.y))

      // x = this.keypoints["rightShoulder"].x
      // y = this.keypoints["rightShoulder"].y
      // x = this.map(x, this.distance * 1.5, this.distance * 2.8, -2, 2)
      // y = this.map(y, this.distance * 1.5, this.distance * 2.8, -2, 2)
      this.joints.update("rightShoulder", new BABYLON.Vector3(rightShoulder.x, rightShoulder.y))
    }
  }

  /** Updates elbow joint data */
  elbow(): void {
    if (this.headCenter) {
      let leftElbow: Vector2D = { ...this.keypoints["leftElbow"] }
      let rightElbow: Vector2D = { ...this.keypoints["rightElbow"] }

      if (Object.keys(leftElbow).length === 0 || Object.keys(rightElbow).length === 0) return

      // move to middle
      //const x_shift: number = (leftShoulder.x - rightShoulder.x) / 2
      //leftShoulder.x = x_shift
      // leftShoulder.x -= this.shoulderCenter.x
      // leftShoulder.y -= this.shoulderCenter.y
      // leftShoulder.x /= 100
      // leftShoulder.y /= 100

      // leftElbow.x *= 0.01
      // leftElbow.y *= 0.01

      let { x, y } = leftElbow
      leftElbow.x = (this.headCenter.x - x) / (this.distance / 15)
      leftElbow.y = 3

      //leftElbow.x = this.headCenter.x - x // / (this.distance / 15)
      //leftElbow.y = 3

      console.log("leftElbow", leftElbow)
      this.joints.update("leftElbow", new BABYLON.Vector3(leftElbow.x, leftElbow.y))

      // x = this.keypoints["rightShoulder"].x
      // y = this.keypoints["rightShoulder"].y
      // x = this.map(x, this.distance * 1.5, this.distance * 2.8, -2, 2)
      // y = this.map(y, this.distance * 1.5, this.distance * 2.8, -2, 2)
      this.joints.update("rightElbow", new BABYLON.Vector3(rightElbow.x, rightElbow.y))
    }
  }

  // /**
  //  * Updates joints data and returns angle between three joints
  //  * @param {integer} jointA index of a joint
  //  * @param {intger} jointB index of a joint
  //  * @param {intger} jointC index of a joint
  //  * @returns {float} angle
  //  */
  // rotateJoint(jointA: string, jointB: string, jointC: string) {
  //   if (this.keypoints[jointA] && this.keypoints[jointB] && this.keypoints[jointC]) {
  //     const angle = this.findAngle(
  //       this.keypoints[jointA],
  //       this.keypoints[jointB],
  //       this.keypoints[jointC]
  //     )
  //     const sign = this.keypoints[jointC].y > this.keypoints[jointB].y ? 1 : -1
  //     this.joints.update(jointB, sign * angle)
  //     return angle
  //   }
  // }

  /** Maps from one linear interpolation into another one */
  map(original: number, in_min: number, in_max: number, out_min: number, out_max: number): number {
    return ((original - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  }

  /**
   * Returns angle in radians given three points p1, p2, p3
   * @param {integer} p1
   * @param {integer} p2
   * @param {integer} p3
   * @returns {float}
   */
  findAngle(p1: Vector2D, p2: Vector2D, p3: Vector2D): number {
    const p12 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
    const p13 = Math.sqrt(Math.pow(p1.x - p3.x, 2) + Math.pow(p1.y - p3.y, 2))
    const p23 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2))
    const resultRadian = Math.acos(
      (Math.pow(p12, 2) + Math.pow(p13, 2) - Math.pow(p23, 2)) / (2 * p12 * p13)
    )
    return resultRadian
  }
}
