(() => {
  "use strict";

  /* Padova public page should keep working even if the shared database's
     public grants are temporarily incomplete. Block only the optional
     Supabase integration script on this page; local demo data stays active. */
  const originalAppendChild = document.head.appendChild.bind(document.head);
  document.head.appendChild = function(node) {
    const src = node && node.tagName === "SCRIPT" ? String(node.src || "") : "";
    if (src.includes("assets/js/supabase-integration.js")) return node;
    return originalAppendChild(node);
  };

  const applyHero = () => {
    const hero = document.querySelector(".city-hero-bg");
    if (!hero) return;
    hero.style.setProperty("background-image", "url('/assets/img/citta-padova.webp')", "important");
    hero.style.setProperty("background-size", "cover", "important");
    hero.style.setProperty("background-position", "center", "important");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyHero, { once: true });
  } else {
    applyHero();
  }

  /* Re-apply after the main app initializes, because it also selects a hero. */
  setTimeout(applyHero, 0);
  setTimeout(applyHero, 250);
})();
