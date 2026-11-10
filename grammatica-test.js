(function(){
  var urls=[];
  for(var i=0;i<=33;i++) urls.push('grammatica-test.t'+String(i).padStart(2,'0')+'.js?v=5');
  function run(code){var s=document.createElement('script');s.textContent=code;document.head.appendChild(s);}
  function fail(e){console.error(e);var el=document.getElementById('gd-app');if(el)el.innerHTML='<p class="loading">Laden mislukt</p>';}
  Promise.all(urls.map(function(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u);return r.text();});}))
    .then(function(parts){run(parts.join(''));}).catch(fail);
})();
