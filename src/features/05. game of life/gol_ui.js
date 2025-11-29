// import gsap from 'gsap'

import golHandler from './gol_handler_ogl'

function golUI(canvas) {
  //prettier-ignore
  const updateUniforms = golHandler(canvas)
  updateUniforms()
}

export default golUI
