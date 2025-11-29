import gsap from 'gsap'

import dispHandler from './disp_handler_ogl'

function dispUI(canvas) {
  //prettier-ignore
  const canvasUI = document.querySelector('.displacement-canvas-wrapper')

  const offsetRef = { current: 0 }
  const p2o = 'power2.out'
  const duration = 0.8

  const updateUniforms = dispHandler(canvas, offsetRef)

  function hoverIn() {
    gsap.to(offsetRef, {
      current: 1,
      duration: duration,
      ease: p2o,
      onUpdate: updateUniforms,
    })
    gsap.to(canvasUI, {
      scale: 1.05,
      borderRadius: 8,
      duration: duration - 0.2,
      ease: p2o,
    })
  }

  function hoverOut() {
    gsap.to(offsetRef, {
      current: 0,
      duration: duration,
      ease: p2o,
      onUpdate: updateUniforms,
    })
    gsap.to(canvasUI, {
      scale: 1,
      borderRadius: 0,
      duration: duration - 0.2,
      ease: p2o,
    })
  }

  canvasUI.addEventListener('mouseover', () => {
    hoverIn()
  })

  canvasUI.addEventListener('mouseleave', () => {
    hoverOut()
  })
}

export default dispUI
