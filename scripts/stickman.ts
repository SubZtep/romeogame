import * as BABYLON from "babylonjs"
import { poseFlipXY, poseMove, v3dMiddle, v2dDistance, v2dSubtract } from "~/scripts/utils"
import { IJoint } from "~/types/joint"
import { Joint } from "~/scripts/joint"
import Avatar from "./avatar"
import Formation from "./formation"

export default class Stickman extends Formation {
  pose: Map<string, BABYLON.Vector3>
  joints: IJoint[] = []

  dirtyResize() {
    const nosePos: BABYLON.Vector3 = this.pose.get("nose")
    poseFlipXY(this.pose)
    poseMove(this.pose, new BABYLON.Vector3(-nosePos.x, -nosePos.y + 115, 1))
    this.pose.forEach(position => {
      position.x /= 38
      position.y /= 38
    })
  }

  /**
   * Set all calculated joints
   *
   * @param avatar Reference avatar
   */
  setJoints(avatar: Avatar): void {
    this.rootJoint = new Joint("root", new BABYLON.Vector3(0, 0, 1))

    const crestPos = v3dMiddle(this.pose.get("leftHip"), this.pose.get("rightHip"))
    const waistPos = crestPos.clone()
    waistPos.y -= v2dDistance(this.pose.get("leftHip"), crestPos)

    const crestJoint = this.rootJoint.addChild(new Joint("crest", crestPos))
    const waistJoint = crestJoint.addChild(new Joint("waist", waistPos))

    const upperBody1 = new Joint("upperBody1", waistPos)
    const leftHipJoint = new Joint("leftHip", this.pose.get("leftHip"))
    const rightHipJoint = new Joint("rightHip", this.pose.get("rightHip"))

    waistJoint.addChildren([upperBody1, leftHipJoint, rightHipJoint])

    const upperBody4 = upperBody1
      .addChild(new Joint("upperBody2", waistPos))
      .addChild(new Joint("upperBody3", waistPos))
      .addChild(
        new Joint(
          "upperBody4",
          v3dMiddle(this.pose.get("leftShoulder"), this.pose.get("rightShoulder"))
        )
      )

    const head = new Joint("head", this.pose.get("nose"))
    const rightArm = new Joint("rightArm", this.pose.get("rightShoulder"))
    const leftArm = new Joint("leftArm", this.pose.get("leftShoulder"))

    upperBody4.addChildren([head, rightArm, leftArm])

    head.addChildren([
      new Joint("rightEye", this.pose.get("rightEye")),
      new Joint("leftEye", this.pose.get("leftEye")),
      new Joint("rightEyebrow", this.pose.get("rightEye")),
      new Joint("leftEyebrow", this.pose.get("leftEye"))
    ])

    rightArm
      .addChild(new Joint("rightShoulder", this.pose.get("rightShoulder")))
      .addChild(new Joint("rightElbow", this.pose.get("rightElbow")))
      .addChild(new Joint("rightWrist", this.pose.get("rightWrist")))
      .addChildren([
        new Joint("rightFinger1", this.pose.get("rightWrist")),
        new Joint("rightFinger2", this.pose.get("rightWrist")),
        new Joint("rightFinger3", this.pose.get("rightWrist")),
        new Joint("rightFinger4", this.pose.get("rightWrist")),
        new Joint("rightFinger5", this.pose.get("rightWrist"))
      ])

    leftArm
      .addChild(new Joint("leftShoulder", this.pose.get("leftShoulder")))
      .addChild(new Joint("leftElbow", this.pose.get("leftElbow")))
      .addChild(new Joint("leftWrist", this.pose.get("leftWrist")))
      .addChildren([
        new Joint("leftFinger1", this.pose.get("leftWrist")),
        new Joint("leftFinger2", this.pose.get("leftWrist")),
        new Joint("leftFinger3", this.pose.get("leftWrist")),
        new Joint("leftFinger4", this.pose.get("leftWrist")),
        new Joint("leftFinger5", this.pose.get("leftWrist"))
      ])

    rightHipJoint
      .addChild(new Joint("rightKnee", this.pose.get("rightKnee")))
      .addChild(new Joint("rightAnkle", this.pose.get("rightAnkle")))
      .addChild(new Joint("rightFoot", this.pose.get("rightAnkle")))

    leftHipJoint
      .addChild(new Joint("leftKnee", this.pose.get("leftKnee")))
      .addChild(new Joint("leftAnkle", this.pose.get("leftAnkle")))
      .addChild(new Joint("leftFoot", this.pose.get("leftAnkle")))
  }
}
