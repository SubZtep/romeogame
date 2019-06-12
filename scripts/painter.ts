/**
 * Basic Babylonjs helper
 */
import * as BABYLON from "babylonjs"

export default class {
  canvas: HTMLCanvasElement
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  camera: BABYLON.UniversalCamera
  dots: BABYLON.Mesh[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.initBabylon()
  }

  initBabylon() {
    this.engine = new BABYLON.Engine(this.canvas, true)

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.4, 0.1)
    //this.scene.debugLayer.show()

    this.camera = new BABYLON.UniversalCamera("camera", BABYLON.Vector3.Zero(), this.scene)
    this.camera.attachControl(this.canvas, true)
    // Camera position and rotation default to my current setup:)
    this.camera.position = new BABYLON.Vector3(200, 200, 500)
    this.camera.rotation = new BABYLON.Vector3(0, 3, 3)

    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
  }

  gameLoop() {
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  /**
   * Cerate helper sphere
   * @param color Sphere color
   * @returns Dot index
   */
  addDot(color: BABYLON.Color4, size: number = 1): number {
    const mat = new BABYLON.StandardMaterial("red", this.scene)
    mat.alpha = color.a
    mat.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b)

    const sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: size }, this.scene)
    sphere.material = mat

    const length = this.dots.push(sphere)
    return length - 1
  }
}
