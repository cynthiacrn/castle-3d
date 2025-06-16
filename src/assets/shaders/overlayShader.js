import * as THREE from 'three'
import vertexShader from './overlay/vertex.glsl'
import fragmentShader from './overlay/fragment.glsl'

export const OverlayShader = {
  uniforms: {
    tDiffuse: { value: null },
    tOverlay: { value: null },
    uOpacity: { value: 0.4 },
    uFadeCenter: { value: 0.3 },
    uFadeStrength: { value: 1.0 },
    uMouse: { value: new THREE.Vector2() }
  },
  vertexShader,
  fragmentShader
}
