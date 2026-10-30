/* =====================================================================
   CODE QUEST · sandbox.js
   Ejecución AISLADA del código del estudiante.

   - Cada ejecución crea un <iframe sandbox="allow-scripts"> (sin
     allow-same-origin): el código no puede tocar la aplicación principal,
     ni su localStorage, ni sus variables.
   - La comunicación es solo por postMessage con un token único.
   - Los ciclos se instrumentan con un guardián (__lg) que detiene ciclos
     infinitos; además hay un temporizador que elimina el iframe si no
     responde a tiempo.
   - El iframe visible ES el escenario: lo que el código hace, se ve.
   ===================================================================== */
(function (CQ) {
  'use strict';

  /* -------------------------------------------------------------------
     RUNTIME: esta función se convierte en texto y se ejecuta DENTRO del
     iframe. No puede usar variables de fuera (se serializa).
     ------------------------------------------------------------------- */
  function RUNTIME(TOKEN, CFG) {
    var CQ = window.__CQ = {
      cfg: CFG, logs: [], logVals: [], errors: [], results: null,
      done: false, iter: 0, t0: Date.now(), loopKilled: false,
      visible: false, queue: [], playing: false, tracking: false,
      sel: [], world: null, isPage: CFG.world === 'page', phase: 'boot'
    };
    var PARENT = window.parent;
    var LOOP = '__CQ_LOOP__';
    function send(msg) { msg.token = TOKEN; try { PARENT.postMessage(msg, '*'); } catch (e) { /* datos no clonables */ } }
    CQ.send = send;

    /* --- Métodos originales del DOM (las pruebas los usan sin "marcar") --- */
    var DP = Document.prototype, EP = Element.prototype;
    var orig = {
      qs: DP.querySelector, qsa: DP.querySelectorAll, gid: DP.getElementById,
      gcn: DP.getElementsByClassName, gtn: DP.getElementsByTagName,
      eqs: EP.querySelector, eqsa: EP.querySelectorAll
    };
    CQ.$ = function (s) { return orig.qs.call(document, s); };
    CQ.$$ = function (s) { return orig.qsa.call(document, s); };

    /* --- Restricciones de copiar/pegar también dentro del escenario --- */
    function blockEv(e) { e.preventDefault(); send({ type: 'blocked', what: e.type }); }
    ['copy', 'cut', 'paste', 'drop'].forEach(function (t) { document.addEventListener(t, blockEv, true); });
    document.addEventListener('dragover', function (e) { e.preventDefault(); }, true);
    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (k === 'c' || k === 'v' || k === 'x' || e.code === 'KeyC' || e.code === 'KeyV' || e.code === 'KeyX')) blockEv(e);
      else if (e.shiftKey && k === 'insert') blockEv(e);
    }, true);
    document.addEventListener('beforeinput', function (e) {
      if (/^insertFrom(Paste|Drop|Yank|PasteAsQuotation)$/.test(e.inputType || '')) blockEv(e);
    }, true);

    /* --- Formato legible de valores (como una consola) --- */
    function fmt(v, d) {
      d = d || 0;
      if (v === null) return 'null';
      if (v === undefined) return 'undefined';
      var t = typeof v;
      if (t === 'string') return d ? JSON.stringify(v) : v;
      if (t === 'number' || t === 'boolean') return String(v);
      if (t === 'function') return 'ƒ ' + (v.name || 'anónima') + '()';
      if (t === 'symbol' || t === 'bigint') return String(v);
      if (v instanceof Element) {
        var s = '<' + v.tagName.toLowerCase();
        if (v.id) s += ' id="' + v.id + '"';
        var c = v.getAttribute('class');
        if (c) s += ' class="' + c + '"';
        return s + '>';
      }
      if (typeof NodeList !== 'undefined' && (v instanceof NodeList || v instanceof HTMLCollection)) {
        var items = [];
        for (var i = 0; i < v.length && i < 6; i++) items.push(fmt(v[i], d + 1));
        return (v instanceof NodeList ? 'NodeList' : 'HTMLCollection') + '(' + v.length + ') [' + items.join(', ') + (v.length > 6 ? ', …' : '') + ']';
      }
      if (v instanceof Event) return 'Evento ' + v.type;
      if (d > 2) return Array.isArray(v) ? '[…]' : '{…}';
      if (Array.isArray(v)) {
        return '[' + v.slice(0, 20).map(function (x) { return fmt(x, d + 1); }).join(', ') + (v.length > 20 ? ', …' : '') + ']';
      }
      if (v instanceof Error) return v.name + ': ' + v.message;
      try {
        var keys = Object.keys(v);
        return '{ ' + keys.slice(0, 12).map(function (k) { return k + ': ' + fmt(v[k], d + 1); }).join(', ') + (keys.length > 12 ? ', …' : '') + ' }';
      } catch (e) { return String(v); }
    }
    CQ.fmt = fmt;

    /* --- Consola propia --- */
    function pushLog(kind, args) {
      if (CQ.logs.length >= 300) {
        if (!CQ.logOverflow) { CQ.logOverflow = true; CQ.logs.push({ kind: 'warn', text: '… demasiados mensajes: se omiten los siguientes.' }); }
        return;
      }
      var text = args.map(function (a) { return typeof a === 'string' ? a : fmt(a, 0); }).join(' ');
      CQ.logs.push({ kind: kind, text: text });
      CQ.logVals.push(args);
      if (CQ.done && CQ.visible) send({ type: 'live-log', kind: kind, text: text });
      if (CQ.world && CQ.world.onLog) { try { CQ.world.onLog(text, kind); } catch (e) { /* visual */ } }
    }
    CQ.warn = function (text) { pushLog('warn', [text]); };
    var warned = {};
    CQ.warnOnce = function (text) { if (!warned[text]) { warned[text] = 1; pushLog('warn', [text]); } };
    var con = {};
    ['log', 'info', 'warn', 'error', 'debug'].forEach(function (k) {
      con[k] = function () { pushLog(k === 'debug' ? 'log' : k, [].slice.call(arguments)); };
    });
    con.table = con.log; con.dir = con.log; con.clear = function () {};
    window.console = con;
    window.alert = function (m) { pushLog('info', ['🔔 alert: ' + String(m)]); };
    window.prompt = function () { pushLog('warn', ['prompt() no está disponible en esta misión: usa variables.']); return null; };
    window.confirm = function () { return true; };

    /* --- Guardián de ciclos --- */
    window.__lg = function () {
      if (CQ.loopKilled) throw new Error(LOOP);
      CQ.iter++;
      if (CQ.iter > 100000 || ((CQ.iter & 1023) === 0 && Date.now() - CQ.t0 > 2500)) {
        CQ.loopKilled = true;
        throw new Error(LOOP);
      }
      return true;
    };
    // Los intervalos solo corren cuando el hilo está libre: nunca cortan un ciclo en curso.
    setInterval(function () { CQ.iter = 0; CQ.t0 = Date.now(); CQ.loopKilled = false; }, 400);

    /* --- Captura de errores con número de línea del estudiante --- */
    function lineFrom(err, filename, lineno, colno) {
      var st = (err && err.stack) || '';
      var m = /(mision|revision)\.js:(\d+)(?::(\d+))?/.exec(st);
      if (m) return { line: Math.max(0, +m[2] - 1), col: +m[3] || 0 };
      if (/(mision|revision)\.js/.test(filename || '')) return { line: Math.max(0, lineno - 1), col: colno || 0 };
      // Errores de sintaxis de un <script> insertado: la línea es relativa a ese script
      if ((CQ.phase === 'syntax' || CQ.phase === 'run') && lineno) return { line: Math.max(0, lineno - 1), col: colno || 0 };
      return { line: 0, col: 0 };
    }
    function recFrom(err, filename, lineno, colno, msgText) {
      var message = (err && err.message) || String(msgText || 'Error').replace(/^Uncaught\s+/, '').replace(/^\w*Error:\s*/, '');
      message = message.replace(/^Failed to execute '\w+' on '\w+':\s*/, '');
      var name = (err && err.name) || ((/^(?:Uncaught\s+)?(\w+Error)/.exec(msgText || '') || [])[1]) || 'Error';
      var pos = lineFrom(err, filename, lineno, colno);
      return { name: name, message: message, line: pos.line, col: pos.col, loop: message === LOOP, phase: CQ.phase };
    }
    CQ.recFrom = recFrom;
    window.addEventListener('error', function (e) {
      var rec = recFrom(e.error, e.filename, e.lineno, e.colno, e.message);
      CQ.errors.push(rec);
      if (CQ.done && CQ.visible) {
        send({ type: 'live-error', error: rec });
        if (CQ.world && CQ.world.onError) { try { CQ.world.onError(rec); } catch (x) { /* visual */ } }
      }
      e.preventDefault();
    });

    /* --- Seguimiento de selección de elementos (bloque DOM) --- */
    var ids = new WeakMap(), nextId = 1;
    function idOf(n) { var v = ids.get(n); if (!v) { v = nextId++; ids.set(n, v); } return v; }
    var host = null, shadow = null;
    function flash(el, color) {
      if (!CQ.visible || !el || !el.getBoundingClientRect) return;
      if (!host) {
        host = document.createElement('cq-overlay');
        document.documentElement.appendChild(host);
        shadow = host.attachShadow({ mode: 'closed' });
        var st = document.createElement('style');
        st.textContent = '.b{position:fixed;pointer-events:none;border:3px solid #f0abfc;border-radius:8px;box-shadow:0 0 0 4px rgba(232,121,249,.3),0 0 22px #e879f9;animation:f 1.8s ease-out forwards;z-index:2147483647}.b.k{border-color:#67e8f9;box-shadow:0 0 0 4px rgba(34,211,238,.3),0 0 22px #22d3ee}@keyframes f{0%{opacity:0;transform:scale(1.15)}15%{opacity:1;transform:scale(1)}75%{opacity:1}100%{opacity:0}}';
        shadow.appendChild(st);
      }
      var r = el.getBoundingClientRect();
      var b = document.createElement('div');
      b.className = 'b' + (color ? ' k' : '');
      b.style.left = (r.left - 4) + 'px'; b.style.top = (r.top - 4) + 'px';
      b.style.width = (r.width + 8) + 'px'; b.style.height = (r.height + 8) + 'px';
      shadow.appendChild(b);
      setTimeout(function () { b.remove(); }, 1900);
    }
    function mark(el, how) {
      if (!CQ.tracking || !el || el.nodeType !== 1) return;
      CQ.sel.push({ id: idOf(el), how: how });
      flash(el);
      scheduleFlush();
    }
    function markList(list, how) { for (var i = 0; i < list.length && i < 40; i++) mark(list[i], how); }
    DP.querySelector = function (s) { var r = orig.qs.call(this, s); mark(r, 'querySelector("' + s + '")'); return r; };
    DP.querySelectorAll = function (s) { var r = orig.qsa.call(this, s); markList(r, 'querySelectorAll("' + s + '")'); return r; };
    DP.getElementById = function (s) { var r = orig.gid.call(this, s); mark(r, 'getElementById("' + s + '")'); return r; };
    DP.getElementsByClassName = function (s) { var r = orig.gcn.call(this, s); markList(r, 'getElementsByClassName("' + s + '")'); return r; };
    DP.getElementsByTagName = function (s) { var r = orig.gtn.call(this, s); markList(r, 'getElementsByTagName("' + s + '")'); return r; };
    EP.querySelector = function (s) { var r = orig.eqs.call(this, s); mark(r, 'querySelector("' + s + '")'); return r; };
    EP.querySelectorAll = function (s) { var r = orig.eqsa.call(this, s); markList(r, 'querySelectorAll("' + s + '")'); return r; };

    /* --- Instantánea del árbol DOM --- */
    function snap(node, depth) {
      if (node.nodeType === 3) {
        var t = node.textContent.replace(/\s+/g, ' ').trim();
        return t ? { t: '#text', x: t.length > 38 ? t.slice(0, 36) + '…' : t } : null;
      }
      if (node.nodeType !== 1) return null;
      var tag = node.tagName.toLowerCase();
      if (tag === 'script' || tag === 'style' || tag === 'cq-overlay') return null;
      var o = { t: tag, i: idOf(node), id: node.id || '', c: node.getAttribute('class') || '', k: [] };
      if (node.style && node.style.cssText) o.s = 1;
      if (depth > 14) return o;
      for (var ch = node.firstChild; ch; ch = ch.nextSibling) { var s = snap(ch, depth + 1); if (s) o.k.push(s); }
      return o;
    }
    function domTree() {
      if (!document.body) return null;
      return { t: 'document', i: 0, k: [{ t: 'html', i: idOf(document.documentElement), k: [{ t: 'head', i: idOf(document.head), k: [], fold: 1 }, snap(document.body, 0)] }] };
    }
    var byId = function (id) {
      var all = orig.qsa.call(document, '*');
      for (var i = 0; i < all.length; i++) if (ids.get(all[i]) === id) return all[i];
      return null;
    };
    var flushTimer = null;
    function scheduleFlush() {
      if (!CQ.isPage || !CQ.visible || !CQ.done || flushTimer) return;
      flushTimer = setTimeout(function () {
        flushTimer = null;
        send({ type: 'dom', tree: domTree(), sel: CQ.sel.splice(0) });
      }, 80);
    }

    /* --- Cola de animaciones (solo en modo visible) --- */
    CQ.anim = function (fn, delay) {
      if (!CQ.visible || CQ.queue.length > 400) return;
      CQ.queue.push({ fn: fn, delay: delay == null ? 280 : delay });
      if (CQ.done && !CQ.playing) play();
    };
    function play() {
      if (CQ.playing) return;
      CQ.playing = true;
      (function next() {
        var it = CQ.queue.shift();
        if (!it) { CQ.playing = false; return; }
        try { it.fn(); } catch (e) { /* visual */ }
        setTimeout(next, it.delay);
      })();
    }

    /* --- Utilidades visuales compartidas por los mundos --- */
    CQ.esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    CQ.renderSensors = function (el, names) {
      if (!el || !names || !names.length) return;
      el.innerHTML = names.map(function (n) {
        var v = window[n];
        var shown = typeof v === 'boolean' ? (v ? '✔ true' : '✘ false') : fmt(v, 1);
        return '<div class="sensor">📡 ' + CQ.esc(n) + ' = <b>' + CQ.esc(shown) + '</b></div>';
      }).join('');
    };

    /* --- Herramientas para las pruebas automáticas --- */
    function norm(s) {
      return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[.!¡¿?,;:"'«»]/g, '').replace(/\s+/g, ' ').trim();
    }
    function guarded(fn, what) {
      var before = CQ.errors.length;
      fn();
      if (CQ.errors.length > before) {
        var e = CQ.errors[CQ.errors.length - 1];
        var x = new Error('Al ' + what + ', tu código produjo un error: ' + e.name + ': ' + e.message);
        x.cqError = e;
        throw x;
      }
    }
    function makeT(probe) {
      var t = {
        get: function (n) { return probe(n); },
        has: function (n) { try { probe(n); return true; } catch (e) { return false; } },
        typeOf: function (n) { try { return typeof probe(n); } catch (e) { return 'nodefinida'; } },
        isConst: function (n) { try { probe(n + '=' + n); return false; } catch (e) { return e instanceof TypeError; } },
        isFn: function (n) { return t.typeOf(n) === 'function'; },
        call: function (n) {
          var f;
          try { f = probe(n); } catch (e) { throw new Error('No encuentro la función ' + n + '. ¿La declaraste con ese nombre exacto?'); }
          if (typeof f !== 'function') throw new Error(n + ' no es una función.');
          var args = [].slice.call(arguments, 1);
          CQ.iter = 0; CQ.t0 = Date.now(); CQ.loopKilled = false;
          var r;
          guarded(function () { r = f.apply(null, args); }, 'probar ' + n + '(' + args.map(function (a) { return fmt(a, 1); }).join(', ') + ')');
          return r;
        },
        get logs() { return CQ.logs.filter(function (l) { return l.kind !== 'warn'; }).map(function (l) { return l.text; }); },
        get warnings() { return CQ.logs.filter(function (l) { return l.kind === 'warn'; }).map(function (l) { return l.text; }); },
        get values() { var out = []; CQ.logVals.forEach(function (a) { out.push.apply(out, a); }); return out; },
        get world() { return CQ.world ? CQ.world.state : null; },
        W: CQ.world,
        doc: document,
        $: CQ.$,
        $$: function (s) { return [].slice.call(CQ.$$(s)); },
        text: function (s) { var el = CQ.$(s); return el ? el.textContent.trim() : null; },
        cls: function (s, c) { var el = CQ.$(s); return !!el && el.classList.contains(c); },
        css: function (s, p) { var el = CQ.$(s); return el ? getComputedStyle(el)[p] : null; },
        click: function (s) {
          var el = typeof s === 'string' ? CQ.$(s) : s;
          if (!el) throw new Error('No existe el elemento ' + s + ' en la página.');
          guarded(function () { el.click(); }, 'hacer clic en ' + (typeof s === 'string' ? s : 'el elemento'));
        },
        write: function (s, value, evt) {
          var el = CQ.$(s);
          if (!el) throw new Error('No existe el elemento ' + s + ' en la página.');
          guarded(function () { el.value = value; el.dispatchEvent(new Event(evt || 'input', { bubbles: true })); }, 'escribir "' + value + '" en ' + s);
        },
        choose: function (s, value) { t.write(s, value, 'change'); },
        check: function (s, on) {
          var el = CQ.$(s);
          if (!el) throw new Error('No existe el elemento ' + s + ' en la página.');
          guarded(function () { el.checked = !!on; el.dispatchEvent(new Event('change', { bubbles: true })); }, 'marcar ' + s);
        },
        errorCount: function () { return CQ.errors.length; },
        raw: CQ.raw || '',
        src: CQ.src || '',
        count: function (re) { var m = (CQ.src || '').match(new RegExp(re.source || re, 'g')); return m ? m.length : 0; },
        show: function (v) { return fmt(v, 1); },
        norm: norm,
        logHas: function (s) { var n = norm(s); return t.logs.some(function (l) { return norm(l).indexOf(n) >= 0; }); },
        eq: function (a, b) { return JSON.stringify(a) === JSON.stringify(b); },
        near: function (a, b) { return typeof a === 'number' && Math.abs(a - b) < 1e-6; }
      };
      return t;
    }
    function compile(src) { return (0, eval)('(' + src + ')'); }

    CQ.finish = function (probe) {
      CQ.done = true;
      CQ.mainErrors = CQ.errors.length;
      CQ.probe = probe;
      try { if (CQ.world && CQ.world.finish) CQ.world.finish(probe); } catch (e) { /* visual */ }
      if (CQ.checks && CQ.checks.length) {
        var t = makeT(probe);
        CQ.results = CQ.checks.map(function (src) {
          CQ.iter = 0; CQ.t0 = Date.now(); CQ.loopKilled = false;
          try {
            var r = compile(src)(t);
            if (r === true) return { ok: true };
            return { ok: false, msg: typeof r === 'string' ? r : 'No se cumplió este criterio.' };
          } catch (e) {
            var rec = e.cqError || (/mision\.js/.test(e.stack || '') || e.message === LOOP ? recFrom(e) : null);
            var msg = e.message === LOOP ? 'Un ciclo de tu código no termina nunca.' : e.message;
            return { ok: false, msg: msg, error: rec };
          }
        });
      }
    };

    function finishRun(phase) {
      var res = {
        type: 'result', phase: phase, errors: CQ.errors.slice(), logs: CQ.logs.slice(),
        results: CQ.results || [], world: null
      };
      try { if (CQ.world && CQ.world.snapshot) res.world = JSON.parse(JSON.stringify(CQ.world.snapshot())); } catch (e) { /* sin estado */ }
      if (CQ.isPage) { res.tree = domTree(); res.sel = CQ.sel.splice(0); }
      if (phase !== 'done' && CQ.visible && CQ.world && CQ.world.onError) { try { CQ.world.onError(CQ.errors[0]); } catch (e) { /* visual */ } }
      send(res);
      CQ.done = true;
      if (CQ.visible) play();
    }

    function inject(src) {
      var s = document.createElement('script');
      s.text = src;
      document.head.appendChild(s);
      s.remove();
    }

    function run(m) {
      CQ.visible = !!m.visible;
      CQ.raw = m.raw; CQ.src = m.stripped; CQ.checks = m.checks || [];
      // 1) Preparación del escenario (código de la misión, no del estudiante)
      CQ.phase = 'setup';
      if (m.setup) inject(m.setup + '\n//# sourceURL=escenario.js');
      CQ.errors.length = 0;
      try { if (CQ.world && CQ.world.init) CQ.world.init(CQ.cfg); } catch (e) { /* visual */ }
      // 2) Revisión de sintaxis: se compila, pero NO se ejecuta
      CQ.phase = 'syntax';
      inject('(function(){\n' + m.raw + '\n})\n//# sourceURL=revision.js');
      if (CQ.errors.length) { finishRun('syntax'); return; }
      // 3) Ejecución real con el guardián de ciclos
      CQ.phase = 'run';
      CQ.iter = 0; CQ.t0 = Date.now(); CQ.loopKilled = false;
      CQ.tracking = true;
      inject('(function(){\n' + m.code + '\n;__CQ.finish(function(__cqName){return eval(__cqName);});\n})();\n//# sourceURL=mision.js');
      CQ.phase = 'events';
      CQ.tracking = CQ.isPage;
      if (!CQ.done) { finishRun(CQ.errors.length ? 'runtime' : 'early'); return; }
      finishRun(CQ.mainErrors ? 'runtime' : 'done');
    }

    window.addEventListener('message', function (ev) {
      if (ev.source !== PARENT) return;
      var m = ev.data;
      if (!m || m.token !== TOKEN) return;
      if (m.type === 'run') run(m);
      else if (m.type === 'highlight') { var el = byId(m.id); if (el) { el.scrollIntoView({ block: 'nearest' }); flash(el, true); } }
    });

    function ready() {
      if (CQ.isPage) {
        new MutationObserver(function () { scheduleFlush(); }).observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
      }
      send({ type: 'ready' });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
    else ready();
  }

  /* -------------------------------------------------------------------
     Lado de la aplicación principal
     ------------------------------------------------------------------- */
  var seq = 0;

  function safeScript(s) { return String(s).replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--'); }

  function buildDoc(scene, token) {
    var world = CQ.Worlds.get(scene.world);
    var cfg = JSON.parse(JSON.stringify(scene));
    return '<!doctype html><html lang="es"><head><meta charset="utf-8">' +
      '<style>' + CQ.Worlds.baseCss + (world.css || '') + (scene.css || '') + '</style>' +
      '<script>' + safeScript('(' + RUNTIME.toString() + ')(' + JSON.stringify(token) + ',' + JSON.stringify(cfg) + ');') + '<\/script>' +
      '<script>' + safeScript('(' + world.script.toString() + ')(window.__CQ, window.__CQ.cfg);') + '<\/script>' +
      '</head><body class="w-' + scene.world + '">' + world.html(cfg) + '</body></html>';
  }

  /** Ejecuciones visibles activas, por contenedor. */
  var active = new Map();

  function stop(host) {
    var a = active.get(host);
    if (!a) return;
    a.kill('stopped');
    active.delete(host);
  }

  /**
   * Ejecuta código en un iframe aislado.
   * opts: { code, setup, checks:[fuente], scene, visible, host, timeout, onLive }
   * Devuelve una promesa con el resultado.
   */
  function run(opts) {
    return new Promise(function (resolve) {
      var token = 'cq' + (++seq) + '_' + Math.random().toString(36).slice(2);
      var frame = document.createElement('iframe');
      frame.setAttribute('sandbox', 'allow-scripts');
      frame.setAttribute('title', 'Escenario de la misión');
      frame.className = 'scene-frame';
      var settled = false, timer = null, readyTimer = null;
      var raw = opts.code || '';

      function finish(res) {
        if (settled) return;
        settled = true;
        clearTimeout(timer); clearTimeout(readyTimer);
        if (!opts.visible) cleanup();
        resolve(res);
      }
      function cleanup() {
        window.removeEventListener('message', onMsg);
        frame.remove();
      }
      function kill(reason) {
        var msg = reason === 'stopped' ? '__CQ_STOPPED__' : '__CQ_TIMEOUT__';
        finish({ phase: reason, errors: [{ name: 'Detenido', message: msg, line: 0 }], logs: [], results: [] });
        cleanup();
      }
      function onMsg(ev) {
        if (ev.source !== frame.contentWindow) return;
        var m = ev.data;
        if (!m || m.token !== token) return;
        if (m.type === 'ready') {
          clearTimeout(readyTimer);
          frame.contentWindow.postMessage({
            type: 'run', token: token,
            code: CQ.Code.instrumentLoops(raw), raw: raw,
            stripped: CQ.Code.stripComments(raw),
            setup: opts.setup || '', checks: opts.checks || [], visible: !!opts.visible
          }, '*');
          timer = setTimeout(function () { kill('timeout'); }, opts.timeout || 4000);
        } else if (m.type === 'result') {
          finish(m);
        } else if (m.type === 'blocked') {
          if (CQ.Restrictions) CQ.Restrictions.notify(m.what);
        } else if (opts.onLive) {
          opts.onLive(m);
        }
      }
      window.addEventListener('message', onMsg);

      if (opts.visible && opts.host) {
        stop(opts.host);
        opts.host.innerHTML = '';
        opts.host.appendChild(frame);
        active.set(opts.host, {
          frame: frame,
          kill: kill,
          post: function (msg) { msg.token = token; frame.contentWindow.postMessage(msg, '*'); }
        });
      } else {
        frame.style.cssText = 'position:fixed;left:-12000px;top:0;width:820px;height:620px;visibility:hidden;pointer-events:none';
        frame.setAttribute('aria-hidden', 'true');
        frame.tabIndex = -1;
        document.body.appendChild(frame);
      }
      readyTimer = setTimeout(function () { kill('timeout'); }, 8000);
      frame.srcdoc = buildDoc(opts.scene || { world: 'terminal' }, token);
    });
  }

  function post(host, msg) {
    var a = active.get(host);
    if (a) a.post(msg);
  }

  CQ.Sandbox = { run: run, stop: stop, post: post };
})(window.CQ = window.CQ || {});
