import textureUI from './features/01. texture loading/texture_ui'
import dispUI from './features/02. displacement/disp_ui'
import mouseDispUI from './features/03. mouse-displacement/mouseDisp_ui'

import './styles/style.css'

console.log('yeka')

const textureCanvas = document.querySelector('#texture-canvas')
const displacementCanvas = document.querySelector('#displacement-canvas')
const mouseDisplacementCanvas = document.querySelector(
  '#mouse-displacement-canvas'
)

textureUI(textureCanvas)
dispUI(displacementCanvas)
mouseDispUI(mouseDisplacementCanvas)
