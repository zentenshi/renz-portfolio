// ---------- Yin / Yang theme toggle ----------
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const STORAGE_KEY = 'rbv-theme';

function applyTheme(theme){
  if(theme === 'yin'){
    root.setAttribute('data-theme', 'yin');
  } else {
    root.removeAttribute('data-theme');
  }
}

const saved = localStorage.getItem(STORAGE_KEY);
if(saved){
  applyTheme(saved);
} else if(window.matchMedia('(prefers-color-scheme: dark)').matches){
  applyTheme('yin');
}

toggle.addEventListener('click', () => {
  const isYin = root.getAttribute('data-theme') === 'yin';
  const next = isYin ? 'yang' : 'yin';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
});

// ---------- Reveal on scroll ----------
const revealables = document.querySelectorAll('.section, .hero-inner');
revealables.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('reveal-in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealables.forEach(el => io.observe(el));
