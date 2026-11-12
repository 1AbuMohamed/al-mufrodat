window.AL_MASCOT=window.AL_MASCOT||{};
window.AL_MASCOT.img=function(kind,cls){
  var src=this[kind]||this.happy||'';
  return src?'<img class="'+(cls||'gd-mascot')+'" src="'+src+'" alt="" width="96" height="144" decoding="async">':'';
};
