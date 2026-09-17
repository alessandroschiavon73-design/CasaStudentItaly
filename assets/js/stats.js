(async function(){
  'use strict';
  const cfg=window.STUDENTBNB_CONFIG||{};
  const owner='alessandroschiavon73@gmail.com';
  const authPanel=document.getElementById('auth-panel');
  const dashboard=document.getElementById('dashboard');
  const msg=document.getElementById('auth-message');
  if(!window.supabase||!cfg.supabaseUrl||!cfg.supabasePublishableKey){
    authPanel?.classList.remove('hidden');
    if(msg) msg.textContent='Configurazione Supabase non disponibile.';
    return;
  }

  const client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabasePublishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=String(value)};
  const start30=new Date(Date.now()-30*24*60*60*1000);
  const startToday=new Date();startToday.setHours(0,0,0,0);

  async function load(){
    const {data:sessionData}=await client.auth.getSession();
    const session=sessionData.session;
    const email=session?.user?.email||'';
    if(email!==owner){
      dashboard?.classList.add('hidden');
      authPanel?.classList.remove('hidden');
      if(email&&msg) msg.textContent='Questo account non è autorizzato a vedere le statistiche.';
      return;
    }

    authPanel?.classList.add('hidden');
    dashboard?.classList.remove('hidden');
    const {data,error}=await client.from('analytics_events')
      .select('occurred_at,event_name,path,anonymous_session_id,visitor_id,referrer_host')
      .gte('occurred_at',start30.toISOString())
      .order('occurred_at',{ascending:false})
      .limit(10000);
    if(error){
      setText('range-label',`Errore: ${error.message}`);
      return;
    }
    const rows=data||[];
    const views=rows.filter(r=>r.event_name==='page_view');
    const today=views.filter(r=>new Date(r.occurred_at)>=startToday);
    setText('today-views',today.length);
    setText('month-views',views.length);
    setText('unique-visitors',new Set(views.map(r=>r.visitor_id)).size);
    setText('sessions',new Set(views.map(r=>r.anonymous_session_id)).size);
    setText('cta-clicks',rows.filter(r=>r.event_name==='cta_click').length);
    setText('internal-clicks',rows.filter(r=>r.event_name==='internal_click').length);
    setText('outbound-clicks',rows.filter(r=>r.event_name==='outbound_click').length);
    setText('referrers',new Set(views.map(r=>r.referrer_host).filter(Boolean)).size);
    setText('range-label',`Ultimi 30 giorni · aggiornato ${new Intl.DateTimeFormat('it-IT',{dateStyle:'short',timeStyle:'short'}).format(new Date())}`);

    const counts={};
    views.forEach(r=>{counts[r.path]=(counts[r.path]||0)+1});
    const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,12);
    const max=top[0]?.[1]||1;
    const topRoot=document.getElementById('top-pages');
    if(topRoot){
      topRoot.innerHTML=top.length?top.map(([p,n])=>`<div class="bar-row"><span>${escapeHtml(p)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(4,Math.round(n/max*100))}%"></div></div><strong>${n}</strong></div>`).join(''):'<p class="muted">Nessuna visita registrata ancora.</p>';
    }

    const recent=document.getElementById('recent-visits');
    if(recent){
      recent.innerHTML=views.slice(0,40).map(r=>`<tr><td>${new Intl.DateTimeFormat('it-IT',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(r.occurred_at))}</td><td>${escapeHtml(r.path)}</td><td>${escapeHtml(r.referrer_host||'diretto')}</td></tr>`).join('')||'<tr><td colspan="3">Nessuna visita registrata.</td></tr>';
    }
  }

  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}

  document.getElementById('stats-login-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const email=String(new FormData(e.currentTarget).get('email')||'').trim().toLowerCase();
    if(email!==owner){if(msg)msg.textContent='Usa l’account amministratore CasaStudent.';return;}
    if(msg)msg.textContent='Invio del link di accesso…';
    const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:`${location.origin}/stats.html`}});
    if(msg)msg.textContent=error?error.message:'Controlla la posta e apri il link ricevuto.';
  });
  document.getElementById('refresh-stats')?.addEventListener('click',load);
  document.getElementById('logout-stats')?.addEventListener('click',async()=>{await client.auth.signOut();load();});
  client.auth.onAuthStateChange(()=>setTimeout(load,0));
  await load();
})();