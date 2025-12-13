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
  const downloadLinkWrapper = document.querySelector('.download-link')
  const downloadLink = document.querySelector('.download-item')
  const downloadImg = document.querySelector('.download-img')

  function isMobile() {
    return window.innerWidth < 768
  }

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
  if (!isMobile()) {
    titles.forEach((title, index) => {
      title.addEventListener('mouseover', () => {
        // if (!isScrolling) {
        gsap.to(title, {
          fontVariationSettings: `'wght' ${400}`,
          duration: 0.6,
        })
        gsap.to(imgWrapper, {
          opacity: 1,
          duration: 0.1,
        })
        gsap.to(imgHover[index], {
          zIndex: 1,
          duration: 0.1,
        })
        // }
      })
      title.addEventListener('mouseleave', () => {
        gsap.to(title, {
          fontVariationSettings: `'wght' ${250}`,
          duration: 0.6,
        })
        gsap.to(imgWrapper, {
          opacity: 0,
          duration: 0.1,
          onComplete: () => {
            gsap.to(imgHover[index], {
              zIndex: 0,
              duration: 0.1,
            })
          },
        })
      })
    })
  }

  // DOWNLOAD BUTTON
  gsap.to(downloadImg, {
    yPercent: -48,
    scale: 1.15,
    duration: 4,
    yoyo: true,
    repeat: -1,
    ease: 'power2.inOut',
  })
  if (!isMobile()) {
    downloadLinkWrapper.addEventListener('mouseover', () => {
      gsap.to(downloadLinkWrapper, {
        scale: 0.97,
        duration: 0.2,
        ease: 'none',
      })
      gsap.to(downloadLink, {
        fontVariationSettings: `'wght' ${300}`,
        color: '#fffbf6',
        duration: 0.4,
      })
      gsap.to(downloadImg, {
        // yPercent: -24,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      })
    })
    downloadLinkWrapper.addEventListener('mouseleave', () => {
      gsap.to(downloadLinkWrapper, {
        scale: 1,
        duration: 0.2,
        ease: 'none',
      })
      gsap.to(downloadLink, {
        fontVariationSettings: `'wght' ${250}`,
        color: '#202020',
        duration: 0.4,
      })
      gsap.to(downloadImg, {
        // yPercent: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
      })
    })
  }

  // MOUSETRACKED IMG
  let mouseClientX = 0
  let mouseClientY = 0
  let mouseX = 0
  let mouseY = 0
  const width = imgWrapper.clientWidth
  const height = imgWrapper.clientHeight
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight

  function updateMouse() {
    mouseX = mouseClientX
    mouseY = mouseClientY + window.scrollY

    if (mouseX > window.innerWidth - width) {
      mouseX = window.innerWidth - width
    }
    if (mouseY > maxScroll - height) {
      mouseY = window.innerWidth - height
    }
  }

  if (!isMobile()) {
    window.addEventListener('mousemove', (e) => {
      mouseClientX = e.clientX
      mouseClientY = e.clientY
      updateMouse()
    })

    window.addEventListener('scroll', () => {
      updateMouse()
    })
  }

  function animate() {
    imgWrapper.style.transform = `translate(${mouseX - width / 2}px, ${
      mouseY - height / 2
    }px)`
    gsap.to(imgHover, {
      x: 0.25 * (mouseX - window.innerWidth / 2),
      duration: 0.4,
    })

    requestAnimationFrame(animate)
  }
  if (!isMobile()) {
    animate()
  }
}

export default program
