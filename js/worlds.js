/* =====================================================================
   CODE QUEST · worlds.js
   "Mundos" = escenarios interactivos que se cargan DENTRO del iframe
   aislado. Cada mundo define:
     css     → estilos del escenario
     html()  → estructura inicial
     script  → función que se serializa y ejecuta en el iframe; crea la
               API que el estudiante usa (abrirPuerta(), robot.avanzar()…)
               y el objeto CQ.world con su estado (para las pruebas).
     api     → referencia rápida mostrada al estudiante.
   Para crear un mundo nuevo, copia uno existente y regístralo en WORLDS.
   ===================================================================== */
(function (CQ) {
  'use strict';

  var PIXEL_SVG =
    '<svg class="bot" viewBox="0 0 64 70" aria-hidden="true">' +
    '<line x1="32" y1="4" x2="32" y2="15" stroke="#67e8f9" stroke-width="3"/>' +
    '<circle class="ant" cx="32" cy="5" r="4.5" fill="#f472b6"/>' +
    '<rect x="9" y="14" width="46" height="36" rx="11" fill="#1e293b" stroke="#22d3ee" stroke-width="3"/>' +
    '<rect x="15" y="22" width="34" height="18" rx="7" fill="#020617"/>' +
    '<circle class="eye" cx="25" cy="31" r="4.5" fill="#67e8f9"/>' +
    '<circle class="eye" cx="39" cy="31" r="4.5" fill="#67e8f9"/>' +
    '<rect x="19" y="53" width="26" height="12" rx="4" fill="#334155" stroke="#22d3ee" stroke-width="2"/>' +
    '<circle cx="32" cy="59" r="3" fill="#a3e635"/></svg>';

  var baseCss = [
    '*{box-sizing:border-box}',
    'html,body{margin:0;height:100%}',
    'body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#0a1024;color:#e2e8f0;overflow:auto;position:relative}',
    '.mono{font-family:ui-monospace,"Cascadia Code",Consolas,monospace}',
    '.w-title{position:absolute;top:8px;left:12px;font:700 11px/1 ui-monospace,Consolas,monospace;letter-spacing:.14em;color:#67e8f9;text-transform:uppercase;z-index:4;opacity:.9}',
    '.sky{position:absolute;inset:0;background:radial-gradient(ellipse at 50% -10%,rgba(56,189,248,.18),transparent 60%),linear-gradient(#0a1024,#0c1633);overflow:hidden}',
    '.sky:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(34,211,238,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.07) 1px,transparent 1px);background-size:26px 26px}',
    '.sensors{position:absolute;top:28px;right:10px;display:flex;flex-direction:column;gap:6px;z-index:5;align-items:flex-end}',
    '.sensor{background:rgba(15,23,42,.85);border:1px solid rgba(34,211,238,.4);border-radius:8px;padding:4px 9px;font:12px ui-monospace,Consolas,monospace}',
    '.sensor b{color:#fbbf24}',
    '.bot{display:block}',
    '.ant{transition:fill .2s}',
    '.sad .eye{fill:#f87171}.happy .eye{fill:#a3e635}',
    '.talk .ant{animation:blink .35s 3}',
    '@keyframes blink{50%{fill:#fde047}}',
    '@keyframes bob{50%{transform:translateY(-6px)}}',
    '@keyframes pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}',
    '@keyframes shake{20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}',
    '.err-flag{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);background:#7f1d1d;color:#fecaca;border:1px solid #f87171;border-radius:999px;padding:5px 14px;font-size:12px;z-index:9;animation:pop .3s}'
  ].join('\n');

  function errFlag(CQ) {
    if (document.querySelector('.err-flag')) return;
    var d = document.createElement('div');
    d.className = 'err-flag';
    d.textContent = '⚠ El programa se detuvo por un error. Revisa la consola.';
    document.body.appendChild(d);
  }

  var WORLDS = {};

  /* ===================== TERMINAL: consola de Pixel ===================== */
  WORLDS.terminal = {
    name: 'Terminal de Pixel',
    api: [['console.log(valor)', 'Muestra un mensaje o valor en la pantalla de Pixel y en la consola.']],
    css: [
      '.term{position:absolute;inset:0;display:flex;align-items:center;gap:16px;padding:30px 16px 16px}',
      '.botbox{width:104px;flex:none;text-align:center;animation:bob 3s ease-in-out infinite}',
      '.botbox svg{width:96px;margin:auto}',
      '.botbox span{display:block;font:700 11px ui-monospace,Consolas,monospace;color:#f0abfc;margin-top:6px;letter-spacing:.1em}',
      '.screen{flex:1;height:100%;background:#020617;border:2px solid rgba(34,211,238,.55);border-radius:12px;box-shadow:inset 0 0 26px rgba(34,211,238,.18),0 0 18px rgba(34,211,238,.15);padding:10px 12px;font:13px/1.55 ui-monospace,Consolas,monospace;color:#86efac;overflow:auto}',
      '.screen .hd{color:#22d3ee;font-size:11px;letter-spacing:.12em;margin-bottom:6px;opacity:.8}',
      '.screen .ln{white-space:pre-wrap;word-break:break-word;animation:pop .25s ease-out}',
      '.screen .ln.warn{color:#fbbf24}.screen .ln.error{color:#f87171}.screen .ln.info{color:#93c5fd}',
      '.screen .idle{color:#475569}',
      '.cursor{display:inline-block;width:8px;height:14px;background:#86efac;vertical-align:middle;animation:blink2 1s steps(1) infinite}',
      '@keyframes blink2{50%{opacity:0}}'
    ].join('\n'),
    html: function (cfg) {
      return '<div class="sky"></div><div class="term" id="term"><div class="botbox">' + PIXEL_SVG + '<span>PIXEL</span></div>' +
        '<div class="screen" id="out"><div class="hd">' + (cfg.title || 'TERMINAL · ESTACIÓN ARRANQUE') + '</div><div class="idle">Esperando instrucciones… <span class="cursor"></span></div></div></div>';
    },
    script: function (CQ, cfg) {
      var term, out;
      CQ.world = {
        state: { lines: [] },
        init: function () { term = document.getElementById('term'); out = document.getElementById('out'); },
        onLog: function (text, kind) {
          this.state.lines.push(text);
          CQ.anim(function () {
            var idle = out.querySelector('.idle'); if (idle) idle.remove();
            var d = document.createElement('div');
            d.className = 'ln ' + kind;
            d.textContent = '> ' + text;
            out.appendChild(d);
            out.scrollTop = out.scrollHeight;
            term.classList.add('talk');
            setTimeout(function () { term.classList.remove('talk'); }, 400);
          }, 240);
        },
        finish: function () {
          var n = this.state.lines.length;
          CQ.anim(function () {
            if (n) term.classList.add('happy');
            else if (CQ.raw && CQ.raw.trim()) { var idle = out.querySelector('.idle'); if (idle) idle.textContent = 'Pixel no recibió ningún mensaje.'; }
          }, 0);
        },
        onError: function () { term.classList.add('sad'); },
        snapshot: function () { return this.state; }
      };
    }
  };

  /* ===================== MEMORIA: variables como cajas ===================== */
  WORLDS.memory = {
    name: 'Memoria del sistema',
    api: [['(tus variables)', 'Cada variable aparece como una caja con su nombre, su tipo y su valor.']],
    css: [
      '.mem{position:absolute;inset:0;padding:30px 14px 14px;display:flex;gap:14px;align-items:flex-start;overflow:auto}',
      '.vars{flex:1;display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start}',
      '.box{min-width:110px;max-width:100%;background:linear-gradient(#13203f,#0d1631);border:2px solid #334155;border-radius:10px;padding:0 0 8px;animation:pop .35s ease-out both;box-shadow:0 6px 14px rgba(0,0,0,.35)}',
      '.box .lid{display:flex;justify-content:space-between;gap:8px;background:#1e293b;border-bottom:2px dashed #334155;border-radius:8px 8px 0 0;padding:4px 8px;font:700 12px ui-monospace,Consolas,monospace;color:#e2e8f0}',
      '.box .ty{font:600 10px system-ui;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em}',
      '.box .val{padding:8px 10px 0;font:15px ui-monospace,Consolas,monospace;word-break:break-word}',
      '.box.number{border-color:#38bdf8}.box.number .val{color:#7dd3fc}',
      '.box.string{border-color:#a3e635}.box.string .val{color:#bef264}',
      '.box.boolean{border-color:#f472b6}.box.boolean .val{color:#f9a8d4}',
      '.box.object,.box.array{border-color:#fbbf24}.box.function{border-color:#c084fc}.box.function .val{color:#d8b4fe}',
      '.box.missing{border-style:dashed;opacity:.55}.box.missing .val{color:#94a3b8;font-size:12px}',
      '.lock{font-size:11px}',
      '.arr{display:flex;flex-wrap:wrap;gap:4px}',
      '.slot{border:1px solid #475569;border-radius:6px;min-width:44px;text-align:center;background:#0b1220;overflow:hidden}',
      '.slot i{display:block;font:10px ui-monospace,Consolas,monospace;color:#fbbf24;background:#1e293b;font-style:normal;padding:1px 4px}',
      '.slot span{display:block;padding:3px 6px;font-size:13px}',
      '.kv{display:flex;gap:6px;font-size:13px;padding:2px 0;border-bottom:1px dotted #334155}',
      '.kv b{color:#fbbf24;font-weight:600}',
      '.empty{color:#64748b;font-size:12px;font-style:italic}',
      '.gen{width:120px;flex:none;text-align:center}',
      '.tank{position:relative;height:150px;border:3px solid #22d3ee;border-radius:14px;background:#020617;overflow:hidden;box-shadow:0 0 18px rgba(34,211,238,.25)}',
      '.fill{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(#fde047,#f59e0b);transition:height .8s cubic-bezier(.2,.8,.2,1)}',
      '.gen.ok .tank{border-color:#a3e635;box-shadow:0 0 26px rgba(163,230,53,.55)}',
      '.gen.ok .fill{background:linear-gradient(#bef264,#22c55e)}',
      '.gen.over .tank{border-color:#f87171;animation:shake .4s 2}',
      '.gval{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 22px ui-monospace,Consolas,monospace;color:#fff;text-shadow:0 2px 6px #000}',
      '.glabel{margin-top:6px;font-size:12px;color:#cbd5e1}',
      '.goal{position:absolute;left:0;right:0;border-top:2px dashed #a3e635;font-size:9px;color:#a3e635;text-align:right;padding-right:3px}',
      '.mbot{width:130px;flex:none;text-align:center;transition:filter .4s}',
      '.mbot svg{width:96px;margin:auto}',
      '.mbot.off{filter:grayscale(1) brightness(.6)}',
      '.mbot .nm{font:700 13px ui-monospace,Consolas,monospace;color:#f0abfc;margin-top:4px}',
      '.bat{height:12px;border:2px solid #94a3b8;border-radius:4px;margin:6px 10px 0;overflow:hidden}',
      '.bat div{height:100%;background:#a3e635;width:0;transition:width .7s}',
      '.bat.low div{background:#f87171}'
    ].join('\n'),
    html: function (cfg) {
      var h = '<div class="sky"></div><div class="w-title">' + (cfg.title || 'Memoria del sistema') + '</div><div class="sensors" id="sensors"></div><div class="mem">';
      if (cfg.gauge) {
        var g = cfg.gauge, goalPct = g.goal != null ? Math.min(100, g.goal / (g.max || 100) * 100) : null;
        h += '<div class="gen" id="gen"><div class="tank"><div class="fill" id="fill"></div>' +
          (goalPct != null ? '<div class="goal" style="bottom:' + goalPct + '%">meta ' + g.goal + '</div>' : '') +
          '<div class="gval" id="gval">—</div></div><div class="glabel">⚡ ' + (g.label || g.var) + '</div></div>';
      }
      if (cfg.robot) {
        h += '<div class="mbot off" id="mbot">' + PIXEL_SVG + '<div class="nm" id="mname">???</div><div class="bat" id="mbat"><div></div></div></div>';
      }
      return h + '<div class="vars" id="vars"><div class="empty">Las variables que crees aparecerán aquí como cajas.</div></div></div>';
    },
    script: function (CQ, cfg) {
      var TYPES = { number: 'número', string: 'texto', boolean: 'booleano', object: 'objeto', array: 'arreglo', function: 'función', undefined: 'indefinido', null: 'nulo' };
      function kind(v) { return v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v; }
      function show(v) {
        var k = kind(v);
        if (k === 'string') return '<span>"' + CQ.esc(v) + '"</span>';
        if (k === 'array') {
          if (!v.length) return '<span class="empty">[ ] arreglo vacío</span>';
          return '<div class="arr">' + v.slice(0, 14).map(function (x, i) {
            return '<div class="slot"><i>[' + i + ']</i><span>' + CQ.esc(CQ.fmt(x, 1)) + '</span></div>';
          }).join('') + (v.length > 14 ? '<div class="slot"><i>…</i><span>+' + (v.length - 14) + '</span></div>' : '') + '</div>';
        }
        if (k === 'object') {
          var keys = Object.keys(v);
          if (!keys.length) return '<span class="empty">{ } objeto vacío</span>';
          return keys.slice(0, 10).map(function (key) {
            return '<div class="kv"><b>' + CQ.esc(key) + ':</b><span>' + CQ.esc(CQ.fmt(v[key], 1)) + '</span></div>';
          }).join('');
        }
        return '<span>' + CQ.esc(CQ.fmt(v, 1)) + '</span>';
      }
      CQ.world = {
        state: { vars: {} },
        init: function () { CQ.renderSensors(document.getElementById('sensors'), cfg.sensors); },
        finish: function (probe) {
          var self = this, names = cfg.watch || [], read = {};
          names.forEach(function (n) {
            try { read[n] = { ok: true, v: probe(n) }; } catch (e) { read[n] = { ok: false }; }
            if (read[n].ok) {
              try { probe(n + '=' + n); read[n].c = false; } catch (e2) { read[n].c = e2 instanceof TypeError; }
              self.state.vars[n] = CQ.fmt(read[n].v, 1);
            }
          });
          if (!CQ.visible) return;
          var box = document.getElementById('vars');
          if (names.length) {
            box.innerHTML = names.map(function (n, i) {
              var r = read[n];
              if (!r.ok) return '<div class="box missing" style="animation-delay:' + i * 70 + 'ms"><div class="lid">' + CQ.esc(n) + '</div><div class="val">aún no existe</div></div>';
              var k = kind(r.v);
              return '<div class="box ' + k + '" style="animation-delay:' + i * 70 + 'ms"><div class="lid"><span>' + (r.c ? '<span class="lock" title="const: no puede cambiar">🔒</span> ' : '') + CQ.esc(n) + '</span><span class="ty">' + (TYPES[k] || k) + '</span></div><div class="val">' + show(r.v) + '</div></div>';
            }).join('');
          }
          if (cfg.gauge) {
            var g = cfg.gauge, val = read[g.var] && read[g.var].ok ? read[g.var].v : null;
            var gen = document.getElementById('gen'), max = g.max || 100;
            var num = typeof val === 'number' ? val : null;
            document.getElementById('gval').textContent = num === null ? '—' : String(Math.round(num * 100) / 100) + (g.unit || '');
            document.getElementById('fill').style.height = (num === null ? 0 : Math.max(0, Math.min(100, num / max * 100))) + '%';
            gen.classList.toggle('ok', num !== null && g.goal != null && num >= g.goal && num <= max);
            gen.classList.toggle('over', num !== null && num > max);
          }
          if (cfg.robot) {
            var rb = cfg.robot, get = function (k) { return rb[k] && read[rb[k]] && read[rb[k]].ok ? read[rb[k]].v : undefined; };
            var on = get('on'), bat = get('battery'), name = get('name');
            document.getElementById('mbot').classList.toggle('off', on !== true);
            document.getElementById('mname').textContent = name !== undefined ? String(name) : '???';
            var b = document.getElementById('mbat');
            var pct = typeof bat === 'number' ? Math.max(0, Math.min(100, bat)) : 0;
            b.firstChild.style.width = pct + '%';
            b.classList.toggle('low', pct < 25);
          }
        },
        onError: function () { var b = document.getElementById('mbot'); if (b) b.classList.add('sad'); },
        snapshot: function () { return this.state; }
      };
    }
  };

  /* ===================== PUERTA del laboratorio ===================== */
  WORLDS.door = {
    name: 'Puerta inteligente',
    api: [
      ['abrirPuerta()', 'Abre la puerta.'],
      ['cerrarPuerta()', 'Cierra la puerta.'],
      ['mostrarAlerta("texto")', 'Muestra un aviso en la pantalla de la puerta.'],
      ['activarAlarma()', 'Activa la alarma de seguridad.']
    ],
    css: [
      '.lab{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:16px}',
      '.bld{position:relative;width:250px;height:190px;background:linear-gradient(#1e293b,#0f172a);border:3px solid #334155;border-bottom:none;border-radius:16px 16px 0 0;box-shadow:0 0 30px rgba(34,211,238,.12)}',
      '.sign{position:absolute;top:10px;left:0;right:0;text-align:center;font:700 12px ui-monospace,Consolas,monospace;letter-spacing:.2em;color:#22d3ee;text-shadow:0 0 8px #22d3ee}',
      '.frame{position:absolute;left:55px;right:55px;bottom:0;height:130px;background:#020617;border:3px solid #475569;border-bottom:none;overflow:hidden}',
      '.inside{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:44px;background:radial-gradient(circle,#164e63,#020617)}',
      '.leaf{position:absolute;top:0;bottom:0;width:50%;background:repeating-linear-gradient(90deg,#334155 0 10px,#3b4a63 10px 12px);transition:transform 1s cubic-bezier(.6,0,.2,1);z-index:2}',
      '.leaf.l{left:0;border-right:2px solid #0ea5e9}.leaf.r{right:0;border-left:2px solid #0ea5e9}',
      '.open .leaf.l{transform:translateX(-100%)}.open .leaf.r{transform:translateX(100%)}',
      '.lamp{position:absolute;top:34px;left:50%;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:#475569}',
      '.lamp.g{background:#a3e635;box-shadow:0 0 16px #a3e635}.lamp.y{background:#fbbf24;box-shadow:0 0 16px #fbbf24}.lamp.r{background:#ef4444;box-shadow:0 0 16px #ef4444}',
      '.banner{position:absolute;top:30px;left:12px;max-width:52%;padding:7px 12px;border-radius:10px;background:#422006;border:1px solid #fbbf24;color:#fde68a;font-size:13px;display:none;animation:pop .3s}',
      '.banner.show{display:block}',
      '.alarm .sky{animation:alarm .5s 6}',
      '@keyframes alarm{50%{background:#450a0a}}',
      '.state{position:absolute;bottom:8px;left:10px;font:12px ui-monospace,Consolas,monospace;color:#94a3b8}'
    ].join('\n'),
    html: function (cfg) {
      return '<div class="sky"></div><div class="w-title">' + (cfg.title || 'Laboratorio · Puerta inteligente') + '</div><div class="sensors" id="sensors"></div>' +
        '<div class="banner" id="banner"></div><div class="lab"><div class="bld" id="bld"><div class="sign">' + (cfg.sign || 'LABORATORIO') + '</div><div class="lamp" id="lamp"></div>' +
        '<div class="frame" id="frame"><div class="inside">' + (cfg.inside || '🧪') + '</div><div class="leaf l"></div><div class="leaf r"></div></div></div></div><div class="state" id="st">Puerta: cerrada</div>';
    },
    script: function (CQ, cfg) {
      var S = { door: 'cerrada', opens: 0, closes: 0, alerts: [], alarm: false, calls: [] };
      function $(id) { return document.getElementById(id); }
      CQ.world = {
        state: S,
        init: function () { CQ.renderSensors($('sensors'), cfg.sensors); },
        snapshot: function () { return S; },
        onError: function () { $('lamp').className = 'lamp r'; }
      };
      window.abrirPuerta = function () {
        S.door = 'abierta'; S.opens++; S.calls.push('abrir');
        CQ.anim(function () { $('frame').classList.add('open'); $('lamp').className = 'lamp g'; $('st').textContent = 'Puerta: ABIERTA ✔'; }, 600);
      };
      window.cerrarPuerta = function () {
        S.door = 'cerrada'; S.closes++; S.calls.push('cerrar');
        CQ.anim(function () { $('frame').classList.remove('open'); $('st').textContent = 'Puerta: cerrada'; }, 600);
      };
      window.mostrarAlerta = function (msg) {
        var t = msg === undefined ? 'Acceso denegado' : String(msg);
        S.alerts.push(t); S.calls.push('alerta');
        CQ.anim(function () { var b = $('banner'); b.textContent = '⚠ ' + t; b.classList.add('show'); $('lamp').className = 'lamp y'; $('bld').style.animation = 'shake .4s'; }, 500);
      };
      window.activarAlarma = function () {
        S.alarm = true; S.calls.push('alarma');
        CQ.anim(function () { document.body.classList.add('alarm'); $('lamp').className = 'lamp r'; $('st').textContent = 'Puerta: ALARMA 🚨'; }, 500);
      };
    }
  };

  /* ===================== SEMÁFORO ===================== */
  WORLDS.traffic = {
    name: 'Semáforo inteligente',
    api: [['cambiarLuz("rojo" | "amarillo" | "verde")', 'Enciende la luz indicada del semáforo.']],
    css: [
      '.street{position:absolute;left:0;right:0;bottom:0;height:70px;background:#1f2937;border-top:3px solid #475569}',
      '.street:after{content:"";position:absolute;left:0;right:0;top:32px;border-top:4px dashed #fbbf24;opacity:.6}',
      '.pole{position:absolute;bottom:70px;left:40%;width:10px;height:70px;background:#475569}',
      '.tl{position:absolute;bottom:136px;left:calc(40% - 25px);width:60px;padding:8px;background:#0f172a;border:3px solid #475569;border-radius:14px;display:flex;flex-direction:column;gap:7px}',
      '.tl div{width:38px;height:38px;border-radius:50%;margin:auto;background:#1e293b;transition:all .3s}',
      '.tl .rojo.on{background:#ef4444;box-shadow:0 0 24px #ef4444}.tl .amarillo.on{background:#fbbf24;box-shadow:0 0 24px #fbbf24}.tl .verde.on{background:#22c55e;box-shadow:0 0 24px #22c55e}',
      '.car{position:absolute;bottom:22px;font-size:34px;transition:left 2.2s ease-in;transform:scaleX(-1)}',
      '.status{position:absolute;left:12px;top:30px;font:13px ui-monospace,Consolas,monospace;color:#cbd5e1}'
    ].join('\n'),
    html: function (cfg) {
      return '<div class="sky"></div><div class="w-title">' + (cfg.title || 'Avenida Central · Semáforo') + '</div><div class="sensors" id="sensors"></div>' +
        '<div class="status" id="st">Semáforo sin programar</div><div class="pole"></div><div class="tl"><div class="rojo"></div><div class="amarillo"></div><div class="verde"></div></div>' +
        '<div class="street"></div><div class="car" id="c1" style="left:4%">🚗</div><div class="car" id="c2" style="left:16%">🚙</div>';
    },
    script: function (CQ, cfg) {
      var S = { light: null, changes: [] };
      CQ.world = {
        state: S,
        init: function () { CQ.renderSensors(document.getElementById('sensors'), cfg.sensors); },
        snapshot: function () { return S; }
      };
      window.cambiarLuz = function (color) {
        var c = String(color).toLowerCase().trim();
        if (['rojo', 'amarillo', 'verde'].indexOf(c) < 0) {
          CQ.warn('cambiarLuz: "' + color + '" no es un color válido. Usa "rojo", "amarillo" o "verde".');
          return;
        }
        S.light = c; S.changes.push(c);
        CQ.anim(function () {
          [].forEach.call(document.querySelectorAll('.tl div'), function (d) { d.classList.toggle('on', d.classList.contains(c)); });
          document.getElementById('st').textContent = 'Luz actual: ' + c.toUpperCase();
          var go = c === 'verde';
          document.getElementById('c1').style.left = go ? '86%' : '4%';
          document.getElementById('c2').style.left = go ? '70%' : '16%';
        }, 700);
      };
    }
  };

  /* ===================== AVENIDA DE LUCES ===================== */
  WORLDS.lights = {
    name: 'Avenida de luces',
    api: [
      ['encenderLuz(i)', 'Enciende la luz número i (empiezan en 0).'],
      ['apagarLuz(i)', 'Apaga la luz número i.'],
      ['luzEncendida(i)', 'Devuelve true si la luz i está encendida.']
    ],
    css: [
      '.ave{position:absolute;left:0;right:0;bottom:0;top:30px;display:flex;align-items:flex-end;justify-content:space-around;padding:0 10px 46px}',
      '.ave:after{content:"";position:absolute;left:0;right:0;bottom:0;height:40px;background:#1f2937;border-top:3px solid #475569}',
      '.lp{display:flex;flex-direction:column;align-items:center;position:relative;z-index:2}',
      '.bulb{width:30px;height:30px;border-radius:50%;background:#334155;border:2px solid #475569;transition:all .3s}',
      '.bulb.on{background:#fde047;border-color:#fef08a;box-shadow:0 0 22px 8px rgba(253,224,71,.55)}',
      '.post{width:6px;height:90px;background:linear-gradient(#64748b,#334155)}',
      '.idx{position:absolute;bottom:-38px;font:700 13px ui-monospace,Consolas,monospace;color:#fbbf24}',
      '.cnt{position:absolute;top:30px;left:12px;font:13px ui-monospace,Consolas,monospace;color:#cbd5e1}'
    ].join('\n'),
    html: function (cfg) {
      var n = cfg.n || 8, h = '';
      for (var i = 0; i < n; i++) h += '<div class="lp"><div class="bulb" id="b' + i + '"></div><div class="post"></div><span class="idx">' + i + '</span></div>';
      return '<div class="sky"></div><div class="w-title">' + (cfg.title || 'Avenida de luces') + '</div><div class="cnt" id="cnt">Luces encendidas: 0 / ' + n + '</div><div class="ave">' + h + '</div>';
    },
    script: function (CQ, cfg) {
      var n = cfg.n || 8, S = { lights: [], calls: 0 };
      for (var i = 0; i < n; i++) S.lights.push(false);
      CQ.world = {
        state: S,
        init: function () {
          (cfg.initial || []).forEach(function (k) { S.lights[k] = true; var b = document.getElementById('b' + k); if (b) b.classList.add('on'); });
          count();
        },
        snapshot: function () { return S; }
      };
      function count() {
        var on = S.lights.filter(Boolean).length;
        CQ.anim(function () { document.getElementById('cnt').textContent = 'Luces encendidas: ' + on + ' / ' + n; }, 0);
      }
      function valid(i, fn) {
        if (typeof i !== 'number' || i % 1 !== 0) { CQ.warnOnce(fn + '() necesita un número entero, pero recibió ' + CQ.fmt(i, 1) + '.'); return false; }
        if (i < 0 || i >= n) { CQ.warnOnce('La luz ' + i + ' no existe: hay ' + n + ' luces, numeradas de 0 a ' + (n - 1) + '.'); return false; }
        return true;
      }
      function set(i, on) {
        S.calls++;
        S.lights[i] = on;
        CQ.anim(function () { document.getElementById('b' + i).classList.toggle('on', on); }, 160);
        count();
      }
      window.encenderLuz = function (i) { if (valid(i, 'encenderLuz')) set(i, true); };
      window.apagarLuz = function (i) { if (valid(i, 'apagarLuz')) set(i, false); };
      window.luzEncendida = function (i) { return valid(i, 'luzEncendida') ? S.lights[i] : false; };
    }
  };

  /* ===================== ROBOT en la pista ===================== */
  WORLDS.robot = {
    name: 'Pista de Pixel',
    api: [
      ['robot.avanzar()', 'Avanza una casilla a la derecha.'],
      ['robot.retroceder()', 'Retrocede una casilla.'],
      ['robot.recoger()', 'Recoge el cristal 💎 de la casilla actual.'],
      ['robot.hayCristal()', 'Devuelve true si hay un cristal en la casilla actual.'],
      ['robot.decir("texto")', 'Pixel dice un mensaje.'],
      ['robot.posicion', 'Número de la casilla donde está Pixel.']
    ],
    css: [
      '.trk{position:absolute;left:12px;right:12px;bottom:34px;height:64px;display:grid;grid-template-columns:repeat(var(--n),1fr);gap:0}',
      '.cell{position:relative;margin:0 2px;background:#111c36;border:2px solid #22324f;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px}',
      '.cell i{position:absolute;bottom:-22px;font:700 12px ui-monospace,Consolas,monospace;color:#fbbf24;font-style:normal}',
      '.cell.goal{border-color:#a3e635;box-shadow:inset 0 0 14px rgba(163,230,53,.4)}',
      '.cell.goal:before{content:"🏁";position:absolute;top:-24px;font-size:16px}',
      '.gem{transition:all .4s}.gem.got{transform:translateY(-50px) scale(.2);opacity:0}',
      '.rob{position:absolute;bottom:104px;width:calc((100% - 24px) / var(--n));left:12px;transition:transform .32s ease-in-out;display:flex;justify-content:center}',
      '.rob svg{width:52px}',
      '.rob.bump{animation:shake .3s}',
      '.say{position:absolute;bottom:72px;left:50%;transform:translateX(-50%);white-space:nowrap;background:#f8fafc;color:#0f172a;border-radius:10px;padding:4px 9px;font-size:12px;font-weight:600;display:none;animation:pop .25s}',
      '.say.on{display:block}',
      '.hud{position:absolute;top:30px;left:12px;font:13px ui-monospace,Consolas,monospace;color:#cbd5e1}'
    ].join('\n'),
    html: function (cfg) {
      var n = cfg.n || 10;
      return '<div class="sky"></div><div class="w-title">' + (cfg.title || 'Pista de entrenamiento') + '</div><div class="hud" id="hud">💎 0 · casilla 0</div>' +
        '<div class="trk" id="trk" style="--n:' + n + '"></div><div class="rob" id="rob" style="--n:' + n + '"><div class="say" id="say"></div>' + PIXEL_SVG + '</div>';
    },
    script: function (CQ, cfg) {
      var n = cfg.n || 10, S;
      function $(id) { return document.getElementById(id); }
      function reset(pos) {
        S = CQ.world.state = { pos: pos != null ? pos : (cfg.start || 0), collected: 0, said: [], moves: 0, bumps: 0, crystals: (cfg.crystals || []).slice(), path: [] };
        S.path.push(S.pos);
      }
      function draw() {
        var h = '';
        for (var i = 0; i < n; i++) h += '<div class="cell' + (cfg.goal === i ? ' goal' : '') + '" id="c' + i + '">' + (S.crystals.indexOf(i) >= 0 ? '<span class="gem">💎</span>' : '') + '<i>' + i + '</i></div>';
        $('trk').innerHTML = h;
        place(S.pos);
      }
      function place(p) { var r = $('rob'); r.style.transform = 'translateX(' + (p * 100) + '%)'; }
      function hud() { var c = S.collected, p = S.pos; CQ.anim(function () { $('hud').textContent = '💎 ' + c + ' · casilla ' + p; }, 0); }
      CQ.world = {
        state: null,
        init: function () { reset(); if (CQ.visible) draw(); },
        reset: reset,
        snapshot: function () { return S; },
        onError: function () { $('rob').classList.add('sad'); }
      };
      function move(d) {
        var np = S.pos + d;
        if (np < 0 || np >= n) {
          S.bumps++;
          CQ.warnOnce('¡Pixel chocó con el borde de la pista! Las casillas van de 0 a ' + (n - 1) + '.');
          if (S.bumps < 4) CQ.anim(function () { var r = $('rob'); r.classList.remove('bump'); void r.offsetWidth; r.classList.add('bump'); }, 300);
          return;
        }
        S.pos = np; S.moves++; S.path.push(np);
        CQ.anim(function () { place(np); }, 340);
        hud();
      }
      window.robot = {
        avanzar: function () { move(1); },
        retroceder: function () { move(-1); },
        recoger: function () {
          var k = S.crystals.indexOf(S.pos), p = S.pos;
          if (k < 0) { CQ.warn('No hay cristal en la casilla ' + p + '.'); return false; }
          S.crystals.splice(k, 1); S.collected++;
          CQ.anim(function () { var g = $('c' + p).querySelector('.gem'); if (g) g.classList.add('got'); }, 300);
          hud();
          return true;
        },
        hayCristal: function () { return S.crystals.indexOf(S.pos) >= 0; },
        decir: function (t) {
          var s = String(t); S.said.push(s);
          CQ.anim(function () { var b = $('say'); b.textContent = s; b.classList.add('on'); $('rob').classList.add('talk'); setTimeout(function () { $('rob').classList.remove('talk'); }, 500); }, 700);
        },
        get posicion() { return S.pos; }
      };
    }
  };

  /* ===================== FÁBRICA ===================== */
  WORLDS.factory = {
    name: 'Fábrica cíclica',
    api: [
      ['fabricar("tipo")', 'Fabrica una pieza: "tornillo", "engranaje", "chip", "caja", "cable" o "bateria".'],
      ['pesoCaja(i)', 'Devuelve el peso (kg) de la caja número i del almacén.'],
      ['cajas', 'Cantidad de cajas en el almacén (cuando existen).'],
      ['mostrarTotal(n)', 'Muestra un número en la pantalla de la fábrica.']
    ],
    css: [
      '.mach{position:absolute;left:12px;bottom:60px;width:86px;height:96px;background:linear-gradient(#334155,#1e293b);border:3px solid #64748b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:34px}',
      '.mach.work{animation:shake .25s}',
      '.belt{position:absolute;left:96px;right:12px;bottom:60px;height:56px;border-bottom:8px solid #475569;display:flex;align-items:flex-end;gap:4px;padding:0 6px 4px;overflow:hidden}',
      '.belt:after{content:"";position:absolute;left:0;right:0;bottom:-8px;height:8px;background:repeating-linear-gradient(90deg,#64748b 0 10px,#334155 10px 20px);animation:roll .6s linear infinite}',
      '@keyframes roll{to{background-position:20px 0}}',
      '.item{font-size:26px;animation:slide .45s ease-out}',
      '@keyframes slide{from{transform:translateX(-60px);opacity:0}}',
      '.disp{position:absolute;top:28px;right:12px;min-width:120px;background:#020617;border:2px solid #22d3ee;border-radius:10px;padding:6px 10px;text-align:right;font:700 24px ui-monospace,Consolas,monospace;color:#67e8f9}',
      '.disp small{display:block;font:600 10px system-ui;color:#94a3b8;letter-spacing:.1em}',
      '.cnt{position:absolute;top:30px;left:12px;font:13px ui-monospace,Consolas,monospace;color:#cbd5e1}',
      '.shelf{position:absolute;left:12px;right:150px;top:56px;display:flex;flex-wrap:wrap;gap:6px}',
      '.crate{min-width:52px;text-align:center;background:#78350f;border:2px solid #b45309;border-radius:6px;padding:3px 4px;font:700 12px ui-monospace,Consolas,monospace;color:#fde68a;transition:all .2s}',
      '.crate i{display:block;font:10px ui-monospace,Consolas,monospace;color:#fbbf24;font-style:normal;opacity:.8}',
      '.crate.read{background:#0e7490;border-color:#22d3ee;color:#fff;transform:translateY(-4px)}'
    ].join('\n'),
    html: function (cfg) {
      return '<div class="sky"></div><div class="w-title">' + (cfg.title || 'Fábrica cíclica') + '</div><div class="cnt" id="cnt">Piezas fabricadas: 0</div>' +
        '<div class="shelf" id="shelf"></div><div class="disp"><small>PANTALLA</small><span id="disp">—</span></div>' +
        '<div class="mach" id="mach">🏭</div><div class="belt" id="belt"></div>';
    },
    script: function (CQ, cfg) {
      var ICON = { tornillo: '🔩', engranaje: '⚙️', chip: '💾', caja: '📦', cable: '🔌', bateria: '🔋', batería: '🔋' };
      var S = { items: [], total: null, reads: 0 };
      function $(id) { return document.getElementById(id); }
      CQ.world = {
        state: S,
        init: function () {
          var pesos = cfg.pesos;
          if (pesos) {
            window.cajas = pesos.length;
            if (CQ.visible) $('shelf').innerHTML = pesos.map(function (p, i) { return '<div class="crate" id="k' + i + '"><i>caja ' + i + '</i>' + p + ' kg</div>'; }).join('');
          }
        },
        snapshot: function () { return S; }
      };
      window.fabricar = function (tipo) {
        var t = tipo === undefined ? 'caja' : String(tipo).toLowerCase();
        if (!ICON[t]) { CQ.warnOnce('fabricar(): "' + tipo + '" no es un tipo conocido. Usa tornillo, engranaje, chip, caja, cable o bateria.'); return; }
        S.items.push(t.replace('batería', 'bateria'));
        var count = S.items.length;
        CQ.anim(function () {
          var b = $('belt'), d = document.createElement('span');
          d.className = 'item'; d.textContent = ICON[t];
          b.appendChild(d);
          while (b.children.length > 14) b.removeChild(b.firstChild);
          $('cnt').textContent = 'Piezas fabricadas: ' + count;
          var m = $('mach'); m.classList.remove('work'); void m.offsetWidth; m.classList.add('work');
        }, 200);
      };
      window.pesoCaja = function (i) {
        var p = cfg.pesos || [];
        if (typeof i !== 'number' || i % 1 !== 0 || i < 0 || i >= p.length) {
          CQ.warnOnce('pesoCaja(' + CQ.fmt(i, 1) + '): esa caja no existe. Hay ' + p.length + ' cajas, numeradas de 0 a ' + (p.length - 1) + '.');
          return undefined;
        }
        S.reads++;
        CQ.anim(function () {
          [].forEach.call(document.querySelectorAll('.crate.read'), function (c) { c.classList.remove('read'); });
          var c = $('k' + i); if (c) c.classList.add('read');
        }, 220);
        return p[i];
      };
      window.mostrarTotal = function (n) {
        S.total = n;
        CQ.anim(function () { $('disp').textContent = CQ.fmt(n, 1); }, 300);
      };
    }
  };

  /* ===================== PÁGINA WEB (DOM real) ===================== */
  WORLDS.page = {
    name: 'Página web',
    api: [
      ['document.getElementById("id")', 'Busca un elemento por su id.'],
      ['document.querySelector("selector")', 'Busca el primer elemento que coincide con un selector CSS.'],
      ['document.querySelectorAll("selector")', 'Busca TODOS los elementos que coinciden.'],
      ['elemento.textContent', 'Texto de un elemento (leer o cambiar).'],
      ['elemento.style.propiedad', 'Estilo en línea (backgroundColor, width…).'],
      ['elemento.classList.add/remove/toggle("clase")', 'Agrega, quita o alterna clases CSS.'],
      ['elemento.addEventListener("evento", función)', 'Ejecuta una función cuando ocurre un evento.']
    ],
    css: [
      'body.w-page{background:radial-gradient(ellipse at top,#132049,#0a1024 70%);padding:14px;min-height:100%;color:#e2e8f0}',
      'body.w-page h1,body.w-page h2,body.w-page h3{margin:.2em 0 .4em}',
      'body.w-page button{font:inherit;cursor:pointer;background:#0e7490;color:#fff;border:0;border-radius:8px;padding:7px 14px;margin:3px}',
      'body.w-page button:hover{filter:brightness(1.15)}',
      'body.w-page input,body.w-page select{font:inherit;background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:6px 9px;margin:3px}',
      'body.w-page ul{padding-left:20px}'
    ].join('\n'),
    html: function (cfg) { return cfg.html || '<h1>Página vacía</h1>'; },
    script: function (CQ) {
      CQ.world = { state: {}, snapshot: function () { return {}; } };
    }
  };

  // Indicador visual de error para mundos sin onError propio
  Object.keys(WORLDS).forEach(function (k) {
    var w = WORLDS[k], orig = w.script;
    if (k === 'page') return;
    w.script = new Function('CQ', 'cfg',
      '(' + orig.toString() + ')(CQ, cfg);' +
      'var prev = CQ.world.onError;' +
      'CQ.world.onError = function (e) { if (prev) { try { prev.call(CQ.world, e); } catch (x) {} } (' + errFlag.toString() + ')(CQ); };');
  });

  CQ.Worlds = {
    baseCss: baseCss,
    all: WORLDS,
    get: function (name) { return WORLDS[name] || WORLDS.terminal; },
    pixelSvg: PIXEL_SVG
  };
})(window.CQ = window.CQ || {});
