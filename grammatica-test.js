/* Temporary loader: pulls the last known-good grammatica-test.js (de26a41) until full restore lands */
(function(){
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/gh/1AbuMohamed/al-mufrodat@de26a41/grammatica-test.js';
  s.defer = true;
  document.head.appendChild(s);
})();
