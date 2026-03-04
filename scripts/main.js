/**
 * SINAPSYS — main.js
 *
 * Módulos:
 *  1. scrollReveal    — IntersectionObserver para animaciones de entrada
 *  2. tilt3D          — Efecto tilt 3D en la about-card (mousemove)
 *  3. faqAccordion    — Toggle de ítems FAQ
 *  4. counterAnimate  — Contadores numéricos animados en stats strip
 */

'use strict';

/* ─── 1. SCROLL REVEAL ─────────────────────────────────────────── */
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


/* ─── 2. TILT 3D — ABOUT CARD ──────────────────────────────────── */
/*
 * Efecto de profundidad al mover el cursor sobre la card de cita.
 * Rango de rotación: ±10° en Y, ±8° en X.
 * Se desactiva automáticamente si el usuario prefiere movimiento reducido.
 */
(function tilt3D() {
  const card = document.querySelector('.about-card-main');
  if (!card) return;

  // Respetar preferencia de accesibilidad del sistema operativo
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
    // Limpiar transition para no interferir con willChange
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
})();


/* ─── 3. FAQ ACCORDION ──────────────────────────────────────────── */
/*
 * Solo un ítem puede estar abierto a la vez.
 * Click en el ítem activo lo cierra.
 */
(function faqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Cerrar todos
      items.forEach((i) => i.classList.remove('open'));

      // Abrir el clickeado (si no estaba abierto)
      if (!isOpen) item.classList.add('open');
    });
  });
})();


/* ─── 4. COUNTER ANIMATE — STATS STRIP ─────────────────────────── */
/*
 * Observa el contenedor #estadisticas y, al entrar en viewport,
 * anima cada .counter span desde 0 hasta su data-target.
 * El prefijo/sufijo ("+", "%", " años") permanece como texto HTML estático.
 *
 * Curva: ease-out exponencial — arranca rápido, frena al llegar al valor final.
 * Respeta prefers-reduced-motion: muestra el valor final sin animación.
 */
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
