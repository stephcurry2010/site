import '../styles/main.css';
import { initFire } from './fire.js';
import { initNavigation } from './navigate.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Everything scoped to one <main>. Runs on first load and again after every
// swapped-in page (navigate.js). Returns a cleanup for the swap-out.
function initPage(main) {
  const cleanups = [];

  // Fire canvases: hero (home) or band (sub-page headers)
  main.querySelectorAll('canvas[data-fire]').forEach((canvas) => {
    const destroy = initFire(canvas, { mode: canvas.dataset.fire });
    if (destroy) cleanups.push(destroy);
  });

  // Scroll reveals — content is visible by default; entering the viewport
  // plays a one-shot entrance animation. Nothing is hidden pre-JS.
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    main.querySelectorAll('[data-reveal]').forEach((el) => {
      // Only animate elements that start below the fold — no flash on load.
      if (el.getBoundingClientRect().top > window.innerHeight) io.observe(el);
    });
    cleanups.push(() => io.disconnect());
  }

  // Contact form: no backend, so submitting drafts the message in the visitor's
  // own email app and says so. Input is never cleared, nothing sent silently.
  const mailtoForm = main.querySelector('form[data-mailto]');
  if (mailtoForm) {
    const status = mailtoForm.querySelector('.form__status');
    mailtoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(mailtoForm);
      const email = mailtoForm.dataset.mailto;
      // The recipient comes from build-time config; don't build a mailto: URL
      // around a malformed or missing value.
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (status) {
          status.textContent =
            'The contact address is misconfigured. Use the email in the "Direct lines" panel instead.';
          status.hidden = false;
        }
        return;
      }
      const subject = `[${data.get('topic')}] ${data.get('name')} via the website`;
      const body = `${data.get('message')}\n\nFrom: ${data.get('name')} <${data.get('email')}>`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (status) {
        status.textContent = `Your email app should now have the message drafted. Hit send there and it's on its way. If nothing opened, email us directly: ${email}`;
        status.hidden = false;
      }
    });
  }

  return () => {
    for (const fn of cleanups) fn();
  };
}

const firstMain = document.querySelector('main');
if (firstMain) firstMain._cleanup = initPage(firstMain);

// Nav overflow: fade affordances while links sit off-screen, and start with
// the current page's link in view on narrow screens. The nav survives page
// swaps, so this runs exactly once.
const linkRow = document.querySelector('.nav__links');
if (linkRow) {
  const navEl = linkRow.closest('nav');
  const updateFades = () => {
    const max = linkRow.scrollWidth - linkRow.clientWidth;
    navEl.classList.toggle('nav-fade-left', linkRow.scrollLeft > 4);
    navEl.classList.toggle('nav-fade-right', linkRow.scrollLeft < max - 4);
  };
  linkRow.addEventListener('scroll', updateFades, { passive: true });
  window.addEventListener('resize', updateFades);
  updateFades();

  const current = linkRow.querySelector('a[aria-current="page"]');
  if (current) {
    const delta =
      current.getBoundingClientRect().left -
      linkRow.getBoundingClientRect().left -
      (linkRow.clientWidth - current.offsetWidth) / 2;
    linkRow.scrollLeft += delta;
  }
}

// Footer year
const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

// Toast-pop transitions between pages
initNavigation(initPage);
