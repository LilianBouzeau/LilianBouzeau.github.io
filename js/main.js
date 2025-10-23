document.addEventListener("DOMContentLoaded", () => {

  // ==================== MENU HAMBURGER ====================
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", e => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      if (!navMenu.classList.contains("active")) {
        document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
      }
    });

    document.addEventListener("click", e => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) closeResponsiveMenus();
    });

    navMenu.addEventListener("click", e => {
      const link = e.target.closest("a");
      if (!link) return;
      const li = link.closest(".deroulant");
      const sous = li ? li.querySelector(".sous") : null;
      if (window.innerWidth <= 768 && sous) {
        if (!sous.classList.contains("active")) {
          e.preventDefault();
          document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
          sous.classList.add("active");
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeResponsiveMenus();
    });

    function closeResponsiveMenus() {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
    }

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#nav-menu a").forEach(link => {
      link.classList.remove("active");
    });
    document.querySelectorAll("#nav-menu .sous").forEach(s => s.classList.remove("active"));
    document.querySelectorAll("#nav-menu a").forEach(link => {
      const href = link.getAttribute("href");
      if (href.startsWith("#")) {
        if (currentPath === "index.html") {
          link.classList.add("active");
          const parentSous = link.closest(".sous");
          if (parentSous) parentSous.classList.add("active");
        }
      } else {
        const linkFile = href.split("/").pop().split("#")[0];
        if (linkFile === currentPath) {
          link.classList.add("active");
          const parentSous = link.closest(".sous");
          if (parentSous) parentSous.classList.add("active");
          const parentDeroulant = link.closest(".deroulant");
          if (parentDeroulant) parentDeroulant.classList.add("active");
        }
      }
    });
  }

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
      //NAV
      navHistory: "L'histoire",
      navExport: "Export",
      navContactExport: "Prise de contact",
      navCatalogue: "Catalogue",
      navLegumes: "Légumes",
      navFruits: "Fruits",
      navExotic: "Exotique",
      navContact: "Contact",
      //INDEX
      titre: "Cruchaudet",
      phrase1: "Des fruits et légumes frais, chaque jour.",
      phrase2: "Au départ de <span class='Rungis'>Rungis</span>.",
      titrepageHistoire: "L'histoire",
      titreBio1: 'Début',
      titreBio2: 'Evolution',
      titreBio3: 'Maintenant',
      //FOOTER
      contact: "Contact",
      footerCopy: "Copyright © 2025 Cruchaudet.com. Tous droits réservés.",
      //EXPORT
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
      //CATALOGUE
      btnLegumes: 'Légumes',
      btnFruits: 'Fruits',
      btnExotic: 'Exotic',
      btnPDT: 'Pomme de terre & condiments',
      searchPlaceholder: "Rechercher dans le catalogue...",
    },
    EN: {
      //NAV
      navHistory: "Our Story",
      navExport: "Export",
      navContactExport: "Contact Form",
      navCatalogue: "Catalog",
      navLegumes: "Vegetables",
      navFruits: "Fruits",
      navExotic: "Exotic",
      navContact: "Contact",
      //INDEX
      titre: "Cruchaudet",
      phrase1: "Fresh fruits and vegetables, every day.",
      phrase2: "Departing from <span class='Rungis'>Rungis</span>.",
      titrepageHistoire: "History",
      titreBio1: 'Beginning',
      titreBio2: 'Evolution',
      titreBio3: 'Now',
      //FOOTER
      contact: "Contact",
      footerCopy: "Copyright © 2025 Cruchaudet.com. All rights reserved.",
      //EXPORT
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
      //CATALOGUE
      btnLegumes: 'Vegetables',
      btnFruits: 'Fruits',
      btnExotic: 'Exotic',
      btnPDT: 'Potatoes & condiments',
      searchPlaceholder: "Search in the catalog...",
    },
    ES: {
      //NAV
      navHistory: "Nuestra historia",
      navExport: "Exportación",
      navContactExport: "Formulario de contacto",
      navCatalogue: "Catálogo",
      navLegumes: "Verduras",
      navFruits: "Frutas",
      navExotic: "Exóticas",
      navContact: "Contacto",
      //INDEX
      titre: "Cruchaudet",
      phrase1: "Frutas y verduras frescas, cada día.",
      phrase2: "Desde <span class='Rungis'>Rungis</span>.",
      titrepageHistoire: "Historia",
      titreBio1: 'Comienzo',
      titreBio2: 'Evolución',
      titreBio3: 'Ahora',
      //FOOTER
      contact: "Contacto",
      footerCopy: "Copyright © 2025 Cruchaudet.com. Todos los derechos reservados.",
      //EXPORT
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
      //CATALOGUE
      btnLegumes: 'Verduras',
      btnFruits: 'Frutas',
      btnExotic: 'Exóticas',
      btnPDT: 'Patatas y condimentos',
      searchPlaceholder: "Buscar en el catálogo...",
    },
    IT: {
      //NAV
      navHistory: "La nostra storia",
      navExport: "Esportazione",
      navContactExport: "Modulo di contatto",
      navCatalogue: "Catalogo",
      navLegumes: "Verdure",
      navFruits: "Frutta",
      navExotic: "Esotici",
      navContact: "Contatto",
      //INDEX
      titre: "Cruchaudet",
      phrase1: "Frutta e verdura fresca, ogni giorno.",
      phrase2: "In partenza da <span class='Rungis'>Rungis</span>.",
      titrepageHistoire: "La storia",
      titreBio1: 'Inizio',
      titreBio2: 'Evoluzione',
      titreBio3: 'Adesso',
      //FOOTER
      contact: "Contatto",
      footerCopy: "Copyright © 2025 Cruchaudet.com. Tutti i diritti riservati.",
      //EXPORT
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
      //CATALOGUE
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
      if (el) el.innerHTML = text;
    }

    setFormLanguage(lang);

    // --- Traduction du placeholder de la barre de recherche ---
    const searchInput = document.getElementById("searchCatalog");
    if (searchInput) searchInput.placeholder = translations[lang].searchPlaceholder;

    document.querySelectorAll(".btnLang").forEach(btn => btn.style.display = "flex");
    const currentBtn = document.getElementById(`lang${lang}`);
    if (currentBtn) currentBtn.style.display = "none";

    updateVisibleMessages();
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
});