/* ============================
   WebWave Studio — script.js
============================ */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canHover =
    window.matchMedia && window.matchMedia("(hover: hover)").matches;

  /* ============================
     MOBILE NAV
  ============================ */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.setAttribute("aria-expanded", "false");

    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.setAttribute(
        "aria-expanded",
        navLinks.classList.contains("open") ? "true" : "false"
      );
    });

    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("open")) return;
      const clickedInside =
        navLinks.contains(e.target) || navToggle.contains(e.target);
      if (!clickedInside) {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ============================
     FOOTER YEAR
  ============================ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================
     REVIEWS (render + loop)
  ============================ */
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
      text: "“A estrutura ficou bem organizada e o design transmite confiança.”",
      author: "— Luís Monteiro",
      stars: 5,
    },
    {
      text: "“Foram diretos ao ponto e entregaram exatamente o que pedimos.”",
      author: "— Ana Pereira",
      stars: 5,
    },
    {
      text: "“Excelente atenção ao detalhe. O texto ficou muito mais profissional.”",
      author: "— Ricardo Santos",
      stars: 5,
    },
    {
      text: "“Rápidos nas revisões e sempre disponíveis para ajustar.”",
      author: "— Joana Almeida",
      stars: 5,
    },
    {
      text: "“O nosso WhatsApp começou a receber mais pedidos depois do novo site.”",
      author: "— Tiago Martins",
      stars: 5,
    },
    {
      text: "“Design limpo e ótima experiência no telemóvel.”",
      author: "— Catarina Costa",
      stars: 5,
    },
    {
      text: "“Explicaram tudo com clareza e trataram da publicação sem stress.”",
      author: "— Bruno Ferreira",
      stars: 5,
    },
    {
      text: "“Parecia uma empresa grande a fazer o projeto. Muito acima do esperado.”",
      author: "— Inês Lopes",
      stars: 5,
    },
    {
      text: "“Ficou tudo mais simples para os clientes marcarem e perceberem os serviços.”",
      author: "— Pedro Ribeiro",
      stars: 5,
    },
    {
      text: "“O site carrega rápido e ficou mesmo com aspeto premium.”",
      author: "— Sofia Neves",
      stars: 5,
    },
    {
      text: "“Ótimo gosto no design. O branding ficou mais consistente.”",
      author: "— Miguel Carvalho",
      stars: 5,
    },
    {
      text: "“Organização perfeita das secções. Agora está tudo mais profissional.”",
      author: "— Daniela Gomes",
      stars: 5,
    },
    {
      text: "“Ajudaram-nos a escolher o melhor texto e a chamada para ação.”",
      author: "— Hugo Correia",
      stars: 5,
    },
    {
      text: "“Suporte pós-entrega excelente. Ajustaram detalhes rapidamente.”",
      author: "— Beatriz Rocha",
      stars: 5,
    },
    {
      text: "“Trabalho limpo e objetivo. Era exatamente o que precisávamos.”",
      author: "— André Sousa",
      stars: 5,
    },
    {
      text: "“O design ficou alinhado com o nosso negócio. Site super fluido.”",
      author: "— Mariana Duarte",
      stars: 5,
    },
    {
      text: "“Prazos curtos sem perder qualidade. Muito bons.”",
      author: "— Nuno Mendes",
      stars: 5,
    },
    {
      text: "“Recomendamos: entrega rápida e comunicação fácil.”",
      author: "— Lara Fernandes",
      stars: 5,
    },
  ];

  const track = document.getElementById("review-track");

  const escapeHTML = (str) =>
    String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const renderStars = (count) => {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      html += `<span class="star ${i <= count ? "filled" : ""}">★</span>`;
    }
    return html;
  };

  const buildReviewCard = ({ text, author, stars }) => `
    <div class="card review-card">
      <p class="review-text">${escapeHTML(text)}</p>
      <p class="review-author">${escapeHTML(author)}</p>
      <div class="review-stars">${renderStars(stars)}</div>
    </div>
  `;

  if (track) {
    const base = reviews.map(buildReviewCard).join("");
    if (prefersReducedMotion) {
      track.style.animation = "none";
      track.innerHTML = base;
    } else {
      track.innerHTML = base + base;
    }
  }

  /* ============================
     METRIC COUNT (+100)
  ============================ */
  const metricEl = document.getElementById("metric-clientes");
  const targetValue = 100;
  const duration = 3200;

  let rafId = null;
  let isAnimating = false;

  const setMetric = (v) => {
    if (!metricEl) return;
    metricEl.textContent = `+${v}`;
  };

  const stopAnimation = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    isAnimating = false;
  };

  const animateCount = () => {
    if (!metricEl) return;

    if (prefersReducedMotion) {
      setMetric(targetValue);
      return;
    }
    if (isAnimating) return;

    stopAnimation();
    isAnimating = true;

    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(targetValue * eased);
      setMetric(value);

      if (progress < 1) rafId = requestAnimationFrame(tick);
      else isAnimating = false;
    };

    rafId = requestAnimationFrame(tick);
  };

  if (metricEl) {
    setMetric(0);
    const metricObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) animateCount();
          else {
            stopAnimation();
            setMetric(0);
          }
        });
      },
      { threshold: 0.6 }
    );
    metricObserver.observe(metricEl);
  }

  /* ============================
     REVEAL ON SCROLL (stagger)
  ============================ */
  const revealTargets = Array.from(
    document.querySelectorAll(
      ".service-card, .pricing-card, .pricing-addon-inner, .portfolio-card, .about-side .card, .contact-options a, .about-reveal, .about-reveal-card"
    )
  );

  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--delay", `${(i % 6) * 70}ms`);
  });

  if (revealTargets.length) {
    if (prefersReducedMotion) {
      revealTargets.forEach((el) => el.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add("is-visible");
            else entry.target.classList.remove("is-visible");
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );
      revealTargets.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ============================
     HERO MOCKUP REVEAL + glow follow
  ============================ */
  const heroCard = document.querySelector(".hero-card");

  if (heroCard) {
    if (prefersReducedMotion) {
      heroCard.classList.add("is-visible");
    } else {
      const heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) heroCard.classList.add("is-visible");
          else heroCard.classList.remove("is-visible");
        },
        { threshold: 0.4 }
      );
      heroObserver.observe(heroCard);
    }

    if (!prefersReducedMotion && canHover) {
      heroCard.addEventListener("mousemove", (e) => {
        const r = heroCard.getBoundingClientRect();
        heroCard.style.setProperty(
          "--mx",
          `${((e.clientX - r.left) / r.width) * 100}%`
        );
        heroCard.style.setProperty(
          "--my",
          `${((e.clientY - r.top) / r.height) * 100}%`
        );
      });

      heroCard.addEventListener("mouseleave", () => {
        heroCard.style.removeProperty("--mx");
        heroCard.style.removeProperty("--my");
      });
    }
  }

  /* ============================
     PORTFOLIO TABS (filtrar cards)
  ============================ */
  (() => {
    const tabBtns = Array.from(document.querySelectorAll(".tab-btn"));
    const grid = document.getElementById("portfolio-grid");
    const placeholder = document.getElementById("portfolio-placeholder");
    const emptyMsg = document.getElementById("portfolio-empty");

    if (!tabBtns.length || !grid) return;

    const cards = Array.from(grid.querySelectorAll(".portfolio-card"));

    const setActive = (btn) => {
      tabBtns.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", b === btn ? "true" : "false");
      });
    };

    const applyFilter = (filter) => {
      if (placeholder) placeholder.style.display = "none";

      let visible = 0;

      cards.forEach((card) => {
        const cat = card.dataset.category;
        const show = filter === "all" ? true : cat === filter;
        card.hidden = !show;
        if (show) visible++;
      });

      if (emptyMsg) emptyMsg.hidden = visible !== 0;
    };

    const initial =
      tabBtns.find((b) => b.dataset.filter === "all") || tabBtns[0];
    setActive(initial);
    applyFilter(initial.dataset.filter || "all");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter || "all";
        setActive(btn);
        applyFilter(filter);
      });
    });
  })();

  /* ============================
     PORTFOLIO MODAL (Carrossel)
  ============================ */
  const modal = document.getElementById("portfolio-modal");
  const openBtns = document.querySelectorAll("[data-open-portfolio]");
  const closeEls = document.querySelectorAll("[data-close-portfolio]");

  const titleEl = document.getElementById("portfolio-modal-title");
  const stage = document.getElementById("viewer-stage");
  const counter = document.getElementById("viewer-counter");
  const prevBtn = document.querySelector("[data-viewer-prev]");
  const nextBtn = document.querySelector("[data-viewer-next]");

  // ✅ KEYS têm de bater com data-open-portfolio do HTML
  // ✅ PATHS têm de bater com as pastas reais (com pontos)
  const DEMOS = {
    restauracao: {
      title: "Restaurante & Cafés — Sabor & Fogo",
      slides: [
        { type: "video", src: "assets.rest/Rest.VID.mp4" },
        {
          type: "image",
          src: "assets.rest/Screenshot 2025-12-15 at 19.16.27.png",
        },
        {
          type: "image",
          src: "assets.rest/Screenshot 2025-12-15 at 19.17.08.png",
        },
        {
          type: "image",
          src: "assets.rest/Screenshot 2025-12-15 at 19.17.51.png",
        },
      ],
    },

    ecommerce: {
      title: "E-commerce — Noise District",
      slides: [{ type: "video", src: "assets.ecom/noise-district.mp4" }],
    },

    saas: {
      title: "SaaS — Demo",
      slides: [{ type: "video", src: "assets.saas/saas.mp4" }],
    },

    // 🔥 hotel no teu HTML é "alojamento" e a pasta real é assets.tripnest
    alojamento: {
      title: "Alojamento Local / Hotel — TripNest",
      slides: [
        { type: "video", src: "assets.tripnest/TripNest.mp4" },
        { type: "image", src: "assets.tripnest/TripNest.png" },
      ],
    },

    estetica: {
      title: "Estética — Demo",
      slides: [{ type: "video", src: "assets.estetica/Emera.mp4" }],
    },

    // (opcional) se quiseres manter compatibilidade com keys antigas
    hoteis: {
      title: "Alojamento Local / Hotel — TripNest",
      slides: [
        { type: "video", src: "assets.tripnest/TripNest.mp4" },
        { type: "image", src: "assets.tripnest/TripNest.png" },
      ],
    },
  };

  let currentSlides = [];
  let currentIndex = 0;

  const lockScroll = (lock) => {
    document.documentElement.style.overflow = lock ? "hidden" : "";
    document.body.style.overflow = lock ? "hidden" : "";
  };

  const destroyStageMedia = () => {
    if (!stage) return;
    const vid = stage.querySelector("video");
    if (vid) {
      vid.pause();
      vid.removeAttribute("src");
      vid.load();
    }
    stage.innerHTML = "";
  };

  const showMediaError = (msg) => {
    if (!stage) return;
    stage.innerHTML = `<div class="viewer-empty">
      <p><strong>Não deu para carregar a demo.</strong></p>
      <p style="opacity:.85">${escapeHTML(msg)}</p>
      <p style="opacity:.75">Abre o DevTools → Network e confirma se o ficheiro está a dar 200 (não 404).</p>
    </div>`;
    if (counter) counter.textContent = `1 / 1`;
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
  };

  const renderSlide = () => {
    if (!stage) return;

    destroyStageMedia();

    const total = currentSlides.length || 1;
    const slide = currentSlides[currentIndex];

    if (!slide) {
      showMediaError("Esta categoria não tem slides configurados no JS.");
      return;
    }

    if (slide.type === "video") {
      const v = document.createElement("video");
      v.className = "viewer-media";
      v.controls = true;
      v.autoplay = true;
      v.muted = true; // necessário para autoplay
      v.loop = true;
      v.playsInline = true;
      v.preload = "metadata";
      v.src = slide.src;

      v.addEventListener("error", () => {
        showMediaError(`Erro no vídeo: ${slide.src}`);
      });

      stage.appendChild(v);

      // força play (Safari pode falhar se não estiver muted/inline)
      v.play().catch(() => {
        // se falhar autoplay, pelo menos mostra controls para o user clicar play
      });
    } else {
      const img = document.createElement("img");
      img.className = "viewer-media";
      img.src = slide.src;
      img.alt = "Screenshot do template";
      img.loading = "lazy";
      img.addEventListener("error", () => {
        showMediaError(`Erro na imagem: ${slide.src}`);
      });
      stage.appendChild(img);
    }

    if (counter) counter.textContent = `${currentIndex + 1} / ${total}`;
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === total - 1;
  };

  const openModal = (key) => {
    if (!modal) return;

    const safeKey = String(key || "").trim();
    const data = DEMOS[safeKey];

    if (!data) {
      // isto é o teu “Demo em breve” — mas agora diz-te o erro real
      currentSlides = [];
      currentIndex = 0;
      if (titleEl) titleEl.textContent = "Demo";
      modal.hidden = false;
      lockScroll(true);
      showMediaError(
        `Não existe DEMOS["${safeKey}"]. O teu data-open-portfolio está errado.`
      );
      return;
    }

    if (titleEl) titleEl.textContent = data.title || "Demo";
    currentSlides = data.slides || [];
    currentIndex = 0;

    modal.hidden = false;
    lockScroll(true);
    renderSlide();

    if (nextBtn) nextBtn.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    destroyStageMedia();
    modal.hidden = true;
    lockScroll(false);
  };

  const goPrev = () => {
    if (currentIndex <= 0) return;
    currentIndex -= 1;
    renderSlide();
  };

  const goNext = () => {
    if (currentIndex >= currentSlides.length - 1) return;
    currentIndex += 1;
    renderSlide();
  };

  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-open-portfolio") || "";
      openModal(key);
    });
  });

  closeEls.forEach((el) => el.addEventListener("click", closeModal));

  if (prevBtn) prevBtn.addEventListener("click", goPrev);
  if (nextBtn) nextBtn.addEventListener("click", goNext);

  document.addEventListener("keydown", (e) => {
    if (!modal || modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "ArrowRight") goNext();
  });

  // Thumb videos: deixa loop no HTML (preview fica vivo).
  // Se queres mesmo parar no fim, ok — mas isso mata o loop.
  // Eu deixava loop ON no thumb. Vou só garantir playsinline/muted.
  document.querySelectorAll(".portfolio-thumb-video").forEach((v) => {
    v.muted = true;
    v.playsInline = true;
  });
});
