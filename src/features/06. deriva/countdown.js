import gsap from 'gsap'

function countdown() {
  const preloader = document.querySelector('.preloader__section')
  const circle = document.querySelector('.circle-overlay')
  const count = document.querySelector('.loading-h')
  const header = document.querySelector('.preloader-h')

  let progress = 0
  let speed = 0.8
  let counter = 0

  function fakePreloader() {
    progress += speed
    if (progress > 100) progress = 100

    count.textContent = `${Math.floor(progress)} %`

    if (progress < 100) {
      requestAnimationFrame(fakePreloader)
    } else {
      gsap.to([count, header], {
        delay: 0.8,
        opacity: 0,
        duration: 0.8,
      })
      gsap.to(circle, {
        delay: 1.0,
        yPercent: -100,
        duration: 1.6,
        ease: 'expo.inOut',
        onComplete: () => {
          gsap.set(preloader, {
            zIndex: -30,
          })
          document.body.classList.remove('no--scroll')
        },
      })
    }
  }

  function variableType() {
    counter += 0.03

    const sine = Math.sin(counter)

    const mappedWeight1 = gsap.utils.mapRange(-1, 1, 100, 500, sine)

    gsap.set(header, {
      fontVariationSettings: `'wght' ${mappedWeight1}`,
    })

    requestAnimationFrame(variableType)
  }

  fakePreloader()
  variableType()
}

export default countdown
