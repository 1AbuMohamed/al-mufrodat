ar i=0;i<bin.length;i++) u8[i] = bin.charCodeAt(i);
    return u8;
  }
  function run(code){ (0, eval)(code); }
  function fail(err){
    console.error(err);
    if (typeof document !== 'undefined') {
      var el = document.getElementById('gd-app');
      if (el) el.innerHTML = '<p class="loading">Laden mislukt</p>';
    }
  }
  var bytes = b64ToU8(B64);
  if (typeof require === 'function') {
    try {
      run(require('zlib').gunzipSync(Buffer.from(bytes)).toString('utf8'));
      return;
    } catch (e) {}
  }
  if (typeof DecompressionStream !== 'undefined') {
    var ds = new DecompressionStream('gzip');
    new Response(new Blob([bytes]).stream().pipeThrough(ds)).text().then(run).catch(fail);
    return;
  }
  fail(new Error('Kan grammatica-test niet decomprimeren'));
})();
