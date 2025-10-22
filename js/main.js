document.addEventListener("DOMContentLoaded", () => {

  // ==================== MENU HAMBURGER ====================
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", e => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    document.addEventListener("click", e => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeAllMenus();
      }
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
      } else {
        closeAllMenus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeAllMenus();
    });

    function closeAllMenus() {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
    }
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

  // ==================== BOUTON TOP ====================
  const btnTop = document.getElementById("btnTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) btnTop.classList.add("show");
    else btnTop.classList.remove("show");
  });
  btnTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ==================== TRADUCTIONS ====================
  const translations = {
   FR: {
    navHistory: "L'histoire",
    navExport: "Export",
    navContactExport: "Prise de contact",
    navCatalogue: "Catalogue",
    navLegumes: "Légumes",
    navFruits: "Fruits",
    navExotic: "Exotique",
    navContact: "Contact",

    titre: "Cruchaudet",
    phrase1: "Des fruits et légumes frais, chaque jour.",
    phrase2: "Au départ de <span class='Rungis'>Rungis</span>.",

    contact: "Contact",
    footerCopy: "Copyright © 2025 Cruchaudet.com. Tous droits réservés.",

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
      success: "Votre message a bien été envoyé ✅"
    }
  },

  EN: {
    navHistory: "Our Story",
    navExport: "Export",
    navContactExport: "Contact Form",
    navCatalogue: "Catalog",
    navLegumes: "Vegetables",
    navFruits: "Fruits",
    navExotic: "Exotic",
    navContact: "Contact",

    titre: "Cruchaudet",
    phrase1: "Fresh fruits and vegetables, every day.",
    phrase2: "Departing from <span class='Rungis'>Rungis</span>.",

    contact: "Contact",
    footerCopy: "Copyright © 2025 Cruchaudet.com. All rights reserved.",

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
      success: "Your message has been sent successfully ✅"
    }
  },

  ES: {
    navHistory: "Nuestra historia",
    navExport: "Exportación",
    navContactExport: "Formulario de contacto",
    navCatalogue: "Catálogo",
    navLegumes: "Verduras",
    navFruits: "Frutas",
    navExotic: "Exóticas",
    navContact: "Contacto",

    titre: "Cruchaudet",
    phrase1: "Frutas y verduras frescas, cada día.",
    phrase2: "Desde <span class='Rungis'>Rungis</span>.",

    contact: "Contacto",
    footerCopy: "Copyright © 2025 Cruchaudet.com. Todos los derechos reservados.",

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
      success: "Su mensaje ha sido enviado correctamente ✅"
    }
  },

  IT: {
    navHistory: "La nostra storia",
    navExport: "Esportazione",
    navContactExport: "Modulo di contatto",
    navCatalogue: "Catalogo",
    navLegumes: "Verdure",
    navFruits: "Frutta",
    navExotic: "Esotici",
    navContact: "Contatto",

    titre: "Cruchaudet",
    phrase1: "Frutta e verdura fresca, ogni giorno.",
    phrase2: "In partenza da <span class='Rungis'>Rungis</span>.",

    contact: "Contatto",
    footerCopy: "Copyright © 2025 Cruchaudet.com. Tutti i diritti riservati.",

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
      success: "Il tuo messaggio è stato inviato con successo ✅"
    }
  }
};

  let currentLang = "FR";

  function setLanguage(lang) {
    currentLang = lang;
    // Traduction des éléments par ID
    for (const [id, text] of Object.entries(translations[lang])) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = text;
    }
    setFormLanguage(lang);
    // Masquer le bouton langue actuelle
    document.querySelectorAll(".btnLang").forEach(btn => btn.style.display = "flex");
    const currentBtn = document.getElementById(`lang${lang}`);
    if (currentBtn) currentBtn.style.display = "none";
    // Traduire le message du formulaire existant
    updateFormMessage();
  }

  function setFormLanguage(lang) {
    const form = document.getElementById("contactForm");
    if (!form) return;
    document.getElementById("contactFormTitle").innerText = translations[lang].contactFormTitle;
    document.getElementById("nom").placeholder = translations[lang].nom;
    document.getElementById("prenom").placeholder = translations[lang].prenom;
    document.getElementById("email").placeholder = translations[lang].email;
    document.getElementById("telephone").placeholder = translations[lang].telephone;
    document.getElementById("objet").placeholder = translations[lang].objet;
    const messageField = document.getElementById("message");
    messageField.placeholder = translations[lang].message;
    document.getElementById("submitBtn").innerText = translations[lang].submitBtn;
  }

  document.querySelectorAll(".btnLang").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.id.replace("lang", "");
      setLanguage(lang);
    });
  });

  // ==================== FORMULAIRE ====================
  const contactForm = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  if (contactForm) {
    const fields = [
      document.getElementById("nom"),
      document.getElementById("prenom"),
      document.getElementById("email"),
      document.getElementById("telephone"),
      document.getElementById("objet"),
      document.getElementById("message")
    ];

    // Auto resize textarea
    const autoResize = el => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };
    const messageField = document.getElementById("message");
    messageField.addEventListener("input", () => autoResize(messageField));

    contactForm.addEventListener("submit", e => {
      e.preventDefault();

      // Reset erreurs
      fields.forEach(f => f.classList.remove("error"));

      let hasError = false;

      // Champs vides
      fields.forEach(f => {
        if (!f.value.trim()) {
          f.classList.add("error");
          hasError = true;
        }
      });
      if (hasError) return;

      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailField = document.getElementById("email");
      if (!emailRegex.test(emailField.value.trim())) {
        emailField.classList.add("error");
        return;
      }

      // Téléphone
      const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{9,13}$/;
      const phoneField = document.getElementById("telephone");
      if (!phoneRegex.test(phoneField.value.trim())) {
        phoneField.classList.add("error");
        return;
      }

      // Balises HTML interdites
      const noTagsRegex = /<[^>]*>/;
      fields.forEach(f => {
        if (noTagsRegex.test(f.value)) {
          f.classList.add("error");
          hasError = true;
        }
      });
      if (hasError) return;

      // Tout OK
      contactForm.reset();
      autoResize(messageField);
      alert(translations[currentLang].formErrors.success);
    });

    // Supprime le contour rouge dès que l'utilisateur tape
    fields.forEach(f => f.addEventListener("input", () => f.classList.remove("error")));
  }

  function updateFormMessage() {
    if (!formMsg.dataset.key) return;
    const key = formMsg.dataset.key;
    const type = formMsg.classList.contains("success") ? "success" : "error";
    const t = translations[currentLang].formErrors;
    formMsg.textContent = t[key];
    formMsg.className = type + " show";
  }

  // ==================== FILTRE CATALOGUE ====================
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      console.log("Filtre appliqué:", btn.dataset.type);
      // TODO: filtrage réel du catalogue
    });
  });

  // ==================== INITIALISATION ====================
  setLanguage(currentLang);

});
