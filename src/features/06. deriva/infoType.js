import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function infoType() {
  function isMobile() {
    return window.innerWidth < 768
  }

  const heroSection = document.querySelector('.hero__section')
  const heroTypeWrapper = document.querySelector('.menu-type-wrapper')
  const infoItems = document.querySelectorAll('.info-item')
  const infoPs = document.querySelectorAll('.info-p')
  const footerLinks = document.querySelectorAll('.footer-link')
  const infoHeaders = document.querySelectorAll('.info-header')

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

  // INFO HEADERS
  infoHeaders.forEach((i) => {
    if (i.classList.contains('is--first')) return

    gsap.to(i, {
      yPercent: 100,
      scrollTrigger: {
        trigger: i,
        start: 'top 96%',
        end: 'top 4%',
        scrub: true,
      },
    })
  })

  // INFO ITEMS HOVER
  function displayInfo(index) {
    if (!infoPs[index].classList.contains('is-open')) {
      infoPs[index].classList.add('is-open')
      gsap.to(infoPs[index], {
        opacity: 1,
        height: 'auto',
        marginBottom: 64,
        duration: 0.8,
        ease: 'power2.out',
      })
    } else {
      infoPs[index].classList.remove('is-open')
      gsap.to(infoPs[index], {
        opacity: 0,
        height: 0,
        marginBottom: 0,
        duration: 0.8,
        ease: 'power2.out',
      })
    }
  }

  infoItems.forEach((title, index) => {
    if (!isMobile()) {
      title.addEventListener('mouseover', () => {
        gsap.to(title, {
          fontVariationSettings: `'wght' ${400}`,
          duration: 0.4,
        })
      })
      title.addEventListener('mouseleave', () => {
        gsap.to(title, {
          fontVariationSettings: `'wght' ${200}`,
          duration: 0.4,
        })
      })
    }
    title.addEventListener('click', () => {
      displayInfo(index)
    })
  })

  // FOOTER ITEMS ON HOVER
  if (!isMobile()) {
    footerLinks.forEach((link) => {
      link.addEventListener('mouseover', (e) => {
        const a = e.currentTarget.firstElementChild
        gsap.to(a, {
          fontVariationSettings: `'wght' ${250}`,
          duration: 0.4,
        })
      })
      link.addEventListener('mouseleave', (e) => {
        const a = e.currentTarget.firstElementChild
        gsap.to(a, {
          fontVariationSettings: `'wght' ${800}`,
          duration: 0.4,
        })
      })
    })
  }
}

export default infoType
