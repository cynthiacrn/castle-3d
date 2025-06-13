precision highp float;

varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform vec3 uShadowColor;

float noise(vec3 p) {
  return fract(sin(dot(p.xyz, vec3(12.9898, 78.233, 42.914))) * 43758.5453);
}

void main() {
  vec3 normal = normalize(vNormal);
  float light = dot(normal, normalize(uLightDir));
  
  float detail = noise(vPosition * 2.5);
  
  float shading = smoothstep(0.0, 1.0, light);
  vec3 color = mix(uShadowColor, uLightColor, shading);
  
  color *= 0.9 + 0.2 * detail;
  
  gl_FragColor = vec4(color, 1.0);
}
