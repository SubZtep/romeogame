import * as BABYLON from "babylonjs"
import { DudeJoints as DJ } from "~/types/joints"
import { Vector2D } from "@tensorflow-models/posenet/dist/types"
import { Joint } from "./joint"
import Formation from "./formation"
import { getDudeJointNames } from "~/scripts/utils"

export default class Avatar extends Formation {
  mesh: BABYLON.AbstractMesh
  skeleton: BABYLON.Skeleton
  dudeJointNames: string[] = []
  //stickman: Stickman | null = null

  /**
   * Dude character
   */
  constructor(mesh: BABYLON.AbstractMesh, skeleton: BABYLON.Skeleton) {
    super()
    this.mesh = mesh
    this.skeleton = skeleton
    this.dudeJointNames = getDudeJointNames()
  }

  /**
   * Scale character
   * @param amount Scale size
   */
  scale(amount = 0.1) {
    this.mesh.scaling = new BABYLON.Vector3(amount, amount, amount)
  }

  /**
   * Create new Dude joint
   * @param name Joint name for identify position
   * @param modifier Position modifier
   */
  private getNamedJoint(name: string, modifier: Vector2D | null = null): Joint {
    const jointPoses = {
      crest: new BABYLON.Vector3(-0.96, 0, 0),
      waist: new BABYLON.Vector3(3.79, 0, 0),
      upperBody1: new BABYLON.Vector3(4.54, 0, 0),
      upperBody2: new BABYLON.Vector3(4.54, 0, 0),
      upperBody3: new BABYLON.Vector3(4.54, 0, 0),
      upperBody4: new BABYLON.Vector3(5.54, 0, 0),
      head: new BABYLON.Vector3(3.95, 0, 0),
      rightEye: new BABYLON.Vector3(4.48, 3.25, 1.27),
      leftEye: new BABYLON.Vector3(4.58, 3.11, -1.21),
      rightEyebrow: new BABYLON.Vector3(4.22, 1.41, 1.39),
      leftEyebrow: new BABYLON.Vector3(4.3, 1.33, -1.07),
      rightArm: new BABYLON.Vector3(-0.31, -0.77, 1.22),
      rightShoulder: new BABYLON.Vector3(6.84, 0, 0),
      rightElbow: new BABYLON.Vector3(13.14, 0, 0),
      rightWrist: new BABYLON.Vector3(10.83, 0, 0),
      rightFinger1: new BABYLON.Vector3(1.63, 0.63, -1.68),
      rightFinger2: new BABYLON.Vector3(4.349, 0.016, -1.561),
      rightFinger3: new BABYLON.Vector3(4.36, 0, -0.367),
      rightFinger4: new BABYLON.Vector3(4.295, -0.095, 0.806),
      rightFinger5: new BABYLON.Vector3(3.973, 0.223, 1.743),
      leftArm: new BABYLON.Vector3(-0.308, -0.771, -1.223),
      leftShoulder: new BABYLON.Vector3(6.844, 0, 0),
      leftElbow: new BABYLON.Vector3(13.142, 0, 0),
      leftWrist: new BABYLON.Vector3(10.826, 0, 0),
      leftFinger1: new BABYLON.Vector3(1.625, 0.627, 1.679),
      leftFinger2: new BABYLON.Vector3(4.349, 0.016, 1.561),
      leftFinger3: new BABYLON.Vector3(4.36, 0, 0.367),
      leftFinger4: new BABYLON.Vector3(4.295, -0.095, -0.806),
      leftFinger5: new BABYLON.Vector3(3.973, 0.223, -1.743),
      rightHip: new BABYLON.Vector3(-3.769, -0.355, 3.495),
      rightKnee: new BABYLON.Vector3(18.257, 0, 0),
      rightAnkle: new BABYLON.Vector3(15.428, 0, 0),
      rightFoot: new BABYLON.Vector3(5.25, 6.274, 0),
      leftHip: new BABYLON.Vector3(-3.769, -0.355, -3.495),
      leftKnee: new BABYLON.Vector3(18.257, 0, 0),
      leftAnkle: new BABYLON.Vector3(15.428, 0, 0),
      leftFoot: new BABYLON.Vector3(5.25, 6.274, 0)
    }
    if (jointPoses[name] === undefined) {
      throw new Error(`Unkown joint ${name}`)
    }

    return new Joint(name, jointPoses[name], [], this.skeleton.bones[DJ[name]])
  }

  /**
   * Create multiple Dude joint (no modifiers with this shortcut)
   * @param names Joint names
   */
  private getNamedJoints(names: string[]): Joint[] {
    return names.map(name => this.getNamedJoint(name))
  }

  /** Create all avatar joints from hardcoded values */
  setJoints(): void {
    //TODO: I need rotation here
    //const waist: Vector2D = this.v2dMiddle(kp.leftHip, kp.rightHip)

    // Init default Dude positions
    this.rootJoint = new Joint("root", BABYLON.Vector3.Zero(), [], this.skeleton.bones[DJ.root])
    this.rootJoint
      .addChild(this.getNamedJoint("crest"))
      .addChild(this.getNamedJoint("waist"))
      .addChildren(this.getNamedJoints(["upperBody1", "rightHip", "leftHip"]))
      .forEach(joint => {
        switch (joint.name) {
          case "upperBody1":
            joint
              .addChild(this.getNamedJoint("upperBody2"))
              .addChild(this.getNamedJoint("upperBody3"))
              .addChild(this.getNamedJoint("upperBody4"))
              .addChildren(this.getNamedJoints(["head", "rightArm", "leftArm"]))
              .forEach(joint => {
                switch (joint.name) {
                  case "head":
                    joint.addChildren(
                      this.getNamedJoints(["rightEye", "leftEye", "rightEyebrow", "leftEyebrow"])
                    )
                    break
                  case "rightArm":
                    joint
                      .addChild(this.getNamedJoint("rightShoulder"))
                      .addChild(this.getNamedJoint("rightElbow"))
                      .addChild(this.getNamedJoint("rightWrist"))
                      .addChildren(
                        this.getNamedJoints([
                          "rightFinger1",
                          "rightFinger2",
                          "rightFinger3",
                          "rightFinger4",
                          "rightFinger5"
                        ])
                      )
                    break
                  case "leftArm":
                    joint
                      .addChild(this.getNamedJoint("leftShoulder"))
                      .addChild(this.getNamedJoint("leftElbow"))
                      .addChild(this.getNamedJoint("leftWrist"))
                      .addChildren(
                        this.getNamedJoints([
                          "leftFinger1",
                          "leftFinger2",
                          "leftFinger3",
                          "leftFinger4",
                          "leftFinger5"
                        ])
                      )
                    break
                }
              })
            break
          case "rightHip":
            joint
              .addChild(this.getNamedJoint("rightKnee"))
              .addChild(this.getNamedJoint("rightAnkle"))
              .addChild(this.getNamedJoint("rightFoot"))
            break
          case "leftHip":
            joint
              .addChild(this.getNamedJoint("leftKnee"))
              .addChild(this.getNamedJoint("leftAnkle"))
              .addChild(this.getNamedJoint("leftFoot"))
            break
        }
      })
  }
}
