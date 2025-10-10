import gsap from 'gsap'

import filter from '../shaders/filter'

function handleFilter() {
  const sliders = document.querySelectorAll('.axis-filter')
  const handles = document.querySelectorAll('.axis-drag-filter')

  let isDragging = false
  let currentHandle = null
  let currentSlider = null
  let currentIndex = null

  const MAX_RED = 2.0
  const MAX_GREEN = 2.0
  const MAX_BLUE = 2.0
  const MAX_SHIFT = 0.01
  const MAX_NOISE = 0.75

  let red = 1.0
  let green = 1.0
  let blue = 1.0
  let redShift = 0.0
  let greenShift = 0.0
  let blueShift = 0.0
  let noise = 0.0
  const redRef = { current: red }
  const greenRef = { current: green }
  const blueRef = { current: blue }
  const redShiftRef = { current: redShift }
  const greenShiftRef = { current: greenShift }
  const blueShiftRef = { current: blueShift }
  const noiseRef = { current: noise }

  //prettier-ignore
  const updateUniforms = filter(redRef, greenRef, blueRef, noiseRef, redShiftRef, greenShiftRef, blueShiftRef)

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
        red = gsap.utils.mapRange(0, sliderRect.width, 0, MAX_RED, x)
        // console.log('HEY!: ' + red)
        redRef.current = red
        updateUniforms()
      } else if (currentIndex === 1) {
        green = gsap.utils.mapRange(0, sliderRect.width, 0, MAX_GREEN, x)
        greenRef.current = green
        updateUniforms()
      } else if (currentIndex === 2) {
        blue = gsap.utils.mapRange(0, sliderRect.width, 0, MAX_BLUE, x)
        blueRef.current = blue
        updateUniforms()
      } else if (currentIndex === 3) {
        //prettier-ignore
        redShift = gsap.utils.mapRange(0, sliderRect.width, -MAX_SHIFT, MAX_SHIFT, x)
        redShiftRef.current = redShift
        updateUniforms()
      } else if (currentIndex === 4) {
        //prettier-ignore
        greenShift = gsap.utils.mapRange(0, sliderRect.width, -MAX_SHIFT, MAX_SHIFT, x)
        greenShiftRef.current = greenShift
        updateUniforms()
      } else if (currentIndex === 5) {
        //prettier-ignore
        blueShift = gsap.utils.mapRange(0, sliderRect.width, -MAX_SHIFT, MAX_SHIFT, x)
        blueShiftRef.current = blueShift
        updateUniforms()
      } else if (currentIndex === 6) {
        noise = gsap.utils.mapRange(0, sliderRect.width, 0, MAX_NOISE, x)
        noiseRef.current = noise
        updateUniforms()
      }
    }
  })
  // updateUniforms(redRef, greenRef, blueRef)
}

export default handleFilter
