//declare module "demo_util"

declare function drawPoint(ctx: CanvasRenderingContext2D, y: number, x: number, r: number, color: string): void

/**
 * Draws a line on a canvas, i.e. a joint
 */
//declare function drawSegment([ay: number, ax: number], [by: number, bx: number], color: number, scale: number, ctx: CanvasRenderingContext2D): void

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
declare function drawSkeleton(keypoints: any, minConfidence: any, ctx: CanvasRenderingContext2D, scale?: number): void

/**
 * Draw pose keypoints onto a canvas
 */
declare function drawKeypoints(keypoints: number, minConfidence: number, ctx: CanvasRenderingContext2D, scale?: number): void

/**
 * Draw the bounding box of a pose. For example, for a whole person standing
 * in an image, the bounding box will begin at the nose and extend to one of
 * ankles
 */
declare function drawBoundingBox(keypoints: any, ctx: CanvasRenderingContext2D): void

/**
 * Converts an array of pixel data into an ImageData object
 */
declare function renderToCanvas(a: any, ctx: CanvasRenderingContext2D): void

/**
 * Draw an image on a canvas
 */
declare function renderImageToCanvas(image: any, size: any, canvas: any): void

/**
 * Draw heatmap values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's heatmap outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
declare function drawHeatMapValues(heatMapValues: any, outputStride: any, canvas: HTMLCanvasElement): void

/**
 * Used by the drawHeatMapValues method to draw heatmap points on to
 * the canvas
 */
declare function drawPoints(ctx: CanvasRenderingContext2D, points: any, radius: number, color: string): void

/**
 * Draw offset vector values, one of the model outputs, on to the canvas
 * Read our blog post for a description of PoseNet's offset vector outputs
 * https://medium.com/tensorflow/real-time-human-pose-estimation-in-the-browser-with-tensorflow-js-7dd0bc881cd5
 */
declare function drawOffsetVectors(
  heatMapValues: any, offsets: any, outputStride: any, scale: number, ctx: HTMLCanvasElement): void
