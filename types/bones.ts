/**
 * Dude model bone mapping
 */
export enum DudeBones {
  root = 0,
  _crest = 1,
  __waist = 2,
  ___upperBody = 3,
  ____upperBody = 4,
  _____upperBody = 5,
  ______upperBody = 6,
  _______head = 7,
  ________rightEye = 10,
  ________leftEye = 11,
  ________rightEyebrow = 8,
  ________leftEyebrow = 9,
  _______rightArm = 12,
  ________rightShoulder = 13,
  _________rightElbow = 14,
  __________rightWrist = 15,
  ___________rightFinger1 = 16,
  ___________rightFinger2 = 19,
  ___________rightFinger3 = 22,
  ___________rightFinger4 = 25,
  ___________rightFinger5 = 28,
  _______leftArm = 31,
  ________leftShoulder = 32,
  _________leftElbow = 33,
  __________leftWrist = 34,
  ___________leftFinger1 = 35,
  ___________leftFinger2 = 38,
  ___________leftFinger3 = 41,
  ___________leftFinger4 = 44,
  ___________leftFinger5 = 47,
  ___rightHip = 50,
  ____rightKnee = 51,
  _____rightAnkle = 52,
  ______rightFoot = 53,
  ___leftHip = 54,
  ____leftKnee = 55,
  _____leftAnkle = 56,
  ______leftFoot = 57
}

export enum DudePosenetBones {
  // nose
  leftEye = DudeBones.________leftEye,
  rightEye = DudeBones.________rightEye,
  // leftEar
  // rightEar
  leftShoulder = DudeBones.________leftShoulder,
  rightShoulder = DudeBones.________rightShoulder,
  leftElbow = DudeBones._________leftElbow,
  rightElbow = DudeBones._________rightElbow,
  leftWrist = DudeBones.__________leftWrist,
  rightWrist = DudeBones.__________rightWrist,
  leftHip = DudeBones.___leftHip,
  rightHip = DudeBones.___rightHip,
  leftKnee = DudeBones.____leftKnee,
  rightKnee = DudeBones.____rightKnee,
  leftAnkle = DudeBones._____leftAnkle,
  rightAnkle = DudeBones._____rightAnkle
}
