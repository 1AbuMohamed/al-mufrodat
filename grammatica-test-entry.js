(function(){
var urls=["grammatica-test.c00.js?v=6","grammatica-test.c01.js?v=6","grammatica-test.c02.js?v=6","grammatica-test.c03.js?v=6","grammatica-test.c04.js?v=6","grammatica-test.c05.js?v=6","grammatica-test.c06.js?v=6","grammatica-test.c07.js?v=6","grammatica-test.c08.js?v=6","grammatica-test.c09.js?v=6","grammatica-test.c10.js?v=6","grammatica-test.c11.js?v=6","grammatica-test.c12.js?v=6","grammatica-test.c13.js?v=6"];
Promise.all(urls.map(function(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u);return r.text();});}))
.then(function(parts){var s=document.createElement("script");s.textContent=parts.join("");document.head.appendChild(s);})
.catch(function(e){console.error(e);var el=document.getElementById("gd-app");if(el)el.innerHTML="<p class=\"loading\">Laden mislukt</p>";});
})();
