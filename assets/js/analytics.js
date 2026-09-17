(function(){
  if(window.__CASASTUDENT_ANALYTICS_LOADED__) return;
  window.__CASASTUDENT_ANALYTICS_LOADED__=true;
  const cfg=window.STUDENTBNB_CONFIG||{};
  if(!cfg.supabaseUrl||!cfg.supabasePublishableKey) return;
  const pathname=location.pathname||'/';
  const path=(pathname==='/'?'index.html':pathname.replace(/^\/+|\/+$/g,'')||'index.html').toLowerCase();
  if(path==='stats.html') return;

  const uuid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`;
  const visitorKey='casastudent:analytics:visitor:v1';
  const sessionKey='casastudent:analytics:session:v1';
  let visitorId='';
  let sessionId='';
  try{visitorId=localStorage.getItem(visitorKey)||uuid();localStorage.setItem(visitorKey,visitorId);}catch(_){visitorId=uuid();}
  try{sessionId=sessionStorage.getItem(sessionKey)||uuid();sessionStorage.setItem(sessionKey,sessionId);}catch(_){sessionId=uuid();}

  function referrerHost(){try{return document.referrer?new URL(document.referrer).hostname:null;}catch(_){return null;}}
  function send(eventName,properties={}){
    const body={event_name:eventName,path,anonymous_session_id:sessionId,visitor_id:visitorId,country_code:cfg.countryCode||'IT',referrer_host:referrerHost(),properties};
    fetch(`${cfg.supabaseUrl}/rest/v1/analytics_events`,{
      method:'POST',
      headers:{apikey:cfg.supabasePublishableKey,Authorization:`Bearer ${cfg.supabasePublishableKey}`,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify(body),
      keepalive:true
    }).catch(()=>{});
  }

  send('page_view',{title:document.title||'',screen:`${screen.width}x${screen.height}`});
  addEventListener('click',e=>{
    const a=e.target.closest&&e.target.closest('a[href]');
    const b=e.target.closest&&e.target.closest('button');
    const target=a||b;
    if(!target) return;
    const label=(target.textContent||target.getAttribute('aria-label')||'').trim().slice(0,120);
    if(a){
      const href=a.getAttribute('href')||'';
      if(a.classList.contains('header-cta')||a.classList.contains('btn')||a.classList.contains('publish-choice')) send('cta_click',{label,href:href.slice(0,300)});
      if(/^https?:/i.test(href)&&!href.includes(location.hostname)) send('outbound_click',{label,href:href.slice(0,300)});
      else if(href&&!href.startsWith('#')&&!href.startsWith('mailto:')&&!href.startsWith('tel:')) send('internal_click',{label,href:href.slice(0,300)});
    }else if(b&&b.classList.contains('btn')) send('cta_click',{label});
  },{passive:true});
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
  function rewriteLinks(root=document){root.querySelectorAll?.('a[href]').forEach(a=>{const next=cleanCityUrl(a.getAttribute('href'));if(next&&a.getAttribute('href')!==next)a.setAttribute('href',next);});}
  document.addEventListener('submit',event=>{
    const form=event.target;
    if(!(form instanceof HTMLFormElement)||form.id!=='home-search') return;
    const fd=new FormData(form);
    const city=String(fd.get('city')||'').toLowerCase();
    if(!cleanCities.has(city)) return;
    event.preventDefault();event.stopImmediatePropagation();
    const url=new URL(`/${encodeURIComponent(city)}/`,location.origin);
    const type=String(fd.get('type')||'');if(type)url.searchParams.set('type',type);
    location.assign(url.pathname+url.search);
  },true);
  const run=()=>rewriteLinks(document);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
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

/* Supabase is the only valid authentication source in production. */
(function(){
  const cfg=window.STUDENTBNB_CONFIG||{};
  if(cfg.apiMode!=='supabase') return;
  function enforceSupabaseAuth(){
    const legacy=document.getElementById('login-form');
    if(!legacy||legacy.dataset.supabaseAuthOnly==='true') return;
    const clean=legacy.cloneNode(true);clean.dataset.supabaseAuthOnly='true';legacy.replaceWith(clean);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',enforceSupabaseAuth,{once:true});else enforceSupabaseAuth();
})();