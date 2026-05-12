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

// ── Hero horizontal scroll ────────────────────────────────────────────────────
function initHeroScroll() {
  const hero   = document.getElementById("inicio");
  const track  = document.getElementById("hero-track");
  const fill   = document.getElementById("hero-bar-fill");
  const ticks  = document.querySelectorAll(".hero-tick");
  const scenes = track ? track.querySelectorAll(".scene").length : 5;

  const sections = ["hero-landing", "inicio", "clientes", "soluciones", "proyectos", "contacto"];

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

    // Active section
    let cur = "inicio";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id;
    }
    setActive(cur === "clientes" ? "soluciones" : cur);
  };

  onScroll();
  window.removeEventListener("scroll", window.__heroScroll);
  window.__heroScroll = onScroll;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
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
  initAccordion();
});
