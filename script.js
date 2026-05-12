// ── Language toggle ───────────────────────────────────────────────────────────
function setLang(l) {
  document.documentElement.dataset.lang = l;
  document.querySelectorAll(".lang-btn").forEach(b =>
    b.classList.toggle("on", b.dataset.lang === l)
  );
}

// ── Theme toggle ──────────────────────────────────────────────────────────────
function setTheme(t) {
  document.documentElement.dataset.theme = t === "dark" ? "dark" : "";
  document.getElementById("theme-btn").textContent = t === "dark" ? "☾" : "☀";
  window.__siteTheme = t;
}

// ── Active nav tracking ───────────────────────────────────────────────────────
function setActive(id) {
  document.querySelectorAll(".nav-link").forEach(a =>
    a.classList.toggle("active", a.dataset.id === id)
  );
}

// ── Chat demo sequences ───────────────────────────────────────────────────────
const CHAT_SEQ = {
  es: [
    { role: 'user', text: '¿Cuánto vendimos en abril?' },
    { role: 'bot',  text: 'Abril cerró en $247.300 — ↑14% vs marzo. Mejor mes del año hasta ahora.' },
    { role: 'user', text: 'Generá un resumen para el directorio' },
    { role: 'bot',  text: 'Listo. Armé el informe ejecutivo. 📎 resumen_abril.pdf' },
  ],
  en: [
    { role: 'user', text: 'How much did we sell in April?' },
    { role: 'bot',  text: 'April closed at $247,300 — ↑14% vs March. Best month of the year so far.' },
    { role: 'user', text: 'Generate a summary for the board' },
    { role: 'bot',  text: 'Done. I generated the executive report. 📎 summary_april.pdf' },
  ]
};

// ── Hero horizontal scroll ────────────────────────────────────────────────────
function initHeroScroll() {
  const hero   = document.getElementById("inicio");
  const track  = document.getElementById("hero-track");
  const fill   = document.getElementById("hero-bar-fill");
  const ticks  = document.querySelectorAll(".hero-tick");
  const scenes = track ? track.querySelectorAll(".scene").length : 5;

  const sections = ["hero-landing", "inicio", "clientes", "proyectos", "contacto"];

  const onScroll = () => {
    if (!hero || !track) return;

    // Hero progress
    const rect  = hero.getBoundingClientRect();
    const total = hero.offsetHeight - window.innerHeight;
    const p     = Math.min(1, Math.max(0, -rect.top / total));

    if (fill) fill.style.width = `${p * 100}%`;
    track.style.transform = `translateX(-${p * (scenes - 1) * 100}vw)`;

    const sceneIdx = Math.min(scenes - 1, Math.floor(p * scenes * 0.999));
    ticks.forEach((t, i) => t.classList.toggle("on", i <= sceneIdx));
    if (window.__chatDemo) {
      if (sceneIdx === 2) window.__chatDemo.start();
      else               window.__chatDemo.stop();
    }

    // Active section
    let cur = "inicio";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id;
    }
    setActive(cur);
  };

  onScroll();
  window.removeEventListener("scroll", window.__heroScroll);
  window.__heroScroll = onScroll;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
}

// ── Chat demo engine ──────────────────────────────────────────────────────────
function initChatDemo() {
  const body = document.getElementById('chat-body');
  if (!body) return;
  let loopId = null, active = false;

  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  function makeTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'chat-typing';
    for (let i = 0; i < 3; i++) el.appendChild(document.createElement('span'));
    return el;
  }

  async function typewriter(el, text, speed) {
    for (const ch of text) {
      el.textContent += ch;
      await delay(speed);
    }
  }

  async function run() {
    body.textContent = '';
    const lang = document.documentElement.dataset.lang || 'es';
    const msgs = CHAT_SEQ[lang];

    for (const msg of msgs) {
      if (!active) return;
      if (msg.role === 'user') {
        await delay(450);
        const el = document.createElement('div');
        el.className = 'chat-msg user';
        el.textContent = msg.text;
        body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        await delay(500);
      } else {
        const typing = makeTypingIndicator();
        body.appendChild(typing);
        await delay(1300);
        if (!active) return;
        typing.remove();
        const el = document.createElement('div');
        el.className = 'chat-msg bot show';
        body.appendChild(el);
        await typewriter(el, msg.text, 32);
        await delay(600);
      }
    }

    await delay(2200);
    if (active) loopId = setTimeout(run, 0);
  }

  return {
    start() { if (active) return; active = true; run(); },
    stop()  { active = false; clearTimeout(loopId); body.textContent = ''; }
  };
}

// ── Proyectos accordion ───────────────────────────────────────────────────────
function initAccordion() {
  document.querySelectorAll(".proy-row").forEach(row => {
    row.addEventListener("click", () => {
      const wasOpen = row.classList.contains("expanded");
      document.querySelectorAll(".proy-row").forEach(r => {
        r.classList.remove("expanded");
        const btn = r.querySelector(".open");
        if (btn) btn.textContent = "[ + ]";
      });
      if (!wasOpen) {
        row.classList.add("expanded");
        const btn = row.querySelector(".open");
        if (btn) btn.textContent = "[ — ]";
      }
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  window.__siteTheme = "light";

  document.querySelectorAll(".lang-btn").forEach(btn =>
    btn.addEventListener("click", () => setLang(btn.dataset.lang))
  );

  document.getElementById("theme-btn").addEventListener("click", () =>
    setTheme(window.__siteTheme === "dark" ? "light" : "dark")
  );

  initHeroScroll();
  window.__chatDemo = initChatDemo();
  initAccordion();
});
