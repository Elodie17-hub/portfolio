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
    '.service-card, .project-card, .parcours-card, .tool, .about-inner, .contact-inner, .section-head'
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

  /* ---------- Anneaux de compétences (remplissage animé) ---------- */
  const RING_CIRCUMFERENCE = 214; // 2 * PI * 34 (rayon du cercle SVG)
  const tools = document.querySelectorAll('.tool');

  const toolObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const tool = entry.target;
      const percent = parseInt(tool.dataset.percent, 10) || 0;
      const ringFg = tool.querySelector('.ring-fg');
      if (ringFg) {
        const offset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * percent) / 100;
        requestAnimationFrame(() => { ringFg.style.strokeDashoffset = offset; });
      }
      toolObserver.unobserve(tool);
    });
  }, { threshold: 0.4 });

  tools.forEach(tool => toolObserver.observe(tool));

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

      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      formNote.textContent = "Envoi en cours…";
      formNote.classList.remove('success');

      // Remplace ces deux identifiants par ceux de ton compte EmailJS
      const SERVICE_ID = "service_83jsouw";
      const TEMPLATE_ID = "template_eq4dctp";

      emailjs.sendForm(service_83jsouw, template_eq4dctp, form)
        .then(() => {
          formNote.textContent = "Merci ! Votre message a bien été envoyé.";
          formNote.classList.add('success');
          form.reset();
        })
        .catch((error) => {
          console.error("Erreur EmailJS :", error);
          formNote.textContent = "Une erreur est survenue. Réessayez ou écrivez-moi directement par email.";
          formNote.classList.remove('success');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        });
    });

    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        const wrapper = field.closest('.form-field');
        if (wrapper) wrapper.classList.remove('invalid');
      });
    });
  }
});
