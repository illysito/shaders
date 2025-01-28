import { Color, Scene } from 'three'

function createScene() {
  const scene = new Scene()

  scene.background = new Color('#0e0e0e')
  // scene.background = null

  return scene
}

export { createScene }
