const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Theme toggle (Auto / Light / Dark)
(function themeToggle(){
  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  const label = document.getElementById('themeLabel');
  const order = ['auto','light','dark'];
  function apply(mode){
    if(mode==='light'){ root.dataset.theme='light'; label.textContent='Light'; }
    else if(mode==='dark'){ root.dataset.theme='dark'; label.textContent='Dark'; }
    else { root.removeAttribute('data-theme'); label.textContent='Auto'; }
    localStorage.setItem('themePref', mode);
  }
  let pref = localStorage.getItem('themePref') || 'auto';
  apply(pref);
  btn?.addEventListener('click', ()=> {
    const next = order[(order.indexOf(pref)+1)%order.length];
    pref = next; apply(pref);
  });
})();

// Mobile Nav Toggle
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#primary-nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    nav.style.display = isOpen ? 'block' : '';
  });
}
document.querySelectorAll('#primary-nav a.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      nav.style.display = '';
    }
  });
});

// Sticky Header Shadow
const header = document.querySelector('.site-header');
const onScrollHeader = () => { if (window.scrollY > 4) header.classList.add('scrolled'); else header.classList.remove('scrolled'); };
onScrollHeader();
window.addEventListener('scroll', onScrollHeader, { passive: true });

// Back-to-top
const toTop = document.getElementById('toTop');
const onScrollTop = () => { if (window.scrollY > 600) toTop.classList.add('show'); else toTop.classList.remove('show'); };
onScrollTop();
window.addEventListener('scroll', onScrollTop, { passive: true });
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Scrollspy
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, { root: null, threshold: 0.5 });
sections.forEach(sec => spy.observe(sec));

// Reveal on Scroll
if (!prefersReduced) {
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealer.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealer.observe(el));
} else {
  document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
}

// Typing Effect (no images)
(function typingEffect() {
  const typedEl = document.getElementById('typed');
  const cursorEl = document.querySelector('.cursor');
  if (!typedEl) return;

  const phrases = [
    'Strategic Supply Chain & Data Analytics Professional',
    'NPI readiness, inventory & pricing decisions that move KPIs',
    'Power BI dashboards, telematics insights, and efficiency at scale'
  ];

  if (prefersReduced) { typedEl.textContent = phrases[0]; if (cursorEl) cursorEl.style.display = 'none'; return; }

  let phraseIndex = 0, charIndex = 0, deleting = false;
  const typeSpeed = 75, holdTime = 1600;

  function tick() {
    const phrase = phrases[phraseIndex];
    if (!deleting) {
      typedEl.textContent = phrase.slice(0, ++charIndex);
      if (charIndex === phrase.length) setTimeout(() => (deleting = true), holdTime);
    } else {
      typedEl.textContent = phrase.slice(0, --charIndex);
      if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
    }
    setTimeout(tick, typeSpeed);
  }
  tick();
})();

// Footer Year
document.getElementById('year').textContent = new Date().getFullYear();
