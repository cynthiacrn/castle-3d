precision highp float;

uniform float uOpacity;
uniform vec3 uTroughColor;
uniform vec3 uSurfaceColor;
uniform vec3 uPeakColor;
uniform float uPeakThreshold;
uniform float uPeakTransition;
uniform float uTroughThreshold;
uniform float uTroughTransition;
uniform float uFresnelScale;
uniform float uFresnelPower;
uniform samplerCube uEnvironmentMap;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  // Vecteur vue (du fragment vers la caméra)
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  
  // Vecteur réfléchi par rapport à la normale
  vec3 reflectDir = reflect(-viewDir, normalize(vNormal));
  
  // Pas d'inversion manuelle sur X ici
  
  // Couleur de réflexion depuis l'environnement
  vec3 reflectedColor = textureCube(uEnvironmentMap, reflectDir).rgb;
  
  // Calcul de l'effet fresnel
  float fresnel = uFresnelScale * pow(1.0 - clamp(dot(viewDir, normalize(vNormal)), 0.0, 1.0), uFresnelPower);
  
  // Dégradé de couleur basé sur l'élévation
  float elevation = vWorldPosition.y;
  float troughFactor = smoothstep(uTroughThreshold - uTroughTransition, uTroughThreshold + uTroughTransition, elevation);
  float peakFactor = smoothstep(uPeakThreshold - uPeakTransition, uPeakThreshold + uPeakTransition, elevation);
  
  vec3 baseColor = mix(uTroughColor, uSurfaceColor, troughFactor);
  baseColor = mix(baseColor, uPeakColor, peakFactor);
  
  // Mélange final avec la réflexion
  vec3 finalColor = mix(baseColor, reflectedColor, fresnel);
  
  gl_FragColor = vec4(finalColor, uOpacity);
}
