// Procedural flame field: value-noise fbm scrolled upward, shaped so the
// fire hugs the bottom of the hero and licks up into the dark.
precision highp float;

uniform float uTime;
uniform vec2 uRes;
uniform float uIntensity;

varying vec2 vUv;

// --- value noise + fbm -----------------------------------------------------
float hash(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.55;
  // Rotate each octave to break up axis-aligned artifacts.
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p = rot * p * 2.05;
    amp *= 0.5;
  }
  return v;
}

// --- flame color ramp (matches the logo: red edge -> orange -> golden core)
vec3 fireRamp(float t) {
  vec3 scorch = vec3(0.55, 0.08, 0.02);  // red edges
  vec3 ember  = vec3(0.95, 0.35, 0.05);  // orange body
  vec3 flame  = vec3(1.00, 0.72, 0.20);  // golden core
  vec3 core   = vec3(1.00, 0.95, 0.78);  // near-white heart
  vec3 c = mix(scorch, ember, smoothstep(0.0, 0.45, t));
  c = mix(c, flame, smoothstep(0.45, 0.8, t));
  c = mix(c, core, smoothstep(0.8, 1.0, t));
  return c;
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.9;

  // Two layers of upward-scrolling turbulence, distorted by a slower field
  // so flame tongues bend sideways instead of rising in straight columns.
  vec2 warp = vec2(fbm(p * 2.2 + vec2(0.0, -t * 0.35)),
                   fbm(p * 2.2 + vec2(5.2, -t * 0.35)));
  float n = fbm(p * vec2(2.8, 3.6) + (warp - 0.5) * 0.9 + vec2(0.0, -t));

  // Vertical shaping: strong at the bottom, gone by ~65% height.
  float shape = pow(clamp(1.0 - uv.y * 1.45, 0.0, 1.0), 1.35);
  // Ragged top edge so the cutoff never reads as a straight line.
  float edge = fbm(vec2(p.x * 3.0, t * 0.6)) * 0.22;
  float fire = n * (shape + edge) * uIntensity;

  float lum = smoothstep(0.18, 0.95, fire);
  vec3 col = fireRamp(lum);

  // Alpha lifts off gently so the flames melt into the charcoal bg.
  float alpha = smoothstep(0.14, 0.55, fire);
  gl_FragColor = vec4(col, alpha);
}
