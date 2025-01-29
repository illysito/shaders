const warp_type_frag = `
#define NUM_OCTAVES 5

uniform sampler2D u_texture;
uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_time;
uniform vec2 u_aspect;

varying vec2 vUv;

uniform vec2 u_prevMouse;

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

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
  float fbm = fbm(u_mouse);

  float radius = 0.5 * (0.16 * sin(0.3 * u_time) + 0.05 * abs(sin(0.2 * u_time)));
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
  distortion *= 2.0 * fbm;

  vec2 center = vec2(0.5, 0.5);
  coords -= center;
  coords *= 1.0 + (0.005 * u_mouse.x * u_mouse.y);
  coords += center;

  // OUTPUT

  vec4 color = texture2D(u_texture, coords - distortion);
  gl_FragColor = color;
}
`

const warp_type_vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export { warp_type_frag, warp_type_vertex }
