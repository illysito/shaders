import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function nav() {
  const nav = document.querySelector('.nav__crystal-wrapper')
  const hero = document.querySelector('.hero__container')

  gsap.to(nav, {
    scrollTrigger: {
      trigger: hero,
      start: 'bottom 95%',
      end: 'bottom 75%',
      scrub: 1,
      markers: false,
    },
    onUpdate: function () {
      let alpha = gsap.utils.mapRange(0, 1, 0, 0.05, this.progress())
      nav.style.backgroundColor = `rgba(255, 251, 246, ${alpha})`
    },
  })
}

export default nav
