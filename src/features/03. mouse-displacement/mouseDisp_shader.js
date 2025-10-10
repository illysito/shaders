const disp_frag = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_offset;
uniform float u_mouseX;
uniform float u_mouseY;
uniform sampler2D u_image_1;
uniform sampler2D u_image_2;
uniform sampler2D u_displacement;

varying vec2 v_texcoord;

float random(vec2 uv) {
  return fract(sin(dot(uv.xy,
      vec2(12.9898,78.233))) *
          43758.5453123);
}

vec2 aspect(vec2 uv, float image_ratio, float canvas_ratio){
  // if canvas is taller than image, stretch downwards
  // if canvas is landscape to the image, stretch across
  if(image_ratio >= canvas_ratio){
    float ratio = canvas_ratio / image_ratio;
    uv.x *= ratio;
    uv.x += (1.0 - ratio) / 2.0; 
  } else {
    float ratio = image_ratio / canvas_ratio;
    uv.y *= ratio;
    uv.y += (1.0 - ratio) / 2.0; 
  }
  return uv;
}

void main()
{

  // CREO EL VECTOR UV Y LO AJUSTO A RESOLLUCION

  vec2 uv = v_texcoord;
  //uv.x *= u_resolution.x / u_resolution.y;

  // find out the ratios
  float image_ratio = 1652.0 / 992.0;
  float canvas_ratio = u_resolution.x / u_resolution.y;

  vec2 coords = aspect(uv, image_ratio, canvas_ratio);

  // NOISE

  float noise = random(uv + sin(u_time));
  float noiseFactor = 0.1;

  // IMG

  float displacementCoef = 0.2;

  vec4 img_1 = texture2D(u_image_1, coords);
  vec4 displacement = texture2D(u_displacement, coords);

  // MOUSE

  vec2 mouse = aspect(vec2(u_mouseX, 1.0 - u_mouseY), image_ratio, canvas_ratio);

  // DISTANCE

  float dist = distance(coords, mouse);
  float radius = 0.1;
  float softness = 0.1;
  float strength = 1.0 - smoothstep(radius, radius + softness, dist);

  float displaceForce1 = displacement.r * strength * displacementCoef;
  vec2 uvDisplaced1 = vec2(coords.x + displaceForce1, coords.y + displaceForce1);
  vec4 d_img_1 = texture2D(u_image_1, uvDisplaced1);

  vec4 img = d_img_1;

  img += noise * noiseFactor;

  gl_FragColor = img;
}
`
export default disp_frag
