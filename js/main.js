/**
 * script.js
 * Version corrigée et commentée - Gestion loader, menu, traductions, formulaire, catalogue, etc.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Loader & Lancement principal ----------
  const loader = document.getElementById("loader");
  const mainContent = document.getElementById("mainContent");
  if (mainContent) mainContent.style.display = "none";

  const startTime = Date.now();

  // Attendre l'événement load pour s'assurer que tout (images, etc.) est prêt
  window.addEventListener("load", () => {
    const elapsed = Date.now() - startTime;
    const minDelay = 500; // délai minimum pour éviter flash
    const remaining = Math.max(minDelay - elapsed, 0);

    setTimeout(() => {
      if (loader) loader.style.display = "none";
      if (mainContent) mainContent.style.display = "block";
      initMenusEtTraductions(); // on initialise tout après le chargement
    }, remaining);
  });

  // ---------- Fonction principale ----------
  function initMenusEtTraductions() {
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
        btnFiltreL: 'Légumes',
        btnFiltreF: 'Fruits',
        btnFiltreE: 'Exotic',
        btnFiltrePDT: 'Pomme de terre & condiments',
        btnFiltreL: 'Légumes',
        btnFiltreF: 'Fruits',
        btnFiltreE: 'Exotic',
        btnFiltrePDT: 'Pomme de terre & condiments',
        titreCatL: 'Légumes',
        titreCatF: 'Fruits',
        titreCatE: 'Exotic',
        titreCatPDT: 'Pomme de terre & condiments',
        catTomate: 'Tomate',
        catCarotte: 'Carotte',
        catConcombre: 'Concombre',
        catPomme: 'Pomme',
        catBanane: 'Banane',
        catFraise: 'Fraise',
        catAnanas: 'Ananas',
        catMangue: 'Mangue',
        catPapaye: 'Papaye',
        catPdt: 'Pomme de terre',
        catAil: 'Ail',
        catOignon: 'Oignon',
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
        btnFiltreL: 'Vegetables',
        btnFiltreF: 'Fruits',
        btnFiltreE: 'Exotic',
        btnFiltrePDT: 'Potatoes & Condiments',
        btnFiltreL: 'Vegetables',
        btnFiltreF: 'Fruits',
        btnFiltreE: 'Exotic',
        btnFiltrePDT: 'Potatoes & Condiments',
        titreCatL: 'Vegetables',
        titreCatF: 'Fruits',
        titreCatE: 'Exotic',
        titreCatPDT: 'Potatoes & Condiments',
        catTomate:'Tomato',
        catCarotte: 'Carrot',
        catConcombre: 'Cucumber',
        catPomme: 'Apple',
        catBanane: 'Banana',
        catFraise: 'Strawberry',
        catAnanas: 'Pineapple',
        catMangue: 'Mango',
        catPapaye: 'Papaya',
        catPdt: 'Potato',
        catAil: 'Garlic',
        catOignon: 'Onion',
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
          nom: "Por favor, introduzca un apellido válido (2 a 30 letras).",
          prenom: "Por favor, introduzca un nombre válido (2 a 30 letras).",
          email: "Por favor, introduzca un correo electrónico válido.",
          telephone: "Por favor, introduzca un número de teléfono válido.",
          objet: "Por favor, introduzca un asunto (mínimo 2 caracteres).",
          messageVide: "El mensaje no puede estar vacío.",
          messageCourt: "El mensaje debe tener al menos 20 caracteres.",
          noTags: "No se permiten etiquetas HTML.",
          noScript: "Las etiquetas <script> están estrictamente prohibidas.",
          success: "Su mensaje se ha enviado correctamente ✅",
          errorSend: "Por favor, corrija los errores antes de enviar.",
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
        btnFiltreL: 'Verduras',
        btnFiltreF: 'Frutas',
        btnFiltreE: 'Exóticos',
        btnFiltrePDT: 'Patatas y condimentos',
        btnFiltreL: 'Verduras',
        btnFiltreF: 'Frutas',
        btnFiltreE: 'Exóticos',
        btnFiltrePDT: 'Patatas y condimentos',
        titreCatL: 'Verduras',
        titreCatF: 'Frutas',
        titreCatE: 'Exóticos',
        titreCatPDT: 'Patatas y condimentos',
        catTomate:'Tomate',
        catCarotte: 'Zanahoria',
        catConcombre: 'Pepino',
        catPomme: 'Manzana',
        catBanane: 'Banana',
        catFraise: 'Fresa',
        catAnanas: 'Piña',
        catMangue: 'Mango',
        catPapaye: 'Papaya',
        catPdt: 'Patata',
        catAil: 'Ajo',
        catOignon: 'Cebolla',
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
          nom: "Inserisci un cognome valido (da 2 a 30 lettere).",
          prenom: "Inserisci un nome valido (da 2 a 30 lettere).",
          email: "Inserisci un indirizzo e-mail valido.",
          telephone: "Inserisci un numero di telefono valido.",
          objet: "Inserisci un oggetto (minimo 2 caratteri).",
          messageVide: "Il messaggio non può essere vuoto.",
          messageCourt: "Il messaggio deve contenere almeno 20 caratteri.",
          noTags: "I tag HTML non sono consentiti.",
          noScript: "I tag <script> sono severamente vietati.",
          success: "Il tuo messaggio è stato inviato con successo ✅",
          errorSend: "Correggi gli errori prima di inviare.",
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
        btnFiltreL: 'Verdure',
        btnFiltreF: 'Frutta',
        btnFiltreE: 'Esotici',
        btnFiltrePDT: 'Patate e condimenti',
        btnFiltreL: 'Verdure',
        btnFiltreF: 'Frutta',
        btnFiltreE: 'Esotici',
        btnFiltrePDT: 'Patate e condimenti',
        titreCatL: 'Verdure',
        titreCatF: 'Frutta',
        titreCatE: 'Esotici',
        titreCatPDT: 'Patate e condimenti',
        catTomate:'Pomodoro',
        catCarotte: 'Carota',
        catConcombre: 'Cetriolo',
        catPomme: 'Mela',
        catBanane: 'Banana',
        catFraise: 'Fragola',
        catAnanas: 'Ananas',
        catMangue: 'Mango',
        catPapaye: 'Papaya',
        catPdt: 'Patata',
        catAil: 'Aglio',
        catOignon: 'Cipolla',
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

  // Met à jour tous les éléments dont l'id correspond à une clé de translations[lang]
  const tObj = translations[lang] || {};
  for (const [id, text] of Object.entries(tObj)) {
    if (id === "formErrors") continue; // messages d'erreur gérés séparément
    const el = document.getElementById(id);
    if (!el) continue;
    // On ne touche pas aux inputs/textareas ici : ils sont gérés par setFormLanguage
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") continue;
    // Cas particulier : lien avec caret -> ne pas écraser l'icône
    if (el.tagName === "A" && el.querySelector("i.caret")) {
      const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
      if (textNode) textNode.nodeValue = text;
    } else {
      el.innerHTML = text;
    }
  }

  // Met à jour le formulaire (placeholders & bouton)
  setFormLanguage(lang);

  // Placeholder de la recherche
  const searchInput = document.getElementById("searchCatalog");
  if (searchInput) {
    searchInput.placeholder = (translations[lang] && translations[lang].searchPlaceholder) || "";
  }

  // ----- Gestion des boutons de langue (.btnLang) -----
  const langButtons = document.querySelectorAll(".btnLang");
  if (langButtons.length > 0) {
    // Affiche tous puis masque le bouton actif
    langButtons.forEach(btn => btn.style.display = "flex");
    const activeBtn = document.getElementById(`lang${lang}`);
    if (activeBtn) activeBtn.style.display = "none";
  } else if (retry < 6) {
    // Si les boutons ne sont pas encore présents (ex : menu injecté plus tard),
    // on retente quelques fois (100ms) puis on abandonne
    setTimeout(() => setLanguage(lang, retry + 1), 100);
    return; // on sort maintenant pour éviter d'initFormValidation trop tôt
  }

  // ✅ Ré-initialise la validation (pour rafraîchir messages, si présents)
  initFormValidation();

  // ✅ Traduit les messages d'erreur déjà affichés dans le formulaire
  const currentErrors = document.querySelectorAll(".error-msg");
  if (currentErrors.length > 0) {
    const t = translations[currentLang].formErrors || {};
    currentErrors.forEach(err => {
      const key = err.dataset.key; // clé du message d’erreur
      if (key && t[key]) {
        err.textContent = t[key];
      }
    });
  }

  // ✅ Traduit aussi le message global du formulaire (si affiché)
  const formMsg = document.getElementById("formMsg");
  if (formMsg && formMsg.dataset.key) {
    const formMessages = translations[currentLang].formMessages || {};
    const key = formMsg.dataset.key;
    if (key && formMessages[key]) {
      formMsg.textContent = formMessages[key];
    }
  }
}
    // ---------- Écouteurs pour changement de langue (après qu'on appelle setLanguage une première fois) ----------
    // On attache des listeners génériques : s'ils n'existent pas encore, on retentera après setLanguage
    function attachLangButtonsListeners() {
      const btns = document.querySelectorAll(".btnLang");
      if (!btns || btns.length === 0) return;
      btns.forEach(btn => {
        // éviter de rattacher plusieurs fois
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

    // ---------- VALIDATION DU FORMULAIRE ----------
    function initFormValidation() {
      const contactForm = document.getElementById("contactForm");
      const formMsg = document.getElementById("formMsg");
      if (!contactForm) return;

      // On supprime d'anciens handlers pour éviter duplications si ré-initialisé
      contactForm.addEventListener("submit", noop); // dummy pour éviter erreur si déjà attaché
      // (Note : on conserve un seul handler ci-dessous en ajoutant removeEventListener si besoin)
      contactForm.removeEventListener("submit", handleSubmit);
      contactForm.addEventListener("submit", handleSubmit);

      function handleSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
          const successText = translations[currentLang].formErrors?.success || "✔️ Envoyé";
          if (formMsg) {
            formMsg.textContent = successText;
            formMsg.classList.remove("error");
            formMsg.classList.add("show", "success");
          }
          contactForm.reset();
        } else {
          const errorText = translations[currentLang].formErrors?.errorSend || "Veuillez corriger les erreurs.";
          if (formMsg) {
            formMsg.textContent = errorText;
            formMsg.classList.remove("success");
            formMsg.classList.add("show", "error");
          }
        }
      }

      function noop() {}

      function validateForm() {
        // Supprime anciens messages
        document.querySelectorAll(".error-msg").forEach(msg => msg.remove());
        if (formMsg) formMsg.classList.remove("show", "success", "error");

        const t = translations[currentLang].formErrors || {};

        const nom = document.getElementById("nom");
        const prenom = document.getElementById("prenom");
        const email = document.getElementById("email");
        const tel = document.getElementById("telephone");
        const objet = document.getElementById("objet");
        const message = document.getElementById("message");

        // Si un champ manquant dans le DOM -> considéré valide par défaut
        const addError = (input, msgKey) => {
          if (!input) return;
          input.classList.add("error");
          const error = document.createElement("span");
          error.className = "error-msg";
          error.dataset.key = msgKey;
          error.textContent = t[msgKey] || "Erreur";
          // Insère après l'élément (suppose qu'il est dans un wrapper)
          if (input.parentElement) input.parentElement.appendChild(error);
        };

        const clearError = input => { if (input) input.classList.remove("error"); };

        const nameRegex = /^[A-Za-zÀ-ÿ'\-\s]{2,30}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+0-9\s().-]{6,20}$/;
        const htmlTagRegex = /<[^>]*>/;
        const scriptTagRegex = /<\s*script.*?>.*?<\s*\/\s*script\s*>/i;

        [nom, prenom, email, tel, objet, message].forEach(clearError);

        let valid = true;

        if (nom && (!nom.value.trim() || !nameRegex.test(nom.value.trim()))) { addError(nom, "nom"); valid = false; }
        if (prenom && (!prenom.value.trim() || !nameRegex.test(prenom.value.trim()))) { addError(prenom, "prenom"); valid = false; }
        if (email && (!email.value.trim() || !emailRegex.test(email.value.trim()))) { addError(email, "email"); valid = false; }
        if (tel && (!tel.value.trim() || !phoneRegex.test(tel.value.trim()))) { addError(tel, "telephone"); valid = false; }
        if (objet && (!objet.value.trim() || objet.value.trim().length < 2)) { addError(objet, "objet"); valid = false; }

        if (message) {
          if (!message.value.trim()) { addError(message, "messageVide"); valid = false; }
          else if (message.value.trim().length < 20) { addError(message, "messageCourt"); valid = false; }
          else if (htmlTagRegex.test(message.value)) { addError(message, "noTags"); valid = false; }
          else if (scriptTagRegex.test(message.value)) { addError(message, "noScript"); valid = false; }
        }

        return valid;
      }
    }

    // Appel initial pour mettre en place la validation (si le formulaire est présent)
    initFormValidation();

    // ---------- CATALOGUE & FILTRES ----------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchCatalog');
    const sections = document.querySelectorAll('.catalogue-section');
    const activeFiltersContainer = document.querySelector('.active-filters');
    let activeFilters = new Set();

    function updateActiveFiltersUI() {
      if (!activeFiltersContainer) return;
      if (activeFilters.size === 0) {
        activeFiltersContainer.style.display = 'none';
        activeFiltersContainer.innerHTML = '';
        return;
      }
      activeFiltersContainer.style.display = 'flex';
      activeFiltersContainer.innerHTML = '';
      activeFilters.forEach(type => {
        const btn = document.querySelector(`.filter-btn[data-type="${type}"]`);
        const badge = document.createElement('div');
        badge.className = 'active-filter';
        let translationKey = '';
        switch (type) {
          case 'legumes': translationKey = 'btnFiltreL'; break;
          case 'fruits': translationKey = 'btnFiltreF'; break;
          case 'exotic': translationKey = 'btnFiltreE'; break;
          case 'PDTC': translationKey = 'btnFiltrePDT'; break;
          default: translationKey = null;
        }
        badge.textContent = (translationKey && translations[currentLang][translationKey]) || (btn ? btn.textContent : type);
        const close = document.createElement('span');
        close.textContent = '✖';
        close.addEventListener('click', () => {
          activeFilters.delete(type);
          if (btn) btn.classList.remove('active');
          updateCatalogue();
        });
        badge.appendChild(close);
        activeFiltersContainer.appendChild(badge);
      });
    }

    function updateCatalogue() {
      if (!sections) return;
      const query = (searchInput && searchInput.value) ? searchInput.value.toLowerCase() : '';
      sections.forEach(section => {
        const sectionType = section.dataset.type;
        let visibleSection = false;
        const filterMatch = activeFilters.size === 0 || activeFilters.has(sectionType);
        section.querySelectorAll('.product-card').forEach(card => {
          const id = (card.dataset.id || "").toLowerCase();
          const title = (card.dataset.title || "").toLowerCase();
          const matchSearch = id.includes(query) || title.includes(query);
          const matchFilter = filterMatch;
          if (matchSearch && matchFilter) {
            card.style.display = "block";
            visibleSection = true;
          } else card.style.display = "none";
        });
        section.style.display = visibleSection ? "block" : "none";
      });
      updateActiveFiltersUI();
    }

    // Attache listeners sur boutons de filtres (s'ils existent)
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        if (!type) return;
        if (activeFilters.has(type)) {
          activeFilters.delete(type);
          btn.classList.remove('active');
        } else {
          activeFilters.add(type);
          btn.classList.add('active');
        }
        updateCatalogue();
      });
    });

    if (searchInput) searchInput.addEventListener('input', updateCatalogue);

    // Initialisation catalogue
    updateCatalogue();

    // ---------- Initialisation finale de la langue + listeners ----------
    // On attache d'abord les listeners (s'ils existent déjà), puis on force setLanguage
    attachLangButtonsListeners();
    setLanguage(currentLang); // lance MAJ textes + masquage bouton actif
    // ensuite, s'il manque encore des boutons (menu rendu plus tard), on retente d'attacher
    setTimeout(attachLangButtonsListeners, 200);
    setTimeout(attachLangButtonsListeners, 600);
  } // fin initMenusEtTraductions()
}); // fin DOMContentLoaded
