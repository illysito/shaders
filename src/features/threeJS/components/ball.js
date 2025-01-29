import gsap from 'gsap'
//prettier-ignore
import { SphereGeometry, Mesh, MeshStandardMaterial, ShaderMaterial, TorusGeometry, Group } from 'three'

function createBall() {
  const size = 2
  // THE BALL!
  // GEOMETRY
  const geometry = new SphereGeometry(size, 64, 64)
  // MATERIAL
  const ball_material = new MeshStandardMaterial({
    color: 0x32cd32, // Tennis ball green
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    opacity: 0.2,
    emissive: 0x228b22, // Slight glow for realism
    emissiveIntensity: 0.5,
  })
  console.log(ball_material)

  const uniforms = {
    u_color: { value: [0.2, 1.0, 0.99] },
    u_time: { value: 0.0 },
    u_mouseX: { value: 0.0 },
    u_mouseY: { value: 0.0 },
  }

  const ballVertexShader = `
  #define NUM_OCTAVES 5

  varying vec2 vUv;
  uniform float u_time;
  uniform float u_mouseX;
  uniform float u_mouseY;
  
  float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
  
  float noise(vec3 p){
      vec3 a = floor(p);
      vec3 d = p - a;
      d = d * d * (3.0 - 2.0 * d);
  
      vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
      vec4 k1 = perm(b.xyxy);
      vec4 k2 = perm(k1.xyxy + b.zzww);
  
      vec4 c = k2 + a.zzzz;
      vec4 k3 = perm(c);
      vec4 k4 = perm(c + 1.0);
  
      vec4 o1 = fract(k3 * (1.0 / 41.0));
      vec4 o2 = fract(k4 * (1.0 / 41.0));
  
      vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
      vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
  
      return o4.y * d.y + o4.x * (1.0 - d.y);
  }
  
  
  float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100);
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }
  
  
  void main() {
  
    // COORDS
  
    vUv = uv;
    vec3 pos = position;
  
    // MOUSE
  
    vec2 u_mouse = vec2(u_mouseX, u_mouseY);
  
    // MOVEMENT
  
    float radius = 0.5;
    float distortion = fbm(0.8 * pos + 0.8 * u_time);
  
    radius += mix(0.4, 0.8, distortion); 
  
    // pos *= radius;
  
    // OUTPUT
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `
  const ballFragmentShader = `
  uniform vec3 u_color;
  varying vec2 vUv;

  void main() {
    vec3 xyz = gl_FragCoord.xyz;
    vec3 color = vec3(0.2,0.9,0.9);  // White seam color
    color.x = 0.6 * smoothstep(0.0, 1.0, xyz.x);
    color.y = 0.8 * smoothstep(0.0, 1.0, xyz.x);
    color.z = 0.1 * smoothstep(0.0, 1.0, xyz.x);
    gl_FragColor = vec4(color, 0.01);
  }
`
  const ball_material_2 = new ShaderMaterial({
    uniforms,
    vertexShader: ballVertexShader,
    fragmentShader: ballFragmentShader,
    transparent: false,
  })
  // MESH
  const ball = new Mesh(geometry, ball_material_2)

  // THE SEAM
  // GEOMETRY
  const seamGeometry = new TorusGeometry(size, 0.025, 32 * size, 100 * size)
  // MATERIAL
  const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;

    // Apply S-curve distortion on the Y axis
    float sCurve = sin(vPosition.y * 6.28/2.0) * 0.45;  // Control the S-curve amplitude

    // Distort the X position of the torus to create the S-curve effect
    vPosition.z += sCurve;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
  }
  `
  const fragmentShader = `
  uniform vec3 u_color;
  varying vec2 vUv;

  void main() {
    vec3 color = vec3(1.0,1.0,1.0);  // White seam color
    gl_FragColor = vec4(color, 0.0);
  }
`
  const seamMaterial = new ShaderMaterial({
    uniforms: {
      u_color: { value: [0.2, 1.0, 0.99] },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: false,
  })
  // MESH
  const seamMesh = new Mesh(seamGeometry, seamMaterial)
  seamMesh.rotation.x = Math.PI / 2
  // GROUP
  const ballGroup = new Group()
  ballGroup.add(ball) // Main ball
  ballGroup.add(seamMesh)
  // LOOP
  ballGroup.tick = (delta) => {
    uniforms.u_time.value += 0.5 * delta
    ballGroup.rotation.x += 0.15 * delta
    ballGroup.rotation.y += 0.13 * delta
    ballGroup.rotation.z += 0.18 * delta
    ballGroup.position.x += uniforms.u_mouseX.value * delta
    ballGroup.position.y += uniforms.u_mouseY.value * delta
    // uniforms.u_mouseX.value = mouseX
    // uniforms.u_mouseY.value = mouseY
    // console.log('ticking' + uniforms.u_time)
  }
  // EVENTS
  window.addEventListener('mousemove', (event) => {
    //prettier-ignore
    const mouseX = gsap.utils.mapRange(0, window.innerWidth, -1.0, 1.0, event.clientX)
    //prettier-ignore
    const mouseY = gsap.utils.mapRange(0, window.innerHeight, 1.0, -1.0, event.clientY)

    uniforms.u_mouseX.value = mouseX
    uniforms.u_mouseY.value = mouseY
    console.log('mouseX: ' + mouseX + ' mouseY: ' + mouseY)
  })
  // OUTPUT
  return ballGroup
}

export { createBall }
