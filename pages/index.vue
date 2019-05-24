<template lang="pug">
.container
  div(:class="$style.mainGrid")
    WebcamStream(:video-width="320" :video-height="200")
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator"
import WebcamStream from "~/components/WebcamStream.vue"

@Component({ components: { WebcamStream } })
export default class IndexPage extends Vue {}
</script>

<style module>
.mainGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
