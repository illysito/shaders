import { WebGLRenderer } from 'three'

function createRenderer() {
  //prettier-ignore
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true, })
  renderer.physicallyCorrectLights = true

  return renderer
}

export { createRenderer }
