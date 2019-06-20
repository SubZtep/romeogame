<template lang="pug">
div
  button(v-if="countdown === 0" @click="startCountdown()") Record T-Pose
  .text-xl.text-yellow-200(v-else) {{ countdown }} 'til record
</template>

<script lang="ts">
import { setTimeout } from "timers"
import { Component, Vue, Getter } from "nuxt-property-decorator"
import * as BABYLON from "babylonjs"
import { getPosenetJointNames, map2string } from "~/scripts/utils"
import { recCountdownStart, TPoseStorageName } from "~/scripts/settings"

@Component
export default class RecordTPoseComponent extends Vue {
  @Getter("getPosenetJoints", { namespace: "player" }) posenetJoints: Map<string, BABYLON.Vector3>

  countdown: number = 0

  startCountdown() {
    this.countdown = recCountdownStart
    this.doCountdown()
  }

  doCountdown() {
    setTimeout(() => {
      if (--this.countdown > 0) {
        this.doCountdown()
      } else {
        this.recordPose()
      }
    }, 1000)
  }

  recordPose() {
    const valid: boolean = true //getPosenetJointNames().length === this.posenetJoints.size
    if (valid) {
      const joints = new Map<string, BABYLON.Vector3>()
      this.posenetJoints.forEach((position, jointName) => {
        joints.set(jointName, position)
      })
      localStorage.setItem(TPoseStorageName, map2string(joints))
    } else {
      this.startCountdown()
    }
  }
}
</script>
