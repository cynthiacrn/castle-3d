precision highp float;

uniform vec3 uBaseColor;
uniform vec3 uSunColor;
uniform float uSunStrength;
uniform float uOpacity;

varying float vElevation;

void main() {
  float tone = smoothstep(-0.2, 0.2, vElevation);
  
  vec3 light = uBaseColor * 1.05;
  vec3 dark = uBaseColor * 0.85;
  vec3 baseColor = mix(dark, light, tone);
  
  float sunInfluence = pow(1.0 - abs(vElevation), 2.0);
  vec3 sunTint = uSunColor * sunInfluence * (uSunStrength * 0.6);
  
  vec3 finalColor = baseColor + sunTint;
  
  gl_FragColor = vec4(finalColor, uOpacity);
}
