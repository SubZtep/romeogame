import * as posenet from "@tensorflow-models/posenet"

const pointRadius = 3

export const config = {
  videoWidth: 900,
  videoHeight: 700,
  flipHorizontal: true,
  algorithm: "single-pose",
  showVideo: true,
  showSkeleton: true,
  showPoints: true,
  minPoseConfidence: 0.1,
  minPartConfidence: 0.5,
  maxPoseDetections: 2,
  nmsRadius: 20,
  outputStride: 16,
  imageScaleFactor: 0.5,
  skeletonColor: "#ffadea",
  skeletonLineWidth: 6,
  loadingText: "Loading...please be patient..."
}

function toTuple({ x, y }: { x: number; y: number }) {
  return [x, y]
}

export function drawKeyPoints(
  keypoints: posenet.Keypoint[],
  minConfidence: number,
  skeletonColor: string,
  canvasContext: CanvasRenderingContext2D,
  scale: number = 1
) {
  keypoints.forEach(keypoint => {
    if (keypoint.score >= minConfidence) {
      const { x, y } = keypoint.position
      canvasContext.beginPath()
      canvasContext.arc(x * scale, y * scale, pointRadius, 0, 2 * Math.PI)
      canvasContext.fillStyle = skeletonColor
      canvasContext.fill()
    }
  })
}

function drawSegment(
  [firstX, firstY]: number[],
  [nextX, nextY]: number[],
  color: string,
  lineWidth: number,
  scale: number,
  canvasContext: CanvasRenderingContext2D
) {
  canvasContext.beginPath()
  canvasContext.moveTo(firstX * scale, firstY * scale)
  canvasContext.lineTo(nextX * scale, nextY * scale)
  canvasContext.lineWidth = lineWidth
  canvasContext.strokeStyle = color
  canvasContext.stroke()
}

export function drawSkeleton(
  keypoints: posenet.Keypoint[],
  minConfidence: number,
  color: string,
  lineWidth: number,
  canvasContext: CanvasRenderingContext2D,
  scale: number = 1
) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence)

  adjacentKeyPoints.forEach(keypoints => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      lineWidth,
      scale,
      canvasContext
    )
  })
}
