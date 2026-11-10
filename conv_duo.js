/* Dialogen: overzichtelijke kaarten en rustige leesweergave */
(function(){
'use strict';
window.__convDone=(function(){try{return JSON.parse(localStorage.getItem('alm_conv_done')||'{}')}catch(e){return {}}})();
function saveConvDone(){try{localStorage.setItem('alm_conv_done',JSON.stringify(window.__convDone||{}))}catch(e){}}
function ce(s){if(typeof esc==='function')return esc(s);if(s==null)return '';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')}
function sceneTitle(d,i){let s=String(d&&d.titleNl||'');s=s.replace(/^(Les|Hoofdstuk)\s*\d+\s*[—–-]\s*/i,'').replace(/^Dialoog\s*\d*\s*[—–:-]\s*/i,'').replace(/\s*[·|]\s*(mannen|vrouwen).*$/i,'').trim();return s||('Scène '+(i+1))}
window.renderConv=function(){
 const units=Object.entries(CONVERSATIONS||{}),done=window.__convDone||{};let count=0;
 const cards=units.map(([n,c])=>{const ds=c.dialogues||[],isDone=!!done[n];if(isDone)count++;const preview=ds.slice(0,2).map(sceneTitle).join(' · ');
 return '<button class="conv-overview-card'+(isDone?' is-done':'')+'" data-act="open-conv" data-u="'+ce(n)+'"><span class="conv-card-top"><b>'+ce(String(n).padStart(2,'0'))+'</b><small>'+ds.length+' '+(ds.length===1?'dialoog':'dialogen')+'</small></span><span class="conv-card-ar ar" lang="ar">'+ce(c.titleAr||'')+'</span><strong>'+ce(c.titleNl||('Eenheid '+n))+'</strong><span class="conv-card-preview">'+ce(preview)+'</span><span class="conv-card-bottom">'+(isDone?'Gelezen ✓':'Openen →')+'</span></button>';
 }).join('');
 const pct=units.length?Math.round(count*100/units.length):0;
 return '<div class="desktop-page conv-overview"><header class="conv-page-head"><div><span>Arabisch oefenen</span><h1>Dialogen</h1><p>Korte gesprekken met vertaling per zin.</p></div><div class="conv-progress"><b>'+count+'/'+units.length+'</b><small>gelezen</small><i><em style="width:'+pct+'%"></em></i></div></header><div class="conv-overview-grid">'+cards+'</div></div>';
};
window.renderConvUnit=function(){
 if(typeof state==='undefined')return '<div class="empty">Laden…</div>';
 if(state.convShowAll===undefined)state.convShowAll=false;if(!state.convOpen)state.convOpen={};
 const n=String(state.convUnit||''),c=CONVERSATIONS&&(CONVERSATIONS[n]||CONVERSATIONS[Number(n)]);
 if(!c)return '<div class="empty">Dialoog niet gevonden.</div>';
 const ds=c.dialogues||[],total=ds.length;if(!total)return '<div class="empty">Geen dialogen.</div>';
 let di=Math.max(0,Math.min(total-1,state.convDi|0));state.convDi=di;const d=ds[di],speakers=[];
 (d.lines||[]).forEach(l=>{if(l.who&&!speakers.includes(l.who))speakers.push(l.who)});
 const chat=(d.lines||[]).map((line,i)=>{
  const id=di+'-'+i,open=!!state.convShowAll||!!state.convOpen[id],role=(Math.max(0,speakers.indexOf(line.who))%2===0)?'a':'b';
  const key='conv_'+n+'_'+di+'_'+i,can=!!(window.analyzeArabicSentence&&window.analyzeArabicSentence(line.ar)),sess=can&&window.getInlineIrabSession?window.getInlineIrabSession(key,'view'):null,irab=!!(sess&&sess.open);
  const ar=(typeof markAr==='function')?markAr(line.ar,'plain'):ce(line.ar);
  return '<article class="conv-chat-row spk-'+role+'"><div class="conv-chat-bubble'+(open?' open':'')+(irab?' irab-open':'')+'"><div class="conv-chat-meta"><b class="ar" lang="ar">'+ce(line.who||'')+'</b>'+(can?'<button class="conv-irab-btn'+(irab?' on':'')+'" data-act="iirab-toggle" data-key="'+ce(key)+'" data-sent="'+ce(line.ar)+'">إعراب</button>':'')+'</div><button class="conv-ar-line ar ar-mark" lang="ar" data-act="toggle-line" data-id="'+id+'">'+ar+'</button>'+(open?'<button class="conv-nl-line" data-act="toggle-line" data-id="'+id+'">'+ce(line.nl||'')+'</button>':'<button class="conv-hint" data-act="toggle-line" data-id="'+id+'">Toon vertaling</button>')+(irab&&window.renderInlineIrab?'<div class="irab-panel">'+window.renderInlineIrab(line.ar,key,sess.mode)+'</div>':'')+'</div></article>';
 }).join('');
 const tabs=total>1?'<nav class="conv-scene-tabs" aria-label="Kies dialoog">'+ds.map((x,i)=>'<button class="conv-scene-tab'+(i===di?' active':'')+'" data-act="conv-di" data-dir="set" data-i="'+i+'"><small>'+String(i+1).padStart(2,'0')+'</small><b>'+ce(sceneTitle(x,i))+'</b></button>').join('')+'</nav>':'';
 const phrases=(c.phrases||[]).map(p=>'<div class="conv-phrase"><b class="ar" lang="ar">'+ce(p.ar)+'</b><span>'+ce(p.nl)+'</span></div>').join('');
 const img=d.image||c.image,heroImg=img?'<img class="conv-unit-image" src="'+ce(img)+'" alt="" loading="lazy">':'';
 const isDone=!!(window.__convDone&&window.__convDone[n]);
 return '<div class="desktop-narrow conv-reader"><div class="conv-reader-top"><button class="back" data-act="nav" data-v="conv"><span>←</span> Dialogen</button><small>'+String(di+1)+'/'+total+'</small><label><input type="checkbox" id="conv-done-cb" data-u="'+ce(n)+'"'+(isDone?' checked':'')+'> Gelezen</label></div><header class="conv-reader-hero">'+heroImg+'<div><small>Eenheid '+ce(n)+'</small><h1>'+ce(c.titleNl||'Dialoog')+'</h1><div class="ar conv-reader-ar" lang="ar">'+ce(c.titleAr||'')+'</div><h2>'+ce(sceneTitle(d,di))+'</h2></div></header>'+tabs+'<div class="conv-tools"><span>Vertaling per zin</span><button class="btn btn-secondary btn-sm" data-act="toggle-all-trans">'+(state.convShowAll?'Verberg alles':'Toon alles')+'</button></div><div class="conv-chat-stack">'+chat+'</div>'+(phrases?'<details class="conv-phrases"><summary>Belangrijke zinnen ('+(c.phrases||[]).length+')</summary><div class="conv-phrases-grid">'+phrases+'</div></details>':'')+'<div class="conv-reader-nav"><button class="btn btn-secondary btn-sm" data-act="conv-di" data-dir="prev"'+(di===0?' disabled':'')+'>← Vorige</button>'+(di<total-1?'<button class="btn btn-primary btn-sm" data-act="conv-di" data-dir="next">Volgende →</button>':'<button class="btn btn-primary btn-sm" data-act="nav" data-v="conv">Klaar</button>')+'</div></div>';
};
document.addEventListener('change',function(e){const t=e.target;if(t&&t.id==='conv-done-cb'){const u=t.getAttribute('data-u');if(!u)return;window.__convDone=window.__convDone||{};window.__convDone[u]=!!t.checked;saveConvDone()}});
})();