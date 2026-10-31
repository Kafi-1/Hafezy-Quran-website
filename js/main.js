(function () {
  const C = window.HAFEZY_CONFIG || {};
  const D = C.developer || {};
  const nav = [
    ["index.html", "navHome"],
    ["features.html", "navFeatures"],
    ["download.html", "navDownload"],
    ["screenshots.html", "navScreenshots"],
    ["about.html", "navAbout"],
    ["developer.html", "navDeveloper"],
    ["help.html", "navHelp"],
    ["contact.html", "navContact"]
  ];
  const current = location.pathname.split("/").pop() || "index.html";

  function t(k) {
    const lang = localStorage.getItem("hq-language") === "bn" ? "bn" : "en";
    return (window.HQ_TRANSLATIONS && window.HQ_TRANSLATIONS[lang] || {})[k] || k;
  }

  function renderShell() {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    if (header) {
      header.innerHTML = `<header class="site-header">
        <a class="brand" href="index.html" aria-label="Hafezy Quran home">
          <img class="brand-logo" src="assets/logo/hafezy-quran-logo-112.webp" alt="" width="44" height="44">
          <span><strong>Hafezy Quran</strong><small>READ · REFLECT · RECITE</small></span>
        </a>
        <button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu"><span></span><span></span><span></span></button>
        <nav id="primary-nav" class="primary-nav" aria-label="Main navigation">
          ${nav.map(([url, key]) => `<a href="${url}" ${current === url ? 'aria-current="page"' : ""} data-i18n="${key}">${t(key)}</a>`).join("")}
          <div class="header-tools">
            <button id="language-toggle" class="utility-button" type="button" aria-label="Change language">বাংলা</button>
            <button id="theme-toggle" class="utility-button theme-button" type="button" aria-label="Toggle light and dark theme"><span id="theme-symbol">☾</span></button>
          </div>
        </nav>
      </header>`;
    }
    if (footer) {
      const devName = D.name || "Md Abdullah Al Kafi";
      const devWeb = D.website || "https://kafi.dev.bd";
      footer.innerHTML = `<footer class="site-footer">
        <div class="footer-main">
          <div class="footer-brand">
            <a class="brand" href="index.html">
              <img class="brand-logo" src="assets/logo/hafezy-quran-logo-112.webp" alt="" width="44" height="44">
              <span><strong>Hafezy Quran</strong><small>READ · REFLECT · RECITE</small></span>
            </a>
            <p data-i18n="footerDesc">${t("footerDesc")}</p>
          </div>
          <div>
            <h2 data-i18n="footerExplore">${t("footerExplore")}</h2>
            <div class="footer-links">${nav.slice(0, 6).map(([url, key]) => `<a href="${url}" data-i18n="${key}">${t(key)}</a>`).join("")}</div>
          </div>
          <div>
            <h2 data-i18n="footerSupport">${t("footerSupport")}</h2>
            <a href="mailto:${C.supportEmail || "support@hafezyquran.xyz"}">${C.supportEmail || "support@hafezyquran.xyz"}</a>
            <a href="privacy.html" data-i18n="privacyLink">${t("privacyLink")}</a>
            <a href="terms.html" data-i18n="termsLink">${t("termsLink")}</a>
            <a href="developer.html" data-i18n="navDeveloper">${t("navDeveloper")}</a>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-copy">
            <span>© 2026–2027 Hafezy Quran</span>
            <span class="footer-strict">© &amp; Strict to developer — <a href="developer.html">${devName}</a> · <a href="${devWeb}" target="_blank" rel="noopener noreferrer">kafi.dev.bd</a></span>
          </div>
          <span data-i18n="footerNote">${t("footerNote")}</span>
        </div>
      </footer>`;
    }
  }

  function applyTranslations(lang) {
    const dict = window.HQ_TRANSLATIONS && window.HQ_TRANSLATIONS[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = dict[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    const toggle = document.getElementById("language-toggle");
    if (toggle) toggle.textContent = lang === "en" ? "বাংলা" : "English";
    document.querySelectorAll("a[aria-disabled='true']").forEach((a) => a.setAttribute("tabindex", "-1"));
  }

  function setTheme() {
    const dark = document.documentElement.dataset.theme === "dark";
    const b = document.getElementById("theme-symbol");
    if (b) b.textContent = dark ? "☀" : "☾";
    const tgl = document.getElementById("theme-toggle");
    if (tgl) tgl.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }

  function setupScrollAnimations() {
    const nodes = Array.from(document.querySelectorAll(
      ".section-heading, .intro-grid > *, .panel-copy, .quote-card, .gallery-preview > div:first-child, .shot, .faq-teaser > *, .final-cta > *, " +
      ".feature-card, .contact-card, .download-card, .instruction-card, .gallery-item, .faq-list details, .dev-card, .note-panel, .changelog, " +
      ".fact-card, .prose-layout article, .contact-form-card, .empty-state"
    ));
    // Stagger siblings that sit in the same row/grid
    const groups = new Map();
    nodes.forEach((el) => {
      el.classList.add("reveal");
      const key = el.parentElement;
      const n = groups.get(key) || 0;
      el.style.setProperty("--d", Math.min(n, 6) * 0.08 + "s");
      groups.set(key, n + 1);
    });
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    nodes.forEach((el) => io.observe(el));
    window.__hqObserve = (el) => { el.classList.add("reveal"); io.observe(el); };
  }

  function setupChrome() {
    const header = document.querySelector(".site-header");
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    const up = document.createElement("button");
    up.className = "to-top";
    up.type = "button";
    up.setAttribute("aria-label", "Back to top");
    up.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    up.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    document.body.appendChild(up);
    let ticking = false;
    function update() {
      const y = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      if (header) header.classList.toggle("is-scrolled", y > 24);
      up.classList.toggle("is-shown", y > 600);
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function setup() {
    renderShell();
    let lang = "en";
    try {
      lang = localStorage.getItem("hq-language") || "en";
    } catch (e) {}
    applyTranslations(lang);
    setTheme();

    const mt = document.getElementById("menu-toggle");
    const navEl = document.getElementById("primary-nav");
    if (mt && navEl) {
      mt.addEventListener("click", () => {
        const open = mt.getAttribute("aria-expanded") !== "true";
        mt.setAttribute("aria-expanded", String(open));
        navEl.classList.toggle("is-open", open);
        document.body.classList.toggle("nav-open", open);
      });
      navEl.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          mt.setAttribute("aria-expanded", "false");
          navEl.classList.remove("is-open");
          document.body.classList.remove("nav-open");
        });
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mt && mt.getAttribute("aria-expanded") === "true") {
        mt.click();
        mt.focus();
      }
    });

    const lb = document.getElementById("language-toggle");
    if (lb) {
      lb.addEventListener("click", () => {
        lang = document.documentElement.lang === "en" ? "bn" : "en";
        try {
          localStorage.setItem("hq-language", lang);
        } catch (e) {}
        applyTranslations(lang);
      });
    }

    const tb = document.getElementById("theme-toggle");
    if (tb) {
      tb.addEventListener("click", () => {
        const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = theme;
        try {
          localStorage.setItem("hq-theme", theme);
        } catch (e) {}
        const mc = document.querySelector('meta[name="theme-color"]');
        if (mc) mc.setAttribute("content", theme === "dark" ? "#0b2922" : "#123e32");
        setTheme();
        tb.classList.remove("is-spinning");
        void tb.offsetWidth;
        tb.classList.add("is-spinning");
      });
    }

    const version = document.getElementById("app-version");
    if (version) version.textContent = C.version || "1.0.0";

    const preview = document.querySelector(".screenshot-empty");
    const shots = Array.isArray(C.screenshots) ? C.screenshots : [];
    if (preview && shots.length) {
      const strip = document.createElement("div");
      strip.className = "shot-strip";
      strip.setAttribute("role", "list");
      shots.forEach((item) => {
        const fig = document.createElement("figure");
        fig.className = "shot reveal";
        fig.setAttribute("role", "listitem");
        const a = document.createElement("a");
        a.href = "screenshots.html";
        a.setAttribute("aria-label", item.caption || item.alt || "Hafezy Quran screenshot");
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt || "Hafezy Quran app screenshot";
        img.loading = "lazy";
        img.decoding = "async";
        a.appendChild(img);
        const cap = document.createElement("figcaption");
        cap.textContent = item.caption || item.alt || "";
        fig.append(a, cap);
        strip.appendChild(fig);
      });
      preview.replaceWith(strip);
    }

    [["play-download", C.googlePlayUrl], ["apk-download", C.apkDownloadUrl]].forEach(([id, url]) => {
      const a = document.getElementById(id);
      if (!a) return;
      if (url) {
        a.href = url;
        a.removeAttribute("aria-disabled");
        a.removeAttribute("tabindex");
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.addEventListener("click", () => {
          const status = document.getElementById("download-status");
          if (status) status.textContent = t("downloadLeaving");
        });
      } else {
        a.href = "#";
        a.setAttribute("aria-disabled", "true");
        a.setAttribute("tabindex", "-1");
        a.addEventListener("click", (e) => e.preventDefault());
      }
    });

    setupScrollAnimations();
    setupChrome();
  }

  document.addEventListener("DOMContentLoaded", setup);
})();
