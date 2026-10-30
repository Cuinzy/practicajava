/* =====================================================================
   CODE QUEST · restrictions.js
   Restricción pedagógica de copiar / cortar / pegar DENTRO del juego.

   IMPORTANTE (límites técnicos): una página web no puede garantizar un
   bloqueo absoluto. Herramientas externas, extensiones, modificar el
   código fuente, el reconocimiento de voz o "teclear" automáticamente
   pueden saltarse estas medidas. Son controles razonables del navegador
   para fomentar la escritura propia, NO una medida de seguridad.
   No afectan a otras aplicaciones ni al sistema operativo.
   ===================================================================== */
(function (CQ) {
  'use strict';

  var MSG = 'En esta misión debes escribir tus propias instrucciones para practicar JavaScript';
  var PROTECTED = '[data-protected], .editor, .code-block, .order-board, textarea, input, .lv-panel, .workbench';

  function notify(what) {
    if (CQ.Progress) CQ.Progress.countPasteAttempt(what);
    if (CQ.UI) CQ.UI.toast('✋ ' + MSG + '.', 'warn', 3200);
  }

  function block(e, what) {
    e.preventDefault();
    e.stopPropagation();
    notify(what || e.type);
  }

  function isEditable(t) {
    return t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.isContentEditable);
  }

  function init() {
    // 1-4. Atajos de teclado (Windows/Linux con Ctrl, macOS con Cmd)
    document.addEventListener('keydown', function (e) {
      var k = (e.key || '').toLowerCase(), code = e.code || '';
      var mod = e.ctrlKey || e.metaKey;
      if (mod && !e.altKey && (k === 'c' || k === 'v' || k === 'x' || code === 'KeyC' || code === 'KeyV' || code === 'KeyX')) {
        return block(e, k === 'v' || code === 'KeyV' ? 'paste' : (k === 'x' || code === 'KeyX' ? 'cut' : 'copy'));
      }
      if (e.shiftKey && k === 'insert') return block(e, 'paste');   // Shift+Insert = pegar
      if (mod && k === 'insert') return block(e, 'copy');           // Ctrl+Insert = copiar
      if (e.shiftKey && !mod && k === 'delete' && isEditable(e.target) && e.target.selectionStart !== e.target.selectionEnd) {
        return block(e, 'cut');                                    // Shift+Supr = cortar
      }
    }, true);

    // 5. Eventos del portapapeles (incluye el menú del navegador y gestos táctiles)
    ['copy', 'cut', 'paste'].forEach(function (type) {
      document.addEventListener(type, function (e) { block(e, type); }, true);
    });

    // 8. Otras vías de inserción detectables
    document.addEventListener('beforeinput', function (e) {
      if (/^insertFrom(Paste|Drop|Yank|PasteAsQuotation)$/.test(e.inputType || '')) block(e, e.inputType);
    }, true);

    // 6. Menú contextual desactivado en zonas de código y actividades
    document.addEventListener('contextmenu', function (e) {
      if (e.target.closest && e.target.closest(PROTECTED)) {
        e.preventDefault();
        if (CQ.UI) CQ.UI.toast('El menú contextual está desactivado en las zonas de código.', 'info', 2200);
      }
    }, true);

    // 7. Arrastrar y soltar texto
    document.addEventListener('dragstart', function (e) {
      if (!(e.target.closest && e.target.closest('[data-draggable]'))) e.preventDefault();
    }, true);
    document.addEventListener('dragover', function (e) {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'none';
    }, true);
    document.addEventListener('drop', function (e) { block(e, 'drop'); }, true);
  }

  CQ.Restrictions = { init: init, notify: notify, MESSAGE: MSG };
})(window.CQ = window.CQ || {});
