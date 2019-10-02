import * as React from "react"
import * as posenet from "@tensorflow-models/posenet"

const drawSegment = (
  [firstX, firstY]: number[],
  [nextX, nextY]: number[],
  color: string,
  lineWidth: number,
  scale: number,
  canvasContext: CanvasRenderingContext2D
) => {
  canvasContext.beginPath()
  canvasContext.moveTo(firstX * scale, firstY * scale)
  canvasContext.lineTo(nextX * scale, nextY * scale)
  canvasContext.lineWidth = lineWidth
  canvasContext.strokeStyle = color
  canvasContext.stroke()
}

const toTuple = ({ x, y }: { x: number; y: number }): [number, number] => {
  return [x, y]
}

interface IDebugCanvasState {
  width: number
  height: number
  keypoints: posenet.Keypoint[]
  pointRadius?: number
  //minPoseConfidence?: number
  minPartConfidence?: number
  scale?: number
  skeletonColor?: string
  skeletonLineWidth?: number
}

const DebugCanvas: React.FC<IDebugCanvasState> = props => {
  const {
    pointRadius = 3,
    //minPoseConfidence = 0.1,
    minPartConfidence = 0.5,
    scale = 1,
    skeletonColor = "#ffadea",
    skeletonLineWidth = 6
  } = props

  const ref = React.useRef<HTMLCanvasElement>(null)
  let canvasContext: CanvasRenderingContext2D

  const refreshCanvas = () => {
    if (props.keypoints.length === 0) return
    if (!canvasContext) {
      if (ref.current === null) return
      canvasContext = ref.current.getContext("2d") as CanvasRenderingContext2D
    }

    // Clear Canvas
    canvasContext.clearRect(0, 0, props.width, props.height)

    // Draw Keypoints
    props.keypoints.forEach(keypoint => {
      if (keypoint.score >= minPartConfidence) {
        const { x, y } = keypoint.position
        canvasContext.beginPath()
        canvasContext.arc(x * scale, y * scale, pointRadius, 0, 2 * Math.PI)
        canvasContext.fillStyle = skeletonColor
        canvasContext.fill()
      }
    })

    // Draw Skeleton
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(props.keypoints, minPartConfidence)
    adjacentKeyPoints.forEach(keypoints => {
      drawSegment(
        toTuple(keypoints[0].position),
        toTuple(keypoints[1].position),
        skeletonColor,
        skeletonLineWidth,
        scale,
        canvasContext
      )
    })
  }

  React.useEffect(refreshCanvas, [props.keypoints])

  return <canvas ref={ref} width={props.width} height={props.height} className="absolute" />
}

export default DebugCanvas
