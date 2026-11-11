/* Inject duo-theme.css if missing */
(function(){
  if (document.querySelector('link[href*="duo-theme.css"]')) return;
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'duo-theme.css?v=1';
  document.head.appendChild(l);
})();
