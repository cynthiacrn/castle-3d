import * as THREE from 'three'
import waterVertexShader from './assets/shaders/water/vertex.glsl'
import waterFragmentShader from './assets/shaders/water/fragment.glsl'

export const materials = {
  castleMaterial: new THREE.MeshToonMaterial({ color: '#e9d4b8' }),
  groundMaterial: new THREE.MeshToonMaterial({ color: '#d8bfa3' }),
  waterMaterial: new THREE.ShaderMaterial({
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
      uOpacity: { value: 1.0 },
      uSunColor: { value: new THREE.Color('#f6c189') },
      uSunStrength: { value: 0.4 }
    },
    side: THREE.DoubleSide,
    transparent: false
  })
}
