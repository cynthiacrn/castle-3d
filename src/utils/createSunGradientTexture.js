import * as THREE from 'three'

export function createSunGradientTexture() {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(
    size * 0.7, size * 0.5, size * 0.01,
    size * 0.7, size * 0.5, size * 0.35
  )

  gradient.addColorStop(0, '#ffd98c') // center color
  gradient.addColorStop(1, '#e6b58f') // outer glow

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.encoding = THREE.sRGBEncoding
  return texture
}
