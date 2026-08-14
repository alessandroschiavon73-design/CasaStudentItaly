(() => {
  const cities = [
    ['milano','Milano',['Città Studi','Bicocca','Bocconi']], ['torino','Torino',['Vanchiglia','San Salvario','Cenisia']],
    ['trento','Trento',['Centro','San Bartolomeo','Povo']], ['padova','Padova',['Arcella','Portello','Sacra Famiglia']],
    ['trieste','Trieste',['Centro','San Giacomo','Roiano']], ['bologna','Bologna',['Bolognina','San Donato','Saragozza']],
    ['pisa','Pisa',['Centro','Porta a Lucca','San Martino']], ['firenze','Firenze',['Novoli','Rifredi','Campo di Marte']],
    ['ancona','Ancona',['Centro','Piano','Torrette']], ['roma','Roma',['San Lorenzo','Bologna','Ostiense']],
    ['bari','Bari',['Murat','Carrassi','Poggiofranco']], ['napoli','Napoli',['Centro Storico','Fuorigrotta','Vomero']],
    ['cagliari','Cagliari',['Castello','San Benedetto','Is Mirrionis']], ['palermo','Palermo',['Centro Storico','Politeama','Montegrappa']]
  ];
  const types=['Stanza singola','Posto letto in doppia','Bilocale'];
  const photos=['alloggio-1.webp','alloggio-2.webp','alloggio-3.webp'];
  const listings=[];
  cities.forEach(([slug,name,zones],ci)=>zones.forEach((zone,i)=>{
    const price=[420,310,690][i]+(ci%5)*20;
    listings.push({
      id:`${slug.slice(0,3).toUpperCase()}-${i+1}-DEMO`,city:slug,cityName:name,zone,
      tag:['vicino all’università','formula studenti','arredato e luminoso'][i],type:types[i],
      arrangement:i===2?'Appartamento intero':'In appartamento condiviso',price,expensesIncluded:i!==1,expenses:i===1?75:0,
      available:i===0?'1 settembre':i===1?'subito':'15 settembre',university:'Polo universitario',universityMinutes:5+i*4,centerMinutes:8+i*3,
      image:`assets/img/${photos[i]}`,gallery:[`assets/img/${photos[i]}`,'assets/img/cucina.webp','assets/img/bagno.webp','assets/img/corridoio.webp'],
      surface:[18,22,48][i],apartmentSurface:[95,110,48][i],roommates:[2,3,0][i],floor:i===0?'2° con ascensore':i===1?'1°':'Piano terra',
      heating:'Autonomo',airConditioning:i===2?'Sì':'No',wifi:'Sì – Fibra',pets:'Da concordare',smokers:'Non ammessi',contract:'Transitorio studenti',
      deposit:price*2,minimumStay:'6 mesi',notice:'3 mesi',bills:i===1?['Spese condominiali','Internet Wi‑Fi']:['Spese condominiali','Acqua','Riscaldamento','Internet Wi‑Fi'],
      description:`Annuncio dimostrativo per ${name}: ${types[i].toLowerCase()} in zona ${zone}. Alloggio e contatti sono fittizi e servono esclusivamente a mostrare il funzionamento di StudentBnB.`,
      rules:['Rispetto degli spazi comuni','Niente feste','Pulizia periodica condivisa'],nearby:['Università raggiungibile in pochi minuti','Supermercato nelle vicinanze','Fermata del trasporto pubblico'],
      publisher:i===2?'Agenzia demo':'Privato demo',agencyFee:i===2?'Nessun costo nella dimostrazione':'',phone:'000 0000000',email:'demo@studentbnb.it',whatsapp:'',
      published:'annuncio dimostrativo',updated:'oggi',isDemo:true
    });
  }));
  window.STUDENTBNB_DATA={cities:cities.map(([slug,name])=>({slug,name,count:3,live:true})),listings};
})();
