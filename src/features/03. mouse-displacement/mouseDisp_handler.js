import GlslCanvas from 'glslCanvas'

import disp_frag from './mouseDisp_shader'

//prettier-ignore
function dispHandler(canvas, mouseXRef, mouseYRef) {
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
  const image1_URL = 'https://raw.githubusercontent.com/illysito/shaders/2605776610e744beacacb039330bc22b17240e59/imgs/20240802_15533643_4278.jpg'
  // const image2_URL = 'https://raw.githubusercontent.com/illysito/shaders/2605776610e744beacacb039330bc22b17240e59/imgs/20240802_15580031_4289.jpg'
  const displacementURL = 'https://raw.githubusercontent.com/illysito/shaders/3e187d663841f03e89f44a38cfba0061fc61193a/imgs/Perlin%20Noise%20Large.png'

  sandbox.setUniform('u_image_1', image1_URL)
  // sandbox.setUniform('u_image_2', image2_URL)
  sandbox.setUniform('u_displacement', displacementURL)

  function updateUniforms() {
    sandbox.setUniform('u_resolution', [canvas.width, canvas.height])
    // sandbox.setUniform('u_offset', offsetRef.current)
    sandbox.setUniform('u_mouseX', mouseXRef.current)
    sandbox.setUniform('u_mouseY', mouseYRef.current)
  }

  window.addEventListener('resize', function () {
    calcSize()
    updateUniforms()
  })

  return updateUniforms
}

export default dispHandler
