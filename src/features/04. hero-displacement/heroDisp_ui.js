import gsap from 'gsap'

import heroDispHandler from './heroDisp_handler'

function heroDispUI(canvas) {
  //prettier-ignore
  // const canvasUI = document.querySelector('.hero-displacement-canvas-wrapper')

  const offsetRef = { current: 0 }
  const p2o = 'power2.out'
  const duration = 1

  const updateUniforms = heroDispHandler(canvas, offsetRef)

  function image_1() {
    gsap.to(offsetRef, {
      current: 1,
      duration: duration,
      ease: p2o,
      onUpdate: updateUniforms,
    })
  }

  function image_2() {
    gsap.to(offsetRef, {
      current: 0,
      duration: duration,
      ease: p2o,
      onUpdate: updateUniforms,
    })
  }

  window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX
    if (mouseX > window.innerWidth / 2) {
      image_1()
    } else {
      image_2()
    }
  })
}

export default heroDispUI
