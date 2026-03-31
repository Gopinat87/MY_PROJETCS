/* =====================================================
   NEXMART — E-Commerce Landing Page
   script.js  |  Task 2 — Interactive Features
   ===================================================== */

'use strict';

/* ──────────────────────────────────────────────────
   1. NAVBAR — scroll shrink + hamburger toggle
   ────────────────────────────────────────────────── */
(function initNavbar() {
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav__links');

  // Shrink header on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();


/* ──────────────────────────────────────────────────
   2. CART SIDEBAR — open / close + add items
   ────────────────────────────────────────────────── */
(function initCart() {
  const cartBtn     = document.getElementById('cartBtn');
  const cartClose   = document.getElementById('cartClose');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartBody    = document.getElementById('cartBody');
  const cartCount   = document.getElementById('cartCount');
  const cartTotal   = document.getElementById('cartTotal');

  let cartItems = [];   // { name, price, id }

  // Open / Close helpers
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', openCart);
  cartClose.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Render cart items inside sidebar
  function renderCart() {
    if (cartItems.length === 0) {
      cartBody.innerHTML = '<p class="cart-empty">Your cart is empty. Start shopping!</p>';
    } else {
      cartBody.innerHTML = cartItems.map(item => `
        <div class="cart-item">
          <span class="cart-item__name">${item.name}</span>
          <span class="cart-item__price">₹${item.price.toLocaleString('en-IN')}</span>
          <button class="cart-item__remove" data-id="${item.id}" title="Remove">✕</button>
        </div>
      `).join('');

      // Bind remove buttons
      cartBody.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', () => {
          cartItems = cartItems.filter(i => i.id !== Number(btn.dataset.id));
          updateCartMeta();
          renderCart();
        });
      });
    }
  }

  // Update count badge and total
  function updateCartMeta() {
    cartCount.textContent = cartItems.length;
    const total = cartItems.reduce((sum, i) => sum + i.price, 0);
    cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  // Add to Cart buttons
  let itemIdCounter = 1;
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const name  = this.dataset.name;
      const price = Number(this.dataset.price);

      cartItems.push({ name, price, id: itemIdCounter++ });
      updateCartMeta();
      renderCart();
      openCart();

      // Visual feedback on button
      const original = this.textContent;
      this.textContent = '✓ Added!';
      this.classList.add('added');
      setTimeout(() => {
        this.textContent = original;
        this.classList.remove('added');
      }, 1500);
    });
  });
})();


/* ──────────────────────────────────────────────────
   3. PRODUCT FILTER TABS
   ────────────────────────────────────────────────── */
(function initFilterTabs() {
  const tabs    = document.querySelectorAll('.filter-tab');
  const cards   = document.querySelectorAll('.product-card[data-category]');

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;

      // Show / hide cards
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);

        // Re-trigger fade-up animation
        if (match) {
          card.classList.remove('visible');
          requestAnimationFrame(() => {
            setTimeout(() => card.classList.add('visible'), 30);
          });
        }
      });
    });
  });
})();


/* ──────────────────────────────────────────────────
   4. SCROLL REVEAL — fade elements into view
   ────────────────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.fade-up, .fade-right');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────
   5. DEALS COUNTDOWN TIMER
   ────────────────────────────────────────────────── */
(function initCountdown() {
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  const secsEl  = document.getElementById('cd-secs');

  // Set end time = 8 hours from page load
  const endTime = Date.now() + 8 * 60 * 60 * 1000;

  function updateCountdown() {
    const remaining = Math.max(0, endTime - Date.now());
    const hours = Math.floor(remaining / 3600000);
    const mins  = Math.floor((remaining % 3600000) / 60000);
    const secs  = Math.floor((remaining % 60000) / 1000);

    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent  = String(mins).padStart(2, '0');
    secsEl.textContent  = String(secs).padStart(2, '0');

    if (remaining === 0) clearInterval(timer);
  }

  updateCountdown();
  const timer = setInterval(updateCountdown, 1000);
})();


/* ──────────────────────────────────────────────────
   6. NEWSLETTER FORM VALIDATION
   ────────────────────────────────────────────────── */
(function initNewsletter() {
  const form         = document.getElementById('newsletterForm');
  const successToast = document.getElementById('successToast');
  const emailRegex   = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(inputId, errId, hasError) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    input.classList.toggle('error', hasError);
    err.classList.toggle('show', hasError);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name  = document.getElementById('subName').value.trim();
    const email = document.getElementById('subEmail').value.trim();

    const nameInvalid  = name.length < 2;
    const emailInvalid = !emailRegex.test(email);

    setError('subName',  'subNameErr',  nameInvalid);
    setError('subEmail', 'subEmailErr', emailInvalid);

    if (!nameInvalid && !emailInvalid) {
      form.reset();
      successToast.classList.add('show');
      setTimeout(() => successToast.classList.remove('show'), 5000);
    }
  });

  // Clear error on input
  ['subName', 'subEmail'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
      this.classList.remove('error');
      const errId = id === 'subName' ? 'subNameErr' : 'subEmailErr';
      document.getElementById(errId).classList.remove('show');
    });
  });
})();


/* ──────────────────────────────────────────────────
   7. TOGGLE BUTTON — dark/light hero bg demo
      (Bonus interactive feature for Task 2)
   ────────────────────────────────────────────────── */
(function initThemeToggle() {
  // Simple toggle: clicking the nav logo switches accent color for fun
  const logo = document.querySelector('.nav__logo');
  const accents = ['#ff6b35', '#3b82f6', '#10b981', '#8b5cf6'];
  let idx = 0;

  logo.style.cursor = 'pointer';
  logo.title = 'Click to change accent!';

  logo.addEventListener('click', () => {
    idx = (idx + 1) % accents.length;
    document.documentElement.style.setProperty('--clr-primary', accents[idx]);
    document.documentElement.style.setProperty('--clr-primary-d', accents[idx]);
  });
})();
