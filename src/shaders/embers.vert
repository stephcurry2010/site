// Ember particles: each point owns a random seed; position is a pure
// function of (seed, time) so there is zero per-frame CPU work.
precision highp float;

uniform float uTime;
uniform float uPixelRatio;
uniform vec2 uRes;

attribute vec3 aSeed; // x: lane 0..1, y: phase 0..1, z: size/speed 0..1

varying float vHeat;   // 0 bottom -> 1 top, drives fade + color
varying float vSeed;

void main() {
  float speed = mix(0.05, 0.16, aSeed.z);
  // Loop each ember from below the bottom edge to above the top.
  float life = fract(aSeed.y + uTime * speed);
  float y = mix(-1.1, 1.15, life);

  // Sideways drift: slow sway + a jitter unique to the ember.
  float sway = sin(uTime * (0.6 + aSeed.z) + aSeed.y * 40.0) * 0.08;
  float x = (aSeed.x * 2.0 - 1.0) + sway;

  vHeat = life;
  vSeed = aSeed.y;

  gl_Position = vec4(x, y, 0.0, 1.0);
  float size = mix(2.0, 5.5, aSeed.z) * uPixelRatio;
  // Embers shrink as they rise and cool.
  gl_PointSize = size * mix(1.0, 0.35, life);
}
