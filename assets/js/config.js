window.STUDENTBNB_CONFIG = Object.freeze({
  appName: "StudentBnB",
  brandLine: "Base & Belong",
  countryCode: "IT",
  countryName: "Italia",
  locale: "it-IT",
  currency: "EUR",
  domain: "studentbnb.it",
  defaultCity: "padova",
  cityPage: "padova.html",
  reportEmail: "segnalazioni@studentbnb.it",
  apiMode: "demo",
  apiBase: "/api/v1",
  unifiedDatabase: true,
  schemaVersion: "1.2"
});

(function () {
  const cfg = window.STUDENTBNB_CONFIG;
  const sites = [
    ["IT","Italia","🇮🇹","https://studentbnb.it/"],["ES","España","🇪🇸","https://studentbnb.es/"],["PT","Portugal","🇵🇹","https://studentbnb.pt/"],["FR","France","🇫🇷","https://studentbnb.fr/"],["DE","Deutschland","🇩🇪","https://student-bnb.de/"],["PL","Polska","🇵🇱","https://studentbnb.pl/"]
  ];
  function upsertMeta(key,value,content){let el=document.head.querySelector(`meta[${key}="${value}"]`);if(!el){el=document.createElement("meta");el.setAttribute(key,value);document.head.appendChild(el)}el.setAttribute("content",content)}
  function upsertLink(rel,href,hreflang){let sel=`link[rel="${rel}"]${hreflang?`[hreflang="${hreflang}"]`:""}`;let el=document.head.querySelector(sel);if(!el){el=document.createElement("link");el.rel=rel;if(hreflang)el.hreflang=hreflang;document.head.appendChild(el)}el.href=href}
  function apply(){document.querySelectorAll(".brand small").forEach(el=>{el.textContent="Base & Belong";el.style.fontStyle="italic"});const path=location.pathname.endsWith("/")?"":location.pathname.split("/").pop();const canonical=`https://${cfg.domain}/${path||""}`;upsertLink("canonical",canonical);upsertMeta("name","robots","index,follow,max-image-preview:large");upsertMeta("property","og:site_name","StudentBnB — Base & Belong");upsertMeta("property","og:title",document.title);const desc=document.head.querySelector('meta[name="description"]')?.content||"Student housing for European university mobility.";upsertMeta("property","og:description",desc);upsertMeta("property","og:url",canonical);upsertMeta("name","twitter:card","summary_large_image");if(!path||path==="index.html"){sites.forEach(([code,,,url])=>upsertLink("alternate",url,code.toLowerCase()));upsertLink("alternate","https://studentbnb.eu/","x-default")}const box=document.querySelector(".footer-international .footer-country-links");if(box)box.innerHTML=sites.map(([code,label,flag,url])=>`<a href="${url}"${code===cfg.countryCode?' aria-current="page"':' target="_blank" rel="noopener"'}><span aria-hidden="true">${flag}</span> ${label}</a>`).join("")+'<a href="https://studentbnb.eu/" target="_blank" rel="noopener">🇪🇺 Europa</a>';const intl=document.querySelector(".footer-international");if(intl&&!intl.querySelector(".europe-contact")){const p=document.createElement("p");p.className="europe-contact";p.innerHTML='<a href="mailto:contact@studentbnb.eu">contact@studentbnb.eu</a> · <em>Base & Belong</em>';intl.appendChild(p)}}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",apply);else apply();
})();
(function(){if(document.querySelector('script[data-studentbnb-analytics]'))return;const s=document.createElement('script');s.src='assets/js/analytics.js?v=20260824';s.defer=true;s.dataset.studentbnbAnalytics='1';document.head.appendChild(s)})();
