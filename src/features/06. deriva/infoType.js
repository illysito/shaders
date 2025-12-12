import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function infoType() {
  // function isMobile() {
  //   return window.innerWidth < 768
  // }

  const heroSection = document.querySelector('.hero__section')
  const heroTypeWrapper = document.querySelector('.menu-type-wrapper')
  const infoItems = document.querySelectorAll('.info-item')
  const infoPs = document.querySelectorAll('.info-p')
  const footerLinks = document.querySelectorAll('.footer-link')

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

  // INFO ITEMS HOVER
  infoItems.forEach((title, index) => {
    title.addEventListener('mouseover', () => {
      gsap.to(infoItems, {
        fontVariationSettings: `'wght' ${200}`,
        duration: 0.4,
      })
      infoPs.forEach((p) => {
        gsap.to(p, {
          opacity: 0,
          duration: 0.1,
        })
      })
      gsap.to(infoItems[index], {
        fontVariationSettings: `'wght' ${400}`,
        duration: 0.4,
      })
      gsap.to(infoPs[index], {
        opacity: 1,
        duration: 0.1,
      })
    })
    title.addEventListener('mouseleave', () => {
      gsap.to(title, {
        fontVariationSettings: `'wght' ${200}`,
        duration: 0.4,
      })
      gsap.to(infoItems[index], {
        fontVariationSettings: `'wght' ${400}`,
        duration: 0.4,
      })
    })
  })

  // FOOTER ITEMS ON HOVER
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

export default infoType
