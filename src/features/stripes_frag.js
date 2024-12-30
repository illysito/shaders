const frag = `
#ifdef GL_ES
precision highp float;
#endif

#define GRAIN_MULT 0.35

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float invert;
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
  const int octaves = 6;
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
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.x *= u_resolution.x / u_resolution.y;

  vec3 white = vec3(0.08, 0.08, 0.08);
  vec3 black = vec3(1.0, 0.98, 0.95);
  // vec3 black = hsv2rgb(vec3(u_hue, 1.0, 1.0));

  vec3 color1 = mix(white, black, invert);
  vec3 color2 = mix(black, white, invert);
 
  vec2 move = vec2(uv.x + 0.01 * u_time, uv.y + 0.05 * u_time);
 
  float mixFactor = fbm(0.2 * move);
  mixFactor = (15.0 + u_zoom) * fract(mixFactor);

  mixFactor += smoothstep(-1.0 * u_grain, u_grain, random(uv));

  mixFactor += u_osc * sin(mix(0.0, 1.0, u_osc / 40.0 * u_time));

  mixFactor += 0.05 * abs(sin(10.0 * uv.x + 1.0 * u_time));
  mixFactor += 0.05 * abs(sin(10.0 * uv.y + 1.0 * u_time));
  mixFactor = 15.0 * fract(mixFactor);

  mixFactor = smoothstep(0.0, 0.2, mixFactor) -  smoothstep(0.8,1.0,mixFactor);
 
  //mixFactor += smoothstep(0.0,0.9,random(uv));
  //mixFactor *= 0.35;
 
  vec3 col = mix(color1, color2, mixFactor);

  // Output to screen
  gl_FragColor = vec4(col,1.0);
}
`
export default frag
