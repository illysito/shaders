import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function infoType() {
  // function isMobile() {
  //   return window.innerWidth < 768
  // }

  const heroSection = document.querySelector('.hero__section')
  const heroTypeWrapper = document.querySelector('.menu-type-wrapper')

  // PARALLAX
  gsap.to(heroTypeWrapper, {
    y: -120,
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export default infoType
