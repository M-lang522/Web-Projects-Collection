// ===================================================================
// VELOCITÀ — scroll interactions
// ===================================================================

(function(){
  const pages = Array.from(document.querySelectorAll('.page'));
  const railDots = Array.from(document.querySelectorAll('.rail__dot'));
  const revealEls = Array.from(document.querySelectorAll('.reveal, .reveal-line, .spec-row'));
  const chassisLine = document.querySelector('.chassis-line');

  // ---------- Reveal on scroll ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Stagger children within hero / contact reveal-lines
  document.querySelectorAll('.hero__title, .contact__title').forEach(title => {
    const lines = title.querySelectorAll('.reveal-line');
    lines.forEach((line, i) => {
      line.style.transitionDelay = `${i * 90}ms`;
    });
  });

  // ---------- Active page tracking (rail nav + chassis line) ----------
  const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5){
        const idx = pages.indexOf(entry.target);
        railDots.forEach(dot => dot.classList.remove('is-active'));
        if (railDots[idx]) railDots[idx].classList.add('is-active');

        // chassis line sweep position keyed to active page
        const pct = (idx / (pages.length - 1)) * 82; // leave headroom
        document.documentElement.style.setProperty('--chassis-pos', `${pct}%`);

        // activate spline preview only when its page is centered
        if (entry.target.classList.contains('page--preview')){
          entry.target.classList.add('is-active');
        }
      }
    });
  }, { threshold: [0.5] });

  pages.forEach(p => pageObserver.observe(p));

  // ---------- Manual unlock button for the Spline preview ----------
  const unlockBtn = document.querySelector('.preview__unlock');
  const previewPage = document.querySelector('.page--preview');
  if (unlockBtn && previewPage){
    unlockBtn.addEventListener('click', () => {
      previewPage.classList.add('is-active');
    });
  }

  // ---------- Chassis line subtle continuous drift on scroll ----------
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking){
      window.requestAnimationFrame(() => {
        const scrollRatio = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        chassisLine.style.opacity = 0.35 + (scrollRatio * 0.3);
        ticking = false;
      });
      ticking = true;
    }
  });
})();
