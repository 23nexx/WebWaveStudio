(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const mm = (q) => (window.matchMedia ? window.matchMedia(q).matches : false);
  const prefersReducedMotion = mm("(prefers-reduced-motion: reduce)");
  const canHover = mm("(hover: hover)");

  // ✅ mete false quando já não precisares
  const DEBUG = false;
  const log = (...a) => DEBUG && console.log("[WebWave]", ...a);
  const warn = (...a) => DEBUG && console.warn("[WebWave]", ...a);

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initFooterYear();
    initReviews();
    initMetricCount();
    initRevealOnScroll();
    initHeroCardTilt();
    initPortfolioTabs();
    initPortfolioModal();
    initBinaryWave(); // só corre se existir #bw-track
  });

  /* ============================
     MOBILE NAV
  ============================ */
  function initMobileNav() {
    const navToggle = $("#nav-toggle");
    const navLinks = $("#nav-links");
    if (!navToggle || !navLinks) return;

    navToggle.setAttribute("aria-expanded", "false");

    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    $$("a", navLinks).forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("open")) return;
      const inside =
        navLinks.contains(e.target) || navToggle.contains(e.target);
      if (!inside) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ============================
     FOOTER YEAR
  ============================ */
  function initFooterYear() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  /* ============================
     REVIEWS
  ============================ */
  function initReviews() {
    const reviewTrack = $("#review-track");
    if (!reviewTrack) return;

    const reviews = [
      {
        text: "“Processo rápido, comunicação clara e resultado final impecável.”",
        author: "— Filipe Rocha",
        stars: 5,
      },
      {
        text: "“O site ficou moderno e leve. Notámos mais contactos logo na primeira semana.”",
        author: "— Marta Silva",
        stars: 5,
      },
      {
        text: "“Design limpo e ótima experiência no telemóvel.”",
        author: "— Catarina Costa",
        stars: 5,
      },
      {
        text: "“Muito acima do esperado. Trabalho profissional.”",
        author: "— Inês Lopes",
        stars: 5,
      },
    ];

    const renderStars = (n) =>
      Array.from({ length: 5 }, (_, i) => {
        const filled = i < n ? "filled" : "";
        return `<span class="star ${filled}">★</span>`;
      }).join("");

    const cards = reviews
      .map(
        (r) => `
          <div class="card review-card">
            <p class="review-text">${r.text}</p>
            <p class="review-author">${r.author}</p>
            <div class="review-stars">${renderStars(r.stars)}</div>
          </div>
        `,
      )
      .join("");

    reviewTrack.innerHTML = prefersReducedMotion ? cards : cards + cards;
  }

  /* ============================
     METRIC COUNT
  ============================ */
  function initMetricCount() {
    const metricEl = $("#metric-clientes");
    if (!metricEl) return;

    const target = 100;
    const duration = 2500;

    let raf = null;
    let start = null;

    const setValue = (v) => {
      metricEl.textContent = `+${v}`;
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      start = null;
    };

    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value = Math.floor(progress * target);
      setValue(value);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    setValue(0);

    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting) {
          stop();
          raf = requestAnimationFrame(animate);
        } else {
          stop();
          setValue(0);
        }
      },
      { threshold: 0.6 },
    );

    obs.observe(metricEl);
  }

  /* ============================
     REVEAL ON SCROLL
  ============================ */
  function initRevealOnScroll() {
    const revealEls = $$(".service-card, .portfolio-card, .contact-options a");
    if (!revealEls.length) return;

    if (prefersReducedMotion) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
          else e.target.classList.remove("is-visible");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    revealEls.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--delay", `${(i % 6) * 70}ms`);
      io.observe(el);
    });

    const heroCard = $(".hero-card");
    if (heroCard) {
      heroCard.classList.add("reveal");
      heroCard.style.setProperty("--delay", `120ms`);
      io.observe(heroCard);
    }
  }

  /* ============================
     HERO CARD TILT
  ============================ */
  function initHeroCardTilt() {
    const heroCard = $(".hero-card");
    if (!heroCard || prefersReducedMotion || !canHover) return;

    heroCard.addEventListener("mousemove", (e) => {
      const r = heroCard.getBoundingClientRect();
      heroCard.style.setProperty(
        "--mx",
        `${((e.clientX - r.left) / r.width) * 100}%`,
      );
      heroCard.style.setProperty(
        "--my",
        `${((e.clientY - r.top) / r.height) * 100}%`,
      );
    });

    heroCard.addEventListener("mouseleave", () => {
      heroCard.style.removeProperty("--mx");
      heroCard.style.removeProperty("--my");
    });
  }

  /* ============================
     PORTFOLIO TABS
  ============================ */
  function initPortfolioTabs() {
    const tabs = $$(".tab-btn");
    const cards = $$(".portfolio-card");
    if (!tabs.length || !cards.length) return;

    const setActive = (btn) => {
      tabs.forEach((b) => b.classList.toggle("is-active", b === btn));
      tabs.forEach((b) =>
        b.setAttribute("aria-selected", b === btn ? "true" : "false"),
      );
    };

    const apply = (filter) => {
      cards.forEach((c) => {
        c.hidden = filter !== "all" && c.dataset.category !== filter;
      });
    };

    const initial = tabs.find((t) => t.dataset.filter === "all") || tabs[0];
    setActive(initial);
    apply(initial.dataset.filter || "all");

    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        setActive(btn);
        apply(btn.dataset.filter || "all");
      });
    });
  }

  /* ============================
     PORTFOLIO MODAL (fix final)
  ============================ */
  function initPortfolioModal() {
    const modal = $("#portfolio-modal");
    const titleEl = $("#portfolio-modal-title");
    const stage = $("#viewer-stage");
    const counter = $("#viewer-counter");
    const prevBtn = $("[data-viewer-prev]");
    const nextBtn = $("[data-viewer-next]");

    if (!modal || !stage || !counter || !prevBtn || !nextBtn) {
      warn("Modal missing elements", {
        modal,
        stage,
        counter,
        prevBtn,
        nextBtn,
      });
      return;
    }

    // ⚠️ GitHub Pages é case-sensitive. Se uma pasta/vídeo estiver com nome diferente -> 404.
    const DEMOS = {
      servicos: {
        title: "Landing de Serviços — LumiWorks",
        slides: [{ type: "video", src: "assets.lumiworks/LumiWorks.mp4" }],
      },
      saas: {
        title: "Startup / SaaS",
        slides: [{ type: "video", src: "assets.saas/saas.mp4" }],
      },
      ecommerce: {
        title: "E-commerce — Noise District",
        slides: [{ type: "video", src: "assets.ecom/noise-district.mp4" }],
      },
      restauracao: {
        title: "Restaurante & Cafés",
        slides: [{ type: "video", src: "assets.rest/Rest.VID.mp4" }],
      },
      barbearia: {
        title: "Website de Barbearia — Craft",
        slides: [
          { type: "video", src: "assets.Barber/CraftClient.mp4" },
          { type: "video", src: "assets.Barber/CraftBarber.mp4" },
        ],
      },
      estetica: {
        title: "Estética / Clínica — Emera",
        slides: [{ type: "video", src: "assets.estetica/Emera.mp4" }],
      },
      alojamento: {
        title: "Alojamento Local — TripNest",
        slides: [{ type: "video", src: "assets.tripnest/TripNest.mp4" }],
      },
    };

    let slides = [];
    let index = 0;

    const lockScroll = (lock) => {
      document.documentElement.style.overflow = lock ? "hidden" : "";
      document.body.style.overflow = lock ? "hidden" : "";
    };

    const destroyStage = () => {
      const v = $("video", stage);
      if (v) {
        try {
          v.pause();
        } catch (_) {}
        v.removeAttribute("src");
        v.load();
      }
      stage.innerHTML = "";
    };

    const showError = (msg) => {
      destroyStage();
      stage.innerHTML = `<div class="viewer-empty">
        <p><strong>Não deu para carregar a demo.</strong></p>
        <p style="opacity:.85">${String(msg)}</p>
      </div>`;
      counter.textContent = "0 / 0";
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    };

    const render = () => {
      destroyStage();

      const s = slides[index];
      if (!s) {
        showError("Sem slides configurados para esta demo.");
        return;
      }

      if (s.type === "video") {
        const v = document.createElement("video");
        v.className = "viewer-media";
        v.src = s.src;
        v.controls = true;
        v.autoplay = true;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.preload = "metadata";

        v.addEventListener("error", () => {
          showError(`Erro/404 no vídeo: ${s.src}`);
        });

        stage.appendChild(v);
        v.play().catch(() => {});
      } else {
        const img = document.createElement("img");
        img.className = "viewer-media";
        img.src = s.src;
        img.alt = "Demo";

        img.addEventListener("error", () => {
          showError(`Erro/404 na imagem: ${s.src}`);
        });

        stage.appendChild(img);
      }

      counter.textContent = `${index + 1} / ${slides.length}`;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
    };

    const openModal = (key) => {
      const k = String(key || "").trim();
      const cfg = DEMOS[k];

      if (!cfg) {
        modal.hidden = false;
        modal.removeAttribute("hidden");
        lockScroll(true);
        if (titleEl) titleEl.textContent = "Demo";
        showError(
          `Não existe DEMOS["${k}"]. O data-open-portfolio não bate com as keys.`,
        );
        return;
      }

      slides = Array.isArray(cfg.slides) ? cfg.slides : [];
      index = 0;

      if (titleEl) titleEl.textContent = cfg.title || "Demo";

      modal.hidden = false;
      modal.removeAttribute("hidden");
      lockScroll(true);

      render();
    };

    const closeModal = () => {
      destroyStage();
      modal.hidden = true;
      modal.setAttribute("hidden", "");
      lockScroll(false);
    };

    // ✅ Delegation: abre/fecha sem depender de binds em cada botão
    document.addEventListener(
      "click",
      (e) => {
        const openBtn = e.target.closest("[data-open-portfolio]");
        if (openBtn) {
          e.preventDefault();
          openModal(openBtn.getAttribute("data-open-portfolio"));
          return;
        }

        const closeBtn = e.target.closest("[data-close-portfolio]");
        if (closeBtn) {
          e.preventDefault();
          closeModal();
        }
      },
      true,
    );

    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (index > 0) {
        index -= 1;
        render();
      }
    });

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (index < slides.length - 1) {
        index += 1;
        render();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft" && index > 0) {
        index -= 1;
        render();
      }
      if (e.key === "ArrowRight" && index < slides.length - 1) {
        index += 1;
        render();
      }
    });

    log("Portfolio modal ready. Keys:", Object.keys(DEMOS));
  }

  /* ============================
     HERO — DIGITAL RAIN (#bw-track)
     (no teu HTML atual não existe, por isso não faz nada)
  ============================ */
  function initBinaryWave() {
    const track = $("#bw-track");
    if (!track) return;

    const COLS = 22;
    const LEN = 240;
    const randBit = () => (Math.random() > 0.5 ? "1" : "0");

    track.innerHTML = "";

    for (let i = 0; i < COLS; i++) {
      const col = document.createElement("span");
      col.className = "bw-col";

      let s = "";
      for (let j = 0; j < LEN; j++) s += randBit();
      col.textContent = s;

      col.style.animationDelay = `${-(Math.random() * 10).toFixed(2)}s`;
      col.style.animationDuration = `${(7 + Math.random() * 8).toFixed(2)}s`;
      col.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);

      track.appendChild(col);
    }

    if (prefersReducedMotion) return;

    setInterval(() => {
      const cols = track.children;
      for (let i = 0; i < cols.length; i++) {
        if (Math.random() < 0.22) {
          const t = cols[i].textContent;
          if (!t || t.length < 5) continue;
          const k = (Math.random() * t.length) | 0;
          cols[i].textContent =
            t.slice(0, k) + (t[k] === "1" ? "0" : "1") + t.slice(k + 1);
        }
      }
    }, 180);
  }

  function initBinaryWave() {
    const container = document.querySelector(".hero-binarywave");
    if (!container) return;

    const layers = Array.from(container.querySelectorAll(".rain"));
    if (!layers.length) return;

    const COLS = 22; // nº de colunas
    const ROWS = 70; // nº de bits por coluna (ajusta)
    const randBit = () => (Math.random() > 0.5 ? "1" : "0");

    // limpa e gera colunas por layer
    layers.forEach((layer, layerIndex) => {
      layer.innerHTML = "";

      for (let i = 0; i < COLS; i++) {
        const col = document.createElement("div");
        col.className = "col";

        // enche a coluna com spans (para o teu CSS .hero-binarywave .col)
        for (let j = 0; j < ROWS; j++) {
          const bit = document.createElement("span");
          bit.textContent = randBit();
          col.appendChild(bit);
        }

        // variações leves por layer
        const baseDelay = Math.random() * 8;
        const baseDur = 7 + Math.random() * 8;

        col.style.animationDelay = `${-(baseDelay + layerIndex)}s`;
        col.style.animationDuration = `${(baseDur + layerIndex * 1.2).toFixed(2)}s`;
        col.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);

        layer.appendChild(col);
      }
    });

    // se reduced motion, não faz shimmer
    if (prefersReducedMotion) return;

    // shimmer: troca uns bits aleatórios sem matar performance
    setInterval(() => {
      layers.forEach((layer) => {
        const cols = layer.children;
        for (let i = 0; i < cols.length; i++) {
          if (Math.random() < 0.18) {
            const spans = cols[i].querySelectorAll("span");
            if (!spans.length) continue;
            const k = (Math.random() * spans.length) | 0;
            spans[k].textContent = spans[k].textContent === "1" ? "0" : "1";
          }
        }
      });
    }, 160);
  }
})();
