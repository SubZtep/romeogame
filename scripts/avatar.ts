import * as BABYLON from "babylonjs"
import { DudeJoints as DJ, BoneJoint as BJ } from "~/types/joints"
import { Vector2D } from "@tensorflow-models/posenet/dist/types"
import { IJoint, ITransform } from "~/types/joint"

import { Joint } from "./joint"
import Formation from "./formation"

export default class Avatar extends Formation {
  mesh: BABYLON.AbstractMesh
  skeleton: BABYLON.Skeleton
  //stickman: Stickman | null = null

  /**
   * Dude character
   */
  constructor(mesh: BABYLON.AbstractMesh, skeleton: BABYLON.Skeleton) {
    super()
    this.mesh = mesh
    this.skeleton = skeleton
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
  private getNamedJoint(name: BJ, modifier: Vector2D | null = null): IJoint {
    const jointTransforms = {
      [BJ.root]: {
        //position: new BABYLON.Vector3(0.04, 37.46, 2.23),
        position: BABYLON.Vector3.Zero(),
        //rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
        rotation: new BABYLON.Vector3(Math.PI / 4, 0, 0)
      },
      [BJ.crest]: {
        position: new BABYLON.Vector3(-0.96, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.waist]: {
        position: new BABYLON.Vector3(3.79, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.upperBody1]: {
        position: new BABYLON.Vector3(4.54, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.upperBody2]: {
        position: new BABYLON.Vector3(4.54, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.upperBody3]: {
        position: new BABYLON.Vector3(4.54, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.upperBody4]: {
        position: new BABYLON.Vector3(5.54, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.head]: {
        position: new BABYLON.Vector3(3.95, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightEye]: {
        position: new BABYLON.Vector3(4.48, 3.25, 1.27),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftEye]: {
        position: new BABYLON.Vector3(4.58, 3.11, -1.21),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightEyebrow]: {
        position: new BABYLON.Vector3(4.22, 1.41, 1.39),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftEyebrow]: {
        position: new BABYLON.Vector3(4.3, 1.33, -1.07),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightArm]: {
        position: new BABYLON.Vector3(-0.31, -0.77, 1.22),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightShoulder]: {
        position: new BABYLON.Vector3(6.84, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightElbow]: {
        position: new BABYLON.Vector3(13.14, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightWrist]: {
        position: new BABYLON.Vector3(10.83, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightFinger1]: {
        position: new BABYLON.Vector3(1.63, 0.63, -1.68),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightFinger2]: {
        position: new BABYLON.Vector3(4.349, 0.016, -1.561),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightFinger3]: {
        position: new BABYLON.Vector3(4.36, 0, -0.367),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightFinger4]: {
        position: new BABYLON.Vector3(4.295, -0.095, 0.806),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightFinger5]: {
        position: new BABYLON.Vector3(3.973, 0.223, 1.743),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftArm]: {
        position: new BABYLON.Vector3(-0.308, -0.771, -1.223),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftShoulder]: {
        position: new BABYLON.Vector3(6.844, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftElbow]: {
        position: new BABYLON.Vector3(13.142, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftWrist]: {
        position: new BABYLON.Vector3(10.826, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftFinger1]: {
        position: new BABYLON.Vector3(1.625, 0.627, 1.679),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftFinger2]: {
        position: new BABYLON.Vector3(4.349, 0.016, 1.561),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftFinger3]: {
        position: new BABYLON.Vector3(4.36, 0, 0.367),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftFinger4]: {
        position: new BABYLON.Vector3(4.295, -0.095, -0.806),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftFinger5]: {
        position: new BABYLON.Vector3(3.973, 0.223, -1.743),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightHip]: {
        position: new BABYLON.Vector3(-3.769, -0.355, 3.495),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightKnee]: {
        position: new BABYLON.Vector3(18.257, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightAnkle]: {
        position: new BABYLON.Vector3(15.428, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.rightFoot]: {
        position: new BABYLON.Vector3(5.25, 6.274, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftHip]: {
        position: new BABYLON.Vector3(-3.769, -0.355, -3.495),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftKnee]: {
        position: new BABYLON.Vector3(18.257, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftAnkle]: {
        position: new BABYLON.Vector3(15.428, 0, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      },
      [BJ.leftFoot]: {
        position: new BABYLON.Vector3(5.25, 6.274, 0),
        rotation: BABYLON.Vector3.Zero() // new BABYLON.Vector3(-90, -90, 0)
      }
    }
    if (jointTransforms[name] === undefined) {
      throw new Error(`Unkown joint ${name}`)
    }

    return new Joint(name, jointTransforms[name], [], this.skeleton.bones[DJ[name]], this.mesh)
  }

  /**
   * Create multiple Dude joint (no modifiers with this shortcut)
   * @param names Joint names
   */
  private getNamedJoints(names: BJ[]): IJoint[] {
    return names.map(name => this.getNamedJoint(name))
  }

  /** Create all avatar joints from hardcoded values */
  setJoints(): void {
    //TODO: I need rotation here
    //const waist: Vector2D = this.v2dMiddle(kp.leftHip, kp.rightHip)

    // Init default Dude positions
    this.rootJoint = new Joint(
      BJ.root,
      this.getNamedJoint(BJ.root).transform,
      //{ position: BABYLON.Vector3.Zero(), rotation: BABYLON.Vector3.Zero() },
      [],
      this.skeleton.bones[DJ.root]
    )

    this.rootJoint
      .addChild(this.getNamedJoint(BJ.crest))
      .addChild(this.getNamedJoint(BJ.waist))
      .addChildren(this.getNamedJoints([BJ.upperBody1, BJ.rightHip, BJ.leftHip]))
      .forEach(joint => {
        switch (joint.name) {
          case BJ.upperBody1:
            joint
              .addChild(this.getNamedJoint(BJ.upperBody2))
              .addChild(this.getNamedJoint(BJ.upperBody3))
              .addChild(this.getNamedJoint(BJ.upperBody4))
              .addChildren(this.getNamedJoints([BJ.head, BJ.rightArm, BJ.leftArm]))
              .forEach(joint => {
                switch (joint.name) {
                  case BJ.head:
                    joint.addChildren(
                      this.getNamedJoints([
                        BJ.rightEye,
                        BJ.leftEye,
                        BJ.rightEyebrow,
                        BJ.leftEyebrow
                      ])
                    )
                    break
                  case BJ.rightArm:
                    joint
                      .addChild(this.getNamedJoint(BJ.rightShoulder))
                      .addChild(this.getNamedJoint(BJ.rightElbow))
                      .addChild(this.getNamedJoint(BJ.rightWrist))
                      .addChildren(
                        this.getNamedJoints([
                          BJ.rightFinger1,
                          BJ.rightFinger2,
                          BJ.rightFinger3,
                          BJ.rightFinger4,
                          BJ.rightFinger5
                        ])
                      )
                    break
                  case BJ.leftArm:
                    joint
                      .addChild(this.getNamedJoint(BJ.leftShoulder))
                      .addChild(this.getNamedJoint(BJ.leftElbow))
                      .addChild(this.getNamedJoint(BJ.leftWrist))
                      .addChildren(
                        this.getNamedJoints([
                          BJ.leftFinger1,
                          BJ.leftFinger2,
                          BJ.leftFinger3,
                          BJ.leftFinger4,
                          BJ.leftFinger5
                        ])
                      )
                    break
                }
              })
            break
          case BJ.rightHip:
            joint
              .addChild(this.getNamedJoint(BJ.rightKnee))
              .addChild(this.getNamedJoint(BJ.rightAnkle))
              .addChild(this.getNamedJoint(BJ.rightFoot))
            break
          case BJ.leftHip:
            joint
              .addChild(this.getNamedJoint(BJ.leftKnee))
              .addChild(this.getNamedJoint(BJ.leftAnkle))
              .addChild(this.getNamedJoint(BJ.leftFoot))
            break
        }
      })
  }
}
