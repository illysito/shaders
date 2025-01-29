import { gsap } from 'gsap'

function variableType(counter) {
  const hero = document.querySelector('.hero__heading')
  const MIN_WEIGHT = 500
  const MAX_WEIGHT = 700
  const AMPLITUDE = 1

  let sine = Math.sin(0.001 * counter)
  //prettier-ignore
  let fontVariation = gsap.utils.mapRange(-AMPLITUDE, AMPLITUDE, MIN_WEIGHT, MAX_WEIGHT, sine)

  hero.style.fontVariationSettings = `'wght' ${fontVariation}`
}

export default variableType
