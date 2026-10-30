/* =====================================================================
   CODE QUEST · editor.js
   Editor de código propio: textarea transparente sobre una capa con
   resaltado de sintaxis, numeración de líneas, indentación automática,
   marcas de error y de paso. Compatible con teclado físico y con
   deshacer/rehacer del navegador (usa insertText cuando es posible).

   Teclas:  Tab / Shift+Tab → indentar / desindentar
            Enter          → nueva línea con la indentación correcta
            Ctrl/Cmd+Enter → ejecutar
            Esc y luego Tab → salir del editor (accesibilidad)
   ===================================================================== */
(function (CQ) {
  'use strict';

  var INDENT = '  ';
  var PAIRS = { '{': '}', '(': ')', '[': ']' };

  function Editor(host, opts) {
    this.opts = opts || {};
    this.host = host;
    this.marks = {};          // línea → clase
    this.readOnly = false;
    this.internal = false;
    this.escapeTab = false;
    host.classList.add('editor');
    host.setAttribute('data-protected', '1');
    host.innerHTML =
      '<div class="ed-gutter" aria-hidden="true"><div class="ed-gutter-in"></div></div>' +
      '<div class="ed-main"><pre class="ed-hl" aria-hidden="true"><code></code></pre>' +
      '<textarea class="ed-input" spellcheck="false" autocomplete="off" autocorrect="off" autocapitalize="off" wrap="off" aria-label="Editor de código JavaScript" aria-describedby="ed-help"></textarea></div>' +
      '<div class="ed-status" id="ed-help">Tab: indentar · Ctrl+Enter: ejecutar · Esc y Tab: salir del editor</div>';
    this.ta = host.querySelector('.ed-input');
    this.code = host.querySelector('.ed-hl code');
    this.pre = host.querySelector('.ed-hl');
    this.gutter = host.querySelector('.ed-gutter-in');
    this.status = host.querySelector('.ed-status');
    this.last = '';
    var self = this;
    this.ta.addEventListener('input', function (e) { self._onInput(e); });
    this.ta.addEventListener('scroll', function () { self._sync(); });
    this.ta.addEventListener('keydown', function (e) { self._key(e); });
    this.ta.addEventListener('blur', function () { self.escapeTab = false; });
    this.setValue(this.opts.value || '');
  }

  Editor.prototype.getValue = function () { return this.ta.value; };

  Editor.prototype.setValue = function (v) {
    this.ta.value = v || '';
    this.last = this.ta.value;
    this.marks = {};
    this.render();
    this.ta.scrollTop = 0;
    this._sync();
  };

  Editor.prototype.setReadOnly = function (ro) {
    this.readOnly = !!ro;
    this.ta.readOnly = !!ro;
    this.host.classList.toggle('readonly', !!ro);
    this.status.textContent = ro ? 'Solo lectura · observa el código' : 'Tab: indentar · Ctrl+Enter: ejecutar · Esc y Tab: salir del editor';
  };

  Editor.prototype.focus = function () { this.ta.focus(); };

  /** Marca una línea: kind = 'err' | 'step' | 'ok'. */
  Editor.prototype.mark = function (line, kind) { if (line > 0) { this.marks[line] = kind; this.render(); } };
  Editor.prototype.clearMarks = function (kind) {
    var self = this;
    Object.keys(this.marks).forEach(function (k) { if (!kind || self.marks[k] === kind) delete self.marks[k]; });
    this.render();
  };
  Editor.prototype.markRange = function (a, b, kind) {
    this.clearMarks(kind);
    for (var i = a; i <= b; i++) this.marks[i] = kind;
    this.render();
    this.scrollToLine(a);
  };
  Editor.prototype.scrollToLine = function (line) {
    var lh = parseFloat(getComputedStyle(this.ta).lineHeight) || 20;
    var top = (line - 1) * lh;
    if (top < this.ta.scrollTop || top > this.ta.scrollTop + this.ta.clientHeight - lh * 2) this.ta.scrollTop = Math.max(0, top - lh * 2);
  };

  Editor.prototype.render = function () {
    var lines = CQ.Highlight.lines(this.ta.value), marks = this.marks;
    this.code.innerHTML = lines.map(function (l, i) {
      var m = marks[i + 1];
      return '<div class="ed-line' + (m ? ' m-' + m : '') + '">' + (l || ' ') + '</div>';
    }).join('');
    var g = '';
    for (var i = 1; i <= lines.length; i++) g += '<div class="' + (marks[i] ? 'm-' + marks[i] : '') + '">' + i + '</div>';
    this.gutter.innerHTML = g;
    this._sync();
  };

  Editor.prototype._sync = function () {
    this.pre.style.transform = 'translate(' + (-this.ta.scrollLeft) + 'px,' + (-this.ta.scrollTop) + 'px)';
    this.gutter.style.transform = 'translateY(' + (-this.ta.scrollTop) + 'px)';
  };

  Editor.prototype._onInput = function (e) {
    var v = this.ta.value;
    // Heurística contra inserciones masivas no detectadas como pegado
    if (e && !this.internal && e.inputType && !/^(history|delete)/.test(e.inputType) && v.length - this.last.length > 40) {
      var pos = Math.max(0, this.ta.selectionStart - (v.length - this.last.length));
      this.ta.value = this.last;
      this.ta.selectionStart = this.ta.selectionEnd = pos;
      if (CQ.Restrictions) CQ.Restrictions.notify('bulk-insert');
      this.render();
      return;
    }
    this.last = v;
    if (Object.keys(this.marks).length) this.marks = {};
    this.render();
    if (this.opts.onChange) this.opts.onChange(v);
  };

  /** Inserta texto en la posición del cursor conservando deshacer. */
  Editor.prototype.insert = function (text, selStart, selEnd) {
    var ta = this.ta;
    if (selStart != null) { ta.selectionStart = selStart; ta.selectionEnd = selEnd; }
    this.internal = true;
    var ok = false;
    try { ok = document.execCommand('insertText', false, text); } catch (e) { ok = false; }
    if (!ok) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
      this._onInput(null);
    }
    this.internal = false;
  };

  Editor.prototype._lineStart = function (pos) { return this.ta.value.lastIndexOf('\n', pos - 1) + 1; };

  Editor.prototype._key = function (e) {
    var ta = this.ta, v = ta.value, s = ta.selectionStart, en = ta.selectionEnd;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (this.opts.onRun) this.opts.onRun();
      return;
    }
    if (e.key === 'Escape') { this.escapeTab = true; this.status.textContent = 'Pulsa Tab para salir del editor'; return; }
    if (this.readOnly) return;
    if (e.key === 'Tab') {
      if (this.escapeTab) { this.escapeTab = false; return; }   // deja salir el foco
      e.preventDefault();
      var ls = this._lineStart(s);
      if (s === en && !e.shiftKey) { this.insert(INDENT); return; }
      // Indentar / desindentar varias líneas
      var le = v.indexOf('\n', en === s ? en : en - 1); if (le < 0) le = v.length;
      var block = v.slice(ls, le);
      var nb = e.shiftKey ? block.replace(/^ {1,2}/gm, '') : block.replace(/^/gm, INDENT);
      this.insert(nb, ls, le);
      ta.selectionStart = ls; ta.selectionEnd = ls + nb.length;
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      var lineStart = this._lineStart(s);
      var line = v.slice(lineStart, s);
      var indent = /^\s*/.exec(line)[0];
      var before = v.slice(0, s).replace(/\s+$/, '').slice(-1);
      var after = v.slice(en).replace(/^[ \t]+/, '').charAt(0);
      if (PAIRS[before]) {
        if (after === PAIRS[before]) {
          this.insert('\n' + indent + INDENT + '\n' + indent);
          ta.selectionStart = ta.selectionEnd = s + 1 + indent.length + INDENT.length;
        } else this.insert('\n' + indent + INDENT);
      } else this.insert('\n' + indent);
      return;
    }
    if ((e.key === '}' || e.key === ')' || e.key === ']') && s === en) {
      var ls2 = this._lineStart(s), cur = v.slice(ls2, s);
      if (/^\s+$/.test(cur) && cur.length >= INDENT.length) {
        e.preventDefault();
        this.insert(cur.slice(INDENT.length) + e.key, ls2, s);
      }
    }
  };

  CQ.Editor = Editor;
})(window.CQ = window.CQ || {});
