/* =========================================================
   GOLDISTIC — Interactions
   - Scroll-triggered reveal (fade + slide up, 800ms)
   - Count-up statistics when scrolled into view
   - Spring / bounce on every button click
   - Sticky nav state on scroll
   ========================================================= */

(function () {
  'use strict';

  /* ---------- 1. Sticky nav state ---------- */
  const nav = document.querySelector('.nav');
  const onScrollNav = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- 2. Reveal: fade-in + slide-up ---------- */
  // Hand the data-delay attribute into a CSS custom property for transition-delay.
  document.querySelectorAll('.reveal[data-delay]').forEach((el) => {
    el.style.setProperty('--d', el.getAttribute('data-delay') + 'ms');
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target); // animate once
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // Hero: reveal headline lines once on load (it's above the fold)
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => {
      setTimeout(() => hero.classList.add('is-in'), 80);
    });
  }

  /* ---------- 3. Count-up statistics ---------- */
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const value = Math.round(easeOutCubic(p) * target);
      el.textContent = value + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  }

  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-num').forEach((el) => countObserver.observe(el));

  /* ---------- 4. Spring / bounce on button click ---------- */
  document.querySelectorAll('.spring').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // For anchor buttons, allow the spring to play before navigation
      const href = btn.getAttribute('href');
      const isHash = href && href.startsWith('#');

      if (isHash && !prefersReduced) {
        e.preventDefault();
        btn.classList.add('is-springing');
        const done = () => {
          btn.classList.remove('is-springing');
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          btn.removeEventListener('animationend', done);
        };
        btn.addEventListener('animationend', done);
      } else {
        btn.classList.add('is-springing');
        const done = () => {
          btn.classList.remove('is-springing');
          btn.removeEventListener('animationend', done);
        };
        btn.addEventListener('animationend', done);
      }
    });
  });

  /* ---------- 5. Subtle parallax on the hero floating shape ---------- */
  if (!prefersReduced) {
    const shape = document.querySelector('.hero-shape');
    if (shape) {
      let raf = null;
      window.addEventListener(
        'mousemove',
        (e) => {
          if (raf) return;
          raf = requestAnimationFrame(() => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            const dx = (e.clientX - cx) / cx;
            const dy = (e.clientY - cy) / cy;
            shape.style.transform = `translate(calc(-50% + ${dx * 18}px), calc(-52% + ${dy * 18}px))`;
            raf = null;
          });
        },
        { passive: true }
      );
    }
  }
})();
