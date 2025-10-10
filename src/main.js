import textureUI from './features/01. texture loading/texture_ui'
import oglShader from './features/02. ogl template/ogl_shader'

import './styles/style.css'

console.log('yeka')

const textureCanvas = document.querySelector('#texture-canvas')
const displacementCanvas = document.querySelector('#displacement-canvas')

textureUI(textureCanvas)
oglShader(displacementCanvas)
