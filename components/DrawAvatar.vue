<template lang="pug">
canvas(
  ref="render"
  :style="`width: ${width}px; height: ${height}px`")
//-div X {{ getKeypoints }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Getter, Watch } from "nuxt-property-decorator"
import * as BABYLON from "babylonjs"
import Joints from "~/scripts/joints"
import Transform from "~/scripts/transform"

@Component
export default class DrawAvatarComponent extends Vue {
  @Prop({ default: 352 }) width!: number
  @Prop({ default: 288 }) height!: number

  @Getter("getKeypoints", { namespace: "player" }) getKeypoints

  engine: BABYLON.Engine
  scene: BABYLON.Scene
  joints: Joints
  transform: Transform
  minPartConfidence = 0.5

  @Watch("getKeypoints")
  onKeypointsChange(val) {
    //console.log("KEYPOINTS", val)
    this.transform.updateKeypoints(val, this.minPartConfidence)
    this.transform.head()
  }

  mounted() {
    this.joints = new Joints()
    this.transform = new Transform(this.joints)

    // Init BabylonJS
    const canvas = this.$refs.render as HTMLCanvasElement
    this.engine = new BABYLON.Engine(canvas, true)

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
    camera.setTarget(new BABYLON.Vector3(0, 4, 0))
    camera.setPosition(new BABYLON.Vector3(0, 5, 5))
    camera.attachControl(canvas, true)

    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7

    const sphere = BABYLON.MeshBuilder.CreateSphere("", { diameter: 0.0001 }, this.scene)

    BABYLON.SceneLoader.ImportMesh(
      "him",
      "/models/Dude/",
      "dude.babylon",
      this.scene,
      (newMeshes, particleSystems, skeletons) => {
        const mesh = newMeshes[0]
        const skeleton = skeletons[0]
        mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1)
        mesh.position = new BABYLON.Vector3(0, 0, 0)

        const head_bone = skeleton.bones[7]
        const right_shoulder_bone = skeleton.bones[13]
        const right_arm_bone = skeleton.bones[14]
        const left_shoulder_bone = skeleton.bones[32]
        const left_arm_bone = skeleton.bones[33]

        const lookAtCtl = new BABYLON.BoneLookController(mesh, head_bone, sphere.position, {
          adjustYaw: Math.PI * 0.5,
          adjustRoll: Math.PI * 0.5
        })

        this.scene.registerBeforeRender(() => {
          const { data } = this.joints

          sphere.position.x = 0 + data.head.x
          sphere.position.y = 6 + data.head.y
          sphere.position.z = 5

          lookAtCtl.update()

          right_shoulder_bone.rotation = new BABYLON.Vector3(0, 1.5 * data.rightShoulder, 0)
          right_arm_bone.rotation = new BABYLON.Vector3(0, data.rightElbow, 0)
          left_shoulder_bone.rotation = new BABYLON.Vector3(0, -1.5 * data.leftShoulder, 0)
          left_arm_bone.rotation = new BABYLON.Vector3(0, -data.leftElbow, 0)
        })
      }
    )

    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
  }
}
</script>
