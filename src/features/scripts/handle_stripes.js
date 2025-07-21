import gsap from 'gsap'

import stripes from '../shaders/stripes'

function handleStripes() {
  const sliders = document.querySelectorAll('.axis-fbm')
  const handles = document.querySelectorAll('.axis-drag-fbm')

  let isDragging = false
  let currentHandle = null
  let currentSlider = null
  let currentIndex = null

  const MAX_ZOOM = 85.0
  const MAX_GRAIN = 0.1
  const MAX_OSC = 10.0

  let zoom = 5.0
  let grain = 0.025
  let osc = 2.0
  const zoomRef = { current: zoom }
  console.log(zoomRef.current)
  const grainRef = { current: grain }
  const oscRef = { current: osc }

  const updateUniforms = stripes(zoomRef, grainRef, oscRef)

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

      console.log(isDragging, currentHandle, currentIndex, currentSlider)
    })
  })

  // Vuelvo al estado inicial cuando levanto el mouse
  document.addEventListener('mouseup', () => {
    isDragging = false
    currentHandle = null
    currentSlider = null
    currentIndex = null
    // console.log(isDragging)
  })

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

      if (currentIndex === 0) {
        zoom = gsap.utils.mapRange(0, sliderRect.width, 0, MAX_ZOOM, x)
        console.log('HEY!: ' + zoom)
        zoomRef.current = zoom
        updateUniforms()
      } else if (currentIndex === 1) {
        grain = gsap.utils.mapRange(0, sliderRect.width, 0, MAX_GRAIN, x)
        console.log('HEY!: ' + grain)
        grainRef.current = grain
        updateUniforms()
      } else if (currentIndex === 2) {
        osc = gsap.utils.mapRange(0, sliderRect.width, 0, MAX_OSC, x)
        console.log('HEY!: ' + osc)
        oscRef.current = osc
        updateUniforms()
      }
    }
  })

  console.log(oscRef.current)
  updateUniforms(zoomRef, grainRef, oscRef)
}

export default handleStripes
