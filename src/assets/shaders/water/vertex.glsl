precision highp float;

uniform float uTime;
uniform float uWavesAmplitude;
uniform float uWavesFrequency;
uniform float uWavesSpeed;
uniform float uWavesPersistence;
uniform float uWavesLacunarity;
uniform float uWavesIterations;

varying float vElevation;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  float amplitude = 1.0;
  float frequency = uWavesFrequency;
  float elevation = 0.0;
  
  for (float i = 0.0; i < uWavesIterations; i++) {
    float angle = i * 1.5708;
    vec2 offset = vec2(cos(angle), sin(angle)) * uTime * (uWavesSpeed * (0.8 + 0.3 * sin(i * 17.0)));
    
    vec2 noiseCoord = modelPosition.xz * frequency + offset + i * 100.0;
    
    elevation += snoise(noiseCoord) * amplitude;
    
    amplitude *= uWavesPersistence;
    frequency *= uWavesLacunarity;
  }
  
  elevation *= uWavesAmplitude;
  modelPosition.y += elevation;
  vElevation = elevation;
  
  gl_Position = projectionMatrix * viewMatrix * modelPosition;
}

