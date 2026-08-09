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

// Feature-badge marquee.
// Repeats each row until one "loop unit" is at least as wide as its
// viewport, then duplicates that unit so translating by exactly one unit
// lands back on an identical frame — i.e. no visible seam or gap.
const BADGE_SPEED = 34; // px per second

function buildBadgeMarquee(row) {
  const viewport = row.parentElement;
  const originals = [...row.children];
  if (!originals.length) return;

  row.style.animation = 'none';           // measure unscaled
  row.querySelectorAll('[data-clone]').forEach(n => n.remove());

  const setWidth = [...row.children].reduce((w, el) => w + el.offsetWidth, 0);
  if (!setWidth) return;

  const viewportWidth = viewport.offsetWidth;
  const repeats = Math.max(1, Math.ceil(viewportWidth / setWidth));

  const addCopy = () => originals.forEach(el => {
    const c = el.cloneNode(true);
    c.setAttribute('data-clone', '');
    c.setAttribute('aria-hidden', 'true');
    c.querySelectorAll('img').forEach(i => i.alt = '');
    row.appendChild(c);
  });

  for (let i = 1; i < repeats; i++) addCopy();   // finish the first unit
  for (let i = 0; i < repeats; i++) addCopy();   // second, identical unit

  const shift = setWidth * repeats;
  row.style.setProperty('--shift', shift + 'px');
  row.style.setProperty('--dur', (shift / BADGE_SPEED) + 's');
  row.style.animation = '';
}

const badgeRows = document.querySelectorAll('.feature-row');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function initBadgeMarquees() {
  if (reduceMotion.matches) return;
  badgeRows.forEach(buildBadgeMarquee);
}
// Images must be measured at their real size, so wait for load.
window.addEventListener('load', initBadgeMarquees);
let badgeResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(badgeResizeTimer);
  badgeResizeTimer = setTimeout(initBadgeMarquees, 200);
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
