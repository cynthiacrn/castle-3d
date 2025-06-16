import * as THREE from 'three'
import './style.css'
import { createScene } from './scene.js'
import { loadModel } from './utils/loadModel.js'
import { setupPostProcessing } from './utils/postprocessing.js'
import { createParticles } from './particles.js'
import { materials } from './materials.js'
import overlayTextureUrl from './assets/textures/paper-2.jpg'

const {
  scene,
  camera,
  renderer,
  controls,
  sizes,
  canvas
} = createScene()

const sceneGroup = new THREE.Group()
scene.add(sceneGroup)

const cameraInitialPosition = camera.position.clone()
const lookAtTarget = new THREE.Vector3(0, 15, 0)

// Particles
const { particleMaterial, particles } = createParticles()
scene.add(particles)

// Postprocessing
const { composer, outlinePass, overlayPass} = setupPostProcessing(renderer, scene, camera, sizes, overlayTextureUrl)

// Model loading
loadModel(sceneGroup, materials, outlinePass)

// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  composer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Animate
const mouse = new THREE.Vector2(0, 0)
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / sizes.width - 0.5) * 2
  mouse.y = -(e.clientY / sizes.height - 0.5) * 2
})

const clock = new THREE.Clock()
function animate() {
  const t = clock.getElapsedTime()
  materials.waterMaterial.uniforms.uTime.value = t
  particleMaterial.uniforms.uTime.value = t

  sceneGroup.position.x = mouse.x * 2
  sceneGroup.position.y = mouse.y

  // If overlay shader supports uMouse, update it:
  if (overlayPass?.uniforms?.uMouse) {
    overlayPass.uniforms.uMouse.value.set(mouse.x, mouse.y)
  }

  controls.update()
  composer.render()
  requestAnimationFrame(animate)
}
animate()
