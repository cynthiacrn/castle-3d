precision highp float;

uniform vec3 uBaseColor;
uniform float uOpacity;

varying float vElevation;

void main() {
  // Variation de couleur légère basée sur l'élévation
  float tone = smoothstep(-0.2, 0.2, vElevation);
  vec3 light = uBaseColor * 1.05;
  vec3 dark = uBaseColor * 0.85;
  vec3 color = mix(dark, light, tone);
  
  gl_FragColor = vec4(color, uOpacity);
}
