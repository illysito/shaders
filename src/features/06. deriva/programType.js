import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function program() {
  const stripes = document.querySelectorAll('.event-stripe-2')
  const dates = document.querySelectorAll('.date-h')
  const stars = document.querySelectorAll('.star-img')

  function fadeInOut(el) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'top -8%',
          scrub: true,
          // markers: true
        },
      })
      .to(el, { opacity: 1, duration: 2 }) // fade in
      .to(el, { opacity: 1, duration: 3 })
      .to(el, { opacity: 0, duration: 1 }) // fade out
  }

  stripes.forEach(fadeInOut)
  dates.forEach(fadeInOut)
  stars.forEach(fadeInOut)

  // STAR ROTATION
  gsap.to(stars, {
    rotation: 360,
    duration: 12,
    ease: 'none',
    repeat: -1,
  })
}

export default program
