(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const mm = (q) => (window.matchMedia ? window.matchMedia(q).matches : false);
  const prefersReducedMotion = mm("(prefers-reduced-motion: reduce)");
  const canHover = mm("(hover: hover)");

  const DEBUG = false;
  const log = (...a) => DEBUG && console.log("[WebWave]", ...a);
  const warn = (...a) => DEBUG && console.warn("[WebWave]", ...a);

  // ============================
  // SUPABASE
  // ============================
  const SUPABASE_URL = "https://bvigpzldqobufsrrwryh.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_6_hrgiqYPf1ctfnyAYM5Iw_XJmEZld7";

  const supabase = window.supabase?.createClient?.(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
  );

  document.addEventListener("DOMContentLoaded", () => {
    initMobileNav();
    initFooterYear();
    initReviews();
    initMetricCount();
    initRevealOnScroll();
    initHeroCardTilt();
    initPortfolioTabs();
    initPortfolioModal();
    initBinaryWave();
    initCpuPulses();
    initAuthModal(); // ✅ SUPABASE auth
  });

  /* ============================
     MOBILE NAV
  ============================ */
  function initMobileNav() {
    const navToggle = $("#nav-toggle");
    const navLinks = $("#nav-links");
    if (!navToggle || !navLinks) return;

    $$("a", navLinks).forEach((a) => {
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    navToggle.setAttribute("aria-expanded", "false");

    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
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
        text: "“Cumpriram o prazo e o resultado ficou mesmo alinhado com a nossa marca.”",
        author: "Pedro Almeida",
        stars: 5,
      },
      {
        text: "“A navegação ficou intuitiva e o carregamento está muito mais rápido.”",
        author: "Joana Ribeiro",
        stars: 4.5,
      },
      {
        text: "“Deram boas sugestões e notou-se experiência em cada decisão.”",
        author: "Ricardo Fernandes",
        stars: 5,
      },
      {
        text: "“Comunicação impecável e zero dores de cabeça durante o processo.”",
        author: "Beatriz Martins",
        stars: 4.9,
      },
      {
        text: "“Ficou tudo bem estruturado e fácil de atualizar. Excelente trabalho.”",
        author: "Diogo Carvalho",
        stars: 4.1,
      },
      {
        text: "“O detalhe no design e a consistência visual fizeram toda a diferença.”",
        author: "Ana Sousa",
        stars: 5,
      },
      {
        text: "“Implementação rápida, feedback constante e entrega sem falhas.”",
        author: "Gonçalo Teixeira",
        stars: 5,
      },
      {
        text: "“A versão mobile ficou perfeita e o site passou a converter muito melhor.”",
        author: "Mariana Pinto",
        stars: 4,
      },
      {
        text: "“Foram proativos e resolveram rapidamente os ajustes que pedimos.”",
        author: "Hugo Correia",
        stars: 5,
      },
      {
        text: "“Profissionais, transparentes e com um cuidado enorme nos acabamentos.”",
        author: "Leonor Santos",
        stars: 4.2,
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
     PORTFOLIO MODAL
  ============================ */
  function initPortfolioModal() {
    const modal = $("#portfolio-modal");
    const titleEl = $("#portfolio-modal-title");
    const stage = $("#viewer-stage");
    const counter = $("#viewer-counter");
    const prevBtn = $("[data-viewer-prev]");
    const nextBtn = $("[data-viewer-next]");

    if (!modal || !stage || !counter || !prevBtn || !nextBtn) return;

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
      if (!s) return showError("Sem slides configurados para esta demo.");

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
        v.addEventListener("error", () =>
          showError(`Erro/404 no vídeo: ${s.src}`),
        );
        stage.appendChild(v);
        v.play().catch(() => {});
      } else {
        const img = document.createElement("img");
        img.className = "viewer-media";
        img.src = s.src;
        img.alt = "Demo";
        img.addEventListener("error", () =>
          showError(`Erro/404 na imagem: ${s.src}`),
        );
        stage.appendChild(img);
      }

      counter.textContent = `${index + 1} / ${slides.length}`;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
    };

    const openModal = (key) => {
      const cfg = DEMOS[String(key || "").trim()];
      modal.hidden = false;
      modal.removeAttribute("hidden");
      lockScroll(true);

      if (!cfg) {
        if (titleEl) titleEl.textContent = "Demo";
        return showError(
          `Não existe DEMOS["${key}"] (data-open-portfolio não bate).`,
        );
      }

      slides = Array.isArray(cfg.slides) ? cfg.slides : [];
      index = 0;
      if (titleEl) titleEl.textContent = cfg.title || "Demo";
      render();
    };

    const closeModal = () => {
      destroyStage();
      modal.hidden = true;
      modal.setAttribute("hidden", "");
      lockScroll(false);
    };

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

    log("Portfolio modal ready.", Object.keys(DEMOS));
  }

  /* ============================
     HERO — DIGITAL RAIN
  ============================ */
  function initBinaryWave() {
    const container = document.querySelector(".hero-binarywave");
    if (!container) return;

    const layers = Array.from(container.querySelectorAll(".rain"));
    if (!layers.length) return;

    const COLS = 22;
    const ROWS = 70;
    const randBit = () => (Math.random() > 0.5 ? "1" : "0");

    layers.forEach((layer, layerIndex) => {
      layer.innerHTML = "";

      for (let i = 0; i < COLS; i++) {
        const col = document.createElement("div");
        col.className = "col";

        for (let j = 0; j < ROWS; j++) {
          const bit = document.createElement("span");
          bit.textContent = randBit();
          col.appendChild(bit);
        }

        const baseDelay = Math.random() * 8;
        const baseDur = 7 + Math.random() * 8;

        col.style.animationDelay = `${-(baseDelay + layerIndex)}s`;
        col.style.animationDuration = `${(baseDur + layerIndex * 1.2).toFixed(2)}s`;
        col.style.opacity = (0.35 + Math.random() * 0.55).toFixed(2);

        layer.appendChild(col);
      }
    });

    if (prefersReducedMotion) return;

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

  /* ============================
     CPU pulses (se existir no DOM)
  ============================ */
  function initCpuPulses() {
    const pulses = document.querySelectorAll(".cpu-traces .pulse");
    if (!pulses.length) return;

    pulses.forEach((p) => {
      const dur = 2.2 + Math.random() * 1.8;
      const delay = -(Math.random() * dur);
      p.style.animationDuration = `${dur.toFixed(2)}s`;
      p.style.animationDelay = `${delay.toFixed(2)}s`;
      p.style.opacity = (0.65 + Math.random() * 0.3).toFixed(2);
    });
  }

  /* ============================
     AUTH MODAL (SUPABASE) — FIXED
  ============================ */
  function initAuthModal() {
    const openBtn = $("#openAuth");
    const modal = $("#authModal");
    if (!openBtn || !modal) return;

    const closeEls = $$("[data-auth-close='true']", modal);
    const tabBtns = $$("[data-auth-tab]", modal);
    const panels = $$("[data-auth-panel]", modal);

    const signupForm = $("#signupForm");
    const loginForm = $("#loginForm");
    const forgotBtn = $("#forgotBtn");
    const logoutBtn = $("#logoutBtn");

    const signupError = $("#signupError");
    const signupSuccess = $("#signupSuccess");
    const loginError = $("#loginError");
    const loginSuccess = $("#loginSuccess");

    const lockScroll = (lock) => {
      document.documentElement.style.overflow = lock ? "hidden" : "";
      document.body.style.overflow = lock ? "hidden" : "";
    };

    const clearMessages = () => {
      if (signupError) signupError.textContent = "";
      if (signupSuccess) signupSuccess.textContent = "";
      if (loginError) loginError.textContent = "";
      if (loginSuccess) loginSuccess.textContent = "";
    };

    const setTab = (name) => {
      tabBtns.forEach((b) => {
        const isActive = b.dataset.authTab === name;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      panels.forEach((p) => {
        p.hidden = p.dataset.authPanel !== name;
      });

      clearMessages();
    };

    const open = () => {
      modal.setAttribute("aria-hidden", "false");
      modal.classList.add("is-open");
      lockScroll(true);
      clearMessages();
      setTab("signup");
      const first = $("input, select, button", modal);
      if (first) first.focus({ preventScroll: true });
    };

    const close = () => {
      modal.setAttribute("aria-hidden", "true");
      modal.classList.remove("is-open");
      lockScroll(false);
      clearMessages();
    };

    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      open();
    });

    closeEls.forEach((el) => el.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
    });

    tabBtns.forEach((b) =>
      b.addEventListener("click", () => setTab(b.dataset.authTab)),
    );

    const getFormData = (form) => {
      const fd = new FormData(form);
      const obj = {};
      for (const [k, v] of fd.entries()) obj[k] = String(v).trim();
      return obj;
    };

    const requireFields = (data, fields) =>
      fields.filter((f) => !data[f] || String(data[f]).trim().length === 0);

    const needSupabase = () => {
      if (supabase) return true;
      const msg =
        "Supabase não carregou. Confirma o script CDN antes do script.js.";
      if (loginError) loginError.textContent = msg;
      if (signupError) signupError.textContent = msg;
      return false;
    };

    const friendlyAuthError = (msg) => {
      const m = String(msg || "").toLowerCase();
      if (m.includes("invalid login credentials"))
        return "Credenciais inválidas.";
      if (m.includes("email not confirmed"))
        return "Confirma o email antes de fazer login.";
      if (m.includes("user already registered"))
        return "Este email já tem conta.";
      if (m.includes("password")) return "Password inválida (mínimo 8).";
      return msg || "Erro. Tenta novamente.";
    };

    async function refreshAuthUI() {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (logoutBtn) logoutBtn.style.display = session ? "inline" : "none";
      openBtn.textContent = session ? "Conta" : "Login";
    }

    // SIGNUP (✅ nomes corretos do HTML)
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMessages();
        if (!needSupabase()) return;

        const data = getFormData(signupForm);
        const missing = requireFields(data, [
          "first_name",
          "last_name",
          "company",
          "business_area",
          "phone",
          "email",
          "password",
        ]);

        if (missing.length) {
          if (signupError)
            signupError.textContent = "Preenche todos os campos obrigatórios.";
          return;
        }

        if (String(data.password).length < 8) {
          if (signupError)
            signupError.textContent = "Password demasiado curta (mínimo 8).";
          return;
        }

        try {
          const { data: signUpData, error } = await supabase.auth.signUp({
            email: String(data.email).trim(),
            password: String(data.password),
            options: {
              data: {
                first_name: data.first_name,
                last_name: data.last_name,
                company: data.company,
                business_area: data.business_area,
                phone: data.phone,
              },
              emailRedirectTo: window.location.origin,
            },
          });

          if (error) throw error;

          if (!signUpData?.session) {
            if (signupSuccess) {
              signupSuccess.textContent =
                "Conta criada. Confirma o email para ativar a conta e depois faz login.";
            }
            signupForm.reset();
            return;
          }

          if (signupSuccess)
            signupSuccess.textContent = "Conta criada e sessão iniciada.";
          signupForm.reset();
          await refreshAuthUI();
          // close();
        } catch (err) {
          if (signupError)
            signupError.textContent = friendlyAuthError(err?.message);
          warn(err);
        }
      });
    }

    // LOGIN
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearMessages();
        if (!needSupabase()) return;

        const data = getFormData(loginForm);
        const missing = requireFields(data, ["email", "password"]);
        if (missing.length) {
          if (loginError)
            loginError.textContent = "Email e password são obrigatórios.";
          return;
        }

        try {
          const { error } = await supabase.auth.signInWithPassword({
            email: String(data.email).trim(),
            password: String(data.password),
          });

          if (error) throw error;

          if (loginSuccess) loginSuccess.textContent = "Login feito ✅";
          loginForm.reset();
          await refreshAuthUI();
          // close();
        } catch (err) {
          if (loginError)
            loginError.textContent = friendlyAuthError(err?.message);
          warn(err);
        }
      });
    }

    // FORGOT PASSWORD
    if (forgotBtn) {
      forgotBtn.addEventListener("click", async () => {
        clearMessages();
        if (!needSupabase()) return;

        const email =
          (loginForm && $("input[name='email']", loginForm)?.value?.trim()) ||
          "";

        if (!email) {
          if (loginError) loginError.textContent = "Escreve o email primeiro.";
          return;
        }

        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
          });

          if (error) throw error;

          if (loginSuccess)
            loginSuccess.textContent = "Email de recuperação enviado.";
        } catch (err) {
          if (loginError)
            loginError.textContent = friendlyAuthError(err?.message);
          warn(err);
        }
      });
    }

    // LOGOUT (✅ tinhas botão no HTML mas não tinhas handler aqui)
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        clearMessages();
        if (!needSupabase()) return;

        const { error } = await supabase.auth.signOut();
        if (error) {
          if (loginError)
            loginError.textContent = friendlyAuthError(error.message);
          return;
        }

        if (loginSuccess) loginSuccess.textContent = "Logout feito ✅";
        await refreshAuthUI();
      });
    }

    // INIT + listener de mudanças de auth
    refreshAuthUI();
    supabase?.auth?.onAuthStateChange?.(() => refreshAuthUI());
  }
})();
