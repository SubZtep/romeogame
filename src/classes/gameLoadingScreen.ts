export default class GameLoadingScreen {
  loadingEl: HTMLElement
  loadingTextEl: HTMLElement

  loadingUIBackgroundColor = ""
  loadingUIText = ""

  constructor() {
    this.loadingEl = document.querySelector("#loading") as HTMLElement
    this.loadingTextEl = this.loadingEl.querySelector(".msg") as HTMLElement
  }

  displayLoadingUI = () => {
    // loading ui
  }

  hideLoadingUI = (): void => {
    //if (this.loadingEl === null) return null
    this.loadingEl.className = "hide"
    setTimeout(() => (this.loadingEl.parentNode as HTMLElement).removeChild(this.loadingEl), 300)
  }
}
