import { TextureLoader, Vector2 } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OverlayShader } from '../assets/shaders/overlayShader.js'

export function setupPostProcessing(renderer, scene, camera, sizes, overlayTextureUrl) {
  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))

  const outlinePass = new OutlinePass(new Vector2(sizes.width, sizes.height), scene, camera)
  outlinePass.edgeStrength = 2.5
  outlinePass.edgeGlow = 0
  outlinePass.edgeThickness = 1.0
  outlinePass.visibleEdgeColor.set('#000000')
  outlinePass.hiddenEdgeColor.set('#000000')
  composer.addPass(outlinePass)

  const overlayPass = new ShaderPass(OverlayShader)
  new TextureLoader().load(overlayTextureUrl, (tex) => {
    overlayPass.uniforms.tOverlay.value = tex
  })
  overlayPass.uniforms.uOpacity.value = 0.4
  overlayPass.uniforms.uFadeCenter.value = 0.4
  overlayPass.uniforms.uFadeStrength.value = 1.5
  composer.addPass(overlayPass)

  return { composer, outlinePass, overlayPass }
}
