/* Controleer of de HTML-bootloader de oude legacy-functies echt hernoemt,
   zodat de actieve dialoog- en flashcardrenderers niet overschreven worden. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

(async function main(){
  const html = fs.readFileSync('index.html','utf8');
  const source = fs.readFileSync('app_core.js','utf8');
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
    .map(m=>m[1]).find(s=>s.includes('const GOOD'));
  assert(inline, 'Bootloader ontbreekt');
  let actual = '';
  const document = {
    documentElement:{scrollTop:0},
    body:{
      scrollTop:0,
      appendChild(script){actual = script.textContent || '';}
    },
    getElementById(){return {scrollTop:0,innerHTML:''};},
    createElement(){return {textContent:''};}
  };
  const ctx = {
    document, window:{scrollTo(){}},
    localStorage:{getItem(){return null;}},
    fetch:async path=>{
      assert.equal(path,'app_core.js', 'De bootloader moet de lokale code gebruiken');
      return {ok:true,text:async()=>source};
    },
    history:{}, console,
    setTimeout() {}
  };
  vm.runInNewContext(inline, ctx, {filename:'inline-bootloader.js'});
  for(let i=0;i<8 && !actual;i++) await Promise.resolve();
  assert(actual.length>200000, 'De applicatiecode is niet ingeladen');
  for(const method of ['renderConv','renderConvUnit','renderFlash']){
    assert(actual.includes('function '+method+'Legacy(){'), method+' legacy-naam ontbreekt');
    assert(!actual.includes('function '+method+'(){'), method+' overschrijft nieuwe functie');
    assert(actual.includes('window.'+method+'()'), method+' gebruikt geen moderne functie');
  }
  assert(actual.includes('renderConvLegacy()'));
  assert(actual.includes('renderConvUnitLegacy()'));
  assert(actual.includes('renderFlashLegacy()'));
  console.log('OK: lokale app geladen en nieuwe dialogen/flashcards worden niet overschreven');
})().catch(err=>{ console.error(err);process.exitCode=1; });
