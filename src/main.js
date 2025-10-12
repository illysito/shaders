import textureUI from './features/01. texture loading/texture_ui'
import dispUI from './features/02. displacement/disp_ui'
import mouseDispUI from './features/03. mouse-displacement/mouseDisp_ui'
import heroDispUI from './features/04. hero-displacement/heroDisp_ui'

import './styles/style.css'

console.log('yeka')

const textureCanvas = document.querySelector('#texture-canvas')
const displacementCanvas = document.querySelector('#displacement-canvas')
const mouseDisplacementCanvas = document.querySelector(
  '#mouse-displacement-canvas'
)
const heroDisplacementCanvas = document.querySelector(
  '#hero-displacement-canvas'
)

textureUI(textureCanvas)
dispUI(displacementCanvas)
mouseDispUI(mouseDisplacementCanvas)
heroDispUI(heroDisplacementCanvas)
