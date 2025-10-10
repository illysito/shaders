const disp_frag = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_image_1;
uniform sampler2D u_image_2;
uniform sampler2D u_displacement;

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
  float image_ratio = 1652.0 / 992.0;
  float canvas_ratio = u_resolution.x / u_resolution.y;

  vec2 coords = aspect(uv, image_ratio, canvas_ratio);

  // IMG

  float displacementCoef = 0.4;

  vec4 img_1 = texture2D(u_image_1, coords);
  vec4 img_2 = texture2D(u_image_2, coords);
  vec4 displacement = texture2D(u_displacement, coords);

  float offset = clamp(sin(u_time), 0.0, 1.0);
  // float offset = 1.0;

  float displaceForce1 = displacement.r * offset * displacementCoef;
  vec2 uvDisplaced1 = vec2(uv.x + displaceForce1, uv.y + displaceForce1);

  float displaceForce2 = displacement.r * (1.0 - offset) * displacementCoef;
  vec2 uvDisplaced2 = vec2(uv.x - displaceForce2, uv.y - displaceForce2);

  vec4 d_img_1 = texture2D(u_image_1, uvDisplaced1);
  vec4 d_img_2 = texture2D(u_image_2, uvDisplaced2);

  vec4 img = (d_img_1 * (1.0 - offset) + d_img_2 * offset);
  // img = d_img_1;

  gl_FragColor = img;
}
`
export default disp_frag
