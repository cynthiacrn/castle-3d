varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform float uTime;

void main() {
  vec3 pos = position;
  pos.z += sin(pos.x * 2.0 + uTime) * 0.1;
  pos.z += cos(pos.y * 3.0 + uTime) * 0.1;
  
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;
  
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
