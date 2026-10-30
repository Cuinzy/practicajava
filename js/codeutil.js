/* =====================================================================
   CODE QUEST · codeutil.js
   Utilidades de análisis de código JavaScript (sin ejecutarlo):
   - distinguir código, cadenas y comentarios
   - revisar paréntesis/llaves/corchetes
   - extraer condiciones y nombres declarados
   - instrumentar ciclos con un "guardián" anti ciclos infinitos
   ===================================================================== */
(function (CQ) {
  'use strict';

  function isQuote(c) { return c === '"' || c === "'" || c === '`'; }

  /** Devuelve el índice justo después de la cadena que empieza en j. */
  function skipString(code, j) {
    var q = code[j];
    j++;
    while (j < code.length) {
      var c = code[j];
      if (c === '\\') { j += 2; continue; }
      if (c === q) return j + 1;
      if (q !== '`' && c === '\n') return j; // cadena sin cerrar
      j++;
    }
    return j;
  }

  function isCommentStart(code, j) {
    return code[j] === '/' && (code[j + 1] === '/' || code[j + 1] === '*');
  }

  function skipComment(code, j) {
    if (code[j + 1] === '/') {
      var e = code.indexOf('\n', j);
      return e < 0 ? code.length : e;
    }
    var e2 = code.indexOf('*/', j + 2);
    return e2 < 0 ? code.length : e2 + 2;
  }

  /** Quita comentarios conservando saltos de línea y posiciones. */
  function stripComments(code) {
    var out = '', i = 0;
    while (i < code.length) {
      var c = code[i];
      if (isQuote(c)) {
        var e = skipString(code, i);
        out += code.slice(i, e); i = e;
      } else if (isCommentStart(code, i)) {
        var e2 = skipComment(code, i);
        out += code.slice(i, e2).replace(/[^\n]/g, ' '); i = e2;
      } else { out += c; i++; }
    }
    return out;
  }

  /** Reemplaza el contenido de las cadenas por espacios (mantiene comillas). */
  function blankStrings(code) {
    var out = '', i = 0;
    while (i < code.length) {
      var c = code[i];
      if (isQuote(c)) {
        var e = skipString(code, i);
        var body = code.slice(i + 1, e).replace(/[^\n]/g, ' ');
        out += c + body; i = e;
      } else { out += c; i++; }
    }
    return out;
  }

  /** Busca cadenas sin cerrar. Devuelve {line} o null. */
  function unclosedString(code) {
    var s = stripComments(code), i = 0;
    while (i < s.length) {
      var c = s[i];
      if (isQuote(c)) {
        var e = skipString(s, i);
        var closed = e <= s.length && s[e - 1] === c && e - 1 > i;
        if (!closed) return { line: lineOf(s, i), quote: c };
        i = e;
      } else i++;
    }
    return null;
  }

  function lineOf(code, index) {
    var n = 1;
    for (var i = 0; i < index && i < code.length; i++) if (code[i] === '\n') n++;
    return n;
  }

  /**
   * Revisa el balance de ( ) [ ] { }.
   * Devuelve null si todo está bien o un objeto describiendo el problema.
   */
  function brackets(code) {
    var s = blankStrings(stripComments(code));
    var stack = [], line = 1, pairs = { ')': '(', ']': '[', '}': '{' };
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '\n') { line++; continue; }
      if (c === '(' || c === '[' || c === '{') stack.push({ c: c, line: line });
      else if (pairs[c]) {
        var top = stack.pop();
        if (!top) return { kind: 'extra', ch: c, line: line };
        if (top.c !== pairs[c]) return { kind: 'mismatch', open: top.c, openLine: top.line, ch: c, line: line };
      }
    }
    if (stack.length) {
      var t = stack[stack.length - 1];
      return { kind: 'unclosed', ch: t.c, line: t.line };
    }
    return null;
  }

  /** Índice del paréntesis que cierra al que está en j (o -1). */
  function matchParen(code, j) {
    var depth = 0, n = code.length;
    while (j < n) {
      var c = code[j];
      if (isQuote(c)) { j = skipString(code, j); continue; }
      if (isCommentStart(code, j)) { j = skipComment(code, j); continue; }
      if (c === '(') depth++;
      else if (c === ')') { depth--; if (depth === 0) return j; }
      j++;
    }
    return -1;
  }

  function skipSpace(code, j) {
    while (j < code.length) {
      if (/\s/.test(code[j])) j++;
      else if (isCommentStart(code, j)) j = skipComment(code, j);
      else break;
    }
    return j;
  }

  /** Divide por ';' de nivel superior (fuera de cadenas y paréntesis). */
  function splitTop(s) {
    var parts = [], depth = 0, last = 0, i = 0;
    while (i < s.length) {
      var c = s[i];
      if (isQuote(c)) { i = skipString(s, i); continue; }
      if (isCommentStart(s, i)) { i = skipComment(s, i); continue; }
      if (c === '(' || c === '[' || c === '{') depth++;
      else if (c === ')' || c === ']' || c === '}') depth--;
      else if (c === ';' && depth === 0) { parts.push(s.slice(last, i)); last = i + 1; }
      i++;
    }
    parts.push(s.slice(last));
    return parts;
  }

  /** Recorre palabras clave fuera de cadenas/comentarios. */
  function eachKeyword(code, words, cb) {
    var i = 0, n = code.length;
    while (i < n) {
      var c = code[i];
      if (isQuote(c)) { i = skipString(code, i); continue; }
      if (isCommentStart(code, i)) { i = skipComment(code, i); continue; }
      if (/[A-Za-z_$]/.test(c)) {
        var m = /^[A-Za-z_$][\w$]*/.exec(code.slice(i, i + 40));
        var w = m[0];
        var prev = i > 0 ? code[i - 1] : '';
        if (words.indexOf(w) >= 0 && prev !== '.' && !/[\w$]/.test(prev)) cb(w, i);
        i += w.length;
        continue;
      }
      i++;
    }
  }

  /** Extrae las condiciones de if / while / for. */
  function conditions(code) {
    var res = [];
    eachKeyword(code, ['if', 'while', 'for'], function (w, i) {
      var j = skipSpace(code, i + w.length);
      if (code[j] !== '(') return;
      var close = matchParen(code, j);
      if (close < 0) return;
      var after = skipSpace(code, close + 1);
      res.push({ kw: w, text: code.slice(j + 1, close), line: lineOf(code, i), semicolonAfter: code[after] === ';' });
    });
    return res;
  }

  /** Nombres declarados con let / const / var / function. */
  function declaredNames(code) {
    var s = blankStrings(stripComments(code)), names = [], m;
    var re = /\b(?:let|const|var)\s+([A-Za-z_$áéíóúñÁÉÍÓÚÑ][\w$áéíóúñÁÉÍÓÚÑ]*)/g;
    while ((m = re.exec(s))) if (names.indexOf(m[1]) < 0) names.push(m[1]);
    var re2 = /\bfunction\s+([A-Za-z_$][\w$]*)/g;
    while ((m = re2.exec(s))) if (names.indexOf(m[1]) < 0) names.push(m[1]);
    return names;
  }

  /** Nombres declarados en el nivel superior (no dentro de funciones/bloques). */
  function topLevelNames(code) {
    var s = blankStrings(stripComments(code)), names = [], depth = 0;
    var lines = s.split('\n');
    lines.forEach(function (ln) {
      if (depth === 0) {
        var m = /^\s*(?:let|const|var)\s+([A-Za-z_$áéíóúñÁÉÍÓÚÑ][\w$áéíóúñÁÉÍÓÚÑ]*)/.exec(ln);
        if (m && names.indexOf(m[1]) < 0) names.push(m[1]);
      }
      for (var k = 0; k < ln.length; k++) {
        if (ln[k] === '{') depth++;
        else if (ln[k] === '}') depth = Math.max(0, depth - 1);
      }
    });
    return names;
  }

  /**
   * Instrumenta ciclos for / while / do-while para que llamen a __lg()
   * (guardián de ciclos). No añade saltos de línea: los números de línea
   * de los errores siguen coincidiendo con el código del estudiante.
   */
  function instrumentLoops(code) {
    var out = '', i = 0, n = code.length;
    while (i < n) {
      var c = code[i];
      if (isQuote(c)) { var e = skipString(code, i); out += code.slice(i, e); i = e; continue; }
      if (isCommentStart(code, i)) { var e2 = skipComment(code, i); out += code.slice(i, e2); i = e2; continue; }
      if (/[A-Za-z_$]/.test(c)) {
        var w = /^[A-Za-z_$][\w$]*/.exec(code.slice(i, i + 60))[0];
        var prev = i > 0 ? code[i - 1] : '';
        if ((w === 'for' || w === 'while') && prev !== '.' && !/[\w$]/.test(prev)) {
          var j = skipSpace(code, i + w.length);
          if (code[j] === '(') {
            var close = matchParen(code, j);
            if (close > 0) {
              var inner = code.slice(j + 1, close);
              out += code.slice(i, j + 1);
              if (w === 'while') {
                out += '__lg()&&(' + inner + ')';
              } else {
                var parts = splitTop(inner);
                if (parts.length === 3) {
                  parts[1] = /\S/.test(parts[1]) ? '__lg()&&(' + parts[1] + ')' : '__lg()' + parts[1];
                  out += parts.join(';');
                } else {
                  // for...of / for...in: guardia al inicio del cuerpo
                  out += inner + ')';
                  i = close + 1;
                  var k = skipSpace(code, i);
                  if (code[k] === '{') { out += code.slice(i, k + 1) + '__lg();'; i = k + 1; }
                  continue;
                }
              }
              out += ')';
              i = close + 1;
              continue;
            }
          }
        }
        out += w; i += w.length; continue;
      }
      out += c; i++;
    }
    return out;
  }

  /** Distancia de edición (para sugerir nombres parecidos). */
  function distance(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) { m[i] = [i]; }
    for (j = 0; j <= b.length; j++) { m[0][j] = j; }
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return m[a.length][b.length];
  }

  CQ.Code = {
    isQuote: isQuote,
    skipString: skipString,
    stripComments: stripComments,
    blankStrings: blankStrings,
    unclosedString: unclosedString,
    brackets: brackets,
    conditions: conditions,
    declaredNames: declaredNames,
    topLevelNames: topLevelNames,
    instrumentLoops: instrumentLoops,
    lineOf: lineOf,
    distance: distance
  };
})(window.CQ = window.CQ || {});
