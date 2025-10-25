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
        TitrePage1: "Cruchaudet | L'histoire",
        TitrePage2: "Cruchaudet | Export",
        TitrePage3: "Cruchaudet | Catalogue",
        TitrePage4: "Cruchaudet | Les rayons",
        TitrePage404: 'Cruchaudet | Page 404',
        navHistory: "L'histoire",
        navExport: "Export",
        navRayon: 'Les rayons',
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
        titrepageRayons: 'Les rayons',
        titreRayon1: "Légumes",
        titreRayon2: "Fruits",
        titreRayon3: "Exotic",
        titreRayon4: "Pomme de terre & condiments",
        contact: "Contact",
        footerCopy: "Copyright © 2025 Cruchaudet.com. Tous droits réservés.",
        text404: "Oups ! La page que vous recherchez n'existe pas.",
        btn404: "Retour à l'accueil",
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
        cguFooter: "Conditions générales d'utilisation",
        TitrePageCGU: "Cruchaudet | Conditions générales d'utilisation",
        TitreCgu1: "Conditions Générales d'Utilisation",
        paragrapheCgu1: "Bienvenue sur Cruchaudet. En accédant à ce site (https://lilianbouzeau.github.io/index.html), vous acceptez de respecter les présentes conditions générales d'utilisation (CGU). Si vous n’acceptez pas ces conditions, veuillez ne pas utiliser ce site.",
        TitreCgu2: "1. Propriété du site",
        paragrapheCgu2: "Le contenu, la structure et les éléments graphiques du site sont la propriété exclusive de Cruchaudet. Toute reproduction, totale ou partielle, est interdite sans autorisation préalable.",
        TitreCgu3: "2. Utilisation du site",
        paragrapheCgu3: "Vous vous engagez à utiliser ce site à des fins légales uniquement. Toute utilisation abusive, modification ou tentative de piratage est strictement interdite.",
        TitreCgu4: "3. Responsabilité",
        paragrapheCgu4: "Cruchaudet met tout en œuvre pour assurer l’exactitude des informations, mais ne peut garantir qu’il n’existe aucune erreur. L’utilisation du site se fait sous votre entière responsabilité.",
        TitreCgu5: "4. Données personnelles",
        paragrapheCgu5: "Aucune donnée personnelle n’est collectée à votre insu. Pour plus d’informations, vous pouvez nous contacter via contact@cruchaudet.com.",
        TitreCgu6: "5. Modifications des CGU",
        paragrapheCgu6: "Cruchaudet se réserve le droit de modifier ces CGU à tout moment. Les modifications seront publiées sur cette page.",
        TitreCgu7: "6. Contact",
        paragrapheCgu7: "Pour toute question concernant les CGU, vous pouvez nous contacter via contact@cruchaudet.com.",
        paragrapheCgu8: "© 2025 Cruchaudet. Tous droits réservés.",
      },
      EN: {
        TitrePage1: "Cruchaudet | The Story",
        TitrePage2: "Cruchaudet | Export",
        TitrePage3: "Cruchaudet | Catalog",
        TitrePage4: "Cruchaudet | Departments",
        TitrePage404: 'Cruchaudet | Page 404',
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
        text404: "Oops! The page you are looking for does not exist.",
        btn404: "Back to Home",
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
        cguFooter: "Terms and Conditions of Use",
        TitrePageCGU: "Cruchaudet | Terms and Conditions of Use",
        TitreCgu1: "Terms and Conditions of Use",
        paragrapheCgu1: "Welcome to Cruchaudet. By accessing this site (https://lilianbouzeau.github.io/index.html), you agree to comply with these Terms and Conditions of Use (CGU). If you do not agree with these terms, please do not use this site.",
        TitreCgu2: "1. Site Ownership",
        paragrapheCgu2: "The content, structure, and graphic elements of the site are the exclusive property of Cruchaudet. Any total or partial reproduction is prohibited without prior authorization.",
        TitreCgu3: "2. Use of the site",
        paragrapheCgu3: "You agree to use this site only for lawful purposes. Any abusive use, modification, or hacking attempt is strictly prohibited.",
        TitreCgu4: "3. Liability",
        paragrapheCgu4: "Cruchaudet makes every effort to ensure the accuracy of the information but cannot guarantee that there are no errors. Use of the site is entirely at your own risk.",
        TitreCgu5: "4. Personal Data",
        paragrapheCgu5: "No personal data is collected without your knowledge. For more information, you can contact us at contact@cruchaudet.com.",
        TitreCgu6: "5. CGU Modifications",
        paragrapheCgu6: "Cruchaudet reserves the right to modify these CGU at any time. Changes will be published on this page.",
        TitreCgu7: "6. Contact",
        paragrapheCgu7: "For any questions regarding the CGU, you can contact us at contact@cruchaudet.com.",
        paragrapheCgu8: "© 2025 Cruchaudet. All rights reserved.",
      },
      ES: {
        TitrePage1: "Cruchaudet | La historia",
        TitrePage2: "Cruchaudet | Exportación",
        TitrePage3: "Cruchaudet | Catálogo",
        TitrePage4: "Cruchaudet | Secciones",
        TitrePage404: 'Cruchaudet | Página  404',
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
        text404: "¡Ups! La página que buscas no existe.",
        btn404: "Volver a la página principal",
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
        cguFooter: "Términos y condiciones de uso",
        TitrePageCGU: "Cruchaudet | Términos y condiciones de uso",
        TitreCgu1: "Términos y condiciones de uso",
        paragrapheCgu1: "Bienvenido a Cruchaudet. Al acceder a este sitio (https://lilianbouzeau.github.io/index.html), acepta cumplir con estos términos y condiciones de uso (CGU). Si no acepta estos términos, por favor no utilice este sitio.",
        TitreCgu2: "1. Propiedad del sitio",
        paragrapheCgu2: "El contenido, la estructura y los elementos gráficos del sitio son propiedad exclusiva de Cruchaudet. Queda prohibida cualquier reproducción total o parcial sin autorización previa.",
        TitreCgu3: "2. Uso del sitio",
        paragrapheCgu3: "Se compromete a utilizar este sitio únicamente con fines legales. Cualquier uso abusivo, modificación o intento de piratería está estrictamente prohibido.",
        TitreCgu4: "3. Responsabilidad",
        paragrapheCgu4: "Cruchaudet hace todo lo posible para garantizar la exactitud de la información, pero no puede garantizar que no existan errores. El uso del sitio es bajo su propia responsabilidad.",
        TitreCgu5: "4. Datos personales",
        paragrapheCgu5: "No se recopilan datos personales sin su conocimiento. Para más información, puede contactarnos en contact@cruchaudet.com.",
        TitreCgu6: "5. Modificaciones de los CGU",
        paragrapheCgu6: "Cruchaudet se reserva el derecho de modificar estos CGU en cualquier momento. Las modificaciones se publicarán en esta página.",
        TitreCgu7: "6. Contacto",
        paragrapheCgu7: "Para cualquier pregunta sobre los CGU, puede contactarnos en contact@cruchaudet.com.",
        paragrapheCgu8: "© 2025 Cruchaudet. Todos los derechos reservados.",
      },
      IT: {
        TitrePage1: "Cruchaudet | La storia",
        TitrePage2: "Cruchaudet | Esportazione",
        TitrePage3: "Cruchaudet | Catalogo",
        TitrePage4: "Cruchaudet | Reparti",
        TitrePage404: 'Cruchaudet | Pagina 404"',
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
        text404: "Ops! La pagina che stai cercando non esiste.",
        btn404: "Torna alla home",
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
        cguFooter: "Condizioni generali d'utilizzo",
      TitrePageCGU: "Cruchaudet | Condizioni generali d'utilizzo",
      TitreCgu1: "Condizioni generali d'utilizzo",
      paragrapheCgu1: "Benvenuto su Cruchaudet. Accedendo a questo sito (https://lilianbouzeau.github.io/index.html), accetti di rispettare queste condizioni generali d'utilizzo (CGU). Se non accetti queste condizioni, ti preghiamo di non utilizzare il sito.",
      TitreCgu2: "1. Proprietà del sito",
      paragrapheCgu2: "Il contenuto, la struttura e gli elementi grafici del sito sono di proprietà esclusiva di Cruchaudet. È vietata qualsiasi riproduzione totale o parziale senza autorizzazione preventiva.",
      TitreCgu3: "2. Uso del sito",
      paragrapheCgu3: "Ti impegni a utilizzare questo sito solo per scopi legali. Qualsiasi uso improprio, modifica o tentativo di hacking è severamente vietato.",
      TitreCgu4: "3. Responsabilità",
      paragrapheCgu4: "Cruchaudet si impegna a garantire l'accuratezza delle informazioni, ma non può garantire l'assenza di errori. L'uso del sito avviene sotto la tua piena responsabilità.",
      TitreCgu5: "4. Dati personali",
      paragrapheCgu5: "Non vengono raccolti dati personali a tua insaputa. Per ulteriori informazioni, puoi contattarci all'indirizzo contact@cruchaudet.com.",
      TitreCgu6: "5. Modifiche alle CGU",
      paragrapheCgu6: "Cruchaudet si riserva il diritto di modificare queste CGU in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina.",
      TitreCgu7: "6. Contatto",
      paragrapheCgu7: "Per qualsiasi domanda riguardante le CGU, puoi contattarci all'indirizzo contact@cruchaudet.com.",
      paragrapheCgu8: "© 2025 Cruchaudet. Tutti i diritti riservati.",
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
