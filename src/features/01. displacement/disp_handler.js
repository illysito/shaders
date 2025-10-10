import GlslCanvas from 'glslCanvas'

import disp_frag from './disp_shader'

//prettier-ignore
function displacementHandler(canvas) {
  // SETUP
  const shaderReference = 'DISPLACEMENT SHADER: '
  const gl = canvas.getContext('webgl')
  if (!gl) {
    console.error(shaderReference + 'WebGL not supported!')
  } else {
    console.log(shaderReference + 'WebGL is working!')
  }
  if (!canvas) {
    console.error(shaderReference + 'Canvas element not found!')
    return
  }

  // CALCULATE SIZE
  const calcSize = function () {
    let w = canvas.parentNode.clientWidth
    let h = canvas.parentNode.clientHeight
    let dpi = window.devicePixelRatio

    canvas.width = w * dpi
    canvas.height = h * dpi
  }
  calcSize()

  // CONNECT SHADERS TO CANVAS
  const sandbox = new GlslCanvas(canvas)

  const fragment_shader = disp_frag
  sandbox.load(fragment_shader)
  sandbox.setUniform('u_resolution', [canvas.width, canvas.height])
  //prettier-ignore
  const imageURL = 'https://raw.githubusercontent.com/illysito/padmi/624850fc2d7f98fa20d31aedc82ffb97fa0fd27b/PADMI%20HERO.png'
  sandbox.setUniform('u_image', imageURL)

  function updateUniforms() {
    sandbox.setUniform('u_resolution', [canvas.width, canvas.height])
  }

  window.addEventListener('resize', function () {
    calcSize()
    updateUniforms()
  })

  return updateUniforms
}

export default displacementHandler
