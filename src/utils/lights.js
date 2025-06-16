import * as THREE from 'three'

export function addLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const sunLight = new THREE.DirectionalLight(0xffe6b0, 1.2)
  sunLight.position.set(0, 60, -100)
  scene.add(sunLight)

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
  fillLight.position.set(40, 80, 40)
  scene.add(fillLight)
}
