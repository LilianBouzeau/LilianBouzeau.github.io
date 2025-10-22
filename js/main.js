document.addEventListener("DOMContentLoaded", () => {

  // ==================== MENU HAMBURGER ====================
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    // Ouvrir / fermer le menu principal
    hamburger.addEventListener("click", e => {
      e.stopPropagation();
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      // Réinitialiser les sous-menus si on ferme le menu
      if (!navMenu.classList.contains("active")) {
        document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
      }
    });

    // Fermer le menu si on clique en dehors
    document.addEventListener("click", e => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeResponsiveMenus();
      }
    });

    // Gestion des sous-menus
    navMenu.addEventListener("click", e => {
      const link = e.target.closest("a");
      if (!link) return;

      const li = link.closest(".deroulant");
      const sous = li ? li.querySelector(".sous") : null;

      if (window.innerWidth <= 768 && sous) {
        if (!sous.classList.contains("active")) {
          e.preventDefault();
          // Fermer tous les autres sous-menus
          document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
          sous.classList.add("active");
        }
      }
      // Ne pas fermer la page active, on laisse le lien fonctionner
    });

    // Réinitialiser si on agrandit la fenêtre
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeResponsiveMenus();
    });

    // Fonction pour fermer **seulement le menu responsive**, pas la page active
    function closeResponsiveMenus() {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.querySelectorAll("#nav-menu .sous.active").forEach(s => s.classList.remove("active"));
    }

    // --- Gestion de la page active ---
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("#nav-menu a").forEach(link => {
      const href = link.getAttribute("href");

      // enlever toute classe active avant de réappliquer
      link.classList.remove("active");
    });

    document.querySelectorAll("#nav-menu .sous").forEach(s => {
      s.classList.remove("active");
    });

    document.querySelectorAll("#nav-menu a").forEach(link => {
      const href = link.getAttribute("href");

      if (href.startsWith("#")) {
        // lien interne sur la même page
        if (currentPath === "index.html") {
          link.classList.add("active");

          const parentSous = link.closest(".sous");
          if (parentSous) parentSous.classList.add("active"); // seul sous-menu du lien actif s'ouvre
        }
      } else {
        // lien vers une autre page
        const linkFile = href.split("/").pop().split("#")[0];
        if (linkFile === currentPath) {
          link.classList.add("active");

          // ouvrir seulement le sous-menu contenant ce lien actif
          const parentSous = link.closest(".sous");
          if (parentSous) parentSous.classList.add("active");

          // optionnel : mettre aussi le li deroulant en active pour le style
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
      }
    }
  };

  let currentLang = localStorage.getItem("lang") || "FR"; // récupérer la langue depuis localStorage ou FR par défaut

  // ==================== CHANGEMENT DE LANGUE ====================
  function setLanguage(lang) {
    currentLang = lang;

    // Stocker la langue sélectionnée dans localStorage
    localStorage.setItem("lang", lang);

    for (const [id, text] of Object.entries(translations[lang])) {
      if (id === "formErrors") continue;
      const el = document.getElementById(id);
      if (el) el.innerHTML = text;
    }

    setFormLanguage(lang);

    document.querySelectorAll(".btnLang").forEach(btn => btn.style.display = "flex");
    const currentBtn = document.getElementById(`lang${lang}`);
    if (currentBtn) currentBtn.style.display = "none";

    updateVisibleMessages();
  }

  // ==================== Formulaire ====================
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

  // ==================== Boutons langue ====================
  document.querySelectorAll(".btnLang").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.id.replace("lang", "");
      setLanguage(lang);
    });
  });

  // ==================== Au chargement de la page ====================
  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(currentLang); // appliquer la langue sauvegardée
  });


  // ==================== FORMULAIRE ====================
  const contactForm = document.getElementById("contactForm");
  const formMsg = document.getElementById("formMsg");

  if (contactForm) {
    const fields = {
      nom: document.getElementById("nom"),
      prenom: document.getElementById("prenom"),
      email: document.getElementById("email"),
      telephone: document.getElementById("telephone"),
      objet: document.getElementById("objet"),
      message: document.getElementById("message")
    };

    function setFieldError(field, key = "") {
      let errorEl = field.parentElement.querySelector(".error-msg");
      if (!errorEl) {
        errorEl = document.createElement("div");
        errorEl.classList.add("error-msg");
        field.parentElement.appendChild(errorEl);
      }
      if (key) {
        const t = translations[currentLang].formErrors;
        errorEl.setAttribute("data-key", key);
        errorEl.textContent = t[key] || "";
      } else {
        errorEl.textContent = "";
        errorEl.removeAttribute("data-key");
      }
    }

    const autoResize = el => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    };
    fields.message.addEventListener("input", () => autoResize(fields.message));

    contactForm.addEventListener("submit", async e => {
      e.preventDefault();
      Object.values(fields).forEach(f => {
        f.classList.remove("error");
        setFieldError(f, "");
      });
      formMsg.textContent = "";
      formMsg.className = "";

      const t = translations[currentLang].formErrors;
      let hasError = false;

      for (const [key, field] of Object.entries(fields)) {
        if (!field.value.trim()) {
          field.classList.add("error");
          setFieldError(field, "allFields");
          hasError = true;
        }
      }
      if (hasError) return showFormMessage("allFields", "error");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(fields.email.value.trim())) {
        fields.email.classList.add("error");
        return showFormMessage("email", "error");
      }

      const phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{9,13}$/;
      if (!phoneRegex.test(fields.telephone.value.trim())) {
        fields.telephone.classList.add("error");
        return showFormMessage("phone", "error");
      }

      const noTagsRegex = /<[^>]*>/;
      for (const field of Object.values(fields)) {
        if (noTagsRegex.test(field.value)) {
          field.classList.add("error");
          hasError = true;
        }
      }
      if (hasError) return showFormMessage("noTags", "error");

      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        contactForm.reset();
        autoResize(fields.message);
        showFormMessage("success", "success");
      } catch {
        showFormMessage("errorSend", "error");
      }
    });

    Object.values(fields).forEach(f =>
      f.addEventListener("input", () => {
        f.classList.remove("error");
        setFieldError(f, "");
      })
    );
  }

  // ==================== MESSAGES GLOBAUX ====================
  function showFormMessage(key, type) {
    const t = translations[currentLang].formErrors;
    formMsg.textContent = t[key] || "Message inconnu";
    formMsg.setAttribute("data-key", key);
    formMsg.className = type + " show";
    setTimeout(() => formMsg.classList.remove("show"), 5000);
  }

  // ==================== TRADUCTION DES MESSAGES VISIBLES ====================
  function updateVisibleMessages() {
    const t = translations[currentLang].formErrors;
    document.querySelectorAll(".error-msg[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      el.textContent = t[key] || "";
    });
    const key = formMsg.getAttribute("data-key");
    if (key) formMsg.textContent = t[key] || "";
  }

  // ==================== FILTRE CATALOGUE ====================
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      console.log("Filtre appliqué:", btn.dataset.type);
    });
  });

  // ==================== INITIALISATION ====================
  setLanguage(currentLang);
});
