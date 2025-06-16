varying float vAlpha;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  float soft = smoothstep(0.5, 0.4, dist);
  gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * soft);
}
