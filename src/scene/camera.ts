import { canvas, scene } from "../engine/engine.ts"

export let camera: BABYLON.Camera

export function createCamera() {
  /* camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 4, -10),
    scene)
  camera.setTarget(new BABYLON.Vector3(0, 0, 10))
  camera.attachControl(canvas) */

  camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene)
  camera.attachControl(canvas)
}
