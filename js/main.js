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
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initGSAPAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    // Intercept anchor links for smooth scrolling via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
          e.preventDefault();
          lenis.scrollTo(targetId, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        }
      });
    });
  }


  // ── Hero animations ────────────────────────────────────────────
  const heroBg = document.querySelector('.hero-split__bg');
  const heroContent = document.querySelector('.hero-split__content');
  const heroTruck = document.querySelector('.hero-split__truck');
  
  if (heroContent && heroTruck) {
    const heroTl = gsap.timeline();
    
    // Entrance animations
    heroTl
      .fromTo(heroBg, 
        { scale: 1.1, opacity: 0 }, 
        { scale: 1, opacity: 0.25, duration: 1.5, ease: 'expo.out' })
      .fromTo(heroContent.children,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'expo.out' },
        '-=1.0')
      .fromTo(heroTruck,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.8');

    // Scroll parallax for background
    if (heroBg) {
      gsap.to(heroBg, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-split',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }

  // ── About — split panel fade + slide ────────────────────────
  const aboutMedia = document.querySelector('.about-split__media');
  const aboutPanel = document.querySelector('.about-split__panel');
  const counters = document.querySelectorAll('.counter');
  if (aboutMedia && aboutPanel) {
    const aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#about',
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
    aboutTl
      .fromTo([aboutMedia, aboutPanel],
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.15 });

    if (counters.length) {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        let obj = { val: 0 };
        aboutTl.to(obj, {
          val: target,
          duration: 1.5,
          ease: "expo.out",
          onUpdate: function() {
            counter.innerText = Math.ceil(obj.val);
          }
        }, "<0.3");
      });
    }
  }

  // ── Services ─────────────────────────────────────────────────
  const servicesHeader = document.querySelector('.services-header');
  const serviceCards   = document.querySelectorAll('.pg-service-card');
  if (servicesHeader && serviceCards.length) {
    const servicesTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#services',
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
    servicesTl
      .fromTo(servicesHeader,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out' })
      .fromTo(serviceCards,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.12, ease: 'expo.out' },
        '<0.2');
  }

  // ── Goals ────────────────────────────────────────────────────
  const goalsCardLeft  = document.querySelector('.goals-card__left');
  const goalsCardRight = document.querySelector('.goals-card__right');
  const goalsItems     = document.querySelectorAll('.goals__numbered li');
  if (goalsCardLeft && goalsItems.length) {
    const goalsTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#goals',
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
    goalsTl
      .fromTo(goalsCardLeft,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out' })
      .fromTo(goalsCardRight,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out' },
        '<0.1')
      .fromTo(goalsItems,
        { x: 24, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.0, stagger: 0.11, ease: 'expo.out' },
        '<0.2');
  }

  // ── Activities ───────────────────────────────────────────────
  const activitiesText    = document.querySelector('.activities__text');
  const activitiesPreview = document.querySelector('.activities__preview');
  if (activitiesText && activitiesPreview) {
    const activitiesTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#activities',
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
    activitiesTl
      .fromTo(activitiesText,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.25, ease: 'expo.out' })
      .fromTo(activitiesPreview,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.25, ease: 'expo.out' },
        '<0.15');
  }

  // ── Footer columns ───────────────────────────────────────────
  const footerCols = document.querySelectorAll('.footer-wave__col');
  if (footerCols.length) {
    gsap.fromTo(footerCols,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1.25,
        stagger: 0.14,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.footer-wave',
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }

  // Reveal CSS-based elements immediately (GSAP handles opacity now)
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));

  // Recalculate after layout settles (fixes hash-navigation initial state)
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

if (prefersReduced) {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else {
  // GSAP scripts load synchronously before this file — should be ready immediately
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initGSAPAnimations();
  } else {
    // Fallback: wait for DOM ready then try once more
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initGSAPAnimations();
      } else {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      }
    });
  }
}

// Refresh ScrollTrigger after all resources load (catches hash-scroll offset)
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => ScrollTrigger.refresh(), 150);
  }
});

// ── Platform detection ────────────────────────────────────────
document.documentElement.classList.add('js-enabled');

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
if (isSafari) document.documentElement.classList.add('is-safari');

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
if (isMac) document.documentElement.classList.add('is-mac');

// ── Global error fallback ─────────────────────────────────────
window.addEventListener('error', () => {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
});

// └└└ Modal Logic ─────────────────────────────────────────────────
const modalTriggers = document.querySelectorAll('.js-modal-trigger');
const modalCloses = document.querySelectorAll('.js-modal-close');
const quoteModal = document.getElementById('quoteModal');

function openModal(e) {
  if (e) e.preventDefault();
  quoteModal.classList.add('is-open');
  quoteModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal(e) {
  if (e) e.preventDefault();
  quoteModal.classList.remove('is-open');
  quoteModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

modalTriggers.forEach(q => q.addEventListener('click', openModal));
modalCloses.forEach(q => q.addEventListener('click', closeModal));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && quoteModal.classList.contains('is-open')) {
    closeModal();
  }
});
