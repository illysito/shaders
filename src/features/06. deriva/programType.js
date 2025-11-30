import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function program() {
  const stripes = document.querySelectorAll('.event-stripe-2')
  const dates = document.querySelectorAll('.date-h')
  const stars = document.querySelectorAll('.star-img')

  stripes.forEach((stripe) => {
    gsap.to(stripe, {
      opacity: 1,
      scrollTrigger: {
        trigger: stripe,
        start: 'top 90%',
        end: 'top 60%',
        scrub: true,
        // markers: true,
      },
      onComplete: () => {
        // Fade OUT (leaving above)
        gsap.fromTo(
          stripe,
          { opacity: 1 },
          {
            opacity: 0,
            scrollTrigger: {
              trigger: stripe,
              start: 'top 8%',
              end: 'top -8%',
              scrub: true,
            },
          }
        )
      },
    })
  })
  dates.forEach((date) => {
    gsap.to(date, {
      opacity: 1,
      scrollTrigger: {
        trigger: date,
        start: 'top 90%&',
        end: 'top 60%',
        scrub: true,
        // markers: true,
      },
      onComplete: () => {
        // Fade OUT (leaving above)
        gsap.fromTo(
          date,
          { opacity: 1 },
          {
            opacity: 0,
            scrollTrigger: {
              trigger: date,
              start: 'top 8%',
              end: 'top-8%',
              scrub: true,
            },
          }
        )
      },
    })
  })
  stars.forEach((star) => {
    gsap.to(star, {
      opacity: 1,
      scrollTrigger: {
        trigger: star,
        start: 'top 90%',
        end: 'top 60%',
        scrub: true,
        // markers: true,
      },
      onComplete: () => {
        // Fade OUT (leaving above)
        gsap.fromTo(
          star,
          { opacity: 1 },
          {
            opacity: 0,
            scrollTrigger: {
              trigger: star,
              start: 'top 8%',
              end: 'top -8%',
              scrub: true,
            },
          }
        )
      },
    })
  })

  gsap.to(stars, {
    rotation: 360,
    duration: 12,
    ease: 'none',
    repeat: -1,
  })
}

export default program
