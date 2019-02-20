import { scene } from "../engine/engine.ts"

export let light: BABYLON.DirectionalLight;

export function createLight() {
  /*light = new BABYLON.PointLight(
    "light",
    new BABYLON.Vector3(0, 5, -5),
    scene)*/


  light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0.3, -1, 0.1), scene)
  light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
  // light.specular = new BABYLON.Color3(0, 1, 0);

  light.intensity = 0.9
  light.position = new BABYLON.Vector3(0, 10, 10)

}
