/**
 * script.js
 * Version corrigée et commentée - Gestion loader, menu, traductions, formulaire, catalogue, etc.
 */

document.addEventListener("DOMContentLoaded", () => {
  function updateActiveFiltersUI() {
  // fonction vide pour éviter l'erreur si elle n'est pas utilisée
  }
  // ---------- Loader & Lancement principal ----------
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("mainContent");
  if (mainContent) mainContent.style.display = "none";

  // -------- Assigner l’angle à chaque fruit --------
  const fruits = document.querySelectorAll('.spinner .fruit');
  fruits.forEach((fruit, i) => {
  fruit.style.setProperty('--i', i);
  });

  const startTime = Date.now();

  // Attendre le chargement complet
  window.addEventListener("load", () => {
  const elapsed = Date.now() - startTime;
  const minDelay = 500; // délai minimum (ms)
  const remaining = Math.max(minDelay - elapsed, 0);

  setTimeout(() => {
    if (loader) loader.style.opacity = "0";
    setTimeout(() => {
    loader.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    initMenusEtTraductions();
    animateTitleLetters();
    }, 500); // délai pour la transition
  }, remaining);
  });

  // ---------- Animation lettres du titre ----------
  function animateTitleLetters() {
    const titleElement = document.getElementById("titre");
    if (!titleElement) return;
    
    const text = "Cruchaudet";
    titleElement.innerHTML = "";
    
    text.split("").forEach((letter, index) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = letter;
      span.style.animationDelay = (index * 0.25) + "s";
      titleElement.appendChild(span);
    });
  }

  // ---------- Fonction principale ----------
  function initMenusEtTraductions() {
  // ------ Slider avis clients --------
  function initSliderAvisClients() {
    const slides = document.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    let index = 0;
    let slideInterval;

    function showSlide(newIndex) {
    slides[index].classList.remove("active");

    index = newIndex;
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides[index].classList.add("active");
    }

    function startInterval() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      showSlide(index + 1);
    }, 10000);
    }

    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    if (nextBtn) nextBtn.addEventListener("click", () => { showSlide(index + 1); startInterval(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { showSlide(index - 1); startInterval(); });

    startInterval();
  }

  // ------ Slider logos --------
  function initSliderLogos() {
    const logoContainer = document.querySelector(".logo-slider");
    const logosSlide = document.querySelector(".logos-slide");
    if (!logoContainer || !logosSlide) return;

    const copy = logosSlide.cloneNode(true);
    logoContainer.appendChild(copy);
  }
  // Appeler après initMenusEtTraductions()
  initSliderAvisClients();
  initSliderLogos();
  // Menu / hamburger
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  // Gère l'ouverture/fermeture du hamburger (mobile)
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", e => {
    e.stopPropagation();
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    if (!navMenu.classList.contains("active")) closeAllSousMenus();
    });

    // Fermeture des sous-menus si clique hors menu
    document.addEventListener("click", e => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) closeAllSousMenus();
    });
  }

  // Ajout d'un caret si absent (pour les items déroulants)
  document.querySelectorAll("#nav-menu .deroulant > a").forEach(link => {
    if (!link.querySelector("i.caret")) {
    const icon = document.createElement("i");
    icon.classList.add("bi", "bi-caret-down-fill", "caret");
    link.appendChild(icon);
    }
  });

  // Gestion des sous-menus (ouverture/fermeture en accordéon)
  const deroulants = document.querySelectorAll("#nav-menu .deroulant");
  deroulants.forEach(li => {
    const link = li.querySelector(":scope > a");
    if (!link) return;
    const icon = link.querySelector("i.caret");
    const sous = li.querySelector(".sous");

    link.addEventListener("click", e => {
    if (!sous) return;
    e.preventDefault();

    // Ferme les autres déroulants avant d'ouvrir celui-ci
    deroulants.forEach(otherLi => {
      if (otherLi !== li) {
      const otherSous = otherLi.querySelector(".sous");
      const otherIcon = otherLi.querySelector("i.caret");
      otherLi.classList.remove("open");
      if (otherSous) otherSous.classList.remove("active");
      if (otherIcon) {
        otherIcon.classList.remove("bi-caret-up-fill");
        otherIcon.classList.add("bi-caret-down-fill");
      }
      }
    });

    sous.classList.toggle("active");
    li.classList.toggle("open");

    if (sous.classList.contains("active")) {
      if (icon) {
      icon.classList.remove("bi-caret-down-fill");
      icon.classList.add("bi-caret-up-fill");
      }
    } else {
      if (icon) {
      icon.classList.remove("bi-caret-up-fill");
      icon.classList.add("bi-caret-down-fill");
      }
    }
    });
  });

  // Fonction utilitaire pour fermer tous les sous-menus
  function closeAllSousMenus() {
    if (hamburger) hamburger.classList.remove("active");
    if (navMenu) navMenu.classList.remove("active");

    document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
    document.querySelectorAll("#nav-menu .deroulant").forEach(li => li.classList.remove("open"));
    document.querySelectorAll("#nav-menu .deroulant i.caret").forEach(icon => {
    icon.classList.remove("bi-caret-up-fill");
    icon.classList.add("bi-caret-down-fill");
    });
  }

  // ---------- Activation du lien courant dans le menu ----------
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("#nav-menu a").forEach(link => link.classList.remove("active"));
  document.querySelectorAll("#nav-menu a").forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (href.startsWith("#") && currentPath === "index.html") link.classList.add("active");
    else {
    const linkFile = href.split("/").pop().split("#")[0];
    if (linkFile === currentPath) link.classList.add("active");
    }
  });

  // ---------- Gestion des ancres (liens internes #) ----------
  function handleAnchorLinks() {
    document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      // Vérifier si l'élément cible existe sur la page actuelle
      if (targetElement) {
      e.preventDefault();
      
      // Fermer le menu hamburger si ouvert
      if (hamburger && navMenu) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        closeAllSousMenus();
      }
      
      // Scroll vers la cible avec smooth behavior
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      
      // Mettre à jour l'URL
      window.history.pushState(null, null, `#${targetId}`);
      }
      // Si l'élément n'existe pas, laisser le navigateur faire son traitant par défaut
    });
    });
  }

  handleAnchorLinks();

  // Gestion du hash au chargement de la page (scroll automatique)
  window.addEventListener("hashchange", () => {
    if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      setTimeout(() => {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      // Fermer le menu si ouvert
      if (hamburger && navMenu) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        closeAllSousMenus();
      }
      }, 100);
    }
    }
  });

  // Au chargement initial, scroll vers l'ancre si elle existe dans l'URL
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
    setTimeout(() => {
      targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start"
      });
    }, 300);
    }
  }

  // ---------- IntersectionObserver pour animations au scroll ----------
  const scrollElements = document.querySelectorAll('.scroll-animate, .scroll-animateG, .scroll-animateD');
  if (scrollElements.length > 0) {
    const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
      entry.target.classList.add('scroll-visible');
      observer.unobserve(entry.target); // une seule fois
      }
    });
    }, { threshold: 0.2 });
    scrollElements.forEach(el => observer.observe(el));
  }

  // ---------- Compteur ----------
  function animateCounters() {
    const counters = document.querySelectorAll(".counter");

    const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
      const counter = entry.target;
      const target = parseInt(counter.dataset.target, 10);
      let startTime = null;
      const duration = 2000; // 2 secondes

      function update(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let value = Math.floor(progress * target);

        // Ajoute un "+" pour le compteur des produits
        if (counter.id === "compteurProduits") {
        counter.textContent = "+" + value;
        } else if (counter.id === "compteurExpertise") {
        counter.textContent = value + " ans";
        } else {
        counter.textContent = value;
        }

        if (progress < 1) requestAnimationFrame(update);
        else {
        // Valeur finale
        if (counter.id === "compteurProduits") counter.textContent = "+1000";
        else if (counter.id === "compteurExpertise") counter.textContent = "43 ans";
        else counter.textContent = target;
        }
      }

      requestAnimationFrame(update);
      obs.unobserve(counter);
      }
    });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  // Appel de la fonction
  animateCounters();
  // ---------- COOKIES ----------
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.querySelector(".cookie-btn.accept");
  const declineBtn = document.querySelector(".cookie-btn.decline");

  if (!banner || !acceptBtn || !declineBtn) {
    console.warn("❌ Cookie banner: éléments non trouvés dans le DOM.");
    return;
  }

  // Vérifie si l'utilisateur a déjà fait un choix
  const consent = localStorage.getItem("cookieConsent");
  if (!consent) {
    banner.style.display = "flex"; // afficher la bannière
  } else {
    banner.style.display = "none"; // cacher si déjà choisi
  }
  function setCookieConsent(value) {
    const now = new Date();
    const expire = now.getTime() + 30 * 24 * 60 * 60 * 1000; // 30 jours
    const data = { value, expire };
    localStorage.setItem("cookieConsent", JSON.stringify(data));
  }
  // Accepter
  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted"); // garder en storage
    banner.style.opacity = "0";
    setTimeout(() => (banner.style.display = "none"), 400);
  });

  // Refuser
  declineBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined"); // garder en storage
    banner.style.opacity = "0";
    setTimeout(() => (banner.style.display = "none"), 400);
  });

  // ---------- Bouton "back to top" ----------
  const btnTop = document.getElementById("btnTop");
  if (btnTop) {
    window.addEventListener("scroll", () => {
    if (window.scrollY > 300) btnTop.classList.add("show");
    else btnTop.classList.remove("show");
    });
    btnTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- Traductions ----------
  const translations = {
    FR: {
    //TITRE
    TitrePage1: "Cruchaudet | L'histoire",
    TitrePage2: "Cruchaudet | Service de Livraison",
    TitrePage3: "Cruchaudet | Nos partenaires",
    TitrePage4: "Cruchaudet | Les rayons",
    TitrePage5: "Cruchaudet | Nos engagements",
    TitrePage404: 'Cruchaudet | Page 404',

    //NAV
    navHistory: "L'histoire",
    navExport: "Service Expédition",
    navEngagement: "Nos engagements",
    navRayon: 'Les rayons',
    navRayonLegumes: "Légumes",
    navRayonFruits: "Fruits",
    navRayonExotic: "Exotic",
    navRayonMiniLegumes: 'Mini-légumes',
    navRayonJP: 'Jeunes Pousses',
    navRayonG: 'Germes',
    navRayonC: "Condiments",
    navContactExport: "Prise de contact",
    navNosPartenaires: "Nos partenaires",
    navClients: "Clients",
    navFournisseurs: "Fournisseurs",
    navContact: "Contact",

    //PAGE INDEX
    titre: "Cruchaudet",
    phrase1: "Des fruits et légumes frais, chaque jour.",
    phrase2: "Au départ de <span class='Rungis'>Rungis</span>.",
    titrepageHistoire: "L'histoire",
    titreBio1: 'Début',
    titreBio2: 'Evolution',
    titreBio3: 'Présent',
    titreChiffresGeneral: "Quelques chiffres",
    titreChiffresCreation: "Création",
    titreChiffresExpertise: "Expertise",
    titreChiffresProduits: "Produits",

    //PAGE RAYON
    titrepageRayons: 'Les rayons',
    titreRayon1: "Fruits",
    titreRayon2: "Legumes",
    titreRayon3: "Mini-legumes",
    titreRayon4: "Condiments",
    titreRayon5: "Exotic",
    titreRayon6: "Jeunes pousses",
    titreRayon7: "Germes",

    //FOOTER
    cguFooter: "Conditions générales d'utilisation",
    contact: "Contact",
    footerCopy: "Copyright © 2026 Cruchaudet.com. Tous droits réservés.",

    //404
    text404: "Oups ! La page que vous recherchez n'existe pas.",
    btn404: "Retour à l'accueil",

    //PAGE EXPORT
    TitreExport: "Service de Livraison",
    contactFormTitle: "Contact Export",
    nom: "Nom *",
    prenom: "Prénom *",
    email: "Email *",
    telephone: "Téléphone *",
    objet: "Objet *",
    message: "Votre message *",
    submitBtn: "Envoyer",
    formErrors: {
      nom: "Veuillez entrer un nom valide (2 à 30 lettres).",
      prenom: "Veuillez entrer un prénom valide (2 à 30 lettres).",
      email: "Veuillez entrer une adresse e-mail valide.",
      telephone: "Veuillez entrer un numéro de téléphone valide.",
      objet: "Veuillez indiquer un objet (minimum 2 caractères).",
      messageVide: "Le message ne peut pas être vide.",
      messageCourt: "Le message doit contenir au moins 20 caractères.",
      noTags: "Les balises HTML ne sont pas autorisées.",
      noScript: "Les balises <script> sont strictement interdites.",
      success: "Votre message a bien été envoyé ✅",
      errorSend: "Veuillez corriger les erreurs avant d'envoyer.",
    },

    //CGU
    TitrePageCGU: "Cruchaudet | Conditions générales d'utilisation",
    titreCgu1: "Conditions Générales d'Utilisation",
    paragrapheCgu1: "Bienvenue sur <strong>Cruchaudet</strong>. En accédant à ce site (<a class='lienCgu' href='https://lilianbouzeau.github.io/index.html'>https://lilianbouzeau.github.io/index.html</a>), vous acceptez de respecter les présentes conditions générales d'utilisation (CGU). Si vous n’acceptez pas ces conditions, veuillez ne pas utiliser ce site.",
    titreCgu2: "1. Propriété du site",
    paragrapheCgu2: "Le contenu, la structure et les éléments graphiques du site sont la propriété exclusive de Cruchaudet. Toute reproduction, totale ou partielle, est interdite sans autorisation préalable.",
    titreCgu3: "2. Utilisation du site",
    paragrapheCgu3: "Vous vous engagez à utiliser ce site à des fins légales uniquement. Toute utilisation abusive, modification ou tentative de piratage est strictement interdite.",
    titreCgu4: "3. Responsabilité",
    paragrapheCgu4: "Cruchaudet met tout en œuvre pour assurer l’exactitude des informations, mais ne peut garantir qu’il n’existe aucune erreur. L’utilisation du site se fait sous votre entière responsabilité.",
    titreCgu5: "4. Données personnelles",
    paragrapheCgu5: "Aucune donnée personnelle n’est collectée à votre insu. Pour plus d’informations, vous pouvez nous contacter via <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a>.",
    titreCgu6: "5. Modifications des CGU",
    paragrapheCgu6: "Cruchaudet se réserve le droit de modifier ces CGU à tout moment. Les modifications seront publiées sur cette page.",
    titreCgu7: "6. Contact",
    paragrapheCgu7: "Pour toute question concernant les CGU, vous pouvez nous contacter via <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a>.",
    paragrapheCgu8: "© 2026 Cruchaudet. Tous droits réservés.",

    //PAGE PARTENAIRES
    titrePClients: "Clients",
    titreTemoignage: "Nos clients en parlent",
    legendeTitre: 'Légende',
    legendeP: 'Pays où nous exportons',
    titrePFournisseurs: 'Nos partenaires',
    //PAGE ENGAGEMENT
    titrepageEngagement: 'Nos engagements',
    titreEngagements1: 'Qualité',
    titreEngagements2: 'Service',
    //COOKIES
    cookiesP: '🍪 Nous utilisons des cookies pour améliorer votre expérience sur notre site.',
    cookiesA: 'En savoir plus',
    acceptCookies: 'Accepter',
    declineCookies: 'Refuser',
    },

    EN: {
    //TITRE
    TitrePage1: "Cruchaudet | The Story",
    TitrePage2: "Cruchaudet | Shipping Service",
    TitrePage3: "Cruchaudet | Our Partners",
    TitrePage4: "Cruchaudet | Departments",
    TitrePage5: "Cruchaudet | Our Commitments",
    TitrePage404: "Cruchaudet | Page 404",

    //NAV
    navHistory: "Our Story",
    navExport: "Shipping Service",
    navEngagement: "Our Commitments",
    navRayon: "Departments",
    navRayonLegumes: "Vegetables",
    navRayonFruits: "Fruits",
    navRayonMiniLegumes: 'Baby Vegetables',
    navRayonJP: 'Baby Leaves',
    navRayonG: 'Sprouts',
    navRayonExotic: "Exotic",
    navRayonC: "Condiments",
    navContactExport: "Contact Form",
    navNosPartenaires: "Our Partners",
    navClients: "Clients",
    navFournisseurs: "Suppliers",
    navContact: "Contact",

    //PAGE INDEX
    titre: "Cruchaudet",
    phrase1: "Fresh fruits and vegetables, every day.",
    phrase2: "Departing from <span class='Rungis'>Rungis</span>.",
    titrepageHistoire: "History",
    titreBio1: "Beginning",
    titreBio2: "Evolution",
    titreBio3: "Present",
    titreChiffresGeneral: "Some figures",
    titreChiffresCreation: "Founded",
    titreChiffresExpertise: "Expertise",
    titreChiffresProduits: "Products",

    //PAGE RAYON
    titrepageRayons: "Departments",
    titreRayon1: "Fruits",
    titreRayon2: "Vegetables",
    titreRayon3: "Baby Vegetables",
    titreRayon4: "Condiments",
    titreRayon5: "Exotic",
    titreRayon6: "Baby Leaves",
    titreRayon7: "Sprouts",

    //FOOTER
    cguFooter: "Terms and Conditions of Use",
    contact: "Contact",
    footerCopy: "Copyright © 2026 Cruchaudet.com. All rights reserved.",

    //404
    text404: "Oops! The page you are looking for does not exist.",
    btn404: "Back to Home",

    //PAGE EXPORT
    TitreExport: "Delivery Service",
    contactFormTitle: "Export Contact",
    nom: "Last Name *",
    prenom: "First Name *",
    email: "Email *",
    telephone: "Phone *",
    objet: "Subject *",
    message: "Your message *",
    submitBtn: "Send",
    formErrors: {
      nom: "Please enter a valid last name (2 to 30 letters).",
      prenom: "Please enter a valid first name (2 to 30 letters).",
      email: "Please enter a valid email address.",
      telephone: "Please enter a valid phone number.",
      objet: "Please enter a subject (at least 2 characters).",
      messageVide: "Message cannot be empty.",
      messageCourt: "Message must be at least 20 characters long.",
      noTags: "HTML tags are not allowed.",
      noScript: "<script> tags are strictly forbidden.",
      success: "Your message has been sent successfully ✅",
      errorSend: "Please fix the errors before sending.",
    },

    //CGU
    TitrePageCGU: "Cruchaudet | Terms of Use",
    titreCgu1: "Terms of Use",
    paragrapheCgu1: "Welcome to <strong>Cruchaudet</strong>. By accessing this site (<a class='lienCgu' href='https://lilianbouzeau.github.io/index.html'>https://lilianbouzeau.github.io/index.html</a>), you agree to comply with these Terms of Use (TOU). If you do not accept these terms, please do not use this site.",
    titreCgu2: "1. Site Ownership",
    paragrapheCgu2: "The content, structure, and graphic elements of the site are the exclusive property of Cruchaudet. Any reproduction, in whole or in part, is prohibited without prior authorization.",
    titreCgu3: "2. Use of the Site",
    paragrapheCgu3: "You agree to use this site for legal purposes only. Any abusive use, modification, or hacking attempt is strictly prohibited.",
    titreCgu4: "3. Liability",
    paragrapheCgu4: "Cruchaudet makes every effort to ensure the accuracy of information, but cannot guarantee that there are no errors. Use of the site is entirely at your own risk.",
    titreCgu5: "4. Personal Data",
    paragrapheCgu5: "No personal data is collected without your knowledge. For more information, you can contact us at <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a>.",
    titreCgu6: "5. Changes to the Terms",
    paragrapheCgu6: "Cruchaudet reserves the right to modify these Terms of Use at any time. Changes will be posted on this page.",
    titreCgu7: "6. Contact",
    paragrapheCgu7: "For any questions regarding the Terms of Use, you can contact us at <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a>.",
    paragrapheCgu8: "© 2026 Cruchaudet. All rights reserved.",

    //PAGE PARTENAIRES
    titrePClients: "Clients",
    titreTemoignage: "Our customers talk about it",
    legendeTitre: 'Legend',
    legendeP: 'Countries where we export',
    titrePFournisseurs: 'Our partners',

    //PAGE ENGAGEMENT
    titrepageEngagement: "Our Commitments",
    titreEngagements1: "Quality",
    titreEngagements2: "Service",
    //COOKIES
    cookiesP: '🍪 We use cookies to improve your experience on our website.',
    cookiesA: 'Learn more',
    acceptCookies: 'Accept',
    declineCookies: 'Decline',
    },

    ES: {
    //TITRE
    TitrePage1: "Cruchaudet | La historia",
    TitrePage2: "Cruchaudet | Servicio de Envío",
    TitrePage3: "Cruchaudet | Nuestros Socios",
    TitrePage4: "Cruchaudet | Secciones",
    TitrePage5: "Cruchaudet | Nuestros compromisos",
    TitrePage404: "Cruchaudet | Página 404",

    //NAV
    navHistory: "Nuestra historia",
    navExport: "Servicio de Envío",
    navEngagement: "Nuestros compromisos",
    navRayon: "Secciones",
    navRayonLegumes: "Verduras",
    navRayonFruits: "Frutas",
    navRayonExotic: "Exóticas",
    navRayonMiniLegumes: 'Mini Verduras',
    navRayonC: "Condimentos",
    navRayonJP: 'Brotes Tiernos',
    navRayonG: 'Germinados',
    navExotic: "Exóticas",
    navNosPartenaires: "Nuestros Socios",
    navContactExport: "Formulario de Contacto",
    navClients: "Clientes",
    navFournisseurs: "Proveedores",
    navContact: "Contacto",

    //PAGE INDEX
    titre: "Cruchaudet",
    phrase1: "Frutas y verduras frescas, cada día.",
    phrase2: "Desde <span class='Rungis'>Rungis</span>.",
    titrepageHistoire: "Historia",
    titreBio1: "Inicio",
    titreBio2: "Evolución",
    titreBio3: "Presente",
    titreChiffresGeneral: "Algunos números",
    titreChiffresCreation: "Creación",
    titreChiffresExpertise: "Experiencia",
    titreChiffresProduits: "Productos",

    //PAGE RAYON
    titrepageRayons: "Secciones",
    titreRayon1: "Frutas",
    titreRayon2: "Verduras",
    titreRayon3: "Mini Verduras",
    titreRayon4: "Condimentos",
    titreRayon5: "Exóticos",
    titreRayon6: "Brotes Tiernos",
    titreRayon7: "Germinados",

    //FOOTER
    cguFooter: "Condiciones de uso",
    contact: "Contacto",
    footerCopy: "Copyright © 2026 Cruchaudet.com. Todos los derechos reservados.",

    //404
    text404: "¡Ups! La página que buscas no existe.",
    btn404: "Volver al inicio",

    //PAGE EXPORT
    TitreExport: "Servicio de Entrega",
    contactFormTitle: "Contacto Exportación",
    nom: "Apellido *",
    prenom: "Nombre *",
    email: "Correo electrónico *",
    telephone: "Teléfono *",
    objet: "Asunto *",
    message: "Tu mensaje *",
    submitBtn: "Enviar",
    formErrors: {
      nom: "Introduce un apellido válido (2 a 30 letras).",
      prenom: "Introduce un nombre válido (2 a 30 letras).",
      email: "Introduce un correo electrónico válido.",
      telephone: "Introduce un número de teléfono válido.",
      objet: "Introduce un asunto (mínimo 2 caracteres).",
      messageVide: "El mensaje no puede estar vacío.",
      messageCourt: "El mensaje debe tener al menos 20 caracteres.",
      noTags: "Las etiquetas HTML no están permitidas.",
      noScript: "Las etiquetas <script> están estrictamente prohibidas.",
      success: "Tu mensaje ha sido enviado correctamente ✅",
      errorSend: "Corrige los errores antes de enviar.",
    },

    //CGU
    TitrePageCGU: "Cruchaudet | Términos de Uso",
    titreCgu1: "Términos de Uso",
    paragrapheCgu1: "Bienvenido a <strong>Cruchaudet</strong>. Al acceder a este sitio (<a class='lienCgu' href='https://lilianbouzeau.github.io/index.html'>https://lilianbouzeau.github.io/index.html</a>), acepta cumplir con estos Términos de Uso (TOU). Si no acepta estos términos, no utilice este sitio.",
    titreCgu2: "1. Propiedad del sitio",
    paragrapheCgu2: "El contenido, la estructura y los elementos gráficos del sitio son propiedad exclusiva de Cruchaudet. Cualquier reproducción, total o parcial, está prohibida sin autorización previa.",
    titreCgu3: "2. Uso del sitio",
    paragrapheCgu3: "Se compromete a utilizar este sitio únicamente con fines legales. Cualquier uso abusivo, modificación o intento de hacking está estrictamente prohibido.",
    titreCgu4: "3. Responsabilidad",
    paragrapheCgu4: "Cruchaudet hace todo lo posible para garantizar la exactitud de la información, pero no puede garantizar que no existan errores. El uso del sitio es bajo su propia responsabilidad.",
    titreCgu5: "4. Datos personales",
    paragrapheCgu5: "No se recopilan datos personales sin su conocimiento. Para más información, puede contactarnos en <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a>.",
    titreCgu6: "5. Modificaciones de los Términos",
    paragrapheCgu6: "Cruchaudet se reserva el derecho de modificar estos Términos de Uso en cualquier momento. Los cambios se publicarán en esta página.",
    titreCgu7: "6. Contacto",
    paragrapheCgu7: "Para cualquier pregunta sobre los Términos de Uso, puede contactarnos en <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a>.",
    paragrapheCgu8: "© 2026 Cruchaudet. Todos los derechos reservados.",

    //PAGE PARTENAIRES
    titrePClients: "Clientes",
    titreTemoignage: "Nuestros clientes hablan de ello",
    legendeTitre: 'Leyenda',
    legendeP: 'Países donde exportamos',
    titrePFournisseurs: 'Nuestros socios',
    //PAGE ENGAGEMENT
    titrepageEngagement: "Nuestros compromisos",
    titreEngagements1: "Calidad",
    titreEngagements2: "Servicio",
    //COOKIES
    cookiesP: '🍪 Utilizamos cookies para mejorar su experiencia en nuestro sitio web.',
    cookiesA: 'Saber más',
    acceptCookies: 'Aceptar',
    declineCookies: 'Rechazar',
    },

    DE: {
    //TITRE
    TitrePage1: "Cruchaudet | Die Geschichte",
    TitrePage2: "Cruchaudet | Versandservice",
    TitrePage3: "Cruchaudet | Unsere Partner",
    TitrePage4: "Cruchaudet | Abteilungen",
    TitrePage5: "Cruchaudet | Unsere Verpflichtungen",
    TitrePage404: "Cruchaudet | Seite 404",

    //NAV
    navHistory: "Unsere Geschichte",
    navExport: "Versandservice",
    navEngagement: "Unsere Verpflichtungen",
    navRayon: "Abteilungen",
    navRayonLegumes: "Gemüse",
    navRayonFruits: "Obst",
    navRayonExotic: "Exotische Produkte",
    navRayonMiniLegumes: "Mini-Gemüse",
    navRayonJP: "Zarte Sprossen",
    navRayonG: "Sprossen",
    navRayonC: "Gewürze",
    navNosPartenaires: "Unsere Partner",
    navContactExport: "Kontaktformular",
    navClients: "Kunden",
    navFournisseurs: "Lieferanten",
    navContact: "Kontakt",

    //PAGE INDEX
    titre: "Cruchaudet",
    phrase1: "Frisches Obst und Gemüse, jeden Tag.",
    phrase2: "Abfahrt von <span class='Rungis'>Rungis</span>.",
    titrepageHistoire: "Geschichte",
    titreBio1: "Anfang",
    titreBio2: "Entwicklung",
    titreBio3: "Gegenwart",
    titreChiffresGeneral: "Einige Zahlen",
    titreChiffresCreation: "Gründung",
    titreChiffresExpertise: "Erfahrung",
    titreChiffresProduits: "Produkte",

    //PAGE RAYON
    titrepageRayons: "Abteilungen",
    titreRayon1: "Obst",
    titreRayon2: "Gemüse",
    titreRayon3: "Mini-Gemüse",
    titreRayon4: "Gewürze",
    titreRayon5: "Exotische Produkte",
    titreRayon6: "Zarte Sprossen",
    titreRayon7: "Sprossen",

    //FOOTER
    cguFooter: "Nutzungsbedingungen",
    contact: "Kontakt",
    footerCopy: "Copyright © 2026 Cruchaudet.com. Alle Rechte vorbehalten.",

    //404
    text404: "Ups! Die Seite, die du suchst, existiert nicht.",
    btn404: "Zurück zur Startseite",

    //PAGE EXPORT
    TitreExport: "Lieferservice",
    contactFormTitle: "Export-Kontakt",
    nom: "Nachname *",
    prenom: "Vorname *",
    email: "E-Mail *",
    telephone: "Telefon *",
    objet: "Betreff *",
    message: "Deine Nachricht *",
    submitBtn: "Senden",
    formErrors: {
      nom: "Gib einen gültigen Nachnamen ein (2–30 Buchstaben).",
      prenom: "Gib einen gültigen Vornamen ein (2–30 Buchstaben).",
      email: "Gib eine gültige E-Mail-Adresse ein.",
      telephone: "Gib eine gültige Telefonnummer ein.",
      objet: "Gib einen Betreff ein (mindestens 2 Zeichen).",
      messageVide: "Die Nachricht darf nicht leer sein.",
      messageCourt: "Die Nachricht muss mindestens 20 Zeichen enthalten.",
      noTags: "HTML-Tags sind nicht erlaubt.",
      noScript: "<script>-Tags sind streng verboten.",
      success: "Deine Nachricht wurde erfolgreich gesendet ✅",
      errorSend: "Bitte korrigiere die Fehler vor dem Absenden.",
    },

    //CGU
    TitrePageCGU: "Cruchaudet | Allgemeine Nutzungsbedingungen",
    titreCgu1: "Allgemeine Nutzungsbedingungen",
    paragrapheCgu1: "Willkommen auf <strong>Cruchaudet</strong>. Durch den Zugriff auf diese Website (<a class='lienCgu' href='https://lilianbouzeau.github.io/index.html'>https://lilianbouzeau.github.io/index.html</a>) erklärst du dich mit diesen Allgemeinen Nutzungsbedingungen einverstanden. Wenn du diese Bedingungen nicht akzeptierst, nutze diese Website bitte nicht.",
    titreCgu2: "1. Eigentum der Website",
    paragrapheCgu2: "Der Inhalt, die Struktur und die grafischen Elemente dieser Website sind ausschließliches Eigentum von Cruchaudet. Jede vollständige oder teilweise Vervielfältigung ist ohne vorherige Genehmigung untersagt.",
    titreCgu3: "2. Nutzung der Website",
    paragrapheCgu3: "Du verpflichtest dich, diese Website nur für rechtmäßige Zwecke zu nutzen. Jede missbräuchliche Nutzung, Änderung oder jeder Hacking-Versuch ist streng verboten.",
    titreCgu4: "3. Haftung",
    paragrapheCgu4: "Cruchaudet bemüht sich um die Genauigkeit der Informationen, kann jedoch keine Fehlerfreiheit garantieren. Die Nutzung der Website erfolgt auf eigene Verantwortung.",
    titreCgu5: "4. Persönliche Daten",
    paragrapheCgu5: "Es werden keine persönlichen Daten ohne dein Wissen gesammelt. Für weitere Informationen kannst du uns unter <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a> kontaktieren.",
    titreCgu6: "5. Änderungen der Nutzungsbedingungen",
    paragrapheCgu6: "Cruchaudet behält sich das Recht vor, diese Nutzungsbedingungen jederzeit zu ändern. Änderungen werden auf dieser Seite veröffentlicht.",
    titreCgu7: "6. Kontakt",
    paragrapheCgu7: "Bei Fragen zu den Nutzungsbedingungen kannst du uns unter <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a> kontaktieren.",
    paragrapheCgu8: "© 2026 Cruchaudet. Alle Rechte vorbehalten.",

    //PAGE PARTENAIRES
    titrePClients: "Kunden",
    titreTemoignage: "Unsere Kunden sprechen über uns",
    legendeTitre: "Legende",
    legendeP: "Länder, in die wir exportieren",
    titrePFournisseurs: "Unsere Partner",

    //PAGE ENGAGEMENT
    titrepageEngagement: "Unsere Verpflichtungen",
    titreEngagements1: "Qualität",
    titreEngagements2: "Service",

    //COOKIES
    cookiesP: "🍪 Wir verwenden Cookies, um deine Erfahrung auf unserer Website zu verbessern.",
    cookiesA: "Mehr erfahren",
    acceptCookies: "Akzeptieren",
    declineCookies: "Ablehnen",
    },
  };

  // Langue courante (persistée en localStorage)
  let currentLang = localStorage.getItem("lang") || "FR";
  // ---------- Fonctions pour le formulaire (placeholders + bouton) ----------
  function setFormLanguage(lang) {
    const t = translations[lang];
    const form = document.getElementById("contactForm");
    if (!form) return;
    const safeGet = id => document.getElementById(id);
    if (safeGet("contactFormTitle")) safeGet("contactFormTitle").innerText = t.contactFormTitle || "";
    if (safeGet("nom")) safeGet("nom").placeholder = t.nom || "";
    if (safeGet("prenom")) safeGet("prenom").placeholder = t.prenom || "";
    if (safeGet("email")) safeGet("email").placeholder = t.email || "";
    if (safeGet("telephone")) safeGet("telephone").placeholder = t.telephone || "";
    if (safeGet("objet")) safeGet("objet").placeholder = t.objet || "";
    if (safeGet("message")) safeGet("message").placeholder = t.message || "";
    if (safeGet("submitBtn")) safeGet("submitBtn").innerText = t.submitBtn || "";
  }

  // ---------- setLanguage : applique toutes les traductions ----------
  function setLanguage(lang, retry = 0) {

    currentLang = lang;
    localStorage.setItem("lang", lang);

    const tObj = translations[lang] || {};
    for (const [id, text] of Object.entries(tObj)) {
    if (id === "formErrors") continue;
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") continue;
    if (el.tagName === "A" && el.querySelector("i.caret")) {
      const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.nodeValue = text;
    } else {
      el.innerHTML = text;
    }
    }

    setFormLanguage(lang);

    const searchInput = document.getElementById("searchCatalog");
    if (searchInput) {
    searchInput.placeholder = (translations[lang] && translations[lang].searchPlaceholder) || "";
    }

    const langButtons = document.querySelectorAll(".btnLang");
    if (langButtons.length > 0) {
    langButtons.forEach(btn => btn.style.display = "flex");
    const activeBtn = document.getElementById(`lang${lang}`);
    if (activeBtn) activeBtn.style.display = "none";
    } else if (retry < 6) {
    setTimeout(() => setLanguage(lang, retry + 1), 100);
    return;
    }


    const currentErrors = document.querySelectorAll(".error-msg");
    if (currentErrors.length > 0) {
    const t = translations[currentLang].formErrors || {};
    currentErrors.forEach(err => {
      const key = err.dataset.key;
      if (key && t[key]) err.textContent = t[key];
    });
    }

    const formMsg = document.getElementById("formMsg");
    if (formMsg && formMsg.dataset.key) {
    const formMessages = translations[currentLang].formMessages || {};
    const key = formMsg.dataset.key;
    if (key && formMessages[key]) formMsg.textContent = formMessages[key];
    }
  }

  function attachLangButtonsListeners() {
    const btns = document.querySelectorAll(".btnLang");
    if (!btns || btns.length === 0) return;
    btns.forEach(btn => {
    if (btn.dataset.langInit === "1") return;
    btn.dataset.langInit = "1";
    btn.addEventListener("click", () => {
      const lang = btn.id.replace("lang", "");
      setLanguage(lang);
      updateActiveFiltersUI();
      closeAllSousMenus();
    });
    });
  }


  // ---------- Initialisation finale de la langue + listeners ----------
  // On attache d'abord les listeners (s'ils existent déjà), puis on force setLanguage
  attachLangButtonsListeners();
  setLanguage(currentLang); // lance MAJ textes + masquage bouton actif
  // ensuite, s'il manque encore des boutons (menu rendu plus tard), on retente d'attacher
  setTimeout(attachLangButtonsListeners, 200);
  setTimeout(attachLangButtonsListeners, 600);
  } // fin initMenusEtTraductions()

}); // fin DOMContentLoaded

