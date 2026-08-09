// MAPS Logistics — main.js

// ── Year ──────────────────────────────────────────────────────
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Mobile nav toggle ─────────────────────────────────────────
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.getElementById('mobile-menu');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('is-open', !expanded);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
    });
  });
}

// ── Active nav link on scroll ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

// ── GSAP ScrollTrigger animations ────────────────────────────
// Respect prefers-reduced-motion: skip all GSAP, show everything instantly
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  // Make sure nothing stays invisible
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // ── Hero parallax — photo drifts up as you scroll down ──────
  const heroPhoto = document.querySelector('.hero__photo');
  if (heroPhoto) {
    gsap.to(heroPhoto, {
      backgroundPositionY: '75%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    });
  }

  // ── About — media from left, body from right ─────────────────
  const aboutMedia = document.querySelector('.about__media');
  const aboutBody  = document.querySelector('.about__body');
  if (aboutMedia && aboutBody) {
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#about',
        start: 'top 88%',
        end: 'top 22%',
        scrub: 0.8,
      },
    });
    aboutTl
      .from(aboutMedia, { x: -48, opacity: 0, duration: 0.8, ease: 'power2.out' })
      .from(aboutBody,  { x:  48, opacity: 0, duration: 0.8, ease: 'power2.out' }, '<0.15');
  }

  // ── Services — heading then cards staggered ──────────────────
  const servicesHeader = document.querySelector('.services-header');
  const serviceCards   = document.querySelectorAll('.pg-service-card');
  if (servicesHeader && serviceCards.length) {
    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#services',
        start: 'top 88%',
        end: 'top 18%',
        scrub: 0.8,
      },
    });
    servicesTl
      .from(servicesHeader, { y: 32, opacity: 0, duration: 0.6, ease: 'power2.out' })
      .from(serviceCards,   { y: 40, opacity: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out' }, '<0.2');
  }

  // ── Goals — left column fades in, then numbered items stagger ─
  const goalsCardLeft  = document.querySelector('.goals-card__left');
  const goalsCardRight = document.querySelector('.goals-card__right');
  const goalsItems     = document.querySelectorAll('.goals__numbered li');
  if (goalsCardLeft && goalsItems.length) {
    const goalsTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#goals',
        start: 'top 88%',
        end: 'top 18%',
        scrub: 0.8,
      },
    });
    goalsTl
      .from(goalsCardLeft,  { x: -40, opacity: 0, duration: 0.7, ease: 'power2.out' })
      .from(goalsCardRight, { x:  40, opacity: 0, duration: 0.7, ease: 'power2.out' }, '<0.1')
      .from(goalsItems,     { x: 24, opacity: 0, duration: 0.5, stagger: 0.11, ease: 'power2.out' }, '<0.2');
  }

  // ── Activities — text from left, fb preview from right ───────
  const activitiesText    = document.querySelector('.activities__text');
  const activitiesPreview = document.querySelector('.activities__preview');
  if (activitiesText && activitiesPreview) {
    const activitiesTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#activities',
        start: 'top 88%',
        end: 'top 22%',
        scrub: 0.8,
      },
    });
    activitiesTl
      .from(activitiesText,    { x: -48, opacity: 0, duration: 0.75, ease: 'power2.out' })
      .from(activitiesPreview, { x:  48, opacity: 0, duration: 0.75, ease: 'power2.out' }, '<0.15');
  }

  // ── Footer contact columns — staggered fade-up ───────────────
  const footerCols = document.querySelectorAll('.footer-wave__col');
  if (footerCols.length) {
    gsap.from(footerCols, {
      y: 36,
      opacity: 0,
      duration: 0.65,
      stagger: 0.14,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.footer-wave',
        start: 'top 90%',
        end: 'top 30%',
        scrub: 0.8,
      },
    });
  }

  // ── Remove CSS reveal class (GSAP handles everything now) ────
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('is-visible'); // make visible immediately so GSAP takes over
  });
}
