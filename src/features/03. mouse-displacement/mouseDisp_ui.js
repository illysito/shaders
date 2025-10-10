import gsap from 'gsap'

import dispHandler from './mouseDisp_handler'

function mouseDispUI(canvas) {
  //prettier-ignore
  const canvasUI = document.querySelector('.mouse-displacement-canvas-wrapper')

  const mouseXRef = { current: 0 }
  const mouseYRef = { current: 0 }
  // const p2o = 'power2.out'
  // const duration = 0.8

  const rect = canvasUI.getBoundingClientRect()

  const updateUniforms = dispHandler(canvas, mouseXRef, mouseYRef)

  // function hoverIn() {
  //   gsap.to(canvasUI, {
  //     scale: 0.975,
  //     borderRadius: 8,
  //     duration: duration - 0.2,
  //     ease: p2o,
  //   })
  // }

  // function hoverOut() {
  //   gsap.to(canvasUI, {
  //     scale: 1,
  //     borderRadius: 0,
  //     duration: duration - 0.2,
  //     ease: p2o,
  //   })
  // }

  // canvasUI.addEventListener('mouseover', () => {
  //   hoverIn()
  // })

  // canvasUI.addEventListener('mouseleave', () => {
  //   hoverOut()
  // })

  canvasUI.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX
    const mouseY = e.clientY

    const mappedMouseX = gsap.utils.mapRange(
      rect.left,
      rect.right,
      0,
      1,
      mouseX
    )
    const mappedMouseY = gsap.utils.mapRange(
      rect.top,
      rect.bottom,
      0,
      1,
      mouseY
    )

    mouseXRef.current = mappedMouseX
    mouseYRef.current = mappedMouseY
    updateUniforms()
  })
}

export default mouseDispUI
