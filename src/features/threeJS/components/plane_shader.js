import gsap from 'gsap'
import html2canvas from 'html2canvas'
import { Vector2 } from 'three'
// import { MeshBasicMaterial } from 'three'
import { CanvasTexture, ShaderMaterial, PlaneGeometry, Mesh } from 'three'

//prettier-ignore
import { warp_type_frag, warp_type_vertex } from '../../shaders/warp_type_shader.js'

async function createPlane() {
  // Step 1: Render HTML to a Canvas
  const heroElement = document.getElementById('hero-container')
  const renderedCanvas = await html2canvas(heroElement, {
    backgroundColor: '#0e0e0e',
    width: heroElement.offsetWidth,
    height: heroElement.offsetHeight,
  })
  const texture = new CanvasTexture(renderedCanvas)
  texture.needsUpdate = true

  const canvasW = renderedCanvas.width
  const canvasH = renderedCanvas.height
  const aspect = canvasW / canvasH
  const planeH = 6
  const planeW = planeH * aspect

  let prevMouse = new Vector2(0.0, 0.0)

  const uniforms = {
    u_time: { value: 0.0 },
    u_mouseX: { value: 0.0 },
    u_mouseY: { value: 0.0 },
    u_prevMouse: { value: prevMouse },
    u_texture: { value: texture },
    u_aspect: { value: [canvasW, canvasH] },
  }

  const fragmentShader = warp_type_frag

  const vertexShader = warp_type_vertex

  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  })

  // const meshMaterial = new MeshBasicMaterial({ map: texture })
  // console.log(meshMaterial)

  // Step 5: Create a Plane to Display the Shader
  const geometry = new PlaneGeometry(planeW, planeH)
  const mesh = new Mesh(geometry, material)

  mesh.tick = (delta) => {
    uniforms.u_time.value += 0.5 * delta
    // console.log('ticking' + uniforms.u_time)
  }

  window.addEventListener('mousemove', (event) => {
    //prettier-ignore
    const mouseX = gsap.utils.mapRange(0, window.innerWidth, 0.0, 1.0, event.clientX)
    //prettier-ignore
    const mouseY = gsap.utils.mapRange(0, window.innerHeight, 0.0, 1.0, event.clientY)

    const inertiaFactor = 0.99
    //prettier-ignore
    const inertiaMouseX = gsap.utils.interpolate(prevMouse.x, mouseX, inertiaFactor)
    //prettier-ignore
    const inertiaMouseY = gsap.utils.interpolate(prevMouse.y, mouseY, inertiaFactor)

    uniforms.u_mouseX.value = mouseX
    uniforms.u_mouseY.value = mouseY

    uniforms.u_prevMouse.value.set(inertiaMouseX, inertiaMouseY)

    prevMouse.set(mouseX, mouseY)
  })

  // async function updateTexture() {
  //   const updatedCanvas = await html2canvas(heroElement, {
  //     backgroundColor: '#0e0e0e',
  //     width: heroElement.offsetWidth, // or any specific width
  //     height: heroElement.offsetHeight,
  //   })
  //   texture.image = updatedCanvas
  //   texture.needsUpdate = true
  //   requestAnimationFrame(updateTexture)
  // }

  // updateTexture()

  return mesh
}

export { createPlane }
