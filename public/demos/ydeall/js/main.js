// Ydeall Clothes — interações do site

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  // Sombra no header ao rolar
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  // Fecha o menu ao clicar num link
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // Ano no rodapé
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Fotos publicadas no painel levam ~1 minuto pra entrar no ar (deploy da Netlify).
  // Se uma imagem falhar, tenta recarregar algumas vezes ao longo de ~2,5 min
  // antes de cair no placeholder — assim a foto "aparece sozinha" quando o deploy termina.
  const RETENTATIVAS_MS = [5000, 12000, 25000, 45000, 70000];
  const comRetentativa = (img, aoDesistir) => {
    const original = img.getAttribute('src');
    let tentativa = 0;
    img.addEventListener('error', () => {
      if (tentativa < RETENTATIVAS_MS.length) {
        const espera = RETENTATIVAS_MS[tentativa++];
        setTimeout(() => {
          img.src = original + (original.includes('?') ? '&' : '?') + 'r=' + Date.now();
        }, espera);
      } else {
        aoDesistir(img);
      }
    });
  };

  // Fade-in suave: a foto entra com transição quando termina de carregar,
  // em vez de "pipocar" na tela.
  const fadeInAoCarregar = (img) => {
    img.classList.add('img-fade');
    const mostrar = () => img.classList.add('img-carregada');
    if (img.complete && img.naturalWidth > 0) mostrar(); // já veio do cache
    else img.addEventListener('load', mostrar, { once: true });
  };

  // Destaque do topo — foto principal, etiqueta e frase (editável no /admin → "Destaque do topo")
  const heroFrame = document.querySelector('.hero__frame');
  const heroTag = document.querySelector('.hero__frame-tag');
  const heroSub = document.querySelector('.hero__sub');
  fetch('data/topo.json', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no data'))))
    .then((data) => {
      if (!data) return;
      if (heroTag && data.etiqueta) heroTag.textContent = data.etiqueta;
      if (heroSub && data.subtitulo) heroSub.textContent = data.subtitulo;
      if (heroFrame && data.imagem) {
        heroFrame.removeAttribute('data-label'); // esconde o texto placeholder
        const img = document.createElement('img');
        img.src = data.imagem;
        img.alt = 'Destaque da coleção Ydeall';
        img.className = 'hero__frame-img';
        // Primeira imagem que o visitante vê: baixa antes das outras
        img.setAttribute('fetchpriority', 'high');
        fadeInAoCarregar(img);
        // Se a foto tiver sido apagada de vez, volta pro placeholder elegante
        comRetentativa(img, () => {
          img.remove();
          heroFrame.setAttribute('data-label', 'Foto do topo');
        });
        heroFrame.insertBefore(img, heroFrame.firstChild);
      }
    })
    .catch(() => {
      /* file:// ou sem JSON: mantém o placeholder do HTML */
    });

  // Estrelas douradas 3D no fundo do hero — passeiam devagar e reagem ao mouse.
  // Cada estrela tem uma "profundidade": as próximas são maiores, andam mais
  // rápido e respondem mais ao parallax; as distantes, menores e desfocadas.
  const heroSec = document.getElementById('hero');
  const starsBox = document.querySelector('.hero__stars');
  if (heroSec && starsBox) {
    const QTD_ESTRELAS = 26;
    const MARGEM = 40; // sai por completo de um lado antes de voltar no outro
    const estrelas = [];
    for (let i = 0; i < QTD_ESTRELAS; i++) {
      const el = document.createElement('span');
      el.className = 'hero__star';
      el.textContent = '✦';
      const prof = 0.2 + Math.random() * 0.8;
      el.style.top = (Math.random() * 96 + 2) + '%';
      el.style.fontSize = (7 + prof * 13).toFixed(1) + 'px';
      el.style.setProperty('--o', (0.2 + prof * 0.45).toFixed(2));
      el.style.animationDuration = (3 + Math.random() * 4).toFixed(1) + 's';
      el.style.animationDelay = (-Math.random() * 6).toFixed(1) + 's';
      if (prof < 0.45) el.style.filter = 'blur(0.6px)';
      starsBox.appendChild(el);
      estrelas.push({ el, prof, fx: Math.random(), drift: 0, fase: Math.random() * Math.PI * 2 });
    }

    let alvoX = 0, alvoY = 0, mX = 0, mY = 0;
    heroSec.addEventListener('mousemove', (e) => {
      const r = heroSec.getBoundingClientRect();
      alvoX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      alvoY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    heroSec.addEventListener('mouseleave', () => { alvoX = 0; alvoY = 0; });

    let larg = starsBox.clientWidth;
    window.addEventListener('resize', () => { larg = starsBox.clientWidth; });

    let t = 0;
    let rodando = false;
    let rafId = 0;
    const anima = () => {
      t += 1;
      mX += (alvoX - mX) * 0.05; // suaviza a resposta ao mouse
      mY += (alvoY - mY) * 0.05;
      const faixa = larg + MARGEM;
      estrelas.forEach((s) => {
        s.drift += 0.08 + s.prof * 0.12; // passeio lento da esquerda pra direita
        const x = ((s.fx * faixa + s.drift) % faixa) - MARGEM;
        const balanco = Math.sin(t * 0.006 + s.fase) * 6 * s.prof;
        const px = mX * 34 * s.prof;
        const py = mY * 22 * s.prof;
        s.el.style.transform = `translate3d(${(x + px).toFixed(1)}px, ${(balanco + py).toFixed(1)}px, 0)`;
      });
      rafId = requestAnimationFrame(anima);
    };

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento) {
      // Usuário pediu menos movimento no sistema: estrelas ficam paradas
      estrelas.forEach((s) => {
        s.el.style.transform = `translate3d(${(s.fx * larg).toFixed(1)}px, 0, 0)`;
      });
    } else if ('IntersectionObserver' in window) {
      // Anima só enquanto o hero está visível na tela
      const ioHero = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !rodando) {
            rodando = true;
            rafId = requestAnimationFrame(anima);
          } else if (!entry.isIntersecting && rodando) {
            rodando = false;
            cancelAnimationFrame(rafId);
          }
        });
      });
      ioHero.observe(heroSec);
    } else {
      rodando = true;
      rafId = requestAnimationFrame(anima);
    }
  }

  // Peças em destaque — renderiza a partir de data/novidades.json (editável pela Samira no /admin)
  const WHATS = '5543988090574';
  const prodGrid = document.getElementById('prodGrid');

  const escapeHtml = (s) =>
    String(s || '').replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  const pecaCard = (p) => {
    const nome = escapeHtml(p.nome);
    const tag = escapeHtml(p.tag || 'Sob encomenda');
    const msg = encodeURIComponent(`Oi! Gostei do(a) ${p.nome} ✨`);
    const media = p.imagem
      ? `<div class="prod-card__media"><img src="${escapeHtml(p.imagem)}" alt="${nome}" loading="lazy" /></div>`
      : `<div class="prod-card__media" data-label="Foto da peça"></div>`;
    return `
      <article class="prod-card">
        ${media}
        <div class="prod-card__info">
          <h3>${nome}</h3>
          <p class="prod-card__tag">${tag}</p>
          <a class="prod-card__cta" href="https://wa.me/${WHATS}?text=${msg}" target="_blank" rel="noopener">Encomendar →</a>
        </div>
      </article>`;
  };

  if (prodGrid) {
    fetch('data/novidades.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no data'))))
      .then((data) => {
        if (!data || !Array.isArray(data.pecas) || !data.pecas.length) return; // mantém o fallback do HTML
        prodGrid.innerHTML = data.pecas.map(pecaCard).join('');
        prodGrid.querySelectorAll('.prod-card__media img').forEach((img) => {
          fadeInAoCarregar(img);
          comRetentativa(img, (el) => {
            el.closest('.prod-card__media').setAttribute('data-label', 'Foto da peça');
            el.remove();
          });
        });
        // Atualiza título/subtítulo da seção, se vierem do CMS
        const head = document.querySelector('#novidades .section__title');
        const lead = document.querySelector('#novidades .section__lead');
        if (head && data.titulo_secao) head.textContent = data.titulo_secao;
        if (lead && data.subtitulo) lead.textContent = data.subtitulo;
      })
      .catch(() => {
        /* Sem servidor (file://) ou sem JSON: mantém os cards estáticos já no HTML. */
      });
  }

  // Coleção / Categorias — renderiza a partir de data/colecao.json (editável no /admin → "Coleção")
  const catGrid = document.getElementById('catGrid');

  const catCard = (c) => {
    const nome = escapeHtml(c.nome);
    const desc = escapeHtml(c.descricao || '');
    const msg = encodeURIComponent(`Oi! Quero ver ${c.nome} da Ydeall`);
    const img = c.imagem
      ? `<div class="cat-card__img"><img src="${escapeHtml(c.imagem)}" alt="${nome}" loading="lazy" /></div>`
      : `<div class="cat-card__img" data-cat="${nome}"></div>`;
    return `
      <a class="cat-card" href="https://wa.me/${WHATS}?text=${msg}" target="_blank" rel="noopener">
        ${img}
        <div class="cat-card__body"><h3>${nome}</h3><span>${desc}</span></div>
      </a>`;
  };

  if (catGrid) {
    fetch('data/colecao.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('no data'))))
      .then((data) => {
        if (!data || !Array.isArray(data.categorias) || !data.categorias.length) return;
        catGrid.innerHTML = data.categorias.map(catCard).join('');
        catGrid.querySelectorAll('.cat-card__img img').forEach((img) => {
          fadeInAoCarregar(img);
          comRetentativa(img, (el) => {
            el.closest('.cat-card__img').setAttribute('data-cat', el.alt);
            el.remove();
          });
        });
        const head = document.querySelector('#categorias .section__title');
        const lead = document.querySelector('#categorias .section__lead');
        if (head && data.titulo_secao) head.textContent = data.titulo_secao;
        if (lead && data.subtitulo) lead.textContent = data.subtitulo;
      })
      .catch(() => {
        /* mantém os cards estáticos do HTML */
      });
  }

  // Carrossel de depoimentos — duplica os cards para loop contínuo e sem salto
  const depoTrack = document.querySelector('.depo-track');
  if (depoTrack) {
    const originals = Array.from(depoTrack.children);
    originals.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      depoTrack.appendChild(clone);
    });
  }

  // Reveal on scroll
  const revealEls = document.querySelectorAll(
    '.section__head, .cat-card, .prod-card, .sobre__media, .sobre__text, .step, .cta-band__inner'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }
});
