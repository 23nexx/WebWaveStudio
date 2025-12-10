/* ============================
   MOBILE NAV
============================ */
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});


/* ============================
   FOOTER YEAR
============================ */
document.getElementById("year").textContent = new Date().getFullYear();


/* ============================
   CONTADOR ANIMADO (+100)
============================ */

const metricElement = document.getElementById("metric-clientes");

let targetValue = 100;  // número final
let animationDuration = 1800; // ms
let hasAnimated = false; // impede animação automática repetida

function animateCounter() {
  let start = 0;
  let startTime = null;

  function update(timestamp) {
    if (!startTime) startTime = timestamp;

    const progress = timestamp - startTime;
    const percentage = Math.min(progress / animationDuration, 1);

    const value = Math.floor(percentage * targetValue);

    metricElement.textContent = "+" + value;

    if (percentage < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ========= OBSERVER (volta a animar quando volta ao ecrã) ========= */

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter();
      }
    });
  },
  { threshold: 0.6 }
);

observer.observe(metricElement);


/* ============================
   BOTÕES: wave gradient ANIMATION (já é feito no CSS)
============================ */

/* Nada necessário aqui — animação é CSS */



/* ============================
   (Opcional futuro) — funções adicionais
============================ */

console.log("WebWave Studio – script carregado.");
