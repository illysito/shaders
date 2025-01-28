import gsap from 'gsap'
import html2canvas from 'html2canvas'
import { MeshBasicMaterial } from 'three'
import { CanvasTexture, ShaderMaterial, PlaneGeometry, Mesh } from 'three'

async function createPlane() {
  // Step 1: Render HTML to a Canvas
  const heroElement = document.getElementById('hero-container')
  // const canvas = document.getElementById('canvas')
  const renderedCanvas = await html2canvas(heroElement, {
    backgroundColor: '#fffbf6',
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

  const uniforms = {
    u_time: { value: 0.0 },
    u_mouseX: { value: 0.0 },
    u_mouseY: { value: 0.0 },
    u_texture: { value: texture },
    u_aspect: { value: aspect },
  }

  // Step 3: Use the Texture in a Shader
  const fragmentShader = `
    uniform sampler2D u_texture;
    uniform float u_mouseX;
    uniform float u_mouseY;
    uniform float u_time;
    uniform float u_aspect;

    varying vec2 vUv;

    void main() {
      vec2 coords = vUv;
      // coords = mix(vec2(0.1, 0.1), vec2(0.9, 0.9), coords);
      vec2 u_mouse = vec2(u_mouseX, u_mouseY);
      float dist = distance(u_mouse, coords);
      float strength = 0.1;
      strength = smoothstep(1.0, 0.0, dist);
      strength = smoothstep(0.2, 2.8, strength);

      float blocks = 40.0;
      float x = floor(coords.x * u_aspect * blocks) / (u_aspect * blocks);
      float y = floor(coords.y * blocks) / blocks;

      vec2 distortion = vec2(
        sin(2.0 * u_time + 0.6 * u_mouse.x - 2.1 * x + 2.2 * y),
        cos(u_time + 0.6 * u_mouse.y + 2.1 * x - 2.8 * y)
      ); 

      distortion *= 1.0 * strength;

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
    const mouseY = gsap.utils.mapRange(0, window.innerWidth, 0.0, 1.0, event.clientY)
    uniforms.u_mouseX.value = mouseX
    uniforms.u_mouseY.value = mouseY
  })

  return mesh
}

export { createPlane }
