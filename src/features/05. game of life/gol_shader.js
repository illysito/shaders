const gol_frag = `
#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform sampler2D u_state;
uniform vec2 u_resolution;

varying vec2 v_texcoord;

float random(vec2 uv) {
  return fract(sin(dot(uv.xy,
      vec2(12.9898,78.233))) *
          43758.5453123);
}

void main()
{

  // CREO EL VECTOR UV Y LO AJUSTO A RESOLLUCION

  vec2 uv = v_texcoord;
  //uv.x *= u_resolution.x / u_resolution.y;

  // BLOCK COORDS

  // float blocks_x = 40.0;
  // float blocks_y = blocks_x * u_resolution.y / u_resolution.x;
  // float block_coords_x = floor(uv.x * blocks_x) / blocks_x;
  // float block_coords_y = floor(uv.y * blocks_y) / blocks_y;
  // vec2 block_coords = vec2(block_coords_x, block_coords_y);

  // // GAME OF LIFE

  // float stepX = 1.0 / blocks_x;
  // float stepY = 1.0 / blocks_y;
  float sum = 0.0;

  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) continue; // skip self
        vec2 pixelSize = 1.0 / u_resolution;         
        vec2 neighbor = uv + vec2(float(i), float(j)) * pixelSize;
        neighbor = mod(neighbor, 1.0);           
        sum += texture2D(u_state, neighbor).r;
    }
  }

  float neighbors = floor(sum + 0.5);
  float current = texture2D(u_state, uv).r;

  float next = 0.0;
  if(current > 0.5){
    if(neighbors == 2.0 || neighbors == 3.0){
      next = 1.0; // ALIVE
    }else{
      next = 0.0;
    }
  }else{
    if(neighbors == 3.0){
      next = 1.0; // ALIVE
    }else{
      next = 0.0;
    }
  }

  vec3 color = vec3(next, next, next);
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = texture2D(u_state, uv);
}
`
export default gol_frag
