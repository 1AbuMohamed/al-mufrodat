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
   