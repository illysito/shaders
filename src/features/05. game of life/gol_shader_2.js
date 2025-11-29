const gol_frag = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_texcoord;
uniform sampler2D u_state;
uniform vec2 u_resolution;

void main() {
  vec2 uv = v_texcoord * 0.5;
  
  vec4 col = texture2D(u_state, uv);
  float a = col.r;
  
  float num = 0.0;
  for(float i = -1.0; i < 2.0; i++) {
    for(float j = -1.0; j < 2.0; j++) {
      vec2 pixelSize = 1.0 / u_resolution;
      float x = uv.x + i * pixelSize.x;
      float y = uv.y + j * pixelSize.y;

      num += texture2D(u_state, vec2(x, y)).r;
    }
  }
  
  num -= a;
  
  if(a > 0.5) {
    if(num < 1.5) {
      a = 0.0;
    }
    if(num > 3.5) {
      a = 0.0;
    }
  } else {
    if(num > 2.5 && num < 3.5) {
      a = 1.0;
    }
  }
  
  gl_FragColor = vec4(a, a, a, 1.0);
}
`
export default gol_frag
