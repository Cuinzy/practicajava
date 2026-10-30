/* =====================================================================
   CODE QUEST · progress.js
   Progreso, puntuaciones, XP, insignias, tiempo y desbloqueo.
   Se guarda en localStorage.

   AVISO: localStorage vive en el navegador del estudiante y puede
   modificarse con las herramientas de desarrollo. Este progreso es
   PEDAGÓGICO (autoevaluación y motivación), no una calificación
   académica segura. Para evaluar formalmente se necesita un servidor
   que valide los retos. Se incluye una firma simple solo para DETECTAR
   ediciones manuales casuales (no las impide).
   ===================================================================== */
(function (CQ) {
  'use strict';

  var KEY = 'codequest.progress.v1';
  var SALT = 'neopolis-2026';
  var PASS_PERF = 80;   // desempeño mínimo para aprobar un bloque
  var state = null, memoryOnly = false;

  var BADGES = [
    { id: 'primer-paso', icon: '👣', name: 'Primer paso', desc: 'Ejecutaste tu primera instrucción de JavaScript.' },
    { id: 'depurador', icon: '🐞', name: 'Cazabugs', desc: 'Superaste un reto después de corregir errores.' },
    { id: 'persistente', icon: '🧗', name: 'Perseverancia', desc: 'Superaste un reto tras 3 intentos o más.' },
    { id: 'sin-pistas', icon: '🧠', name: 'Mente brillante', desc: 'Superaste 5 retos sin usar pistas.' },
    { id: 'curioso', icon: '🧪', name: 'Mente curiosa', desc: 'Realizaste 20 experimentos en los laboratorios.' },
    { id: 'oraculo', icon: '🔮', name: 'Oráculo del código', desc: 'Acertaste 5 predicciones a la primera.' },
    { id: 'laboratorio', icon: '⚗️', name: 'Laboratorio libre', desc: 'Exploraste el laboratorio libre.' },
    { id: 'especial', icon: '⭐', name: 'Misión especial', desc: 'Completaste una misión especial.' },
    { id: 'b0', icon: '🔌', name: 'Chispa inicial', desc: 'Aprobaste el Bloque 0: primer contacto.' },
    { id: 'b1', icon: '⚡', name: 'Energía estable', desc: 'Aprobaste el Bloque 1: variables y operadores.' },
    { id: 'b2', icon: '🚪', name: 'Llave lógica', desc: 'Aprobaste el Bloque 2: condicionales.' },
    { id: 'b3', icon: '🔁', name: 'Ritmo infinito', desc: 'Aprobaste el Bloque 3: bucles.' },
    { id: 'b4', icon: '🤖', name: 'Taller de habilidades', desc: 'Aprobaste el Bloque 4: funciones.' },
    { id: 'b5', icon: '📦', name: 'Orden en el almacén', desc: 'Aprobaste el Bloque 5: arreglos y objetos.' },
    { id: 'b6', icon: '🌳', name: 'Jardín del DOM', desc: 'Aprobaste el Bloque 6: el DOM.' },
    { id: 'b7', icon: '🎛️', name: 'Plaza viva', desc: 'Aprobaste el Bloque 7: eventos.' },
    { id: 'b8', icon: '🏙️', name: 'Neópolis reactivada', desc: 'Completaste el desafío final.' }
  ];

  var RANKS = [
    { xp: 0, name: 'Aprendiz' },
    { xp: 400, name: 'Ayudante de sistemas' },
    { xp: 1000, name: 'Analista de código' },
    { xp: 2000, name: 'Especialista en lógica' },
    { xp: 3400, name: 'Estratega del DOM' },
    { xp: 5200, name: 'Guía de Neópolis' },
    { xp: 7500, name: 'Leyenda de Neópolis' }
  ];

  function fresh() {
    return {
      v: 1,
      player: { name: '', created: Date.now() },
      xp: 0, badges: {}, levels: {}, specials: {}, drafts: {},
      stats: { runs: 0, experiments: 0, predictionsFirstTry: 0, noHintChallenges: 0, pasteAttempts: 0, hintsUsed: 0, labRuns: 0 },
      time: { total: 0 },
      currentBlock: 0, lastLevel: null
    };
  }

  function sign(obj) {
    var copy = {};
    Object.keys(obj).forEach(function (k) { if (k !== 'sig' && k !== 'tampered' && k !== 'drafts') copy[k] = obj[k]; });
    var s = SALT + JSON.stringify(copy), h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        var base = fresh();
        Object.keys(base).forEach(function (k) { if (s[k] === undefined) s[k] = base[k]; });
        Object.keys(base.stats).forEach(function (k) { if (s.stats[k] === undefined) s.stats[k] = 0; });
        if (s.sig && s.sig !== sign(s)) s.tampered = true;
        state = s;
        return state;
      }
    } catch (e) { memoryOnly = true; }
    state = fresh();
    return state;
  }

  var saveTimer = null;
  function save(now) {
    if (now) return write();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(write, 250);
  }
  function write() {
    if (!state) return;
    state.sig = sign(state);
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) {
      if (!memoryOnly && CQ.UI) CQ.UI.toast('No se pudo guardar el progreso en este navegador (modo privado o almacenamiento lleno).', 'warn', 5000);
      memoryOnly = true;
    }
  }

  function get() { return state; }

  function level(id) {
    if (!state.levels[id]) state.levels[id] = { done: {}, passed: false, best: 0, attempts: 0, time: 0, ch: {}, expRuns: 0 };
    return state.levels[id];
  }

  function challenge(levelId, key) {
    var lv = level(levelId);
    if (!lv.ch[key]) lv.ch[key] = { passed: false, best: 0, attempts: 0, fails: 0, hints: 0, code: null, order: null };
    return lv.ch[key];
  }

  /** Puntuación de un reto: recompensa la comprensión, castiga poco. */
  function scoreFor(fails, hints) { return Math.max(60, 100 - 4 * fails - 5 * hints); }

  function rank(xp) {
    xp = xp == null ? state.xp : xp;
    var r = RANKS[0], idx = 0;
    RANKS.forEach(function (x, i) { if (xp >= x.xp) { r = x; idx = i; } });
    var next = RANKS[idx + 1];
    return {
      level: idx + 1, name: r.name, xp: xp, from: r.xp, to: next ? next.xp : null,
      pct: next ? Math.round((xp - r.xp) / (next.xp - r.xp) * 100) : 100
    };
  }

  function addXP(n) {
    var before = rank().level;
    state.xp += n;
    save();
    var after = rank();
    return { gained: n, leveledUp: after.level > before, rank: after };
  }

  function award(id) {
    if (state.badges[id]) return null;
    state.badges[id] = Date.now();
    save();
    var b = BADGES.find(function (x) { return x.id === id; });
    if (b && CQ.UI) CQ.UI.toast('🏅 Nueva insignia: ' + b.icon + ' ' + b.name, 'success', 4200);
    return b;
  }

  /* --------------------- Desbloqueo y desempeño --------------------- */
  function blockStats(n) {
    var b = CQ.Levels.block(n);
    if (!b) return null;
    var passed = 0, sum = 0;
    b.levels.forEach(function (l) {
      var lv = state.levels[l.id];
      if (lv && lv.passed) passed++;
      sum += lv ? lv.best : 0;
    });
    var perf = Math.round(sum / b.levels.length);
    var complete = passed === b.levels.length;
    return { passed: passed, total: b.levels.length, perf: perf, complete: complete, approved: complete && perf >= PASS_PERF };
  }

  function isBlockUnlocked(n) {
    if (n === 0) return true;
    var prev = blockStats(n - 1);
    return !!prev && prev.approved;
  }

  function isLevelUnlocked(id) {
    var l = CQ.Levels.level(id);
    if (!l) return false;
    if (l.special) return blockStats(l.block.n).approved;
    if (!isBlockUnlocked(l.block.n)) return false;
    if (l.index === 0) return true;
    var prev = state.levels[l.block.levels[l.index - 1].id];
    return !!prev && prev.passed;
  }

  function currentBlock() {
    var cur = 0;
    CQ.Levels.blocks.forEach(function (b) { if (isBlockUnlocked(b.n)) cur = b.n; });
    state.currentBlock = cur;
    return cur;
  }

  /* --------------------------- Tiempo --------------------------- */
  // Solo cuenta mientras la pestaña está visible y hubo actividad en los últimos 90 s.
  var timer = null, timingLevel = null, lastActivity = Date.now();
  ['keydown', 'pointerdown', 'wheel', 'touchstart'].forEach(function (t) {
    window.addEventListener(t, function () { lastActivity = Date.now(); }, { passive: true, capture: true });
  });
  function startTimer(levelId) {
    timingLevel = levelId;
    if (timer) return;
    timer = setInterval(function () {
      if (document.visibilityState !== 'visible' || Date.now() - lastActivity > 90000) return;
      state.time.total += 5000;
      if (timingLevel) level(timingLevel).time += 5000;
      save();
    }, 5000);
  }
  function stopTimer() { timingLevel = null; }

  function countPasteAttempt() { if (state) { state.stats.pasteAttempts++; save(); } }

  function reset() {
    state = fresh();
    save(true);
  }

  function exportJSON() {
    var data = JSON.parse(JSON.stringify(state));
    delete data.drafts;
    data.exportedAt = new Date().toISOString();
    data.note = 'Progreso pedagógico local. Puede haber sido modificado en el navegador: no es una calificación verificada.';
    return JSON.stringify(data, null, 2);
  }

  CQ.Progress = {
    load: load, save: save, get: get, level: level, challenge: challenge, scoreFor: scoreFor,
    addXP: addXP, award: award, rank: rank, RANKS: RANKS, BADGES: BADGES, PASS_PERF: PASS_PERF,
    blockStats: blockStats, isBlockUnlocked: isBlockUnlocked, isLevelUnlocked: isLevelUnlocked, currentBlock: currentBlock,
    startTimer: startTimer, stopTimer: stopTimer, countPasteAttempt: countPasteAttempt, reset: reset, exportJSON: exportJSON,
    isMemoryOnly: function () { return memoryOnly; }
  };
})(window.CQ = window.CQ || {});
