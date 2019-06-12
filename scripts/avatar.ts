import * as BABYLON from "babylonjs"
import { DudeBones, PosenetBones, RomeoBones } from "~/types/bones"
import { Keypoint, Vector2D } from "@tensorflow-models/posenet/dist/types"
import { minPartConfidence } from "~/scripts/settings"
import { Keypoints } from "../types/pose"

export default class Avatar {
  mesh: BABYLON.AbstractMesh
  skeleton: BABYLON.Skeleton

  constructor(mesh: BABYLON.AbstractMesh, skeleton: BABYLON.Skeleton) {
    this.mesh = mesh
    this.skeleton = skeleton

    //this.mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    this.mesh.position = new BABYLON.Vector3(300, 200, 300)
    this.mesh.rotation = new BABYLON.Vector3(0, 0, Math.PI)
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

  setKeypoints(kp: Keypoints): void {
    const waist: Vector2D = this.v2dMiddle(kp.leftHip, kp.rightHip)
    const bns = this.skeleton.bones

    bns[DudeBones.root].setPosition(new BABYLON.Vector3(waist.x, waist.y, -200))
    bns[DudeBones._crest].setPosition(new BABYLON.Vector3(-0.96, 0, 0))
    bns[DudeBones.__waist].setPosition(new BABYLON.Vector3(3.79, 0, 0))
    bns[DudeBones.___upperBody].setPosition(new BABYLON.Vector3(4.54, 0, 0))
    bns[DudeBones.____upperBody].setPosition(new BABYLON.Vector3(4.54, 0, 0))
    bns[DudeBones._____upperBody].setPosition(new BABYLON.Vector3(4.54, 0, 0))
    bns[DudeBones.______upperBody].setPosition(new BABYLON.Vector3(5.54, 0, 0))
    bns[DudeBones._______head].setPosition(new BABYLON.Vector3(3.95, 0, 0))
    bns[DudeBones.________rightEye].setPosition(new BABYLON.Vector3(4.48, 3.25, 1.27))
    bns[DudeBones.________leftEye].setPosition(new BABYLON.Vector3(4.58, 3.11, -1.21))
    bns[DudeBones.________rightEyebrow].setPosition(new BABYLON.Vector3(4.22, 1.41, 1.39))
    bns[DudeBones.________leftEyebrow].setPosition(new BABYLON.Vector3(4.3, 1.33, -1.07))
    bns[DudeBones._______rightArm].setPosition(new BABYLON.Vector3(-0.31, -0.77, 1.22))
    bns[DudeBones.________rightShoulder].setPosition(new BABYLON.Vector3(6.84, 0, 0))
    bns[DudeBones._________rightElbow].setPosition(new BABYLON.Vector3(13.14, 0, 0))
    bns[DudeBones.__________rightWrist].setPosition(new BABYLON.Vector3(10.83, 0, 0))
    bns[DudeBones.___________rightFinger1].setPosition(new BABYLON.Vector3(1.63, 0.63, -1.68))
    bns[DudeBones.___________rightFinger2].setPosition(new BABYLON.Vector3(4.349, 0.016, -1.561))
    bns[DudeBones.___________rightFinger3].setPosition(new BABYLON.Vector3(4.36, 0, -0.367))
    bns[DudeBones.___________rightFinger4].setPosition(new BABYLON.Vector3(4.295, -0.095, 0.806))
    bns[DudeBones.___________rightFinger5].setPosition(new BABYLON.Vector3(3.973, 0.223, 1.743))
    bns[DudeBones._______leftArm].setPosition(new BABYLON.Vector3(-0.308, -0.771, -1.223))
    bns[DudeBones.________leftShoulder].setPosition(new BABYLON.Vector3(6.844, 0, 0))
    bns[DudeBones._________leftElbow].setPosition(new BABYLON.Vector3(13.142, 0, 0))
    bns[DudeBones.__________leftWrist].setPosition(new BABYLON.Vector3(10.826, 0, 0))
    bns[DudeBones.___________leftFinger1].setPosition(new BABYLON.Vector3(1.625, 0.627, 1.679))
    bns[DudeBones.___________leftFinger2].setPosition(new BABYLON.Vector3(4.349, 0.016, 1.561))
    bns[DudeBones.___________leftFinger3].setPosition(new BABYLON.Vector3(4.36, 0, 0.367))
    bns[DudeBones.___________leftFinger4].setPosition(new BABYLON.Vector3(4.295, -0.095, -0.806))
    bns[DudeBones.___________leftFinger5].setPosition(new BABYLON.Vector3(3.973, 0.223, -1.743))
    bns[DudeBones.___rightHip].setPosition(new BABYLON.Vector3(-3.769, -0.355, 3.495))
    bns[DudeBones.____rightKnee].setPosition(new BABYLON.Vector3(18.257, 0, 0))
    bns[DudeBones._____rightAnkle].setPosition(new BABYLON.Vector3(15.428, 0, 0))
    bns[DudeBones.______rightFoot].setPosition(new BABYLON.Vector3(5.25, 6.274, 0))
    bns[DudeBones.___leftHip].setPosition(new BABYLON.Vector3(-3.769, -0.355, -3.495))
    bns[DudeBones.____leftKnee].setPosition(new BABYLON.Vector3(18.257, 0, 0))
    bns[DudeBones._____leftAnkle].setPosition(new BABYLON.Vector3(15.428, 0, 0))
    bns[DudeBones.______leftFoot].setPosition(new BABYLON.Vector3(5.25, 6.274, 0))
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
