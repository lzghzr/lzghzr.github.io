window.addEventListener('load', () => {
  if (navigator.userAgent.indexOf('Firefox') === -1) return
  const elmcanvas = <HTMLCanvasElement>document.querySelector('canvas')
  const context = elmcanvas.getContext('2d')
  const image = new Image()
  image.src = 'arrow.png'
  elmcanvas.style.cssText = 'cursor: none;'
  elmcanvas.width = window.innerWidth
  elmcanvas.height = window.innerHeight
  elmcanvas.addEventListener('mousemove', (ev) => {
    if (Math.random() > 0.9) {
      context.clearRect(0, 0, elmcanvas.width, elmcanvas.height)
      context.drawImage(image, ev.clientX, ev.clientY, 20, 20)
    }
  })
  elmcanvas.addEventListener('mouseout', (ev) => {
    context.clearRect(0, 0, elmcanvas.width, elmcanvas.height)
  })
  window.onresize = (ev) => {
    elmcanvas.width = window.innerWidth
    elmcanvas.height = window.innerHeight
  }
})
