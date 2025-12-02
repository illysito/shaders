import gsap from 'gsap'
import * as THREE from 'three'

function canvas() {
  // function isMobile(){
  //   return window.innerWidth < 768
  // }

  // ------------------------------- setup

  //
  // Textures
  //
  function githubToJsDelivr(permalink) {
    return permalink
      .replace('github.com', 'cdn.jsdelivr.net/gh')
      .replace('/blob/', '@')
  }
  // LUIS
  const imgLuis = githubToJsDelivr(
    'https://github.com/illysito/shaders/blob/4c01e25f71a9b5bf1503472bfaa67e9bf10510f0/static/derivaWeb2.jpg'
  )
  const imgBass = githubToJsDelivr(
    'https://github.com/illysito/shaders/blob/a72ff98b763a73506e974baa9ff0de9b533d0906/static/derivaBass3.jpg'
  )
  const bg = githubToJsDelivr(
    'https://github.com/illysito/shaders/blob/4c01e25f71a9b5bf1503472bfaa67e9bf10510f0/static/derivaWebBG.jpg'
  )
  // LUIS
  const mapLuis = githubToJsDelivr(
    'https://github.com/illysito/shaders/blob/4c01e25f71a9b5bf1503472bfaa67e9bf10510f0/static/derivaWebMask2.jpg'
  )
  const mapBass = githubToJsDelivr(
    'https://github.com/illysito/shaders/blob/a72ff98b763a73506e974baa9ff0de9b533d0906/static/derivaBassMask3.jpg'
  )
  const perlinNoise = githubToJsDelivr(
    'https://github.com/illysito/shaders/blob/4c01e25f71a9b5bf1503472bfaa67e9bf10510f0/static/PerlinNoise.jpg'
  )
  //
  // Canvas
  //
  const canvas = document.querySelector('#webgl')

  //
  // Scene
  //
  const scene = new THREE.Scene()
  // scene.background = new THREE.Color(0xffffff);

  //
  // Textures
  //
  const textureLoader = new THREE.TextureLoader()
  const imgTexture = textureLoader.load(imgBass)
  const imgTexture2 = textureLoader.load(imgLuis)
  const distortionTexture = textureLoader.load(mapBass)
  const distortionTexture2 = textureLoader.load(mapLuis)
  const perlinTexture = textureLoader.load(perlinNoise)
  const background = textureLoader.load(bg)
  // imgTexture.colorSpace = THREE.SRGBColorSpace;

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
  // const planeGeo = new THREE.PlaneGeometry(1, 1, 1, 1);
  let computedOffset = 0.0
  let swt = 0.0
  const planeGeo = new THREE.PlaneGeometry(16, 9, 1, 1)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: imgTexture },
      uTexture2: { value: imgTexture2 },
      uDistortionMap: { value: distortionTexture },
      uDistortionMap2: { value: distortionTexture2 },
      uPerlin: { value: perlinTexture },
      uBG: { value: background },
      uOffset: { value: computedOffset },
      uSw: { value: swt },
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
    uniform sampler2D uTexture2;
    uniform sampler2D uDistortionMap;
    uniform sampler2D uDistortionMap2;
    uniform sampler2D uPerlin;
    uniform sampler2D uBG;
    uniform float uOffset;
    uniform float uTime;
    uniform float uSw;

    // FBM

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
    }

    // fractal Brownian motion (smooth turbulence)
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.8;
      float frequency = 0.0;
      for (int i = 0; i < 5; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      return value;
    }

    void main() {

      // UV

      vec2 uv = vUv;

      // BLOCK UVS

      // float blocks = 400.0;
      // float blockUvX = floor(uv.x * blocks) / blocks;
      // float blockUvY = floor(uv.y * blocks) / blocks;
      // vec2 blocksUv = vec2(blockUvX, blockUvY);

      // TEXTURES

      vec4 perlinMap = texture2D(uPerlin, uv);
      // vec4 perlinMap = texture2D(uPerlin, blocksUv);
      vec4 background = texture2D(uBG, uv);

      // TEXTURE NOISE

      float noise = fbm(uv * -0.2 * sin(0.1 * uTime));
      // noise *= 2.0 * distMap;

      vec2 noiseUv = vec2(
        uv.x + 0.002 * sin(0.4 * uTime * noise  + uTime) + 0.2 * sin(uTime) * perlinMap.r * uOffset,
        // uv.x,
        uv.y + 0.004 * cos(0.2 * uTime * noise) + 2.0 * perlinMap.r * uOffset 
        // uv.y + perlinMap.r * uOffset
      );
      

      vec4 distortionMap = texture2D(uDistortionMap, noiseUv);
      vec4 distortionMap2 = texture2D(uDistortionMap2, noiseUv);
      vec4 distortionMapFinal = mix(distortionMap, distortionMap2, uSw);
      float distMap = distortionMapFinal.r;

      // AURA NOISE

      float auraNoise = fbm(uv * -3. * cos(0.1 * uTime));
      auraNoise *= 1.2 * distMap;

      // vec2 auraNoiseUv = 0.2 * vec2(
      //   0.5 + 0.5 * sin(uTime * 0.025 + auraNoise * 0.5),
      //   0.5 + 0.8 * cos(uTime * 0.015 + auraNoise)
      // );

      vec2 auraNoiseUv = 0.2 * vec2(
        uv.x + 0.5 * auraNoise,
        0.8 * auraNoise + perlinMap.r * uOffset
      );

      vec4 auraTex1 = texture2D(uTexture, auraNoiseUv);
      vec4 auraTex2 = texture2D(uTexture2, auraNoiseUv);
      vec4 auraTex = mix(auraTex1, auraTex2, uSw);

      float glowIntensity = 1.6;
      vec3 glowColor = auraTex.rgb * auraNoise * glowIntensity;
      float pulse = 0.5 + 0.5 * sin(uTime * 1.2 + auraNoise * 4.0);
      glowColor *= pulse;

      vec4 tex1 = texture2D(uTexture, noiseUv);
      vec4 tex2 = texture2D(uTexture2, noiseUv);
      vec4 tex = mix(tex1, tex2, uSw);
      vec3 color = tex.rgb;

      // // ADDITIVE BLEND
      // vec3 finalColor = color + glowColor;

      // SCREEN BLEND
      vec3 finalColor = 1.0 - (1.0 - color) * (1.0 - vec3(0.2 * glowColor.r, 0.8 * glowColor.g, 0.2 * glowColor.b));

      // FINAL BLEND
      float alphaOffset = smoothstep(0.8, 1.0, uOffset);
      vec3 finalComp = mix(finalColor, background.rgb, alphaOffset);

      gl_FragColor = vec4(finalComp, 1.0);
      // gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  })
  // const material = new THREE.MeshBasicMaterial({
  //   map: imgTexture,
  //   // wireframe: true,
  // });

  const plane = new THREE.Mesh(planeGeo, material)
  const planeScale = 0.4
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

  // ------------------------------- animate & render!

  // window.addEventListener('scroll', () => {
  //   const scroll = window.scrollY
  //   computedOffset = gsap.utils.mapRange(0, 450, 0, 1, scroll)
  //   if (computedOffset > 1) {
  //     computedOffset = 1.0
  //   }
  // })

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    // Fade in from 0 → 1 for the first 450px
    let fadeIn = gsap.utils.mapRange(0, 450, 0, 1, scroll)
    fadeIn = Math.min(fadeIn, 1)

    // Fade out from 1 → 0 as user approaches the bottom
    let fadeOut = gsap.utils.mapRange(maxScroll - 450, maxScroll, 1, 0, scroll)
    fadeOut = Math.max(Math.min(fadeOut, 1), 0)

    // Choose which applies
    computedOffset = scroll < 450 ? fadeIn : fadeOut

    // Swap textures
    if (scroll > 450) {
      swt = 1.0
    } else {
      swt = 0.0
    }
  })

  const clock = new THREE.Clock()
  function tick() {
    // Clock
    const t = clock.getElapsedTime()

    // UNIFORMS
    material.uniforms.uTime.value = t
    material.uniforms.uOffset.value = computedOffset
    material.uniforms.uSw.value = swt

    // Render
    requestAnimationFrame(tick)
    renderer.render(scene, camera)
  }
  tick()
}

export default canvas
