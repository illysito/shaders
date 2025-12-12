import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function program() {
  const stripes = document.querySelectorAll('.event-stripe-2')
  const dates = document.querySelectorAll('.date-h')
  const stars = document.querySelectorAll('.star-img')
  const titles = document.querySelectorAll('.event-title-2')
  const imgWrapper = document.querySelector('.hover-img-wrapper')
  const imgHover = document.querySelectorAll('.img-hover')

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

  // HOVER ON TITLES
  titles.forEach((title, index) => {
    title.addEventListener('mouseover', () => {
      gsap.to(title, {
        fontVariationSettings: `'wght' ${400}`,
        duration: 0.6,
      })
      gsap.to(imgWrapper, {
        opacity: 1,
        duration: 0.1,
      })
      gsap.to(imgHover, {
        opacity: 0,
        duration: 0.1,
      })
      gsap.to(imgHover[index], {
        opacity: 1,
        duration: 0.1,
      })
    })
    title.addEventListener('mouseleave', () => {
      gsap.to(title, {
        fontVariationSettings: `'wght' ${250}`,
        duration: 0.6,
      })
      gsap.to(imgWrapper, {
        opacity: 0,
        duration: 0.1,
      })
    })
  })

  // MOUSETRACKED IMG
  let mouseX = 0
  let mouseY = 0
  let currentX = 0
  let lerpFactor = 0.9
  const width = imgWrapper.clientWidth
  const height = imgWrapper.clientHeight

  function lerp(start, end, amount) {
    return start + (end - start) * amount
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY + window.scrollY

    if (mouseX > window.innerWidth - width) {
      mouseX = window.innerWidth - width
    }
  })

  function animate() {
    currentX = lerp(currentX, mouseX, lerpFactor)
    imgWrapper.style.transform = `translate(${mouseX - width / 2}px, ${
      mouseY - height / 2
    }px)`
    gsap.to(imgHover, {
      x: 0.25 * (mouseX - window.innerWidth / 2),
      duration: 0.4,
    })

    requestAnimationFrame(animate)
  }
  animate()
}

export default program
