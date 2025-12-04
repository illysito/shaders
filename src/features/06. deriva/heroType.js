import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function heroType() {
  function isMobile() {
    return window.innerWidth < 768
  }

  const deriva = document.querySelector('.h1')
  const jazz = document.querySelector('.is--kini')
  const navItems = document.querySelectorAll('.nav-item')
  const socialLinks = document.querySelectorAll('.is--small')
  const stars = document.querySelectorAll('.star-little')
  let marquee
  if (isMobile()) {
    marquee = document.querySelector('.hero-marquee-mobile')
  } else {
    marquee = document.querySelector('.hero-marquee')
  }
  const heroSection = document.querySelector('.hero__section')
  const heroTypeWrapper = document.querySelector('.menu-type-wrapper')

  // variable on mousemove or not (on mobile)
  let counter = 0
  function variableType() {
    counter += 0.008

    const sine = Math.sin(counter)

    const mappedWeight1 = gsap.utils.mapRange(-1, 1, 100, 700, sine)
    const mappedWeight2 = gsap.utils.mapRange(-1, 1, 4, 380, -sine)

    gsap.set(deriva, {
      fontVariationSettings: `'wght' ${mappedWeight1}`,
    })

    gsap.set(jazz, {
      fontVariationSettings: `'wght' ${mappedWeight2}`,
    })

    requestAnimationFrame(variableType)
  }

  if (!isMobile()) {
    window.addEventListener('mousemove', (e) => {
      const x = e.clientX

      let mappedWeight1 = gsap.utils.mapRange(
        0.1 * window.innerWidth,
        window.innerWidth,
        100,
        700,
        x
      )
      let mappedWeight2 = gsap.utils.mapRange(
        0,
        window.innerWidth * 0.9,
        360,
        4,
        x
      )

      gsap.set(deriva, {
        fontVariationSettings: `'wght' ${mappedWeight1}`,
      })

      gsap.set(jazz, {
        fontVariationSettings: `'wght' ${mappedWeight2}`,
      })
    })
  } else {
    variableType()
  }

  // variable on hover
  navItems.forEach((item) => {
    item.addEventListener('mouseover', () => {
      gsap.to(item, {
        // color: '#2020dd',
        fontVariationSettings: `'wght' ${450}`,
        duration: 0.4,
      })
    })
    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        // color: '#202020',
        fontVariationSettings: `'wght' ${200}`,
        duration: 0.4,
      })
    })
  })
  socialLinks.forEach((item) => {
    item.addEventListener('mouseover', () => {
      gsap.to(item, {
        // color: '#2020dd',
        fontVariationSettings: `'wght' ${450}`,
        duration: 0.4,
      })
    })
    item.addEventListener('mouseleave', () => {
      let w = 200
      if (isMobile()) {
        w = 300
      }
      gsap.to(item, {
        // color: '#202020',
        fontVariationSettings: `'wght' ${w}`,
        duration: 0.4,
      })
    })
  })

  // marquee
  const whiteMarquee = marquee.querySelectorAll('.is--white')
  const tween = gsap.to(marquee, {
    xPercent: -50,
    duration: 32,
    repeat: -1,
    ease: 'none',
  })
  if (!isMobile()) {
    marquee.addEventListener('mouseover', () => {
      // tween.timeScale(1.6)
      gsap.to(tween, {
        timeScale: 2,
      })
      if (whiteMarquee) {
        gsap.to(whiteMarquee, {
          opacity: 1,
          duration: 0.2,
          ease: 'none',
        })
      }
      gsap.to(marquee, {
        backgroundColor: '#202020',
        duration: 0.2,
        ease: 'none',
      })
    })
    marquee.addEventListener('mouseleave', () => {
      gsap.to(tween, {
        timeScale: 1,
      })
      if (whiteMarquee) {
        gsap.to(whiteMarquee, {
          opacity: 0,
          duration: 0.2,
          ease: 'none',
        })
      }
      gsap.to(marquee, {
        backgroundColor: '#fffbf600',
        duration: 0.2,
        ease: 'none',
      })
    })
  }

  // STAR ROTATION
  stars.forEach((star, index) => {
    gsap.to(star, {
      rotation: 360,
      duration: 12 - index,
      ease: 'none',
      repeat: -1,
    })
  })

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

export default heroType
