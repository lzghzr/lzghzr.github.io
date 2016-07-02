window.addEventListener('load', () => {
  if (!IsFirefox()) return
  const elmCanvas = <HTMLCanvasElement>document.querySelector('canvas')
  const context = elmCanvas.getContext('2d')
  const img = new Image()
  img.src = 'arrow.png'
  elmCanvas.style.cssText = 'cursor: none;'
  elmCanvas.width = window.innerWidth
  elmCanvas.height = window.innerHeight
  elmCanvas.addEventListener('mousemove', (ev) => {
    if (Math.random() > 0.9) {
      context.clearRect(0, 0, elmCanvas.width, elmCanvas.height)
      context.drawImage(img, ev.clientX, ev.clientY, 20, 20)
    }
  })
  elmCanvas.addEventListener('mouseout', (ev) => {
    context.clearRect(0, 0, elmCanvas.width, elmCanvas.height)
  })
  window.onresize = (ev) => {
    elmCanvas.width = window.innerWidth
    elmCanvas.height = window.innerHeight
  }
})
function IsFirefox(): boolean {
  const elmVideo = document.createElement('video')
  return (elmVideo.mozHasAudio === false)
}
interface HTMLVideoElement {
  mozHasAudio: boolean
}