import gsap from 'gsap'
import { SphereGeometry, Mesh, ShaderMaterial } from 'three'

import { cube_frag, cube_vertex } from '../../shaders/cube_shader.js'

function createCube() {
  // GEOMETRY
  const geometry = new SphereGeometry(1, 640, 640)
  // MATERIAL
  const uniforms = {
    u_time: { value: 0.0 },
    u_mouseX: { value: 0.0 },
    u_mouseY: { value: 0.0 },
  }
  const fragmentShader = cube_frag
  const vertexShader = cube_vertex
  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: true,
  })
  // material.needsUpdate = true
  // MESH
  const cube = new Mesh(geometry, material)
  // LOOP
  cube.tick = (delta) => {
    uniforms.u_time.value += 0.5 * delta
    // uniforms.u_mouseX.value = mouseX
    // uniforms.u_mouseY.value = mouseY
    // console.log('ticking' + uniforms.u_time)
  }
  // EVENTS

  window.addEventListener('mousemove', (event) => {
    //prettier-ignore
    const mouseX = gsap.utils.mapRange(0, window.innerWidth, 0.0, 1.0, event.clientX)
    //prettier-ignore
    const mouseY = gsap.utils.mapRange(0, window.innerHeight, 0.0, 1.0, event.clientY)

    uniforms.u_mouseX.value = mouseX
    uniforms.u_mouseY.value = mouseY
    // console.log('mouseX: ' + mouseX + ' mouseY: ' + mouseY)
  })
  // OUTPUT
  return cube
}

export { createCube }
