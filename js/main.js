document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("mainContent");

  // Masquer le contenu principal
  if (mainContent) mainContent.style.display = "none";

  // Noter le temps de départ pour le loader
  const startTime = Date.now();

  window.addEventListener("load", () => {
    const elapsed = Date.now() - startTime;
    const minDelay = 500; // 0,5 seconde minimum
    const remaining = Math.max(minDelay - elapsed, 0);

    setTimeout(() => {
      if (loader) loader.style.display = "none";
      if (mainContent) mainContent.style.display = "block";

      // Appel de la fonction principale après le chargement
      initMenusEtTraductions();
    }, remaining);
  });

  // ==================== FONCTION PRINCIPALE ====================
  function initMenusEtTraductions() {
    // ==================== MENU HAMBURGER ====================
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", e => {
        e.stopPropagation();
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        if (!navMenu.classList.contains("active")) closeAllSousMenus();
      });

      document.addEventListener("click", e => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) closeAllSousMenus();
      });
    }

    // ==================== INITIALISATION DES ICÔNES ====================
    document.querySelectorAll("#nav-menu .deroulant > a").forEach(link => {
      if (!link.querySelector("i.caret")) {
        const icon = document.createElement("i");
        icon.classList.add("bi", "bi-caret-down-fill", "caret");
        link.appendChild(icon);
      }
    });

    // ==================== GESTION DES SOUS-MENUS ====================
    const deroulants = document.querySelectorAll("#nav-menu .deroulant");

    deroulants.forEach(li => {
      const link = li.querySelector(":scope > a");
      if (!link) return;

      const icon = link.querySelector("i.caret");
      const sous = li.querySelector(".sous");

      link.addEventListener("click", e => {
        if (!sous) return;
        e.preventDefault();

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
          icon.classList.remove("bi-caret-down-fill");
          icon.classList.add("bi-caret-up-fill");
        } else {
          icon.classList.remove("bi-caret-up-fill");
          icon.classList.add("bi-caret-down-fill");
        }
      });
    });

    // ==================== FONCTION FERMETURE ====================
    function closeAllSousMenus() {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
      document.querySelectorAll("#nav-menu .deroulant").forEach(li => li.classList.remove("open"));
      document.querySelectorAll("#nav-menu .deroulant i.caret").forEach(icon => {
        icon.classList.remove("bi-caret-up-fill");
        icon.classList.add("bi-caret-down-fill");
      });
    }

    // ==================== GESTION DES LIENS ACTIFS ====================
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

    // ==================== ANIMATIONS AU SCROLL ====================
    const scrollElements = document.querySelectorAll('.scroll-animate, .scroll-animateG, .scroll-animateD');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    scrollElements.forEach(el => observer.observe(el));

    // ==================== BOUTON RETOUR EN HAUT ====================
    const btnTop = document.getElementById("btnTop");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) btnTop.classList.add("show");
      else btnTop.classList.remove("show");
    });
    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ==================== TRADUCTIONS MULTILINGUES ====================
  const translations = {
    FR: {
      TitrePage1:"Cruchaudet | L'histoire",
      TitrePage2:"Cruchaudet | Export",
      TitrePage3:"Cruchaudet | Catalogue",
      TitrePage4:"Cruchaudet | Les rayons",
      navHistory: "L'histoire",
      navExport: "Export",
      navRayon:'Les rayons',
      navRayonLegumes: "Légumes",
      navRayonFruits: "Fruits",
      navRayonExotic: "Exotic",
      navRayonPDT: "Pomme de terre & condiments",
      navContactExport: "Prise de contact",
      navCatalogue: "Catalogue",
      navLegumes: "Légumes",
      navFruits: "Fruits",
      navExotic: "Exotic",
      navPDT: "Pomme de terre & condiments",
      navContact: "Contact",
      titre: "Cruchaudet",
      phrase1: "Des fruits et légumes frais, chaque jour.",
      phrase2: "Au départ de <span class='Rungis'>Rungis</span>.",
      titrepageHistoire: "L'histoire",
      titreBio1: 'Début',
      titreBio2: 'Evolution',
      titreBio3: 'Maintenant',
      titrepageRayons:'Les rayons',
      titreRayon1: "Légumes",
      titreRayon2: "Fruits",
      titreRayon3: "Exotic",
      titreRayon4: "Pomme de terre & condiments",
      contact: "Contact",
      footerCopy: "Copyright © 2025 Cruchaudet.com. Tous droits réservés.",
      TitreExport: "Export",
      contactFormTitle: "Contact Export",
      nom: "Nom *",
      prenom: "Prénom *",
      email: "Email *",
      telephone: "Téléphone *",
      objet: "Objet *",
      message: "Votre message *",
      submitBtn: "Envoyer",
      formErrors: {
        allFields: "Veuillez remplir tous les champs obligatoires.",
        email: "Veuillez entrer une adresse email valide.",
        phone: "Veuillez entrer un numéro de téléphone valide.",
        noTags: "Les balises HTML ne sont pas autorisées.",
        errorSend: "Une erreur est survenue lors de l'envoi du message.",
        success: "Votre message a bien été envoyé ✅"
      },
      btnLegumes: 'Légumes',
      btnFruits: 'Fruits',
      btnExotic: 'Exotic',
      btnPDT: 'Pomme de terre & condiments',
      searchPlaceholder: "Rechercher dans le catalogue...",
    },
    EN: {
      TitrePage1:"Cruchaudet | The Story",
      TitrePage2:"Cruchaudet | Export",
      TitrePage3:"Cruchaudet | Catalog",
      TitrePage4:"Cruchaudet | Departments",
      navHistory: "Our Story",
      navExport: "Export",
      navRayon: "Department",
      navRayonLegumes: "Vegetables",
      navRayonFruits: "Fruits",
      navRayonExotic: "Exotic",
      navRayonPDT: "Potatoes & condiments",
      navContactExport: "Contact Form",
      navCatalogue: "Catalog",
      navLegumes: "Vegetables",
      navFruits: "Fruits",
      navExotic: "Exotic",
      navPDT: "Potatoes & condiments",
      navContact: "Contact",
      titre: "Cruchaudet",
      phrase1: "Fresh fruits and vegetables, every day.",
      phrase2: "Departing from <span class='Rungis'>Rungis</span>.",
      titrepageHistoire: "History",
      titreBio1: 'Beginning',
      titreBio2: 'Evolution',
      titreBio3: 'Now',
      titrepageRayons: "Departments",
      titreRayon1: "Vegetables",
      titreRayon2: "Fruits",
      titreRayon3: "Exotic",
      titreRayon4: "Potatoes & condiments",
      contact: "Contact",
      footerCopy: "Copyright © 2025 Cruchaudet.com. All rights reserved.",
      TitreExport: "Export",
      contactFormTitle: "Export Contact",
      nom: "Last Name *",
      prenom: "First Name *",
      email: "Email *",
      telephone: "Phone *",
      objet: "Subject *",
      message: "Your message *",
      submitBtn: "Send",
      formErrors: {
        allFields: "Please fill in all required fields.",
        email: "Please enter a valid email address.",
        phone: "Please enter a valid phone number.",
        noTags: "HTML tags are not allowed.",
        errorSend: "An error occurred while sending your message.",
        success: "Your message has been sent successfully ✅"
      },
      btnLegumes: 'Vegetables',
      btnFruits: 'Fruits',
      btnExotic: 'Exotic',
      btnPDT: 'Potatoes & condiments',
      searchPlaceholder: "Search in the catalog...",
    },
    ES: {
      TitrePage1:"Cruchaudet | La historia",
      TitrePage2:"Cruchaudet | Exportación",
      TitrePage3:"Cruchaudet | Catálogo",
      TitrePage4:"Cruchaudet | Secciones",
      navHistory: "Nuestra historia",
      navExport: "Exportación",
      navRayon: "Sección",
      navRayonLegumes: "Verduras",
      navRayonFruits: "Frutas",
      navRayonExotic: "Exótico",
      navRayonPDT: "Patatas y condimentos",
      navContactExport: "Formulario de contacto",
      navCatalogue: "Catálogo",
      navLegumes: "Verduras",
      navFruits: "Frutas",
      navExotic: "Exóticas",
      navPDT: "Patatas y condimentos",
      navContact: "Contacto",
      titre: "Cruchaudet",
      phrase1: "Frutas y verduras frescas, cada día.",
      phrase2: "Desde <span class='Rungis'>Rungis</span>.",
      titrepageHistoire: "Historia",
      titreBio1: 'Comienzo',
      titreBio2: 'Evolución',
      titreBio3: 'Ahora',
      titrepageRayons: "Secciones",
      titreRayon1: "Verduras",
      titreRayon2: "Frutas",
      titreRayon3: "Exótico",
      titreRayon4: "Patatas y condimentos",
      contact: "Contacto",
      footerCopy: "Copyright © 2025 Cruchaudet.com. Todos los derechos reservados.",
      TitreExport: "Exportación",
      contactFormTitle: "Contacto Exportación",
      nom: "Apellido *",
      prenom: "Nombre *",
      email: "Correo electrónico *",
      telephone: "Teléfono *",
      objet: "Asunto *",
      message: "Su mensaje *",
      submitBtn: "Enviar",
      formErrors: {
        allFields: "Por favor, rellene todos los campos obligatorios.",
        email: "Por favor, introduzca una dirección de correo válida.",
        phone: "Por favor, introduzca un número de teléfono válido.",
        noTags: "No se permiten etiquetas HTML.",
        errorSend: "Se ha producido un error al enviar el mensaje.",
        success: "Su mensaje ha sido enviado correctamente ✅"
      },
      btnLegumes: 'Verduras',
      btnFruits: 'Frutas',
      btnExotic: 'Exóticas',
      btnPDT: 'Patatas y condimentos',
      searchPlaceholder: "Buscar en el catálogo...",
    },
    IT: {
      TitrePage1:"Cruchaudet | La storia",
      TitrePage2:"Cruchaudet | Esportazione",
      TitrePage3:"Cruchaudet | Catalogo",
      TitrePage4:"Cruchaudet | Reparti",
      navHistory: "La nostra storia",
      navExport: "Esportazione",
      navRayon: "Reparto",
      navRayonLegumes: "Verdure",
      navRayonFruits: "Frutta",
      navRayonExotic: "Esotico",
      navRayonPDT: "Patate e condimenti",
      navContactExport: "Modulo di contatto",
      navCatalogue: "Catalogo",
      navLegumes: "Verdure",
      navFruits: "Frutta",
      navExotic: "Esotici",
      navPDT: "Patate & condimenti",
      navContact: "Contatto",
      titre: "Cruchaudet",
      phrase1: "Frutta e verdura fresca, ogni giorno.",
      phrase2: "In partenza da <span class='Rungis'>Rungis</span>.",
      titrepageHistoire: "La storia",
      titreBio1: 'Inizio',
      titreBio2: 'Evoluzione',
      titreBio3: 'Adesso',
      titrepageRayons: "Reparti",
      titreRayon1: "Verdure",
      titreRayon2: "Frutta",
      titreRayon3: "Esotici",
      titreRayon4: "Patate & condimenti",
      contact: "Contatto",
      footerCopy: "Copyright © 2025 Cruchaudet.com. Tutti i diritti riservati.",
      TitreExport: "Esportazione",
      contactFormTitle: "Contatto Export",
      nom: "Cognome *",
      prenom: "Nome *",
      email: "Email *",
      telephone: "Telefono *",
      objet: "Oggetto *",
      message: "Il tuo messaggio *",
      submitBtn: "Invia",
      formErrors: {
        allFields: "Compila tutti i campi obbligatori.",
        email: "Inserisci un indirizzo email valido.",
        phone: "Inserisci un numero di telefono valido.",
        noTags: "I tag HTML non sono consentiti.",
        errorSend: "Si è verificato un errore durante l'invio del messaggio.",
        success: "Il tuo messaggio è stato inviato con successo ✅"
      },
      btnLegumes: 'Verdure',
      btnFruits: 'Frutta',
      btnExotic: 'Esotici',
      btnPDT: 'Patate & condimenti',
      searchPlaceholder: "Cerca nel catalogo...",
    },
  };

    let currentLang = localStorage.getItem("lang") || "FR";

    function setLanguage(lang) {
      currentLang = lang;
      localStorage.setItem("lang", lang);

      for (const [id, text] of Object.entries(translations[lang])) {
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
      if (searchInput) searchInput.placeholder = translations[lang].searchPlaceholder;

      document.querySelectorAll(".btnLang").forEach(btn => btn.style.display = "flex");
      const currentBtn = document.getElementById(`lang${lang}`);
      if (currentBtn) currentBtn.style.display = "none";

      if (typeof updateVisibleMessages === "function") updateVisibleMessages();
    }

    function setFormLanguage(lang) {
      const t = translations[lang];
      const form = document.getElementById("contactForm");
      if (!form) return;
      document.getElementById("contactFormTitle").innerText = t.contactFormTitle;
      document.getElementById("nom").placeholder = t.nom;
      document.getElementById("prenom").placeholder = t.prenom;
      document.getElementById("email").placeholder = t.email;
      document.getElementById("telephone").placeholder = t.telephone;
      document.getElementById("objet").placeholder = t.objet;
      document.getElementById("message").placeholder = t.message;
      document.getElementById("submitBtn").innerText = t.submitBtn;
    }

    document.querySelectorAll(".btnLang").forEach(btn => {
      btn.addEventListener("click", () => {
        const lang = btn.id.replace("lang", "");
        setLanguage(lang);
      });
    });

    // ==================== FILTRE CATALOGUE ====================
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        console.log("Filtre appliqué:", btn.dataset.type);
      });
    });

    setLanguage(currentLang);
  }
});
