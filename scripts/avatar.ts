import * as BABYLON from "babylonjs"
import { DudePosenetBones, DudeBones } from "~/types/bones"
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

  setKeypoints(keypoints: Keypoints): void {
    for (let [key, value] of Object.entries(keypoints)) {
      const boneIndex = DudePosenetBones[key]
      if (boneIndex !== undefined) {
        this.skeleton.bones[boneIndex].setPosition(new BABYLON.Vector3(value.x, value.y, 300))
      }
    }
  }

  updateKeypoints(keypoints: Keypoint[]): void {
    //console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSss")
    keypoints.forEach(keypoint => {
      if (keypoint.score >= minPartConfidence) {
        if (["leftEye"].includes(keypoint.part)) {
          const boneIndex = DudePosenetBones[keypoint.part]
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
