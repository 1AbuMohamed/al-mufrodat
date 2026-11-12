/* Mascot bridge: injects mascot into feedback + finish screens */
(function(){
  function inject(){
    try{
      document.querySelectorAll('.gd-feedback-inner').forEach(function(el){
        if(el.querySelector('.gd-mascot')) return;
        var good = el.closest('.gd-feedback') && el.closest('.gd-feedback').classList.contains('good');
        var kind = good ? (document.querySelector('.gd-combo') ? 'proud' : 'happy') : 'sad';
        if(!window.AL_MASCOT || !AL_MASCOT.img) return;
        var head = document.createElement('div');
        head.className = 'gd-feedback-head';
        head.innerHTML = AL_MASCOT.img(kind,'gd-mascot');
        var strong = el.querySelector('strong');
        if(strong){
          head.appendChild(strong.cloneNode(true));
          strong.replaceWith(head);
        } else {
          el.insertBefore(head, el.firstChild);
        }
      });
      document.querySelectorAll('.gd-finish').forEach(function(el){
        if(el.querySelector('.gd-finish-mascot')) return;
        if(!window.AL_MASCOT || !AL_MASCOT.img) return;
        var acc = 50;
        var accEl = el.querySelector('.gd-result-grid span:nth-child(2) strong');
        if(accEl) acc = parseInt(accEl.textContent,10)||50;
        var kind = acc>=80?'proud':(acc>=50?'happy':'sad');
        var wrap = document.createElement('div');
        wrap.className = 'gd-finish-mascot';
        wrap.innerHTML = AL_MASCOT.img(kind,'gd-mascot');
        el.insertBefore(wrap, el.firstChild);
      });
    }catch(e){}
  }
  var obs = new MutationObserver(function(){ inject(); });
  if(document.body) obs.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',function(){
    obs.observe(document.body,{childList:true,subtree:true});
  });
})();
