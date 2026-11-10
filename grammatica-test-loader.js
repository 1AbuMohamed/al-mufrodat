/* grammatica-test loader: loads part A+B */
(function(){
  function load(url){ return fetch(url).then(function(r){ if(!r.ok) throw new Error(url); return r.text(); }); }
  var v = '4';
  Promise.all([
    load('grammatica-test.a.js?v='+v),
    load('grammatica-test.b.js?v='+v)
  ]).then(function(parts){
    var s = document.createElement('script');
    s.textContent = parts[0] + parts[1];
    document.head.appendChild(s);
  }).catch(function(err){
    var el = document.getElementById('gd-app');
    if(el) el.innerHTML = '<p class="loading">Laden mislukt: '+String(err.message||err)+'</p>';
    console.error(err);
  });
})();
