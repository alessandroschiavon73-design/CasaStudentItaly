(() => {
  "use strict";
  const script = document.currentScript;
  const slug = script?.dataset?.cityRoute;
  if (!slug) return;

  const originalTitle = document.title;
  const originalDescription = document.head.querySelector('meta[name="description"]')?.content || "";
  const cleanUrl = new URL(location.href);
  cleanUrl.searchParams.delete("city");
  const runtimeUrl = new URL(location.href);

  /* The route path is authoritative. Never allow ?city= to make /bologna/
     render Milano (or any other mismatched city). */
  runtimeUrl.searchParams.set("city", slug);

  if (runtimeUrl.href !== location.href) history.replaceState(history.state, "", runtimeUrl.href);

  const wikiTitles = {
    "cosenza-rende": "Cosenza",
    "salerno-fisciano": "Salerno",
    "reggio-emilia": "Reggio Emilia"
  };

  const cityTitle = wikiTitles[slug] || slug
    .split("-")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  const applyCityPhoto = async () => {
    const hero = document.querySelector(".city-hero");
    const bg = hero?.querySelector(".city-hero-bg");
    if (!bg) return;

    try {
      const cacheKey = `casastudent-city-photo:${slug}:v2`;
      let photoUrl = sessionStorage.getItem(cacheKey);

      if (!photoUrl) {
        const endpoint = `https://it.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityTitle)}`;
        const response = await fetch(endpoint, { mode: "cors", credentials: "omit" });
        if (!response.ok) throw new Error(`Wikipedia ${response.status}`);
        const data = await response.json();
        photoUrl = data?.originalimage?.source || data?.thumbnail?.source || "";
        if (photoUrl) sessionStorage.setItem(cacheKey, photoUrl);
      }

      if (photoUrl) {
        bg.style.backgroundImage = `url("${photoUrl}")`;
        bg.classList.add("city-photo-loaded");
      }
    } catch (_) {
      /* Keep the local image as a safe fallback when the remote source is unavailable. */
    }
  };

  const restoreCleanUrl = () => {
    history.replaceState(history.state, "", cleanUrl.href);
    document.title = originalTitle;
    const description = document.head.querySelector('meta[name="description"]');
    if (description && originalDescription) description.content = originalDescription;

    const canonical = `https://casastudent.it/${encodeURIComponent(slug)}/`;
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;

    const og = document.head.querySelector('meta[property="og:url"]');
    if (og) og.content = canonical;
    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = originalTitle;
    const ogDescription = document.head.querySelector('meta[property="og:description"]');
    if (ogDescription && originalDescription) ogDescription.content = originalDescription;
    const twitterTitle = document.head.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.content = originalTitle;
    const twitterDescription = document.head.querySelector('meta[name="twitter:description"]');
    if (twitterDescription && originalDescription) twitterDescription.content = originalDescription;

    /* Until equivalent city pages exist on every country domain, homepage
       hreflang links would be misleading on a city URL. */
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach(item => item.remove());
  };

  const init = () => {
    applyCityPhoto();
    setTimeout(restoreCleanUrl, 0);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
