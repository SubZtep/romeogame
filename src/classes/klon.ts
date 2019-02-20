// <reference path="../lib/demo_util.d.ts" />
import * as posenet from "@tensorflow-models/posenet"
import * as BABYLON from "babylonjs"
import * as dat from "dat.gui"
import BoneMap from "../classes/boneMap.ts"
import { scene } from "../engine/engine.ts"
//import { drawBoundingBox, drawKeypoints, drawSkeleton } from "../lib/demo_util.js"
//import demo_util = require("../lib/demo_util.js")
import { data as ___S } from "../SETTINGS.ts"

export default class Klon {

  mesh: BABYLON.Mesh | null = null
  skeleton: any = null

  // private
  // this.ikCtl = null
  gui = null
  boneAxesViewer = null

  video: any
  net: any

  // from pose detection frame
  ctx: CanvasRenderingContext2D

  bones: any

  // Human position difference from avatar
  startX: number | null = null
  startY: number | null = null
  ratio: number = 0.1// 4.1 (const)

  leftShoulderPrevPos: any = null
  leftElbowPrevPos: any = null
  // END from pose detection frame


  constructor() {

    const canvas: HTMLCanvasElement = document.querySelector("canvas#pose") as HTMLCanvasElement
    canvas.width = ___S.poseCamWidth
    canvas.height = ___S.poseCamHeight

    if (canvas.getContext("2d") === null) {
      throw new Error("Canvas has no 2D rendering context.")
    }

    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    //this.bones = this.skeleton.bones
  }

  setMesh(mesh: BABYLON.Mesh) {
    this.mesh = mesh
  }

  setSkeleton(skeleton: any) {
    this.skeleton = skeleton
    console.log('skeleton', this.skeleton)
  }

  init() {
    if (this.mesh === null || this.skeleton === null) {
      throw new Error("Klon not found")
    }


    this.mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
    this.mesh.position = new BABYLON.Vector3(0, 0, 0)

    // let animation = scene.beginAnimation(skeleton, 0, 100, true, 1.0)

    /* let target = BABYLON.MeshBuilder.CreateSphere('', { diameter: 5 }, scene)
    let poleTarget = BABYLON.MeshBuilder.CreateSphere('', { diameter: 2.5 }, scene)
    let t = 0
    poleTarget.position.x = 0
    poleTarget.position.y = 100
    poleTarget.position.z = -50

    target.parent = this.mesh
    poleTarget.parent = this.mesh */

    /* let ikCtl = new BABYLON.BoneIKController(
      this.mesh,
      this.skeleton.bones[14],
      { targetMesh: target, poleTargetMesh: poleTarget, poleAngle: Math.PI })

    ikCtl.maxAngle = Math.PI * 0.9 */

    // let boneAxesViewer = new BABYLON.Debug.BoneAxesViewer(scene, this.skeleton.bones[16], this.mesh)


    scene.registerBeforeRender(() => {


      /* target.position.x = -20;
      target.position.y = 40 + 40 * Math.sin(t)
      target.position.z = -30 + 40 * Math.cos(t) */

      // ikCtl.update()

      // console.log(this.skeleton.bones[30].position)

      // this.skeleton.bones[30].setPosition(new BABYLON.Vector3(0.8589507341384888, -7.034702207420196e-7, 4.174655714450637))

    })

    // this.skeleton.bones[30].setPosition(new BABYLON.Vector3(0.8589507341384888, -7.034702207420196e-7, 4.174655714450637))
    // this.skeleton.bones[30].markAsDirty()

    // tslint:disable-next-line:no-floating-promises
    this.initPose()
    this.initGUI()
  }

  async initPose() {
    this.video = await this.initCam()
    this.video.play()

    // Load the PoseNet model weights for either the 0.50, 0.75, 1.00, or 1.01
    this.net = await posenet.load(0.75)
    this.detectPoseInRealTime(this.video, this.net)
  }

  detectPoseInRealTime(video: any, net: any) {
    /* const canvas: HTMLCanvasElement = document.querySelector("canvas#pose") as HTMLCanvasElement
    canvas.width = ___S.poseCamWidth
    canvas.height = ___S.poseCamHeight

    if (canvas.getContext("2d") === null) {
      throw new Error("Canvas has no 2D rendering context.")
    }

    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    this.bones = this.skeleton.bones */

    void this.poseDetectionFrame()
  }

  async poseDetectionFrame() {

    // Begin monitoring code for frames per second
    // stats.begin()

    // Scale an image down to a certain factor. Too large of an image will
    // slow down the GPU
    const imageScaleFactor = 0.5  // TODO: gui .min(0.2).max(1.0)
    const outputStride = 16       // TODO: [8, 16, 32]

    const minPoseConfidence = 0.1   // TODO: gui
    const minPartConfidence = 0.5   // TODO: gui


    // since images are being fed from a webcam
    const flipHorizontal: boolean = true

    const pose = await this.net.estimateSinglePose(
      this.video, imageScaleFactor, flipHorizontal, outputStride)
    // poses.push(pose)


    this.ctx.clearRect(0, 0, ___S.poseCamWidth, ___S.poseCamHeight)

    //if (true) { // TODO: gui show video
    this.ctx.save()
    this.ctx.scale(-1, 1)
    this.ctx.translate(-___S.poseCamWidth, 0)
    this.ctx.drawImage(this.video, 0, 0, ___S.poseCamWidth, ___S.poseCamHeight)
    this.ctx.restore()
    //}

    if (pose.score >= minPoseConfidence) {
      // console.log('pose', pose)
      // if (guiState.output.showPoints) {
      drawKeypoints(pose.keypoints, minPartConfidence, this.ctx)
      // }
      if (this.startX !== null && this.startY !== null) {// if (guiState.output.showSkeleton) {
        drawSkeleton(pose.keypoints, minPartConfidence, this.ctx)
      }
      // if (guiState.output.showBoundingBox) {
      drawBoundingBox(pose.keypoints, this.ctx)
      // }

      for (const keypoint of pose.keypoints) {
        if (keypoint.score >= minPoseConfidence && BoneMap.has(keypoint.part)) {

          const keypointPos = keypoint.position

          if (this.startX === null || this.startY === null) {

            switch (keypoint.part) {
              case "leftShoulder":
                this.leftShoulderPrevPos = keypoint.position
                break
              case "leftElbow":
                this.leftElbowPrevPos = keypoint.position
                break
            }

            if (this.leftShoulderPrevPos !== null && this.leftElbowPrevPos !== null) {
              if (Math.abs(this.leftShoulderPrevPos.y - this.leftElbowPrevPos.y) < 5) {
                const bonePos = this.bones[BoneMap.get(keypoint.part) as number].position.clone()


                // console.log("RATIO", [leftShoulderPrevPos, leftElbowPrevPos, bones[boneMap["leftShoulder"]].position, bones[boneMap["leftElbow"]].position])

                this.startX = keypointPos.x - bonePos.x
                this.startY = keypointPos.y - bonePos.y
              }
            }

          } else {
            // console.log("start", [startX, startY])

            const boneIndex: number = BoneMap.get(keypoint.part) as number
            const bonePos = this.bones[boneIndex].position.clone()

            // TODO: find correct start position
            bonePos.x = (keypoint.position.x - this.startX) * this.ratio
            bonePos.y = (keypoint.position.y - this.startY) * this.ratio

            /* if (["leftShoulder", "leftElbow", "leftWrist"].includes(keypoint.part)) {
              console.log([keypoint.part, bones[boneIndex].position.clone(), pos])
            } */


            this.bones[boneIndex].setPosition(bonePos)
            this.bones[boneIndex].markAsDirty()
          }
        }
      }
    }

    // End monitoring code for frames per second
    // stats.end()

    requestAnimationFrame(this.poseDetectionFrame)
  }

  async initCam(): Promise<any> {
    // Init Camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Browser API navigator.mediaDevices.getUserMedia not available")
    }

    const video: HTMLVideoElement | null = document.querySelector("video#cam")
    if (video === null) {
      console.log("Video tag for camera not found.")
      return
    }
    video.width = ___S.poseCamWidth
    video.height = ___S.poseCamHeight

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: ___S.poseCamWidth,
        height: ___S.poseCamHeight
      }
    })
    video.srcObject = stream

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video)
      }
    })
  }

  initGUI() {
    const gui = new dat.GUI()
    gui.domElement.style.marginTop = "10px"
    gui.domElement.id = "datGUI"

    let boneAxesViewer: BABYLON.Debug.BoneAxesViewer | null
    const axesManager = {
      boneNumber: 1
    }
    const boneNumCtrl = gui.add(axesManager, 'boneNumber', 1, this.skeleton.bones.length - 1, 1)
    boneNumCtrl.onChange((value: any) => {
      if (boneAxesViewer) {
        boneAxesViewer.dispose()
      }
      boneAxesViewer = new BABYLON.Debug.BoneAxesViewer(scene, this.skeleton.bones[+value], this.mesh as BABYLON.Mesh)
    })

    /* gui.add(ikCtl, 'poleAngle', -Math.PI, Math.PI)
    gui.add(ikCtl, 'maxAngle', 0, Math.PI)
    gui.add(poleTarget.position, 'x', -100, 100).name('pole target x')
    gui.add(poleTarget.position, 'y', -100, 100).name('pole target y')
    gui.add(poleTarget.position, 'z', -100, 100).name('pole target z') */

    scene.registerBeforeRender(() => {
      if (boneAxesViewer !== null) {
        boneAxesViewer.update()
      }
    })
  }
}

export let klon = new Klon()
