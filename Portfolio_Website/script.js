/* =====================================================
   GOPINATH U — Portfolio JavaScript
   script.js
   ===================================================== */

'use strict';

/* ──────────────────────────────────────────────────
   1. HAMBURGER — mobile menu toggle
   ────────────────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
})();


/* ──────────────────────────────────────────────────
   2. TYPING EFFECT — animated role text in hero
   ────────────────────────────────────────────────── */
(function initTypingEffect() {
  const roles = [
    'Python Full Stack Developer',
    'Django & React Developer',
    'REST API Developer',
    'Web Application Builder'
  ];

  let roleIdx = 0, charIdx = 0, isDeleting = false;
  const typedEl = document.getElementById('typed-text');

  function typeLoop() {
    const current = roles[roleIdx];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 50);
    } else {
      typedEl.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) {
        isDeleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 90);
    }
  }

  typeLoop();
})();


/* ──────────────────────────────────────────────────
   3. SCROLL REVEAL — fade elements into view
   ────────────────────────────────────────────────── */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  reveals.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────
   4. CONTACT FORM VALIDATION
   ────────────────────────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMsg');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Helper: show or hide error state for a field */
  function setError(fieldId, errId, hasError) {
    const field = document.getElementById(fieldId);
    const err   = document.getElementById(errId);
    if (hasError) {
      field.classList.add('error');
      err.classList.add('visible');
    } else {
      field.classList.remove('error');
      err.classList.remove('visible');
    }
  }

  /* Form submit handler */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const subject = document.getElementById('fsubject').value.trim();
    const msg     = document.getElementById('fmessage').value.trim();

    // Validate each field
    const nameInvalid    = name.length < 2;
    const emailInvalid   = !emailRegex.test(email);
    const subjectInvalid = subject.length === 0;
    const msgInvalid     = msg.length < 10;

    setError('fname',    'nameErr',    nameInvalid);
    setError('femail',   'emailErr',   emailInvalid);
    setError('fsubject', 'subjectErr', subjectInvalid);
    setError('fmessage', 'msgErr',     msgInvalid);

    const isValid = !nameInvalid && !emailInvalid && !subjectInvalid && !msgInvalid;

    if (isValid) {
      form.reset();
      successMsg.classList.add('visible');
      setTimeout(() => successMsg.classList.remove('visible'), 4000);
    }
  });

  /* Clear errors on input */
  ['fname', 'femail', 'fsubject', 'fmessage'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
      if (this.classList.contains('error')) {
        this.classList.remove('error');
      }
    });
  });
})();


/* ──────────────────────────────────────────────────
   5. ACTIVE NAV LINK — highlight on scroll
   ────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.id;
      }
    });
    navAnchors.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}`
        ? 'var(--accent)'
        : '';
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();
