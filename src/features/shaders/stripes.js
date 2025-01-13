import GlslCanvas from 'glslCanvas'

import stripes_frag from './stripes_frag'

function stripes(zoomRef, grainRef, oscRef, hueRef) {
  const canvas = document.querySelector('#stripe_canvas')
  // console.log('zoom Object: ' + zoomRef.current)

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
    let ww = canvas.clientWidth
    let wh = canvas.clientHeight
    let dpi = window.devicePixelRatio

    canvas.width = ww * dpi
    canvas.height = wh * dpi
  }

  calcSize()

  const sandbox = new GlslCanvas(canvas)

  const fragment_shader = stripes_frag
  sandbox.load(fragment_shader)
  sandbox.setUniform('u_resolution', [canvas.width, canvas.height])
  sandbox.setUniform('u_zoom', zoomRef.current)
  sandbox.setUniform('u_grain', grainRef.current)
  sandbox.setUniform('u_osc', oscRef.current)
  sandbox.setUniform('u_hue', hueRef.current)

  function updateUniforms() {
    console.log('updating u_zoom:', zoomRef.current)
    console.log('updating u_grain:', grainRef.current)
    sandbox.setUniform('u_zoom', zoomRef.current)
    sandbox.setUniform('u_grain', grainRef.current)
    sandbox.setUniform('u_osc', oscRef.current)
    sandbox.setUniform('u_hue', hueRef.current)
    // sandbox.render() //Force re-render to reflect changes
  }

  window.addEventListener('resize', function () {
    calcSize()
  })

  return updateUniforms
}

export default stripes
