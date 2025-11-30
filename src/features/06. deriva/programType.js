import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function program() {
  const stripes = document.querySelectorAll('.event-stripe-2')
  const stars = document.querySelectorAll('.star-img')

  stripes.forEach((stripe) => {
    // const tl = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: stripe,
    //     start: 'top 100%', // just below viewport
    //     end: 'top 0%', // top reaches top of viewport
    //     scrub: true,
    //   },
    // })

    // tl.fromTo(stripe, { opacity: 0 }, { opacity: 1 })
    gsap.fromTo(
      stripe,
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: stripe,
          start: 'top 90%',
          end: 'top 50%',
          scrub: true,
        },
      }
    )

    // Fade OUT (leaving above)
    gsap.fromTo(
      stripe,
      { opacity: 1 },
      {
        opacity: 0,
        scrollTrigger: {
          trigger: stripe,
          start: 'top 30%',
          end: 'top 0%',
          scrub: true,
        },
      }
    )
  })

  gsap.to(stars, {
    rotation: 360,
    duration: 12,
    ease: 'none',
    repeat: -1,
  })
}

export default program
