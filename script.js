// SafeScroll — Main JavaScript

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     NAVBAR scroll effect
  ───────────────────────────────────────── */
  const navbar = document.getElementById('mainNavbar');
  function updateNavbar() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ─────────────────────────────────────────
     SMOOTH SCROLL for anchor links
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────
     MOBILE MENU — close on nav link click
  ───────────────────────────────────────── */
  const navbarCollapse = document.querySelector('.navbar-collapse');
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  /* ─────────────────────────────────────────
     FADE-IN-UP animation (Intersection Observer)
  ───────────────────────────────────────── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in-up').forEach(el => io.observe(el));

  /* ─────────────────────────────────────────
     ANIMATED COUNTERS
  ───────────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    const suffix = el.dataset.suffix || '';
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start) + suffix;
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-counter]').forEach(el => {
        const val = parseInt(el.dataset.counter, 10);
        if (!isNaN(val)) animateCounter(el, val);
      });
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  const statsStrip = document.querySelector('.stats-strip');
  if (statsStrip) counterObserver.observe(statsStrip);

  /* ─────────────────────────────────────────
     iOS WAITLIST FORM
  ───────────────────────────────────────── */
  const waitlistForm   = document.getElementById('waitlistForm');
  const waitlistSuccess = document.getElementById('waitlistSuccess');
  const submitBtn      = document.getElementById('waitlist-submit-btn');
  const countEl        = document.getElementById('waitlist-count');

  // Simulate a live waitlist count
  const baseCount = 2400;
  if (countEl) {
    const randomExtra = Math.floor(Math.random() * 150) + 10;
    countEl.textContent = (baseCount + randomExtra).toLocaleString() + '+';
  }

  if (waitlistForm) {
    waitlistForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const email   = document.getElementById('waitlist-email');
      const phone   = document.getElementById('waitlist-phone');
      const country = document.getElementById('waitlist-country-code');

      let valid = true;

      // Email validation
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.classList.add('is-invalid');
        valid = false;
      } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
      }

      // Phone validation (6–15 digits)
      const phoneDigits = phone.value.replace(/\D/g, '');
      if (!phoneDigits || phoneDigits.length < 6 || phoneDigits.length > 15) {
        phone.classList.add('is-invalid');
        valid = false;
      } else {
        phone.classList.remove('is-invalid');
        phone.classList.add('is-valid');
      }

      if (!valid) return;

      // Compose data
      const countryCode = country.value.replace('-ca', ''); // normalize +1-ca → +1
      const formData = {
        email: email.value.trim(),
        phone: countryCode + phoneDigits,
        timestamp: new Date().toISOString(),
        source: 'ios-waitlist'
      };

      // --- Google Analytics event ---
      if (typeof gtag !== 'undefined') {
        gtag('event', 'waitlist_signup', {
          event_category: 'iOS Waitlist',
          event_label: formData.email
        });
      }

      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i> Reserving your spot...';

      // Simulate submission (replace with real API/Formspree/etc.)
      setTimeout(() => {
        // Store locally so we can use it later
        try {
          const existing = JSON.parse(localStorage.getItem('ss_waitlist') || '[]');
          existing.push(formData);
          localStorage.setItem('ss_waitlist', JSON.stringify(existing));
        } catch (_) {}

        // Update counter
        if (countEl) {
          const cur = parseInt(countEl.textContent.replace(/\D/g, ''), 10) || baseCount;
          countEl.textContent = (cur + 1).toLocaleString() + '+';
        }

        // Show success
        waitlistForm.style.display = 'none';
        waitlistSuccess.style.display = 'block';

        // Scroll into view
        waitlistSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

      }, 1200);
    });
  }

  /* ─────────────────────────────────────────
     STORE BUTTON — brief loading feedback
  ───────────────────────────────────────── */
  const storeLinks = document.querySelectorAll(
    '#hero-android-btn, #nav-cta-btn, #download-android-btn, #contact-android-btn'
  );

  storeLinks.forEach(link => {
    link.addEventListener('click', function () {
      const originalHTML = this.innerHTML;
      const isSmall = this.classList.contains('btn-sm');

      // Show brief loading indicator
      const tempHTML = isSmall
        ? '<i class="bi bi-hourglass-split me-2"></i><span>Opening…</span>'
        : this.innerHTML.replace(/(Google Play|Get the App)/i, 'Opening Play Store…');

      this.innerHTML = tempHTML;
      this.style.pointerEvents = 'none';

      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.style.pointerEvents = '';
      }, 2500);

      // Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'play_store_click', {
          event_category: 'Download',
          event_label: this.id || 'android_cta'
        });
      }
    });
  });

  /* ─────────────────────────────────────────
     iOS badge — scroll to waitlist
  ───────────────────────────────────────── */
  const iosHeroBadge = document.getElementById('hero-ios-btn');
  if (iosHeroBadge) {
    iosHeroBadge.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('ios-waitlist');
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  /* ─────────────────────────────────────────
     TOOLTIP init
  ───────────────────────────────────────── */
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    new bootstrap.Tooltip(el);
  });

  /* ─────────────────────────────────────────
     Preload critical image
  ───────────────────────────────────────── */
  const preloadImg = new Image();
  preloadImg.src = 'phone-mockup.png';

});

/* ─────────────────────────────────────────
   DEBOUNCE utility
───────────────────────────────────────── */
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}