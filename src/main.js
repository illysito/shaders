import handleFilter from './features/scripts/handle_filter'
import handleStripes from './features/scripts/handle_stripes'
import nav from './features/scripts/w_nav'
import stripes from './features/shaders/stripes'
// import variableType from './features/scripts/variable_type'
import world from './features/threeJS/world/world_module'

import './styles/style.css'

//----------------------------------//
const container = document.querySelector('#padmi_canvas')

// let counter = 0

function runStripeShaders() {
  handleStripes()
  stripes()
}

function runFilterShaders() {
  handleFilter()
}

function runPadmiShaders() {
  nav()
  world(container)
  // function moveType() {
  //   counter++
  //   variableType(counter)
  //   requestAnimationFrame(moveType)
  // }
  // moveType()
}

if (document.body.classList.contains('body__fbm')) runStripeShaders()
if (document.body.classList.contains('body__filter')) runFilterShaders()
if (document.body.classList.contains('body__padmi')) runPadmiShaders()
