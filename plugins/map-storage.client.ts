import Vue from "vue"

export interface IMapStorage {
  /**
   * Convert a `Map` to string and add to the `localStorage`
   */
  setItem(name: string, payload: Map<any, any>): void

  /**
   * Remove item from `localStorage`, convert to `Map` and return with it.
   * If it doesn't exists throw an exception.
   */
  getItem(name: string): Map<any, any>
}

const mapStorage: IMapStorage = {
  setItem(name: string, payload: Map<any, any>): void {
    const data = JSON.stringify(Array.from(payload.entries()))
    localStorage.setItem(name, data)
  },

  getItem(name: string): Map<any, any> {
    const data = localStorage.getItem(name)
    if (data) {
      return new Map(JSON.parse(data))
    }
    throw new Error(`Unkown storage item ${name}`)
  }
}

Vue.prototype.$mapStorage = mapStorage

declare module "vue/types/vue" {
  interface Vue {
    $mapStorage: IMapStorage
  }
}
