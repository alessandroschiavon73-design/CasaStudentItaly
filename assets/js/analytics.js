(function(){
  if(window.__STUDENTBNB_ANALYTICS_LOADED__) return;
  window.__STUDENTBNB_ANALYTICS_LOADED__=true;
  const cfg=window.STUDENTBNB_CONFIG||{};
  const code=cfg.countryCode||'IT';
  const key=`studentbnb:stats:${code}:v1`;
  const sessionKey=`studentbnb:session:${code}:v1`;
  const pathname=location.pathname||'/';
  const path=(pathname==='/'?'index.html':pathname.replace(/^\/+|\/+$/g,'')||'index.html').toLowerCase();
  const empty=()=>({version:1,country:code,pageViews:0,sessions:0,ctaClicks:0,internalClicks:0,outboundClicks:0,pages:{},firstSeen:null,lastSeen:null});
  function read(){try{return {...empty(),...(JSON.parse(localStorage.getItem(key)||'{}'))};}catch(_){return empty();}}
  function write(s){try{localStorage.setItem(key,JSON.stringify(s));}catch(_){}}
  function update(fn){const s=read();fn(s);s.lastSeen=new Date().toISOString();if(!s.firstSeen)s.firstSeen=s.lastSeen;write(s);window.StudentBnBStats=s;return s;}
  if(path!=='stats.html'){
    update(s=>{s.pageViews++;s.pages[path]=(s.pages[path]||0)+1;if(!sessionStorage.getItem(sessionKey)){s.sessions++;try{sessionStorage.setItem(sessionKey,'1')}catch(_){}}});
    addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a)return;update(s=>{const href=a.getAttribute('href')||'';if(a.classList.contains('header-cta')||a.classList.contains('btn')||a.classList.contains('publish-choice'))s.ctaClicks++;if(/^https?:/i.test(href)&&!href.includes(location.hostname))s.outboundClicks++;else if(href&&!href.startsWith('#')&&!href.startsWith('mailto:')&&!href.startsWith('tel:'))s.internalClicks++;});},{passive:true});
  }else window.StudentBnBStats=read();
})();

/* Clean city routing for all Italian CasaStudent cities. */
(function(){
  if(window.__CASASTUDENT_SEO_ROUTES__) return;
  window.__CASASTUDENT_SEO_ROUTES__=true;
  const cleanCities=new Set(['padova','ancona','bari','bergamo','bologna','cagliari','caserta','catania','chieti','cosenza-rende','ferrara','firenze','genova','messina','milano','modena','napoli','palermo','parma','pavia','perugia','pescara','pisa','reggio-emilia','roma','salerno-fisciano','torino','trento','trieste','venezia','verona']);

  function cleanCityUrl(href){
    try{
      const url=new URL(href,location.href);
      if(url.origin!==location.origin) return null;
      if(!/(?:^|\/)padova\.html$/i.test(url.pathname)) return null;
      const city=(url.searchParams.get('city')||'').toLowerCase();
      if(!cleanCities.has(city)) return null;
      url.searchParams.delete('city');
      const query=url.searchParams.toString();
      return `/${encodeURIComponent(city)}/${query?`?${query}`:''}${url.hash||''}`;
    }catch(_){return null;}
  }

  function rewriteLinks(root=document){
    root.querySelectorAll?.('a[href]').forEach(a=>{
      const next=cleanCityUrl(a.getAttribute('href'));
      if(next&&a.getAttribute('href')!==next) a.setAttribute('href',next);
    });
  }

  document.addEventListener('submit',event=>{
    const form=event.target;
    if(!(form instanceof HTMLFormElement)||form.id!=='home-search') return;
    const fd=new FormData(form);
    const city=String(fd.get('city')||'').toLowerCase();
    if(!cleanCities.has(city)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const url=new URL(`/${encodeURIComponent(city)}/`,location.origin);
    const type=String(fd.get('type')||'');
    if(type) url.searchParams.set('type',type);
    location.assign(url.pathname+url.search);
  },true);

  const run=()=>rewriteLinks(document);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
  new MutationObserver(records=>{for(const record of records){if(record.type==='childList')record.addedNodes.forEach(node=>{if(node.nodeType===1)rewriteLinks(node)});}}).observe(document.documentElement,{subtree:true,childList:true});
})();

/* Load visual normalizer and remove legacy visible branding. */
(function(){if(document.querySelector('script[data-city-visuals]'))return;const s=document.createElement('script');s.src='assets/js/city-visuals.js?v=20260905-no-yellow';s.defer=true;s.dataset.cityVisuals='1';document.head.appendChild(s)})();
(function(){
  function run(){
    document.querySelectorAll('.brand').forEach(brand=>{const labels=[...brand.children].filter(el=>el.tagName==='SPAN'&&!el.classList.contains('brand-icon'));const label=labels[labels.length-1];if(!label)return;const small=label.querySelector('small');label.innerHTML=`Casa<strong>Student</strong>${small?small.outerHTML:'<small>Base & Belong</small>'}`;});
    document.querySelectorAll('.brand small').forEach(el=>{el.textContent='Base & Belong';el.style.fontStyle='italic'});
    document.querySelectorAll('.site-footer .footer-links a').forEach(a=>{const t=(a.textContent||'').trim().toLowerCase();if(['faq','domande frequenti','contatti','contact','kontakt'].includes(t))a.remove();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
  setTimeout(run,300);
})();