// Three.js fire scene — hero mode (flame field + embers) or band mode
// (embers only, for sub-page headers). Renders in clip space with a
// pass-through camera; the shaders own everything.
import {
  WebGLRenderer,
  Scene,
  Camera,
  Mesh,
  PlaneGeometry,
  Points,
  BufferGeometry,
  BufferAttribute,
  ShaderMaterial,
  AdditiveBlending,
  NormalBlending,
  Vector2,
} from 'three';

import fireVert from '../shaders/fire.vert?raw';
import fireFrag from '../shaders/fire.frag?raw';
import embersVert from '../shaders/embers.vert?raw';
import embersFrag from '../shaders/embers.frag?raw';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initFire(canvas, { mode = 'hero' } = {}) {
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  } catch {
    canvas.remove(); // no WebGL: the CSS gradient fallback behind it carries
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new Scene();
  const camera = new Camera(); // identity — shaders work in clip space

  const res = new Vector2(1, 1);
  const materials = [];

  if (mode === 'hero') {
    const fireMat = new ShaderMaterial({
      vertexShader: fireVert,
      fragmentShader: fireFrag,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: res },
        uIntensity: { value: 1.0 },
      },
      transparent: true,
      blending: NormalBlending,
      depthWrite: false,
      depthTest: false,
    });
    scene.add(new Mesh(new PlaneGeometry(2, 2), fireMat));
    materials.push(fireMat);
  }

  // Ember field — hero gets a denser swarm than sub-page bands.
  const count = mode === 'hero' ? 160 : 70;
  const seeds = new Float32Array(count * 3);
  // Deterministic-ish scatter, no Math.random needed at render time.
  for (let i = 0; i < count; i++) {
    seeds[i * 3] = ((i * 0.618034) % 1);           // lane
    seeds[i * 3 + 1] = ((i * 0.754877) % 1);       // phase
    seeds[i * 3 + 2] = ((i * 0.421731) % 1);       // size/speed
  }
  const emberGeo = new BufferGeometry();
  emberGeo.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
  emberGeo.setAttribute('aSeed', new BufferAttribute(seeds, 3));
  const emberMat = new ShaderMaterial({
    vertexShader: embersVert,
    fragmentShader: embersFrag,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uRes: { value: res },
    },
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  });
  const embers = new Points(emberGeo, emberMat);
  embers.frustumCulled = false;
  scene.add(embers);
  materials.push(emberMat);

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    res.set(w, h);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let start = performance.now();
  function renderFrame(now) {
    const t = (now - start) / 1000;
    for (const m of materials) m.uniforms.uTime.value = t;
    renderer.render(scene, camera);
  }

  // Reduced motion: render exactly one warm frame and stop.
  if (reducedMotion.matches) {
    renderFrame(start + 4200);
    return;
  }

  // Animate only while on-screen and the tab is visible.
  let rafId = null;
  const loop = (now) => {
    renderFrame(now);
    rafId = requestAnimationFrame(loop);
  };
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && rafId === null) {
      rafId = requestAnimationFrame(loop);
    } else if (!entry.isIntersecting && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && rafId === null) {
      io.disconnect();
      io.observe(canvas); // re-check intersection on return
    }
  });
}
