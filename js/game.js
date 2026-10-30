/* =====================================================================
   CODE QUEST · game.js
   Pantalla de nivel: las 5 fases (Aprende, Observa, Experimenta,
   Resuelve, Demuestra), el banco de trabajo (escenario + editor +
   consola + árbol DOM), los tipos de actividad y el laboratorio libre.
   ===================================================================== */
(function (CQ) {
  'use strict';

  var U = CQ.UI, P = CQ.Progress, H = CQ.Highlight;

  var PHASES = [
    { key: 'learn', label: 'Aprende', icon: '📘' },
    { key: 'observe', label: 'Observa', icon: '👁️' },
    { key: 'experiment', label: 'Experimenta', icon: '🧪' },
    { key: 'solve', label: 'Resuelve', icon: '🛠️' },
    { key: 'prove', label: 'Demuestra', icon: '🏅' }
  ];

  /** Texto plano escapado con `código` convertido en <code>. */
  function fmt(s) { return U.esc(s).replace(/`([^`]+)`/g, '<code>$1</code>'); }

  function setupFor(obj, level) {
    if (obj && obj.setup != null) return obj.setup;
    return (level && level.setup) || '';
  }

  /* =================================================================
     BANCO DE TRABAJO
     ================================================================= */
  function Workbench(el) {
    var self = this;
    this.el = el;
    el.innerHTML =
      '<div class="wb-scene">' +
        '<div class="scene-wrap"><div class="scene-host"></div><div class="scene-fx" aria-hidden="true"></div>' +
        '<button class="scene-size" type="button" title="Ampliar o reducir el escenario" aria-label="Ampliar o reducir el escenario">⤢</button></div>' +
        '<div class="dom-panel" hidden><div class="dom-head">🌳 Árbol DOM <span class="dom-sel"></span></div><div class="dom-tree"></div>' +
        '<div class="dom-legend"><span class="lg-sel">seleccionado por tu código</span> · clic en un nodo para ubicarlo</div></div>' +
      '</div>' +
      '<div class="wb-tools"></div>' +
      '<div class="wb-editor"></div>' +
      '<div class="wb-order" hidden></div>' +
      '<div class="wb-console"><div class="con-head"><span>🖥️ Consola</span><button class="btn tiny ghost" type="button" data-con="clear">Limpiar</button></div><div class="con-body" role="log" aria-live="polite"></div></div>';
    this.host = el.querySelector('.scene-host');
    this.fx = el.querySelector('.scene-fx');
    this.domPanel = el.querySelector('.dom-panel');
    this.domTree = el.querySelector('.dom-tree');
    this.domSel = el.querySelector('.dom-sel');
    this.tools = el.querySelector('.wb-tools');
    this.edHost = el.querySelector('.wb-editor');
    this.orderHost = el.querySelector('.wb-order');
    this.conBox = el.querySelector('.wb-console');
    this.con = el.querySelector('.con-body');
    this.lastSel = {};
    this.editor = new CQ.Editor(this.edHost, {
      onRun: function () { if (self.onRunKey) self.onRunKey(); },
      onChange: function (v) { if (self.onChange) self.onChange(v); }
    });
    el.querySelector('[data-con=clear]').addEventListener('click', function () { self.clearConsole(); });
    el.querySelector('.scene-size').addEventListener('click', function () { el.classList.toggle('big-scene'); });
    this.domTree.addEventListener('click', function (e) {
      var n = e.target.closest('[data-nid]');
      if (n && +n.dataset.nid) CQ.Sandbox.post(self.host, { type: 'highlight', id: +n.dataset.nid });
    });
    this.con.addEventListener('click', function (e) {
      var b = e.target.closest('[data-line]');
      if (b) { self.editor.mark(+b.dataset.line, 'err'); self.editor.scrollToLine(+b.dataset.line); self.editor.focus(); }
    });
  }

  Workbench.prototype.layout = function (o) {
    this.edHost.hidden = !o.editor;
    this.orderHost.hidden = !o.order;
    this.conBox.hidden = o.console === false;
    this.editor.setReadOnly(!!o.readOnly);
    this.el.classList.toggle('scene-only', !o.editor && !o.order);
    this.onRunKey = null; this.onChange = null;
  };

  Workbench.prototype.setTools = function (list) {
    var self = this;
    this.tools.innerHTML = '';
    list.forEach(function (t) {
      var b = U.el('<button type="button" class="btn ' + (t.cls || '') + '" data-tool="' + t.id + '"' + (t.title ? ' title="' + U.esc(t.title) + '"' : '') + '>' + t.label + '</button>');
      b.addEventListener('click', t.fn);
      self.tools.appendChild(b);
    });
    var stop = U.el('<button type="button" class="btn danger stop-btn" hidden title="Detener la ejecución">■ Detener</button>');
    stop.addEventListener('click', function () { CQ.Sandbox.stop(self.host); });
    this.tools.appendChild(stop);
    this.tools.hidden = !list.length;
  };

  Workbench.prototype.setBusy = function (b) {
    this.busy = b;
    [].forEach.call(this.tools.querySelectorAll('button'), function (x) {
      if (x.classList.contains('stop-btn')) x.hidden = !b;
      else x.disabled = b;
    });
  };

  Workbench.prototype.clearConsole = function () { this.con.innerHTML = ''; };

  Workbench.prototype.log = function (kind, html) {
    var d = document.createElement('div');
    d.className = 'cl cl-' + kind;
    d.innerHTML = html;
    this.con.appendChild(d);
    this.con.scrollTop = this.con.scrollHeight;
  };

  Workbench.prototype.logText = function (kind, text) {
    var icon = { warn: '⚠️ ', error: '⛔ ', info: 'ℹ️ ' }[kind] || '';
    this.log(kind, icon + U.esc(text));
  };

  Workbench.prototype.errorCard = function (x) {
    return '<div class="err-card"><div class="err-title">🤖 ' + U.esc(x.title) +
      (x.line ? ' <button type="button" class="linkbtn" data-line="' + x.line + '">ver línea ' + x.line + '</button>' : '') +
      '</div><div class="err-text">' + x.html + '</div><div class="err-tech">Detalle técnico: ' + U.esc(x.tech) + '</div></div>';
  };

  Workbench.prototype.showError = function (err, code) {
    var x = CQ.Errors.explain(err, code);
    this.log('error-card', this.errorCard(x));
    if (x.line) this.editor.mark(x.line, 'err');
    return x;
  };

  function prepScene(scene, code) {
    var s = JSON.parse(JSON.stringify(scene || { world: 'terminal' }));
    if (s.watch === 'auto' || s.autoWatch) {
      var base = Array.isArray(s.watch) ? s.watch : [];
      var names = CQ.Code.topLevelNames(code || '');
      s.watch = base.concat(names.filter(function (n) { return base.indexOf(n) < 0; })).slice(0, 12);
    }
    return s;
  }

  /** Ejecución visible: el escenario muestra las consecuencias del código. */
  Workbench.prototype.run = function (code, setup, scene, opts) {
    var self = this;
    opts = opts || {};
    scene = prepScene(scene, code);
    var isPage = scene.world === 'page';
    this.domPanel.hidden = !isPage;
    this.el.classList.toggle('has-dom', isPage);
    if (!opts.keepConsole) this.clearConsole();
    this.editor.clearMarks('err');
    this.setBusy(true);
    this.lastSel = {};
    return CQ.Sandbox.run({
      code: code, setup: setup, scene: scene, visible: true, host: this.host, timeout: 4000,
      onLive: function (m) { self._live(m, code); }
    }).then(function (res) {
      self.setBusy(false);
      if (!opts.silent) self._show(res, code);
      else if (res.tree) self.renderTree(res.tree, res.sel);
      if (res.phase === 'done' && code.trim()) P.award('primer-paso');
      return res;
    });
  };

  Workbench.prototype._show = function (res, code) {
    var self = this;
    (res.logs || []).forEach(function (l) { self.logText(l.kind, l.text); });
    if (res.phase !== 'done') {
      var e = res.errors && res.errors[0];
      if (e) this.showError(e, code);
      else if (res.phase === 'early') this.log('warn', '⚠️ El programa terminó antes de llegar al final. ¿Usaste <code>return</code> fuera de una función?');
    } else if (!(res.logs || []).length && code.trim()) {
      this.log('sys', '✓ Programa ejecutado sin errores. (No hubo mensajes en la consola: usa <code>console.log()</code> si quieres ver valores.)');
    }
    CQ.Errors.lint(code).slice(0, 2).forEach(function (t) { self.log('tip', '💡 ' + t.html); });
    if (res.tree) this.renderTree(res.tree, res.sel);
  };

  Workbench.prototype._live = function (m, code) {
    if (m.type === 'live-log') this.logText(m.kind, m.text);
    else if (m.type === 'live-error') this.showError(m.error, code);
    else if (m.type === 'dom') this.renderTree(m.tree, m.sel);
  };

  Workbench.prototype.renderTree = function (tree, sel) {
    if (!tree) return;
    var hasSel = sel && sel.length, map = {};
    if (hasSel) { sel.forEach(function (s) { map[s.id] = s.how; }); this.lastSel = map; }
    else map = this.lastSel || {};
    var count = Object.keys(map).length;
    function node(n) {
      if (n.t === '#text') return '<li class="dn txt"><span class="dt">"' + U.esc(n.x) + '"</span></li>';
      var how = map[n.i];
      var label = '<span class="dtag">&lt;' + U.esc(n.t) + '&gt;</span>' +
        (n.id ? '<span class="did">#' + U.esc(n.id) + '</span>' : '') +
        (n.c ? '<span class="dcls">.' + U.esc(n.c.trim().split(/\s+/).join(' .')) + '</span>' : '') +
        (n.s ? '<span class="dsty" title="Tiene estilos en línea (style)">🎨</span>' : '');
      var kids = n.k && n.k.length && !n.fold ? '<ul>' + n.k.map(node).join('') + '</ul>' : '';
      return '<li class="dn' + (how ? ' sel' + (hasSel ? ' pulse' : '') : '') + '"><span class="dlabel" data-nid="' + n.i + '" title="' +
        (how ? 'Seleccionado con ' + U.esc(how) : 'Clic para ubicarlo en la página') + '">' + (n.t === 'document' ? '<span class="dtag">document</span>' : label) + '</span>' + kids + '</li>';
    }
    this.domTree.innerHTML = '<ul class="dtree">' + node(tree) + '</ul>';
    this.domSel.textContent = count ? '· tu código seleccionó ' + count + ' elemento' + (count > 1 ? 's' : '') : '';
    var first = this.domTree.querySelector('.sel');
    if (first) {
      var box = this.domTree, top = first.offsetTop - box.offsetTop;
      if (top < box.scrollTop || top > box.scrollTop + box.clientHeight - 30) box.scrollTop = Math.max(0, top - 40);
    }
  };

  Workbench.prototype.celebrate = function (text) {
    var fx = this.fx;
    fx.innerHTML = '<div class="fx-banner">' + U.esc(text || '✔ SISTEMA REPARADO') + '</div>';
    fx.classList.remove('show'); void fx.offsetWidth; fx.classList.add('show');
    setTimeout(function () { fx.classList.remove('show'); }, 2600);
  };

  Workbench.prototype.shake = function () {
    var w = this.el.querySelector('.scene-wrap');
    w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake');
  };

  Workbench.prototype.destroy = function () { CQ.Sandbox.stop(this.host); };

  /* =================================================================
     TABLERO PARA ORDENAR LÍNEAS (Actividad E)
     ================================================================= */
  function OrderBoard(host, lines, order, onChange) {
    this.host = host; this.lines = lines; this.order = order.slice(); this.onChange = onChange;
    this.render();
  }
  OrderBoard.prototype.code = function () {
    var ls = this.lines;
    return this.order.map(function (i) { return ls[i]; }).join('\n');
  };
  OrderBoard.prototype.render = function () {
    var self = this, ls = this.lines;
    this.host.innerHTML = '<div class="order-board" data-protected="1"><p class="ob-help">Arrastra cada pieza (o usa ▲ ▼) hasta que el programa tenga sentido. La sangría ya está puesta.</p><ol class="ob-list">' +
      this.order.map(function (i, pos) {
        return '<li class="ob-item" data-i="' + i + '"><span class="ob-grip" aria-hidden="true">⋮⋮</span><span class="ob-n">' + (pos + 1) + '</span><pre class="ob-code">' + H.html(ls[i]) + '</pre>' +
          '<span class="ob-btns"><button type="button" data-mv="-1" aria-label="Subir línea">▲</button><button type="button" data-mv="1" aria-label="Bajar línea">▼</button></span></li>';
      }).join('') + '</ol></div>';
    var list = this.host.querySelector('.ob-list');
    list.addEventListener('click', function (e) {
      var b = e.target.closest('[data-mv]');
      if (!b) return;
      var li = b.closest('.ob-item'), idx = [].indexOf.call(list.children, li), to = idx + (+b.dataset.mv);
      if (to < 0 || to >= self.order.length) return;
      var tmp = self.order[idx]; self.order[idx] = self.order[to]; self.order[to] = tmp;
      self.render();
      self.host.querySelectorAll('.ob-item')[to].querySelector('[data-mv="' + b.dataset.mv + '"]').focus();
      self.onChange(self.order);
    });
    list.addEventListener('pointerdown', function (e) {
      var li = e.target.closest('.ob-item');
      if (!li || e.target.closest('button')) return;
      e.preventDefault();
      li.setPointerCapture(e.pointerId);
      li.classList.add('dragging');
      function move(ev) {
        var prev = li.previousElementSibling, next = li.nextElementSibling, y = ev.clientY;
        if (prev && y < prev.getBoundingClientRect().top + prev.offsetHeight / 2) list.insertBefore(li, prev);
        else if (next && y > next.getBoundingClientRect().top + next.offsetHeight / 2) list.insertBefore(next, li);
      }
      function up() {
        li.classList.remove('dragging');
        li.removeEventListener('pointermove', move);
        li.removeEventListener('pointerup', up);
        li.removeEventListener('pointercancel', up);
        self.order = [].map.call(list.children, function (x) { return +x.dataset.i; });
        self.render();
        self.onChange(self.order);
      }
      li.addEventListener('pointermove', move);
      li.addEventListener('pointerup', up);
      li.addEventListener('pointercancel', up);
    });
  };

  function shuffled(n, seedStr) {
    var seed = 0;
    for (var i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
    function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    var a = [];
    for (var k = 0; k < n; k++) a.push(k);
    for (var tries = 0; tries < 10; tries++) {
      for (var j = n - 1; j > 0; j--) { var r = Math.floor(rnd() * (j + 1)); var t = a[j]; a[j] = a[r]; a[r] = t; }
      if (a.some(function (v, idx) { return v !== idx; })) break;
    }
    return a;
  }

  /* =================================================================
     PANTALLA DE NIVEL
     ================================================================= */
  var cur = null;

  function close() {
    if (!cur) return;
    if (cur.wb) cur.wb.destroy();
    clearTimeout(cur.pixelTimer);
    P.stopTimer();
    cur = null;
  }

  function apiBox(scene) {
    var w = CQ.Worlds.get(scene && scene.world);
    if (!w.api || !w.api.length) return '';
    return '<details class="api"><summary>📟 Herramientas disponibles en este escenario</summary><ul>' +
      w.api.map(function (a) { return '<li><code>' + U.esc(a[0]) + '</code> — ' + U.esc(a[1]) + '</li>'; }).join('') + '</ul></details>';
  }

  function open(id) {
    close();
    var level = CQ.Levels.level(id);
    var lp = P.level(id);
    var phases = PHASES.filter(function (p) { return level[p.key]; });
    if (level.special) phases = [{ key: 'solve', label: 'Misión especial', icon: '⭐' }];
    var root = document.getElementById('app');
    var b = level.block;
    root.innerHTML =
      '<section class="screen level-screen" style="--accent:' + (b.color || '#22d3ee') + '">' +
      '<header class="topbar"><button type="button" class="btn ghost" data-go="map">← Mapa</button>' +
      '<div class="lv-title"><small>' + b.icon + ' Bloque ' + b.n + ' · ' + U.esc(b.name) + '</small><h1>' + (level.special ? 'Misión especial' : 'Nivel ' + level.num) + ' · ' + U.esc(level.title) + '</h1></div>' +
      '<div class="hud" data-hud></div></header>' +
      '<nav class="phases" aria-label="Fases del nivel"></nav>' +
      '<div class="lv-body"><aside class="lv-panel" tabindex="-1"></aside><main class="workbench" aria-label="Banco de trabajo"></main></div>' +
      '<div class="buddy"><div class="buddy-bubble" hidden></div><div class="buddy-bot" title="Pixel, tu asistente">' + CQ.Worlds.pixelSvg + '</div></div>' +
      '</section>';
    cur = {
      level: level, lp: lp, phases: phases, root: root,
      panel: root.querySelector('.lv-panel'),
      wb: new Workbench(root.querySelector('.workbench')),
      phase: null
    };
    root.querySelector('[data-go=map]').addEventListener('click', function () { CQ.App.go('#/mapa'); });
    root.querySelector('.buddy-bot').addEventListener('click', function () { say(level.story ? stripTags(level.story) : '¡Vamos!', ''); });
    CQ.App.renderHud();
    P.get().lastLevel = id;
    P.save();
    P.startTimer(id);
    var first = phases.find(function (p) { return !lp.done[p.key]; });
    selectPhase(lp.passed || !first ? phases[0].key : first.key);
  }

  function stripTags(s) { var d = document.createElement('div'); d.innerHTML = s; return d.textContent; }

  function say(text, mood) {
    if (!cur) return;
    var bub = cur.root.querySelector('.buddy-bubble'), bot = cur.root.querySelector('.buddy-bot');
    bub.textContent = text;
    bub.hidden = false;
    bot.className = 'buddy-bot ' + (mood || '');
    clearTimeout(cur.pixelTimer);
    cur.pixelTimer = setTimeout(function () { bub.hidden = true; bot.className = 'buddy-bot'; }, 7000);
  }

  function accessible(idx) {
    if (cur.lp.passed) return true;
    for (var i = 0; i < idx; i++) if (!cur.lp.done[cur.phases[i].key]) return false;
    return true;
  }

  function renderStepper() {
    var nav = cur.root.querySelector('.phases');
    nav.innerHTML = cur.phases.map(function (p, i) {
      var done = cur.lp.done[p.key], acc = accessible(i), now = cur.phase === p.key;
      return '<button type="button" class="phase' + (done ? ' done' : '') + (now ? ' now' : '') + (!acc ? ' locked' : '') + '" data-ph="' + p.key + '"' + (acc ? '' : ' disabled') + (now ? ' aria-current="step"' : '') + '>' +
        '<span class="ph-n">' + (done ? '✓' : (acc ? i + 1 : '🔒')) + '</span><span class="ph-l">' + p.icon + ' ' + p.label + '</span></button>';
    }).join('<span class="ph-sep" aria-hidden="true"></span>');
    [].forEach.call(nav.querySelectorAll('[data-ph]'), function (b) {
      b.addEventListener('click', function () { selectPhase(b.dataset.ph); });
    });
  }

  function selectPhase(key) {
    cur.phase = key;
    renderStepper();
    cur.panel.scrollTop = 0;
    var L = cur.level;
    if (key === 'learn') renderLearn(L);
    else if (key === 'observe') renderObserve(L);
    else if (key === 'experiment') renderExperiment(L);
    else renderChallenge(L, key);
  }

  function completePhase(key, xp) {
    if (cur.lp.done[key]) return;
    cur.lp.done[key] = true;
    if (xp) { var r = P.addXP(xp); notifyXP(r, cur.root.querySelector('.phases .now')); }
    P.save();
    renderStepper();
  }

  function notifyXP(r, anchor) {
    if (!r || !r.gained) return;
    U.floatText('+' + r.gained + ' XP', anchor || null, 'xp');
    if (r.leveledUp) U.toast('⬆️ ¡Subiste de rango! Ahora eres: ' + r.rank.name, 'success', 4500);
    CQ.App.renderHud();
  }

  function nextPhase() {
    var i = cur.phases.findIndex(function (p) { return p.key === cur.phase; });
    if (i < cur.phases.length - 1) selectPhase(cur.phases[i + 1].key);
    else endNav();
  }

  function endNav() {
    var L = cur.level;
    if (L.special) return CQ.App.go('#/mapa');
    var nx = CQ.Levels.next(L.id);
    if (cur.lp.passed && nx && P.isLevelUnlocked(nx.id)) CQ.App.go('#/nivel/' + nx.id);
    else CQ.App.go('#/mapa');
  }

  function storyHtml(L) {
    return L.story ? '<div class="story"><div class="story-ico">📡</div><div>' + L.story + '</div></div>' : '';
  }

  /* -------------------------- FASE 1: APRENDE -------------------------- */
  function renderLearn(L) {
    var d = L.learn, wb = cur.wb;
    var card = function (cls, title, body) { return body ? '<div class="lcard ' + cls + '"><h3>' + title + '</h3>' + body + '</div>' : ''; };
    cur.panel.innerHTML = storyHtml(L) + '<div class="phase-intro"><h2>📘 Aprende</h2></div><div class="learn">' +
      card('', '¿Qué es?', d.what) +
      card('', '¿Para qué sirve?', d.why) +
      card('', '¿Cuándo se usa?', d.when) +
      card('wide', '¿Cómo se escribe?', (d.how ? H.block(d.how) : '') + (d.howNote || '')) +
      (d.symbols ? '<div class="lcard wide"><h3>Símbolos nuevos</h3><table class="sym">' + d.symbols.map(function (s) { return '<tr><td><code>' + U.esc(s[0]) + '</code></td><td>' + s[1] + '</td></tr>'; }).join('') + '</table></div>' : '') +
      card('warn', '⚠️ Errores frecuentes', d.mistakes ? '<ul>' + d.mistakes.map(function (m) { return '<li>' + m + '</li>'; }).join('') + '</ul>' : '') +
      card('idea', '💡 Analogía', d.analogy) +
      (d.extra || '') +
      '</div><div class="panel-actions"><button type="button" class="btn primary" data-next>Entendido: ¡a observar! →</button></div>';
    cur.panel.querySelector('[data-next]').addEventListener('click', function () { completePhase('learn', 10); nextPhase(); });
    wb.layout({ editor: false, console: false });
    wb.setTools([]);
    wb.run(L.learn.demo || '', setupFor(L.learn, L), L.learn.scene || L.scene, { silent: true });
  }

  /* -------------------------- FASE 2: OBSERVA -------------------------- */
  function renderObserve(L) {
    var ob = L.observe, wb = cur.wb, steps = ob.steps || [], k = -1;
    var scene = ob.scene || L.scene, setup = setupFor(ob, L);
    cur.panel.innerHTML = '<div class="phase-intro"><h2>👁️ Observa</h2><p>' + (ob.intro || 'Recorre el ejemplo <b>paso a paso</b>: cada paso ejecuta el programa hasta esa línea y el escenario muestra lo que ocurre.') + '</p></div>' +
      '<ol class="steps">' + steps.map(function (s, i) {
        var ln = s.lines[0] === s.lines[1] ? 'Línea ' + s.lines[0] : 'Líneas ' + s.lines[0] + '–' + s.lines[1];
        return '<li class="step" data-i="' + i + '" tabindex="0"><span class="step-lines">' + ln + '</span><div class="step-text">' + s.text + '</div></li>';
      }).join('') + '</ol>' +
      '<div class="step-ctrl"><button type="button" class="btn small" data-st="-1">⏮ Anterior</button><span class="step-count">Paso 0 / ' + steps.length + '</span><button type="button" class="btn small primary" data-st="1">Siguiente paso ⏭</button></div>' +
      '<div class="result-box" hidden><h3>🔎 ¿Qué ocurrió?</h3>' + (ob.result || '') + '</div>' +
      '<div class="panel-actions"><button type="button" class="btn primary" data-next ' + (cur.lp.done.observe ? '' : 'disabled') + '>Continuar: experimentar →</button></div>';
    wb.layout({ editor: true, readOnly: true });
    wb.editor.setValue(ob.code);
    var lines = ob.code.split('\n');
    function finished() {
      cur.panel.querySelector('.result-box').hidden = false;
      cur.panel.querySelector('[data-next]').disabled = false;
      completePhase('observe', 10);
    }
    function go(i) {
      if (i < 0 || i >= steps.length) return;
      k = i;
      [].forEach.call(cur.panel.querySelectorAll('.step'), function (li, j) { li.classList.toggle('on', j === i); li.classList.toggle('seen', j < i); });
      cur.panel.querySelector('.step-count').textContent = 'Paso ' + (i + 1) + ' / ' + steps.length;
      var s = steps[i];
      wb.editor.markRange(s.lines[0], s.lines[1], 'step');
      var end = s.upTo || s.lines[1];
      if (s.run !== false) wb.run(lines.slice(0, end).join('\n'), setup, scene);
      if (i === steps.length - 1) finished();
    }
    [].forEach.call(cur.panel.querySelectorAll('.step'), function (li) {
      li.addEventListener('click', function () { go(+li.dataset.i); });
      li.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(+li.dataset.i); });
    });
    [].forEach.call(cur.panel.querySelectorAll('[data-st]'), function (b) {
      b.addEventListener('click', function () { go(k + (+b.dataset.st)); });
    });
    cur.panel.querySelector('[data-next]').addEventListener('click', nextPhase);
    function runAll() {
      wb.editor.clearMarks('step');
      wb.run(ob.code, setup, scene).then(finished);
    }
    wb.setTools([{ id: 'runall', label: '▶ Ejecutar todo', cls: 'primary', fn: runAll }]);
    wb.onRunKey = runAll;
    wb.run('', setup, scene, { silent: true });
  }

  /* ------------------------ FASE 3: EXPERIMENTA ------------------------ */
  function renderExperiment(L) {
    var ex = L.experiment, wb = cur.wb, st = P.get(), lp = cur.lp;
    var scene = ex.scene || L.scene, key = 'exp:' + L.id;
    lp.ideas = lp.ideas || {};
    var controls = ex.controls || [];
    cur.panel.innerHTML = '<div class="phase-intro"><h2>🧪 Experimenta</h2><p>' + (ex.intro || 'Este es tu laboratorio: cambia valores, ejecuta y observa qué pasa. Aquí <b>no hay evaluación</b>: equivocarse es parte del experimento.') + '</p></div>' +
      (controls.length ? '<div class="controls"><h3>🎛️ Controles del escenario</h3>' + controls.map(function (c, i) {
        var input;
        if (c.type === 'bool') input = '<input type="checkbox" data-c="' + i + '"' + (c.value ? ' checked' : '') + '>';
        else if (c.type === 'select') input = '<select data-c="' + i + '">' + c.options.map(function (o) { return '<option' + (o === c.value ? ' selected' : '') + '>' + U.esc(o) + '</option>'; }).join('') + '</select>';
        else input = '<input type="range" data-c="' + i + '" min="' + c.min + '" max="' + c.max + '" step="' + (c.step || 1) + '" value="' + c.value + '">';
        return '<label class="ctrl"><span><code>' + U.esc(c.var) + '</code> = <b data-cv="' + i + '">' + U.esc(String(c.value)) + '</b></span>' + input + '</label>';
      }).join('') + '<p class="muted">Al mover un control, el programa se ejecuta otra vez con ese valor.</p></div>' : '') +
      (ex.ideas ? '<div class="ideas"><h3>🔬 Ideas para probar</h3><ul>' + ex.ideas.map(function (t, i) {
        return '<li><label><input type="checkbox" data-idea="' + i + '"' + (lp.ideas[i] ? ' checked' : '') + '> <span>' + t + '</span></label></li>';
      }).join('') + '</ul><p class="muted">Marca las ideas que ya probaste.</p></div>' : '') +
      '<div class="panel-actions"><button type="button" class="btn primary" data-next ' + (lp.done.experiment ? '' : 'disabled') + '>Continuar: ¡al reto! →</button></div>';
    var values = controls.map(function (c) { return c.value; });
    function ctrlSetup() {
      return controls.map(function (c, i) { return 'var ' + c.var + ' = ' + JSON.stringify(values[i]) + ';'; }).join('\n');
    }
    function runExp() {
      return wb.run(wb.editor.getValue(), setupFor(ex, L) + '\n' + ctrlSetup(), scene).then(function () {
        lp.expRuns = (lp.expRuns || 0) + 1;
        st.stats.experiments++;
        if (st.stats.experiments >= 20) P.award('curioso');
        cur && cur.panel.querySelector('[data-next]') && (cur.panel.querySelector('[data-next]').disabled = false);
        completePhase('experiment', 15);
      });
    }
    var autoRun = U.debounce(runExp, 280);
    [].forEach.call(cur.panel.querySelectorAll('[data-c]'), function (inp) {
      inp.addEventListener('input', function () {
        var i = +inp.dataset.c, c = controls[i];
        values[i] = c.type === 'bool' ? inp.checked : c.type === 'select' ? (typeof c.options[0] === 'number' ? Number(inp.value) : inp.value) : Number(inp.value);
        cur.panel.querySelector('[data-cv="' + i + '"]').textContent = String(values[i]);
        autoRun();
      });
    });
    [].forEach.call(cur.panel.querySelectorAll('[data-idea]'), function (inp) {
      inp.addEventListener('change', function () { lp.ideas[inp.dataset.idea] = inp.checked; P.save(); });
    });
    cur.panel.querySelector('[data-next]').addEventListener('click', nextPhase);
    wb.layout({ editor: true });
    wb.editor.setValue(st.drafts[key] != null ? st.drafts[key] : ex.code);
    wb.onChange = U.debounce(function (v) { st.drafts[key] = v; P.save(); }, 400);
    wb.onRunKey = runExp;
    wb.setTools([
      { id: 'run', label: '▶ Ejecutar', cls: 'primary', fn: runExp, title: 'Ctrl + Enter' },
      { id: 'restore', label: '↺ Restaurar ejemplo', cls: 'ghost', fn: function () { wb.editor.setValue(ex.code); delete st.drafts[key]; P.save(); } }
    ]);
    wb.run('', setupFor(ex, L) + '\n' + ctrlSetup(), scene, { silent: true });
  }

  /* -------------------- FASES 4 y 5: RESUELVE / DEMUESTRA -------------------- */
  function starterFor(ch) {
    if (!ch.carry) return ch.starter || '';
    var parts = [], ok = true;
    ch.carry.forEach(function (ref) {
      var p = ref.split(':'), c = P.challenge(p[0], p[1]);
      if (c.passed && c.code) parts.push('// ── Tu código del nivel anterior ──\n' + c.code.trim());
      else ok = false;
    });
    return (ok ? parts.join('\n\n') : (ch.carryFallback || '')) + '\n\n' + (ch.starter || '');
  }

  function renderChallenge(L, key) {
    var ch = L[key], wb = cur.wb, st = P.get(), lp = cur.lp;
    var cp = P.challenge(L.id, key);
    var act = CQ.Levels.ACTIVITIES[ch.activity] || { name: 'Reto', icon: '🎯' };
    var mode = ch.mode || 'code';
    var scene = ch.scene || L.scene;
    var setup = setupFor(ch, L);
    var crit = mode === 'predict' ? [] : CQ.Evaluator.criteria(ch);
    var draftKey = L.id + ':' + key;
    var busy = false, board = null;
    var phaseLbl = L.special ? '⭐ Misión especial' : key === 'solve' ? 'Fase 4 · Resuelve' : 'Fase 5 · Demuestra';

    cur.panel.innerHTML =
      '<div class="ch-head"><span class="act-tag">' + act.icon + ' Actividad ' + ch.activity + ' · ' + act.name + '</span><span class="ch-phase">' + phaseLbl + '</span></div>' +
      '<h2 class="ch-title">' + U.esc(ch.title) + '</h2>' +
      (ch.story ? '<p class="ch-story">' + ch.story + '</p>' : '') +
      '<div class="objective"><h3>🎯 Objetivo</h3>' + ch.goal + '</div>' +
      apiBox(scene) +
      (mode === 'predict' ? '<div class="predict"><h3>🔮 ' + (ch.question || '¿Qué mostrará la consola?') + '</h3><p class="muted">Razona primero. Después ejecutaremos el código para comprobarlo.</p><div class="opts" role="radiogroup">' +
        ch.options.map(function (o, i) { return '<label class="opt"><input type="radio" name="pred" value="' + i + '"><span>' + o + '</span></label>'; }).join('') +
        '</div><button type="button" class="btn primary" data-pred>Comprobar mi predicción</button></div>' : '') +
      (crit.length ? '<div class="criteria"><h3>✅ Criterios de evaluación</h3><ul>' + crit.map(function (c) {
        return '<li data-k="' + c.key + '"><span class="ci" aria-hidden="true">○</span><span class="ct">' + fmt(c.label) + '<small class="cm"></small></span></li>';
      }).join('') + '</ul></div>' : '') +
      (ch.hints && ch.hints.length ? '<div class="hints"><button type="button" class="btn small" data-hint>💡 <span data-hn>Pedir pista (' + cp.hints + '/' + ch.hints.length + ')</span></button><ol class="hint-list"></ol><p class="muted small">Las pistas orientan sin dar la solución. Descuentan un poco de puntuación, pero nunca te bloquean.</p></div>' : '') +
      '<div class="feedback" aria-live="polite"></div>' +
      '<div class="ch-done" hidden></div>';

    var fb = cur.panel.querySelector('.feedback');
    var done = cur.panel.querySelector('.ch-done');

    function renderHints() {
      var list = cur.panel.querySelector('.hint-list');
      if (!list) return;
      list.innerHTML = ch.hints.slice(0, cp.hints).map(function (h, i) {
        return '<li class="hint"><b>Pista ' + (i + 1) + ':</b> ' + h + '</li>';
      }).join('');
      cur.panel.querySelector('[data-hn]').textContent = 'Pedir pista (' + cp.hints + '/' + ch.hints.length + ')';
      cur.panel.querySelector('[data-hint]').disabled = cp.hints >= ch.hints.length;
    }
    renderHints();
    var hb = cur.panel.querySelector('[data-hint]');
    if (hb) hb.addEventListener('click', function () {
      if (cp.hints >= ch.hints.length) return;
      cp.hints++; st.stats.hintsUsed++; P.save();
      renderHints();
      say('Ahí tienes una pista. Léela y vuelve a intentarlo a tu manera.', '');
    });

    function paintCriteria(items) {
      (items || []).forEach(function (it) {
        var li = cur.panel.querySelector('[data-k="' + it.key + '"]');
        if (!li) return;
        li.className = it.ok === true ? 'ok' : it.ok === false ? 'bad' : '';
        li.querySelector('.ci').textContent = it.ok === true ? '✔' : it.ok === false ? '✘' : '○';
        li.querySelector('.cm').innerHTML = it.ok === false && it.msg ? ' — ' + fmt(it.msg) : '';
      });
    }
    function resetCriteria() { paintCriteria(crit.map(function (c) { return { key: c.key, ok: null }; })); }

    function showDone() {
      done.hidden = false;
      var isLast = cur.phases[cur.phases.length - 1].key === key;
      done.innerHTML = '<div class="done-box">✅ Reto superado · mejor puntuación <b>' + cp.best + '%</b></div>' +
        '<div class="panel-actions"><button type="button" class="btn ghost" data-retry>↺ Volver a intentarlo</button>' +
        '<button type="button" class="btn primary" data-cont>' + (isLast ? (L.special ? 'Volver al mapa →' : 'Terminar nivel →') : 'Continuar: demuestra lo aprendido →') + '</button></div>';
      done.querySelector('[data-cont]').addEventListener('click', nextPhase);
      done.querySelector('[data-retry]').addEventListener('click', function () {
        cp.fails = 0; cp.hints = 0;
        delete st.drafts[draftKey];
        cp.order = null;
        P.save();
        renderChallenge(L, key);
      });
    }

    function getCode() { return mode === 'order' ? board.code() : mode === 'predict' ? ch.code : wb.editor.getValue(); }

    function pass(code) {
      var first = !cp.passed;
      var score = P.scoreFor(cp.fails, cp.hints);
      var improved = score > cp.best;
      cp.passed = true;
      cp.best = Math.max(cp.best, score);
      cp.code = code;
      var xp = 0, reasons = [];
      if (first) {
        xp += 50; reasons.push('reto superado +50');
        if (!cp.hints) { xp += 15; reasons.push('sin pistas +15'); st.stats.noHintChallenges++; }
        if (!cp.fails) { xp += 10; reasons.push('a la primera +10'); }
        else if (cp.fails >= 2) { xp += 10; reasons.push('perseverancia +10'); }
      } else if (improved) { xp += 10; reasons.push('mejoraste tu marca +10'); }
      if (cp.fails >= 1) P.award('depurador');
      if (cp.fails >= 3) P.award('persistente');
      if (st.stats.noHintChallenges >= 5) P.award('sin-pistas');
      if (mode === 'predict' && !cp.fails) { st.stats.predictionsFirstTry++; if (st.stats.predictionsFirstTry >= 5) P.award('oraculo'); }
      lp.done[key] = true;
      P.save();
      var r = xp ? P.addXP(xp) : null;
      notifyXP(r, cur.panel.querySelector('.ch-title'));
      renderStepper();
      wb.celebrate(ch.celebrate || '✔ SISTEMA REPARADO');
      U.confetti(60);
      say(U.pick(U.pixel.cheer), 'happy');
      fb.innerHTML = '<div class="fb good"><b>✔ ¡Misión cumplida!</b> ' + (ch.success || '') +
        (mode === 'predict' && ch.explain ? '<div class="explain">' + ch.explain + '</div>' : '') +
        '<div class="score">Puntuación del reto: <b>' + score + '%</b>' + (reasons.length ? ' · ' + reasons.join(' · ') : '') + '</div></div>';
      showDone();
      checkLevelComplete(key);
    }

    function fail(ev) {
      cp.fails++;
      P.save();
      var bad = ev.items.find(function (i) { return i.ok === false; });
      var html = '<div class="fb bad"><b>Todavía no.</b> ' + (bad ? fmt(bad.msg || bad.label) : '') + '</div>';
      if (ev.error) {
        html += wb.errorCard(ev.error);
        if (ev.error.line) wb.editor.mark(ev.error.line, 'err');
      }
      if (ev.tips && ev.tips.length) html += '<div class="fb tip">💡 ' + ev.tips[0].html + '</div>';
      if (cp.fails >= 2 && ch.hints && cp.hints < ch.hints.length) html += '<div class="fb hint-sug">¿Necesitas orientación? Pide una pista: te ayuda a razonar sin darte la respuesta.</div>';
      fb.innerHTML = html;
      wb.shake();
      say(U.pick(cp.fails >= 3 ? U.pixel.persist : U.pixel.fail), 'sad');
    }

    async function check() {
      if (busy) return;
      busy = true;
      var code = getCode();
      cp.attempts++; lp.attempts++; st.stats.runs++; P.save();
      fb.innerHTML = '<div class="fb wait">⏳ Ejecutando tu programa y sus pruebas en el entorno aislado…</div>';
      done.hidden = true;
      resetCriteria();
      wb.setBusy(true);
      try {
        await wb.run(code, setup, scene);
        wb.setBusy(true);
        var ev = await CQ.Evaluator.evaluate(ch, code, scene, setup);
        paintCriteria(ev.items);
        if (ev.passed) pass(code); else fail(ev);
      } finally {
        busy = false;
        if (cur) cur.wb.setBusy(false);
      }
    }

    async function checkPrediction() {
      if (busy) return;
      var sel = cur.panel.querySelector('input[name=pred]:checked');
      if (!sel) { U.toast('Elige primero una opción: ¿qué crees que pasará?', 'info'); return; }
      busy = true;
      cp.attempts++; lp.attempts++; P.save();
      var idx = +sel.value;
      await wb.run(ch.code, setup, scene);
      busy = false;
      [].forEach.call(cur.panel.querySelectorAll('.opt'), function (o, i) {
        o.classList.toggle('right', i === ch.answer && idx === ch.answer);
        o.classList.toggle('wrong', i === idx && idx !== ch.answer);
      });
      if (idx === ch.answer) pass(ch.code);
      else {
        cp.fails++; P.save();
        fb.innerHTML = '<div class="fb bad"><b>Tu predicción no coincide con lo que ocurrió.</b> Compara la consola y el escenario con tu razonamiento: ¿qué línea no se comportó como esperabas? Luego elige de nuevo.</div>' +
          (ch.wrongHint ? '<div class="fb tip">💡 ' + ch.wrongHint + '</div>' : '');
        wb.shake();
        say('¡Predecir y equivocarse también enseña! Mira qué pasó realmente.', 'sad');
      }
    }

    // --- Configuración del banco de trabajo según el modo ---
    if (mode === 'predict') {
      wb.layout({ editor: true, readOnly: true });
      wb.editor.setValue(ch.code);
      wb.setTools([]);
      cur.panel.querySelector('[data-pred]').addEventListener('click', checkPrediction);
      wb.run('', setup, scene, { silent: true });
    } else if (mode === 'order') {
      wb.layout({ editor: false, order: true });
      var order = cp.order && cp.order.length === ch.lines.length ? cp.order : shuffled(ch.lines.length, L.id + key);
      board = new OrderBoard(wb.orderHost, ch.lines, order, function (o) { cp.order = o.slice(); P.save(); });
      wb.setTools([
        { id: 'run', label: '▶ Ejecutar', fn: function () { wb.run(board.code(), setup, scene); } },
        { id: 'check', label: '✔ Comprobar misión', cls: 'primary', fn: check },
        { id: 'shuffle', label: '🔀 Mezclar', cls: 'ghost', fn: function () { cp.order = null; P.save(); board.order = shuffled(ch.lines.length, L.id + Date.now()); board.render(); } }
      ]);
      wb.run('', setup, scene, { silent: true });
    } else {
      wb.layout({ editor: true });
      wb.editor.setValue(st.drafts[draftKey] != null ? st.drafts[draftKey] : starterFor(ch));
      wb.onChange = U.debounce(function (v) { st.drafts[draftKey] = v; P.save(); }, 400);
      wb.onRunKey = function () { wb.run(wb.editor.getValue(), setup, scene); };
      wb.setTools([
        { id: 'run', label: '▶ Ejecutar', fn: wb.onRunKey, title: 'Ejecuta y observa (Ctrl + Enter). No cuenta como intento.' },
        { id: 'check', label: '✔ Comprobar misión', cls: 'primary', fn: check, title: 'Ejecuta las pruebas de evaluación' },
        { id: 'reset', label: '↺ Reiniciar código', cls: 'ghost', fn: function () {
          U.confirm('¿Reiniciar el código?', 'Se borrará lo que escribiste en este reto y volverá el código inicial. Tu progreso del nivel no se pierde.', 'Reiniciar', function () {
            wb.editor.setValue(starterFor(ch)); delete st.drafts[draftKey]; P.save();
          });
        } }
      ]);
      wb.run(setup && ch.runStarter ? wb.editor.getValue() : '', setup, scene, { silent: true });
    }
    if (cp.passed) {
      fb.innerHTML = '<div class="fb good">Ya superaste este reto. Puedes revisarlo, seguir practicando o intentarlo de nuevo para mejorar tu puntuación.</div>';
      showDone();
    }
  }

  /* ------------------------- Nivel completado ------------------------- */
  function checkLevelComplete(key) {
    var L = cur.level, lp = cur.lp, st = P.get();
    if (L.special) {
      if (!st.specials[L.id]) {
        st.specials[L.id] = true;
        notifyXP(P.addXP(80));
        P.award('especial');
      }
      return;
    }
    var keys = ['solve', 'prove'].filter(function (k) { return L[k]; });
    var chs = keys.map(function (k) { return P.challenge(L.id, k); });
    if (!chs.every(function (c) { return c.passed; })) return;
    var score = Math.round(chs.reduce(function (s, c) { return s + c.best; }, 0) / chs.length);
    var firstPass = !lp.passed;
    lp.passed = true;
    lp.best = Math.max(lp.best, score);
    var xp = firstPass ? 30 : 0;
    var n = L.block.n, bs = P.blockStats(n), newBlock = null;
    if (bs.approved && !st.badges['b' + n]) { xp += 100; newBlock = P.award('b' + n); }
    P.save();
    var r = xp ? P.addXP(xp) : null;
    CQ.App.renderHud();
    if (key !== keys[keys.length - 1] && !firstPass) return;
    var nx = CQ.Levels.next(L.id);
    var nextOk = nx && P.isLevelUnlocked(nx.id);
    var html = '<div class="lvl-done"><div class="big-ico">' + (newBlock ? newBlock.icon : '🎉') + '</div>' +
      '<p>Completaste <b>' + U.esc(L.title) + '</b>.</p>' +
      '<div class="stat-row"><div><b>' + lp.best + '%</b><small>desempeño del nivel</small></div><div><b>' + (r ? '+' + r.gained : '+0') + '</b><small>XP extra</small></div><div><b>' + bs.passed + '/' + bs.total + '</b><small>niveles del bloque</small></div></div>';
    if (newBlock) html += '<div class="fb good">🏅 ¡Bloque ' + n + ' aprobado con ' + bs.perf + '% de desempeño! Insignia: <b>' + newBlock.icon + ' ' + newBlock.name + '</b>. ' + (CQ.Levels.block(n + 1) ? 'Se desbloqueó el siguiente distrito de Neópolis.' : '¡Has reactivado toda la ciudad!') + '</div>';
    else if (bs.complete && !bs.approved) html += '<div class="fb tip">Completaste todos los niveles del bloque, pero tu desempeño es <b>' + bs.perf + '%</b>. Necesitas <b>' + P.PASS_PERF + '%</b> para aprobarlo: repite algún nivel (se conserva tu mejor puntuación).</div>';
    html += '</div>';
    var buttons = [{ label: 'Volver al mapa', cls: 'ghost', action: function () { CQ.App.go('#/mapa'); } }];
    if (nextOk) buttons.push({ label: 'Siguiente nivel →', cls: 'primary', action: function () { CQ.App.go('#/nivel/' + nx.id); } });
    else buttons.push({ label: 'Seguir aquí', cls: 'primary' });
    setTimeout(function () {
      U.confetti(120);
      U.modal({ title: newBlock && !CQ.Levels.block(n + 1) ? '🏙️ ¡Neópolis reactivada!' : '¡Nivel superado!', html: html, buttons: buttons, cls: 'celebrate' });
    }, 900);
  }

  /* =================================================================
     LABORATORIO LIBRE (Actividad F)
     ================================================================= */
  var LAB_PAGE = '<div id="app-demo"><h1 id="titulo">Mi página de pruebas</h1><p class="texto">Edita este párrafo con JavaScript.</p>' +
    '<ul id="lista"><li>Uno</li><li>Dos</li></ul><input id="campo" placeholder="Escribe aquí"><button id="boton">Botón</button><div id="caja" class="caja"></div></div>';
  var LAB_SCENES = {
    memory: { label: '📦 Memoria (variables como cajas)', scene: { world: 'memory', watch: 'auto', title: 'Laboratorio · memoria' }, code: 'let nombre = "Pixel";\nlet bateria = 75;\nlet activo = true;\nlet piezas = ["chip", "cable", "tornillo"];\nlet robot = { modelo: "PX-1", nivel: 3 };\n\nbateria = bateria + 10;\nconsole.log(nombre, bateria);\n' },
    terminal: { label: '🖥️ Terminal de Pixel', scene: { world: 'terminal', title: 'LABORATORIO LIBRE' }, code: 'console.log("¡Hola, laboratorio!");\nconsole.log(2 + 3 * 4);\n' },
    page: { label: '🌳 Página web (DOM)', scene: { world: 'page', html: LAB_PAGE, css: '.caja{width:80px;height:80px;background:#334155;border-radius:12px;margin-top:10px;transition:all .4s}.caja.activa{background:#a3e635;box-shadow:0 0 20px #a3e635}' }, code: 'const titulo = document.querySelector("#titulo");\ntitulo.textContent = "¡Lo cambié con JavaScript!";\n\ndocument.querySelector("#boton").addEventListener("click", function () {\n  document.querySelector("#caja").classList.toggle("activa");\n});\n' },
    robot: { label: '🤖 Pista del robot', scene: { world: 'robot', n: 10, crystals: [2, 5, 8] }, code: 'for (let i = 0; i < 9; i++) {\n  if (robot.hayCristal()) {\n    robot.recoger();\n  }\n  robot.avanzar();\n}\nrobot.decir("¡Terminé!");\n' },
    lights: { label: '💡 Avenida de luces', scene: { world: 'lights', n: 8 }, code: 'for (let i = 0; i < 8; i += 2) {\n  encenderLuz(i);\n}\n' },
    factory: { label: '🏭 Fábrica', scene: { world: 'factory', pesos: [12, 30, 7, 22] }, code: 'let total = 0;\nfor (let i = 0; i < cajas; i++) {\n  total += pesoCaja(i);\n}\nmostrarTotal(total);\nfabricar("engranaje");\n' },
    door: { label: '🚪 Puerta inteligente', scene: { world: 'door', sensors: ['energia'] }, setup: 'var energia = 60;', code: 'if (energia >= 50) {\n  abrirPuerta();\n} else {\n  mostrarAlerta("Energía insuficiente");\n}\n' },
    traffic: { label: '🚦 Semáforo', scene: { world: 'traffic' }, code: 'cambiarLuz("verde");\n' }
  };

  function openLab() {
    close();
    var st = P.get(), root = document.getElementById('app');
    var which = st.labWorld && LAB_SCENES[st.labWorld] ? st.labWorld : 'memory';
    root.innerHTML = '<section class="screen level-screen lab-screen" style="--accent:#a3e635">' +
      '<header class="topbar"><button type="button" class="btn ghost" data-go="map">← Mapa</button>' +
      '<div class="lv-title"><small>🧪 Actividad F</small><h1>Laboratorio libre</h1></div><div class="hud" data-hud></div></header>' +
      '<div class="lv-body"><aside class="lv-panel"><div class="phase-intro"><h2>🧪 Experimenta sin límites</h2><p>Aquí no hay evaluación ni pruebas: escribe lo que quieras, ejecútalo y observa. Tu código se guarda automáticamente para cada escenario.</p></div>' +
      '<label class="ctrl block"><span>Escenario</span><select data-world>' + Object.keys(LAB_SCENES).map(function (k) { return '<option value="' + k + '"' + (k === which ? ' selected' : '') + '>' + LAB_SCENES[k].label + '</option>'; }).join('') + '</select></label>' +
      '<div data-api></div><div class="lcard idea"><h3>💡 Sugerencias</h3><ul><li>Rompe el código a propósito y lee el mensaje de error.</li><li>Usa <code>console.log()</code> para "espiar" el valor de tus variables.</li><li>En el escenario de página, mira cómo se ilumina el árbol DOM al seleccionar elementos.</li></ul></div></aside>' +
      '<main class="workbench"></main></div></section>';
    cur = { lab: true, root: root, wb: new Workbench(root.querySelector('.workbench')), panel: root.querySelector('.lv-panel') };
    root.querySelector('[data-go=map]').addEventListener('click', function () { CQ.App.go('#/mapa'); });
    CQ.App.renderHud();
    var wb = cur.wb;
    function load(k) {
      which = k; st.labWorld = k; P.save();
      var cfg = LAB_SCENES[k];
      cur.panel.querySelector('[data-api]').innerHTML = apiBox(cfg.scene);
      var d = cur.panel.querySelector('details.api'); if (d) d.open = true;
      wb.layout({ editor: true });
      wb.editor.setValue(st.drafts['lab:' + k] != null ? st.drafts['lab:' + k] : cfg.code);
      wb.onChange = U.debounce(function (v) { st.drafts['lab:' + k] = v; P.save(); }, 400);
      wb.onRunKey = runLab;
      wb.setTools([
        { id: 'run', label: '▶ Ejecutar', cls: 'primary', fn: runLab, title: 'Ctrl + Enter' },
        { id: 'restore', label: '↺ Ejemplo inicial', cls: 'ghost', fn: function () { wb.editor.setValue(cfg.code); delete st.drafts['lab:' + k]; P.save(); } }
      ]);
      wb.run('', cfg.setup || '', cfg.scene, { silent: true });
    }
    function runLab() {
      var cfg = LAB_SCENES[which];
      wb.run(wb.editor.getValue(), cfg.setup || '', cfg.scene).then(function () {
        if (!st.stats.labRuns) { notifyXP(P.addXP(20)); P.award('laboratorio'); }
        st.stats.labRuns++;
        st.stats.experiments++;
        if (st.stats.experiments >= 20) P.award('curioso');
        P.save();
      });
    }
    cur.panel.querySelector('[data-world]').addEventListener('change', function (e) { load(e.target.value); });
    load(which);
  }

  CQ.Game = { open: open, openLab: openLab, close: close, Workbench: Workbench };
})(window.CQ = window.CQ || {});
