uniform sampler2D tDiffuse;
uniform sampler2D tOverlay;
uniform float uOpacity;
uniform float uFadeCenter;
uniform float uFadeStrength;
uniform vec2 uMouse;
varying vec2 vUv;

void main() {
  vec2 center = vec2(0.5) + uMouse * 0.05; // Move fade center with mouse
  float dist = distance(vUv, center);
  float mask = 1.0 - smoothstep(0.0, uFadeCenter, dist);
  float fade = 1.0 - (mask * uFadeStrength);
  
  vec4 base = texture2D(tDiffuse, vUv);
  vec4 overlay = texture2D(tOverlay, vUv);
  vec3 blended = mix(base.rgb, overlay.rgb, uOpacity * fade);
  gl_FragColor = vec4(blended, 1.0);
}
