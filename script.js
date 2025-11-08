// ===== Smooth Scrolling for Navigation =====
document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// ===== Change Navbar Style on Scroll =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.background = '#072b6f';
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  } else {
    navbar.style.background = '#0b3d91';
    navbar.style.boxShadow = 'none';
  }
});

// ===== Contact Form Animation (Mock Submit) =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', () => {
    const button = contactForm.querySelector('button');
    button.textContent = 'Sending...';
    button.disabled = true;
    setTimeout(() => {
      button.textContent = 'Message Sent!';
      button.style.background = '#00bfff';
    }, 1500);
  });
}

// ===== Fade-in Animation on Scroll =====
const fadeElements = document.querySelectorAll('.service-card, .why-item, .about p');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'all 1s ease';
  observer.observe(el);
});
