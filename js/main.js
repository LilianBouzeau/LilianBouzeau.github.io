// === MENU HAMBURGER ===
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (!hamburger || !navMenu) return;

  // --- Toggle principal ---
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // --- Fermer si clic extérieur ---
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.querySelectorAll(".sous.active").forEach(s => s.classList.remove("active"));
    }
  });

  // --- Gestion du clic dans le menu ---
  navMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const li = link.closest(".deroulant");
    const sous = li ? li.querySelector(".sous") : null;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile && sous) {
      e.preventDefault(); // empêche la navigation immédiate

      // Si ce sous-menu est déjà ouvert → on navigue
      if (sous.classList.contains("active")) {
        window.location.href = link.href;
        return;
      }

      // Sinon on ferme les autres et on ouvre celui-ci
      document.querySelectorAll(".sous.active").forEach(s => s.classList.remove("active"));
      sous.classList.add("active");
    } else {
      // Clic sur un lien normal → fermeture du menu
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.querySelectorAll(".sous.active").forEach(s => s.classList.remove("active"));
    }
  });

  // --- Fermer le menu si on repasse en grand écran ---
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.querySelectorAll(".sous.active").forEach(s => s.classList.remove("active"));
    }
  });
});

// === LIEN ACTIF SELON LA PAGE ===
const currentUrl = window.location.pathname;
document.querySelectorAll("#nav-menu a").forEach(link => {
  const linkUrl = new URL(link.href);
  if (linkUrl.pathname === currentUrl) {
    link.classList.add("active");
  }
});

// BTN TOP 
const btnTop = document.getElementById("btnTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        btnTop.classList.add("show");
    } else {
        btnTop.classList.remove("show");
    }
});

btnTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

//btn traduction
const btnLang = document.getElementById('btnLang');
const flagIcon = document.getElementById('flagIcon');

btnLang.addEventListener('click', () => {
    if (flagIcon.src.includes('uk.png')) {
        flagIcon.src = 'img/flag-francais.png';   // drapeau français
        window.location.href = '/index.html';   // page française
    } else {
        flagIcon.src = 'img/flag-anglais.png';   // drapeau anglais
        window.location.href = '/en/index.html'; // page anglaise
    }
});

//BARRE DE RECHERCHE + FILTRE
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchCatalog');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Supprime la classe active sur tous
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Ici tu peux filtrer ton catalogue selon btn.dataset.type
        console.log("Filtre appliqué:", btn.dataset.type);
        // Exemple: filterCatalog(btn.dataset.type);
    });
});