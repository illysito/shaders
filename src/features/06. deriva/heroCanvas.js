import gsap from 'gsap'
import * as THREE from 'three'

function canvas() {
  function isMobile() {
    return window.innerWidth < 768
  }

  // ------------------------------- setup

  //
  // Textures
  //
  function githubToJsDelivr(permalink) {
    return permalink
      .replace('github.com', 'cdn.jsdelivr.net/gh')
      .replace('/blob/', '@')
  }

  let bg
  let perlinNoise
  if (isMobile()) {
    bg = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/4093d33505b9cb53ce22261ed3988872888160d6/static/derivaWebBGMob.webp'
    )
    perlinNoise = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/4093d33505b9cb53ce22261ed3988872888160d6/static/PerlinNoiseMob.webp'
    )
  } else {
    bg = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/299c70becbde653465762daaa2b91d0799fe0960/static/derivaWebBG.webp'
    )
    perlinNoise = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/6becd45f875c0fec1fc94ca2f6d8218e60293d7d/static/PerlinNoise.webp'
    )
  }

  // LUIS
  let imgLuis
  let mapLuis
  if (isMobile()) {
    imgLuis = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/ca314c152e4a738c9492ab6954d1ceb98528570b/static/DerivaMainTextureLuisMobile.jpg'
    )
    mapLuis = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/ca314c152e4a738c9492ab6954d1ceb98528570b/static/DerivaMainNoiseMapLuisMobile.jpg'
    )
  } else {
    imgLuis = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/58bafaa70b5b2f17373a59b02927bb24d5432270/static/DerivaMainTextureLuis.jpg'
    )
    mapLuis = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/017715a2929951855302760deb493a4c41dce542/static/DerivaMainNoiseMapLuis.jpg'
    )
  }

  // BASS
  let imgBass
  let mapBass
  if (isMobile()) {
    imgBass = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/ea274274000130190655b1c43173fe28fd503712/static/DerivaMainTextureBassMobile.jpg'
    )
    mapBass = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/ea274274000130190655b1c43173fe28fd503712/static/DerivaMainNoiseMapMobile.jpg'
    )
  } else {
    imgBass = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/3058a4cf5a49ad2bbef6840fa5a0c0b16aeb13ab/static/DerivaMainTextureBass.jpg'
    )
    mapBass = githubToJsDelivr(
      'https://github.com/illysito/shaders/blob/07b9024784cc5447749e23cbc6742efcc7ff92d9/static/DerivaMainNoiseMap.jpg'
    )
  }

  // POSTERS
  // let firstImpulsePoster
  // let anaAyalaPoster
  // let amberWindowPoster
  // let ajodarPoster
  // if (!isMobile()) {
  //   firstImpulsePoster = githubToJsDelivr(
  //     'https://github.com/illysito/shaders/blob/9359176878bbdb99f7ea4044592d0c1e888eb9c0/static/LUIS%20YELLOU.webp'
  //   )
  //   anaAyalaPoster = githubToJsDelivr(
  //     'https://github.com/illysito/shaders/blob/18711607743999489b3ae6c96114c05980e60ff2/static/ANA%20AYALA%20BLU.webp'
  //   )
  //   amberWindowPoster = githubToJsDelivr(
  //     'https://github.com/illysito/shaders/blob/89f18aa18e78e51b385c68ce98b0492069a1dce0/static/AMBER%20WINDOW%20NARAJA.jpg'
  //   )
  //   ajodarPoster = githubToJsDelivr(
  //     'https://github.com/illysito/shaders/blob/89f18aa18e78e51b385c68ce98b0492069a1dce0/static/AJODAR.webp'
  //   )
  // }

  //
  // Canvas
  //
  const canvas = document.querySelector('#webgl')
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
  const imgTexture = textureLoader.load(imgBass)
  const imgTexture2 = textureLoader.load(imgLuis)
  const distortionTexture = textureLoader.load(mapBass)
  const distortionTexture2 = textureLoader.load(mapLuis)
  const perlinTexture = textureLoader.load(perlinNoise)
  const background = textureLoader.load(bg)
  // imgTexture.colorSpace = THREE.SRGBColorSpace;
  // const firstImpulse = textureLoader.load(firstImpulsePoster)
  // const anaAyala = textureLoader.load(anaAyalaPoster)
  // const amberWindow = textureLoader.load(amberWindowPoster)
  // const ajodar = textureLoader.load(ajodarPoster)
  // const posters = [
  //   ajodar,
  //   null,
  //   null,
  //   null,
  //   firstImpulse,
  //   anaAyala,
  //   null,
  //   null,
  //   amberWindow,
  // ]

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
  let scrollLimit = 0
  if (isMobile()) {
    scrollLimit = 1200
  } else {
    scrollLimit = 600
  }
  let swt = 0.0
  let planeGeo
  if (isMobile()) {
    planeGeo = new THREE.PlaneGeometry(3, 4, 1, 1)
  } else {
    planeGeo = new THREE.PlaneGeometry(16, 9, 1, 1)
  }

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
    uniform vec2 uMouse;
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
        uv.x  +  0.002 * sin(0.4 * uTime * noise  + uTime)  +  0.2 * sin(uTime) * perlinMap.r * uOffset,
        // uv.x,
        uv.y  +  0.004 * cos(0.2 * uTime * noise)  +  2.0 * perlinMap.r * uOffset 
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
      vec4 glowColor = vec4(auraTex.rgb * auraNoise * glowIntensity, distMap * uOffset);
      float pulse = 0.5 + 0.5 * sin(uTime * 1.2 + auraNoise * 4.0);
      glowColor *= pulse;

      vec4 tex1 = texture2D(uTexture, noiseUv);
      vec4 tex2 = texture2D(uTexture2, noiseUv);
      vec4 tex = mix(tex1, tex2, uSw);
      // vec3 color = tex.rgb;
      vec4 color = vec4(tex.rgb, 0.0 * uOffset);

      // // ADDITIVE BLEND
      // vec3 finalColor = color + glowColor;

      // SCREEN BLEND
      // vec3 finalColor = 1.0 - (1.0 - color) * (1.0 - vec3(0.2 * glowColor.r, 0.8 * glowColor.g, 0.2 * glowColor.b));
      vec4 finalColor = 1.0 - (1.0 - color) * (1.0 - vec4(0.2 * glowColor.r, 0.8 * glowColor.g, 0.2 * glowColor.b, 1.0));
      finalColor *= background;

      // FINAL BLEND
      float alphaOffset = smoothstep(0.6, 1.0, uOffset);
      // vec3 finalComp = mix(finalColor, background.rgb, alphaOffset);
      vec4 finalComp = mix(finalColor, background, alphaOffset);

      // gl_FragColor = vec4(finalComp, 1.0);
      gl_FragColor = finalComp;
      // gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
  })
  // const material = new THREE.MeshBasicMaterial({
  //   map: imgTexture,
  //   // wireframe: true,
  // });

  const plane = new THREE.Mesh(planeGeo, material)
  let planeScale = 0.4
  plane.position.y = 0.2
  plane.position.x = -0.15
  if (isMobile()) {
    planeScale = 0.9
    plane.position.y = 0.12
    plane.position.x = 0
  }

  plane.scale.set(planeScale, planeScale, planeScale)
  scene.add(plane)

  // let imgPlaneScale = 0.4
  // let posterOffset = 1.0
  // let posterIndex = 0
  // console.log(posters[posterIndex])
  // const imgMaterial = new THREE.ShaderMaterial({
  //   uniforms: {
  //     uTexture: { value: posters[posterIndex] },
  //     uFirstImpulse: { value: firstImpulse },
  //     uAnaAyala: { value: anaAyala },
  //     uAmberWindow: { value: amberWindow },
  //     uAjodar: { value: ajodar },
  //     uPerlin: { value: perlinTexture },
  //     uBG: { value: background },
  //     uOffset: { value: posterOffset },
  //     uIndex: { value: posterIndex },
  //     uTime: { value: 0.0 }, // optional if you want animation
  //   },
  //   vertexShader: `
  //   varying vec2 vUv;

  //   void main() {
  //     vUv = uv;
  //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //   }
  // `,
  //   fragmentShader: `
  //   varying vec2 vUv;
  //   uniform sampler2D uAjodar;
  //   uniform sampler2D uFirstImpulse;
  //   uniform sampler2D uAnaAyala;
  //   uniform sampler2D uAmberWindow;
  //   uniform sampler2D uTexture;
  //   uniform sampler2D uPerlin;
  //   uniform sampler2D uBG;
  //   uniform float uIndex;
  //   uniform float uTime;
  //   uniform float uOffset;

  //   void main() {

  //     // UV

  //     vec2 uv = vUv;

  //     // PERLIN DISP

  //     float displacementCoef = 0.4;

  //     vec4 perlinMap = texture2D(uPerlin, uv);

  //     // PERLIN SAMPLING

  //     float displaceForce1 = perlinMap.r * uOffset * displacementCoef;
  //     vec2 uvDisplaced1 = vec2(uv.x + sin(uTime) * displaceForce1, uv.y + displaceForce1);

  //     float displaceForce2 = perlinMap.r * (1.0 - uOffset) * displacementCoef;
  //     vec2 uvDisplaced2 = vec2(uv.x + cos(uTime) * displaceForce2, uv.y + displaceForce1);

  //     vec4 tex;
  //     if(uIndex == 0.0){
  //       tex = texture2D(uAjodar, uvDisplaced1);
  //     }else if(uIndex == 4.0){
  //       tex = texture2D(uFirstImpulse, uvDisplaced1);
  //     }else if(uIndex == 5.0){
  //       tex = texture2D(uAnaAyala, uvDisplaced1);
  //     }else if(uIndex == 8.0){
  //       tex = texture2D(uAmberWindow, uvDisplaced1);
  //     }

  //     vec4 bg = texture2D(uBG, uvDisplaced2);
  //     vec4 img = (tex * (1.0 - uOffset) + bg * uOffset);

  //     gl_FragColor = img;
  //   }
  // `,
  // })
  // const imgPlaneGeo = new THREE.PlaneGeometry(4, 5, 1, 1)
  // const imgMesh = new THREE.Mesh(imgPlaneGeo, imgMaterial)
  // imgMesh.scale.set(imgPlaneScale, imgPlaneScale, imgPlaneScale)
  // imgMesh.position.x = 1.4
  // scene.add(imgMesh)
  // const imgMaterial2 = new THREE.ShaderMaterial({
  //   uniforms: {
  //     uTexture: { value: posters[posterIndex] },
  //     uPerlin: { value: perlinTexture },
  //     uBG: { value: background },
  //     uOffset: { value: posterOffset },
  //     uTime: { value: 0.0 }, // optional if you want animation
  //   },
  //   vertexShader: `
  //   varying vec2 vUv;

  //   void main() {
  //     vUv = uv;
  //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //   }
  // `,
  //   fragmentShader: `
  //   varying vec2 vUv;
  //   uniform sampler2D uTexture;
  //   uniform sampler2D uPerlin;
  //   uniform sampler2D uBG;
  //   uniform float uTime;
  //   uniform float uOffset;

  //   void main() {

  //     // UV

  //     vec2 uv = vUv;

  //     // PERLIN DISP

  //     float displacementCoef = 0.4;

  //     vec4 perlinMap = texture2D(uPerlin, uv);

  //     // PERLIN SAMPLING

  //     float displaceForce1 = perlinMap.r * uOffset * displacementCoef;
  //     vec2 uvDisplaced1 = vec2(uv.x + sin(uTime) * displaceForce1, uv.y + displaceForce1);

  //     float displaceForce2 = perlinMap.r * (1.0 - uOffset) * displacementCoef;
  //     vec2 uvDisplaced2 = vec2(uv.x + cos(uTime) * displaceForce2, uv.y + displaceForce1);

  //     vec4 tex = texture2D(uTexture, uvDisplaced1);
  //     vec4 bg = texture2D(uBG, uvDisplaced2);
  //     vec4 img = (tex * (1.0 - uOffset) + bg * uOffset);

  //     gl_FragColor = img;
  //   }
  // `,
  // })
  // const imgPlaneGeo2 = new THREE.PlaneGeometry(4, 5, 1, 1)
  // const imgMesh2 = new THREE.Mesh(imgPlaneGeo2, imgMaterial2)
  // imgMesh2.scale.set(imgPlaneScale, imgPlaneScale, imgPlaneScale)
  // imgMesh2.position.x = -1.8
  // scene.add(imgMesh2)

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

  // HOVER
  // const eventTitles = document.querySelectorAll('.event-title-2')
  // eventTitles.forEach((title, index) => {
  //   title.addEventListener('mouseover', () => {
  //     posterIndex = index
  //     gsap.to(imgMaterial.uniforms.uOffset, {
  //       value: 0.0,
  //       duration: 0.6,
  //     })
  //   })
  //   title.addEventListener('mouseleave', () => {
  //     gsap.to(imgMaterial.uniforms.uOffset, {
  //       value: 1.0,
  //       duration: 0.6,
  //     })
  //   })
  // })

  // SCROLL
  let raisePlane = false
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    if (scroll > 800) {
      raisePlane = true
    }

    // Fade in from 0 → 1 for the first 450px
    let fadeIn = gsap.utils.mapRange(0, scrollLimit, 0, 1, scroll)
    fadeIn = Math.min(fadeIn, 1)

    // Fade out from 1 → 0 as user approaches the bottom
    let fadeOut = gsap.utils.mapRange(
      maxScroll - scrollLimit,
      maxScroll,
      1,
      0,
      scroll
    )
    fadeOut = Math.max(Math.min(fadeOut, 1), 0)

    // Choose which applies
    computedOffset = scroll < scrollLimit ? fadeIn : fadeOut

    // Swap textures
    if (scroll > scrollLimit) {
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
    // imgMaterial.uniforms.uTime.value = t
    // imgMaterial.uniforms.uIndex.value = posterIndex
    material.uniforms.uTime.value = t
    material.uniforms.uOffset.value = computedOffset
    material.uniforms.uSw.value = swt

    if (isMobile() && raisePlane) {
      plane.position.y = 0.24
    } else if (isMobile() && !raisePlane) {
      plane.position.y = 0.12
    }

    // Render
    requestAnimationFrame(tick)
    renderer.render(scene, camera)
  }
  tick()
}

export default canvas
