import GlslCanvas from 'glslCanvas'

import filter_frag from './filter_frag'

//prettier-ignore
function filter(redRef, greenRef, blueRef, noiseRef, redShiftRef, greenShiftRef, blueShiftRef) {
  const canvas = document.querySelector('#filter_canvas')
  // const canvas = document.createElement('canvas')
  // const canvas_wrapper = document.querySelector('.canvas-wrapper')
  // canvas.id = 'filter_canvas' // You can assign an ID for styling or referencing
  // canvas_wrapper.appendChild(canvas)

  const gl = canvas.getContext('webgl')
  if (!gl) {
    console.error('WebGL not supported!')
  } else {
    console.log('WebGL is working!')
  }
  if (!canvas) {
    console.error('Canvas element not found!')
    return
  }

  const calcSize = function () {
    let w = canvas.parentNode.clientWidth
    let h = canvas.parentNode.clientHeight
    let dpi = window.devicePixelRatio

    canvas.width = w * dpi
    canvas.height = h * dpi
  }

  calcSize()

  const sandbox = new GlslCanvas(canvas)

  const fragment_shader = filter_frag
  sandbox.load(fragment_shader)
  sandbox.setUniform('u_resolution', [canvas.width, canvas.height])
  //prettier-ignore
  const imageURL = 'https://raw.githubusercontent.com/illysito/padmi/624850fc2d7f98fa20d31aedc82ffb97fa0fd27b/PADMI%20HERO.png'
  sandbox.setUniform('u_image', imageURL)

  sandbox.setUniform('u_red', redRef.current)
  sandbox.setUniform('u_green', greenRef.current)
  sandbox.setUniform('u_blue', blueRef.current)
  sandbox.setUniform('u_red_shift', redShiftRef.current)
  sandbox.setUniform('u_green_shift', greenShiftRef.current)
  sandbox.setUniform('u_blue_shift', blueShiftRef.current)
  sandbox.setUniform('u_noiseFactor', noiseRef.current)

  function updateUniforms() {
    sandbox.setUniform('u_resolution', [canvas.width, canvas.height])
    sandbox.setUniform('u_red', redRef.current)
    sandbox.setUniform('u_green', greenRef.current)
    sandbox.setUniform('u_blue', blueRef.current)
    sandbox.setUniform('u_red_shift', redShiftRef.current)
    sandbox.setUniform('u_green_shift', greenShiftRef.current)
    sandbox.setUniform('u_blue_shift', blueShiftRef.current)
    sandbox.setUniform('u_noiseFactor', noiseRef.current)
  }

  window.addEventListener('resize', function () {
    calcSize()
    updateUniforms()
  })

  return updateUniforms
}

export default filter
