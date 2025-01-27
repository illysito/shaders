import { createCamera } from '../components/camera.js'
import { createCube } from '../components/cube.js'
// import { createPointLight } from '../components/point_light.js'
import { createScene } from '../components/scene.js'
import { createText } from '../components/text.js'
import { Loop } from '../systems/Loop.js'
import { createRenderer } from '../systems/renderer.js'
import { Resizer } from '../systems/Resizer.js'

let camera
let scene
let renderer
let loop

class World {
  // 1. Create an instance of the World app
  constructor(container) {
    camera = createCamera()
    scene = createScene()
    renderer = createRenderer()
    loop = new Loop(camera, scene, renderer)
    container.append(renderer.domElement)

    // const point_light = createPointLight(0, 0, 3, 50, '#fffbf6')
    this.initText()
    // this.initCube()

    // scene.add(point_light)

    const resizer = new Resizer(container, camera, renderer)
    console.log('in World Class - mandatory (resizer object): ' + resizer)
  }

  async initText() {
    const { type } = await createText('WU') // Await the result of createText
    loop.updatables.push(type)
    scene.add(type) // Add the loaded text to the scene
    this.render()
  }

  initCube() {
    const cube = createCube()
    scene.add(cube)
  }

  // 2. Render the scene
  render() {
    renderer.render(scene, camera)
  }

  start() {
    loop.start()
  }

  stop() {
    loop.stop()
  }
}

export { World }
