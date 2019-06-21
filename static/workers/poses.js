/* eslint-disable no-undef */
self.importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core")
self.importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet")

console.log("Start loading posenet")
const net = posenet
  .load({
    architecture: "ResNet50",
    outputStride: 32,
    inputResolution: 257,
    quantBytes: 2
  })
  .then(pnet => {
    console.log("Posenet loaded", pnet)
    //net = pnet
    postMessage("loaded")
  })

self.onmessage = ev => {
  console.log("XXX", ev.data)
  const poses = net.estimatePoses(ev.data, {
    flipHorizontal: true,
    decodingMethod: "single-person"
  })
  postMessage(poses.toString())
  //postMessage("Juhuu")
}
