//import * as dat from "dat.gui"
import GameLoadingScreen from "../classes/gameLoadingScreen.ts"
import { klon } from "../classes/klon.ts"
import { canvas, engine, scene } from "../engine/engine.ts"
import { data as ___S } from "../SETTINGS.ts"

/*
** LOADING SCREEN
*/

/* class GameLoadingScreen {
  loadingEl: HTMLElement
  loadingTextEl: HTMLElement

  loadingUIBackgroundColor = ""
  loadingUIText = ""

  constructor() {
    this.loadingEl = document.querySelector("#loading") as HTMLElement
    this.loadingTextEl = this.loadingEl.querySelector(".msg") as HTMLElement
  }

  displayLoadingUI = () => {
    // loading ui
  }

  hideLoadingUI = (): void => {
    //if (this.loadingEl === null) return null
    this.loadingEl.className = "hide"
    setTimeout(() => (this.loadingEl.parentNode as HTMLElement).removeChild(this.loadingEl), 300)
  }
} */

/*
** ASSET MANAGER
*/

const assetFiles = [
  // "meshes/skull.babylon"
  "meshes/Dude/Dude.babylon"
]

export let assetsManager: BABYLON.AssetsManager

export function initAssetManager() {
  engine.loadingScreen = new GameLoadingScreen()
  assetsManager = new BABYLON.AssetsManager(scene)
  assetsManager.onProgress = managerProgress
  assetsManager.onFinish = managerOnFinish
  assetFiles.map(fn => addTask(fn))
  assetsManager.load()
}

function addTask(fn: string) {
  let task1: any = null //BABYLON.MeshAssetTask
  const cat = fn.split("/")[0]
  const pos = fn.lastIndexOf("/") + 1
  const folder = fn.substring(0, pos)
  const file = fn.substring(pos)

  switch (cat) {
    case "skybox":
    case "textures":
      task1 = assetsManager.addTextureTask("Task", fn)
      break
    case "meshes":
      task1 = assetsManager.addMeshTask("Task", "", folder, file)
      break
    default: return
  }

  if (task1 !== null) {
    task1.onSuccess = taskOnSuccess
    task1.onError = taskOnError
  }
}

function taskOnSuccess(task: any) {
  // console.log('TASK', task)

  if (task.sceneFilename === "Dude.babylon") {
    klon.setMesh(task.loadedMeshes[0])
    klon.setSkeleton(task.loadedSkeletons[0])
  }

  /* let gui = new dat.GUI()
	gui.domElement.style.marginTop = "100px"
	gui.domElement.id = "datGUI"


  let target = BABYLON.MeshBuilder.CreateSphere('', { diameter: 5 }, scene)
  let poleTarget = BABYLON.MeshBuilder.CreateSphere('', { diameter: 2.5 }, scene)

  let mesh = task.loadedMeshes[0]
  let skeleton = task.loadedSkeletons[0]
  mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
	mesh.position = new BABYLON.Vector3(0, 0, 0)

  //let animation = scene.beginAnimation(skeleton, 0, 100, true, 1.0)
  let t = 0

  poleTarget.position.x = 0
  poleTarget.position.y = 100
  poleTarget.position.z = -50

  target  .parent = mesh
	poleTarget.parent = mesh

  let ikCtl = new BABYLON.BoneIKController(
    mesh,
    skeleton.bones[14],
    { targetMesh: target, poleTargetMesh: poleTarget, poleAngle: Math.PI })

  ikCtl.maxAngle = Math.PI * 0.9

  let bone1AxesViewer = new BABYLON.Debug.BoneAxesViewer(scene, skeleton.bones[14], mesh)
  let bone2AxesViewer = new BABYLON.Debug.BoneAxesViewer(scene, skeleton.bones[13], mesh)


  gui.add(ikCtl, 'poleAngle', -Math.PI, Math.PI)
  gui.add(ikCtl, 'maxAngle', 0, Math.PI)
  gui.add(poleTarget.position, 'x', -100, 100).name('pole target x')
  gui.add(poleTarget.position, 'y', -100, 100).name('pole target y')
  gui.add(poleTarget.position, 'z', -100, 100).name('pole target z')


  scene.registerBeforeRender(function () {
    //t += 0.03

    target.position.x = -20;
    target.position.y = 40 + 40 * Math.sin(t)
    target.position.z = -30 + 40 * Math.cos(t)

    ikCtl.update()

    bone1AxesViewer.update()
    bone2AxesViewer.update()

  }) */


}

//function taskOnError(task, message, exception) {
function taskOnError() {
  (engine.loadingScreen as GameLoadingScreen).loadingEl.style.background = "darkred"
}

function managerProgress(remainingCount: any, totalCount: any, lastFinishedTask: any) {
  addLoadingMessage(`${totalCount - remainingCount}/${totalCount}: ${lastFinishedTask.url}`)
}

//function managerOnFinish(tasks) {
function managerOnFinish() {
  // engine.hideLoadingUI()
  canvas.dispatchEvent(new Event("assetsLoaded"))
}

//function addLoadingMessage(text) {
function addLoadingMessage(text: any) {
  (engine.loadingScreen as GameLoadingScreen).loadingTextEl.textContent += "\n" + text
}
