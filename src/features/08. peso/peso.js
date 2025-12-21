import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function peso() {
  console.log('peso')

  const type = document.querySelectorAll('.peso-h')

  const MAX_WGHT = 800
  const MIN_WGHT = 200
  const MIN_FACTOR = 1.4
  const MAX_FACTOR = 0.6

  // variable on PC
  let targetX = 0
  // let targetY = 0
  let currentX = 0
  // let currentY = 0
  const lerp = (a, b, t) => a + (b - a) * t
  function animateWeight() {
    currentX = lerp(currentX, targetX, 0.081)
    // currentY = lerp(currentY, targetY, 0.081)

    let mappedXLeft = gsap.utils.mapRange(
      0,
      window.innerWidth,
      MAX_WGHT,
      MIN_WGHT,
      currentX
    )
    let mappedXRight = gsap.utils.mapRange(
      0,
      window.innerWidth,
      MIN_WGHT,
      MAX_WGHT,
      currentX
    )
    let mappedXCenterLeft = gsap.utils.mapRange(
      0,
      window.innerWidth,
      MAX_WGHT * MAX_FACTOR,
      MIN_WGHT * MIN_FACTOR,
      currentX
    )
    let mappedXCenterRight = gsap.utils.mapRange(
      0,
      window.innerWidth,
      MIN_WGHT * MIN_FACTOR,
      MAX_WGHT * MAX_FACTOR,
      currentX
    )

    gsap.set(type[0], {
      fontVariationSettings: `'wght' ${mappedXLeft}`,
    })
    gsap.set(type[1], {
      fontVariationSettings: `'wght' ${mappedXCenterLeft}`,
    })
    gsap.set(type[2], {
      fontVariationSettings: `'wght' ${mappedXCenterRight}`,
    })
    gsap.set(type[3], {
      fontVariationSettings: `'wght' ${mappedXRight}`,
    })

    requestAnimationFrame(animateWeight)
  }
  animateWeight()

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX
    // targetY = e.clientY
  })
}

export default peso
