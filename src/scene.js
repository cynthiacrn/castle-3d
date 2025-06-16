import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createSunGradientTexture } from './utils/createSunGradientTexture.js'
import { addLights } from './utils/lights.js'

export function createScene() {
  const canvas = document.querySelector('canvas.webgl')
  const scene = new THREE.Scene()
  scene.background = createSunGradientTexture()

  const sizes = { width: window.innerWidth, height: window.innerHeight }

  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
  camera.position.set(60, 20, 120)
  camera.lookAt(0, 15, 0)
  scene.add(camera)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.enablePan = false
  controls.target.set(0, 15, 0)
  controls.update()

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputEncoding = THREE.sRGBEncoding

  addLights(scene)

  // Fake sun
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(20, 32, 32),
    new THREE.MeshBasicMaterial({ color: '#fff1c1', transparent: true, opacity: 0.2, depthWrite: false })
  )
  sunMesh.position.set(10, 40, -90)
  scene.add(sunMesh)

  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(30, 32, 32),
    new THREE.MeshBasicMaterial({ color: '#fff1c1', transparent: true, opacity: 0.05, depthWrite: false })
  )
  halo.position.copy(sunMesh.position)
  scene.add(halo)

  return { scene, camera, renderer, controls, sizes, canvas }
}
