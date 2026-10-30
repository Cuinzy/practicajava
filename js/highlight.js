/* =====================================================================
   CODE QUEST · highlight.js
   Resaltado de sintaxis JavaScript ligero y sin dependencias.
   ===================================================================== */
(function (CQ) {
  'use strict';

  var KW = /^(?:let|const|var|function|return|if|else|for|while|do|break|continue|new|typeof|instanceof|in|of|switch|case|default|try|catch|finally|throw|class|this)$/;
  var LIT = /^(?:true|false|null|undefined|NaN|Infinity)$/;
  var GLOBALS = /^(?:console|document|window|Math|Number|String|Array|Object|JSON|robot)$/;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /** Divide el código en tokens [tipo, texto]. */
  function tokens(code) {
    var out = [], i = 0, n = code.length, m, rest;
    while (i < n) {
      var c = code[i], j;
      if (c === '/' && code[i + 1] === '/') {
        j = code.indexOf('\n', i); if (j < 0) j = n;
        out.push(['com', code.slice(i, j)]); i = j; continue;
      }
      if (c === '/' && code[i + 1] === '*') {
        j = code.indexOf('*/', i + 2); j = j < 0 ? n : j + 2;
        out.push(['com', code.slice(i, j)]); i = j; continue;
      }
      if (CQ.Code.isQuote(c)) {
        j = CQ.Code.skipString(code, i);
        out.push(['str', code.slice(i, j)]); i = j; continue;
      }
      rest = code.slice(i, i + 80);
      if (/[0-9]/.test(c)) {
        m = /^(?:0[xX][\da-fA-F]+|\d+\.?\d*(?:[eE][+-]?\d+)?)/.exec(rest);
        out.push(['num', m[0]]); i += m[0].length; continue;
      }
      if (/[A-Za-z_$áéíóúñÁÉÍÓÚÑü]/.test(c)) {
        m = /^[\w$áéíóúñÁÉÍÓÚÑü]+/.exec(rest);
        var w = m[0], type = 'id';
        var k = i + w.length;
        while (k < n && (code[k] === ' ' || code[k] === '\t')) k++;
        var prev = out.length ? out[out.length - 1][1] : '';
        if (KW.test(w)) type = 'kw';
        else if (LIT.test(w)) type = 'lit';
        else if (prev === '.') type = code[k] === '(' ? 'fn' : 'prop';
        else if (code[k] === '(') type = 'fn';
        else if (GLOBALS.test(w)) type = 'glob';
        out.push([type, w]); i += w.length; continue;
      }
      if (/[+\-*/%=<>!&|?:]/.test(c)) {
        m = /^[+\-*/%=<>!&|?:]+/.exec(rest);
        out.push(['op', m[0]]); i += m[0].length; continue;
      }
      if (/[()[\]{}]/.test(c)) { out.push(['pun', c]); i++; continue; }
      out.push(['txt', c]); i++;
    }
    return out;
  }

  /** Devuelve un arreglo con el HTML resaltado de cada línea. */
  function lines(code) {
    var res = [''];
    tokens(code).forEach(function (t) {
      var parts = t[1].split('\n');
      parts.forEach(function (p, idx) {
        if (idx > 0) res.push('');
        if (p) res[res.length - 1] += t[0] === 'txt' ? esc(p) : '<span class="t-' + t[0] + '">' + esc(p) + '</span>';
      });
    });
    return res;
  }

  function html(code) { return lines(code).join('\n'); }

  /** Bloque de código de solo lectura con números de línea. */
  function block(code, opts) {
    opts = opts || {};
    var ls = lines(code);
    return '<div class="code-block' + (opts.cls ? ' ' + opts.cls : '') + '" data-protected="1"><pre>' +
      ls.map(function (l, i) {
        return '<span class="cl" data-line="' + (i + 1) + '"><span class="cn">' + (i + 1) + '</span>' + (l || ' ') + '</span>';
      }).join('\n') + '</pre></div>';
  }

  /** Código en línea resaltado. */
  function inline(code) { return '<code class="ic">' + html(code) + '</code>'; }

  CQ.Highlight = { tokens: tokens, lines: lines, html: html, block: block, inline: inline, esc: esc };
})(window.CQ = window.CQ || {});
