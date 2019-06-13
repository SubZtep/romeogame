import * as BABYLON from "babylonjs"
import { DudeBones as DB, PosenetBones } from "~/types/bones"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { minPartConfidence } from "~/scripts/settings"
import { IJoint } from "~/types/joint"
import { Joint } from "./joint"

export default class Avatar {
  mesh: BABYLON.AbstractMesh
  skeleton: BABYLON.Skeleton
  rootJoint: IJoint

  constructor(mesh: BABYLON.AbstractMesh, skeleton: BABYLON.Skeleton) {
    this.mesh = mesh
    this.skeleton = skeleton

    this.mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    //this.mesh.position = new BABYLON.Vector3(300, 200, 300)
    //this.mesh.rotation = new BABYLON.Vector3(0, 0, Math.PI)
  }

  v2dDiff(p1: Vector2D, p2: Vector2D): Vector2D {
    return {
      x: p1.x - p2.x,
      y: p1.y - p2.y
    }
  }

  v2dMiddle(p1: Vector2D, p2: Vector2D): Vector2D {
    return {
      x: (p1.x + p2.x) / 2.0,
      y: (p1.y + p2.y) / 2.0
    }
  }

  v2dDistance(p1: Vector2D, p2: Vector2D): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
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
    return new Joint(name, this.skeleton.bones[DB[name]], jointPoses[name])
  }

  /**
   * Create multiple Dude joint (no modifiers with this shortcut)
   * @param names Joint names
   */
  private getNamedJoints(names: string[]): Joint[] {
    return names.map(name => this.getNamedJoint(name))
  }

  /**
   * Create all avatar joints from hardcoded values
   */
  setJoints(): void {
    //const waist: Vector2D = this.v2dMiddle(kp.leftHip, kp.rightHip)

    // Init default Dude positions
    this.rootJoint = new Joint("root", this.skeleton.bones[DB.root], BABYLON.Vector3.Zero())
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

  /**
   * Walk in the bone tree
   * @param joint Current joint
   * @param level Current depth
   */
  jointWalker(joint: IJoint, level: number = 0) {
    console.log(`${"-".repeat(level)} ${joint.name} ${joint.position.toString()}`)
    joint.children.forEach(child => {
      this.jointWalker(child, level + 1)
    })
  }

  updateKeypoints(keypoints: Keypoint[]): void {
    //console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSss")
    keypoints.forEach(keypoint => {
      if (keypoint.score >= minPartConfidence) {
        if (["leftEye"].includes(keypoint.part)) {
          const boneIndex = PosenetBones[keypoint.part]
          if (boneIndex !== undefined) {
            //console.log(keypoint.position.x + " - " + keypoint.position.y)
            this.skeleton.bones[boneIndex].setPosition(
              new BABYLON.Vector3(keypoint.position.x, keypoint.position.y, 300)
            )
          }
        }

        // if (keypoint.part === "leftHip") {
        //   this.skeleton.bones[0].setPosition(
        //     new BABYLON.Vector3(keypoint.position.x, keypoint.position.y, -600)
        //   )
        // }

        // const boneIndex = DudePosenetBones[keypoint.part]
        // if (boneIndex !== undefined) {
        //   //console.log(keypoint.position.x + " - " + keypoint.position.y)
        //   this.skeleton.bones[boneIndex].setPosition(
        //     new BABYLON.Vector3(keypoint.position.x, keypoint.position.y, -600)
        //   )
        // }
      }
    })
    //console.log("EEEEEEEEEEEEEEEEEEEEEEEEEE")
  }
}
