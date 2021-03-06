import * as React from "react"
import PoseNet from "./components/PoseNet"

const App: React.FC = () => {
  if (process.env.NODE_ENV === "test") {
    return <div></div>
  }
  return (
    <div className="container mx-auto bg-gray-100">
      <PoseNet />
    </div>
  )
}

export default App
