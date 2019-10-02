import * as React from "react"
import * as posenet from "@tensorflow-models/posenet"
import Webcam from "react-webcam"
import DebugCanvas from "./DebugCanvas"

interface IPoseNetProps {
  videoWidth?: number
  videoHeight?: number
  flipHorizontal?: boolean
  minPoseConfidence?: number
}

const PoseNet: React.FC<IPoseNetProps> = props => {
  const {
    videoWidth = 640,
    videoHeight = 480,
    flipHorizontal = true,
    minPoseConfidence = 0.1
  } = props
  const webcamRef = React.useRef<Webcam>(null)
  let posenetModel: posenet.PoseNet

  const [keypoints, setKeypoints] = React.useState<posenet.Keypoint[]>([])

  const loadPoseNet = async () => {
    try {
      posenetModel = await posenet.load({
        architecture: "ResNet50",
        outputStride: 32,
        inputResolution: 257,
        quantBytes: 2,
        multiplier: 1
      })
    } catch (error) {
      throw new Error("PoseNet failed to load")
    }
    poseDetectionFrame()
  }

  const poseDetectionFrame = () => {
    const video = (webcamRef.current as Webcam).video as HTMLVideoElement
    video.width = videoWidth
    video.height = videoHeight

    const findPoseDetectionFrame = async () => {
      const pose = await posenetModel.estimateSinglePose(video, {
        flipHorizontal
      })

      if (pose.score >= minPoseConfidence) {
        setKeypoints(pose.keypoints)
      }

      requestAnimationFrame(findPoseDetectionFrame)
    }
    findPoseDetectionFrame()
  }

  return (
    <div className="relative">
      <Webcam
        audio={false}
        mirrored={true}
        onUserMedia={loadPoseNet}
        ref={webcamRef}
        className="absolute"
      />
      <DebugCanvas width={videoWidth} height={videoHeight} keypoints={keypoints} />
    </div>
  )
}

export default PoseNet
