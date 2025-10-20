// --- MENU BURGER ---
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

document.querySelectorAll("#nav-menu a:not(.deroulant > a)").forEach(link =>
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

const deroulants = document.querySelectorAll(".deroulant > a");

deroulants.forEach(link => {
  link.addEventListener("click", (e) => {
    const sousMenu = link.nextElementSibling;

    if (window.innerWidth <= 768 && sousMenu && sousMenu.classList.contains("sous")) {
      if (!sousMenu.classList.contains("active")) {
        e.preventDefault();
        document.querySelectorAll(".sous.active").forEach(openSous => {
          if (openSous !== sousMenu) openSous.classList.remove("active");
        });
        sousMenu.classList.add("active");
      } else {
        sousMenu.classList.remove("active");
      }
    }
  });
});

// --- LIEN ACTIF ---
const currentUrl = window.location.pathname;
const menuLinks = document.querySelectorAll("#nav-menu a");

menuLinks.forEach(link => {
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