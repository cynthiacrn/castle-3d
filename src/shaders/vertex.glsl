varying vec3 vNormal;
varying vec3 vViewPos;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mvPos.xyz;
  vPosition = position;
  gl_Position = projectionMatrix * mvPos;
}
