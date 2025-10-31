/**
 * script.js
 * Version corrigée et commentée - Gestion loader, menu, traductions, formulaire, catalogue, etc.
 */

document.addEventListener("DOMContentLoaded", () => {
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
      }, 500); // délai pour la transition
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
    // ---------- COOKIES ----------
  // Vérifie si l'utilisateur a déjà fait un choix
  if (!localStorage.getItem("cookieConsent")) {
    document.getElementById("cookie-banner").style.display = "flex";
  }

  document.getElementById("acceptCookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    document.getElementById("cookie-banner").style.opacity = "0";
    setTimeout(() => document.getElementById("cookie-banner").remove(), 400);
  });

  document.getElementById("declineCookies").addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "declined");
    document.getElementById("cookie-banner").style.opacity = "0";
    setTimeout(() => document.getElementById("cookie-banner").remove(), 400);
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
        navExport: "Service de Livraison",
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
        titreBio3: 'Maintenant',

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
        footerCopy: "Copyright © 2025 Cruchaudet.com. Tous droits réservés.",

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
        paragrapheCgu8: "© 2025 Cruchaudet. Tous droits réservés.",

        //PAGE PARTENAIRES
        titrePClients: "Clients",
        titrePFournisseurs: "Fournisseurs",
        TitreFournisseur1: "Fournisseur",
        TitreFournisseur2: "Fournisseur",
        TitreFournisseur3: "Fournisseur",
        lienSiteF1: 'Visiter le site',
        lienSiteF2: 'Visiter le site',
        lienSiteF3: 'Visiter le site',
        legendeTitre:'Légende',
        legendeP:'Pays où nous exportons',
        //PAGE ENGAGEMENT
        titrepageEngagement: 'Nos engagements',
        titreEngagements1: 'Qualité',
        titreEngagements2: 'Service',
        //COOKIES
        cookiesP:'🍪 Nous utilisons des cookies pour améliorer votre expérience sur notre site.',
       cookiesA:'En savoir plus',
        acceptCookies:'Accepter',
        declineCookies:'Refuser',
      },

      EN: {
        //TITRE
        TitrePage1: "Cruchaudet | The Story",
        TitrePage2: "Cruchaudet | Delivery Service",
        TitrePage3: "Cruchaudet | Our Partners",
        TitrePage4: "Cruchaudet | Departments",
        TitrePage5: "Cruchaudet | Our Commitments",
        TitrePage404: "Cruchaudet | Page 404",

        //NAV
        navHistory: "Our Story",
        navExport: "Delivery Service",
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
        titreBio3: "Now",

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
        footerCopy: "Copyright © 2025 Cruchaudet.com. All rights reserved.",

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
        paragrapheCgu8: "© 2025 Cruchaudet. All rights reserved.",

        //PAGE PARTENAIRES
        titrePClients: "Clients",
        titrePFournisseurs: "Suppliers",
        TitreFournisseur1: "Supplier",
        TitreFournisseur2: "Supplier",
        TitreFournisseur3: "Supplier",
        lienSiteF1: 'Visit the website',
        lienSiteF2: 'Visit the website',
        lienSiteF3: 'Visit the website',
        legendeTitre: 'Legend',
        legendeP: 'Countries where we export',

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
        TitrePage2: "Cruchaudet | Servicio de Entrega",
        TitrePage3: "Cruchaudet | Nuestros Socios",
        TitrePage4: "Cruchaudet | Secciones",
        TitrePage5: "Cruchaudet | Nuestros compromisos",
        TitrePage404: "Cruchaudet | Página 404",

        //NAV
        navHistory: "Nuestra historia",
        navExport: "Servicio de Entrega",
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
        titreBio3: "Ahora",

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
        footerCopy: "Copyright © 2025 Cruchaudet.com. Todos los derechos reservados.",

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
        paragrapheCgu8: "© 2025 Cruchaudet. Todos los derechos reservados.",

        //PAGE PARTENAIRES
        titrePClients: "Clientes",
        titrePFournisseurs: "Proveedores",
        TitreFournisseur1: "Proveedor",
        TitreFournisseur2: "Proveedor",
        TitreFournisseur3: "Proveedor",
        lienSiteF1: 'Visitar el sitio',
        lienSiteF2: 'Visitar el sitio',
        lienSiteF3: 'Visitar el sitio',
        legendeTitre: 'Leyenda',
      legendeP: 'Países donde exportamos',

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

      IT: {
        //TITRE
        TitrePage1: "Cruchaudet | La storia",
        TitrePage2: "Cruchaudet | Servizio di Consegna",
        TitrePage3: "Cruchaudet | I Nostri Partner",
        TitrePage4: "Cruchaudet | Reparti",
        TitrePage5: "Cruchaudet | I nostri impegni",
        TitrePage404: "Cruchaudet | Pagina 404",

        //NAV
        navHistory: "La nostra storia",
        navExport: "Servizio di Consegna",
        navEngagement: "I nostri impegni",
        navRayon: "Reparti",
        navRayonLegumes: "Verdure",
        navRayonFruits: "Frutta",
        navRayonExotic: "Esotici",
        navRayonMiniLegumes: 'Mini Verdure',
        navRayonJP: 'Germogli Teneri',
        navRayonG: 'Germogli',
        navRayonC: "Condimenti",
        navNosPartenaires: "I Nostri Partner",
        navClients: "Clienti",
        navFournisseurs: "Fornitori",
        navContact: "Contatto",

        //PAGE INDEX
        titre: "Cruchaudet",
        phrase1: "Frutta e verdura fresca, ogni giorno.",
        phrase2: "In partenza da <span class='Rungis'>Rungis</span>.",
        titrepageHistoire: "Storia",
        titreBio1: "Inizio",
        titreBio2: "Evoluzione",
        titreBio3: "Adesso",

        //PAGE RAYON
        titrepageRayons: "Reparti",
        titreRayon1: "Frutta",
        titreRayon2: "Verdure",
        titreRayon3: "Mini Verdure",
        titreRayon4: "Condimenti",
        titreRayon5: "Esotici",
        titreRayon6: "Germogli Teneri",
        titreRayon7: "Germogli",

        //FOOTER
        cguFooter: "Condizioni d'uso",
        contact: "Contatto",
        footerCopy: "Copyright © 2025 Cruchaudet.com. Tutti i diritti riservati.",

        //404
        text404: "Ops! La pagina che stai cercando non esiste.",
        btn404: "Torna alla home",

        //PAGE EXPORT
        TitreExport: "Servizio di Consegna",
        contactFormTitle: "Contatto Export",
        nom: "Cognome *",
        prenom: "Nome *",
        email: "Email *",
        telephone: "Telefono *",
        objet: "Oggetto *",
        message: "Il tuo messaggio *",
        submitBtn: "Invia",
        formErrors: {
          nom: "Inserisci un cognome valido (2–30 lettere).",
          prenom: "Inserisci un nome valido (2–30 lettere).",
          email: "Inserisci un'email valida.",
          telephone: "Inserisci un numero di telefono valido.",
          objet: "Inserisci un oggetto (minimo 2 caratteri).",
          messageVide: "Il messaggio non può essere vuoto.",
          messageCourt: "Il messaggio deve contenere almeno 20 caratteri.",
          noTags: "I tag HTML non sono consentiti.",
          noScript: "I tag <script> sono severamente vietati.",
          success: "Il tuo messaggio è stato inviato con successo ✅",
          errorSend: "Correggi gli errori prima di inviare.",
        },

        //CGU
        TitrePageCGU: "Cruchaudet | Condizioni Generali di Utilizzo",
        titreCgu1: "Condizioni Generali di Utilizzo",
        paragrapheCgu1: "Benvenuto su <strong>Cruchaudet</strong>. Accedendo a questo sito (<a class='lienCgu' href='https://lilianbouzeau.github.io/index.html'>https://lilianbouzeau.github.io/index.html</a>), accetti di rispettare queste Condizioni Generali di Utilizzo (CGU). Se non accetti queste condizioni, ti preghiamo di non utilizzare questo sito.",
        titreCgu2: "1. Proprietà del sito",
        paragrapheCgu2: "Il contenuto, la struttura e gli elementi grafici del sito sono di proprietà esclusiva di Cruchaudet. Qualsiasi riproduzione, totale o parziale, è vietata senza autorizzazione preventiva.",
        titreCgu3: "2. Utilizzo del sito",
        paragrapheCgu3: "Vi impegnate a utilizzare questo sito solo per scopi legali. Qualsiasi uso abusivo, modifica o tentativo di hacking è severamente vietato.",
        titreCgu4: "3. Responsabilità",
        paragrapheCgu4: "Cruchaudet si impegna a garantire l’accuratezza delle informazioni, ma non può garantire l’assenza di errori. L’utilizzo del sito avviene sotto la tua piena responsabilità.",
        titreCgu5: "4. Dati personali",
        paragrapheCgu5: "Nessun dato personale viene raccolto a tua insaputa. Per ulteriori informazioni, puoi contattarci tramite <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a>.",
        titreCgu6: "5. Modifiche alle CGU",
        paragrapheCgu6: "Cruchaudet si riserva il diritto di modificare queste CGU in qualsiasi momento. Le modifiche saranno pubblicate su questa pagina.",
        titreCgu7: "6. Contatto",
        paragrapheCgu7: "Per qualsiasi domanda relativa alle CGU, puoi contattarci tramite <a class='lienCgu' href='mailto:contact@cruchaudet.com'>contact@cruchaudet.com</a>.",
        paragrapheCgu8: "© 2025 Cruchaudet. Tutti i diritti riservati.",

        //PAGE PARTENAIRES
        titrePClients: "Clienti",
        titrePFournisseurs: "Fornitori",
        TitreFournisseur1: "Fornitore",
        TitreFournisseur2: "Fornitore",
        TitreFournisseur3: "Fornitore",
        lienSiteF1: 'Visita il sito',
        lienSiteF2: 'Visita il sito',
        lienSiteF3: 'Visita il sito',
        legendeTitre: 'Legenda',
        legendeP: 'Paesi in cui esportiamo',
        legendeTitre: 'Legenda',
        legendeP: 'Paesi in cui esportiamo',

        //PAGE ENGAGEMENT
        titrepageEngagement: "I nostri impegni",
        titreEngagements1: "Qualità",
        titreEngagements2: "Servizio",
        //COOKIES
        cookiesP: '🍪 Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito web.',
        cookiesA: 'Scopri di più',
        acceptCookies: 'Accetta',
        declineCookies: 'Rifiuta',

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

      function noop() { }

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


    // ---------- Initialisation finale de la langue + listeners ----------
    // On attache d'abord les listeners (s'ils existent déjà), puis on force setLanguage
    attachLangButtonsListeners();
    setLanguage(currentLang); // lance MAJ textes + masquage bouton actif
    // ensuite, s'il manque encore des boutons (menu rendu plus tard), on retente d'attacher
    setTimeout(attachLangButtonsListeners, 200);
    setTimeout(attachLangButtonsListeners, 600);
  } // fin initMenusEtTraductions()
}); // fin DOMContentLoaded
