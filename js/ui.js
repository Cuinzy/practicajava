/* =====================================================================
   CODE QUEST · ui.js
   Utilidades de interfaz: toasts, modales, confeti, textos flotantes.
   ===================================================================== */
(function (CQ) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  var lastToast = {};
  function toast(msg, type, ms) {
    var now = Date.now();
    if (lastToast[msg] && now - lastToast[msg] < 1500) return;
    lastToast[msg] = now;
    var box = document.getElementById('toasts');
    if (!box) return;
    var t = el('<div class="toast ' + (type || 'info') + '" role="status"></div>');
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, ms || 3600);
    setTimeout(function () { t.remove(); }, (ms || 3600) + 400);
  }

  /**
   * Modal accesible. opts: {title, html, buttons:[{label, cls, action, close}], wide, onClose}
   */
  function modal(opts) {
    var root = document.getElementById('modal-root');
    var prev = document.activeElement;
    var m = el('<div class="modal-back" role="dialog" aria-modal="true" aria-label="' + esc(opts.title || 'Ventana') + '">' +
      '<div class="modal' + (opts.wide ? ' wide' : '') + (opts.cls ? ' ' + opts.cls : '') + '">' +
      '<button class="modal-x" aria-label="Cerrar">✕</button>' +
      (opts.title ? '<h2 class="modal-title">' + opts.title + '</h2>' : '') +
      '<div class="modal-body">' + (opts.html || '') + '</div>' +
      '<div class="modal-actions"></div></div></div>');
    var actions = m.querySelector('.modal-actions');
    function close() {
      m.classList.add('out');
      setTimeout(function () { m.remove(); }, 200);
      document.removeEventListener('keydown', onKey);
      if (opts.onClose) opts.onClose();
      if (prev && prev.focus) prev.focus();
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    (opts.buttons || [{ label: 'Cerrar', cls: 'primary' }]).forEach(function (b) {
      var btn = el('<button class="btn ' + (b.cls || '') + '">' + b.label + '</button>');
      btn.addEventListener('click', function () {
        if (b.action) b.action();
        if (b.close !== false) close();
      });
      actions.appendChild(btn);
    });
    m.querySelector('.modal-x').addEventListener('click', close);
    m.addEventListener('click', function (e) { if (e.target === m && !opts.sticky) close(); });
    document.addEventListener('keydown', onKey);
    root.appendChild(m);
    var first = actions.querySelector('button');
    if (first) first.focus();
    return { el: m, close: close };
  }

  function confirmBox(title, html, okLabel, onOk) {
    return modal({
      title: title, html: html,
      buttons: [{ label: 'Cancelar', cls: 'ghost' }, { label: okLabel || 'Aceptar', cls: 'danger', action: onOk }]
    });
  }

  function confetti(n) {
    var colors = ['#22d3ee', '#e879f9', '#a3e635', '#fbbf24', '#f472b6', '#60a5fa'];
    var box = el('<div class="confetti" aria-hidden="true"></div>');
    for (var i = 0; i < (n || 70); i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.5 + 's';
      p.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(function () { box.remove(); }, 3400);
  }

  function floatText(text, anchor, cls) {
    var r = anchor ? anchor.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
    var f = el('<div class="float-text ' + (cls || '') + '"></div>');
    f.textContent = text;
    f.style.left = (r.left + r.width / 2) + 'px';
    f.style.top = r.top + 'px';
    document.body.appendChild(f);
    setTimeout(function () { f.remove(); }, 1800);
  }

  function formatTime(ms) {
    var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    if (h) return h + ' h ' + m + ' min';
    if (m) return m + ' min';
    return s + ' s';
  }

  function debounce(fn, ms) {
    var t;
    return function () { var a = arguments, self = this; clearTimeout(t); t = setTimeout(function () { fn.apply(self, a); }, ms); };
  }

  /** Mensajes de la mascota Pixel. */
  var PIXEL = {
    cheer: ['¡Lo lograste! Tu código hizo exactamente lo que debía.', '¡Sistema reparado! Así se piensa como programador/a.', '¡Excelente! Escribiste, ejecutaste y comprobaste.', '¡Funciona! Neópolis brilla un poco más gracias a ti.'],
    fail: ['Los errores son pistas, no fracasos. Lee el mensaje con calma.', 'Casi. Revisa qué criterio no se cumplió y compáralo con tu código.', 'Programar es probar, observar y ajustar. ¡Otra vez!', 'Tranquilidad: cada error te enseña algo del lenguaje.'],
    persist: ['¿Quieres una pista? Usarla no te bloquea, solo te orienta.', 'Prueba a ejecutar paso a paso y mira la consola.']
  };
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  CQ.UI = {
    esc: esc, el: el, toast: toast, modal: modal, confirm: confirmBox, confetti: confetti,
    floatText: floatText, formatTime: formatTime, debounce: debounce, pixel: PIXEL, pick: pick
  };
})(window.CQ = window.CQ || {});
