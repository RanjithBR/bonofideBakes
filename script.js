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

// Testimonial carousel
const slides = document.querySelectorAll('.t-slide');
let activeSlide = 0;
function showSlide(index) {
  slides[activeSlide].classList.remove('is-active');
  activeSlide = (index + slides.length) % slides.length;
  slides[activeSlide].classList.add('is-active');
}
document.querySelector('.t-arrow--prev')?.addEventListener('click', () => showSlide(activeSlide - 1));
document.querySelector('.t-arrow--next')?.addEventListener('click', () => showSlide(activeSlide + 1));
