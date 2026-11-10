(function(){
  var urls=[0,1,2,3,4].map(function(i){return "grammatica-test.s"+i+".js?v=5";});
  function run(code){var s=document.createElement("script");s.textContent=code;document.head.appendChild(s);}
  function fail(e){console.error(e);var el=document.getElementById("gd-app");if(el)el.innerHTML="<p class=\"loading\">Laden mislukt</p>";}
  if(typeof require==="function"){
    try{
      var fs=require("fs"),path=require("path"),dir=__dirname;
      run(urls.map(function(u){return fs.readFileSync(path.join(dir,u.split("?")[0]),"utf8");}).join(""));
      return;
    }catch(e){}
  }
  Promise.all(urls.map(function(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u);return r.text();});}))
    .then(function(parts){run(parts.join(""));}).catch(fail);
})();
