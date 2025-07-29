const stripes_frag = `
#ifdef GL_ES
precision highp float;
#endif

#define GRAIN_MULT 0.35

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_zoom;
uniform float u_grain;
uniform float u_osc;
uniform float u_hue;

varying vec2 v_texcoord;

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float random(vec2 uv) {
  return fract(sin(dot(uv.xy,
      vec2(12.9898,78.233))) *
          43758.5453123);
}

float noise(vec2 uv) {
  vec2 uv_index = floor(uv);
  vec2 uv_fract = fract(uv);

  // Four corners in 2D of a tile
  float a = random(uv_index);
  float b = random(uv_index + vec2(1.0, 0.0));
  float c = random(uv_index + vec2(0.0, 1.0));
  float d = random(uv_index + vec2(1.0, 1.0));

  vec2 blur = smoothstep(0.0, 1.0, uv_fract);

  return mix(a, b, blur.x) +
          (c - a) * blur.y * (1.0 - blur.x) +
          (d - b) * blur.x * blur.y;
}

float fbm(vec2 uv) {
  const int octaves = 16;
  float amplitude = 0.5;
  float frequency = 3.0;
float value = 0.0;

  for(int i = 0; i < octaves; i++) {
      value += amplitude * noise(frequency * uv);
      amplitude *= 0.5;
      frequency *= 2.1;
  }
  return value;
}

void main()
{

  // CREO EL VECTOR UV Y LO AJUSTO A RESOLLUCION

  vec2 uv = v_texcoord;
  uv.x *= u_resolution.x / u_resolution.y;

  // CREO EL VECTOR MOUSE, LO AJUSTO A RESOLUCION Y CREO LA VARIABLE DE FUERZA (contraria a DISTANCIA)

  vec2 mouse = u_mouse / u_resolution;
  mouse.x *= u_resolution.x / u_resolution.y;
  float dist = distance(uv, mouse);
  float strength = smoothstep(0.5, 0.0, dist);

  // CREO MIS COLORES

  float invert = 1.0;
  vec3 white = vec3(0.08, 0.08, 0.08);
  vec3 black = vec3(1.0, 0.98, 0.95);
  vec3 green = vec3(0.18, 0.180, 0.180);
  vec3 color1 = mix(white, green, invert);
  vec3 color2 = mix(green, white, invert);
 
  // CREO el vector MOVE y el MIXFACTOR con FBM! Esto es lo que le va a dar el movimiento GENERAL

  vec2 move = vec2(uv.x + 0.01 * u_time, uv.y + 0.02 * u_time);
  float mixFactor = fbm(0.3 * move);

  // COJO la PARTE FRACCIONAL para que se repita hasta el INFINITO. Utilizo u_zoom para meterle zoom desde UX

  mixFactor = (2.0 + 0.1 * u_zoom) * fract(mixFactor);
  mixFactor = (2.0 - 2.0 * sin(u_time)) * fract(mixFactor);

  // GRANULADO con la función MIX y usando el MOUSE

  float grain = mix(-u_grain * strength, u_grain * strength, random(uv));
  mixFactor += grain;

  // GENERO LA SENSACIÓN DE VIDA PROPIA

  mixFactor += u_osc * sin(mix(0.0, 1.0, u_osc / 40.0 * u_time + 0.1 * strength));
  mixFactor += 0.05 * abs(sin(10.0 * uv.x + 1.0 * u_time));
  mixFactor += 0.05 * abs(sin(10.0 * uv.y + 1.0 * u_time));
  mixFactor = 3.0 * fract(mixFactor);

  // ELIMINO HARD EDGES (x como esta hecho, invierte colores)

  mixFactor = smoothstep(0.0, 0.4, mixFactor) -  smoothstep(0.6, 1.0, mixFactor);

  // OUTPUT
 
  vec3 col = mix(white, black, mixFactor);
  gl_FragColor = vec4(col,1.0);
}
`
export default stripes_frag
