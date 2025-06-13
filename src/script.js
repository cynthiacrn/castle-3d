import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import waterFragmentShader from './shaders/water/fragment.glsl'
import waterVertexShader from './shaders/water/vertex.glsl'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const cubeLoader = new THREE.CubeTextureLoader()
const environmentMap = cubeLoader.load([
  'env/0/px.png', 'env/0/nx.png',
  'env/0/py.png', 'env/0/ny.png',
  'env/0/pz.png', 'env/0/nz.png'
])

console.log(environmentMap)
scene.background = environmentMap
scene.environment = environmentMap
// scene.background = new THREE.Color(0xf2ede2)

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(60, 45, 120)
camera.lookAt(0, 20, 0)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const sunLight = new THREE.DirectionalLight(0xfff7e0, 1.8)
sunLight.position.set(60, 80, 40)
sunLight.castShadow = true
sunLight.shadow.mapSize.set(2048, 2048)
scene.add(sunLight)

const ambient = new THREE.AmbientLight(0xddddcc, 0.4)
scene.add(ambient)

scene.add(new THREE.DirectionalLightHelper(sunLight, 5))

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uLightDir: { value: new THREE.Vector3(1, 1, 1).normalize() },
    uLightColor: { value: new THREE.Color(0xe9d5b5) },
    uShadowColor: { value: new THREE.Color(0x5a3e2b) }
  }
})


const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uEnvMap: { value: environmentMap },
    uCameraPosition: { value: camera.position },
    uRefractionRatio: { value: 0.98 },
    uWaterColor: { value: new THREE.Color(0x447a9c) }
  },
  transparent: true,
})

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load('castle.glb', (gltf) => {
  console.log(gltf.scene)
  gltf.scene.traverse((child) => {
    if (child.name === "Water") {
      child.material = waterMaterial
    } else {
      child.material = shaderMaterial
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  scene.add(gltf.scene)
})

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()
const tick = () => {
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
  waterMaterial.uniforms.uTime.value = clock.getElapsedTime()
  waterMaterial.uniforms.uCameraPosition.value.copy(camera.position)
}
tick()
