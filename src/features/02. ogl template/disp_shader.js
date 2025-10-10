const disp_frag = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D image;

varying vec2 v_texcoord;

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
  float image_ratio = 1080.0 / 1920.0;
  float canvas_ratio = u_resolution.x / u_resolution.y;

  vec2 coords = aspect(uv, image_ratio, canvas_ratio);

  // IMG

  vec4 img = texture2D(image, coords);

  gl_FragColor = img;
}
`
export default disp_frag
