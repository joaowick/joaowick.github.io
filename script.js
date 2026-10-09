/**
 * Portfolio João Torres - Interatividade & Acessibilidade
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initHeaderScroll();
  initActiveNavLink();
  initCurrentYear();
  initAnalytics();
  initPrintDetails();
});

/* --------------------------------------------------------------------------
   1. THEME SWITCHER (DARK / LIGHT MODE)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  let selectedTheme = null;
  try {
    const savedTheme = localStorage.getItem('jt-portfolio-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') selectedTheme = savedTheme;
  } catch {
    // Theme switching remains available when storage is blocked.
  }

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
    const label = theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.title = label;
  };

  applyTheme(selectedTheme || (systemTheme.matches ? 'dark' : 'light'));
  themeToggle.addEventListener('click', () => {
    selectedTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(selectedTheme);
    try {
      localStorage.setItem('jt-portfolio-theme', selectedTheme);
    } catch {
      // Keep the explicit choice for this page even without persistent storage.
    }
    showToast(selectedTheme === 'dark' ? 'Tema escuro ativado' : 'Tema claro ativado');
  });

  systemTheme.addEventListener('change', (e) => {
    if (!selectedTheme) applyTheme(e.matches ? 'dark' : 'light');
  });
}

/* --------------------------------------------------------------------------
   2. MOBILE NAVIGATION MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !nav) return;

  const toggleNav = (forceState = null) => {
    const isCurrentlyOpen = nav.classList.contains('open');
    const newState = forceState !== null ? forceState : !isCurrentlyOpen;

    if (newState) {
      nav.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
    } else {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    }
  };

  menuToggle.addEventListener('click', () => {
    toggleNav();
    requestAnimationFrame(() => {
      if (nav.classList.contains('open')) navLinks[0]?.focus();
    });
  });

  // Close when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleNav(false);
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      toggleNav(false);
      menuToggle.focus();
    }
  });

  // Close if clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
      toggleNav(false);
    }
  });

  window.matchMedia('(max-width: 768px)').addEventListener('change', () => toggleNav(false));
}

/* --------------------------------------------------------------------------
   3. HEADER SHADOW ON SCROLL
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   4. ACTIVE NAV LINK BASED ON SCROLL
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'location');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   9. TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
let toastTimeout = null;
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
    toastMessage.textContent = '';
  }, duration);
}

/* --------------------------------------------------------------------------
   10. CURRENT YEAR
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   11. ANALYTICS (GOATCOUNTER)
   -------------------------------------------------------------------------- */
function initAnalytics() {
  const track = (path, title) => {
    if (window.goatcounter && typeof window.goatcounter.count === 'function') {
      window.goatcounter.count({ path, title, event: true });
    }
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href.startsWith('mailto:')) track('clique-email', 'Clique no e-mail');
    else if (href.includes('linkedin.com')) track('clique-linkedin', 'Clique no LinkedIn');
  });
}

/* --------------------------------------------------------------------------
   12. IMPRESSÃO: ABRE OS DETALHES RECOLHIDOS (PDF DO CURRÍCULO)
   -------------------------------------------------------------------------- */
function initPrintDetails() {
  let reopened = [];
  window.addEventListener('beforeprint', () => {
    reopened = [...document.querySelectorAll('details:not([open])')];
    reopened.forEach(details => details.setAttribute('open', ''));
  });
  window.addEventListener('afterprint', () => {
    reopened.forEach(details => details.removeAttribute('open'));
    reopened = [];
  });
}
