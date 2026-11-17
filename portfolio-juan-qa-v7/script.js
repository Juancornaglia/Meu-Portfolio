document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // 1. Tema claro / escuro
  const savedTheme = localStorage.getItem('juan-qa-v5-theme');
  if (savedTheme) root.dataset.theme = savedTheme;

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('juan-qa-v5-theme', next);
    });
  }

  // 2. Menu mobile
  const burger = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      navMenu.classList.toggle('is-open');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  // 3. Barra de progresso de rolagem
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    root.style.setProperty('--scroll', `${pct}%`);
  });

  // 4. Abas interativas "Como eu valido um sistema"
  const labTabs = document.querySelectorAll('.lab-tab');
  const labPanels = document.querySelectorAll('.lab-panel');

  labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      labTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      labPanels.forEach(p => {
        p.classList.remove('is-active');
        p.hidden = true;
      });

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(tab.dataset.target);
      if (panel) {
        panel.hidden = false;
        panel.classList.add('is-active');
      }
    });
  });

  // 5. Galeria de evidências do Case TCC + Lightbox
  const thumbs = document.querySelectorAll('.thumb');
  const viewerImg = document.getElementById('viewer-img');
  const viewerTitle = document.getElementById('viewer-title');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('is-active'));
      btn.classList.add('is-active');

      const src = btn.dataset.src;
      const title = btn.dataset.title;
      if (viewerImg && src) viewerImg.src = src;
      if (viewerTitle && title) viewerTitle.textContent = title;
      if (lightboxImg && src) lightboxImg.src = src;
      if (lightboxCaption && title) lightboxCaption.textContent = title;
    });
  });

  const openLightbox = () => {
    if (!lightbox) return;
    if (viewerImg && lightboxImg) lightboxImg.src = viewerImg.src;
    if (viewerTitle && lightboxCaption) lightboxCaption.textContent = viewerTitle.textContent;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Suporte para ampliar imagens na página de certificados (.cert-img-btn)
  const certImgBtns = document.querySelectorAll('.cert-img-btn');
  certImgBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.src;
      const title = btn.dataset.title;
      if (lightbox && lightboxImg && src) {
        lightboxImg.src = src;
        if (lightboxCaption && title) lightboxCaption.textContent = title;
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const openBtn = document.getElementById('open-lightbox');
  const stageTrigger = document.getElementById('stage-trigger');
  const closeBtn = document.getElementById('lightbox-close');
  const closeBg = document.getElementById('lightbox-close-bg');

  if (openBtn) openBtn.addEventListener('click', openLightbox);
  if (stageTrigger) stageTrigger.addEventListener('click', openLightbox);
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (closeBg) closeBg.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.getAttribute('aria-hidden') === 'false') {
      closeLightbox();
    }
  });

  // 6. Simulador rápido de QA no rodapé
  const bugBtn = document.getElementById('bug-hunt-btn');
  const bugCounter = document.getElementById('bug-counter');
  const bugMsg = document.getElementById('bug-msg');
  const qaLogs = [
    '✓ Bug isolado: campo numérico aceitando negativo.',
    '✓ Contrato JSON validado com sucesso no Postman.',
    '✓ Query Oracle/PostgreSQL confirmou integridade das FKs.',
    '✓ Suíte Cypress E2E executada sem regressões.'
  ];
  let count = 0;

  if (bugBtn) {
    bugBtn.addEventListener('click', () => {
      count += 1;
      if (bugCounter) bugCounter.textContent = String(count);
      if (bugMsg) bugMsg.textContent = qaLogs[(count - 1) % qaLogs.length];
    });
  }

  // 7. Animação suave de entrada
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => obs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }
});
