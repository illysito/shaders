// disp_handler_ogl.js
import {
  Renderer,
  Geometry,
  Program,
  Mesh,
  RenderTarget,
  // Texture,
  Vec2,
} from 'ogl'

import gol_frag from './gol_shader_2' // your SAME fragment shader string

function golHandler(canvas) {
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
  gl.disable(gl.BLEND)
  gl.disable(gl.DEPTH_TEST)
  // renderer.state.setClearColor(0, 0, 0, 1)

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
  const fragment = gol_frag

  const gol_init_frag = `
    #ifdef GL_ES
    precision highp float;
    #endif

    varying vec2 v_texcoord;
    uniform float u_time;
    uniform vec2 u_resolution;

    float random(vec2 uv) {
      return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vec2 uv = v_texcoord * 0.5;
      float blocks_x = 80.0;
      float blocks_y = blocks_x * u_resolution.y / u_resolution.x;
      float block_coords_x = floor(uv.x * blocks_x) / blocks_x;
      float block_coords_y = floor(uv.y * blocks_y) / blocks_y;
      vec2 block_coords = vec2(block_coords_x, block_coords_y);

      float r = random(uv * u_time); // random per pixel
      float alive = step(0.25, r);            // ~20% alive
      gl_FragColor = vec4(alive, alive, alive, 1.0);
    }
`
  // --- INITIAL STATE TEXTURE (random) ---
  const initProgram = new Program(gl, {
    vertex, // same fullscreen vertex
    fragment: gol_init_frag,
    uniforms: {
      u_time: { value: Math.random() * 1000 },
      u_resolution: {
        value: new Vec2(gl.drawingBufferWidth, gl.drawingBufferHeight),
      },
    },
  })
  const initMesh = new Mesh(gl, { geometry, program: initProgram })

  // --- PING PONG ---
  let rtA = new RenderTarget(gl, {
    width: gl.drawingBufferWidth,
    height: gl.drawingBufferHeight,
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
  })
  let rtB = new RenderTarget(gl, {
    width: gl.drawingBufferWidth,
    height: gl.drawingBufferHeight,
    minFilter: gl.NEAREST,
    magFilter: gl.NEAREST,
  })
  let readTarget = rtA
  let writeTarget = rtB

  // copy seed into rtA
  renderer.render({ scene: initMesh, target: rtA })

  // MAIN PROGRAM
  // --- UNIFORMS ---
  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new Vec2(1, 1) },
    u_state: { value: rtA.texture },
  }
  const program = new Program(gl, { vertex, fragment, uniforms })
  const mesh = new Mesh(gl, { geometry, program })

  function step() {
    program.uniforms.u_state.value = readTarget.texture
    renderer.render({ scene: mesh, target: writeTarget, clear: false })
    ;[readTarget, writeTarget] = [writeTarget, readTarget]
  }

  // --- SCENE RENDER LOOP ---
  let start = performance.now()
  console.log(step)

  let frame = 0
  function render(t) {
    frame++
    if (frame % 16 == 0) step()
    uniforms.u_time.value = (t - start) * 0.001 // seconds
    // step()
    program.uniforms.u_state.value = readTarget.texture
    renderer.render({ scene: mesh }) // full-screen triangle doesn't need a camera
    requestAnimationFrame(render)
  }
  setSize()
  updateUniforms()
  requestAnimationFrame(render)

  // --- PUBLIC API (same name/signature) ---
  function updateUniforms() {
    uniforms.u_resolution.value.set(
      gl.drawingBufferWidth,
      gl.drawingBufferHeight
    )
  }

  return updateUniforms
}

export default golHandler
