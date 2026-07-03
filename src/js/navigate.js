// Toast-pop page transitions. Internal navigations are intercepted: the next
// page's HTML is fetched (usually already prefetched on hover), only <main> is
// swapped, and the swap is staged as a toaster cycle — the old page presses
// down like the lever, ejects up out of frame, and the new page drops into the
// slot from above. Nav, footer, and document stay alive the whole time.
//
// Everything degrades: no JS or a failed fetch falls back to a normal
// navigation (the CSS cross-document view-transition covers that path), and
// prefers-reduced-motion swaps instantly with no animation.

const EJECT_MS = 310;
const pages = new Map(); // pathname -> { title, description, mainHTML } | Promise

let initPage = null; // per-page initializer from main.js
let navToken = 0; // stale async guard: only the latest navigation may swap

const normalize = (pathname) => pathname.replace(/\/index\.html$/, '/');

// Only intercept plain left-clicks on same-origin page links.
function interceptableLink(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }
  const link = event.target.closest('a[href]');
  if (
    !link ||
    link.origin !== location.origin ||
    link.target ||
    link.hasAttribute('download') ||
    !(link.pathname === '/' || link.pathname.endsWith('.html'))
  ) {
    return null;
  }
  // Same-page hash jumps (skip link) stay native.
  if (normalize(link.pathname) === normalize(location.pathname)) {
    if (link.hash) return null;
    return { link, samePage: true };
  }
  return { link, samePage: false };
}

function getPage(pathname) {
  const key = normalize(pathname);
  if (pages.has(key)) return Promise.resolve(pages.get(key));
  const load = fetch(pathname, { signal: AbortSignal.timeout?.(4000) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const main = doc.querySelector('main');
      if (!main) throw new Error('no <main>');
      const page = {
        title: doc.title,
        description:
          doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
        mainHTML: main.outerHTML,
      };
      pages.set(key, page);
      return page;
    })
    .catch((err) => {
      pages.delete(key); // let a click retry / hard-navigate
      throw err;
    });
  pages.set(key, load);
  return load;
}

function updateNav(pathname) {
  const path = normalize(pathname);
  document.querySelectorAll('.nav__links a').forEach((a) => {
    if (normalize(a.pathname) === path) {
      a.setAttribute('aria-current', 'page');
      // Keep the active link in view on narrow screens (same move as first load).
      const row = a.closest('.nav__links');
      const delta =
        a.getBoundingClientRect().left -
        row.getBoundingClientRect().left -
        (row.clientWidth - a.offsetWidth) / 2;
      row.scrollBy({ left: delta, behavior: 'smooth' });
    } else {
      a.removeAttribute('aria-current');
    }
  });
}

function finishEject(main) {
  if (!main.isConnected) return;
  main._cleanup?.();
  main.remove();
}

async function navigateTo(url, { push = true, scrollY = 0 } = {}) {
  const token = ++navToken;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Force-finish any exit still mid-flight (rapid clicks: latest wins).
  document.querySelectorAll('main.main-eject').forEach(finishEject);

  const oldMain = document.querySelector('main:not(.main-eject)');
  if (!oldMain) {
    location.assign(url.href);
    return;
  }

  // Remember where this entry was scrolled to before leaving it.
  history.replaceState({ scrollY: window.scrollY }, '', location.href);
  if (push) history.pushState({ scrollY: 0 }, '', url.href);

  const load = getPage(url.pathname);

  if (!reduced) {
    // Freeze the old page exactly where it sits and start the toaster cycle.
    // Its fire keeps rendering during the eject; cleanup runs on removal.
    oldMain.style.top = `${oldMain.getBoundingClientRect().top}px`;
    oldMain.classList.add('main-eject');
    oldMain.addEventListener('animationend', (e) => {
      if (e.target === oldMain && e.animationName === 'toast-eject') finishEject(oldMain);
    });
    // Hidden tabs pause CSS animations; don't let a ghost <main> linger.
    setTimeout(() => finishEject(oldMain), EJECT_MS + 400);
  }

  let page;
  try {
    page = await load;
  } catch {
    location.assign(url.href); // network/404/timeout: real navigation wins
    return;
  }
  if (token !== navToken) return; // a newer navigation took over

  const holder = document.createElement('div');
  holder.innerHTML = page.mainHTML;
  const newMain = holder.firstElementChild;

  document.title = page.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', page.description);

  if (reduced) {
    oldMain._cleanup?.();
    oldMain.replaceWith(newMain);
  } else {
    oldMain.after(newMain);
    newMain.classList.add('main-enter');
    newMain.addEventListener('animationend', (e) => {
      if (e.target === newMain && e.animationName === 'bread-drop') {
        newMain.classList.remove('main-enter');
      }
    });
  }

  window.scrollTo(0, scrollY);
  updateNav(url.pathname);
  newMain._cleanup = initPage(newMain);
  newMain.focus({ preventScroll: true });
}

export function initNavigation(pageInitializer) {
  if (!('fetch' in window) || !('DOMParser' in window)) return;
  initPage = pageInitializer;
  history.scrollRestoration = 'manual';
  history.replaceState({ scrollY: window.scrollY }, '', location.href);

  document.addEventListener('click', (event) => {
    const hit = interceptableLink(event);
    if (!hit) return;
    event.preventDefault();
    if (hit.samePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigateTo(new URL(hit.link.href));
  });

  // Warm the cache the moment intent shows: hover or keyboard focus.
  const prefetch = (event) => {
    const link = event.target.closest?.(
      'a[href]:not([target]):not([download])'
    );
    if (
      link &&
      link.origin === location.origin &&
      (link.pathname === '/' || link.pathname.endsWith('.html')) &&
      normalize(link.pathname) !== normalize(location.pathname)
    ) {
      getPage(link.pathname).catch(() => {});
    }
  };
  document.addEventListener('mouseover', prefetch, { passive: true });
  document.addEventListener('focusin', prefetch, { passive: true });

  window.addEventListener('popstate', (event) => {
    navigateTo(new URL(location.href), {
      push: false,
      scrollY: event.state?.scrollY ?? 0,
    });
  });
}
