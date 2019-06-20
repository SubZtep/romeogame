import * as BABYLON from "babylonjs"
import { poseMove, v3dMiddle, v2dDistance } from "~/scripts/utils"
import { IJoint, ITransform } from "~/types/joint"
import { DudeJoints as DJ, BoneJoint as BJ, PosenetBoneJoint as PBJ } from "~/types/joints"
import { Joint } from "~/scripts/joint"
import Avatar from "./avatar"
import Formation from "./formation"

export default class Stickman extends Formation {
  pose: Map<PBJ, BABYLON.Vector3>
  joints: IJoint[] = []

  dirtyResize() {
    const nosePos: BABYLON.Vector3 = this.pose.get(PBJ.nose)
    //poseFlipXY(this.pose)
    poseMove(this.pose, new BABYLON.Vector3(-nosePos.x, -nosePos.y + 100, 1))
    this.pose.forEach(position => {
      position.x /= 35
      position.y /= 35
    })
  }

  getTransform(position: BABYLON.Vector3): ITransform {
    return {
      position,
      rotation: BABYLON.Vector3.Zero()
    }
  }

  /**
   * Set all calculated joints with rotation
   *
   * @param avatar Reference avatar
   */
  setJoints(avatar: Avatar): void {
    const arjt = avatar.getJoint(BJ.root).transform
    this.rootJoint = new Joint(BJ.root, {
      position: new BABYLON.Vector3(arjt.position.x, arjt.position.y, arjt.position.z + 1),
      rotation: arjt.rotation
    })

    const crestPos = v3dMiddle(this.pose.get(PBJ.leftHip), this.pose.get(PBJ.rightHip))
    const waistPos = crestPos.clone()
    waistPos.y -= v2dDistance(this.pose.get(PBJ.leftHip), crestPos)

    const crestJoint = this.rootJoint.addChild(new Joint(BJ.crest, this.getTransform(crestPos)))
    const waistJoint = crestJoint.addChild(new Joint(BJ.waist, this.getTransform(waistPos)))

    const upperBody1 = new Joint(BJ.upperBody1, this.getTransform(waistPos))
    const leftHipJoint = new Joint(BJ.leftHip, this.getTransform(this.pose.get(PBJ.leftHip)))
    const rightHipJoint = new Joint(BJ.rightHip, this.getTransform(this.pose.get(PBJ.rightHip)))

    waistJoint.addChildren([upperBody1, leftHipJoint, rightHipJoint])

    const upperBody4 = upperBody1
      .addChild(new Joint(BJ.upperBody2, this.getTransform(waistPos)))
      .addChild(new Joint(BJ.upperBody3, this.getTransform(waistPos)))
      .addChild(
        new Joint(
          BJ.upperBody4,
          this.getTransform(
            v3dMiddle(this.pose.get(PBJ.leftShoulder), this.pose.get(PBJ.rightShoulder))
          )
        )
      )

    const head = new Joint(BJ.head, this.getTransform(this.pose.get(PBJ.nose)))
    const rightArm = new Joint(BJ.rightArm, this.getTransform(this.pose.get(PBJ.rightShoulder)))
    const leftArm = new Joint(BJ.leftArm, this.getTransform(this.pose.get(PBJ.leftShoulder)))

    upperBody4.addChildren([head, rightArm, leftArm])

    head.addChildren([
      new Joint(BJ.rightEye, this.getTransform(this.pose.get(PBJ.rightEye))),
      new Joint(BJ.leftEye, this.getTransform(this.pose.get(PBJ.leftEye))),
      new Joint(BJ.rightEyebrow, this.getTransform(this.pose.get(PBJ.rightEye))),
      new Joint(BJ.leftEyebrow, this.getTransform(this.pose.get(PBJ.leftEye)))
    ])

    rightArm
      .addChild(new Joint(BJ.rightShoulder, this.getTransform(this.pose.get(PBJ.rightShoulder))))
      .addChild(new Joint(BJ.rightElbow, this.getTransform(this.pose.get(PBJ.rightElbow))))
      .addChild(new Joint(BJ.rightWrist, this.getTransform(this.pose.get(PBJ.rightWrist))))
      .addChildren([
        new Joint(BJ.rightFinger1, this.getTransform(this.pose.get(PBJ.rightWrist))),
        new Joint(BJ.rightFinger2, this.getTransform(this.pose.get(PBJ.rightWrist))),
        new Joint(BJ.rightFinger3, this.getTransform(this.pose.get(PBJ.rightWrist))),
        new Joint(BJ.rightFinger4, this.getTransform(this.pose.get(PBJ.rightWrist))),
        new Joint(BJ.rightFinger5, this.getTransform(this.pose.get(PBJ.rightWrist)))
      ])

    leftArm
      .addChild(new Joint(BJ.leftShoulder, this.getTransform(this.pose.get(PBJ.leftShoulder))))
      .addChild(new Joint(BJ.leftElbow, this.getTransform(this.pose.get(PBJ.leftElbow))))
      .addChild(new Joint(BJ.leftWrist, this.getTransform(this.pose.get(PBJ.leftWrist))))
      .addChildren([
        new Joint(BJ.leftFinger1, this.getTransform(this.pose.get(PBJ.leftWrist))),
        new Joint(BJ.leftFinger2, this.getTransform(this.pose.get(PBJ.leftWrist))),
        new Joint(BJ.leftFinger3, this.getTransform(this.pose.get(PBJ.leftWrist))),
        new Joint(BJ.leftFinger4, this.getTransform(this.pose.get(PBJ.leftWrist))),
        new Joint(BJ.leftFinger5, this.getTransform(this.pose.get(PBJ.leftWrist)))
      ])

    rightHipJoint
      .addChild(new Joint(BJ.rightKnee, this.getTransform(this.pose.get(PBJ.rightKnee))))
      .addChild(new Joint(BJ.rightAnkle, this.getTransform(this.pose.get(PBJ.rightAnkle))))
      .addChild(new Joint(BJ.rightFoot, this.getTransform(this.pose.get(PBJ.rightAnkle))))

    leftHipJoint
      .addChild(new Joint(BJ.leftKnee, this.getTransform(this.pose.get(PBJ.leftKnee))))
      .addChild(new Joint(BJ.leftAnkle, this.getTransform(this.pose.get(PBJ.leftAnkle))))
      .addChild(new Joint(BJ.leftFoot, this.getTransform(this.pose.get(PBJ.leftAnkle))))
  }
}
