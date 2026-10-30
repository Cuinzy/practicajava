/* =====================================================================
   CODE QUEST · evaluator.js
   Evaluación FUNCIONAL de los retos. No compara texto con una respuesta:
     1. ¿Quedan espacios ___ sin completar?
     2. ¿La sintaxis es válida?
     3. ¿Se usan los conceptos requeridos? (requires / forbids)
     4. ¿El programa funciona? Se ejecuta en entornos aislados con
        distintos valores de entrada (setup) y se aplican pruebas (check).
   Cualquier solución que cumpla las pruebas es válida.
   ===================================================================== */
(function (CQ) {
  'use strict';

  /** Convierte una función de prueba en texto ejecutable dentro del iframe. */
  function srcOf(fn) {
    var s = String(fn).trim();
    if (!/^(function\b|\(|async\b|[\w$]+\s*=>)/.test(s)) s = 'function ' + s;
    return s;
  }

  /** Lista de criterios visibles para el estudiante (antes de evaluar). */
  function criteria(ch) {
    var items = [{ key: 'syntax', label: 'El código no tiene errores de sintaxis' }];
    (ch.requires || []).forEach(function (r, i) { items.push({ key: 'req' + i, label: r[1] }); });
    (ch.forbids || []).forEach(function (r, i) { items.push({ key: 'forb' + i, label: r[1] }); });
    (ch.tests || []).forEach(function (t, i) { items.push({ key: 'test' + i, label: t.label }); });
    return items;
  }

  /**
   * Evalúa un reto de código.
   * @returns {Promise<{passed, items, error, tips, blanks}>}
   */
  async function evaluate(ch, code, scene, baseSetup) {
    var items = criteria(ch).map(function (it) { return { key: it.key, label: it.label, ok: null, msg: '' }; });
    var byKey = {}; items.forEach(function (it) { byKey[it.key] = it; });
    var res = { passed: false, items: items, error: null, tips: CQ.Errors.lint(code), blanks: false };

    if (/_{3,}/.test(code)) {
      res.blanks = true;
      byKey.syntax.ok = false;
      byKey.syntax.msg = 'Todavía hay espacios ___ por completar.';
      return res;
    }
    if (!code.trim()) {
      byKey.syntax.ok = false;
      byKey.syntax.msg = 'El editor está vacío: escribe tu solución.';
      return res;
    }

    // Agrupar pruebas por escenario (setup) para ejecutar en paralelo
    var groups = [], map = {};
    (ch.tests || []).forEach(function (t, i) {
      var setup = (baseSetup || '') + '\n' + (t.setup || '');
      if (!map[setup]) { map[setup] = { setup: setup, tests: [] }; groups.push(map[setup]); }
      map[setup].tests.push({ i: i, src: srcOf(t.check) });
    });
    if (!groups.length) groups.push({ setup: baseSetup || '', tests: [] });

    var runs = await Promise.all(groups.map(function (g) {
      return CQ.Sandbox.run({ code: code, setup: g.setup, checks: g.tests.map(function (t) { return t.src; }), scene: scene, visible: false, timeout: 4500 });
    }));

    // 1) Sintaxis
    var syntaxRun = runs.find(function (r) { return r.phase === 'syntax'; });
    if (syntaxRun) {
      byKey.syntax.ok = false;
      byKey.syntax.msg = 'Corrige el error de sintaxis para poder probar tu programa.';
      res.error = CQ.Errors.explain(syntaxRun.errors[0] || { name: 'SyntaxError', message: '' }, code);
      return res;
    }
    byKey.syntax.ok = true;

    // 2) Conceptos requeridos (sobre el código sin comentarios)
    var stripped = CQ.Code.stripComments(code);
    (ch.requires || []).forEach(function (r, i) {
      var ok = r[0].test(stripped);
      byKey['req' + i].ok = ok;
      if (!ok) byKey['req' + i].msg = r[2] || 'Tu solución debe cumplir: ' + r[1].toLowerCase();
    });
    (ch.forbids || []).forEach(function (r, i) {
      var ok = !r[0].test(stripped);
      byKey['forb' + i].ok = ok;
      if (!ok) byKey['forb' + i].msg = r[2] || 'Tu solución no debe: ' + r[1].toLowerCase();
    });

    // 3) Pruebas funcionales
    groups.forEach(function (g, gi) {
      var run = runs[gi];
      g.tests.forEach(function (t, k) {
        var item = byKey['test' + t.i];
        if (run.phase !== 'done') {
          item.ok = false;
          var e0 = run.errors && run.errors[0];
          item.msg = run.phase === 'early' ? 'Tu programa terminó antes de llegar al final (¿un return fuera de una función?).' : 'El programa se detuvo por un error antes de poder comprobar esto.';
          if (e0 && !res.error) res.error = CQ.Errors.explain(e0, code);
          return;
        }
        var r = run.results[k] || { ok: false, msg: 'No se pudo comprobar.' };
        item.ok = r.ok;
        item.msg = r.ok ? '' : r.msg;
        if (!r.ok && r.error && !res.error) res.error = CQ.Errors.explain(r.error, code);
      });
    });

    res.passed = items.every(function (it) { return it.ok === true; });
    return res;
  }

  CQ.Evaluator = { evaluate: evaluate, criteria: criteria, srcOf: srcOf };
})(window.CQ = window.CQ || {});
