import * as BABYLON from "babylonjs"
import Painter from "~/scripts/painter"
import { AbstractMesh, IParticleSystem, Skeleton, AnimationGroup, Nullable } from "babylonjs"
import { DudeBones } from "~/types/bones"
import Joints from "~/scripts/joints"
import Transform from "~/scripts/transform"
import { Keypoint } from "@tensorflow-models/posenet"
import { Vector2D } from "@tensorflow-models/posenet/dist/types"
import { Keypoints } from "~/types/pose"

export default class Avatar {
  running: boolean = true
  painter: Painter
  transform: Transform
  mesh: BABYLON.AbstractMesh
  skeleton: BABYLON.Skeleton
  lookAtSphere: BABYLON.Mesh
  lookCtrl: BABYLON.BoneLookController

  //debugJoints = ["leftEye", "rightEye", "leftShoulder", "rightShoulder"]
  debugJoints = ["nose", "leftElbow", "rightElbow"]

  constructor(
    painter: Painter,
    transform: Transform,
    mesh: BABYLON.AbstractMesh,
    skeleton: BABYLON.Skeleton
  ) {
    this.painter = painter
    this.transform = transform
    this.mesh = mesh
    this.skeleton = skeleton

    this.mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    this.mesh.position = new BABYLON.Vector3(0, 0, 0)

    // Create helpers
    // for (let i = 0; i < this.debugJoints.length; i++) {
    //   const color = i < 2 ? new BABYLON.Color4(1, 0, 0) : new BABYLON.Color4(0, 0, 1)
    //   this.painter.addDot(color)
    // }
    //this.painter.addDot(new BABYLON.Color4(1, 1, 0, 0.8), 0.8) // leftElbow
    //this.painter.addDot(new BABYLON.Color4(1, 1, 0, 0.8), 0.8) // rightElbow

    this.painter.addDot(new BABYLON.Color4(1, 1, 1, 0.9), 1.1) // x

    // Head rotation
    this.lookAtSphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.1 }, this.painter.scene) // diameter: 0.0001
    this.lookAtSphere.position = this.transform.joints.get("head")
    this.lookCtrl = new BABYLON.BoneLookController(
      this.mesh,
      this.skeleton.bones[DudeBones.head],
      this.lookAtSphere.position,
      {
        adjustYaw: Math.PI * 0.5,
        adjustRoll: Math.PI * 0.5
      }
    )

    // Loop
    this.painter.scene.registerBeforeRender(() => {
      if (this.running) {
        this.updateHeadRotation()
        this.updateDebug()
        //this.updateBody()
      }
    })
  }

  updateDebug() {
    // const kp: Keypoints = this.transform.keypoints // this.joints.data
    // let cx = 0

    // for (const name of this.debugJoints) {
    //   if (typeof kp[name] !== "undefined") {
    //     this.painter.dots[cx++].position = new BABYLON.Vector3(kp[name].x / 10, kp[name].y / 10, 0)
    //   }
    // }
    // this.painter.dots[cx++].position = this.transform.joints.get("leftElbow")
    // this.painter.dots[cx++].position = this.transform.joints.get("rightElbow")
    // this.painter.dots[5].position = new BABYLON.Vector3(-5, 5, 0)
    this.painter.dots[0].position = this.transform.joints.get("leftElbow")
  }

  updateKeypoints(keypoints: Keypoint[]) {
    this.transform.updateKeypoints(keypoints, 0.1)
    this.transform.head()
    //this.transform.shoulder()
    this.transform.elbow()
  }

  updateHeadRotation() {
    const coord = this.transform.joints.get("head")
    this.lookAtSphere.position.x = coord.x
    this.lookAtSphere.position.y = coord.y
    this.lookAtSphere.position.z = coord.z
    //this.lookAtSphere.position = this.transform.joints.get("head") // is clone() ok?
    this.lookCtrl.update()
  }

  updateBody() {
    //const { data } = this.joints
  }
}
