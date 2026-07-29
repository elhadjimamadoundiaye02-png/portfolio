// ============================================================
// Portfolio — El Hadji Mamadou Ndiaye
// 100% statique : HTML / CSS / JS, hébergé sur GitHub Pages.
// Aucun backend (plus de Render / MongoDB Atlas) :
//  - Les témoignages affichés viennent de testimonials.json (statique)
//  - Les nouvelles soumissions passent par Formspree (formulaire → email),
//    puis sont ajoutées manuellement à testimonials.json après vérification.
// ============================================================

// >>> À CONFIGURER : remplacez par votre propre endpoint Formspree <<<
// 1. Créez un compte gratuit sur https://formspree.io
// 2. Créez un formulaire, copiez son ID (ex: "abcdwxyz")
// 3. Collez-le ci-dessous à la place de "YOUR_FORM_ID"
const FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const HERO_TAGLINES = [
  "Je transforme des infrastructures complexes en systèmes sécurisés et automatisés.",
  "Du noyau Linux à l'intelligence artificielle : je construis ce qui tient la charge.",
  "Rigueur réseau, sécurité offensive et IA appliquée — prêt pour le terrain."
];

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupProfileModal();
  setupNavScrollEffects();
  setupHeroTypewriter();
  setupStatsCounter();
  setupScrollReveal();
  setupBackToTop();
  setupStarRating();
  initTestimonials();
});

// ---------------------------------------------------------------
// Navigation fluide (ancre)
// ---------------------------------------------------------------
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      const yOffset = 72;
      const y = target.getBoundingClientRect().top + window.scrollY - yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });
}

// ---------------------------------------------------------------
// Photo de profil en modal
// ---------------------------------------------------------------
function setupProfileModal() {
  const profileImg = document.getElementById("profileImg");
  const modal = document.getElementById("profileModal");
  const closeBtn = document.querySelector(".modal-close");

  if (!profileImg || !modal || !closeBtn) return;

  profileImg.addEventListener("click", () => {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }
}

// ---------------------------------------------------------------
// Barre de navigation : ombre au scroll + lien actif
// ---------------------------------------------------------------
function setupNavScrollEffects() {
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll("nav a[href^='#']");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!nav) return;

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("scrolled", window.scrollY > 12);
    },
    { passive: true }
  );

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

// ---------------------------------------------------------------
// Effet "machine à écrire" pour la phrase d'accroche du hero
// ---------------------------------------------------------------
function setupHeroTypewriter() {
  const el = document.getElementById("heroTagline");
  if (!el) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    el.textContent = HERO_TAGLINES[0];
    return;
  }

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "\u00A0";

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  el.textContent = "";
  el.appendChild(cursor);

  function tick() {
    const phrase = HERO_TAGLINES[phraseIndex];

    if (!deleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      el.appendChild(cursor);
      if (charIndex === phrase.length) {
        deleting = true;
        return setTimeout(tick, 2200);
      }
      return setTimeout(tick, 38);
    }

    charIndex--;
    el.textContent = phrase.slice(0, charIndex);
    el.appendChild(cursor);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % HERO_TAGLINES.length;
      return setTimeout(tick, 400);
    }
    return setTimeout(tick, 18);
  }

  setTimeout(tick, 600);
}

// ---------------------------------------------------------------
// Compteurs animés (statistiques du hero)
// ---------------------------------------------------------------
function setupStatsCounter() {
  const items = document.querySelectorAll(".stat-number[data-count]");
  if (items.length === 0) return;

  const animate = (el) => {
    const target = Number(el.dataset.count) || 0;
    const duration = 1200;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  if (!("IntersectionObserver" in window)) {
    items.forEach(animate);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  items.forEach((item) => observer.observe(item));
}

// ---------------------------------------------------------------
// Animations "reveal" au scroll (fade + slide-up)
// ---------------------------------------------------------------
function setupScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (targets.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  targets.forEach((target) => observer.observe(target));
}

// ---------------------------------------------------------------
// Bouton "retour en haut"
// ---------------------------------------------------------------
function setupBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("show", window.scrollY > 480);
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ---------------------------------------------------------------
// Notation par étoiles cliquables (formulaire de témoignage)
// ---------------------------------------------------------------
function setupStarRating() {
  const wrapper = document.getElementById("starRating");
  const hiddenInput = document.getElementById("ratingInput");
  const hint = document.getElementById("ratingHint");
  if (!wrapper || !hiddenInput) return;

  const buttons = Array.from(wrapper.querySelectorAll("button[data-value]"));
  const labels = {
    1: "1 - À améliorer",
    2: "2 - Moyen",
    3: "3 - Bien",
    4: "4 - Très bien",
    5: "5 - Excellent"
  };

  function paint(value) {
    buttons.forEach((btn) => {
      const isActive = Number(btn.dataset.value) <= value;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-checked", String(Number(btn.dataset.value) === value));
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      buttons.forEach((b) => b.classList.toggle("hovered", Number(b.dataset.value) <= Number(btn.dataset.value)));
    });
    btn.addEventListener("mouseleave", () => {
      buttons.forEach((b) => b.classList.remove("hovered"));
    });
    btn.addEventListener("click", () => {
      const value = Number(btn.dataset.value);
      hiddenInput.value = String(value);
      paint(value);
      if (hint) hint.textContent = labels[value] || "";
    });
  });

  // Compteur de caractères pour le message
  const textarea = document.getElementById("message");
  const counter = document.getElementById("charCount");
  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      counter.textContent = String(textarea.value.length);
    });
  }
}

// ---------------------------------------------------------------
// Témoignages — lecture statique depuis testimonials.json
// + soumission via Formspree (aucun serveur propre requis)
// ---------------------------------------------------------------
async function initTestimonials() {
  const form = document.getElementById("testimonialForm");
  const grid = document.getElementById("testimonialsGrid");
  if (!grid) return;

  await loadTestimonials(grid);

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newItem = {
      name: String(formData.get("name") || "").trim(),
      role: String(formData.get("role") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      rating: Number(formData.get("rating") || 0)
    };

    if (!isValidTestimonial(newItem)) {
      showFormFeedback("Merci de remplir tous les champs et de choisir une note.", "error");
      return;
    }

    const submitBtn = document.getElementById("submitTestimonial");
    const originalLabel = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    }

    try {
      if (FORMSPREE_ENDPOINT.includes("YOUR_FORM_ID")) {
        throw new Error("not_configured");
      }

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) throw new Error("send_failed");

      form.reset();
      const hiddenRating = document.getElementById("ratingInput");
      if (hiddenRating) hiddenRating.value = "";
      document.querySelectorAll("#starRating button").forEach((b) => b.classList.remove("active"));
      const hint = document.getElementById("ratingHint");
      if (hint) hint.textContent = "Cliquez pour noter";
      const counter = document.getElementById("charCount");
      if (counter) counter.textContent = "0";

      showFormFeedback(
        "Merci ! Votre témoignage a bien été envoyé et sera publié après vérification.",
        "success"
      );
    } catch (error) {
      if (error && error.message === "not_configured") {
        showFormFeedback(
          "Formulaire non encore connecté. Écrivez-moi directement à elhadjimamadoundiaye02@esp.sn.",
          "error"
        );
      } else {
        showFormFeedback("Erreur d'envoi. Réessayez plus tard ou écrivez-moi par email.", "error");
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    }
  });
}

async function loadTestimonials(grid) {
  try {
    const response = await fetch("testimonials.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Impossible de charger les témoignages");
    const testimonials = await response.json();
    renderTestimonials(testimonials.filter(isValidTestimonial), grid);
  } catch (_error) {
    renderTestimonials([], grid);
  }
}

function renderTestimonials(items, grid) {
  grid.innerHTML = "";
  const emptyState = document.getElementById("emptyTestimonials");
  if (emptyState) {
    emptyState.style.display = items.length === 0 ? "block" : "none";
  }
  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "testimonial-card reveal visible";
    const safeName = escapeHtml(item.name);
    const safeRole = escapeHtml(item.role);
    const safeMessage = escapeHtml(item.message);
    const stars = "★".repeat(Math.max(1, Math.min(5, item.rating)));

    card.innerHTML = `
      <i class="fas fa-quote-left quote-icon"></i>
      <div class="testimonial-header">
        <strong>${safeName}</strong>
        <span class="stars" aria-label="Note ${item.rating} sur 5">${stars}</span>
      </div>
      <p class="testimonial-role">${safeRole}</p>
      <p>${safeMessage}</p>
    `;
    grid.appendChild(card);
  });
}

function showFormFeedback(message, type) {
  const note = document.getElementById("formNote");
  if (!note) return;
  note.textContent = message;
  note.className = "form-note" + (type ? ` ${type}` : "");
}

function escapeHtml(value) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(value).replace(/[&<>"']/g, (char) => map[char]);
}

function isValidTestimonial(item) {
  if (!item || typeof item !== "object") return false;
  const hasStrings = ["name", "role", "message"].every(
    (key) => typeof item[key] === "string" && item[key].trim().length > 0
  );
  const hasRating = Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5;
  return hasStrings && hasRating;
}
