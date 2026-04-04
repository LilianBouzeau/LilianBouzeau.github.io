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
    
    const letters = text.split("").map((letter) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.textContent = letter;
      titleElement.appendChild(span);
      return span;
    });

    requestAnimationFrame(() => {
      letters.forEach((span, index) => {
        setTimeout(() => {
          span.classList.add("is-visible");
        }, index * 90);
      });
    });
  }

  // ---------- Fonction principale ----------
  function initMenusEtTraductions() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const isRayonPage = currentPath.toLowerCase() === "rayon.html";

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

  // ------ Avions export sur la carte partenaires --------
  function initMapExportFlights() {
    const svg = document.getElementById("svgmap");
    if (!svg || svg.querySelector(".map-flight-overlay")) return;

    const exportPaths = Array.from(svg.querySelectorAll("path.PaysExport")).filter((pathEl) => {
      return pathEl.id !== "FR" && !pathEl.classList.contains("France") && pathEl.getAttribute("name") !== "France";
    });
    if (!exportPaths.length) return;

    const francePaths = Array.from(svg.querySelectorAll("path#FR, path[name='France'], path.France"));
    if (!francePaths.length) return;

    const getCenter = (pathEl) => {
      const box = pathEl.getBBox();
      return {
        x: box.x + box.width / 2,
        y: box.y + box.height / 2,
      };
    };

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    francePaths.forEach((pathEl) => {
      const box = pathEl.getBBox();
      minX = Math.min(minX, box.x);
      maxX = Math.max(maxX, box.x + box.width);
      minY = Math.min(minY, box.y);
      maxY = Math.max(maxY, box.y + box.height);
    });
    const franceCenter = {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
    };

    const uniqueTargets = [];
    const seen = new Set();
    exportPaths.forEach((pathEl) => {
      const c = getCenter(pathEl);
      const key = `${Math.round(c.x)}-${Math.round(c.y)}`;
      if (seen.has(key)) return;
      seen.add(key);
      uniqueTargets.push(c);
    });
    if (!uniqueTargets.length) return;

    const ns = "http://www.w3.org/2000/svg";
    const overlay = document.createElementNS(ns, "g");
    overlay.setAttribute("class", "map-flight-overlay");
    svg.appendChild(overlay);

    const planes = [];
    const PLANE_D = "M22 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9L3 14v2l8-1.5V20l-2 1.5V23l3.5-1 3.5 1v-1.5L14 20v-5.5z";
    const FLIGHT_PAUSE_SECONDS = 1.1;

    uniqueTargets.forEach((target, idx) => {
      const dx = target.x - franceCenter.x;
      const dy = target.y - franceCenter.y;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = -dy / dist;
      const ny = dx / dist;
      const amp = Math.min(180, 45 + dist * 0.12);
      const direction = idx % 2 === 0 ? 1 : -1;
      const cx = (franceCenter.x + target.x) / 2 + nx * amp * direction;
      const cy = (franceCenter.y + target.y) / 2 + ny * amp * direction;

      const route = document.createElementNS(ns, "path");
      route.setAttribute("d", `M ${franceCenter.x} ${franceCenter.y} Q ${cx} ${cy} ${target.x} ${target.y}`);
      const length = route.getTotalLength();

      const plane = document.createElementNS(ns, "g");
      plane.setAttribute("class", "map-flight-plane");
      const planeShape = document.createElementNS(ns, "path");
      planeShape.setAttribute("d", PLANE_D);
      planeShape.setAttribute("transform", "translate(-12 -12) scale(1.2)");
      planeShape.style.fill = "#FF8F00";
      plane.appendChild(planeShape);
      overlay.appendChild(plane);

      planes.push({
        route,
        plane,
        length,
        target,
        frameCenter: franceCenter,
        speed: 20 + (idx % 4) * 5,
        phase: 0,
        flightDuration: 0,
        cycleDuration: 0,
      });
    });

    const count = Math.max(planes.length, 1);
    planes.forEach((item, idx) => {
      item.flightDuration = item.length / item.speed;
      item.cycleDuration = item.flightDuration + FLIGHT_PAUSE_SECONDS;
      item.phase = (idx / count) * item.cycleDuration;
    });

    let rafId = null;
    const animate = (time) => {
      const seconds = time / 1000;

      planes.forEach((item) => {
        const localTime = (seconds + item.phase) % item.cycleDuration;

        if (localTime > item.flightDuration) {
          item.plane.style.opacity = "0";
          return;
        }

        item.plane.style.opacity = "0.95";
        const progress = (localTime / item.flightDuration) * item.length;
        
        const p1 = item.route.getPointAtLength(progress);
        const p2 = item.route.getPointAtLength(Math.min(progress + 2, item.length));
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI + 90;
        item.plane.setAttribute("transform", `translate(${p1.x} ${p1.y}) rotate(${angle})`);
      });

      rafId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!rafId) rafId = requestAnimationFrame(animate);
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0.15 });

    observer.observe(svg);
    rafId = requestAnimationFrame(animate);
  }

  initMapExportFlights();

  // ------ Trafic avion dans le footer --------
  function initFooterAirTraffic() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const footers = document.querySelectorAll("footer");
    if (!footers.length) return;

    const PLANE_COLORS_BY_SLOT = ["orange", "orange", "orange", "accent", "accent", "orange", "accent", "orange", "accent", "orange", "accent", "orange", "accent"];
    const isDesktopViewport = window.matchMedia("(min-width: 1025px)").matches;
    const PLANE_COUNT = (isRayonPage && isDesktopViewport)
      ? 6
      : Math.floor(Math.random() * (15 - 10 + 1)) + 10;
    const MAX_TRAIL_DOTS = 20;
    const PLANE_HEADING_OFFSET = 90;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    const getCssVarColor = (el, varName, fallback) => {
      const value = getComputedStyle(el).getPropertyValue(varName).trim();
      return value || fallback;
    };

    const planeSvgDataUri = (fillColor) => {
      const fruits = ["🍎", "🍊", "🥕", "🥦", "🍇", "🥬", "🥭", "🍌", "🍆", "🥑", "🍄", "🥒", "🌽", "🥔", "🧅", "🧄", "🫒", "🍅"];
      const fruit = fruits[Math.floor(Math.random() * fruits.length)];
      return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text x='12' y='16' font-size='20' text-anchor='middle' dominant-baseline='middle'>${fruit}</text></svg>`)}")`;
    };

    const cubicBezierPoint = (path, t) => {
      const mt = 1 - t;
      return {
        x: mt ** 3 * path.p0.x + 3 * mt ** 2 * t * path.p1.x + 3 * mt * t ** 2 * path.p2.x + t ** 3 * path.p3.x,
        y: mt ** 3 * path.p0.y + 3 * mt ** 2 * t * path.p1.y + 3 * mt * t ** 2 * path.p2.y + t ** 3 * path.p3.y,
      };
    };

    const cubicBezierDerivative = (path, t) => {
      const mt = 1 - t;
      return {
        x: 3 * mt ** 2 * (path.p1.x - path.p0.x) + 6 * mt * t * (path.p2.x - path.p1.x) + 3 * t ** 2 * (path.p3.x - path.p2.x),
        y: 3 * mt ** 2 * (path.p1.y - path.p0.y) + 6 * mt * t * (path.p2.y - path.p1.y) + 3 * t ** 2 * (path.p3.y - path.p2.y),
      };
    };

    footers.forEach((footer) => {
      if (footer.querySelector(".footer-air-traffic")) return;

      const layer = document.createElement("div");
      layer.className = "footer-air-traffic";
      footer.prepend(layer);

      const orangeColor = getCssVarColor(footer, "--orange", "#FF8F00");
      const accentColor = getCssVarColor(footer, "--accent", "#2E7D32");
      // Chaque fruit est généré aléatoirement au lieu de réutiliser le même

      const planes = [];
      let rafId = null;
      let running = true;
      let width = footer.clientWidth;
      let height = footer.clientHeight;

      const updateFooterSize = () => {
        width = footer.clientWidth;
        height = footer.clientHeight;
      };

      window.addEventListener("resize", updateFooterSize, { passive: true });

      const EDGE_KEYS = ["top", "right", "bottom", "left"];

      const getEdgePoint = (edge, outside) => {
        if (edge === "top") {
          return { x: randomBetween(-outside * 0.2, width + outside * 0.2), y: -outside };
        }
        if (edge === "right") {
          return { x: width + outside, y: randomBetween(6, Math.max(16, height - 10)) };
        }
        if (edge === "bottom") {
          return { x: randomBetween(-outside * 0.2, width + outside * 0.2), y: height + outside };
        }
        return { x: -outside, y: randomBetween(6, Math.max(16, height - 10)) };
      };

      const getRandomPerimeterPoint = (outside, excludedEdge = null) => {
        const edges = excludedEdge
          ? EDGE_KEYS.filter((edge) => edge !== excludedEdge)
          : EDGE_KEYS;
        const edge = edges[Math.floor(Math.random() * edges.length)];
        return {
          edge,
          point: getEdgePoint(edge, outside),
        };
      };

      const createPath = () => {
        const outside = 120;
        const yMin = 6;
        const yMax = Math.max(16, height - 10);
        const start = getRandomPerimeterPoint(outside);
        const end = getRandomPerimeterPoint(outside, start.edge);
        const startPoint = start.point;
        const endPoint = end.point;
        const startY = startPoint.y;
        const endY = endPoint.y;
        const c1Y = clamp(startY + randomBetween(-height * 0.35, height * 0.3), yMin, yMax);
        const c2Y = clamp(endY + randomBetween(-height * 0.35, height * 0.3), yMin, yMax);
        const goingLeftToRight = startPoint.x < endPoint.x;
        const c1xMin = goingLeftToRight ? 0.18 : 0.55;
        const c1xMax = goingLeftToRight ? 0.45 : 0.85;
        const c2xMin = goingLeftToRight ? 0.55 : 0.18;
        const c2xMax = goingLeftToRight ? 0.85 : 0.45;

        return {
          p0: { x: startPoint.x, y: startY },
          p1: { x: width * randomBetween(c1xMin, c1xMax), y: c1Y },
          p2: { x: width * randomBetween(c2xMin, c2xMax), y: c2Y },
          p3: { x: endPoint.x, y: endY },
        };
      };

      const resetPlane = (plane, now) => {
        plane.path = createPath();
        plane.duration = randomBetween(11000, 18000);
        plane.dotInterval = randomBetween(70, 120);
        plane.lastDotAt = now;
        plane.startAt = now;
      };

      const addTrailDot = (plane, x, y) => {
        const dot = document.createElement("span");
        dot.className = "footer-plane-trail-dot";
        const size = randomBetween(3.6, 6.8);
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        layer.appendChild(dot);

        plane.trailDots.push(dot);
        if (plane.trailDots.length > MAX_TRAIL_DOTS) {
          const oldest = plane.trailDots.shift();
          if (oldest) oldest.remove();
        }

        dot.addEventListener("animationend", () => {
          const idx = plane.trailDots.indexOf(dot);
          if (idx >= 0) plane.trailDots.splice(idx, 1);
          dot.remove();
        }, { once: true });
      };

      for (let i = 0; i < PLANE_COUNT; i += 1) {
        const el = document.createElement("div");
        el.className = "footer-plane";
        el.style.backgroundImage = planeSvgDataUri(undefined);
        el.style.opacity = "1";
        const scale = randomBetween(1.15, 1.65);
        el.dataset.scale = scale.toFixed(3);
        layer.appendChild(el);

        const plane = {
          el,
          path: null,
          duration: 0,
          dotInterval: randomBetween(70, 150),
          startAt: performance.now() - randomBetween(0, 12000) - (i * 800),
          lastDotAt: 0,
          trailDots: [],
        };

        resetPlane(plane, plane.startAt);
        planes.push(plane);
      }

      const animate = (now) => {
        if (!running) return;

        planes.forEach((plane) => {
          let t = (now - plane.startAt) / plane.duration;

          if (t >= 1) {
            resetPlane(plane, now);
            t = 0;
          }

          const point = cubicBezierPoint(plane.path, t);
          const velocity = cubicBezierDerivative(plane.path, t);
          const angle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) + PLANE_HEADING_OFFSET;
          const scale = Number(plane.el.dataset.scale || 1);

          plane.el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) rotate(${angle}deg) scale(${scale})`;

          if (now - plane.lastDotAt >= plane.dotInterval) {
            plane.lastDotAt = now;
            // Trail dots désactivés - fruits et légumes sans pointillés
            // const centerX = point.x + plane.el.offsetWidth / 2;
            // const centerY = point.y + plane.el.offsetHeight / 2;
            // const speed = Math.hypot(velocity.x, velocity.y) || 1;
            // const dirX = velocity.x / speed;
            // const dirY = velocity.y / speed;
            // const tailDistance = (plane.el.offsetWidth * scale) * 0.42;
            // const tailX = centerX - dirX * tailDistance;
            // const tailY = centerY - dirY * tailDistance;
            // addTrailDot(plane, tailX, tailY);
          }
        });

        rafId = requestAnimationFrame(animate);
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!running) {
              running = true;
              rafId = requestAnimationFrame(animate);
            }
          } else {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      }, { threshold: 0.01 });

      observer.observe(footer);
      rafId = requestAnimationFrame(animate);
    });
  }

  initFooterAirTraffic();

  // ------ Navbar toujours visible en haut --------
  function initStickyNavbar() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    // Sur la page d'accueil, la navbar reste au-dessus du header sans décaler le contenu.
    if (document.body.classList.contains("home-page")) {
      document.body.classList.remove("nav-fallback-active");
      nav.classList.add("nav-fallback-fixed");
      return;
    }

    const root = document.documentElement;

    function setNavOffset() {
      root.style.setProperty("--nav-fallback-offset", `${nav.offsetHeight}px`);
    }

    function enableStickyTop() {
      document.body.classList.add("nav-fallback-active");
      nav.classList.add("nav-fallback-fixed");
    }

    window.addEventListener("resize", () => {
      setNavOffset();
      enableStickyTop();
    });

    setNavOffset();
    enableStickyTop();
  }

  initStickyNavbar();

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

  function initRayonScrollPerfMode() {
    if (!isRayonPage) return;

    document.body.classList.add("rayon-perf");

    if (window.matchMedia("(max-width: 1024px)").matches) return;

    let fastScrollTimeout = null;
    const FAST_SCROLL_IDLE_MS = 120;

    window.addEventListener("scroll", () => {
      document.body.classList.add("is-fast-scrolling");
      if (fastScrollTimeout) {
        clearTimeout(fastScrollTimeout);
      }
      fastScrollTimeout = setTimeout(() => {
        document.body.classList.remove("is-fast-scrolling");
      }, FAST_SCROLL_IDLE_MS);
    }, { passive: true });
  }

  function optimizeRayonImages() {
    if (!isRayonPage) return;
    const sectionImages = document.querySelectorAll("#rayons-section img");

    sectionImages.forEach((img) => {
      if (!img.hasAttribute("loading")) img.loading = "lazy";
      img.decoding = "async";
    });
  }

  function initRayonCardsFlip() {
    if (!isRayonPage) return;

    const cards = document.querySelectorAll("#rayons-section .carte");
    if (cards.length === 0) return;

    let activeMobileCard = null;
    const isTouchMode = () => window.matchMedia("(hover: none)").matches;

    cards.forEach((card) => {
      if (!card.hasAttribute("tabindex")) {
        card.setAttribute("tabindex", "0");
      }

      card.addEventListener("click", () => {
        if (isTouchMode() && activeMobileCard && activeMobileCard !== card) {
          activeMobileCard.classList.remove("is-flipped");
        }

        card.classList.toggle("is-flipped");

        if (isTouchMode()) {
          activeMobileCard = card.classList.contains("is-flipped") ? card : null;
        }

        // On mobile/touch, remove lingering focus to avoid sticky focus styles.
        if (document.activeElement === card) {
          card.blur();
        }
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
    });
  }

// ===============================
// ANIMATIONS AU SCROLL
// ===============================
const scrollElements = document.querySelectorAll(
  '.scroll-animate, .scroll-animateG, .scroll-animateD, .scroll-animate-opacity'
);

if (isRayonPage) {
  document.querySelectorAll("#rayons-section .cartes-groupe").forEach((group) => {
    const groupCards = group.querySelectorAll(".carte.scroll-animate-opacity");
    groupCards.forEach((card, index) => {
      card.style.setProperty("--rayon-stagger-delay", `${(index + 1) * 90}ms`);
    });
  });
}

if (scrollElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('scroll-visible');
        observer.unobserve(entry.target); // animation une seule fois
      }
    });
  }, {
    threshold: 0.1
  });

  const rayonCardsObserver = isRayonPage
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 1) {
          entry.target.classList.add('scroll-visible');
          rayonCardsObserver.unobserve(entry.target); // animation une seule fois
        }
      });
    }, {
      threshold: [1]
    })
    : null;

  scrollElements.forEach((el) => {
    if (
      rayonCardsObserver &&
      el.matches('#rayons-section .carte.scroll-animate-opacity')
    ) {
      rayonCardsObserver.observe(el);
      return;
    }

    observer.observe(el);
  });
}
  // ---------- Compteur ----------
  function formatCounterText(counter, value) {
    const lang = typeof currentLang === "string" ? currentLang : "FR";
    const tObj = translations[lang] || translations.FR || {};

    if (counter.id === "compteurProduits") {
    return "+" + value;
    }

    if (counter.id === "compteurExpertise") {
    return value + " " + (tObj.compteurExpertiseSuffix || "ans");
    }

    return String(value);
  }

  function refreshCompletedCounters() {
    document.querySelectorAll(".counter[data-counter-complete='1']").forEach((counter) => {
    const target = parseInt(counter.dataset.target, 10);
    if (Number.isNaN(target)) return;
    counter.textContent = formatCounterText(counter, target);
    });
  }

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

        counter.textContent = formatCounterText(counter, value);

        if (progress < 1) requestAnimationFrame(update);
        else {
        // Valeur finale
        counter.dataset.counterComplete = "1";
        counter.textContent = formatCounterText(counter, target);
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
  initRayonScrollPerfMode();
  optimizeRayonImages();
  initRayonCardsFlip();
  initExportContactForm();

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
    let btnTopRafPending = false;
    const syncBtnTopVisibility = () => {
      if (window.scrollY > 300) btnTop.classList.add("show");
      else btnTop.classList.remove("show");
    };

    window.addEventListener("scroll", () => {
    if (btnTopRafPending) return;
    btnTopRafPending = true;
    requestAnimationFrame(() => {
      btnTopRafPending = false;
      syncBtnTopVisibility();
    });
    }, { passive: true });

    syncBtnTopVisibility();
    btnTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- Pop-up produits de saison ----------
  function initSeasonalPopup() {
    const overlay = document.getElementById("seasonalPopupOverlay");
    const closeBtn = document.getElementById("seasonalPopupClose");
    const triggerBtn = document.getElementById("seasonalPopupTrigger");
    const cards = document.querySelectorAll(".seasonal-card");
    if (!overlay || !closeBtn || !triggerBtn) return;

    const storageKey = "seasonalPopupClosed";
    let popupAnimTimeout = null;
    let isPopupAnimating = false;
    let isPopupClosing = false;
    const POPUP_OPEN_MS = 420;
    const POPUP_CLOSE_MS = 240;

    function getStoredState() {
      try {
        return localStorage.getItem(storageKey);
      } catch (error) {
        return null;
      }
    }

    function setStoredState(value) {
      try {
        localStorage.setItem(storageKey, value);
      } catch (error) {
        // stockage indisponible: on ignore sans bloquer l'UI
      }
    }

    function openPopup() {
      if (isPopupClosing) return;
      if (overlay.classList.contains("show") && !overlay.classList.contains("is-closing")) return;
      if (popupAnimTimeout) {
        clearTimeout(popupAnimTimeout);
        popupAnimTimeout = null;
      }
      isPopupAnimating = true;
      overlay.classList.remove("is-closing");
      overlay.classList.add("is-opening");
      overlay.classList.add("show");
      overlay.setAttribute("aria-hidden", "false");
      triggerBtn.classList.remove("show");
      document.body.classList.add("seasonal-popup-open");
      popupAnimTimeout = setTimeout(() => {
        overlay.classList.remove("is-opening");
        isPopupAnimating = false;
      }, POPUP_OPEN_MS);
    }

    function closePopup() {
      if (!overlay.classList.contains("show") || isPopupClosing) return;
      if (popupAnimTimeout) {
        clearTimeout(popupAnimTimeout);
        popupAnimTimeout = null;
      }
      isPopupAnimating = true;
      isPopupClosing = true;
      overlay.classList.remove("is-opening");
      overlay.classList.add("is-closing");
      setStoredState("closed");
      popupAnimTimeout = setTimeout(() => {
        overlay.classList.remove("show", "is-closing");
        overlay.setAttribute("aria-hidden", "true");
        triggerBtn.classList.add("show");
        document.body.classList.remove("seasonal-popup-open");
        isPopupAnimating = false;
        isPopupClosing = false;
      }, POPUP_CLOSE_MS);
    }

    if (getStoredState() === "closed") {
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      triggerBtn.classList.add("show");
    } else {
      openPopup();
    }

    closeBtn.addEventListener("click", closePopup);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closePopup();
    });

    triggerBtn.addEventListener("click", () => {
      openPopup();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("show")) {
        closePopup();
      }
    });

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        card.classList.toggle("is-flipped");
      });

      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.classList.toggle("is-flipped");
        }
      });
    });
  }

  initSeasonalPopup();

  // ---------- Traductions ----------
  const translations = {
    FR: {
    //TITRE
    TitrePage1: "Cruchaudet | L'histoire",
    TitrePage2: "Cruchaudet | Service d'Expédition",
    TitrePage3: "Cruchaudet | Nos partenaires",
    TitrePage4: "Cruchaudet | Les rayons",
    TitrePage5: "Cruchaudet | Nos engagements",
    TitrePage404: 'Cruchaudet | Page 404',

    //NAV
    navHistory: "L'histoire",
    navExport: "Service d'Expédition",
    navEngagement: "Nos engagements",
    navRayon: 'Les rayons',
    navRayonLegumes: "Légumes",
    navRayonFruits: "Fruits",
    navRayonExotic: "Exotic",
    navRayonMiniLegumes: 'Mini-légumes',
    navRayonJP: 'Jeunes Pousses',
    navRayonG: 'Germes',
    navRayonH: 'Herbes',
    navRayonC: "Condiments",
    navContactExport: "Prise de contact",
    navNosPartenaires: "Nos partenaires",
    navClients: "Clients",
    navFournisseurs: "Fournisseurs",
    navContact: "Contact",

    //PAGE INDEX
    titre: "Cruchaudet",
    heroKicker: "Grossiste fruits & légumes depuis 1898",
    phrase1: "Des fruits et légumes frais, chaque jour.",
    phrase2: "Au départ de <span class='Rungis'>Rungis</span>.",
    heroBtnStory: "Découvrir notre histoire",
    heroBtnDepartments: "Voir nos rayons",
    seasonalAsparagusDesc: "Asperges vertes et blanches, récoltées en pleine saison pour une texture tendre et un goût délicat.",
    seasonalArtichokeDesc: "Artichauts frais, généreux et savoureux, parfaits pour les plats traditionnels et les recettes créatives.",
    seasonalStrawberryDesc: "Fraises sucrées et parfumées, sélectionnées pour leur fraîcheur et leur belle tenue en vitrine.",
    seasonalAppleDesc: "Pommes croquantes et équilibrées, disponibles en plusieurs variétés pour tous les usages.",
    seasonalPopupTitle: "Produits de saison",
    seasonalAsparagusTitleFront: "Asperges",
    seasonalAsparagusTitleBack: "Asperges",
    seasonalArtichokeTitleFront: "Artichauts",
    seasonalArtichokeTitleBack: "Artichauts",
    seasonalStrawberryTitleFront: "Fraises",
    seasonalStrawberryTitleBack: "Fraises",
    seasonalAppleTitleFront: "Pommes",
    seasonalAppleTitleBack: "Pommes",
    seasonalTriggerText: "Produits de saison",
    titrepageHistoire: "L'histoire",
    titreBio1: 'Début',
    titreBio2: 'Evolution',
    titreBio3: 'Présent',
    histoireText1: "Notre histoire commence en 1898, portée par une ambition claire : offrir des produits de qualité en nous appuyant sur un savoir-faire exigeant. Dès nos débuts, nous avons évolué dans un environnement où tradition et précision sont essentielles. Nous avons toujours placé la rigueur au cœur de notre travail et la satisfaction de nos premiers clients au premier plan, construisant ainsi des fondations solides et durables.",
    histoireText2: "Au fil des années, nous avons connu une croissance progressive en nous adaptant aux évolutions du marché et aux nouvelles attentes des consommateurs. Tout en restant fidèles à nos valeurs d’origine, nous avons su diversifier nos activités, développer notre expertise et renforcer notre réputation grâce à la qualité constante de nos produits. Cette période s’est distinguée par une forte dynamique d’innovation, des investissements soutenus et un élargissement continu de notre clientèle.",
    histoireText3: "Aujourd’hui, nous nous imposons comme une entreprise reconnue dans notre domaine et faisons partie des piliers du MIN de Rungis, en alliant tradition et modernité. Nous continuons de valoriser notre héritage tout en intégrant de nouveaux produits afin de rester compétitifs. Forts de notre expérience, nous répondons aux exigences actuelles en proposant des solutions adaptées, tout en maintenant un haut niveau de qualité et de professionnalisme.",
    titreChiffres: "Quelques chiffres",
    titreChiffresCreation: "Création",
    titreChiffresExpertise: "Expertise",
    titreChiffresProduits: "Produits",
    compteurExpertiseSuffix: "ans",

    //PAGE RAYON
    titrepageRayons: 'Les rayons',
    titreRayon1: "Fruits",
    titreRayon2: "Legumes",
    titreRayon3: "Mini-legumes",
    titreRayon4: "Condiments",
    titreRayon5: "Exotic",
    titreRayon6: "Jeunes pousses",
    titreRayon7: "Germes",
    titreRayon8: "Herbes",
    cardBananasTitle: "Bananes",
    cardBananasVarieties: "Variétés de Bananes",
    cardApplesTitle: "Pommes",
    cardApplesVarieties: "Variétés de Pommes",
    cardPearsTitle: "Poires",
    cardPearsVarieties: "Variétés de Poires",
    cardKiwisTitle: "Kiwis",
    cardKiwisVarieties: "Variétés de Kiwis",
    cardMelonsTitle: "Melons",
    cardMelonsVarieties: "Variétés de Melons",
    cardCitrusTitle: "Agrumes",
    cardCitrusVarieties: "Variétés d'Agrumes",
    cardBerriesTitle: "Fruits Rouges",
    cardBerriesVarieties: "Variétés de Fruits Rouges",
    cardGrapesTitle: "Raisins",
    cardGrapesVarieties: "Variétés de Raisins",
    cardStoneFruitTitle: "Fruits à noyau",
    cardStoneFruitVarieties: "Variétés de fruits à noyau",
    cardTomatoesTitle: "Tomates",
    cardTomatoesVarieties: "Variétés de Tomates",
    cardRatatouilleTitle: "Ratatouille",
    cardRatatouilleMainIngredients: "Ingrédients principaux",
    cardRootsBulbsTitle: "Racines & Bulbes",
    cardRootsBulbsVarieties: "Variétés principales",
    cardBroccoliArtichokeTitleFront: "Brocoli & Artichaut",
    cardBroccoliArtichokeTitleBack: "Brocoli & Artichaut",
    cardCabbagesTitle: "Les choux",
    cardCabbagesVarieties: "Variétés de Choux",
    cardSaladsTitle: "Salades",
    cardSaladsVarieties: "Variétés de salade",
    cardPumpkinsTitle: "Potirons",
    cardPumpkinsVarieties: "Variétés principales",
    cardOtherVegetablesTitle: "Autres légumes",
    cardOtherVegetablesVarieties: "Variétés d'Autres Légumes",
    cardMiniVegetablesTitle: "Mini-légumes",
    cardMiniVegetablesVarieties: "Variétés de mini-légumes",
    cardPotatoesTitle: "Pomme de Terre",
    cardPotatoesVarieties: "Variétés de Pommes de Terre",
    cardOnionsTitle: "Oignons",
    cardOnionsVarieties: "Variétés d'Oignons",
    cardGarlicTitle: "Ails",
    cardGarlicVarieties: "Variétés d'Ail",
    cardAvocadosTitle: "Avocats",
    cardAvocadosVarieties: "Variétés d'Avocats",
    cardMushroomsTitle: "Champignons",
    cardMushroomsVarieties: "Variétés de Champignons",
    cardAsparagusTitle: "Asperges",
    cardAsparagusVarieties: "Variétés d'Asperges",
    cardMangoesTitle: "Mangues",
    cardMangoesVarieties: "Variétés de Mangues",
    cardDragonFruitTitle: "Fruit du dragon",
    cardDragonFruitVarieties: "Variétés fruit du dragon",
    cardPassionFruitTitle: "Fruits de la Passion",
    cardPassionFruitVarieties: "Variétés de Fruits de la Passion",
    cardEggplantsTitle: "Aubergines",
    cardEggplantsVarieties: "Variétés d'Aubergines",
    cardPineapplesTitle: "Ananas",
    cardPineapplesVarieties: "Variétés d'Ananas",
    cardBabyLeavesTitle: "Jeunes pousses",
    cardBabyLeavesVarieties: "Variétés de jeunes pousses",
    cardSproutsTitle: "Germes",
    cardSproutsVarieties: "Variétés de germes",
    cardAromaticHerbsTitle: "Herbes aromatique",
    cardAromaticHerbsVarieties: "Variétés d'herbes",
    cardEdibleFlowersTitle: "Fleurs comestibles",
    cardEdibleFlowersVarieties: "Variétés de fleurs comestibles",
    cardMoreItems: "Et bien d'autres...",
    rayonText1: "Au rayon fruits, nous vous proposons une large sélection de produits frais, soigneusement choisis pour leur qualité et leur fraîcheur. Issus de producteurs locaux et internationaux, nous sélectionnons nos fruits avec rigueur afin de garantir goût, maturité et diversité tout au long de l’année. Nous répondons ainsi aux attentes des professionnels en offrant des produits parfaitement adaptés aux besoins du marché.",
    rayonText2: "Au rayon légumes, nous vous proposons une grande variété de produits frais, rigoureusement sélectionnés pour répondre aux standards de qualité les plus exigeants. Nous veillons à la fraîcheur, à la traçabilité et à la conformité de nos légumes aux normes sanitaires. Ainsi, nous sommes en mesure de satisfaire une clientèle variée, allant du commerce de proximité à la restauration.",
    rayonText3: "Au rayon mini-légumes, nous vous proposons des produits originaux et raffinés, particulièrement appréciés en restauration gastronomique. Nos petits formats offrent une présentation esthétique et une grande diversité d’utilisations culinaires, tout en conservant toutes les qualités gustatives des légumes traditionnels.",
    rayonText4: "Au rayon condiments, nous vous proposons une gamme de produits essentiels pour la cuisine. Nous sélectionnons chaque produit avec soin afin de garantir qualité, conservation et polyvalence. Ainsi, nous répondons aux besoins quotidiens des professionnels en leur fournissant des ingrédients fiables et incontournables pour la préparation de leurs plats.",
    rayonText5: "Au rayon exotique, nous vous proposons des produits venus du monde entier, pour vous permettre de découvrir de nouvelles saveurs et d’élargir votre offre. Grâce à notre réseau d’importation efficace, nous garantissons la disponibilité de ces produits tout en respectant nos exigences de qualité et de fraîcheur.",
    rayonText6: "Au rayon jeunes pousses, nous vous proposons une sélection de produits frais, composés de jeunes feuilles délicates. Appréciées pour leur tendreté et leur fraîcheur, elles sont idéales pour les salades ou en accompagnement. Nous sélectionnons soigneusement nos produits afin de garantir qualité, goût et régularité pour les professionnels.",
    rayonText7: "Au rayon germes, nous vous proposons une gamme de produits frais, reconnus pour leurs qualités nutritionnelles et leur fraîcheur. Idéaux pour apporter croquant, couleur et originalité à vos préparations culinaires, nos germes répondent à une demande croissante pour une alimentation saine et équilibrée.",
    rayonText8: "Au rayon herbes aromatiques, nous vous proposons une sélection fraîche et parfumée. Nos herbes apportent saveur, fraîcheur et authenticité à votre cuisine, que ce soit pour des recettes simples ou gastronomiques.",

    //FOOTER
    cguFooter: "Conditions générales d'utilisation",
    contact: "Contact",
    footerCopy: "Copyright © 2026 Cruchaudet.com. Tous droits réservés.",

    //404
    text404: "Oups ! La page que vous recherchez n'existe pas.",
    btn404: "Retour à l'accueil",

    //PAGE EXPORT
    TitreExport: "Service d'Expédition",
    contactFormTitle: "Contact Export",
    nom: "Nom *",
    prenom: "Prénom *",
    email: "Email *",
    telephone: "Téléphone *",
    objet: "Objet *",
    message: "Votre message *",
    submitBtn: "Envoyer",
    exportKicker: "Export International",
    exportText: "Chez Cruchaudet Grandjean, nous mettons en œuvre une organisation efficace pour assurer l’expédition de fruits et légumes à l’international. Grâce à notre implantation sur le marché de Rungis et à notre expérience dans le commerce de gros, nous sommes en mesure de livrer dans le monde entier tout en garantissant la fraîcheur des produits et le respect des délais. Nous nous appuyons sur une logistique maîtrisée et un réseau de partenaires fiables afin de répondre aux exigences de nos clients étrangers, tout en assurant un accompagnement professionnel et un suivi rigoureux des commandes pour offrir un service de qualité.",
    exportPoint1: "Traçabilité",
    exportPoint2: "Délais maîtrisés",
    exportPoint3: "Accompagnement pro",
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
    temoignageText1: "Très satisfait de la qualité des produits proposés par Cruchaudet Grandjean. Les fruits et légumes sont toujours frais et bien sélectionnés. Le service est réactif. Un partenaire de confiance.",
    temoignageText2: "Entreprise sérieuse avec un large choix de produits, notamment en fruits exotiques. La qualité est constante et le suivi des commandes est impeccable. Je recommande pour les professionnels exigeants.",
    temoignageText3: "Excellente expérience avec Cruchaudet Grandjean. Les équipes sont à l’écoute et savent s’adapter aux besoins spécifiques. La logistique est efficace et les produits arrivent toujours en parfait état.",
    temoignageAuthor1: "Thibault - Chef de restaurant",
    temoignageAuthor2: "Bernard - Commerçant",
    temoignageAuthor3: "Élodie - Restauratrice",
    //PAGE ENGAGEMENT
    titrepageEngagement: 'Nos engagements',
    engagementIntro: "Chez Cruchaudet, nos engagements ne sont pas de simples promesses. Ils guident chaque commande, de la sélection produit au départ de Rungis. Nous accompagnons les professionnels avec une exigence claire : proposer des fruits et légumes fiables, frais et conformes à leurs attentes, avec un suivi rigoureux et une réponse rapide.",
    titreEngagements1: 'Sélection & qualité',
    titreEngagements2: 'Service & réactivité',
    engagementText1: "Chaque produit est choisi avec rigueur selon sa fraîcheur, sa tenue, sa régularité et son origine. Nous travaillons avec des producteurs et partenaires reconnus, en France comme à l'international, afin de garantir une offre adaptée aux exigences des grossistes, commerçants et restaurateurs. Notre implantation à Rungis nous permet d'assurer un approvisionnement réactif, une traçabilité maîtrisée et un niveau de qualité constant tout au long de l'année.",
    engagementText2: "Nous savons que vos contraintes sont opérationnelles : délais serrés, besoins spécifiques, volumes variables et attentes précises selon les marchés. C'est pourquoi nous privilégions un accompagnement direct, des réponses rapides et une logistique fiable. De la préparation des commandes à l'import-export, nous mettons tout en œuvre pour sécuriser vos approvisionnements et construire une relation durable fondée sur la confiance, la clarté et la régularité.",
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
    navRayonH: 'Herbs',
    navRayonExotic: "Exotic",
    navRayonC: "Condiments",
    navContactExport: "Contact Form",
    navNosPartenaires: "Our Partners",
    navClients: "Clients",
    navFournisseurs: "Suppliers",
    navContact: "Contact",

    //PAGE INDEX
    titre: "Cruchaudet",
    heroKicker: "Fruit & vegetable wholesaler since 1898",
    phrase1: "Fresh fruits and vegetables, every day.",
    phrase2: "Departing from <span class='Rungis'>Rungis</span>.",
    heroBtnStory: "Discover our story",
    heroBtnDepartments: "View our departments",
    seasonalAsparagusDesc: "Green and white asparagus harvested in season for a tender texture and delicate flavor.",
    seasonalArtichokeDesc: "Fresh, generous, flavorful artichokes, perfect for traditional dishes and creative recipes.",
    seasonalStrawberryDesc: "Sweet, fragrant strawberries selected for freshness and excellent shelf presentation.",
    seasonalAppleDesc: "Crisp, balanced apples available in several varieties for every use.",
    seasonalPopupTitle: "Seasonal products",
    seasonalAsparagusTitleFront: "Asparagus",
    seasonalAsparagusTitleBack: "Asparagus",
    seasonalArtichokeTitleFront: "Artichokes",
    seasonalArtichokeTitleBack: "Artichokes",
    seasonalStrawberryTitleFront: "Strawberries",
    seasonalStrawberryTitleBack: "Strawberries",
    seasonalAppleTitleFront: "Apples",
    seasonalAppleTitleBack: "Apples",
    seasonalTriggerText: "Seasonal products",
    titrepageHistoire: "History",
    titreBio1: "Beginning",
    titreBio2: "Evolution",
    titreBio3: "Present",
    histoireText1: "Our story began in 1898, driven by a clear ambition: offering quality products supported by demanding expertise. From the start, we grew in an environment where tradition and precision are essential. We have always placed rigor at the heart of our work and customer satisfaction first, building strong and lasting foundations.",
    histoireText2: "Over the years, we grew steadily by adapting to market changes and new consumer expectations. While staying true to our core values, we diversified our activities, developed our expertise, and strengthened our reputation through consistent product quality. This period was marked by strong innovation, sustained investment, and continuous growth of our client base.",
    histoireText3: "Today, we are recognized as a key company in our field and as one of the pillars of the Rungis International Market, combining tradition and modernity. We continue to value our heritage while integrating new products to remain competitive. With our experience, we meet today’s requirements through tailored solutions while maintaining high standards of quality and professionalism.",
    titreChiffres: "Some figures",
    titreChiffresCreation: "Founded",
    titreChiffresExpertise: "Expertise",
    titreChiffresProduits: "Products",
    compteurExpertiseSuffix: "years",

    //PAGE RAYON
    titrepageRayons: "Departments",
    titreRayon1: "Fruits",
    titreRayon2: "Vegetables",
    titreRayon3: "Baby Vegetables",
    titreRayon4: "Condiments",
    titreRayon5: "Exotic",
    titreRayon6: "Baby Leaves",
    titreRayon7: "Sprouts",
    titreRayon8: "Herbs",
    cardBananasTitle: "Bananas",
    cardBananasVarieties: "Banana Varieties",
    cardApplesTitle: "Apples",
    cardApplesVarieties: "Apple Varieties",
    cardPearsTitle: "Pears",
    cardPearsVarieties: "Pear Varieties",
    cardKiwisTitle: "Kiwis",
    cardKiwisVarieties: "Kiwi Varieties",
    cardMelonsTitle: "Melons",
    cardMelonsVarieties: "Melon Varieties",
    cardCitrusTitle: "Citrus",
    cardCitrusVarieties: "Citrus Varieties",
    cardBerriesTitle: "Berries",
    cardBerriesVarieties: "Berry Varieties",
    cardGrapesTitle: "Grapes",
    cardGrapesVarieties: "Grape Varieties",
    cardStoneFruitTitle: "Stone Fruits",
    cardStoneFruitVarieties: "Stone Fruit Varieties",
    cardTomatoesTitle: "Tomatoes",
    cardTomatoesVarieties: "Tomato Varieties",
    cardRatatouilleTitle: "Ratatouille Mix",
    cardRatatouilleMainIngredients: "Main Ingredients",
    cardRootsBulbsTitle: "Roots & Bulbs",
    cardRootsBulbsVarieties: "Main Varieties",
    cardBroccoliArtichokeTitleFront: "Broccoli & Artichoke",
    cardBroccoliArtichokeTitleBack: "Broccoli & Artichoke",
    cardCabbagesTitle: "Cabbages",
    cardCabbagesVarieties: "Cabbage Varieties",
    cardSaladsTitle: "Salads",
    cardSaladsVarieties: "Salad Varieties",
    cardPumpkinsTitle: "Pumpkins",
    cardPumpkinsVarieties: "Main Varieties",
    cardOtherVegetablesTitle: "Other Vegetables",
    cardOtherVegetablesVarieties: "Other Vegetable Varieties",
    cardMiniVegetablesTitle: "Baby Vegetables",
    cardMiniVegetablesVarieties: "Baby Vegetable Varieties",
    cardPotatoesTitle: "Potatoes",
    cardPotatoesVarieties: "Potato Varieties",
    cardOnionsTitle: "Onions",
    cardOnionsVarieties: "Onion Varieties",
    cardGarlicTitle: "Garlic",
    cardGarlicVarieties: "Garlic Varieties",
    cardAvocadosTitle: "Avocados",
    cardAvocadosVarieties: "Avocado Varieties",
    cardMushroomsTitle: "Mushrooms",
    cardMushroomsVarieties: "Mushroom Varieties",
    cardAsparagusTitle: "Asparagus",
    cardAsparagusVarieties: "Asparagus Varieties",
    cardMangoesTitle: "Mangoes",
    cardMangoesVarieties: "Mango Varieties",
    cardDragonFruitTitle: "Dragon Fruit",
    cardDragonFruitVarieties: "Dragon Fruit Varieties",
    cardPassionFruitTitle: "Passion Fruits",
    cardPassionFruitVarieties: "Passion Fruit Varieties",
    cardEggplantsTitle: "Eggplants",
    cardEggplantsVarieties: "Eggplant Varieties",
    cardPineapplesTitle: "Pineapples",
    cardPineapplesVarieties: "Pineapple Varieties",
    cardBabyLeavesTitle: "Baby Leaves",
    cardBabyLeavesVarieties: "Baby Leaf Varieties",
    cardSproutsTitle: "Sprouts",
    cardSproutsVarieties: "Sprout Varieties",
    cardAromaticHerbsTitle: "Aromatic Herbs",
    cardAromaticHerbsVarieties: "Herb Varieties",
    cardEdibleFlowersTitle: "Edible Flowers",
    cardEdibleFlowersVarieties: "Edible Flower Varieties",
    cardBananasItem1: "Banana",
    cardBananasItem2: "Frecinette",
    cardBananasItem3: "Green banana",
    cardBananasItem4: "Organic banana",
    cardApplesItem1: "Pink Lady",
    cardApplesItem2: "Golden Delicious",
    cardApplesItem3: "Granny Smith",
    cardApplesItem4: "Fuji",
    cardPearsItem1: "Comice",
    cardPearsItem2: "Williams",
    cardPearsItem3: "Conference",
    cardKiwisItem1: "Green",
    cardKiwisItem2: "Gold",
    cardKiwisItem3: "Red",
    cardMelonsItem1: "Philibon",
    cardMelonsItem2: "Charentais",
    cardMelonsItem3: "Honeydew",
    cardCitrusItem1: "Lemon",
    cardCitrusItem2: "Orange",
    cardCitrusItem3: "Clementine",
    cardCitrusItem4: "Grapefruit",
    cardBerriesItem1: "Strawberry",
    cardBerriesItem2: "Raspberry",
    cardBerriesItem3: "Blueberry",
    cardBerriesItem4: "Blackberry",
    cardGrapesItem1: "Black grape",
    cardGrapesItem2: "Pink grape",
    cardGrapesItem3: "White grape",
    cardStoneFruitItem1: "Apricot",
    cardStoneFruitItem2: "Flat peach",
    cardStoneFruitItem3: "Nectarine",
    cardStoneFruitItem4: "Peach",
    cardTomatoesItem1: "Beefsteak",
    cardTomatoesItem2: "Black",
    cardTomatoesItem3: "Pineapple",
    cardTomatoesItem4: "Cherry",
    cardRatatouilleItem1: "Eggplant",
    cardRatatouilleItem2: "Bell pepper",
    cardRatatouilleItem3: "Zucchini",
    cardRatatouilleItem4: "Cucumber",
    cardRootsBulbsItem1: "Beetroot",
    cardRootsBulbsItem2: "Turnip",
    cardRootsBulbsItem3: "Carrot",
    cardRootsBulbsItem4: "Radish",
    cardRootsBulbsItem5: "Endive",
    cardBroccoliArtichokeItem1: "Broccoli",
    cardBroccoliArtichokeItem2: "Artichoke",
    cardCabbagesItem1: "Cauliflower",
    cardCabbagesItem2: "White cabbage",
    cardCabbagesItem3: "Red cabbage",
    cardCabbagesItem4: "Brussels sprouts",
    cardCabbagesItem5: "Romanesco",
    cardSaladsItem1: "Batavia lettuce",
    cardSaladsItem2: "Lettuce",
    cardSaladsItem3: "Red leaf lettuce",
    cardSaladsItem4: "Oak leaf lettuce",
    cardSaladsItem5: "Lollo Rossa",
    cardPumpkinsItem1: "Pumpkin",
    cardPumpkinsItem2: "Red kuri squash",
    cardPumpkinsItem3: "Butternut",
    cardOtherVegetablesItem1: "Leeks",
    cardOtherVegetablesItem2: "Fennel",
    cardOtherVegetablesItem3: "Celery stalk",
    cardMiniVegetablesItem1: "Carrots",
    cardMiniVegetablesItem2: "Beetroots",
    cardMiniVegetablesItem3: "Fennel",
    cardMiniVegetablesItem4: "Leeks",
    cardPotatoesItem1: "Charlotte",
    cardPotatoesItem2: "Agata",
    cardPotatoesItem3: "Ratte",
    cardOnionsItem1: "Yellow",
    cardOnionsItem2: "Red",
    cardOnionsItem3: "White",
    cardOnionsItem4: "Shallot",
    cardGarlicItem1: "White",
    cardGarlicItem2: "Pink",
    cardGarlicItem3: "Purple",
    cardAvocadosItem1: "Ripe avocado",
    cardAvocadosItem2: "Firm avocado",
    cardAvocadosItem3: "Tropical avocado",
    cardMushroomsItem1: "Button mushroom",
    cardMushroomsItem2: "Shiitake",
    cardMushroomsItem3: "Oyster mushroom",
    cardMushroomsItem4: "Morels",
    cardAsparagusItem1: "White",
    cardAsparagusItem2: "Green",
    cardAsparagusItem3: "Wild",
    cardAsparagusItem4: "Violet",
    cardMangoesItem1: "Kent",
    cardMangoesItem2: "Bateau",
    cardDragonFruitItem1: "Yellow flesh",
    cardDragonFruitItem2: "Red flesh",
    cardDragonFruitItem3: "White flesh",
    cardPassionFruitItem1: "Purple",
    cardPassionFruitItem2: "Yellow",
    cardEggplantsItem1: "Violet",
    cardEggplantsItem2: "Mini white",
    cardEggplantsItem3: "Mini graffiti",
    cardEggplantsItem4: "Mini black",
    cardPineapplesItem1: "Bateau",
    cardPineapplesItem2: "Sugarloaf",
    cardPineapplesItem3: "Premium",
    cardPineapplesItem4: "Victoria",
    cardBabyLeavesItem1: "Mesclun",
    cardBabyLeavesItem2: "Arugula",
    cardBabyLeavesItem3: "Lamb's lettuce",
    cardBabyLeavesItem4: "Gourmet mix",
    cardSproutsItem1: "Beetroot",
    cardSproutsItem2: "Alfalfa",
    cardSproutsItem3: "Lentils",
    cardSproutsItem4: "Radish",
    cardAromaticHerbsItem1: "Bay leaf",
    cardAromaticHerbsItem2: "Thyme",
    cardAromaticHerbsItem3: "Parsley",
    cardAromaticHerbsItem4: "Basil",
    cardAromaticHerbsItem5: "Dill",
    cardEdibleFlowersItem1: "Mixed pansies",
    cardEdibleFlowersItem2: "Alysse",
    cardEdibleFlowersItem3: "Pink petal",
    cardEdibleFlowersItem4: "Borage",
    cardMoreItems: "And many more...",
    rayonText1: "In our fruit department, we offer a wide range of fresh products carefully selected for quality and freshness. Sourced from local and international growers, our fruits are chosen with rigor to guarantee taste, maturity, and variety throughout the year. We meet professionals’ expectations with products perfectly adapted to market needs.",
    rayonText2: "In our vegetable department, we offer a broad variety of fresh products selected to meet the highest quality standards. We ensure freshness, traceability, and compliance with health standards. This allows us to serve diverse customers, from local shops to food service.",
    rayonText3: "In our baby vegetable department, we offer original and refined products, especially valued in fine dining. Their small formats provide elegant presentation and many culinary uses while preserving the full taste qualities of traditional vegetables.",
    rayonText4: "In our condiments department, we offer essential products for professional cooking. Each item is carefully selected to guarantee quality, shelf life, and versatility. We support daily operations with reliable essentials for dish preparation.",
    rayonText5: "In our exotic department, we offer products from around the world to help you discover new flavors and expand your offer. Thanks to our efficient import network, we ensure availability while maintaining strict quality and freshness standards.",
    rayonText6: "In our baby leaves department, we offer a fresh selection of delicate young leaves. Appreciated for tenderness and freshness, they are ideal for salads or side dishes. We carefully select our products to guarantee quality, flavor, and consistency for professionals.",
    rayonText7: "In our sprouts department, we offer fresh products known for nutritional value and freshness. Ideal for adding crunch, color, and originality to culinary preparations, our sprouts meet growing demand for healthy and balanced eating.",
    rayonText8: "In our aromatic herbs department, we offer a fresh and fragrant selection. Our herbs bring flavor, freshness, and authenticity to your cuisine, whether for simple or gourmet recipes.",

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
    exportKicker: "International Export",
    exportText: "At Cruchaudet Grandjean, we implement efficient organization to ensure international shipment of fruits and vegetables. Thanks to our location in the Rungis market and our wholesale experience, we deliver worldwide while guaranteeing product freshness and deadlines. We rely on controlled logistics and trusted partners to meet international customer requirements, while ensuring professional support and rigorous order tracking for high-quality service.",
    exportPoint1: "Traceability",
    exportPoint2: "Controlled lead times",
    exportPoint3: "Professional support",
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
    temoignageText1: "Very satisfied with the quality of products offered by Cruchaudet Grandjean. Fruits and vegetables are always fresh and well selected. The service is responsive. A trusted partner.",
    temoignageText2: "A serious company with a wide product range, especially exotic fruits. Quality is consistent and order tracking is flawless. I recommend them for demanding professionals.",
    temoignageText3: "Excellent experience with Cruchaudet Grandjean. Their teams listen carefully and adapt to specific needs. Logistics are efficient and products always arrive in perfect condition.",
    temoignageAuthor1: "Thibault - Restaurant Chef",
    temoignageAuthor2: "Bernard - Shopkeeper",
    temoignageAuthor3: "Elodie - Restaurateur",

    //PAGE ENGAGEMENT
  titrepageEngagement: "Our Commitments",
    engagementIntro: "At Cruchaudet, our commitments are not empty promises. They guide every order, from product selection to dispatch from Rungis. We support professionals with one clear standard: reliable, fresh fruits and vegetables that meet expectations, backed by careful follow-up and fast response times.",
  titreEngagements1: "Selection & Quality",
  titreEngagements2: "Service & Responsiveness",
    engagementText1: "Each product is selected with care based on freshness, shelf life, consistency, and origin. We work with trusted growers and partners in France and abroad to provide an offer tailored to the needs of wholesalers, retailers, and restaurateurs. Our presence at Rungis allows us to ensure responsive sourcing, controlled traceability, and consistent quality throughout the year.",
    engagementText2: "We understand that your constraints are operational: tight deadlines, specific needs, changing volumes, and market-driven expectations. That is why we focus on direct support, quick answers, and reliable logistics. From order preparation to import-export flows, we do everything possible to secure your supply and build a lasting relationship based on trust, clarity, and consistency.",
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
    navRayonH: 'Hierbas',
    navExotic: "Exóticas",
    navNosPartenaires: "Nuestros Socios",
    navContactExport: "Formulario de Contacto",
    navClients: "Clientes",
    navFournisseurs: "Proveedores",
    navContact: "Contacto",

    //PAGE INDEX
    titre: "Cruchaudet",
    heroKicker: "Mayorista de frutas y verduras desde 1898",
    phrase1: "Frutas y verduras frescas, cada día.",
    phrase2: "Desde <span class='Rungis'>Rungis</span>.",
    heroBtnStory: "Descubrir nuestra historia",
    heroBtnDepartments: "Ver nuestras secciones",
    seasonalAsparagusDesc: "Espárragos verdes y blancos, cosechados en temporada para una textura tierna y un sabor delicado.",
    seasonalArtichokeDesc: "Alcachofas frescas, generosas y sabrosas, perfectas para platos tradicionales y recetas creativas.",
    seasonalStrawberryDesc: "Fresas dulces y aromáticas, seleccionadas por su frescura y excelente presentación.",
    seasonalAppleDesc: "Manzanas crujientes y equilibradas, disponibles en varias variedades para todos los usos.",
    seasonalPopupTitle: "Productos de temporada",
    seasonalAsparagusTitleFront: "Espárragos",
    seasonalAsparagusTitleBack: "Espárragos",
    seasonalArtichokeTitleFront: "Alcachofas",
    seasonalArtichokeTitleBack: "Alcachofas",
    seasonalStrawberryTitleFront: "Fresas",
    seasonalStrawberryTitleBack: "Fresas",
    seasonalAppleTitleFront: "Manzanas",
    seasonalAppleTitleBack: "Manzanas",
    seasonalTriggerText: "Productos de temporada",
    titrepageHistoire: "Historia",
    titreBio1: "Inicio",
    titreBio2: "Evolución",
    titreBio3: "Presente",
    histoireText1: "Nuestra historia comienza en 1898, impulsada por una ambición clara: ofrecer productos de calidad con un saber hacer exigente. Desde nuestros inicios evolucionamos en un entorno donde tradición y precisión son esenciales. Siempre hemos puesto el rigor en el centro del trabajo y la satisfacción del cliente en primer plano.",
    histoireText2: "Con los años, crecimos progresivamente adaptándonos a la evolución del mercado y a las nuevas expectativas de los consumidores. Manteniéndonos fieles a nuestros valores de origen, diversificamos actividades, desarrollamos nuestra experiencia y reforzamos nuestra reputación gracias a la calidad constante de nuestros productos.",
    histoireText3: "Hoy somos una empresa reconocida en nuestro sector y uno de los pilares del MIN de Rungis, combinando tradición y modernidad. Seguimos valorizando nuestro legado e integrando nuevos productos para mantenernos competitivos y responder a las exigencias actuales con soluciones adaptadas.",
    titreChiffres: "Algunos números",
    titreChiffresCreation: "Creación",
    titreChiffresExpertise: "Experiencia",
    titreChiffresProduits: "Productos",
    compteurExpertiseSuffix: "años",

    //PAGE RAYON
    titrepageRayons: "Secciones",
    titreRayon1: "Frutas",
    titreRayon2: "Verduras",
    titreRayon3: "Mini Verduras",
    titreRayon4: "Condimentos",
    titreRayon5: "Exóticos",
    titreRayon6: "Brotes Tiernos",
    titreRayon7: "Germinados",
    titreRayon8: "Hierbas",
    cardBananasTitle: "Bananas",
    cardBananasVarieties: "Variedades de Bananas",
    cardApplesTitle: "Manzanas",
    cardApplesVarieties: "Variedades de Manzanas",
    cardPearsTitle: "Peras",
    cardPearsVarieties: "Variedades de Peras",
    cardKiwisTitle: "Kiwis",
    cardKiwisVarieties: "Variedades de Kiwis",
    cardMelonsTitle: "Melones",
    cardMelonsVarieties: "Variedades de Melones",
    cardCitrusTitle: "Cítricos",
    cardCitrusVarieties: "Variedades de Cítricos",
    cardBerriesTitle: "Frutos Rojos",
    cardBerriesVarieties: "Variedades de Frutos Rojos",
    cardGrapesTitle: "Uvas",
    cardGrapesVarieties: "Variedades de Uvas",
    cardStoneFruitTitle: "Frutas de hueso",
    cardStoneFruitVarieties: "Variedades de frutas de hueso",
    cardTomatoesTitle: "Tomates",
    cardTomatoesVarieties: "Variedades de Tomates",
    cardRatatouilleTitle: "Ratatouille",
    cardRatatouilleMainIngredients: "Ingredientes principales",
    cardRootsBulbsTitle: "Raíces y Bulbos",
    cardRootsBulbsVarieties: "Variedades principales",
    cardBroccoliArtichokeTitleFront: "Brócoli y Alcachofa",
    cardBroccoliArtichokeTitleBack: "Brócoli y Alcachofa",
    cardCabbagesTitle: "Coles",
    cardCabbagesVarieties: "Variedades de Coles",
    cardSaladsTitle: "Ensaladas",
    cardSaladsVarieties: "Variedades de ensalada",
    cardPumpkinsTitle: "Calabazas",
    cardPumpkinsVarieties: "Variedades principales",
    cardOtherVegetablesTitle: "Otras verduras",
    cardOtherVegetablesVarieties: "Variedades de otras verduras",
    cardMiniVegetablesTitle: "Mini Verduras",
    cardMiniVegetablesVarieties: "Variedades de mini verduras",
    cardPotatoesTitle: "Patatas",
    cardPotatoesVarieties: "Variedades de Patatas",
    cardOnionsTitle: "Cebollas",
    cardOnionsVarieties: "Variedades de Cebollas",
    cardGarlicTitle: "Ajos",
    cardGarlicVarieties: "Variedades de Ajo",
    cardAvocadosTitle: "Aguacates",
    cardAvocadosVarieties: "Variedades de Aguacates",
    cardMushroomsTitle: "Setas",
    cardMushroomsVarieties: "Variedades de Setas",
    cardAsparagusTitle: "Espárragos",
    cardAsparagusVarieties: "Variedades de Espárragos",
    cardMangoesTitle: "Mangos",
    cardMangoesVarieties: "Variedades de Mangos",
    cardDragonFruitTitle: "Fruta del dragón",
    cardDragonFruitVarieties: "Variedades de fruta del dragón",
    cardPassionFruitTitle: "Frutas de la Pasión",
    cardPassionFruitVarieties: "Variedades de frutas de la pasión",
    cardEggplantsTitle: "Berenjenas",
    cardEggplantsVarieties: "Variedades de Berenjenas",
    cardPineapplesTitle: "Piñas",
    cardPineapplesVarieties: "Variedades de Piñas",
    cardBabyLeavesTitle: "Brotes Tiernos",
    cardBabyLeavesVarieties: "Variedades de brotes tiernos",
    cardSproutsTitle: "Germinados",
    cardSproutsVarieties: "Variedades de germinados",
    cardAromaticHerbsTitle: "Hierbas aromáticas",
    cardAromaticHerbsVarieties: "Variedades de hierbas",
    cardEdibleFlowersTitle: "Flores comestibles",
    cardEdibleFlowersVarieties: "Variedades de flores comestibles",
    cardBananasItem1: "Banana",
    cardBananasItem2: "Frecinette",
    cardBananasItem3: "Banana verde",
    cardBananasItem4: "Banana ecológica",
    cardApplesItem1: "Pink Lady",
    cardApplesItem2: "Golden Delicious",
    cardApplesItem3: "Granny Smith",
    cardApplesItem4: "Fuji",
    cardPearsItem1: "Comice",
    cardPearsItem2: "Williams",
    cardPearsItem3: "Conference",
    cardKiwisItem1: "Verde",
    cardKiwisItem2: "Gold",
    cardKiwisItem3: "Rojo",
    cardMelonsItem1: "Philibon",
    cardMelonsItem2: "Charentais",
    cardMelonsItem3: "Melón honeydew",
    cardCitrusItem1: "Limón",
    cardCitrusItem2: "Naranja",
    cardCitrusItem3: "Clementina",
    cardCitrusItem4: "Pomelo",
    cardBerriesItem1: "Fresa",
    cardBerriesItem2: "Frambuesa",
    cardBerriesItem3: "Arándano",
    cardBerriesItem4: "Mora",
    cardGrapesItem1: "Uva negra",
    cardGrapesItem2: "Uva rosada",
    cardGrapesItem3: "Uva blanca",
    cardStoneFruitItem1: "Albaricoque",
    cardStoneFruitItem2: "Paraguayo",
    cardStoneFruitItem3: "Nectarina",
    cardStoneFruitItem4: "Melocotón",
    cardTomatoesItem1: "Corazón de buey",
    cardTomatoesItem2: "Negra",
    cardTomatoesItem3: "Piña",
    cardTomatoesItem4: "Cereza",
    cardRatatouilleItem1: "Berenjena",
    cardRatatouilleItem2: "Pimiento",
    cardRatatouilleItem3: "Calabacín",
    cardRatatouilleItem4: "Pepino",
    cardRootsBulbsItem1: "Remolacha",
    cardRootsBulbsItem2: "Nabo",
    cardRootsBulbsItem3: "Zanahoria",
    cardRootsBulbsItem4: "Rábano",
    cardRootsBulbsItem5: "Endibia",
    cardBroccoliArtichokeItem1: "Brócoli",
    cardBroccoliArtichokeItem2: "Alcachofa",
    cardCabbagesItem1: "Coliflor",
    cardCabbagesItem2: "Col blanca",
    cardCabbagesItem3: "Col roja",
    cardCabbagesItem4: "Coles de Bruselas",
    cardCabbagesItem5: "Romanesco",
    cardSaladsItem1: "Lechuga batavia",
    cardSaladsItem2: "Lechuga",
    cardSaladsItem3: "Lechuga roja",
    cardSaladsItem4: "Hoja de roble",
    cardSaladsItem5: "Lollo Rossa",
    cardPumpkinsItem1: "Calabaza",
    cardPumpkinsItem2: "Calabaza hokkaido",
    cardPumpkinsItem3: "Butternut",
    cardOtherVegetablesItem1: "Puerros",
    cardOtherVegetablesItem2: "Hinojo",
    cardOtherVegetablesItem3: "Apio en rama",
    cardMiniVegetablesItem1: "Zanahorias",
    cardMiniVegetablesItem2: "Remolachas",
    cardMiniVegetablesItem3: "Hinojo",
    cardMiniVegetablesItem4: "Puerros",
    cardPotatoesItem1: "Charlotte",
    cardPotatoesItem2: "Agata",
    cardPotatoesItem3: "Ratte",
    cardOnionsItem1: "Amarillo",
    cardOnionsItem2: "Rojo",
    cardOnionsItem3: "Blanco",
    cardOnionsItem4: "Chalota",
    cardGarlicItem1: "Blanco",
    cardGarlicItem2: "Rosa",
    cardGarlicItem3: "Violeta",
    cardAvocadosItem1: "Aguacate maduro",
    cardAvocadosItem2: "Aguacate firme",
    cardAvocadosItem3: "Aguacate tropical",
    cardMushroomsItem1: "Champiñón de París",
    cardMushroomsItem2: "Shiitake",
    cardMushroomsItem3: "Seta de ostra",
    cardMushroomsItem4: "Colmenillas",
    cardAsparagusItem1: "Blanca",
    cardAsparagusItem2: "Verde",
    cardAsparagusItem3: "Salvaje",
    cardAsparagusItem4: "Violeta",
    cardMangoesItem1: "Kent",
    cardMangoesItem2: "Bateau",
    cardDragonFruitItem1: "Pulpa amarilla",
    cardDragonFruitItem2: "Pulpa roja",
    cardDragonFruitItem3: "Pulpa blanca",
    cardPassionFruitItem1: "Púrpura",
    cardPassionFruitItem2: "Amarillo",
    cardEggplantsItem1: "Violeta",
    cardEggplantsItem2: "Mini blanca",
    cardEggplantsItem3: "Mini grafiti",
    cardEggplantsItem4: "Mini negra",
    cardPineapplesItem1: "Bateau",
    cardPineapplesItem2: "Pan de azúcar",
    cardPineapplesItem3: "Premium",
    cardPineapplesItem4: "Victoria",
    cardBabyLeavesItem1: "Mesclun",
    cardBabyLeavesItem2: "Rúcula",
    cardBabyLeavesItem3: "Canónigos",
    cardBabyLeavesItem4: "Mezcla gourmet",
    cardSproutsItem1: "Remolacha",
    cardSproutsItem2: "Alfalfa",
    cardSproutsItem3: "Lentejas",
    cardSproutsItem4: "Rábano",
    cardAromaticHerbsItem1: "Laurel",
    cardAromaticHerbsItem2: "Tomillo",
    cardAromaticHerbsItem3: "Perejil",
    cardAromaticHerbsItem4: "Albahaca",
    cardAromaticHerbsItem5: "Eneldo",
    cardEdibleFlowersItem1: "Pensamientos mixtos",
    cardEdibleFlowersItem2: "Alysse",
    cardEdibleFlowersItem3: "Pétalo rosa",
    cardEdibleFlowersItem4: "Borraja",
    cardMoreItems: "Y muchos más...",
    rayonText1: "En la sección de frutas, ofrecemos una amplia selección de productos frescos, cuidadosamente elegidos por su calidad y frescura. Procedentes de productores locales e internacionales, seleccionamos nuestras frutas con rigor para garantizar sabor, madurez y diversidad durante todo el año.",
    rayonText2: "En la sección de verduras, ofrecemos una gran variedad de productos frescos, seleccionados rigurosamente para cumplir con los estándares de calidad más exigentes. Garantizamos frescura, trazabilidad y conformidad sanitaria para atender a una clientela diversa.",
    rayonText3: "En la sección de mini verduras, proponemos productos originales y refinados, especialmente apreciados en la restauración gastronómica. Sus formatos pequeños ofrecen una presentación estética y una gran diversidad de usos culinarios.",
    rayonText4: "En la sección de condimentos, ofrecemos una gama de productos esenciales para la cocina. Seleccionamos cada producto con cuidado para garantizar calidad, conservación y versatilidad, aportando ingredientes fiables para el trabajo diario de los profesionales.",
    rayonText5: "En la sección exótica, ofrecemos productos de todo el mundo para descubrir nuevos sabores y ampliar su oferta. Gracias a nuestra red de importación eficiente, garantizamos disponibilidad respetando exigencias de calidad y frescura.",
    rayonText6: "En la sección de brotes tiernos, ofrecemos una selección de productos frescos compuestos por hojas jóvenes y delicadas. Son ideales para ensaladas y acompañamientos, y se seleccionan cuidadosamente para garantizar calidad, sabor y regularidad.",
    rayonText7: "En la sección de germinados, ofrecemos productos frescos reconocidos por su valor nutricional y su frescura. Son ideales para aportar textura, color y originalidad a sus preparaciones culinarias.",
    rayonText8: "En la sección de hierbas aromáticas, ofrecemos una selección fresca y perfumada. Nuestras hierbas aportan sabor, frescura y autenticidad a su cocina, tanto en recetas simples como gastronómicas.",

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
    exportKicker: "Exportación Internacional",
    exportText: "En Cruchaudet Grandjean, aplicamos una organización eficaz para asegurar el envío internacional de frutas y verduras. Gracias a nuestra presencia en el mercado de Rungis y a nuestra experiencia mayorista, entregamos en todo el mundo garantizando frescura y plazos. Nos apoyamos en una logística controlada y socios fiables para ofrecer un servicio de alta calidad.",
    exportPoint1: "Trazabilidad",
    exportPoint2: "Plazos controlados",
    exportPoint3: "Acompañamiento profesional",
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
    temoignageText1: "Muy satisfecho con la calidad de los productos de Cruchaudet Grandjean. Las frutas y verduras siempre son frescas y bien seleccionadas. El servicio es ágil. Un socio de confianza.",
    temoignageText2: "Empresa seria con una amplia gama de productos, especialmente frutas exóticas. La calidad es constante y el seguimiento de pedidos es impecable. La recomiendo para profesionales exigentes.",
    temoignageText3: "Excelente experiencia con Cruchaudet Grandjean. Los equipos escuchan y se adaptan a las necesidades específicas. La logística es eficaz y los productos llegan siempre en perfecto estado.",
    temoignageAuthor1: "Thibault - Chef de restaurante",
    temoignageAuthor2: "Bernard - Comerciante",
    temoignageAuthor3: "Elodie - Restauradora",
    //PAGE ENGAGEMENT
    titrepageEngagement: "Nuestros compromisos",
    engagementIntro: "En Cruchaudet, nuestros compromisos no son promesas vacías. Guían cada pedido, desde la selección del producto hasta su salida desde Rungis. Acompañamos a los profesionales con una exigencia clara: ofrecer frutas y verduras fiables, frescas y conformes a sus expectativas, con un seguimiento riguroso y una respuesta rápida.",
    titreEngagements1: "Selección y calidad",
    titreEngagements2: "Servicio y rapidez",
    engagementText1: "Cada producto se selecciona con rigor según su frescura, su conservación, su regularidad y su origen. Trabajamos con productores y socios reconocidos, en Francia y en el extranjero, para garantizar una oferta adaptada a las exigencias de mayoristas, comerciantes y restauradores. Nuestra implantación en Rungis nos permite asegurar un abastecimiento ágil, una trazabilidad controlada y una calidad constante durante todo el año.",
    engagementText2: "Sabemos que sus limitaciones son operativas: plazos ajustados, necesidades específicas, volúmenes variables y expectativas precisas según los mercados. Por eso priorizamos un acompañamiento directo, respuestas rápidas y una logística fiable. Desde la preparación de los pedidos hasta la importación y exportación, hacemos todo lo posible para asegurar su abastecimiento y construir una relación duradera basada en la confianza, la claridad y la regularidad.",
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
    navRayonH: "Kräuter",
    navRayonC: "Gewürze",
    navNosPartenaires: "Unsere Partner",
    navContactExport: "Kontaktformular",
    navClients: "Kunden",
    navFournisseurs: "Lieferanten",
    navContact: "Kontakt",

    //PAGE INDEX
    titre: "Cruchaudet",
    heroKicker: "Obst- und Gemüsegroßhandel seit 1898",
    phrase1: "Frisches Obst und Gemüse, jeden Tag.",
    phrase2: "Abfahrt von <span class='Rungis'>Rungis</span>.",
    heroBtnStory: "Unsere Geschichte entdecken",
    heroBtnDepartments: "Unsere Abteilungen ansehen",
    seasonalAsparagusDesc: "Grüner und weißer Spargel, saisonal geerntet für zarte Textur und feinen Geschmack.",
    seasonalArtichokeDesc: "Frische, aromatische Artischocken, perfekt für traditionelle Gerichte und kreative Rezepte.",
    seasonalStrawberryDesc: "Süße, aromatische Erdbeeren, ausgewählt für Frische und hervorragende Präsentation.",
    seasonalAppleDesc: "Knackige, ausgewogene Äpfel in mehreren Sorten für alle Verwendungen.",
    seasonalPopupTitle: "Saisonprodukte",
    seasonalAsparagusTitleFront: "Spargel",
    seasonalAsparagusTitleBack: "Spargel",
    seasonalArtichokeTitleFront: "Artischocken",
    seasonalArtichokeTitleBack: "Artischocken",
    seasonalStrawberryTitleFront: "Erdbeeren",
    seasonalStrawberryTitleBack: "Erdbeeren",
    seasonalAppleTitleFront: "Äpfel",
    seasonalAppleTitleBack: "Äpfel",
    seasonalTriggerText: "Saisonprodukte",
    titrepageHistoire: "Geschichte",
    titreBio1: "Anfang",
    titreBio2: "Entwicklung",
    titreBio3: "Gegenwart",
    histoireText1: "Unsere Geschichte beginnt 1898 mit einem klaren Ziel: Qualitätsprodukte auf Basis anspruchsvoller Fachkompetenz. Von Anfang an entwickelten wir uns in einem Umfeld, in dem Tradition und Präzision wesentlich sind.",
    histoireText2: "Im Laufe der Jahre sind wir stetig gewachsen, indem wir uns an Marktveränderungen und neue Erwartungen angepasst haben. Gleichzeitig blieben wir unseren Werten treu und stärkten unsere Reputation durch konstant hohe Produktqualität.",
    histoireText3: "Heute sind wir ein anerkanntes Unternehmen in unserem Bereich und eine tragende Säule des MIN Rungis. Wir verbinden Tradition und Moderne und bieten passende Lösungen bei gleichbleibend hohem Qualitäts- und Professionalitätsniveau.",
    titreChiffres: "Einige Zahlen",
    titreChiffresCreation: "Gründung",
    titreChiffresExpertise: "Erfahrung",
    titreChiffresProduits: "Produkte",
    compteurExpertiseSuffix: "Jahre",

    //PAGE RAYON
    titrepageRayons: "Abteilungen",
    titreRayon1: "Obst",
    titreRayon2: "Gemüse",
    titreRayon3: "Mini-Gemüse",
    titreRayon4: "Gewürze",
    titreRayon5: "Exotische Produkte",
    titreRayon6: "Zarte Sprossen",
    titreRayon7: "Sprossen",
    titreRayon8: "Kräuter",
    cardBananasTitle: "Bananen",
    cardBananasVarieties: "Bananensorten",
    cardApplesTitle: "Äpfel",
    cardApplesVarieties: "Apfelsorten",
    cardPearsTitle: "Birnen",
    cardPearsVarieties: "Birnensorten",
    cardKiwisTitle: "Kiwis",
    cardKiwisVarieties: "Kiwisorten",
    cardMelonsTitle: "Melonen",
    cardMelonsVarieties: "Melonensorten",
    cardCitrusTitle: "Zitrusfrüchte",
    cardCitrusVarieties: "Zitrussorten",
    cardBerriesTitle: "Beeren",
    cardBerriesVarieties: "Beerensorten",
    cardGrapesTitle: "Trauben",
    cardGrapesVarieties: "Traubensorten",
    cardStoneFruitTitle: "Steinobst",
    cardStoneFruitVarieties: "Steinobstsorten",
    cardTomatoesTitle: "Tomaten",
    cardTomatoesVarieties: "Tomatensorten",
    cardRatatouilleTitle: "Ratatouille",
    cardRatatouilleMainIngredients: "Hauptzutaten",
    cardRootsBulbsTitle: "Wurzeln & Knollen",
    cardRootsBulbsVarieties: "Hauptsorten",
    cardBroccoliArtichokeTitleFront: "Brokkoli & Artischocke",
    cardBroccoliArtichokeTitleBack: "Brokkoli & Artischocke",
    cardCabbagesTitle: "Kohl",
    cardCabbagesVarieties: "Kohlsorten",
    cardSaladsTitle: "Salate",
    cardSaladsVarieties: "Salatsorten",
    cardPumpkinsTitle: "Kürbisse",
    cardPumpkinsVarieties: "Hauptsorten",
    cardOtherVegetablesTitle: "Weitere Gemüse",
    cardOtherVegetablesVarieties: "Weitere Gemüsesorten",
    cardMiniVegetablesTitle: "Mini-Gemüse",
    cardMiniVegetablesVarieties: "Mini-Gemüse-Sorten",
    cardPotatoesTitle: "Kartoffeln",
    cardPotatoesVarieties: "Kartoffelsorten",
    cardOnionsTitle: "Zwiebeln",
    cardOnionsVarieties: "Zwiebelsorten",
    cardGarlicTitle: "Knoblauch",
    cardGarlicVarieties: "Knoblauchsorten",
    cardAvocadosTitle: "Avocados",
    cardAvocadosVarieties: "Avocadosorten",
    cardMushroomsTitle: "Pilze",
    cardMushroomsVarieties: "Pilzsorten",
    cardAsparagusTitle: "Spargel",
    cardAsparagusVarieties: "Spargelsorten",
    cardMangoesTitle: "Mangos",
    cardMangoesVarieties: "Mangosorten",
    cardDragonFruitTitle: "Drachenfrucht",
    cardDragonFruitVarieties: "Drachenfrucht-Sorten",
    cardPassionFruitTitle: "Passionsfrüchte",
    cardPassionFruitVarieties: "Passionsfrucht-Sorten",
    cardEggplantsTitle: "Auberginen",
    cardEggplantsVarieties: "Auberginen-Sorten",
    cardPineapplesTitle: "Ananas",
    cardPineapplesVarieties: "Ananas-Sorten",
    cardBabyLeavesTitle: "Zarte Sprossen",
    cardBabyLeavesVarieties: "Sorten zarter Sprossen",
    cardSproutsTitle: "Sprossen",
    cardSproutsVarieties: "Sprossen-Sorten",
    cardAromaticHerbsTitle: "Aromatische Kräuter",
    cardAromaticHerbsVarieties: "Kräutersorten",
    cardEdibleFlowersTitle: "Essbare Blüten",
    cardEdibleFlowersVarieties: "Sorten essbarer Blüten",
    cardBananasItem1: "Banane",
    cardBananasItem2: "Frecinette",
    cardBananasItem3: "Grüne Banane",
    cardBananasItem4: "Bio-Banane",
    cardApplesItem1: "Pink Lady",
    cardApplesItem2: "Golden Delicious",
    cardApplesItem3: "Granny Smith",
    cardApplesItem4: "Fuji",
    cardPearsItem1: "Comice",
    cardPearsItem2: "Williams",
    cardPearsItem3: "Conference",
    cardKiwisItem1: "Grün",
    cardKiwisItem2: "Gold",
    cardKiwisItem3: "Rot",
    cardMelonsItem1: "Philibon",
    cardMelonsItem2: "Charentais",
    cardMelonsItem3: "Honigmelone",
    cardCitrusItem1: "Zitrone",
    cardCitrusItem2: "Orange",
    cardCitrusItem3: "Clementine",
    cardCitrusItem4: "Grapefruit",
    cardBerriesItem1: "Erdbeere",
    cardBerriesItem2: "Himbeere",
    cardBerriesItem3: "Heidelbeere",
    cardBerriesItem4: "Brombeere",
    cardGrapesItem1: "Schwarze Traube",
    cardGrapesItem2: "Rosa Traube",
    cardGrapesItem3: "Weiße Traube",
    cardStoneFruitItem1: "Aprikose",
    cardStoneFruitItem2: "Plattpfirsich",
    cardStoneFruitItem3: "Nektarine",
    cardStoneFruitItem4: "Pfirsich",
    cardTomatoesItem1: "Ochsenherz",
    cardTomatoesItem2: "Schwarz",
    cardTomatoesItem3: "Ananas",
    cardTomatoesItem4: "Kirsche",
    cardRatatouilleItem1: "Aubergine",
    cardRatatouilleItem2: "Paprika",
    cardRatatouilleItem3: "Zucchini",
    cardRatatouilleItem4: "Gurke",
    cardRootsBulbsItem1: "Rote Bete",
    cardRootsBulbsItem2: "Steckrübe",
    cardRootsBulbsItem3: "Karotte",
    cardRootsBulbsItem4: "Radieschen",
    cardRootsBulbsItem5: "Endivie",
    cardBroccoliArtichokeItem1: "Brokkoli",
    cardBroccoliArtichokeItem2: "Artischocke",
    cardCabbagesItem1: "Blumenkohl",
    cardCabbagesItem2: "Weißkohl",
    cardCabbagesItem3: "Rotkohl",
    cardCabbagesItem4: "Rosenkohl",
    cardCabbagesItem5: "Romanesco",
    cardSaladsItem1: "Bataviasalat",
    cardSaladsItem2: "Kopfsalat",
    cardSaladsItem3: "Rotsalat",
    cardSaladsItem4: "Eichblattsalat",
    cardSaladsItem5: "Lollo Rossa",
    cardPumpkinsItem1: "Kürbis",
    cardPumpkinsItem2: "Hokkaido-Kürbis",
    cardPumpkinsItem3: "Butternut",
    cardOtherVegetablesItem1: "Lauch",
    cardOtherVegetablesItem2: "Fenchel",
    cardOtherVegetablesItem3: "Stangensellerie",
    cardMiniVegetablesItem1: "Karotten",
    cardMiniVegetablesItem2: "Rote Beten",
    cardMiniVegetablesItem3: "Fenchel",
    cardMiniVegetablesItem4: "Lauch",
    cardPotatoesItem1: "Charlotte",
    cardPotatoesItem2: "Agata",
    cardPotatoesItem3: "Ratte",
    cardOnionsItem1: "Gelb",
    cardOnionsItem2: "Rot",
    cardOnionsItem3: "Weiß",
    cardOnionsItem4: "Schalotte",
    cardGarlicItem1: "Weiß",
    cardGarlicItem2: "Rosa",
    cardGarlicItem3: "Violett",
    cardAvocadosItem1: "Reife Avocado",
    cardAvocadosItem2: "Feste Avocado",
    cardAvocadosItem3: "Tropische Avocado",
    cardMushroomsItem1: "Champignon",
    cardMushroomsItem2: "Shiitake",
    cardMushroomsItem3: "Austernpilz",
    cardMushroomsItem4: "Morcheln",
    cardAsparagusItem1: "Weiße",
    cardAsparagusItem2: "Grüne",
    cardAsparagusItem3: "Wild",
    cardAsparagusItem4: "Violett",
    cardMangoesItem1: "Kent",
    cardMangoesItem2: "Bateau",
    cardDragonFruitItem1: "Gelbes Fruchtfleisch",
    cardDragonFruitItem2: "Rotes Fruchtfleisch",
    cardDragonFruitItem3: "Weißes Fruchtfleisch",
    cardPassionFruitItem1: "Purpur",
    cardPassionFruitItem2: "Gelb",
    cardEggplantsItem1: "Violett",
    cardEggplantsItem2: "Mini-Weiße",
    cardEggplantsItem3: "Mini-Graffiti",
    cardEggplantsItem4: "Mini-Schwarze",
    cardPineapplesItem1: "Bateau",
    cardPineapplesItem2: "Zuckerhut",
    cardPineapplesItem3: "Premium",
    cardPineapplesItem4: "Victoria",
    cardBabyLeavesItem1: "Mesclun",
    cardBabyLeavesItem2: "Rucola",
    cardBabyLeavesItem3: "Feldsalat",
    cardBabyLeavesItem4: "Gourmet-Mix",
    cardSproutsItem1: "Rote Bete",
    cardSproutsItem2: "Alfalfa",
    cardSproutsItem3: "Linsen",
    cardSproutsItem4: "Radieschen",
    cardAromaticHerbsItem1: "Lorbeer",
    cardAromaticHerbsItem2: "Thymian",
    cardAromaticHerbsItem3: "Petersilie",
    cardAromaticHerbsItem4: "Basilikum",
    cardAromaticHerbsItem5: "Dill",
    cardEdibleFlowersItem1: "Stiefmütterchen-Mix",
    cardEdibleFlowersItem2: "Alysse",
    cardEdibleFlowersItem3: "Rosa Blütenblatt",
    cardEdibleFlowersItem4: "Borretsch",
    cardMoreItems: "Und viele mehr...",
    rayonText1: "In unserer Obstabteilung bieten wir eine breite Auswahl frischer Produkte, sorgfältig nach Qualität und Frische ausgewählt. Wir wählen unser Obst mit großer Sorgfalt, um Geschmack, Reife und Vielfalt das ganze Jahr über zu garantieren.",
    rayonText2: "In unserer Gemüseabteilung bieten wir eine große Vielfalt frischer Produkte, die nach höchsten Qualitätsstandards ausgewählt werden. Wir achten auf Frische, Rückverfolgbarkeit und die Einhaltung gesundheitlicher Standards.",
    rayonText3: "In unserer Mini-Gemüse-Abteilung bieten wir originelle und raffinierte Produkte, die besonders in der gehobenen Gastronomie geschätzt werden.",
    rayonText4: "In unserer Gewürz- und Beilagenabteilung bieten wir essenzielle Produkte für die Küche. Jedes Produkt wird sorgfältig ausgewählt, um Qualität, Haltbarkeit und Vielseitigkeit sicherzustellen.",
    rayonText5: "In unserer Exotenabteilung bieten wir Produkte aus aller Welt, um neue Geschmacksrichtungen zu entdecken und Ihr Angebot zu erweitern.",
    rayonText6: "In unserer Abteilung für zarte Blattsalate bieten wir eine frische Auswahl junger, feiner Blätter. Ideal für Salate und Beilagen.",
    rayonText7: "In unserer Sprossenabteilung bieten wir frische Produkte mit hohem Nährwert und Frische. Ideal für Knackigkeit, Farbe und Originalität in Gerichten.",
    rayonText8: "In unserer Kräuterabteilung bieten wir eine frische und aromatische Auswahl. Unsere Kräuter bringen Geschmack und Authentizität in Ihre Küche.",

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
    exportKicker: "Internationaler Export",
    exportText: "Bei Cruchaudet Grandjean setzen wir auf eine effiziente Organisation, um den internationalen Versand von Obst und Gemüse sicherzustellen. Dank unseres Standorts in Rungis und unserer Großhandelserfahrung liefern wir weltweit mit garantierter Frische und Termintreue.",
    exportPoint1: "Rückverfolgbarkeit",
    exportPoint2: "Kontrollierte Fristen",
    exportPoint3: "Professionelle Begleitung",
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
    temoignageText1: "Sehr zufrieden mit der Qualität der Produkte von Cruchaudet Grandjean. Obst und Gemüse sind immer frisch und gut ausgewählt. Der Service ist reaktionsschnell. Ein vertrauenswürdiger Partner.",
    temoignageText2: "Seriöses Unternehmen mit großer Produktauswahl, besonders bei exotischem Obst. Die Qualität ist konstant und die Auftragsverfolgung einwandfrei.",
    temoignageText3: "Ausgezeichnete Erfahrung mit Cruchaudet Grandjean. Die Teams hören zu und passen sich spezifischen Bedürfnissen an. Die Logistik ist effizient und die Produkte kommen in perfektem Zustand an.",
    temoignageAuthor1: "Thibault - Restaurantkoch",
    temoignageAuthor2: "Bernard - Händler",
    temoignageAuthor3: "Elodie - Gastronomin",

    //PAGE ENGAGEMENT
  titrepageEngagement: "Unsere Verpflichtungen",
    engagementIntro: "Bei Cruchaudet sind unsere Verpflichtungen keine leeren Versprechen. Sie prägen jeden Auftrag, von der Produktauswahl bis zum Versand ab Rungis. Wir begleiten Fachkunden mit einem klaren Anspruch: zuverlässiges, frisches Obst und Gemüse, das den Erwartungen entspricht, mit sorgfältiger Betreuung und schneller Reaktion.",
  titreEngagements1: "Auswahl & Qualität",
  titreEngagements2: "Service & Reaktionsfähigkeit",
    engagementText1: "Jedes Produkt wird sorgfältig nach Frische, Haltbarkeit, Konstanz und Herkunft ausgewählt. Wir arbeiten mit anerkannten Erzeugern und Partnern in Frankreich und international zusammen, um ein Angebot bereitzustellen, das auf die Anforderungen von Großhändlern, Einzelhändlern und Gastronomen zugeschnitten ist. Unsere Präsenz in Rungis ermöglicht eine reaktionsschnelle Beschaffung, kontrollierte Rückverfolgbarkeit und eine gleichbleibend hohe Qualität das ganze Jahr über.",
    engagementText2: "Wir wissen, dass Ihre Anforderungen operativ sind: enge Fristen, spezifische Bedürfnisse, schwankende Mengen und marktbezogene Erwartungen. Deshalb setzen wir auf direkte Betreuung, schnelle Antworten und eine zuverlässige Logistik. Von der Auftragsvorbereitung bis zu Import-Export-Abläufen tun wir alles, um Ihre Versorgung zu sichern und eine langfristige Beziehung aufzubauen, die auf Vertrauen, Klarheit und Beständigkeit beruht.",

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
    if (!t) return;

    const placeholders = {
      exportNom: t.nom,
      exportPrenom: t.prenom,
      exportEmail: t.email,
      exportTelephone: t.telephone,
      exportObjet: t.objet,
      exportMessage: t.message,
    };

    Object.entries(placeholders).forEach(([id, text]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.placeholder = text || "";
    });
  }

  function initExportContactForm() {
    const form = document.getElementById("contactExportForm");
    if (!form || form.dataset.initialized === "1") return;

    form.dataset.initialized = "1";

    const fields = {
      nom: document.getElementById("exportNom"),
      prenom: document.getElementById("exportPrenom"),
      email: document.getElementById("exportEmail"),
      telephone: document.getElementById("exportTelephone"),
      objet: document.getElementById("exportObjet"),
      message: document.getElementById("exportMessage"),
    };

    const formMsg = document.getElementById("formMsg");
    const formEndpoint = form.getAttribute("action") || "";
    const errorEls = Array.from(form.querySelectorAll(".error-msg"));
    const fieldContainers = new Map(
      Object.entries(fields)
        .filter(([, field]) => field)
        .map(([key, field]) => [key, field.closest(".form-field")])
    );

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,30}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^[+0-9\s().\-/]{4,30}$/;
    const htmlTagRegex = /<[^>]+>/;
    const scriptRegex = /<\s*script\b/i;

    const getMarkupErrorKey = (value) => {
      if (!value) return "";
      if (scriptRegex.test(value)) return "noScript";
      if (htmlTagRegex.test(value) || value.includes("<") || value.includes(">")) return "noTags";
      return "";
    };

    const blockMarkupInsertion = (fieldName, incomingText) => {
      const field = fields[fieldName];
      if (!field) return false;

      const markupErrorKey = getMarkupErrorKey(incomingText);
      if (!markupErrorKey) return false;

      setFieldError(fieldName, markupErrorKey);
      clearFormStatus();
      return true;
    };

    const setFieldError = (fieldName, errorKey = "") => {
      const errorEl = form.querySelector(`.error-msg[data-field="${fieldName}"]`);
      const container = fieldContainers.get(fieldName);
      const field = fields[fieldName];
      const hasValue = Boolean(field && field.value.trim());

      if (container) {
        container.classList.toggle("has-error", Boolean(errorKey));
        container.classList.toggle("has-valid", !errorKey && hasValue);
      }

      if (!errorEl) return;
      errorEl.dataset.key = errorKey;
      errorEl.textContent = errorKey
        ? (translations[currentLang]?.formErrors?.[errorKey] || "")
        : "";
    };

    const clearFormStatus = () => {
      if (!formMsg) return;
      formMsg.textContent = "";
      formMsg.dataset.key = "";
      formMsg.classList.remove("is-error", "is-success");
    };

    const setFormStatus = (errorKey, mode) => {
      if (!formMsg) return;
      formMsg.dataset.key = errorKey;
      formMsg.textContent = translations[currentLang]?.formErrors?.[errorKey] || "";
      formMsg.classList.remove("is-error", "is-success");
      if (mode) formMsg.classList.add(mode);
    };

    const validateField = (fieldName) => {
      const field = fields[fieldName];
      if (!field) return true;

      const value = field.value.trim();

      const markupErrorKey = getMarkupErrorKey(value);
      if (markupErrorKey) {
        setFieldError(fieldName, markupErrorKey);
        return false;
      }

      if (fieldName === "nom" || fieldName === "prenom") {
        const errorKey = nameRegex.test(value) ? "" : fieldName;
        setFieldError(fieldName, errorKey);
        return !errorKey;
      }

      if (fieldName === "email") {
        const errorKey = emailRegex.test(value) ? "" : "email";
        setFieldError(fieldName, errorKey);
        return !errorKey;
      }

      if (fieldName === "telephone") {
        const normalized = value.replace(/[^0-9+]/g, "");
        const hasSingleLeadingPlus = normalized.indexOf("+") <= 0 && (normalized.match(/\+/g) || []).length <= 1;
        const digitCount = normalized.replace(/\+/g, "").length;
        const errorKey = phoneRegex.test(value) && hasSingleLeadingPlus && digitCount >= 4 && digitCount <= 15
          ? ""
          : "telephone";
        setFieldError(fieldName, errorKey);
        return !errorKey;
      }

      if (fieldName === "objet") {
        let errorKey = "";
        if (value.length < 2) errorKey = "objet";
        setFieldError(fieldName, errorKey);
        return !errorKey;
      }

      if (fieldName === "message") {
        let errorKey = "";
        if (!value) errorKey = "messageVide";
        else if (value.length < 20) errorKey = "messageCourt";
        setFieldError(fieldName, errorKey);
        return !errorKey;
      }

      return true;
    };

    Object.entries(fields).forEach(([fieldName, field]) => {
      if (!field) return;
      field.addEventListener("beforeinput", (event) => {
        const insertedText = event.data || "";
        if (!insertedText) return;
        if (blockMarkupInsertion(fieldName, insertedText)) {
          event.preventDefault();
        }
      });
      field.addEventListener("paste", (event) => {
        const pastedText = event.clipboardData?.getData("text") || "";
        if (blockMarkupInsertion(fieldName, pastedText)) {
          event.preventDefault();
        }
      });
      field.addEventListener("input", () => {
        validateField(fieldName);
        clearFormStatus();
      });
      field.addEventListener("blur", () => {
        validateField(fieldName);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const hasErrors = Object.keys(fields)
        .map((fieldName) => validateField(fieldName))
        .some((isValid) => !isValid);

      if (hasErrors) {
        setFormStatus("errorSend", "is-error");
        return;
      }

      const payload = {
        nom: fields.nom.value.trim(),
        prenom: fields.prenom.value.trim(),
        email: fields.email.value.trim(),
        telephone: fields.telephone.value.trim(),
        objet: fields.objet.value.trim(),
        message: fields.message.value.trim(),
      };

      const submitBtn = form.querySelector("button[type='submit']");
      if (submitBtn) submitBtn.disabled = true;

      try {
        if (!formEndpoint || formEndpoint.includes("REPLACE_WITH_YOUR_FORMSPREE_ID")) {
          throw new Error("errorSend");
        }

        const response = await fetch(formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...payload,
            _subject: `Export - ${payload.objet}`,
          }),
        });

        const result = await response.json().catch(() => ({}));
        const hasFormspreeErrors = Array.isArray(result.errors) && result.errors.length > 0;
        const isSuccess = response.ok && !hasFormspreeErrors && result.error !== "true";
        if (!isSuccess) {
          throw new Error(result.errorKey || "errorSend");
        }

        setFormStatus("success", "is-success");
        form.reset();
        errorEls.forEach((errorEl) => {
          errorEl.textContent = "";
          errorEl.dataset.key = "";
        });
        fieldContainers.forEach((container) => {
          if (container) container.classList.remove("has-error", "has-valid");
        });
      } catch (error) {
        const key = error && error.message && translations[currentLang]?.formErrors?.[error.message]
          ? error.message
          : "errorSend";
        setFormStatus(key, "is-error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
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

    const moreItemsText = tObj.cardMoreItems || "";
    document.querySelectorAll('#rayons-section em[id$="MoreItems"]').forEach((el) => {
      el.textContent = moreItemsText || el.textContent;
    });

    document.querySelectorAll("#rayons-section .carte-back ul li[id]").forEach((li) => {
      const baseText = (li.dataset.baseText || li.textContent || "").trim();
      if (!li.dataset.baseText) li.dataset.baseText = baseText;
      li.textContent = tObj[li.id] || baseText;
    });

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
    const key = formMsg.dataset.key;
    const formTexts = translations[currentLang].formErrors || {};
    if (key && formTexts[key]) formMsg.textContent = formTexts[key];
    }

    refreshCompletedCounters();
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

