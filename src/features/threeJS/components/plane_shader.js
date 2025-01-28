import gsap from 'gsap'
import html2canvas from 'html2canvas'
import { Vector2 } from 'three'
import { MeshBasicMaterial } from 'three'
import { CanvasTexture, ShaderMaterial, PlaneGeometry, Mesh } from 'three'

async function createPlane() {
  // Step 1: Render HTML to a Canvas
  const heroElement = document.getElementById('hero-container')
  // const canvas = document.getElementById('canvas')
  const renderedCanvas = await html2canvas(heroElement, {
    backgroundColor: '#0e0e0e',
    width: heroElement.offsetWidth, // or any specific width
    height: heroElement.offsetHeight,
  })
  renderedCanvas.style.border = '1px solid #0000ff'
  // document.body.appendChild(renderedCanvas)

  // Step 2: Create a Texture from the Canvas
  const texture = new CanvasTexture(renderedCanvas)
  texture.needsUpdate = true

  const canvasW = renderedCanvas.width
  const canvasH = renderedCanvas.height
  const aspect = canvasW / canvasH
  const planeH = 5
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

  // Step 3: Use the Texture in a Shader
  const fragmentShader = `
    uniform sampler2D u_texture;
    uniform float u_mouseX;
    uniform float u_mouseY;
    uniform float u_time;
    uniform vec2 u_aspect;

    varying vec2 vUv;

    uniform vec2 u_prevMouse;

    void main() {
      
      // COORDINATES

      vec2 coords = vUv;
      vec2 normalized_coords = coords;
      float asp = u_aspect.x / u_aspect.y;
      normalized_coords.x *= asp;

      // MOUSE

      vec2 u_mouse = vec2(u_mouseX, u_mouseY);
      u_mouse.y = 1.0 - u_mouse.y;
      u_mouse.x *= asp;
      vec2 prevMouse = u_prevMouse;
      prevMouse.y = 1.0 - u_prevMouse.y;
      prevMouse.x *= asp;

      float dist = distance(prevMouse, normalized_coords);

      // DISTORTION

      float radius = 0.16 * sin(0.3 * u_time) + 0.05;
      float strength = 0.0;
      // float strength = mix(1.0, 0.0, smoothstep(radius, radius * 1.2, dist));
      // float strength = mix(0.0, 0.1, dist);

      // CONFINADO EN UN CIRCULO : UTIL PARA EFECTO DE ONDAS ESTANQUE
      // if (dist < radius) {
      //   strength = smoothstep(0.0, radius, dist);
      //   strength = smoothstep(0.2, 5.8, strength);
      // }

      // FLOW NORMAL
      strength = smoothstep(0.3, radius, dist);
      strength = smoothstep(0.2, 5.8, strength);

      // DIVIDING IN BLOCKS
      float blocks = 1.0;
      float x = coords.x;
      float y = coords.y;
      // float x = floor(coords.x * asp * blocks) / (asp * blocks);
      // float y = floor(coords.y * blocks) / blocks;

      vec2 distortion = vec2(
        sin(0.5 * prevMouse.x - 2.1 * x + 2.2 * y),
        cos(0.5 * prevMouse.y + 2.1 * x - 2.8 * y)
      ); 

      distortion *= 0.8 * strength;
      distortion = smoothstep(0.0, 0.2, distortion);

      // OUTPUT

      vec4 color = texture2D(u_texture, coords - distortion);
      gl_FragColor = color;
    }
  `

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  // Step 4: Set up the Three.js Material with the Shader
  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  })
  // console.log(material)

  const meshMaterial = new MeshBasicMaterial({ map: texture })
  console.log(meshMaterial)

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

  return mesh
}

export { createPlane }
