import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#E9D4B8')

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(60, 20, 120)
camera.lookAt(0, 15, 0)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.target.set(0, 15, 0)
controls.update()

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.6))
const sun = new THREE.DirectionalLight(0xffffff, 1.5)
sun.position.set(40, 80, 40)
scene.add(sun)

// Environment
const cubeLoader = new THREE.CubeTextureLoader().setPath('/env/2/')
const envMap = cubeLoader.load(['px.png','nx.png','py.png','ny.png','pz.png','nz.png'])
envMap.encoding = THREE.sRGBEncoding
scene.environment = envMap

// Materials
const castleMaterial = new THREE.MeshToonMaterial({ color: '#e9d4b8' })
const groundMaterial = new THREE.MeshToonMaterial({ color: '#d8bfa3' })

const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uWavesAmplitude: { value: 0.5 },
    uWavesFrequency: { value: 0.12 },
    uWavesSpeed: { value: 0.3 },
    uWavesPersistence: { value: 0.8 },
    uWavesLacunarity: { value: 0.5 },
    uWavesIterations: { value: 5.0 },
    uBaseColor: { value: new THREE.Color('#e9d4b8') },
    uOpacity: { value: 1.0 }
  },
  side: THREE.DoubleSide,
  transparent: false
})

// Postprocessing composer
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

const outlinePass = new OutlinePass(
  new THREE.Vector2(sizes.width, sizes.height),
  scene,
  camera
)
outlinePass.edgeStrength = 2.5
outlinePass.edgeGlow = 0
outlinePass.edgeThickness = 1.0
outlinePass.visibleEdgeColor.set('#000000')
outlinePass.hiddenEdgeColor.set('#000000')
composer.addPass(outlinePass)

// Load GLTF
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('castle.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.isMesh) {
      if (child.name === 'Water') {
        child.material = waterMaterial
        child.castShadow = false
        child.receiveShadow = false
      } else if (child.name === 'Ground') {
        child.material = groundMaterial
        child.castShadow = false
        child.receiveShadow = false

        // → Seul le Ground a un contour via OutlinePass
        outlinePass.selectedObjects.push(child)
      } else {
        child.material = castleMaterial
        child.castShadow = true
        child.receiveShadow = true

        // → EdgesGeometry classique pour le château uniquement
        const edges = new THREE.EdgesGeometry(child.geometry, 45)
        const jitter = edges.attributes.position.array
        for (let i = 0; i < jitter.length; i++) {
          jitter[i] += (Math.random() - 0.5) * 0.02
        }
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: '#4e3718', transparent: true, opacity: 0.6 })
        )
        line.position.copy(child.position)
        line.rotation.copy(child.rotation)
        line.scale.copy(child.scale)
        scene.add(line)
      }
    }
  })
  scene.add(gltf.scene)
})

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
const clock = new THREE.Clock()
function animate() {
  controls.update()
  waterMaterial.uniforms.uTime.value = clock.getElapsedTime()
  composer.render()
  requestAnimationFrame(animate)
}
animate()
