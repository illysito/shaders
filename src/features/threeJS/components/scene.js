import { Color, Scene } from 'three'

function createScene() {
  const scene = new Scene()

  scene.background = new Color('#fffbf6')
  // scene.background = null

  return scene
}

export { createScene }
