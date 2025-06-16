import * as THREE from 'three'
import particleVertexShader from './assets/shaders/particles/vertex.glsl'
import particleFragmentShader from './assets/shaders/particles/fragment.glsl'

export function createParticles() {
  const particleCount = 300
  const positions = new Float32Array(particleCount * 3)
  const speeds = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 200
    positions[i3 + 1] = Math.random() * 60
    positions[i3 + 2] = (Math.random() - 0.5) * 200
    speeds[i] = 0.5 + Math.random() * 0.5
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0.0 },
      uSize: { value: 5.0 }
    },
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader
  })

  return {
    particleMaterial: material,
    particles: new THREE.Points(geometry, material)
  }
}
