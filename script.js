/* ========== tiny helpers ========== */
const qs  = (s, c=document) => c.querySelector(s);
const qsa = (s, c=document) => Array.from(c.querySelectorAll(s));

/* ========== 1) Robust dropdowns (desktop hover + click; mobile tap) ========== */
(function setupDropdowns(){
  const dropdowns = qsa('.dropdown');
  const NAV_CLOSE_DELAY = 220; // ms
  const isMobile = () => window.innerWidth <= 768;

  dropdowns.forEach(dd => {
    const trigger = qs(':scope > a', dd);
    const menu    = qs(':scope .dropdown-menu', dd);
    if(!trigger || !menu) return;

    let hideTimer;

    const openMenu  = () => { clearTimeout(hideTimer); menu.style.display = 'block'; dd.classList.add('open'); };
    const closeMenu = () => { hideTimer = setTimeout(()=>{ menu.style.display = 'none'; dd.classList.remove('open'); }, NAV_CLOSE_DELAY); };

    // --- Desktop hover keeps it open, slight delay before closing
    dd.addEventListener('mouseenter', () => { if(!isMobile()) openMenu(); });
    dd.addEventListener('mouseleave', () => { if(!isMobile()) closeMenu(); });

    // --- Click to toggle (both desktop and mobile)
    trigger.addEventListener('click', (e) => {
      // If this dropdown contains a submenu, first toggle; second click can follow the hash if wanted
      if (menu) {
        // prevent jump on first click; users can click submenu items to navigate
        e.preventDefault();
        const isShown = menu.style.display === 'block';
        if (isShown) { closeMenu(); }
        else { openMenu(); }
      }
    });

    // Keep open while pointer moves inside the menu
    menu.addEventListener('mouseenter', () => { clearTimeout(hideTimer); });
    menu.addEventListener('mouseleave', closeMenu);
  });

  // Close any open menu when clicking elsewhere
  document.addEventListener('click', (e) => {
    const anyOpen = qsa('.dropdown .dropdown-menu').filter(m => m.style.display === 'block');
    if (!e.target.closest('.dropdown')) {
      anyOpen.forEach(m => { m.style.display = 'none'; m.parentElement.classList.remove('open'); });
    }
  });
})();

/* ========== 2) Mobile menu toggle (hamburger injected if not present) ========== */
(function setupMobileMenu(){
  const navbar   = qs('.navbar');
  const navLinks = qs('.nav-links');
  if(!navbar || !navLinks) return;

  let toggleBtn = qs('.menu-toggle', navbar);
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.setAttribute('aria-label','Open menu');
    toggleBtn.textContent = '☰';
    Object.assign(toggleBtn.style, {
      background:'transparent', border:'0', color:'#fff', fontSize:'22px',
      cursor:'pointer', display:'none', marginLeft:'12px'
    });
    navbar.appendChild(toggleBtn);
  }

  function refresh() {
    if (window.innerWidth <= 768) {
      toggleBtn.style.display = 'block';
      // start closed on mobile
      navLinks.classList.remove('open');
      // also collapse any open dropdown menus
      qsa('.dropdown .dropdown-menu').forEach(m => m.style.display='none');
      qsa('.dropdown').forEach(d => d.classList.remove('open'));
    } else {
      toggleBtn.style.display = 'none';
      navLinks.classList.remove('open');
      // desktop default: menus hidden until hover/click
      qsa('.dropdown .dropdown-menu').forEach(m => m.style.display='none');
      qsa('.dropdown').forEach(d => d.classList.remove('open'));
    }
  }
  refresh();
  window.addEventListener('resize', refresh);

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();

/* ========== 3) Smooth scrolling with fixed-navbar offset ========== */
function scrollToWithOffset(targetEl) {
  const nav = qs('.navbar');
  const offset = nav ? nav.offsetHeight + 8 : 0;
  const y = targetEl.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

// main nav & hero CTA
qsa('.nav-links a, .cta-button').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = qs(href);
      if (el) scrollToWithOffset(el);

      // close mobile menu after navigating
      const navLinks = qs('.nav-links');
      if (navLinks && window.innerWidth <= 768) navLinks.classList.remove('open');

      // hide any open dropdown menus after click
      qsa('.dropdown .dropdown-menu').forEach(m => m.style.display='none');
      qsa('.dropdown').forEach(d => d.classList.remove('open'));
    }
  });
});

// submenu items (inside dropdowns)
qsa('.dropdown-menu a').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = qs(href);
      if (el) scrollToWithOffset(el);
      // close menus
      qsa('.dropdown .dropdown-menu').forEach(m => m.style.display='none');
      qsa('.dropdown').forEach(d => d.classList.remove('open'));
      const navLinks = qs('.nav-links');
      if (navLinks && window.innerWidth <= 768) navLinks.classList.remove('open');
    }
  });
});

/* ========== 4) Navbar style tweak on scroll ========== */
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

/* ========== 5) Contact form friendly animation (static site) ========== */
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

/* ========== 6) Fade-in on scroll for cards/sections ========== */
(function revealOnScroll(){
  const targets = qsa('.service-card, .why-item, .about p');
  targets.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 800ms ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if (ent.isIntersecting) {
        ent.target.style.opacity = 1;
        ent.target.style.transform = 'translateY(0)';
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => io.observe(el));
})();

/* ===== Flyers Carousel (auto-slide, buttons, dots, swipe) ===== */
(function flyersCarousel(){
  const section = document.getElementById('flyers');
  if (!section) return;

  const track   = section.querySelector('.carousel-track');
  const prevBtn = section.querySelector('.carousel-btn.prev');
  const nextBtn = section.querySelector('.carousel-btn.next');
  const dotsBox = section.querySelector('.carousel-dots');
  if (!track || !prevBtn || !nextBtn || !dotsBox) return;

  const slides = Array.from(track.querySelectorAll('.slide'));
  if (!slides.length) return;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    b.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(b);
  });

  let active = 0;
  let auto    = (track.dataset.autoplay || 'true') === 'true';
  let interval= parseInt(track.dataset.interval || '4200', 10);
  let timer   = null;
  let isHover = false;

  function slideWidth(){
    // Width of one column (grid-auto-columns) including gap by measuring first slide
    const s = slides[0];
    const styles = window.getComputedStyle(s);
    const w = s.getBoundingClientRect().width;
    const mr = parseFloat(styles.marginRight) || 0;
    const ml = parseFloat(styles.marginLeft) || 0;
    return w + ml + mr + 18; // 18px grid gap from CSS
  }

  function updateDots(){
    dotsBox.querySelectorAll('button').forEach((d,i)=>{
      d.classList.toggle('active', i === active);
    });
  }

  function normalizeIndex(idx){
    if (idx < 0) return slides.length - 1;
    if (idx >= slides.length) return 0;
    return idx;
  }

  function goTo(idx){
    active = normalizeIndex(idx);
    const x = active * slideWidth();
    track.scrollTo({ left: x, behavior: 'smooth' });
    updateDots();
    restartAuto();
  }

  function next(){ goTo(active + 1); }
  function prev(){ goTo(active - 1); }

  // Auto play
  function startAuto(){
    if (!auto || timer) return;
    timer = setInterval(()=>{ if (!isHover) next(); }, interval);
  }
  function stopAuto(){ if (timer){ clearInterval(timer); timer = null; } }
  function restartAuto(){ stopAuto(); startAuto(); }

  // Pause on hover
  track.addEventListener('mouseenter', ()=>{ isHover = true; });
  track.addEventListener('mouseleave', ()=>{ isHover = false; });

  // Buttons
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  // Touch swipe
  let startX = 0, distX = 0, isTouching = false;
  track.addEventListener('touchstart', (e)=>{ isTouching = true; startX = e.touches[0].clientX; distX = 0; }, {passive:true});
  track.addEventListener('touchmove',  (e)=>{ if(!isTouching) return; distX = e.touches[0].clientX - startX; }, {passive:true});
  track.addEventListener('touchend',   ()=>{
    if(!isTouching) return;
    isTouching = false;
    const threshold = 40; // minimal swipe px
    if (distX < -threshold) next();
    else if (distX > threshold) prev();
  });

  // Sync active index when user scrolls manually (e.g., mouse wheel/drag)
  let scrollDebounce = null;
  track.addEventListener('scroll', ()=>{
    if (scrollDebounce) cancelAnimationFrame(scrollDebounce);
    scrollDebounce = requestAnimationFrame(()=>{
      const idx = Math.round(track.scrollLeft / slideWidth());
      active = normalizeIndex(idx);
      updateDots();
    });
  });

  // Init
  updateDots();
  startAuto();

  // Adjust on resize
  window.addEventListener('resize', () => {
    // Snap back to active slide to keep alignment
    goTo(active);
  });
})();

