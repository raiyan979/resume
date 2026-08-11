/* -------------------------------------------------------------
 * GLOBAL LOGIC & ANIMATIONS - PORTFOLIO RESUME
 * Frameworks: GSAP, ScrollTrigger, Lenis Smooth Scroll
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ============================================================
   * 1. LENIS SMOOTH SCROLL
   * ============================================================ */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', ScrollTrigger.update);

  /* ============================================================
   * 2. KINETIC HERO TITLE — staggered blur-to-focus reveal
   * ============================================================ */
  const titleEl = document.querySelector('.hero-title');
  if (titleEl) {
    const words = titleEl.textContent.trim().split(' ');
    titleEl.innerHTML = words.map(w =>
      `<span class="word">${w.split('').map(c => `<span class="char">${c}</span>`).join('')}</span>`
    ).join(' ');

    gsap.fromTo('.hero-title .char',
      { opacity: 0, y: 30, filter: 'blur(12px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.04, ease: 'power3.out', delay: 0.3 }
    );
  }

  /* ============================================================
   * 3. AMBIENT LIGHT ENGINE
   * ============================================================ */
  const ambientGlow = document.getElementById('ambient-glow');
  const glowMap = {
    hero:            { x: '30%', y: '30%', color: 'rgba(255,51,68,0.18)' },
    projects:        { x: '50%', y: '50%', color: 'rgba(255,51,68,0.28)' },
    experience:      { x: '30%', y: '70%', color: 'rgba(74,85,104,0.24)' },
    education:       { x: '30%', y: '70%', color: 'rgba(74,85,104,0.24)' },
    capabilities:    { x: '50%', y: '90%', color: 'rgba(255,51,68,0.20)' },
    extracurricular: { x: '50%', y: '90%', color: 'rgba(255,51,68,0.20)' },
    contact:         { x: '50%', y: '90%', color: 'rgba(255,51,68,0.20)' },
  };

  Object.entries(glowMap).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el || !ambientGlow) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%',
      onEnter:     () => gsap.to(ambientGlow, { background: `radial-gradient(circle at ${cfg.x} ${cfg.y}, ${cfg.color}, transparent 65%)`, duration: 1.2, ease: 'power2.out' }),
      onEnterBack: () => gsap.to(ambientGlow, { background: `radial-gradient(circle at ${cfg.x} ${cfg.y}, ${cfg.color}, transparent 65%)`, duration: 1.2, ease: 'power2.out' }),
    });
  });

  /* ============================================================
   * 4. CARD 3D MAGNETIC HOVER TILT
   * ============================================================ */
  document.querySelectorAll('.experience-card, .capability-card, .extracurricular-card, .education-card')
    .forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -7;
        const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  7;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 900, borderColor: 'rgba(255,51,68,0.25)', boxShadow: '0 0 25px rgba(255,51,68,0.15)', duration: 0.3, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, borderColor: 'rgba(255,255,255,0.05)', boxShadow: 'none', duration: 0.5, ease: 'power2.out' });
      });
    });

  /* ============================================================
   * 5. SCROLL-TRIGGERED SECTION REVEALS
   * ============================================================ */
  document.querySelectorAll('.section-header, .experience-group, .capability-card, .extracurricular-card, .education-card, .contact-container')
    .forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 45 }, {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

  /* ============================================================
   * 6. PROJECT BELT - continuous drifting carousel
   *
   *  - Cards ride a horizontal belt that drifts slowly and loops
   *    forever. The centre card is in focus; its neighbours shrink
   *    and fade out, while fresh cards fade in toward the centre.
   *  - Drift pauses while the visitor hovers, focuses or drags the
   *    belt, and via the Pause button; it stays off entirely under
   *    reduced-motion.
   *  - Drag, the arrows, the dots and the left/right arrow keys let
   *    the visitor move through the projects at will; letting go
   *    resumes the drift.
   * ============================================================ */
  (() => {
    const belt = document.querySelector('.belt');
    if (!belt) return;
    const viewport = belt.querySelector('.belt-viewport');
    const cards = Array.from(belt.querySelectorAll('.belt-card'));
    const dots = Array.from(belt.querySelectorAll('.belt-dot'));
    const prevBtn = belt.querySelector('.belt-prev');
    const nextBtn = belt.querySelector('.belt-next');
    const pauseBtn = belt.querySelector('.belt-pause');
    const TOTAL = cards.length;
    if (!viewport || !TOTAL) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DRIFT = 0.0035; // cards advanced per frame - deliberately slow

    const state = { pos: 0 };
    let gap = 0;
    let hovering = false;
    let dragging = false;
    let tweening = false;
    let userPaused = reduce;

    const wrap = (p) => ((p % TOTAL) + TOTAL) % TOTAL;

    const diffFor = (i) => {
      let d = (((i - state.pos) % TOTAL) + TOTAL) % TOTAL; // 0 .. TOTAL
      if (d > TOTAL / 2) d -= TOTAL;                       // -TOTAL/2 .. TOTAL/2
      return d;
    };

    const measure = () => { gap = (cards[0].offsetWidth || 400) * 0.82; };

    const render = () => {
      const front = wrap(Math.round(state.pos)); // the card nearest centre
      for (let i = 0; i < TOTAL; i++) {
        const d = diffFor(i);
        const ad = Math.abs(d);
        const x = d * gap;
        const scale = Math.max(0.62, 1 - ad * 0.16);
        const opacity = ad < 0.5 ? 1 : Math.max(0, 1 - (ad - 0.45) * 0.85);
        const blur = Math.min(6, ad * 2.2);
        const bri = Math.max(0.55, 1 - ad * 0.28);
        const card = cards[i];
        card.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = `blur(${blur.toFixed(2)}px) brightness(${bri.toFixed(2)})`;
        card.style.zIndex = String(Math.round(50 - ad * 10));
        card.style.pointerEvents = (i === front) ? 'auto' : 'none';
      }
      const active = front;
      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === active);
      }
    };

    const canDrift = () => !reduce && !userPaused && !hovering && !dragging && !tweening;
    const frame = () => {
      if (canDrift()) state.pos = wrap(state.pos + DRIFT);
      render();
      requestAnimationFrame(frame);
    };

    const snapTo = (target) => {
      if (reduce) { state.pos = wrap(target); render(); return; }
      tweening = true;
      gsap.to(state, {
        pos: target, duration: 0.6, ease: 'power3.out',
        onUpdate: render,
        onComplete: () => { state.pos = wrap(state.pos); tweening = false; },
      });
    };
    const step = (dir) => snapTo(Math.round(state.pos) + dir);
    const goTo = (i) => {
      let target = i;
      while (target - state.pos >  TOTAL / 2) target -= TOTAL;
      while (target - state.pos < -TOTAL / 2) target += TOTAL;
      snapTo(target);
    };

    // Drag to scroll through the projects
    let dragId = null, dragStartX = 0, dragStartPos = 0, moved = false;
    viewport.addEventListener('pointerdown', (e) => {
      dragging = true; moved = false; dragId = e.pointerId;
      dragStartX = e.clientX; dragStartPos = state.pos;
      gsap.killTweensOf(state); tweening = false;
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!dragging || e.pointerId !== dragId) return;
      const dx = e.clientX - dragStartX;
      if (!moved && Math.abs(dx) > 8) {
        moved = true;
        // Capture the pointer only once a real drag begins, so a plain click
        // on a card's link is never swallowed by the viewport.
        if (viewport.setPointerCapture) viewport.setPointerCapture(e.pointerId);
      }
      if (moved) state.pos = dragStartPos - dx / gap;
    });
    const endDrag = (e) => {
      if (!dragging || e.pointerId !== dragId) return;
      dragging = false; dragId = null;
      snapTo(Math.round(state.pos)); // settle on the nearest card, then drift resumes
    };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    // Swallow the click that follows a drag so links do not fire mid-swipe
    viewport.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // Pause the drift while the visitor is engaged with the belt
    belt.addEventListener('pointerenter', () => { hovering = true; });
    belt.addEventListener('pointerleave', () => { hovering = false; });
    belt.addEventListener('focusin', () => { hovering = true; });
    belt.addEventListener('focusout', () => { hovering = false; });

    if (prevBtn) prevBtn.addEventListener('click', () => step(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => step(1));
    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click', () => goTo(i));
    }
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });

    if (pauseBtn) {
      if (reduce) {
        pauseBtn.style.display = 'none';
      } else {
        const PAUSE = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
        const PLAY = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
        const sync = () => {
          pauseBtn.innerHTML = (userPaused ? PLAY : PAUSE) + '<span>' + (userPaused ? 'Play' : 'Pause') + '</span>';
          pauseBtn.setAttribute('aria-pressed', String(userPaused));
          pauseBtn.setAttribute('aria-label', userPaused ? 'Resume auto-scroll' : 'Pause auto-scroll');
        };
        pauseBtn.addEventListener('click', () => { userPaused = !userPaused; sync(); });
        sync();
      }
    }

    measure();
    window.addEventListener('resize', () => { measure(); render(); });
    render();
    requestAnimationFrame(frame);
  })();

  /* ============================================================
   * 7. EXPERIENCE TIMELINE — dual group scroll fills
   * ============================================================ */
  document.querySelectorAll('.experience-layout').forEach(layout => {
    const list = layout.querySelector('.experience-list');
    const fill = layout.querySelector('.timeline-line-fill');
    if (!list || !fill) return;

    gsap.fromTo(fill, { height: '0%' }, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: list, start: 'top 35%', end: 'bottom 55%', scrub: true }
    });

    layout.querySelectorAll('.experience-item').forEach(item => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 52%', end: 'bottom 48%',
        onEnter: () => item.classList.add('active-node'),
        onEnterBack: () => item.classList.add('active-node'),
        onLeave: () => item.classList.remove('active-node'),
        onLeaveBack: () => item.classList.remove('active-node'),
      });
    });
  });

  /* ============================================================
   * 8. SCROLLSPY NAV ACTIVE LINKS
   * ============================================================ */
  const navLinks = document.querySelectorAll('.nav-links a');
  document.querySelectorAll('section').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 35%', end: 'bottom 35%',
      onEnter:     () => setActive(sec.id),
      onEnterBack: () => setActive(sec.id),
    });
  });
  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  }

  /* ============================================================
   * 9. MOBILE HAMBURGER MENU
   * ============================================================ */
  const toggle = document.querySelector('.menu-toggle');
  const linksContainer = document.querySelector('.nav-links');
  if (toggle && linksContainer) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      linksContainer.classList.toggle('open');
    });
    linksContainer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        linksContainer.classList.remove('open');
      })
    );
  }

  /* ============================================================
   * 10. COPY-TO-CLIPBOARD EMAIL
   * ============================================================ */
  const copyBtn   = document.querySelector('.email-copy-btn');
  const emailText = document.querySelector('.email-display');
  const COPY_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const CHECK_SVG = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  if (copyBtn && emailText) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailText.innerText.trim()).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = CHECK_SVG;
        setTimeout(() => { copyBtn.classList.remove('copied'); copyBtn.innerHTML = COPY_SVG; }, 2200);
      });
    });
  }

  /* ============================================================
   * 11. BACK-TO-TOP BUTTON
   * ============================================================ */
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () =>
      backToTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.6)
    );
    backToTop.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.2 }));
  }
});
