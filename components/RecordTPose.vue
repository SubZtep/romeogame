<template lang="pug">
div
  button(v-if="countdown === 0" @click="startCountdown()") Record T-Pose
  .text-xl.text-yellow-200(v-else) {{ countdown }} 'til record
</template>

<script lang="ts">
import { Component, Vue, Getter } from "nuxt-property-decorator"
import { Keypoint } from "@tensorflow-models/posenet/dist/types"
import { recCountdownStart, minPartConfidence, minPoseConfidence } from "~/scripts/settings"
import { setTimeout } from "timers"
import { Keypoints } from "../types/pose"

@Component
export default class RecordTPoseComponent extends Vue {
  @Getter("getKeypoints", { namespace: "player" }) keypoints: Keypoint[]
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
    const pose: Keypoints = {}
    let valid = true
    this.keypoints.forEach(keypoint => {
      if (keypoint.score >= minPoseConfidence) {
        pose[keypoint.part] = keypoint.position
      } else {
        valid = false
      }
    })
    if (valid) {
      localStorage.setItem("TPose", JSON.stringify(pose))
    } else {
      this.startCountdown()
    }
  }
}
</script>
