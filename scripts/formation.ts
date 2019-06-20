import { IJoint } from "~/types/joint"
import { BoneJoint } from "~/types/joints"

export default class Formation {
  rootJoint: IJoint

  /**
   * Find a joint
   * @param name Joint name
   */
  getJoint(name: BoneJoint): IJoint {
    return this.searchJoint(this.rootJoint, name)
  }

  private searchJoint(joint: IJoint, name: BoneJoint, level: number = 0): IJoint {
    if (joint.name === name) {
      return joint
    } else if (joint.children.length > 0) {
      let res = null
      for (let i = 0, len = joint.children.length; res === null && i < len; i++) {
        res = this.searchJoint(joint.children[i], name, level + 1)
      }
      return res
    }
    return null
  }
}
