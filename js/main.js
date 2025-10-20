// Menu hamburger
// Sélecteurs principaux
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

// Ouvre / ferme le menu principal
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Ferme le menu quand on clique sur un lien simple
document.querySelectorAll("#nav-menu a:not(.deroulant > a)").forEach(link =>
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    })
);

// Gestion des sous-menus sur mobile
const deroulants = document.querySelectorAll(".deroulant > a");

deroulants.forEach(link => {
    link.addEventListener("click", (e) => {
        // Empêche la redirection si un sous-menu existe
        const sousMenu = link.nextElementSibling;
        if (sousMenu && sousMenu.classList.contains("sous")) {
            e.preventDefault();

            // Ferme les autres sous-menus
            document.querySelectorAll(".sous.active").forEach(openSous => {
                if (openSous !== sousMenu) openSous.classList.remove("active");
            });

            // Bascule le sous-menu cliqué
            sousMenu.classList.toggle("active");
        }
    });
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