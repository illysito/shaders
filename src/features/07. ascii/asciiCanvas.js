// import gsap from 'gsap'
import * as THREE from 'three'

function asciiCanvas() {
  // ------------------------------- setup

  //
  // Textures
  //
  function githubToJsDelivr(permalink) {
    return permalink
      .replace('github.com', 'cdn.jsdelivr.net/gh')
      .replace('/blob/', '@')
  }

  // FLUITXU
  let fluitxu = githubToJsDelivr(
    'https://github.com/illysito/shaders/blob/77a20febb73ef8ef2e9ac06c22c9790468f91ec8/static/Fluitxu.jpg'
  )
  let atlas = githubToJsDelivr(
    'https://github.com/illysito/shaders/blob/4f307e0441c5d2f8a3ce3293dd5603bdd01169bb/static/ASCII%20ATLAS.jpg'
  )

  //
  // Canvas
  //
  const canvas = document.querySelector('#webgl-ascii')
  const vh = screen.height
  canvas.style.height = `${vh}px`

  //
  // Scene
  //
  const scene = new THREE.Scene()
  // scene.background = new THREE.Color(0xffffff);

  //
  // Textures
  //
  const textureLoader = new THREE.TextureLoader()
  const fluitxuTexture = textureLoader.load(fluitxu)
  const atlasTexture = textureLoader.load(atlas)

  //
  // Camera
  //
  const fov = 60 // quite a lot, usually less!
  const sizes = {
    // usually canvas aspect
    width: canvas.clientWidth,
    height: canvas.clientHeight,
  }
  let aspect = sizes.width / sizes.height
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 100) // (fov, aspect, near, far)
  camera.position.set(0, 0, 3)
  scene.add(camera)

  //
  // Resize
  //
  let resizeTimeout
  const resizeObserver = new ResizeObserver(() => {
    // Debounce to avoid flickering
    clearTimeout(resizeTimeout)

    resizeTimeout = setTimeout(() => {
      // change sizes
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      sizes.width = w
      sizes.height = h

      // update camera
      camera.aspect = w / h
      camera.updateProjectionMatrix()

      // upadte renderer
      renderer.setSize(w, h, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }, 10)
  })
  resizeObserver.observe(canvas)

  //
  // Objects
  //
  let planeGeo = new THREE.PlaneGeometry(16, 9, 1, 1)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: fluitxuTexture },
      uAtlas: { value: atlasTexture },
      uTime: { value: 0.0 }, // optional if you want animation
    },
    vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform sampler2D uAtlas;
    uniform float uTime;

    void main() {

      // UV

      vec2 resolution = vec2(1920.0, 1080.0);
      vec2 pixel = vUv * resolution;
      vec2 uv = vUv;

      float cellSize = 8.0;

      vec2 cell = floor(pixel / cellSize);     // cell index
      vec2 cellCenter = (cell + 0.5) * cellSize;

      uv = cellCenter / resolution;

      vec3 color = texture2D(uTexture, uv).rgb;
      vec4 tex = texture2D(uTexture, uv);
 
      gl_FragColor = tex;
      // gl_FragColor = atlas;
    }
  `,
  })
  // const material = new THREE.MeshBasicMaterial({
  //   map: imgTexture,
  //   // wireframe: true,
  // });

  const plane = new THREE.Mesh(planeGeo, material)
  let planeScale = 0.36

  plane.scale.set(planeScale, planeScale, planeScale)
  scene.add(plane)

  //
  // Renderer
  //

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // alpha: true,
  })
  renderer.setSize(sizes.width, sizes.height, false) // false meaning NOT OVERRIDE styles (CSS)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // ------------------------------- animate & render

  const clock = new THREE.Clock()
  function tick() {
    // Clock
    const t = clock.getElapsedTime()

    // UNIFORMS
    material.uniforms.uTime.value = t

    // Render
    requestAnimationFrame(tick)
    renderer.render(scene, camera)
  }
  tick()
}

export default asciiCanvas
