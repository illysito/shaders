const filter_frag = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform float u_red_shift;
uniform float u_green_shift;
uniform float u_blue_shift;
uniform float u_noiseFactor;

uniform vec2 u_resolution;

uniform sampler2D image;

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
  float image_ratio = 1920.0 / 1080.0;
  float canvas_ratio = u_resolution.x / u_resolution.y;

  vec2 coords = aspect(uv, image_ratio, canvas_ratio);

  vec4 redChannel = texture2D(image, coords - vec2(u_red_shift,0));
  redChannel.g = 0.0;
  redChannel.b = 0.0;

  vec4 greenChannel = texture2D(image, coords - vec2(u_green_shift,0));
  greenChannel.r = 0.0;
  greenChannel.b = 0.0;

  vec4 blueChannel = texture2D(image, coords - vec2(u_blue_shift,0));
  blueChannel.r = 0.0;
  blueChannel.g = 0.0;

  vec4 img = u_red * redChannel + u_green * greenChannel + u_blue * blueChannel;

  float noiseMixer = random(uv);
  noiseMixer = smoothstep(0.0, 1.0 + u_noiseFactor, noiseMixer);
  img += u_noiseFactor * noiseMixer;

  // gl_FragColor = img;
  gl_FragColor = vec4(img.rgb * img.a, img.a);
}
`
export default filter_frag
