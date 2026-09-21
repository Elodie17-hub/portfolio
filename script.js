// ============================================================
// Elodie Ouédraogo — Portfolio — interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Année dans le footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Lien de nav actif au scroll ---------- */
  const navLinks = Array.from(mainNav ? mainNav.querySelectorAll('a') : []);
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveLink = () => {
    let currentId = sections[0] ? sections[0].id : null;
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  /* ---------- Barre de progression de lecture ---------- */
  const progressBar = document.getElementById('progressBar');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${percent}%`;
  };

  window.addEventListener('scroll', () => {
    updateProgress();
    setActiveLink();
  }, { passive: true });
  updateProgress();
  setActiveLink();

  /* ---------- Révélation au scroll (fade + slide up) ---------- */
  const revealTargets = document.querySelectorAll(
    '.service-card, .case-study, .parcours-card, .skill-card, .about-inner, .contact-inner, .section-head'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------- Formulaire de contact ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fields = form.querySelectorAll('[required]');

      fields.forEach(field => {
        const wrapper = field.closest('.form-field');
        const value = field.value.trim();
        let fieldValid = value.length > 0;

        if (field.type === 'email' && fieldValid) {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if (wrapper) wrapper.classList.toggle('invalid', !fieldValid);
        if (!fieldValid) isValid = false;
      });

      if (!isValid) {
        formNote.textContent = "Merci de corriger les champs signalés ci-dessus.";
        formNote.classList.remove('success');
        return;
      }

      // Aucun backend connecté pour l'instant : confirmation visuelle uniquement.
      // Pour un envoi réel, relier ce formulaire à un service (ex : EmailJS,
      // Formspree) ou à une route backend qui traite les données du formulaire.
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      formNote.textContent = "Message prêt à être envoyé — connectez le formulaire à votre service d'envoi pour le transmettre.";
      formNote.classList.add('success');

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }, 1200);
    });

    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        const wrapper = field.closest('.form-field');
        if (wrapper) wrapper.classList.remove('invalid');
      });
    });
  }

});
