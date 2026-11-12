window.AL_MASCOT=window.AL_MASCOT||{};
(function(){
var F={};
F.happy=[
'data:image/webp;base64,PLACEHOLDER_HAPPY0',
'data:image/webp;base64,PLACEHOLDER_HAPPY1',
'data:image/webp;base64,PLACEHOLDER_HAPPY2',
];
F.proud=[
'data:image/webp;base64,PLACEHOLDER_PROUD0',
'data:image/webp;base64,PLACEHOLDER_PROUD1',
'data:image/webp;base64,PLACEHOLDER_PROUD2',
];
F.sad=[
'data:image/webp;base64,PLACEHOLDER_SAD0',
'data:image/webp;base64,PLACEHOLDER_SAD1',
'data:image/webp;base64,PLACEHOLDER_SAD2',
];
function cycle(img, frames){
  var i=0;
  setInterval(function(){
    i=(i+1)%frames.length;
    img.src=frames[i];
  }, 160);
}
AL_MASCOT.img = function(kind, cls){
  var frames = F[kind]||F.happy;
  var src = frames[0];
  var k = kind||'happy';
  var c = (cls||'gd-mascot')+' gd-mascot--'+k+' gd-mascot-anim';
  var id = 'm_'+Math.random().toString(36).slice(2,8);
  setTimeout(function(){
    var el=document.getElementById(id);
    if(el) cycle(el, frames);
  }, 50);
  return src ? '<img id="'+id+'" class="'+c+'" src="'+src+'" alt="" width="96" height="144" decoding="async">' : '';
};
})();
