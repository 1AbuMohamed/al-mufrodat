/* app_bootstrap.js — loads patched app_core */
(function(){
  var urls = ['app_bootstrap.p0.js?v=1','app_bootstrap.p1.js?v=1','app_bootstrap.p2.js?v=1'];
  Promise.all(urls.map(function(u){ return fetch(u).then(function(r){ if(!r.ok) throw new Error(u); return r.text(); }); }))
    .then(function(parts){ var s=document.createElement('script'); s.textContent=parts.join(''); document.body.appendChild(s); })
    .catch(function(e){ console.error(e); var el=document.getElementById('app'); if(el) el.innerHTML='<p style="padding:2rem">Laden mislukt</p>'; });
})();
