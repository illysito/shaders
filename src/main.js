import textureUI from './features/01. texture loading/texture_ui'
import dispUI from './features/02. displacement/disp_ui'
import mouseDispUI from './features/03. mouse-displacement/mouseDisp_ui'
import heroDispUI from './features/04. hero-displacement/heroDisp_ui'
import golUI from './features/05. game of life/gol_ui'
//-----------//
import countdown from './features/06. deriva/countdown'
import heroCanvas from './features/06. deriva/heroCanvas'
import heroType from './features/06. deriva/heroType'
import infoType from './features/06. deriva/infoType'
import program from './features/06. deriva/programType'
import asciiCanvas from './features/07. ascii/asciiCanvas'

import './styles/style.css'

function runShaderFunctions() {
  const textureCanvas = document.querySelector('#texture-canvas')
  const displacementCanvas = document.querySelector('#displacement-canvas')
  const mouseDisplacementCanvas = document.querySelector(
    '#mouse-displacement-canvas'
  )
  const heroDisplacementCanvas = document.querySelector(
    '#hero-displacement-canvas'
  )
  const golCanvas = document.querySelector('#gol-canvas')

  textureUI(textureCanvas)
  dispUI(displacementCanvas)
  mouseDispUI(mouseDisplacementCanvas)
  heroDispUI(heroDisplacementCanvas)
  golUI(golCanvas)
}

function runDerivaFunctions() {
  countdown()
  const canvas = document.querySelector('#webgl')
  if (canvas) {
    heroCanvas()
  }
  heroType()
  infoType()
  program()
}

function runAsciiFunctions() {
  asciiCanvas()
}

if (document.body.classList.contains('shaders__body')) runShaderFunctions()
if (document.body.classList.contains('deriva__body')) runDerivaFunctions()
if (document.body.classList.contains('ascii__body')) runAsciiFunctions()
