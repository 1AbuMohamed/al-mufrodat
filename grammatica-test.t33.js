 } catch (e) {}
  }
  if (typeof DecompressionStream !== 'undefined') {
    var ds = new DecompressionStream('gzip');
    new Response(new Blob([bytes]).stream().pipeThrough(ds)).text().then(run).catch(fail);
    return;
  }
  fail(new Error('Kan grammatica-test niet decomprimeren'));
})();
