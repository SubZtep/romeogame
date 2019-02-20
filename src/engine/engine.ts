import * as BABYLON from "babylonjs"
import { data as ___S } from "../SETTINGS"

export let canvas: HTMLCanvasElement
export let engine: BABYLON.Engine
export let scene: BABYLON.Scene

function initEngine() {

  // Test if the browser is support BabylionJS
  if (BABYLON.Engine.isSupported()) {

    // Everything is fine, let's start Babylon
    canvas = document.querySelector("canvas#game") as HTMLCanvasElement
    engine = new BABYLON.Engine(canvas, true)
    engine.enableOfflineSupport = false

    /*
    ** SCENE PROPERTIES
    */
    scene = new BABYLON.Scene(engine)
    // scene.clearColor = new BABYLON.Color3(1.0, 1.0, 1.0)

    // Handle resize event (try without it)
    window.addEventListener("resize", () => engine.resize())

    // Tell to the game, it is time to start
    canvas.dispatchEvent(new Event('loaded'))

    // Set physics engine
    const gravityVector = new BABYLON.Vector3(0, -9.81, -5)
    // let physicsPlugin = new BABYLON.CannonJSPlugin()
    const physicsPlugin = new BABYLON.OimoJSPlugin()
    scene.enablePhysics(gravityVector, physicsPlugin)

    // Fix distorsion after resiye
    window.addEventListener("resize", () => engine.resize())

    // It'S time to start
    canvas.dispatchEvent(new Event("engineLoaded"))

  } else {

    // Make the player disappointed, browser copycat
    throw new Error("I'm afraid your Browser is not supported.")
  }
}

// Wait until the page is loaded
document.addEventListener("DOMContentLoaded", initEngine, false)
