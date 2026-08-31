(() => {
  "use strict";
  const script = document.currentScript;
  const slug = script?.dataset?.cityRoute;
  if (!slug) return;

  const cleanUrl = new URL(location.href);
  cleanUrl.searchParams.delete("city");
  const runtimeUrl = new URL(location.href);
  if (!runtimeUrl.searchParams.get("city")) runtimeUrl.searchParams.set("city", slug);

  if (runtimeUrl.href !== location.href) history.replaceState(history.state, "", runtimeUrl.href);

  const restoreCleanUrl = () => {
    history.replaceState(history.state, "", cleanUrl.href);
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
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(restoreCleanUrl, 0), { once: true });
  } else {
    setTimeout(restoreCleanUrl, 0);
  }
})();
