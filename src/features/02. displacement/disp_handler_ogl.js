// disp_handler_ogl.js
import { Renderer, Geometry, Program, Mesh, Texture, Vec2 } from 'ogl'

import disp_frag from './disp_shader' // your SAME fragment shader string

function dispHandler(canvas, offsetRef) {
  const shaderReference = 'DISPLACEMENT SHADER (OGL): '

  if (!canvas) {
    console.error(shaderReference + 'Canvas element not found!')
    return () => {}
  }

  // --- OGL SETUP ---
  const renderer = new Renderer({
    canvas,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
  })
  const gl = renderer.gl

  if (!gl) {
    console.error(shaderReference + 'WebGL not supported!')
    return () => {}
  } else {
    console.log(shaderReference + 'WebGL is working!')
  }

  // --- SIZE / DPR ---
  function setSize() {
    const w = canvas.parentNode.clientWidth
    const h = canvas.parentNode.clientHeight
    renderer.setSize(w, h)
  }

  window.addEventListener('resize', () => {
    setSize()
    updateUniforms()
  })

  // --- FULLSCREEN TRIANGLE (cheapest)
  const geometry = new Geometry(gl, {
    position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
    uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
  })

  // --- TEXTURES ---
  const image1_URL =
    'https://raw.githubusercontent.com/illysito/shaders/2605776610e744beacacb039330bc22b17240e59/imgs/20240802_15533643_4278.jpg'
  const image2_URL =
    'https://raw.githubusercontent.com/illysito/shaders/2605776610e744beacacb039330bc22b17240e59/imgs/20240802_15580031_4289.jpg'
  const displacementURL =
    'https://raw.githubusercontent.com/illysito/shaders/3e187d663841f03e89f44a38cfba0061fc61193a/imgs/Perlin%20Noise%20Large.png'

  // TYPICAL WAY TO LOAD TEXTURES IN OGL
  function loadTexture(url) {
    const tex = new Texture(gl, {
      generateMipmaps: false,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      minFilter: gl.LINEAR,
      magFilter: gl.LINEAR,
      flipY: true,
    })
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => (tex.image = img)
    img.src = url
    return tex
  }

  const tex1 = loadTexture(image1_URL)
  const tex2 = loadTexture(image2_URL)
  const texDisp = loadTexture(displacementURL)

  // --- SHADERS ---
  const vertex = /* glsl */ `
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 v_texcoord;
    void main() {
      v_texcoord = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `
  const fragment = disp_frag

  // --- UNIFORMS ---
  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new Vec2(1, 1) },
    u_offset: { value: offsetRef.current || 0 },
    u_image_1: { value: tex1 },
    u_image_2: { value: tex2 },
    u_displacement: { value: texDisp },
  }

  const program = new Program(gl, { vertex, fragment, uniforms })
  const mesh = new Mesh(gl, { geometry, program })

  // --- SCENE RENDER LOOP ---
  let start = performance.now()

  function render(t) {
    uniforms.u_time.value = (t - start) * 0.001 // seconds
    renderer.render({ scene: mesh }) // full-screen triangle doesn't need a camera
    requestAnimationFrame(render)
  }
  setSize()
  requestAnimationFrame(render)

  // --- PUBLIC API (same name/signature) ---
  function updateUniforms() {
    uniforms.u_offset.value = offsetRef.current
    // keep resolution in sync (e.g. GSAP or resize kicks it)
    uniforms.u_resolution.value.set(
      gl.drawingBufferWidth,
      gl.drawingBufferHeight
    )
  }

  return updateUniforms
}

export default dispHandler
