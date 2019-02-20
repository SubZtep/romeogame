import { scene } from "../engine/engine"

export let sphere: BABYLON.Mesh

export function createSphere() {
  sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 2 },
    scene)
}
