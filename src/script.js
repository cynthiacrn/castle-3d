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
const cubeLoader = new THREE.CubeTextureLoader().setPath('/env/2/');
const envMap = cubeLoader.load([
  'px.png','nx.png','py.png','ny.png','pz.png','nz.png'
]);

scene.background = new THREE.Color('#E9D4B8')
scene.environment = envMap

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

const sun = new THREE.DirectionalLight(0xfff7e0, 1.8);
sun.position.set(60,80,40);
sun.castShadow = true;
scene.add(sun);
scene.add(new THREE.AmbientLight(0xddddcc,0.4));

const ambient = new THREE.AmbientLight(0xddddcc, 0.4)
scene.add(ambient)

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
    uWavesAmplitude: { value: 0.2 },
    uWavesFrequency: { value: 0.3 },
    uWavesSpeed: { value: 0.2 },
    uWavesPersistence: { value: 0.4 },
    uWavesLacunarity: { value: 2.0 },
    uWavesIterations: { value: 4.0 },
    uOpacity: { value: 0.7 },
    uTroughColor: { value: new THREE.Color('#2F210E') },
    uSurfaceColor: { value: new THREE.Color('#8C7B63') },
    uPeakColor: { value: new THREE.Color('#E9D4B8') },
    uTroughThreshold: { value: -0.2 },
    uTroughTransition: { value: 0.2 },
    uPeakThreshold: { value: 0.3 },
    uPeakTransition: { value: 0.2 },
    uFresnelScale: { value: 1.0 },
    uFresnelPower: { value: 3.0 },
    uEnvironmentMap: { value: envMap }
  },
  side: THREE.DoubleSide,
  transparent: true
});

envMap.encoding = THREE.sRGBEncoding
renderer.outputEncoding = THREE.sRGBEncoding

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


gltfLoader.load('castle.glb', gltf => {
  gltf.scene.traverse(child => {
    if (child.name === 'Water') {
      child.material = waterMaterial;
      child.castShadow = false;
      child.receiveShadow = false;
    } else {
      child.material = shaderMaterial;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(gltf.scene);
})

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock();
(function animate(){
  controls.update();
  const t = clock.getElapsedTime();
  waterMaterial.uniforms.uTime.value = t;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
})();
