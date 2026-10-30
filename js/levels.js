/* =====================================================================
   CODE QUEST · levels.js
   Registro de bloques y niveles. El contenido pedagógico vive en
   js/levels/blockN.js y se registra con CQ.Levels.register({...}).

   Estructura de un nivel (ver README → "Cómo agregar desafíos"):
   {
     title, story,
     scene: { world, ...config },  setup: 'código de preparación',
     learn:      { what, why, when, how, howNote, symbols, mistakes, analogy },
     observe:    { code, steps:[{ lines:[a,b], text }], result },
     experiment: { code, ideas:[], controls:[] },
     solve / prove: reto { activity, title, story, goal, starter, tests, hints, ... }
   }
   ===================================================================== */
(function (CQ) {
  'use strict';

  var ACTIVITIES = {
    A: { name: 'Código incompleto', icon: '🧩' },
    B: { name: 'Encuentra el error', icon: '🔍' },
    C: { name: 'Predice el resultado', icon: '🔮' },
    D: { name: 'Programa el dispositivo', icon: '🎮' },
    E: { name: 'Ordena la lógica', icon: '🧱' },
    F: { name: 'Laboratorio libre', icon: '🧪' },
    G: { name: 'Construye tu solución', icon: '🏗️' },
    H: { name: 'Depuración visual', icon: '🩺' }
  };

  var blocks = [];
  var index = {};

  function register(block) {
    block.levels.forEach(function (l, i) {
      l.id = 'b' + block.n + 'l' + (i + 1);
      l.block = block;
      l.index = i;
      l.num = block.n + '.' + (i + 1);
      index[l.id] = l;
    });
    if (block.special) {
      var s = block.special;
      s.id = 'b' + block.n + 's';
      s.block = block;
      s.special = true;
      s.num = block.n + '★';
      index[s.id] = s;
    }
    blocks[block.n] = block;
  }

  CQ.Levels = {
    ACTIVITIES: ACTIVITIES,
    blocks: blocks,
    register: register,
    block: function (n) { return blocks[n]; },
    level: function (id) { return index[id]; },
    next: function (id) {
      var l = index[id];
      if (!l || l.special) return null;
      var b = l.block;
      if (l.index + 1 < b.levels.length) return b.levels[l.index + 1];
      var nb = blocks[b.n + 1];
      return nb ? nb.levels[0] : null;
    }
  };
})(window.CQ = window.CQ || {});
