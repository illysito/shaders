const cube_frag = `
#define NUM_OCTAVES 5

uniform float u_mouseX;
uniform float u_mouseY;
uniform float u_time;
uniform vec2 u_aspect;

varying vec2 vUv;

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
  
  // COORDS
  
  vec2 coords = vUv;
  vec2 normalized_coords = coords;
  float asp = u_aspect.x / u_aspect.y;
  normalized_coords.x *= asp;

  // MOUSE

  vec2 u_mouse = vec2(u_mouseX, u_mouseY);
  u_mouse.y = 1.0 - u_mouse.y;

  // DISTANCE

  float dist = distance(vUv, u_mouse);
  dist = smoothstep(1.0, 0.0, dist);
  dist = smoothstep(0.0, 2.0, dist);

  // COLORS

  vec3 green = vec3(0.68, 0.85, 0.9);
  vec3 beige = vec3(1.0, 0.96, 0.92);
  
  float mixF = 2.0 * fbm(u_mouse);
  mixF *= fbm(vec2(u_time,u_time));

  vec3 col = mix(green, beige, mixF);

  // OUTPUT

  vec4 color = vec4(col, dist);
  gl_FragColor = color;
}
`

const cube_vertex = `
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
  float distortion = fbm(0.5 * pos + 0.2 * u_time + 0.3 * (u_mouseX + u_mouseY));

  radius += mix(0.5, 1.5, distortion); 

  pos *= radius;

  // OUTPUT

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

export { cube_frag, cube_vertex }
