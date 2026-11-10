/* grammatica-test.js v6 b64 parts loader */
(function(){
  var urls = [0,1,2,3].map(function(i){ return 'grammatica-test.b64.'+i+'.txt?v=6'; });
  function b64ToU8(s){
    var bin = atob(s), n = bin.length, u = new Uint8Array(n);
    for (var i=0;i<n;i++) u[i] = bin.charCodeAt(i);
    return u;
  }
  function fail(e){
    console.error(e);
    var el = document.getElementById('gd-app');
    if (el) el.innerHTML = '<p class="loading">Laden mislukt</p>';
  }
  Promise.all(urls.map(function(u){ return fetch(u).then(function(r){ if(!r.ok) throw new Error(u); return r.text(); }); }))
    .then(function(parts){
      var B64 = parts.join('');
      var ds = new DecompressionStream('gzip');
      var stream = new Blob([b64ToU8(B64)]).stream().pipeThrough(ds);
      return new Response(stream).text();
    })
    .then(function(text){ (0, eval)(text); })
    .catch(fail);
})();
