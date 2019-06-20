/**
 * Basic Babylonjs helper
 */
import * as BABYLON from "babylonjs"
import { string2map } from "./utils"

export default class {
  canvas: HTMLCanvasElement
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  camera: BABYLON.TargetCamera
  materials: Map<string, BABYLON.Material> = new Map<string, BABYLON.Material>()

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.initBabylon()
    this.createMaterials()
  }

  initBabylon() {
    this.engine = new BABYLON.Engine(this.canvas, true)

    window.addEventListener("resize", () => {
      this.engine.resize()
    })

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.4, 0.1)

    //this.addArcRorateCamera()
    //this.addUniversalCamera()
    //this.addFlyCamera()

    this.addLight()
    //this.addDebugBox()
  }

  /** Create some default material with basic colours for the good */
  private createMaterials() {
    this.materials.set("red", this.createColorMaterial(BABYLON.Color3.Red()))
    this.materials.set("green", this.createColorMaterial(BABYLON.Color3.Green()))
    this.materials.set("white", this.createColorMaterial(BABYLON.Color3.White()))
    this.materials.set("magenta", this.createColorMaterial(BABYLON.Color3.Magenta()))
    this.materials.set("black", this.createColorMaterial(BABYLON.Color3.Black()))
    this.materials.set("yellow", this.createColorMaterial(BABYLON.Color3.Yellow()))
  }

  /**
   * Create a material from a single colour
   * @param color
   */
  createColorMaterial(color: BABYLON.Color3): BABYLON.StandardMaterial {
    const color4 = BABYLON.Color4.FromColor3(color)
    const mat = new BABYLON.StandardMaterial(color4.toString(), this.scene)
    mat.alpha = color4.a
    mat.diffuseColor = new BABYLON.Color3(color4.r, color4.g, color4.b)
    return mat
  }

  addUniversalCamera() {
    this.camera = new BABYLON.UniversalCamera("camera", BABYLON.Vector3.Zero(), this.scene)
    this.camera.attachControl(this.canvas, true)
    // Camera position and rotation default to my current setup:)
    //this.camera.position = new BABYLON.Vector3(200, 200, 500)
    //this.camera.rotation = new BABYLON.Vector3(0, 3, 3)
  }

  addArcRorateCamera() {
    this.camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2,
      20,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    )
    this.camera.attachControl(this.canvas, true)
  }

  addFlyCamera() {
    this.camera = new BABYLON.FlyCamera("camera", BABYLON.Vector3.Zero(), this.scene)
    //this.painter.camera.rotation = new BABYLON.Vector3(0, 0, Math.PI)
    //this.camera.attachControl(this.canvas, true)
  }

  addLight() {
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
  }

  addDebugBox() {
    const mat = new BABYLON.StandardMaterial("white", this.scene)
    mat.alpha = 1
    mat.diffuseColor = BABYLON.Color3.White()
    const sphere = BABYLON.MeshBuilder.CreateBox("debug box", { size: 1 }, this.scene)
    sphere.material = mat
    sphere.position = new BABYLON.Vector3(0, 0, 0)
  }

  toggleDebugLayer() {
    if (this.scene.debugLayer.isVisible()) {
      this.scene.debugLayer.hide()
    } else {
      this.scene.debugLayer.show()
    }
  }

  gameLoop() {
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  stopBabylon() {
    window.removeEventListener("resize", () => {
      this.engine.resize()
    })
    // if (this.scene.debugLayer.isVisible()) {
    //   this.scene.debugLayer.hide()
    // }
    this.engine.stopRenderLoop()
    this.scene.dispose()
    this.engine.dispose()
  }

  /**
   * Cerate helper sphere
   * @param color Sphere color
   * @returns Dot index
   */
  createSphere(
    material: BABYLON.Material,
    position: BABYLON.Vector3 = BABYLON.Vector3.Zero(),
    size: number = 1
  ): BABYLON.Mesh {
    const sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: size }, this.scene)
    sphere.material = material
    sphere.position = position
    return sphere
  }
}
