precision highp float;

varying vec3 vWorldPosition;
varying vec3 vNormal;

uniform samplerCube uEnvMap;
uniform vec3 uCameraPosition;
uniform float uRefractionRatio;
uniform vec3 uWaterColor;

void main() {
  vec3 viewDir = normalize(vWorldPosition - uCameraPosition);
  
  // Réflexion et réfraction combinées
  vec3 reflected = reflect(viewDir, normalize(vNormal));
  vec3 refracted = refract(viewDir, normalize(vNormal), uRefractionRatio);
  
  vec3 envReflection = textureCube(uEnvMap, reflected).rgb;
  vec3 envRefraction = textureCube(uEnvMap, refracted).rgb;
  
  vec3 color = mix(envRefraction, envReflection, 0.5);
  color = mix(uWaterColor, color, 0.6);
  
  gl_FragColor = vec4(color, 0.85); // semi-transparent
}
