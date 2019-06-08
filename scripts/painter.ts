import * as BABYLON from "babylonjs"

export default class {
  canvas: HTMLCanvasElement
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  dots: BABYLON.Mesh[] = []

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.initBabylon()
  }

  initBabylon() {
    this.engine = new BABYLON.Engine(this.canvas, true)

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.4, 0.1)

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      0,
      1,
      20,
      BABYLON.Vector3.Zero(),
      this.scene
    )
    camera.setTarget(new BABYLON.Vector3(0, 8, 0))
    camera.setPosition(new BABYLON.Vector3(0, 9, 20))
    camera.attachControl(this.canvas, true)

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
