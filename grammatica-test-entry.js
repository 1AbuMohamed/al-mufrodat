(function(){
var urls=["grammatica-test.c00.b64?v=6","grammatica-test.c01.b64?v=6","grammatica-test.c02.b64?v=6","grammatica-test.c03.b64?v=6","grammatica-test.c04.b64?v=6","grammatica-test.c05.b64?v=6","grammatica-test.c06.b64?v=6","grammatica-test.c07.b64?v=6","grammatica-test.c08.b64?v=6","grammatica-test.c09.b64?v=6","grammatica-test.c10.b64?v=6","grammatica-test.c11.b64?v=6","grammatica-test.c12.b64?v=6","grammatica-test.c13.b64?v=6"];
function decode(s){try{return atob(s)}catch(e){return s}}
Promise.all(urls.map(function(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u);return r.text();});}))
.then(function(parts){var s=document.createElement("script");s.textContent=parts.map(decode).join("");document.head.appendChild(s);})
.catch(function(e){console.error(e);var el=document.getElementById("gd-app");if(el)el.innerHTML="<p class=\"loading\">Laden mislukt</p>";});
})();
