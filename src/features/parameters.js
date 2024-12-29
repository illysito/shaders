import { gsap } from 'gsap'

gsap.registerPlugin(ScrollTrigger)

import './styles/style.css'

// OBJETO FUENTE
function Font(name, axes, axes_bounds, indexes) {
  this.name = name
  this.axes = axes
  this.axes_bounds = axes_bounds
  this.indexes = indexes

  this.getName = function () {
    return this.name
  }
  this.getAxes = function () {
    return this.axes
  }
  this.getAxesBounds = function () {
    return this.axes_bounds
  }
}

// VARIABLES GLOBALES
let t = 0

let VARIATION_1 = 0
let VARIATION_2 = 0
let VARIATION_3 = 0
const sliders = document.querySelectorAll('.axis')
const handles = document.querySelectorAll('.axis-drag')

console.log(sliders)
console.log(handles)
//
let isDragging = false
let currentHandle = null
let currentSlider = null
let currentIndex = null // el INDEX de los SLIDERS dentro del NodeList
let currentFont = null // la fuente ACTUAL
let previousFont = null // fuente ANTERIOR, necesaria para inicializar los EJES con cada cambio de fuente
let currentAxes = null // el array de EJES de la fuente ACTUAL
let currentAxisIndex = null // el indice ACTUAL dentro del array de EJES de la fuente ACTUAL
let currentAxis = null // el EJE ACTUAL
let currentName = null // el NOMBRE de la fuente
let previousName = null
//
// Recorro el arraw sliders y asocio el indice de cada uno con los del array handles
sliders.forEach((slider, i) => {
  const handle = handles[i]

  // cuando pincho en un handle, ya asociado a su slider, activo isDragging y meto en currentHandle y currentSlider los elementos q son
  handle.addEventListener('mousedown', (e) => {
    // console.log('mousedown')
    console.log(e)
    isDragging = true
    currentHandle = handle
    currentSlider = slider
    currentIndex = i
    fonts.forEach((font) => {
      font.indexes.forEach((index, j) => {
        if (index === currentIndex) {
          currentFont = font
          currentAxisIndex = j
          currentName = currentFont.getName()
          currentAxes = currentFont.getAxes()
          currentAxis = currentAxes[j]
          if (currentName !== previousName) {
            console.log('Font Change!')
            setVariations()
          }
          previousFont = currentFont
          previousName = previousFont.getName()
          console.log('currentFont: ' + currentFont)
          console.log('previousFont: ' + previousFont)
          console.log('currentName: ' + currentName)
          console.log('previousName: ' + previousName)
          console.log('currentAxes: ' + currentAxes)
          console.log('currentAxisIndex: ' + currentAxisIndex)
          console.log('currentAxis: ' + currentAxis)
          console.log('currentIndex: ' + currentIndex)
        }
      })
    })
  })
})

// Vuelvo al estado inicial cuando levanto el mouse
document.addEventListener('mouseup', () => {
  isDragging = false
  currentHandle = null
  currentSlider = null
  currentIndex = null
  currentFont = null
  currentAxes = null
  currentAxisIndex = null
  currentAxis = null
  currentName = null
  // console.log(isDragging)
})

// VALOR INICIAL DE CADA AXIS EN EL MINIMO para que mover uno no sobreescriba al otro
function setVariations() {
  if (currentFont) {
    VARIATION_1 = currentFont.axes_bounds[0][0]
    if (currentFont.axes_bounds[1] && !currentFont.axes_bounds[2]) {
      console.log('minimochi FALSO')
      VARIATION_2 = currentFont.axes_bounds[1][0]
    } else if (currentFont.axes_bounds[2]) {
      console.log('minimochi!')
      VARIATION_2 = currentFont.axes_bounds[1][0]
      VARIATION_3 = currentFont.axes_bounds[2][0]
    }
  }
}

// FUNCION PRINCIPAL
document.addEventListener('mousemove', (e) => {
  // si estoy pulsando y existe el slider y el handler:
  if (isDragging && currentHandle && currentSlider) {
    // obtengo el rectangulo del slider
    let sliderRect = currentSlider.getBoundingClientRect()
    let handleRect = currentHandle.getBoundingClientRect()
    // determino la x inicial (0) como la posición de mi ratón menos el borde del rectángulo
    let x = e.clientX - sliderRect.left
    x = Math.max(0, Math.min(x, sliderRect.width - handleRect.width))
    currentHandle.style.left = x + 'px'
    // YA TENGO LA POSICIÖN DEL ROLLO ARRIBA. AHORA TENGO QUE IDENTIFICAR QUE SLIDER ES; COLOCAR BIEN EL MAPA Y HACERLE GSAP AL QUE CORRESPONDA
    // WGHT = Math.floor(gsap.utils.mapRange(0, sliderRect.width, 0, 500, x))
    if (currentAxisIndex === 0) {
      VARIATION_1 = Math.floor(
        gsap.utils.mapRange(
          0,
          sliderRect.width,
          currentFont.axes_bounds[currentAxisIndex][0],
          currentFont.axes_bounds[currentAxisIndex][1],
          x
        )
      )
      console.log('VARIATION 1: ' + VARIATION_1)
      console.log('VARIATION 2: ' + VARIATION_2)
      console.log('VARIATION 3: ' + VARIATION_3)
    } else if (currentAxisIndex === 1) {
      VARIATION_2 = Math.floor(
        gsap.utils.mapRange(
          0,
          sliderRect.width,
          currentFont.axes_bounds[currentAxisIndex][0],
          currentFont.axes_bounds[currentAxisIndex][1],
          x
        )
      )
      console.log('VARIATION 1: ' + VARIATION_1)
      console.log('VARIATION 2: ' + VARIATION_2)
      console.log('VARIATION 3: ' + VARIATION_3)
    } else if (currentAxisIndex === 2) {
      VARIATION_3 = Math.floor(
        gsap.utils.mapRange(
          0,
          sliderRect.width,
          currentFont.axes_bounds[currentAxisIndex][0],
          currentFont.axes_bounds[currentAxisIndex][1],
          x
        )
      )
      console.log('VARIATION 1: ' + VARIATION_1)
      console.log('VARIATION 2: ' + VARIATION_2)
      console.log('VARIATION 3: ' + VARIATION_3)
    } else {
      console.log('ERROR')
    }

    if (currentAxes.length == 1) {
      console.log(`${currentAxes[0]} ${VARIATION_1}`)
      gsap.to(currentName, {
        fontVariationSettings: `'${currentAxes[0]}' ${VARIATION_1}`,
        duration: 0,
      })
    } else if (currentAxes.length == 2) {
      gsap.to(currentName, {
        fontVariationSettings: `'${currentAxes[0]}' ${VARIATION_1}, '${currentAxes[1]}' ${VARIATION_2}`,
        duration: 0,
      })
    } else if (currentAxes.length == 3) {
      gsap.to(currentName, {
        fontVariationSettings: `'${currentAxes[0]}' ${VARIATION_1}, '${currentAxes[1]}' ${VARIATION_2}, '${currentAxes[2]}' ${VARIATION_3}`,
        duration: 0,
      })
    } else {
      console.log('FONT CONTROLS OUT OF BOUND')
    }
  }
})
