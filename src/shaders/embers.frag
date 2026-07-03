precision highp float;

varying float vHeat;
varying float vSeed;

void main() {
  // Soft round sprite.
  vec2 d = gl_PointCoord - 0.5;
  float m = smoothstep(0.5, 0.12, length(d));

  // Hot golden at birth, cooling to dim red, flicker per-ember.
  vec3 hot = vec3(1.0, 0.75, 0.25);
  vec3 cool = vec3(0.7, 0.16, 0.04);
  vec3 col = mix(hot, cool, smoothstep(0.1, 0.9, vHeat));
  float flicker = 0.75 + 0.25 * sin(vHeat * 60.0 + vSeed * 90.0);

  // Fade in at the bottom, out near the top.
  float fade = smoothstep(0.0, 0.08, vHeat) * (1.0 - smoothstep(0.6, 1.0, vHeat));
  gl_FragColor = vec4(col, m * fade * flicker);
}
