/* =====================================================================
   CODE QUEST · app.js
   Arranque, rutas (#/mapa, #/nivel/b1l2, #/lab), pantalla de inicio,
   mapa de la ciudad, HUD del jugador, insignias, reporte y ayuda.
   ===================================================================== */
(function (CQ) {
  'use strict';

  var U = CQ.UI, P = CQ.Progress;

  function go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  function route() {
    var h = location.hash || '';
    var st = P.get();
    if (!st.player.name) return intro();
    var m = /^#\/nivel\/(b\d+(?:l\d+|s))$/.exec(h);
    if (m) {
      var l = CQ.Levels.level(m[1]);
      if (!l) return go('#/mapa');
      if (!P.isLevelUnlocked(l.id)) {
        U.toast(l.special ? 'Las misiones especiales se desbloquean al aprobar su bloque.' : 'Ese nivel aún está bloqueado: supera los anteriores primero.', 'warn');
        return go('#/mapa');
      }
      return CQ.Game.open(l.id);
    }
    if (h === '#/lab') return CQ.Game.openLab();
    map();
  }

  /* --------------------------------- HUD --------------------------------- */
  function hudHtml() {
    var st = P.get(), r = P.rank();
    var badges = Object.keys(st.badges).length;
    return '<div class="hud-in"><div class="hud-av" aria-hidden="true">' + U.esc((st.player.name || '?').charAt(0).toUpperCase()) + '</div>' +
      '<div class="hud-main"><div class="hud-name">' + U.esc(st.player.name) + ' · <span>Nv ' + r.level + ' ' + U.esc(r.name) + '</span></div>' +
      '<div class="xpbar" role="progressbar" aria-label="Experiencia" aria-valuenow="' + r.pct + '" aria-valuemin="0" aria-valuemax="100"><div style="width:' + r.pct + '%"></div></div>' +
      '<div class="hud-sub">' + st.xp + ' XP' + (r.to ? ' · faltan ' + (r.to - st.xp) + ' para subir' : ' · rango máximo') + '</div></div>' +
      '<button type="button" class="hud-badges" data-badges title="Ver insignias">🏅 ' + badges + '</button></div>';
  }
  function renderHud() {
    [].forEach.call(document.querySelectorAll('[data-hud]'), function (h) {
      h.innerHTML = hudHtml();
      h.querySelector('[data-badges]').addEventListener('click', showBadges);
    });
  }

  /* ------------------------------ INTRODUCCIÓN ------------------------------ */
  function intro() {
    CQ.Game.close();
    var root = document.getElementById('app');
    root.innerHTML =
      '<section class="screen intro">' +
      '<div class="intro-sky" aria-hidden="true">' + skyline() + '</div>' +
      '<div class="intro-card">' +
      '<div class="intro-bot">' + CQ.Worlds.pixelSvg + '</div>' +
      '<h1 class="logo">CODE QUEST<span>La Ciudad del Código</span></h1>' +
      '<p class="lead">Neópolis sufrió el <b>Gran Apagón</b>: los semáforos no responden, las puertas están bloqueadas, los robots no obedecen y las pantallas de los edificios se apagaron.</p>' +
      '<p>Soy <b>Pixel</b>, el robot de mantenimiento. Solo entiendo <b>JavaScript</b>. Si aprendes a escribirlo, juntos repararemos la ciudad distrito por distrito: primero pensarás qué quieres lograr, luego lo expresarás en código y, finalmente, comprobarás si funciona.</p>' +
      '<ul class="intro-list"><li>✍️ Escribirás código real que se ejecuta en un entorno aislado.</li><li>👀 Verás las consecuencias de tu código en la ciudad.</li><li>🔓 Cada distrito se desbloquea cuando demuestras lo aprendido (80% o más).</li><li>⌨️ Aquí no se copia ni se pega: se escribe para aprender.</li></ul>' +
      '<form class="intro-form"><label for="pname">¿Cómo te llamas, técnico/a de código?</label><div class="row"><input id="pname" maxlength="24" autocomplete="off" placeholder="Tu nombre" required><button class="btn primary big" type="submit">Comenzar misión →</button></div></form>' +
      '<p class="muted small">Tu progreso se guarda solo en este navegador (localStorage). Es un registro pedagógico, no una calificación oficial.</p>' +
      '</div></section>';
    var f = root.querySelector('form');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = root.querySelector('#pname').value.trim();
      if (!n) return;
      P.get().player.name = n;
      P.save(true);
      U.confetti(40);
      go('#/mapa');
      setTimeout(showHelp, 400);
    });
    root.querySelector('#pname').focus();
  }

  function skyline() {
    var s = '<svg viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" class="skyline">';
    var x = 0, i = 0, seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    while (x < 1200) {
      var w = 40 + rnd() * 70, h = 70 + rnd() * 170;
      s += '<rect x="' + x + '" y="' + (260 - h) + '" width="' + w + '" height="' + h + '" fill="' + (i % 2 ? '#111b3a' : '#0d1530') + '"/>';
      for (var wy = 260 - h + 12; wy < 250; wy += 18) {
        for (var wx = x + 8; wx < x + w - 8; wx += 14) {
          if (rnd() > 0.55) s += '<rect class="win" x="' + wx + '" y="' + wy + '" width="6" height="8" fill="' + (rnd() > 0.5 ? '#22d3ee' : '#e879f9') + '" style="animation-delay:' + (rnd() * 4).toFixed(2) + 's"/>';
        }
      }
      x += w + 4; i++;
    }
    return s + '</svg>';
  }

  /* ---------------------------------- MAPA ---------------------------------- */
  function map() {
    CQ.Game.close();
    var st = P.get(), root = document.getElementById('app');
    var curB = P.currentBlock();
    P.save();
    var cards = CQ.Levels.blocks.map(function (b) {
      var bs = P.blockStats(b.n), unlocked = P.isBlockUnlocked(b.n);
      var status = bs.approved ? 'done' : unlocked ? 'open' : 'locked';
      var label = bs.approved ? '✓ Aprobado' : unlocked ? (bs.passed ? 'En progreso' : 'Disponible') : '🔒 Bloqueado';
      return '<button type="button" class="district ' + status + (b.n === curB ? ' current' : '') + '" data-block="' + b.n + '" style="--accent:' + b.color + '"' + (unlocked ? '' : ' aria-disabled="true"') + '>' +
        '<span class="d-ico">' + b.icon + '</span><span class="d-n">Bloque ' + b.n + '</span><span class="d-name">' + U.esc(b.name) + '</span>' +
        '<span class="d-topic">' + U.esc(b.topic) + '</span>' +
        '<span class="d-bar"><span style="width:' + Math.round(bs.passed / bs.total * 100) + '%"></span></span>' +
        '<span class="d-meta"><span class="chip ' + status + '">' + label + '</span><span>' + bs.passed + '/' + bs.total + ' niveles' + (bs.passed ? ' · ' + bs.perf + '%' : '') + '</span></span></button>';
    }).join('');
    root.innerHTML =
      '<section class="screen map-screen">' +
      '<header class="topbar"><div class="brand"><span class="brand-bot">' + CQ.Worlds.pixelSvg + '</span><div><b>CODE QUEST</b><small>La Ciudad del Código</small></div></div><div class="hud" data-hud></div></header>' +
      '<div class="map-sky" aria-hidden="true">' + skyline() + '</div>' +
      '<div class="map-head"><div><h1>Mapa de Neópolis</h1><p>Repara cada distrito para desbloquear el siguiente. Tiempo de práctica: <b>' + U.formatTime(st.time.total) + '</b>.</p></div>' +
      '<div class="map-actions"><button type="button" class="btn" data-a="continue">▶ Continuar</button><button type="button" class="btn" data-a="lab">🧪 Laboratorio libre</button><button type="button" class="btn" data-a="badges">🏅 Insignias</button><button type="button" class="btn" data-a="report">📊 Mi progreso</button><button type="button" class="btn ghost" data-a="help">❔ Cómo jugar</button></div></div>' +
      (st.tampered ? '<div class="fb tip wide">⚠️ Se detectaron cambios manuales en los datos de progreso guardados. El juego sigue funcionando, pero este registro no es confiable para evaluación.</div>' : '') +
      '<div class="city" role="list">' + cards + '</div>' +
      '<footer class="map-foot"><button type="button" class="linkbtn" data-a="reset">Reiniciar todo el progreso</button></footer>' +
      '</section>';
    renderHud();
    [].forEach.call(root.querySelectorAll('.district'), function (d) {
      d.addEventListener('click', function () {
        var n = +d.dataset.block;
        if (!P.isBlockUnlocked(n)) {
          var prev = P.blockStats(n - 1);
          U.toast('Bloqueado: aprueba el Bloque ' + (n - 1) + ' (todos sus niveles y al menos ' + P.PASS_PERF + '% de desempeño; ahora ' + prev.perf + '%).', 'warn', 4500);
          return;
        }
        showBlock(n);
      });
    });
    var acts = {
      lab: function () { go('#/lab'); },
      badges: showBadges, report: showReport, help: showHelp,
      reset: function () {
        U.confirm('¿Reiniciar todo el progreso?', 'Se borrarán tu nombre, niveles, XP, insignias y código guardado en este navegador. Esta acción no se puede deshacer.', 'Sí, reiniciar', function () { P.reset(); go('#/'); });
      },
      'continue': function () {
        var target = null;
        CQ.Levels.blocks.some(function (b) {
          return b.levels.some(function (l) {
            var rec = P.get().levels[l.id];
            if (P.isLevelUnlocked(l.id) && !(rec && rec.passed)) { target = l; return true; }
            return false;
          });
        });
        if (target) go('#/nivel/' + target.id);
        else U.toast('¡Completaste todos los niveles disponibles! Revisa las misiones especiales o mejora tus puntuaciones.', 'success');
      }
    };
    [].forEach.call(root.querySelectorAll('[data-a]'), function (b) { b.addEventListener('click', acts[b.dataset.a]); });
  }

  function showBlock(n) {
    var b = CQ.Levels.block(n), bs = P.blockStats(n), st = P.get();
    var lv = b.levels.map(function (l) {
      var rec = st.levels[l.id], unlocked = P.isLevelUnlocked(l.id);
      var status = rec && rec.passed ? 'done' : unlocked ? 'open' : 'locked';
      var acts = [l.solve, l.prove].filter(Boolean).map(function (c) { var a = CQ.Levels.ACTIVITIES[c.activity]; return '<span class="mini-act" title="' + U.esc(a.name) + '">' + a.icon + ' ' + c.activity + '</span>'; }).join('');
      return '<li class="lvnode ' + status + '"><button type="button" data-level="' + l.id + '"' + (unlocked ? '' : ' disabled') + '>' +
        '<span class="lv-num">' + (status === 'done' ? '✓' : status === 'locked' ? '🔒' : l.num) + '</span>' +
        '<span class="lv-info"><b>' + l.num + ' · ' + U.esc(l.title) + '</b><small>' + acts + (rec && rec.best ? ' · mejor ' + rec.best + '%' : '') + (rec && rec.attempts ? ' · ' + rec.attempts + ' intentos' : '') + '</small></span></button></li>';
    }).join('');
    var sp = b.special;
    var spHtml = sp ? '<div class="special ' + (bs.approved ? '' : 'locked') + '"><button type="button" data-level="' + sp.id + '"' + (bs.approved ? '' : ' disabled') + '><span class="lv-num">⭐</span><span class="lv-info"><b>Misión especial · ' + U.esc(sp.title) + '</b><small>' + (st.specials[sp.id] ? '✓ completada' : bs.approved ? 'Refuerza lo aprendido · +80 XP' : 'Se desbloquea al aprobar el bloque') + '</small></span></button></div>' : '';
    var m = U.modal({
      title: b.icon + ' Bloque ' + n + ' · ' + U.esc(b.name), wide: true, cls: 'block-modal',
      html: '<p class="block-story">' + b.intro + '</p>' +
        '<div class="concepts">' + b.concepts.map(function (c) { return '<span class="chip">' + U.esc(c) + '</span>'; }).join('') + '</div>' +
        '<div class="perf"><div class="perf-bar"><span style="width:' + bs.perf + '%"></span><i style="left:' + P.PASS_PERF + '%" title="Meta: ' + P.PASS_PERF + '%"></i></div><small>Desempeño del bloque: <b>' + bs.perf + '%</b> (meta ' + P.PASS_PERF + '%) · ' + bs.passed + '/' + bs.total + ' niveles superados' + (bs.approved ? ' · ✓ aprobado' : '') + '</small></div>' +
        '<ol class="lvpath">' + lv + '</ol>' + spHtml,
      buttons: [{ label: 'Cerrar', cls: 'ghost' }]
    });
    [].forEach.call(m.el.querySelectorAll('[data-level]'), function (btn) {
      btn.addEventListener('click', function () { m.close(); go('#/nivel/' + btn.dataset.level); });
    });
  }

  /* --------------------------- INSIGNIAS / REPORTE --------------------------- */
  function showBadges() {
    var st = P.get();
    U.modal({
      title: '🏅 Insignias', wide: true,
      html: '<div class="badges">' + P.BADGES.map(function (b) {
        var got = st.badges[b.id];
        return '<div class="badge ' + (got ? 'got' : '') + '"><span class="b-ico">' + (got ? b.icon : '❔') + '</span><b>' + U.esc(b.name) + '</b><small>' + U.esc(b.desc) + '</small>' + (got ? '<em>' + new Date(got).toLocaleDateString() + '</em>' : '') + '</div>';
      }).join('') + '</div>'
    });
  }

  function showReport() {
    var st = P.get(), r = P.rank();
    var rows = CQ.Levels.blocks.map(function (b) {
      var bs = P.blockStats(b.n);
      return '<tr class="bh"><th colspan="5">' + b.icon + ' Bloque ' + b.n + ' · ' + U.esc(b.name) + ' — ' + bs.perf + '% ' + (bs.approved ? '✓ aprobado' : P.isBlockUnlocked(b.n) ? '' : '🔒') + '</th></tr>' +
        b.levels.map(function (l) {
          var rec = st.levels[l.id] || {};
          return '<tr><td>' + l.num + ' ' + U.esc(l.title) + '</td><td>' + (rec.passed ? '✓' : '—') + '</td><td>' + (rec.best || 0) + '%</td><td>' + (rec.attempts || 0) + '</td><td>' + U.formatTime(rec.time || 0) + '</td></tr>';
        }).join('');
    }).join('');
    var m = U.modal({
      title: '📊 Mi progreso', wide: true,
      html: '<div class="stat-row"><div><b>' + st.xp + '</b><small>XP · ' + U.esc(r.name) + '</small></div><div><b>' + Object.keys(st.badges).length + '/' + P.BADGES.length + '</b><small>insignias</small></div><div><b>' + U.formatTime(st.time.total) + '</b><small>tiempo activo</small></div><div><b>' + st.stats.experiments + '</b><small>experimentos</small></div><div><b>' + st.stats.hintsUsed + '</b><small>pistas usadas</small></div><div><b>' + st.stats.pasteAttempts + '</b><small>intentos de pegar</small></div></div>' +
        '<div class="table-wrap"><table class="report"><thead><tr><th>Nivel</th><th>Superado</th><th>Mejor</th><th>Intentos</th><th>Tiempo</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
        '<div class="fb tip"><b>Importante:</b> este registro se guarda en <code>localStorage</code> de tu navegador y puede modificarse con las herramientas de desarrollo. Sirve como <b>progreso pedagógico</b> y autoevaluación; una evaluación académica segura requiere validar los retos en un servidor.' + (st.tampered ? ' <b>Se detectaron cambios manuales en estos datos.</b>' : '') + '</div>' +
        '<p class="muted small">El tiempo solo cuenta mientras la pestaña está visible y hay actividad reciente (teclado o ratón).</p>',
      buttons: [{ label: '⬇ Exportar JSON', cls: 'ghost', close: false, action: exportProgress }, { label: 'Cerrar', cls: 'primary' }]
    });
    return m;
  }

  function exportProgress() {
    var blob = new Blob([P.exportJSON()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'codequest-progreso-' + (P.get().player.name || 'estudiante').replace(/\W+/g, '_') + '.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function showHelp() {
    U.modal({
      title: '❔ Cómo jugar', wide: true,
      html: '<div class="help">' +
        '<h3>El ciclo de cada nivel</h3><ol class="help-phases"><li><b>📘 Aprende</b> — una explicación breve del concepto.</li><li><b>👁️ Observa</b> — un ejemplo que se ejecuta paso a paso.</li><li><b>🧪 Experimenta</b> — cambia valores y mira qué pasa (sin evaluación).</li><li><b>🛠️ Resuelve</b> — un reto que se comprueba con pruebas automáticas.</li><li><b>🏅 Demuestra</b> — un reto distinto, sin ver la solución.</li></ol>' +
        '<h3>Código → Acción → Consecuencia</h3><p>Primero piensa qué quieres lograr, luego escríbelo en JavaScript y, por último, comprueba si realmente funciona. Cualquier solución que cumpla los criterios es válida: no buscamos que escribas exactamente lo mismo que otra persona.</p>' +
        '<h3>Botones del banco de trabajo</h3><ul><li><b>▶ Ejecutar</b> (Ctrl+Enter): prueba tu código y mira el resultado. No cuenta como intento.</li><li><b>✔ Comprobar misión</b>: ejecuta las pruebas de evaluación.</li><li><b>■ Detener</b>: corta una ejecución que tarda demasiado.</li><li><b>💡 Pista</b>: hasta 3 pistas progresivas por reto.</li></ul>' +
        '<h3>Teclado en el editor</h3><ul><li><kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd>: indentar / desindentar.</li><li><kbd>Enter</kbd>: nueva línea con la sangría correcta.</li><li><kbd>Esc</kbd> y luego <kbd>Tab</kbd>: salir del editor con el teclado.</li></ul>' +
        '<h3>Progreso y puntuación</h3><p>Cada reto vale entre 60% y 100% según intentos fallidos y pistas usadas. Para aprobar un bloque debes superar todos sus niveles con un desempeño promedio de al menos <b>' + P.PASS_PERF + '%</b>. Puedes repetir niveles: se conserva tu mejor puntuación.</p>' +
        '<h3>Sin copiar ni pegar</h3><p>Dentro del juego están bloqueados copiar, cortar y pegar (teclado, menú contextual, arrastrar y soltar). Es una medida pedagógica para que practiques escribiendo; no es una barrera infalible.</p>' +
        '</div>'
    });
  }

  function init() {
    P.load();
    CQ.Restrictions.init();
    window.addEventListener('hashchange', route);
    route();
  }

  CQ.App = { init: init, go: go, renderHud: renderHud, hudHtml: hudHtml };
  document.addEventListener('DOMContentLoaded', init);
})(window.CQ = window.CQ || {});
