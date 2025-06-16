uniform float uTime;
uniform float uSize;
attribute float aSpeed;
varying float vAlpha;
varying float vDepth;
void main() {
  vec3 pos = position;
  pos.z += sin(uTime * aSpeed + pos.x * 0.2) * 1.2;
  pos.x += cos(uTime * aSpeed + pos.y * 0.1) * 0.5;
  vAlpha = 0.1 + 0.2 * sin(uTime * aSpeed + pos.z * 0.1);
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vDepth = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * (300.0 / vDepth);
}
