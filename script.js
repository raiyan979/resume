// ============================================================
// DOM CACHE — all queries happen once at startup
// ============================================================
const elements = {
    glow: document.querySelector('.cursor-glow'),
    logo: document.querySelector('.logo'),
    sections: document.querySelectorAll('section'),
    heroChildren: document.querySelectorAll('.hero-content > *'),
    heroVisual: document.querySelector('.hero-visual'),
    gradientText: document.querySelector('.gradient-text'),
    glassCardP: document.querySelector('.glass-card p'),
    particlesContainer: document.querySelector('.particles-container'),
    sectionTitles: document.querySelectorAll('.section-title'),
    experienceSection: document.querySelector('#experience'),
    experienceList: document.querySelector('.experience-list'),
    experienceItems: document.querySelectorAll('.exp-item'),
    projectGrid: document.querySelector('.project-grid'),
    projectCards: document.querySelectorAll('.project-card'),
    skillItems: document.querySelectorAll('.skill-item'),
    aboutCard: document.querySelector('.about-card'),
    statNumbers: document.querySelectorAll('.number'),
    contactSection: document.querySelector('#contact'),
    contactChildren: document.querySelectorAll('.contact-section > *'),
    footer: document.querySelector('footer'),
    socialIcons: document.querySelectorAll('.socials a'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    navLinks: document.querySelector('.nav-links'),
    navLinksItems: document.querySelectorAll('.nav-links a'),
    cursorDot: document.querySelector('.cursor-dot'),
    scrollIndicator: document.querySelector('.scroll-indicator'),
    statsCards: document.querySelectorAll('.stat'),
    missionTrack: document.getElementById('mission-files-track'),
    missionPrevBtn: document.querySelector('.mission-nav-btn--prev'),
    missionNextBtn: document.querySelector('.mission-nav-btn--next'),
    missionProgressBar: document.querySelector('.mission-files-progress__bar'),
    missionCounterCurrent: document.querySelector('.mission-files-counter__current'),
    missionModalOverlay: document.getElementById('mission-modal-overlay'),
    missionModal: document.getElementById('mission-modal'),
    modalObjTag: document.getElementById('modal-obj-tag'),
    modalTitle: document.getElementById('modal-title'),
    modalStackDisplay: document.getElementById('modal-stack-display'),
    modalBody: document.getElementById('modal-body'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalFooterClose: document.getElementById('modal-footer-close')
};

// ============================================================
// CURSOR GLOW — LERP-based rAF (untouched)
// ============================================================
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let currentX = mouseX;
let currentY = mouseY;
const LERP = 0.12;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
}, { passive: true });

function glowLoop() {
    currentX += (mouseX - currentX) * LERP;
    currentY += (mouseY - currentY) * LERP;
    if (elements.glow) {
        elements.glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(glowLoop);
}
glowLoop();

// ============================================================
// CURSOR DOT — Fast LERP (0.4)
// ============================================================
let dotX = window.innerWidth / 2;
let dotY = window.innerHeight / 2;
const DOT_LERP = 0.4;

function dotLoop() {
    dotX += (mouseX - dotX) * DOT_LERP;
    dotY += (mouseY - dotY) * DOT_LERP;
    if (elements.cursorDot) {
        elements.cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(dotLoop);
}
dotLoop();

// Cursor Hover Effects (Delegated)
document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button')) {
        elements.cursorDot?.classList.add('expanded');
    }
}, { passive: true });

document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button')) {
        elements.cursorDot?.classList.remove('expanded');
    }
}, { passive: true });

// ============================================================
// SAFETY FALLBACK — force-visible after 3s (untouched)
// ============================================================
setTimeout(() => {
    document.querySelectorAll(
        '.hero-content > *, .hero-visual, .section-title, .exp-item, ' +
        '.project-card, .skill-item, .about-card, .contact-section > *, ' +
        '.socials a, footer'
    ).forEach(el => {
        if (getComputedStyle(el).opacity === '0') {
            el.style.opacity = '1';
            el.style.transform = 'none';
        }
    });
}, 3000);

// ============================================================
// DEEP SPACE STAR FIELD
// ============================================================
function buildStarField() {
    const container = elements.particlesContainer;
    if (!container) return;
    const fragment = document.createDocumentFragment();
    const stars = [];
    const total = 220;

    for (let i = 0; i < total; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Size: mostly tiny, some medium, few large
        const sizeRoll = Math.random();
        const size = sizeRoll < 0.7 ? (Math.random() * 1.5 + 0.5) // 0.5–2px tiny
            : sizeRoll < 0.93 ? (Math.random() * 1.5 + 2)  // 2–3.5px medium
                : (Math.random() * 2 + 3.5);                   // 3.5–5.5px large
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // Position: random across full viewport
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Initial opacity
        star.style.opacity = (Math.random() * 0.6 + 0.2).toString();

        // Colour variety
        const colourRoll = Math.random();
        if (colourRoll < 0.07) star.classList.add('blue');
        else if (colourRoll < 0.13) star.classList.add('cyan');
        else if (colourRoll < 0.17) star.classList.add('warm');

        fragment.appendChild(star);
        stars.push(star);
    }
    container.appendChild(fragment);

    // Cache in elements object
    elements.stars = stars;

    // --- TWINKLE ANIMATION: 60 random stars ---
    const twinklers = [...stars].sort(() => Math.random() - 0.5).slice(0, 60);
    twinklers.forEach(star => {
        anime({
            targets: star,
            opacity: [
                { value: parseFloat(star.style.opacity) },
                { value: Math.random() * 0.7 + 0.1 },
                { value: parseFloat(star.style.opacity) }
            ],
            duration: Math.random() * 2000 + 1000,
            loop: true,
            easing: 'easeInOutSine',
            delay: Math.random() * 3000
        });
    });

    // --- SLOW DRIFT: 40 random stars ---
    const drifters = [...stars].sort(() => Math.random() - 0.5).slice(0, 40);
    drifters.forEach(star => {
        anime({
            targets: star,
            translateX: (Math.random() - 0.5) * 20,
            translateY: (Math.random() - 0.5) * 20,
            duration: Math.random() * 6000 + 5000,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutQuad',
            delay: Math.random() * 4000
        });
    });

    // --- PULSE: 25 large/bright stars only ---
    const pulsers = stars.filter(s => parseFloat(s.style.width) > 3).slice(0, 25);
    pulsers.forEach(star => {
        anime({
            targets: star,
            scale: [1, 2.2],
            opacity: [parseFloat(star.style.opacity), 0.1],
            duration: Math.random() * 2000 + 2500,
            loop: true,
            direction: 'alternate',
            easing: 'easeInOutSine',
            delay: Math.random() * 5000
        });
    });
}
buildStarField();

// ============================================================
// PAGE LOAD — DOMContentLoaded animations
// ============================================================
document.addEventListener('DOMContentLoaded', () => {

    // Nav logo entrance
    anime({
        targets: elements.logo,
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 200
    });

    // Desktop nav links entrance
    anime({
        targets: elements.navLinksItems,
        opacity: [0, 1],
        translateY: [-10, 0],
        delay: anime.stagger(80, { start: 400 }),
        duration: 500,
        easing: 'easeOutExpo'
    });

    // Hero content stagger
    anime({
        targets: elements.heroChildren,
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(120, { start: 200 }),
        duration: 900,
        easing: 'easeOutExpo'
    });

    // Hero visual (profile photo side)
    anime({
        targets: elements.heroVisual,
        opacity: [0, 1],
        translateX: [30, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 500
    });

    // Profile orbit animations for the new inner/outer dots
    function startOrbitAnimations() {
        function orbitDot(dotClass, radiusPx, durationMs, clockwise) {
            const dot = document.querySelector(dotClass);
            if (!dot) return;
            const obj = { angle: Math.random() * 360 }; // random start angle
            anime({
                targets: obj,
                angle: clockwise ? '+=360' : '-=360',
                duration: durationMs,
                loop: true,
                easing: 'linear',
                update: () => {
                    const rad = (obj.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * radiusPx;
                    const y = Math.sin(rad) * radiusPx;
                    dot.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
                }
            });
        }
        // Inner dot orbits at radius = (250/2 + 28) = 153px, period 5s, clockwise
        orbitDot('.orbit-dot--inner', 153, 5000, true);
        // Outer dot orbits at radius = (250/2 + 56) = 181px, period 9s, counter-clockwise
        orbitDot('.orbit-dot--outer', 181, 9000, false);
    }
    startOrbitAnimations();

    // Scroll Indicator Entrance & Bounce
    if (elements.scrollIndicator) {
        anime({
            targets: elements.scrollIndicator,
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutExpo',
            delay: 2200
        });

        // Hide on scroll
        const hideScrollIndicator = () => {
            anime({ targets: elements.scrollIndicator, opacity: 0, duration: 400, easing: 'easeOutQuad' });
            window.removeEventListener('scroll', hideScrollIndicator);
        };
        window.addEventListener('scroll', hideScrollIndicator, { passive: true });
    }

    // FEATURE 6 — "Raiyan" letter-by-letter 3D flip
    if (elements.gradientText) {
        const originalText = elements.gradientText.textContent.trim();
        elements.gradientText.innerHTML = '';
        [...originalText].forEach(char => {
            const span = document.createElement('span');
            // Preserve spaces
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            elements.gradientText.appendChild(span);
        });
        anime({
            targets: '.gradient-text span',
            opacity: [0, 1],
            translateY: [20, 0],
            rotateX: [90, 0],
            delay: anime.stagger(60, { start: 800 }),
            duration: 600,
            easing: 'easeOutExpo'
        });
    }

    // FEATURE 3 — Typewriter effect on glass card
    if (elements.glassCardP) {
        // Build HTML with colour segments preserved
        const segments = [
            { cls: 'keyword', text: 'const' },
            { cls: '', text: ' ' },
            { cls: 'variable', text: 'currentTask' },
            { cls: '', text: ' = ' },
            { cls: 'string', text: "'Building the future'" },
            { cls: '', text: ';' },
        ];
        elements.glassCardP.innerHTML = '';
        const allCharSpans = [];
        segments.forEach(seg => {
            if (seg.cls) {
                // Wrap each char inside coloured span
                const colourSpan = document.createElement('span');
                colourSpan.className = seg.cls;
                [...seg.text].forEach(ch => {
                    const s = document.createElement('span');
                    s.textContent = ch;
                    s.style.opacity = '0';
                    colourSpan.appendChild(s);
                    allCharSpans.push(s);
                });
                elements.glassCardP.appendChild(colourSpan);
            } else {
                [...seg.text].forEach(ch => {
                    const s = document.createElement('span');
                    s.textContent = ch;
                    s.style.opacity = '0';
                    elements.glassCardP.appendChild(s);
                    allCharSpans.push(s);
                });
            }
        });
        anime({
            targets: allCharSpans,
            opacity: [0, 1],
            delay: anime.stagger(55, { start: 1200 }),
            duration: 1,
            easing: 'linear'
        });
    }
});

// ============================================================
// SCROLL REVEAL MANAGER (extended — keep structure intact)
// ============================================================
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const section = entry.target;

        // --- Section Title with underline draw ---
        const title = section.querySelector('.section-title');
        if (title) {
            anime({
                targets: title,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 700,
                easing: 'easeOutExpo',
                complete: () => { title.classList.add('title-animated'); }
            });
        }

        // FEATURE 4 — Experience Timeline (draw line → pop dots → slide cards)
        const expItems = section.querySelectorAll('.exp-item');
        if (expItems.length > 0) {
            // 1. Draw the vertical line
            if (elements.experienceList) {
                anime({
                    targets: elements.experienceList,
                    '--line-height': ['0%', '100%'], // CSS var trick won't work directly
                    duration: 800,
                    easing: 'easeOutQuart',
                    begin: () => {
                        // Animate via direct style on the ::before using a wrapper trick
                        // Since ::before can't be targeted directly, animate a data attribute
                        // We'll animate a hidden line element instead
                        const lineEl = elements.experienceList.querySelector('.timeline-line');
                        if (lineEl) {
                            anime({ targets: lineEl, scaleY: [0, 1], duration: 800, easing: 'easeOutQuart' });
                        }
                    }
                });
            }

            // 2. Slide cards in from right, staggered
            anime({
                targets: expItems,
                opacity: [0, 1],
                translateX: [40, 0],
                delay: anime.stagger(150, { start: 400 }),
                duration: 700,
                easing: 'easeOutExpo',
                complete: () => {
                    // 3. Pop in the circle dots after cards arrive
                    expItems.forEach(item => item.classList.add('border-animated'));
                }
            });
        }

        // --- Project cards stagger ---
        const cards = section.querySelectorAll('.project-card');
        if (cards.length > 0) {
            anime({
                targets: cards,
                opacity: [0, 1],
                translateX: [60, 0],
                delay: anime.stagger(100, { start: 100 }),
                duration: 700,
                easing: 'easeOutExpo'
            });

            // Hackathon Badge Entrance
            const badge = section.querySelector('.hackathon-badge');
            if (badge) {
                anime({
                    targets: badge,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    delay: 1600,
                    duration: 400,
                    easing: 'easeOutBack'
                });
            }

            // Personal Callout Pulse
            const calloutIcon = section.querySelector('.personal-callout i');
            if (calloutIcon) {
                anime({
                    targets: calloutIcon,
                    scale: [1, 1.4, 1],
                    duration: 600,
                    easing: 'easeOutBack',
                    delay: 2000
                });
            }
        }

        // --- Skill items: scale + stagger ---
        const skillItems = section.querySelectorAll('.skill-item');
        if (skillItems.length > 0) {
            anime({
                targets: skillItems,
                opacity: [0, 1],
                scale: [0.85, 1],
                delay: anime.stagger(50, { start: 200 }),
                duration: 500,
                easing: 'easeOutBack'
            });
            const skillsText = section.querySelectorAll('.skills-text > *');
            anime({
                targets: skillsText,
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(80, { start: 100 }),
                duration: 700,
                easing: 'easeOutQuart'
            });
        }

        // --- About card + count-up ---
        const aboutCard = section.querySelector('.about-card');
        if (aboutCard) {
            anime({
                targets: aboutCard,
                opacity: [0, 1],
                translateY: [40, 0],
                duration: 800,
                easing: 'easeOutQuart',
                complete: () => startCountUp()
            });
        }

        // --- Contact section ---
        const contactChildren = section.querySelectorAll('.contact-section > *');
        if (contactChildren.length > 0) {
            // FEATURE 7 — inject & animate contact-bg-pulse
            if (section.id === 'contact' && !section.querySelector('.contact-bg-pulse')) {
                const pulse = document.createElement('div');
                pulse.className = 'contact-bg-pulse';
                section.insertBefore(pulse, section.firstChild);
                // Ensure content sits above
                contactChildren.forEach(c => { c.style.position = 'relative'; c.style.zIndex = '1'; });
                anime({
                    targets: pulse,
                    scale: [0.8, 1.2],
                    opacity: [0.03, 0.1],
                    loop: true,
                    direction: 'alternate',
                    duration: 3000,
                    easing: 'easeInOutSine'
                });
            }
            anime({
                targets: contactChildren,
                opacity: [0, 1],
                translateY: [30, 0],
                delay: anime.stagger(100, { start: 100 }),
                duration: 700,
                easing: 'easeOutQuart'
            });
        }

        scrollObserver.unobserve(section);
    });
}, observerOptions);

elements.sections.forEach(section => scrollObserver.observe(section));

// Also observe experience section for timeline-line draw independently
// (handled within scrollObserver above via expItems check)

// Footer observer (separate, kept from before)
if (elements.footer) {
    const footerObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        anime({
            targets: elements.footer,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuart'
        });
        anime({
            targets: elements.socialIcons,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100, { start: 200 }),
            duration: 500,
            easing: 'easeOutBack'
        });
        footerObserver.unobserve(elements.footer);
    }, { threshold: 0.2 });
    footerObserver.observe(elements.footer);
}

// ============================================================
// ABOUT — COUNT-UP ANIMATION (untouched)
// ============================================================
let countUpDone = false;
function startCountUp() {
    if (countUpDone) return;
    countUpDone = true;

    const yearEl = [...elements.statNumbers].find(el => el.textContent.trim() === '2028');
    if (yearEl) {
        const yearObj = { val: 2020 };
        anime({
            targets: yearObj,
            val: 2028,
            round: 1,
            duration: 1200,
            easing: 'easeOutExpo',
            update: () => { yearEl.textContent = Math.floor(yearObj.val); }
        });
    }

    const linesEl = [...elements.statNumbers].find(el => el.textContent.trim() === '10k+');
    if (linesEl) {
        const linesObj = { val: 0 };
        anime({
            targets: linesObj,
            val: 10,
            round: 1,
            duration: 1400,
            easing: 'easeOutExpo',
            update: () => { linesEl.textContent = Math.floor(linesObj.val) + 'k+'; }
        });
    }
}

// ============================================================
// ABOUT — STATS CARDS HOVER
// ============================================================
elements.statsCards.forEach(stat => {
    stat.addEventListener('mouseenter', () => {
        anime({
            targets: stat,
            scale: 1.04,
            duration: 200,
            easing: 'easeOutBack'
        });
    }, { passive: true });

    stat.addEventListener('mouseleave', () => {
        anime({
            targets: stat,
            scale: 1,
            duration: 300,
            easing: 'easeOutExpo'
        });
    }, { passive: true });
});

// ============================================================
// LOGO GLITCH HOVER
// ============================================================
if (elements.logo) {
    elements.logo.addEventListener('mouseenter', () => {
        anime({
            targets: elements.logo,
            translateX: [0, -3, 3, -2, 2, 0],
            duration: 400,
            easing: 'easeInOutQuad'
        });
    });
}

// ============================================================
// FEATURE 1 — PROJECT CARDS: 3D Tilt + Scale + Image Zoom
// ============================================================
elements.projectCards.forEach(card => {
    const img = card.querySelector('.project-image');

    // Combined mousemove: CSS vars track + 3D tilt
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const mouseXr = e.clientX - rect.left;
        const mouseYr = e.clientY - rect.top;

        // CSS vars for any future gradient shader
        card.style.setProperty('--mouse-x', `${mouseXr}px`);
        card.style.setProperty('--mouse-y', `${mouseYr}px`);

        // 3D tilt angles
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((mouseYr - centerY) / centerY) * -8;
        const rotateY = ((mouseXr - centerX) / centerX) * 8;

        anime({
            targets: card,
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 150,
            easing: 'easeOutQuad'
        });
    }, { passive: true });

    card.addEventListener('mouseenter', () => {
        anime({
            targets: card,
            scale: 1.03,
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.35))',
            duration: 250,
            easing: 'easeOutQuad'
        });
        if (img) {
            anime({
                targets: img,
                backgroundSize: ['100% 100%', '110% 110%'],
                duration: 400,
                easing: 'easeOutQuad'
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        anime({
            targets: card,
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            filter: 'drop-shadow(0 0px 0px rgba(0,0,0,0))',
            duration: 400,
            easing: 'easeOutExpo'
        });
        if (img) {
            anime({
                targets: img,
                backgroundSize: ['110% 110%', '100% 100%'],
                duration: 400,
                easing: 'easeOutQuad'
            });
        }
    });
});

// (Read More button behaviour replaced by initMissionModal below)

// ============================================================
// FEATURE 5 — SKILL ITEMS: Constellation Glow + Icon Scale
// ============================================================
elements.skillItems.forEach(item => {
    const icon = item.querySelector('.skill-btn-icon i');
    const statusText = item.querySelector('.skill-btn-status');

    item.addEventListener('mouseenter', () => {
        item.classList.add('hovered');
        if (statusText) statusText.textContent = 'ENGAGED';
        if (icon) {
            anime({
                targets: icon,
                scale: [1, 1.2],
                rotate: [0, 8],
                duration: 250,
                easing: 'easeOutBack'
            });
        }
        anime({
            targets: item,
            translateY: -4,
            duration: 250,
            easing: 'easeOutQuad'
        });
    });

    item.addEventListener('mouseleave', () => {
        item.classList.remove('hovered');
        if (statusText) statusText.textContent = 'ONLINE';
        if (icon) {
            anime({
                targets: icon,
                scale: [1.2, 1],
                rotate: [8, 0],
                duration: 250,
                easing: 'easeOutBack'
            });
        }
        anime({
            targets: item,
            translateY: [-4, 0],
            duration: 250,
            easing: 'easeOutQuad'
        });
    });
});

// ============================================================
// FOOTER SOCIAL ICONS — hover rotate (untouched)
// ============================================================
elements.socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        anime({ targets: icon, rotate: 15, duration: 200, easing: 'easeOutBack' });
    });
    icon.addEventListener('mouseleave', () => {
        anime({ targets: icon, rotate: 0, duration: 200, easing: 'easeOutBack' });
    });
});

// ============================================================
// MOBILE MENU — height animation + stagger (untouched)
// ============================================================
let isMenuAnimating = false;

if (elements.mobileMenuBtn) {
    elements.mobileMenuBtn.addEventListener('click', () => {
        if (isMenuAnimating) return;
        const isOpened = elements.navLinks.classList.contains('active');

        if (!isOpened) {
            elements.navLinks.classList.add('active');
            elements.navLinks.style.height = 'auto';
            const targetHeight = elements.navLinks.scrollHeight;
            elements.navLinks.style.height = '0px';
            isMenuAnimating = true;
            anime({
                targets: elements.navLinks,
                height: [0, targetHeight],
                duration: 380,
                easing: 'easeOutQuart',
                complete: () => {
                    elements.navLinks.style.height = 'auto';
                    isMenuAnimating = false;
                }
            });
            anime({
                targets: elements.navLinksItems,
                opacity: [0, 1],
                translateX: [-20, 0],
                delay: anime.stagger(60, { start: 80 }),
                duration: 400,
                easing: 'easeOutQuart'
            });
            elements.mobileMenuBtn.innerHTML = `<i data-lucide="x"></i>`;
        } else {
            isMenuAnimating = true;
            const currentHeight = elements.navLinks.scrollHeight;
            elements.navLinks.style.height = currentHeight + 'px';
            anime({
                targets: elements.navLinksItems,
                opacity: [1, 0],
                translateX: [0, -20],
                delay: anime.stagger(40, { direction: 'reverse' }),
                duration: 250,
                easing: 'easeInQuart'
            });
            anime({
                targets: elements.navLinks,
                height: [currentHeight, 0],
                duration: 380,
                easing: 'easeInQuart',
                complete: () => {
                    elements.navLinks.classList.remove('active');
                    elements.navLinks.style.height = '';
                    isMenuAnimating = false;
                }
            });
            elements.mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
        }
        lucide.createIcons();
    });
}

elements.navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (elements.navLinks.classList.contains('active')) {
            elements.mobileMenuBtn.click();
        }
    }, { passive: true });
});

// ============================================================
// EMAIL — Copy to clipboard (UNTOUCHED)
// ============================================================
document.querySelectorAll('.email-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.getAttribute('data-email') || "raiyan.mirza1233@gmail.com";

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(() => {
                showToast("Email copied to clipboard!");
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast("Email copied to clipboard!");
        }
    });
});

// ============================================================
// TOAST (UNTOUCHED)
// ============================================================
function showToast(message) {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================================
// FEATURE: HORIZONTAL SCROLL MISSION FILES
// ============================================================
function initMissionFiles() {
    const track = elements.missionTrack;
    const prevBtn = elements.missionPrevBtn;
    const nextBtn = elements.missionNextBtn;
    const progressBar = elements.missionProgressBar;
    const counterCurrent = elements.missionCounterCurrent;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.project-card'));
    const totalCards = cards.length;
    let currentIndex = 0;
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;

    // --- PROGRESS BAR + COUNTER UPDATE ---
    function updateUI() {
        const maxScroll = track.scrollWidth - track.clientWidth;
        const progress = maxScroll > 0 ? (track.scrollLeft / maxScroll) * 100 : 0;
        if (progressBar) progressBar.style.width = progress + '%';

        // Determine which card is most visible
        let closest = 0;
        let closestDist = Infinity;
        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const trackRect = track.getBoundingClientRect();
            const dist = Math.abs(rect.left - trackRect.left);
            if (dist < closestDist) {
                closestDist = dist;
                closest = i;
            }
        });
        currentIndex = closest;
        if (counterCurrent) {
            counterCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
        }

        // Disable buttons at ends
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === totalCards - 1;
    }

    // --- SCROLL TO CARD ---
    function scrollToCard(index) {
        const card = cards[index];
        if (!card) return;
        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const offset = cardRect.left - trackRect.left + track.scrollLeft - 16;
        track.scrollTo({ left: offset, behavior: 'smooth' });
    }

    // --- ARROW BUTTON CLICK ---
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            scrollToCard(Math.max(0, currentIndex - 1));
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            scrollToCard(Math.min(totalCards - 1, currentIndex + 1));
        });
    }

    // --- SCROLL EVENT: update progress + counter ---
    track.addEventListener('scroll', updateUI, { passive: true });

    // --- DRAG TO SCROLL (mouse) ---
    let didDrag = false;
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        didDrag = false;
        startX = e.pageX - track.offsetLeft;
        scrollLeftStart = track.scrollLeft;
        track.classList.add('is-dragging');
    });

    track.addEventListener('mouseleave', () => {
        if (!isDown) return;
        isDown = false;
        track.classList.remove('is-dragging');
        // Snap to nearest card on drag end
        scrollToCard(currentIndex);
    });

    track.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        track.classList.remove('is-dragging');
        scrollToCard(currentIndex);
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeftStart - walk;
        if (Math.abs(track.scrollLeft - scrollLeftStart) > 5) didDrag = true;
        updateUI();
    });

    track.addEventListener('click', (e) => {
        if (didDrag) {
            e.stopPropagation();
            didDrag = false;
        }
    }, true); // capture phase so it fires before the button's own listener

    // --- TOUCH SWIPE (mobile) ---
    let touchStartX = 0;
    let touchScrollStart = 0;
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollStart = track.scrollLeft;
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
        const diff = touchStartX - e.touches[0].pageX;
        track.scrollLeft = touchScrollStart + diff;
        updateUI();
    }, { passive: true });
    track.addEventListener('touchend', () => {
        scrollToCard(currentIndex);
    }, { passive: true });

    // --- KEYBOARD NAVIGATION ---
    // When focus is inside the track, left/right arrows navigate cards
    track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            scrollToCard(Math.max(0, currentIndex - 1));
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            scrollToCard(Math.min(totalCards - 1, currentIndex + 1));
        }
    });

    // --- CARD HOVER: subtle float animation using Anime.js ---
    // Each card gently drifts upward 4px on hover and returns on leave
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (track.classList.contains('is-dragging')) return;
            anime({
                targets: card,
                translateY: -6,
                duration: 400,
                easing: 'easeOutQuad'
            });
        });
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                translateY: 0,
                duration: 400,
                easing: 'easeOutQuad'
            });
        });
    });

    // --- INITIAL STATE ---
    updateUI();

    // --- ENTRANCE ANIMATION ---
    // When the projects section scrolls into view, cards animate in
    // from the right, staggered, as if files sliding onto the desk
    // This is handled by the existing scrollObserver — but we also
    // run a secondary Anime.js entrance here for the track itself:
    anime({
        targets: '.mission-files-track-wrapper',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 700,
        easing: 'easeOutExpo',
        delay: 200
    });
}

initMissionFiles();

// ============================================================
// FEATURE: MISSION FILE MODAL
// ============================================================
function initMissionModal() {
    const overlay = elements.missionModalOverlay;
    const modal = elements.missionModal;
    const objTagEl = elements.modalObjTag;
    const titleEl = elements.modalTitle;
    const stackEl = elements.modalStackDisplay;
    const bodyEl = elements.modalBody;
    const closeBtn = elements.modalCloseBtn;
    const footerClose = elements.modalFooterClose;
    if (!overlay || !modal) return;

    let isOpen = false;

    // ── OPEN MODAL ─────────────────────────────────────────────
    function openModal(card) {
        if (isOpen) return;
        isOpen = true;

        // ── READ DATA FROM THE CARD ──────────────────────────
        const objTag = card.querySelector('.obj-tag');
        const objTagText = objTag ? objTag.textContent.trim() : 'OBJ-000';

        const projectName = card.querySelector('.project-info h3');
        const projectNameText = projectName ? projectName.textContent.trim() : 'PROJECT';

        const tagEls = card.querySelectorAll('.tags span');
        const stackText = tagEls.length > 0
            ? 'STACK: ' + [...tagEls].map(t => t.textContent.trim()).join(' · ')
            : 'STACK: —';

        const detailsContent = card.querySelector('.details-content');

        const githubLink = detailsContent
            ? detailsContent.querySelector('a.btn-secondary[href]')
            : null;
        const githubHref = githubLink ? githubLink.getAttribute('href') : null;
        const githubText = githubLink ? githubLink.textContent.trim() : 'View on GitHub';

        // ── POPULATE MODAL HEADER ──────────────────────────
        if (objTagEl) objTagEl.textContent = objTagText;
        if (titleEl) titleEl.textContent = projectNameText;
        if (stackEl) stackEl.textContent = stackText;

        // ── BUILD MODAL BODY CONTENT ───────────────────────
        let bodyHTML = '';

        if (detailsContent) {
            const children = detailsContent.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const tag = child.tagName.toLowerCase();

                if (tag === 'h5') {
                    bodyHTML += `<div class="modal-section-label">${child.textContent.trim()}</div>`;
                } else if (tag === 'p') {
                    bodyHTML += `<p>${child.innerHTML}</p>`;
                }
                // Skip .project-links divs — GitHub button handled separately below
            }
        }

        if (githubHref) {
            bodyHTML += `<div class="modal-section-label">REPOSITORY</div>`;
            bodyHTML += `<a href="${githubHref}" target="_blank" class="modal-github-btn">${githubText}</a>`;
        }

        if (bodyEl) bodyEl.innerHTML = bodyHTML;

        // ── SHOW OVERLAY ───────────────────────────────────
        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';

        // ── ANIMATE IN ──────────────────────────────────────
        anime({
            targets: overlay,
            opacity: [0, 1],
            duration: 250,
            easing: 'easeOutQuad'
        });
        anime({
            targets: modal,
            translateY: [-60, 0],
            opacity: [0, 1],
            duration: 420,
            easing: 'easeOutExpo'
        });
        anime({
            targets: [
                modal.querySelector('.modal-titlebar'),
                modal.querySelector('.modal-statusbar'),
                modal.querySelector('.modal-body'),
                modal.querySelector('.modal-footer')
            ],
            opacity: [0, 1],
            translateY: [8, 0],
            delay: anime.stagger(60, { start: 200 }),
            duration: 300,
            easing: 'easeOutQuad'
        });
    }

    // ── CLOSE MODAL ─────────────────────────────────────────────
    function closeModal() {
        if (!isOpen) return;

        anime({
            targets: modal,
            translateY: [0, -50],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInExpo'
        });
        anime({
            targets: overlay,
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => {
                overlay.classList.remove('is-open');
                overlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
                if (bodyEl) bodyEl.innerHTML = '';
                isOpen = false;
            }
        });
    }

    // ── WIRE UP READ MORE BUTTONS ────────────────────────────────
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = newBtn.closest('.project-card');
            if (card) openModal(card);
        });
        newBtn.innerHTML = `Read More <i data-lucide="chevron-right"></i>`;
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();

    // ── CLOSE TRIGGERS ───────────────────────────────────────────
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (footerClose) footerClose.addEventListener('click', closeModal);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) closeModal();
    });
}

initMissionModal();

// Crew stat panel hover animation
document.querySelectorAll('.crew-stat-panel').forEach(panel => {
    const val = panel.querySelector('.crew-stat-panel__value');
    panel.addEventListener('mouseenter', () => {
        if (val) anime({ targets: val, scale: [1, 1.08], duration: 200, easing: 'easeOutBack' });
    });
    panel.addEventListener('mouseleave', () => {
        if (val) anime({ targets: val, scale: [1.08, 1], duration: 200, easing: 'easeOutBack' });
    });
});
