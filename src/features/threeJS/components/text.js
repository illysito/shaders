import gsap from 'gsap'
import { Points } from 'three'
import { SphereGeometry } from 'three'
import { Mesh, ShaderMaterial, Vector3 } from 'three'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

function loadFont(url) {
  return new Promise((resolve, reject) => {
    const loader = new FontLoader()
    loader.load(
      url,
      (font) => resolve(font), // Resolve with the loaded font
      undefined,
      (error) => reject(error) // Reject on error
    )
  })
}

function centerType(textGeometry, type) {
  // Compute the bounding box of the geometry
  textGeometry.computeBoundingBox()
  const boundingBox = textGeometry.boundingBox

  // Calculate the center of the geometry
  const center = new Vector3()
  boundingBox.getCenter(center)

  // Reposition the geometry to center it at (0, 0, 0)
  type.position.set(-center.x, -center.y, -center.z)
}

async function createText(text) {
  // font loading
  // resource URL
  const url =
    'https://raw.githubusercontent.com/illysito/NeueRegrade/d5a1e43aab6950247fdceecc09c74ff8e0172b80/Neue%20Regrade_Bold.json'

  const font = await loadFont(url)

  const uniforms = {
    u_time: { value: 0.0 },
    u_mouseX: { value: 0.0 },
    u_mouseY: { value: 0.0 },
    u_distortionStrength: { value: 0.2 },
  }

  const vertexShader = `
  uniform float u_time;
  uniform float u_mouseX;
  uniform float u_mouseY;
  uniform float u_distortionStrength;
  varying vec2 xy;
  varying vec3 v_position;

  #define NUM_OCTAVES 5

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
    vec3 newPosition = position;
    vec2 mouse = vec2(u_mouseX, u_mouseY);

    // Calculate distance from vertex to mouse
    float dist = distance(mouse, position.xy);

    // Create distortion based on distance
    float strength = 0.5 * exp(-dist * 5.0); // Adjust falloff
    float wave = 10.0 * sin(u_time * 3.0 + dist * 5.0) * 0.1;
    newPosition.x += strength * wave;

    //float radius = 1.0;
    //float noise = fbm(2.5 * position + 0.95 * u_time);
    //radius *= mix(0.5, 1.5, noise);
    //radius += smoothstep(0.8, 1.2, noise);

    //newPosition *= radius;

    //newPosition.x += smoothstep(0.0, 2.0, mouse.x);
    //newPosition.y -= smoothstep(1.0, 2.0, mouse.y);

    // Standard vertex position transformation
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = 0.0;
    v_position = newPosition;
  }
  `

  const fragmentShader = `
  uniform float u_time;
  uniform float u_mouseX;
  uniform float u_mouseY;
  varying vec2 xy;
  varying vec3 v_position;

  void main() {
    vec2 u_mouse = vec2(u_mouseX, u_mouseY);

    vec4 color1 = vec4(0.0,0.0,0.9,1.0);
    vec4 color2 = vec4(0.9,0.96,0.9,1.0);
    vec4 color3 = vec4(0.1,0.1,0.1,1.0);

    float x = v_position.x;
    float y = v_position.y;
    float z = v_position.z;

    float mixer = (x + y + z) * sin(2.0 * (x + y + z)  * u_time);
    mixer = v_position.x;
    mixer = smoothstep(-2.0, 1.0, mixer);

    vec4 color = mix(color1, color2, mixer);

    gl_FragColor = color1;
  }
  `

  const textGeometry = new TextGeometry(text, {
    font: font,
    depth: 0,
    height: 0,
    size: 1,
    bevelEnabled: false,
    curveSegments: 300,
  })
  console.log(textGeometry)

  const radius = 1.6
  const dpi = 150
  //prettier-ignore
  const sphereGeometry = new SphereGeometry(radius, 2 * dpi, 2 * dpi)
  console.log(sphereGeometry)

  const textMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    wireframe: false,
    uniforms,
  })

  const points = new Points(textGeometry, textMaterial)

  const type = new Mesh(textGeometry, textMaterial)
  // centerType(sphereGeometry, type)
  centerType(sphereGeometry, points)

  type.tick = (delta) => {
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

  return { type, points }
}

export { createText }
