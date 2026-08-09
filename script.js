// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav-links');
navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  navLinks.forEach(list => list.classList.toggle('is-open'));
});
navLinks.forEach(list => {
  list.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.forEach(l => l.classList.remove('is-open'));
    });
  });
});

// FAQ accordion
document.querySelectorAll('.accordion-item').forEach(item => {
  const trigger = item.querySelector('.accordion-trigger');
  // Design shows every answer expanded, so toggle each independently.
  trigger.addEventListener('click', () => item.classList.toggle('is-open'));
});

// Testimonial carousel — auto-advances every 4s, arrows still work
const AUTOPLAY_MS = 4000;
const slides = document.querySelectorAll('.t-slide');
const carousel = document.querySelector('.testimonial-card');
let activeSlide = 0;
let autoplayTimer = null;
// The arrows sit inside the card, so a click must not resume autoplay
// while the pointer is still resting on it.
let paused = false;

function showSlide(index) {
  slides[activeSlide].classList.remove('is-active');
  activeSlide = (index + slides.length) % slides.length;
  slides[activeSlide].classList.add('is-active');
}

// Honour the OS "reduce motion" setting — no unattended movement there.
const wantsMotion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function startAutoplay() {
  if (!wantsMotion || slides.length < 2 || paused || document.hidden) return;
  stopAutoplay();
  autoplayTimer = setInterval(() => showSlide(activeSlide + 1), AUTOPLAY_MS);
}
function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
}

// A manual click restarts the clock, so the slide you picked gets a full turn.
function go(step) {
  showSlide(activeSlide + step);
  startAutoplay();
}
document.querySelector('.t-arrow--prev')?.addEventListener('click', () => go(-1));
document.querySelector('.t-arrow--next')?.addEventListener('click', () => go(1));

// Pause while the reader is hovering or tabbing through the card.
if (carousel) {
  const hold = () => { paused = true; stopAutoplay(); };
  const release = () => { paused = false; startAutoplay(); };
  carousel.addEventListener('mouseenter', hold);
  carousel.addEventListener('mouseleave', release);
  carousel.addEventListener('focusin', hold);
  carousel.addEventListener('focusout', release);
}
// Don't cycle in a background tab.
document.addEventListener('visibilitychange', () => {
  document.hidden ? stopAutoplay() : startAutoplay();
});

startAutoplay();
