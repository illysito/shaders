import gsap from 'gsap'

function heroType() {
  const deriva = document.querySelector('.h1')
  const jazz = document.querySelector('.is--kini')
  console.log(deriva, jazz)

  window.addEventListener('mousemove', (e) => {
    const x = e.clientX

    let mappedWeight1 = gsap.utils.mapRange(0, window.innerWidth, 100, 700, x)
    let mappedWeight2 = gsap.utils.mapRange(0, window.innerWidth, 360, 4, x)

    console.log(mappedWeight1)

    gsap.set(deriva, {
      fontVariationSettings: `'wght' ${mappedWeight1}`,
    })

    gsap.set(jazz, {
      fontVariationSettings: `'wght' ${mappedWeight2}`,
    })
  })
}

export default heroType
