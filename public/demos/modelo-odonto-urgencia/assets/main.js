/* ============================================================
   MODELO — ODONTOLOGIA DE URGÊNCIA · interações & animações
   GSAP + ScrollTrigger + Lenis (smooth scroll)
   ============================================================ */
document.documentElement.classList.add("js");

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Ano dinâmico ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Relógio do card (plantão ao vivo) ---------- */
const clockEl = document.getElementById("heroClock");
function tickClock() {
  if (!clockEl) return;
  const now = new Date();
  clockEl.textContent =
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0");
}
tickClock();
setInterval(tickClock, 1000 * 20);

/* ---------- Preloader ---------- */
const preloader = document.getElementById("preloader");
const preBar = preloader ? preloader.querySelector(".preloader__bar span") : null;

function finishPreloader() {
  if (!preloader) return runIntro();
  if (preBar) preBar.style.transition = "width .5s ease";
  if (preBar) preBar.style.width = "100%";
  setTimeout(() => {
    preloader.classList.add("is-done");
    runIntro();
  }, 500);
}

/* ---------- Menu mobile ---------- */
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
function toggleMenu(force) {
  const open = force !== undefined ? force : !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", open);
  mobileMenu.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  mobileMenu.setAttribute("aria-hidden", String(!open));
}
if (navToggle) navToggle.addEventListener("click", () => toggleMenu());
mobileMenu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

/* ============================================================
   LENIS SMOOTH SCROLL
   ============================================================ */
let lenis = null;
if (!prefersReduced && window.Lenis) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* Âncoras suaves (com ou sem Lenis) */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else target.scrollIntoView({ behavior: "smooth" });
  });
});

/* ============================================================
   GSAP
   ============================================================ */
const hasGSAP = window.gsap && window.ScrollTrigger;
if (hasGSAP) {
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

/* ---------- Split das linhas do hero ---------- */
function runIntro() {
  if (!hasGSAP || prefersReduced) return;

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.fromTo(".hero .eyebrow", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
    .from(".hero__title .line > span", { yPercent: 115, duration: 1.0, stagger: 0.1 }, 0.1)
    .fromTo(".hero__lead", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.5)
    .fromTo(".hero__actions", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.62)
    .fromTo(".hero__trust", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.74)
    .fromTo(".hero__figure", { opacity: 0, y: 44, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1.0 }, 0.5);
}

/* ---------- Reveals genéricos on-scroll ---------- */
function setupReveals() {
  if (!hasGSAP) {
    document.querySelectorAll("[data-reveal], [data-reveal-lines] > *").forEach((el) => (el.style.opacity = 1));
    return;
  }
  if (prefersReduced) return;

  // elementos simples
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    // pula os que fazem parte da timeline do hero
    if (el.closest(".hero")) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 34 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      }
    );
  });

  // títulos revelados por "linhas" (stagger nas palavras)
  gsap.utils.toArray("[data-reveal-lines]").forEach((title) => {
    const words = wrapWords(title);
    gsap.fromTo(
      words,
      { opacity: 0, yPercent: 60 },
      {
        opacity: 1, yPercent: 0, duration: 0.8, ease: "power3.out", stagger: 0.05,
        scrollTrigger: { trigger: title, start: "top 85%" },
      }
    );
  });
}

/* Envolve palavras em spans para animar (preserva <br> e <em>) */
function wrapWords(el) {
  const out = [];
  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((token) => {
          if (token.trim() === "") { frag.appendChild(document.createTextNode(token)); return; }
          const wrap = document.createElement("span");
          wrap.style.display = "inline-block";
          wrap.style.willChange = "transform";
          wrap.textContent = token;
          out.push(wrap);
          frag.appendChild(wrap);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1 && child.tagName !== "BR") {
        out.push(child);
        child.style.display = "inline-block";
      }
    });
  };
  walk(el);
  return out;
}

/* ---------- Contadores ---------- */
function setupCounters() {
  if (!hasGSAP) return;
  gsap.utils.toArray(".stat__num").forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const plain = el.dataset.plain === "true";
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        if (prefersReduced) { el.textContent = (plain ? end : Math.round(end)) + suffix; return; }
        gsap.to(obj, {
          v: end, duration: 1.6, ease: "power2.out",
          onUpdate: () => {
            const val = plain ? Math.round(obj.v) : Math.round(obj.v);
            el.textContent = (plain ? String(val) : val.toLocaleString("pt-BR")) + suffix;
          },
        });
      },
    });
  });
}

/* ---------- Marquee infinito ---------- */
function setupMarquee() {
  const track = document.getElementById("marquee");
  if (!track || !hasGSAP || prefersReduced) return;
  // duplica o conteúdo para loop contínuo
  track.innerHTML += track.innerHTML;
  const half = track.scrollWidth / 2;
  gsap.to(track, {
    x: -half,
    duration: 22,
    ease: "none",
    repeat: -1,
    modifiers: { x: (x) => (parseFloat(x) % half) + "px" },
  });
}

/* ---------- Parallax nos glows do hero ---------- */
function setupParallax() {
  if (!hasGSAP || prefersReduced) return;
  const st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".hero__blob--1", { yPercent: 24, ease: "none", scrollTrigger: st });
  gsap.to(".hero__blob--2", { yPercent: -16, ease: "none", scrollTrigger: st });
  gsap.to(".hero__dots", { yPercent: 14, ease: "none", scrollTrigger: st });
}

/* ---------- Linha de progresso dos passos ---------- */
function setupSteps() {
  const bar = document.getElementById("stepsProgress");
  if (!bar || !hasGSAP || prefersReduced) return;
  gsap.to(bar, {
    width: "100%", ease: "none",
    scrollTrigger: { trigger: ".steps__track", start: "top 70%", end: "bottom 70%", scrub: true },
  });
}

/* ---------- Nav sólida + FAB ao rolar ---------- */
function setupScrollState() {
  const fab = document.getElementById("fab");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-solid", y > 40);
    if (fab) fab.classList.toggle("is-visible", y > 500);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- FAQ: fecha os outros ao abrir (acordeão) ---------- */
function setupFaq() {
  const items = document.querySelectorAll(".faq__item");
  items.forEach((item) => {
    item.querySelector("summary").addEventListener("click", () => {
      if (!item.open) items.forEach((o) => { if (o !== item) o.open = false; });
    });
  });
}

/* ============================================================
   BOOT
   ============================================================ */
function init() {
  setupScrollState();
  setupReveals();
  setupCounters();
  setupMarquee();
  setupParallax();
  setupSteps();
  setupFaq();
  if (hasGSAP) ScrollTrigger.refresh();
}

window.addEventListener("load", () => {
  finishPreloader();
  init();
});

// fallback: se "load" demorar, revela mesmo assim
setTimeout(() => {
  if (preloader && !preloader.classList.contains("is-done")) finishPreloader();
}, 2600);
