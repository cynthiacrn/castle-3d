import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'

export function loadModel(sceneGroup, materials, outlinePass) {
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/draco/')
  const gltfLoader = new GLTFLoader().setDRACOLoader(dracoLoader)

  gltfLoader.load('/castle.glb', gltf => {
    gltf.scene.traverse(child => {
      if (!child.isMesh) return
      if (child.name === 'Water') {
        child.material = materials.waterMaterial
      } else if (child.name === 'Ground') {
        child.material = materials.groundMaterial
        outlinePass.selectedObjects.push(child)
      } else {
        child.material = materials.castleMaterial
        const edges = new THREE.EdgesGeometry(child.geometry, 45)
        const jitter = edges.attributes.position.array
        for (let i = 0; i < jitter.length; i++) {
          jitter[i] += (Math.random() - 0.5) * 0.02
        }
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: '#2B1F12', transparent: true, opacity: 0.6 })
        )
        line.position.copy(child.position)
        line.rotation.copy(child.rotation)
        line.scale.copy(child.scale)
        sceneGroup.add(line)
      }
    })
    sceneGroup.add(gltf.scene)
  })
}
