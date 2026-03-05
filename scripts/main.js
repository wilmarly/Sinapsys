/* SINAPSYS — main.js: nav móvil, scroll reveal, tilt 3D, FAQ, contadores */
'use strict';

/* 1. Nav móvil */
(function navMobileMenu() {
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-menu');
  const backdrop = document.querySelector('.nav-backdrop');

  if (!nav || !toggle || !menu) return;

  function openMenu() {
    nav.classList.add('nav-open');
    document.body.classList.add('nav-menu-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
  }

  function closeMenu() {
    nav.classList.remove('nav-open');
    document.body.classList.remove('nav-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }

  function toggleMenu() {
    if (nav.classList.contains('nav-open')) closeMenu();
    else openMenu();
  }

  toggle.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeMenu();
  });
})();


/* 2. Scroll reveal */
(function scrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);   // Dispara solo una vez
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
})();


/* 3. Tilt 3D (about card) — respeta prefers-reduced-motion */
(function tilt3D() {
  const card = document.querySelector('.about-card-main');
  if (!card) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease-out';
  });

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    card.style.transform =
      `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform  = '';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
})();


/* 4. FAQ acordeón */
(function faqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  function setExpanded(item, expanded) {
    const trigger = item.querySelector('.faq-q[role="button"]');
    if (trigger) trigger.setAttribute('aria-expanded', String(expanded));
  }

  function toggleItem(clickedItem) {
    const isOpen = clickedItem.classList.contains('open');

    items.forEach((i) => {
      i.classList.remove('open');
      setExpanded(i, false);
    });

    if (!isOpen) {
      clickedItem.classList.add('open');
      setExpanded(clickedItem, true);
    }
  }

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-q[role="button"]');
    if (!trigger) return;

    item.addEventListener('click', () => toggleItem(item));

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleItem(item);
      }
    });
  });
})();


/* 5. Contadores animados — respeta prefers-reduced-motion */
(function counterAnimate() {
  const strip = document.getElementById('estadisticas');
  if (!strip) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;

    if (reduced) { el.textContent = target; return; }

    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease     = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      el.textContent = Math.floor(ease * target);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };

    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.counter').forEach(animate);
          observer.unobserve(entry.target);   // Dispara solo una vez
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(strip);
})();
