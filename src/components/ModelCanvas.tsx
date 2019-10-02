import * as React from "react"
import * as BABYLON from "babylonjs"
import * as posenet from "@tensorflow-models/posenet"

/** Look at controller */
let lookAtCtl: BABYLON.BoneLookController

/** Sphere to look at */
let sphere: BABYLON.Mesh

/** Avatar mesh */
let mesh: BABYLON.AbstractMesh

/** Avatar skeleton */
let skeleton: BABYLON.Skeleton

const moveAvatar = (keypoints: posenet.Keypoint[]) => {
  const nose = (keypoints.find(point => point.part === "nose") as posenet.Keypoint).position
  const head_bone = skeleton.bones[7]

  scene.registerBeforeRender(() => {
    //FIXME: Tweak me
    sphere.position.x = head_bone.position.x + Math.round((640 / 2 - nose.x) / 20)
    sphere.position.y = head_bone.position.x + Math.round((480 / 2 - nose.y) / 20)
    sphere.position.z = 6

    lookAtCtl.update()
  })
}

const onAvatarImported = (
  meshes: BABYLON.AbstractMesh[],
  particleSystems: BABYLON.IParticleSystem[],
  skeletons: BABYLON.Skeleton[],
  animationGroups: BABYLON.AnimationGroup[]
) => {
  const scaleAmount = 0.1
  meshes[0].scaling = new BABYLON.Vector3(scaleAmount, scaleAmount, scaleAmount)

  mesh = meshes[0]
  skeleton = skeletons[0]
  sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.0001 }, scene)

  lookAtCtl = new BABYLON.BoneLookController(mesh, skeleton.bones[7], sphere.position, {
    adjustYaw: Math.PI * 0.5,
    adjustRoll: Math.PI * 0.5
  })
}

const onSceneMount = (e: SceneEventArgs) => {
  const { canvas, scene, engine } = e

  var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, 11), scene)
  camera.setTarget(new BABYLON.Vector3(0, 3.5, 0))
  camera.attachControl(canvas, true)
  new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene)
  //BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene)

  // Load Dude model
  BABYLON.SceneLoader.ImportMesh("him", "/models/Dude/", "dude.babylon", scene, onAvatarImported)

  engine.runRenderLoop(() => {
    if (scene) {
      scene.render()
    }
  })
}

let scene: BABYLON.Scene
let engine: BABYLON.Engine
let canvas: HTMLCanvasElement

const initBabylon = () => {
  if (!engine) {
    engine = new BABYLON.Engine(canvas, true)
    scene = new BABYLON.Scene(engine)
    onSceneMount({
      scene,
      engine,
      canvas
    })
  }
}

const onResizeWindow = () => {
  if (engine) {
    engine.resize()
  }
}

export type SceneEventArgs = {
  engine: BABYLON.Engine
  scene: BABYLON.Scene
  canvas: HTMLCanvasElement
}

export type SceneProps = {
  width?: number
  height?: number
  keypoints?: posenet.Keypoint[]
}

const ModelCanvas: React.FC<SceneProps & React.HTMLAttributes<HTMLCanvasElement>> = props => {
  const { width = 640, height = 480 } = props // eslint-disable-line

  React.useEffect(() => {
    initBabylon()
    window.addEventListener("resize", onResizeWindow)
    return () => {
      window.removeEventListener("resize", onResizeWindow)
    }
  }, [])

  React.useEffect(() => {
    if (props.keypoints && props.keypoints.length > 0) {
      moveAvatar(props.keypoints)
    }
  }, [props.keypoints])

  const onCanvasLoaded = (c: HTMLCanvasElement) => {
    if (c !== null) {
      canvas = c
    }
  }

  const attrs = {
    width: props.width,
    height: props.height
  }
  return <canvas {...attrs} ref={onCanvasLoaded} />
}

export default ModelCanvas
