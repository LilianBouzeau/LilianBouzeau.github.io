//MENU HUMBURGER
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
      closeAllMenus();
    }
  });

  // --- Gestion du clic dans le menu ---
  navMenu.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const li = link.closest(".deroulant");
    const sous = li ? li.querySelector(".sous") : null;
    const isMobile = window.innerWidth <= 768;

    if (isMobile && sous) {
      if (!sous.classList.contains("active")) {
        e.preventDefault();
        document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
        sous.classList.add("active");
      }
    } else {
      closeAllMenus();
    }
  });

  // --- Fermer le menu si on repasse en grand écran ---
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeAllMenus();
  });

  // --- Lien actif selon la page ---
  const currentPath = window.location.pathname;

  document.querySelectorAll("#nav-menu a").forEach(link => {
    const linkUrl = new URL(link.href, window.location.origin);
    const linkPath = linkUrl.pathname;

    // ✅ Lien actif sur la page ou si c'est le parent d'un sous-menu
    if (linkPath === currentPath || linkPath === currentPath.replace(/\/$/, "")) {
      link.classList.add("active");

    }
  });

  // --- Fonction pour fermer tout ---
  function closeAllMenus() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
    document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
  }
});
//ANIMATION AU SCROLL
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.scroll-animate, .scroll-animateG, .scroll-animateD');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
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
