// En production : API hébergée sur Render
// En local : serveur Express local
const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const API_BASE = IS_LOCAL
  ? "/api"
  : "https://portfolio-elma-api.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupProfileModal();
  initTestimonials();
});

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

async function initTestimonials() {
  const form = document.getElementById("testimonialForm");
  const grid = document.getElementById("testimonialsGrid");
  if (!form || !grid) return;

  await loadTestimonials(grid);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newItem = {
      name: String(formData.get("name") || "").trim(),
      role: String(formData.get("role") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      rating: Number(formData.get("rating") || 5)
    };

    if (!newItem.name || !newItem.role || !newItem.message || !newItem.rating) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });

      if (!response.ok) throw new Error("Impossible d'enregistrer le témoignage");

      await loadTestimonials(grid);
      form.reset();
      showFormFeedback("Merci, votre témoignage a bien été publié.");
    } catch (_error) {
      showFormFeedback("Erreur serveur. Vérifiez que le backend est démarré.");
    }
  });
}

async function loadTestimonials(grid) {
  try {
    const response = await fetch(`${API_BASE}/testimonials`);
    if (!response.ok) throw new Error("Impossible de charger les témoignages");
    const testimonials = await response.json();
    renderTestimonials(testimonials.filter(isValidTestimonial), grid);
    showFormFeedback("Connecté au backend. Les témoignages sont publics.");
  } catch (_error) {
    renderTestimonials([], grid);
    showFormFeedback("Backend indisponible. Lancez `npm run dev`.");
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
    card.className = "testimonial-card";
    const safeName = escapeHtml(item.name);
    const safeRole = escapeHtml(item.role);
    const safeMessage = escapeHtml(item.message);
    const stars = "★".repeat(Math.max(1, Math.min(5, item.rating)));

    card.innerHTML = `
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

function showFormFeedback(message) {
  const note = document.querySelector(".form-note");
  if (!note) return;
  note.textContent = message;
  note.style.color = "var(--success)";
}

function escapeHtml(value) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return value.replace(/[&<>"']/g, (char) => map[char]);
}

function isValidTestimonial(item) {
  if (!item || typeof item !== "object") return false;
  const hasStrings = ["name", "role", "message"].every(
    (key) => typeof item[key] === "string" && item[key].trim().length > 0
  );
  const hasRating = Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5;
  return hasStrings && hasRating;
}
