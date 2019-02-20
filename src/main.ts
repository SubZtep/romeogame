import "./assets/scss/main.scss"
import { klon } from "./classes/klon.ts"
import { initAssetManager } from "./engine/assets.ts"
import { canvas, engine, scene } from "./engine/engine.ts"
//import { createSphere } from "Objects/sphere"
import { createCamera } from "./scene/camera.ts"
import { createLight } from "./scene/light.ts"
import { data as ___S } from "./SETTINGS.ts"

function createButton(context: HTMLElement, func: any) {
  const button = document.createElement("input")
  button.type = "button"
  button.value = "Full Screen"
  button.onclick = func
  button.setAttribute("class", "btn br fullScreenBtn")
  context.appendChild(button)
}

const isFullScreen = false
function switchFullscreen() {
  if (!isFullScreen) {
    BABYLON.Tools.RequestFullscreen(canvas)
  } else {
    BABYLON.Tools.ExitFullscreen()
  }
}

function startUp() {
  const hud = document.querySelector("#hud") as HTMLElement

  if (___S.showFullscreenButton) {
    createButton(hud, switchFullscreen)
  }

  // Create basic objects
  createCamera()
  createLight()


  klon.init()

  // Game loop
  engine.runRenderLoop(() => {
    scene.render()
  })

  /* if (!PRODUCTION) {
    const msg = document.createElement("div")
    msg.setAttribute("class", "devBuild")
    msg.innerText = "Dev build."
    // hud.appendChild(msg)
  } */

  startGame()
}

function startGame() {
  // createSphere()
  // TODO: start behavious from gameplay folder


}

// Booting listeners
const listinerOpt = { capture: false, once: true }
const canvasEl = document.querySelector("canvas#game") as HTMLElement

canvasEl.addEventListener("engineLoaded", initAssetManager, listinerOpt)
canvasEl.addEventListener("assetsLoaded", startUp, listinerOpt)

