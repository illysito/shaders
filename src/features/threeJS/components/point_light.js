import { PointLight } from 'three'

function createPointLight(x, y, z, i, color) {
  // const light = new DirectionalLight('#fffbf6', 8)
  const light = new PointLight(color, i, 10)
  light.position.set(x, y, z)
  light.castShadow = false

  return light
}

export { createPointLight }
