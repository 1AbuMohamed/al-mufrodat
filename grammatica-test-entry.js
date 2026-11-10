(function(){
var urls=["grammatica-test.h0.js?v=6","grammatica-test.h1.js?v=6","grammatica-test.h2.js?v=6","grammatica-test.h3.js?v=6"];
Promise.all(urls.map(function(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u);return r.text();});}))
.then(function(parts){var s=document.createElement('script');s.textContent=parts.join('');document.head.appendChild(s);})
.catch(function(e){console.error(e);var el=document.getElementById('gd-app');if(el)el.innerHTML='<p class="loading">Laden mislukt</p>';});
})();
