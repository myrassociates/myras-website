// ========== Helpers ==========
function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

// ========== 1) Mobile Menu Toggle (hamburger injected automatically) ==========
(function setupMobileMenu() {
  const navbar = qs('.navbar');
  const navLinks = qs('.nav-links');

  if (!navbar || !navLinks) return;

  // Create a hamburger button if it doesn't exist
  let toggleBtn = qs('.menu-toggle', navbar);
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.setAttribute('aria-label', 'Open menu');
    toggleBtn.textContent = '☰';
    // Minimal inline styling so we don't need to touch CSS again
    Object.assign(toggleBtn.style, {
      background: 'transparent',
      border: '0',
      color: '#fff',
      fontSize: '22px',
      cursor: 'pointer',
      display: 'none',
      marginLeft: '12px'
    });
    // place it at the right end of navbar
    navbar.appendChild(toggleBtn);
  }

  // Show button on small screens; hide on desktop
  function refreshToggleVisibility() {
    if (window.innerWidth <= 768) {
      toggleBtn.style.display = 'block';
      navLinks.classList.remove('open'); // start closed on mobile
    } else {
      toggleBtn.style.display = 'none';
      navLinks.classList.remove('open'); // always open layout on desktop
    }
  }
  refreshToggleVisibility();
  window.addEventListener('resize', refreshToggleVisibility);

  // Toggle the nav list
  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();

// ========== 2) Smooth Scrolling for anchor links ==========
qsa('.nav-links a, .cta-button').forEach(a => {
  a.addEventListener('click', function (e) {
    const href = this.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = qs(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile nav after navigating
      const navLinks = qs('.nav-links');
      if (navLinks && window.innerWidth <= 768) navLinks.classList.remove('open');
    }
  });
});

// ========== 3) Navbar style tweak on scroll ==========
window.addEventListener('scroll', () => {
  const navbar = qs('.navbar');
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.style.background = '#072b6f';
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  } else {
    navbar.style.background = '#0b3d91';
    navbar.style.boxShadow = 'none';
  }
});

// ========== 4) Contact form friendly animation (static site) ==========
const contactForm = qs('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', () => {
    const btn = contactForm.querySelector('button');
    if (!btn) return;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      btn.disabled = false;
      btn.style.background = '#00bfff';
    }, 1200);
  });
}

// ========== 5) Fade-in on scroll (cards/sections) ==========
(function revealOnScroll() {
  const fadeTargets = qsa('.service-card, .why-item, .about p');
  fadeTargets.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 800ms ease';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeTargets.forEach(el => io.observe(el));
})();
