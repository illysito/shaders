import gsap from 'gsap'

function program() {
  const stripes = document.querySelectorAll('.event-stripe')

  stripes.forEach((stripe) => {
    const eventTitleWrapper = stripe.firstElementChild
    const eventTitlesSwitzer =
      eventTitleWrapper.querySelectorAll('.event-title')
    const eventTitlesKini =
      eventTitleWrapper.querySelectorAll('.event-title-kini')
    const eventInfo = eventTitleWrapper.nextElementSibling

    stripe.addEventListener('mouseover', () => {
      gsap.to(stripe, {
        backgroundColor: '#202020',
        duration: 0.2,
        ease: 'power2.inOut',
      })
      gsap.to([eventTitlesSwitzer, eventTitlesKini], {
        color: '#fffbf6',
        duration: 0.2,
      })
      gsap.to(eventTitlesSwitzer, {
        x: 12,
        fontVariationSettings: `'wght' ${700}`,
        duration: 0.4,
        ease: 'power2.inOut',
      })
      gsap.to(eventTitlesKini, {
        x: 12,
        fontVariationSettings: `'wght' ${40}`,
        duration: 0.4,
        ease: 'power2.inOut',
      })
      gsap.to(eventInfo, {
        x: -12,
        color: '#fffbf6',
        duration: 0.4,
        ease: 'power2.inOut',
      })
    })

    stripe.addEventListener('mouseleave', () => {
      gsap.to(stripe, {
        backgroundColor: '#20202000',
        duration: 0.2,
        ease: 'power2.inOut',
      })
      gsap.to([eventTitlesSwitzer, eventTitlesKini], {
        color: '#202020',
        duration: 0.2,
      })
      gsap.to(eventTitlesSwitzer, {
        x: 0,
        fontVariationSettings: `'wght' ${200}`,
        duration: 0.4,
        ease: 'power2.inOut',
      })
      gsap.to(eventTitlesKini, {
        x: 0,
        fontVariationSettings: `'wght' ${240}`,
        duration: 0.4,
        ease: 'power2.inOut',
      })
      gsap.to(eventInfo, {
        x: 0,
        color: '#202020',
        duration: 0.4,
        ease: 'power2.inOut',
      })
    })
  })
}

export default program
