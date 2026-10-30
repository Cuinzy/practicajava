/* =====================================================================
   CODE QUEST · errors.js
   Traduce errores técnicos de JavaScript a explicaciones para
   principiantes, y detecta errores típicos antes de ejecutar (consejos).
   Siempre se muestran ambos: explicación pedagógica + detalle técnico.
   ===================================================================== */
(function (CQ) {
  'use strict';

  var esc = function (s) { return CQ.Highlight.esc(s); };
  var c = function (s) { return '<code>' + esc(s) + '</code>'; };

  var KNOWN = ['console', 'log', 'document', 'querySelector', 'querySelectorAll', 'getElementById', 'textContent', 'innerHTML',
    'classList', 'add', 'remove', 'toggle', 'contains', 'addEventListener', 'createElement', 'appendChild', 'style', 'length', 'push', 'pop',
    'value', 'checked', 'Math', 'floor', 'round', 'Number', 'String', 'function', 'return', 'robot', 'avanzar', 'retroceder',
    'recoger', 'decir', 'hayCristal', 'posicion', 'encenderLuz', 'apagarLuz', 'luzEncendida', 'abrirPuerta', 'cerrarPuerta',
    'mostrarAlerta', 'activarAlarma', 'cambiarLuz', 'fabricar', 'pesoCaja', 'mostrarTotal', 'backgroundColor', 'fontSize', 'width',
    'trim', 'toUpperCase', 'toLowerCase', 'includes', 'forEach', 'true', 'false', 'null', 'undefined', 'let', 'const', 'var'];

  // Propiedades/métodos donde las mayúsculas importan y un error NO produce excepción
  var CASE_SENSITIVE = ['textContent', 'innerHTML', 'classList', 'addEventListener', 'querySelector', 'querySelectorAll',
    'getElementById', 'createElement', 'appendChild', 'backgroundColor', 'fontSize', 'borderRadius', 'length', 'toUpperCase',
    'toLowerCase', 'hayCristal', 'encenderLuz', 'apagarLuz', 'mostrarAlerta', 'abrirPuerta', 'cambiarLuz', 'mostrarTotal', 'pesoCaja'];

  function suggest(name, code) {
    var pool = KNOWN.concat(CQ.Code.declaredNames(code || ''));
    var best = null, bestD = 99;
    pool.forEach(function (k) {
      if (k === name) return;
      var d = CQ.Code.distance(name, k);
      if (d < bestD) { bestD = d; best = k; }
    });
    var limit = name.length <= 4 ? 1 : 2;
    return bestD <= limit ? best : null;
  }

  function bracketText(b) {
    var names = { '(': 'paréntesis', '[': 'corchete', '{': 'llave', ')': 'paréntesis', ']': 'corchete', '}': 'llave' };
    var close = { '(': ')', '[': ']', '{': '}' };
    if (b.kind === 'unclosed') {
      var extra = b.ch === '(' ? ' Revisa los paréntesis de esa instrucción o condición: parece que falta cerrar uno de ellos.' :
        b.ch === '{' ? ' Cada bloque que abres con { (en un if, for o function) debe cerrarse con }.' : '';
      return { title: 'Falta cerrar un ' + names[b.ch], text: 'En la línea ' + b.line + ' abriste ' + c(b.ch) + ' pero nunca lo cerraste con ' + c(close[b.ch]) + '.' + extra, line: b.line };
    }
    if (b.kind === 'extra') {
      return { title: 'Sobra un ' + names[b.ch], text: 'En la línea ' + b.line + ' hay un ' + c(b.ch) + ' que no cierra nada. Puede que sobre, o que falte su pareja de apertura antes.', line: b.line };
    }
    return {
      title: 'Símbolos que no coinciden',
      text: 'En la línea ' + b.openLine + ' abriste ' + c(b.open) + ', pero en la línea ' + b.line + ' se cierra con ' + c(b.ch) + '. Cada símbolo se cierra con su pareja: ( ) · [ ] · { }.',
      line: b.line
    };
  }

  /** Patrones de mensajes de error (Chrome, Edge, Firefox y Safari). */
  var PATTERNS = [
    [/(?:^|\s)([\w$áéíóúñ]+) is not defined|Can't find variable: ([\w$]+)/i, function (m, code) {
      var name = m[1] || m[2];
      var s = suggest(name, code);
      var t = 'Usaste ' + c(name) + ', pero JavaScript no conoce nada con ese nombre.';
      if (/^consol[ae]?$/i.test(name) || name === 'Console') t += ' La consola se escribe en inglés y en minúsculas: ' + c('console') + '.';
      else if (s) t += ' ¿Quisiste escribir ' + c(s) + '? Recuerda que JavaScript distingue mayúsculas y minúsculas.';
      else if (/^[a-záéíóúñ]+$/i.test(name) && new RegExp('\\(\\s*' + name + '\\s*\\)').test(code)) t += ' Si querías escribir un texto, ponlo entre comillas: ' + c('"' + name + '"') + '.';
      else t += ' Si es una variable, primero debes declararla con ' + c('let') + ' o ' + c('const') + '.';
      return { title: 'Nombre desconocido', text: t };
    }],
    [/([\w$.[\]"']+) is not a function/i, function (m, code) {
      var full = m[1], last = full.split('.').pop();
      var s = suggest(last, code);
      var t = 'Intentaste ejecutar ' + c(full + '()') + ' como si fuera una función, pero no lo es.';
      if (s) t += ' ¿Quisiste decir ' + c(s) + '? Revisa mayúsculas y minúsculas.';
      else t += ' Revisa que el nombre esté bien escrito y que realmente sea una función.';
      return { title: 'Eso no es una función', text: t };
    }],
    [/Cannot (?:read|set) propert(?:y|ies) of null|(\w+) is null|null is not an object/i, function () {
      return {
        title: 'El elemento no existe (null)',
        text: 'Intentaste usar algo que vale ' + c('null'), extra: '<ul><li>Si usaste ' + c('querySelector') + ' o ' + c('getElementById') + ', el elemento <b>no se encontró</b>.</li><li>Revisa el selector: ' + c('#id') + ' para id, ' + c('.clase') + ' para clase. Con ' + c('getElementById') + ' se escribe el id <b>sin</b> #.</li><li>El nombre debe coincidir exactamente (mayúsculas incluidas).</li></ul>'
      };
    }],
    [/Cannot (?:read|set) propert(?:y|ies) of undefined|(\w+) is undefined|undefined is not an object/i, function () {
      return { title: 'Algo vale undefined', text: 'Intentaste leer o cambiar una propiedad de algo que vale ' + c('undefined') + '. ¿Escribiste bien el nombre? Si es un arreglo, ¿existe esa posición? (los índices empiezan en 0 y el último es ' + c('length - 1') + ').' };
    }],
    [/Assignment to constant variable|invalid assignment to const|Attempted to assign to readonly property/i, function () {
      return { title: 'Una constante no puede cambiar', text: 'Declaraste esa variable con ' + c('const') + ', así que no puedes asignarle otro valor. Si su valor debe cambiar, declárala con ' + c('let') + '.' };
    }],
    [/Identifier '([\w$]+)' has already been declared|redeclaration of (?:let|const) ([\w$]+)|Cannot declare a (?:let|const) variable twice: '?([\w$]+)/i, function (m) {
      var n = m[1] || m[2] || m[3];
      return { title: 'Variable declarada dos veces', text: 'La variable ' + c(n) + ' ya fue creada antes. Para cambiar su valor no repitas ' + c('let') + ': escribe solo ' + c(n + ' = nuevoValor') + '.' };
    }],
    [/Cannot access '([\w$]+)' before initialization|can't access lexical declaration '?([\w$]+)'? before initialization/i, function (m) {
      var n = m[1] || m[2];
      return { title: 'Variable usada antes de crearse', text: 'Usaste ' + c(n) + ' antes de la línea donde se declara. El programa se lee de arriba hacia abajo: mueve la declaración más arriba.' };
    }],
    [/Maximum call stack size exceeded|too much recursion/i, function () {
      return { title: 'Una función se llama a sí misma sin fin', text: 'Una función se está llamando a sí misma una y otra vez. Revisa que no llames a la misma función dentro de su propio cuerpo.' };
    }],
    [/Invalid left-hand side in assignment|invalid assignment left-hand side/i, function () {
      return { title: 'Asignación imposible', text: 'A la izquierda de ' + c('=') + ' debe ir una variable o propiedad. Si querías <b>comparar</b>, usa ' + c('===') + '.' };
    }],
    [/is not a valid selector|An invalid or illegal string was specified/i, function () {
      return { title: 'Selector no válido', text: 'El texto que pasaste a ' + c('querySelector') + ' no es un selector CSS válido. Ejemplos correctos: ' + c('"#titulo"') + ', ' + c('".boton"') + ', ' + c('"p"') + '.' };
    }],
    [/parameter 1 is not of type 'Node'|Argument 1 .* does not implement interface Node|appendChild/i, function () {
      return { title: 'appendChild necesita un elemento', text: c('appendChild()') + ' solo acepta elementos creados con ' + c('document.createElement()') + ' (o encontrados con querySelector), no textos.' };
    }],
    [/is not iterable/i, function () {
      return { title: 'No se puede recorrer', text: 'Intentaste recorrer con un ciclo algo que no es una colección (arreglo, NodeList…). Revisa qué contiene esa variable.' };
    }],
    [/missing \) after argument list|Expected '\)'/i, function () {
      return { title: 'Falta cerrar un paréntesis', text: 'Parece que falta un ' + c(')') + ' al final de una llamada, o falta una coma o un ' + c('+') + ' entre los valores que pasaste.' };
    }],
    [/Unexpected end of input|missing } |expected '}'|Unexpected EOF|end of script/i, function () {
      return { title: 'El código termina antes de tiempo', text: 'Falta cerrar algo: probablemente una llave ' + c('}') + ' o un paréntesis ' + c(')') + '.' };
    }],
    [/Invalid or unexpected token|unterminated string|Unterminated string|illegal character|Unexpected character/i, function () {
      return { title: 'Texto sin cerrar o símbolo extraño', text: 'Hay un texto al que le falta su comilla de cierre, o un símbolo que JavaScript no reconoce. Las comillas deben ser rectas (" o \') y abrir y cerrar con el mismo tipo.' };
    }],
    [/Unexpected identifier|unexpected token: identifier/i, function (m, code) {
      var t = 'Hay una palabra en un lugar inesperado.';
      if (/\b(Let|Const|Var|If|Else|For|While|Function|Return)\b/.test(code)) t += ' Las palabras clave van en minúscula: ' + c('let') + ', ' + c('if') + ', ' + c('for') + '…';
      else t += ' Revisa si falta un operador (+, =), una coma, un punto, o las comillas de un texto antes de esa palabra.';
      return { title: 'Palabra inesperada', text: t };
    }],
    [/Unexpected string|unexpected token: string literal/i, function () {
      return { title: 'Texto en lugar inesperado', text: 'Hay un texto entre comillas donde JavaScript no lo esperaba. ¿Falta una coma o un ' + c('+') + ' para unirlo con otro valor?' };
    }],
    [/Unexpected number|unexpected token: numeric literal|identifier starts immediately after numeric literal/i, function () {
      return { title: 'Número inesperado', text: 'Hay un número en un lugar inesperado. ¿Falta un operador o una coma? Recuerda también que un nombre de variable no puede empezar con un número.' };
    }],
    [/Unexpected token '?else'?|unexpected token: keyword 'else'/i, function () {
      return { title: 'else fuera de lugar', text: c('else') + ' debe ir justo después de la llave ' + c('}') + ' que cierra el bloque del ' + c('if') + '. Revisa que no haya un ' + c(';') + ' después de la condición del if.' };
    }],
    [/Unexpected token '?\)'?|expected expression, got '\)'/i, function () {
      return { title: 'Paréntesis inesperado', text: 'Hay un ' + c(')') + ' en un lugar extraño. Puede que sobre uno, o que falte algo justo antes (por ejemplo, un valor después de un operador).' };
    }],
    [/Unexpected token '?\}'?|expected expression, got '\}'/i, function () {
      return { title: 'Llave inesperada', text: 'Hay una ' + c('}') + ' que sobra o que aparece antes de terminar una instrucción.' };
    }],
    [/Unexpected token '?=+'?|expected expression, got '='/i, function () {
      return { title: 'Signo = inesperado', text: 'Revisa el ' + c('=') + '. Para asignar se usa ' + c('=') + ', para comparar ' + c('===') + ', y para mayor/menor o igual ' + c('>=') + ' / ' + c('<=') + ' (el = va al final).' };
    }],
    [/Unexpected token|expected expression|SyntaxError/i, function () {
      return { title: 'JavaScript no entiende esta parte', text: 'Hay algo escrito de una forma que JavaScript no reconoce. Revisa con calma la línea indicada: comillas, paréntesis, comas y puntos.' };
    }],
    [/__CQ_LOOP__/, function () {
      return { title: 'Ciclo infinito detectado', text: 'Un ciclo se repitió más de 100 000 veces, así que el guardián lo detuvo. Revisa que la condición llegue a ser <b>falsa</b>: ¿estás actualizando el contador (por ejemplo ' + c('i++') + ') dentro del ciclo?' };
    }],
    [/__CQ_TIMEOUT__/, function () {
      return { title: 'El programa tardó demasiado', text: 'La ejecución no terminó a tiempo y se detuvo para proteger el juego. Revisa ciclos que no terminan o funciones que se llaman sin fin.' };
    }],
    [/__CQ_STOPPED__/, function () {
      return { title: 'Ejecución detenida', text: 'Detuviste la ejecución. Puedes corregir tu código y ejecutarlo otra vez.' };
    }]
  ];

  /**
   * Explica un error. err: {name, message, line}
   * Devuelve {title, html, tech, line}
   */
  function explain(err, code) {
    code = code || '';
    var msg = String(err.message || ''), name = err.name || 'Error';
    var out = { title: 'Algo no funcionó', text: 'Ocurrió un error al ejecutar tu código.', line: err.line || 0 };
    var isSyntax = name === 'SyntaxError' || err.phase === 'syntax';

    if (isSyntax) {
      if (/[“”‘’«»]/.test(code)) {
        var ln = 0;
        code.split('\n').some(function (l, i) { if (/[“”‘’«»]/.test(l)) { ln = i + 1; return true; } return false; });
        out = { title: 'Comillas tipográficas', text: 'En la línea ' + ln + ' hay comillas “curvas”. JavaScript solo entiende comillas rectas: ' + c('"texto"') + ' o ' + c("'texto'") + '. Escríbelas de nuevo con el teclado.', line: ln };
      } else {
        var b = CQ.Code.brackets(code);
        var us = CQ.Code.unclosedString(code);
        if (us) out = { title: 'Texto sin cerrar', text: 'En la línea ' + us.line + ' empieza un texto con ' + c(us.quote) + ' que no se cierra. Un texto debe empezar y terminar con el mismo tipo de comilla.', line: us.line };
        else if (b) out = bracketText(b);
        else out = null;
      }
    }
    if (!out || !isSyntax) {
      for (var i = 0; i < PATTERNS.length; i++) {
        var m = PATTERNS[i][0].exec(msg);
        if (m) {
          var r = PATTERNS[i][1](m, code);
          out = { title: r.title, text: r.text + (r.extra || ''), line: err.line || 0 };
          break;
        }
      }
      if (!out) out = { title: 'Algo no funcionó', text: 'Revisa la línea indicada con calma.', line: err.line || 0 };
    }
    if (!out.line && err.line) out.line = err.line;
    var tech;
    if (/__CQ_(LOOP|TIMEOUT|STOPPED)__/.test(msg)) tech = /LOOP/.test(msg) ? 'RangeError: ciclo detenido por el guardián (más de 100 000 repeticiones o más de 2,5 s).' : 'Ejecución detenida por el temporizador del entorno aislado.';
    else tech = name + ': ' + msg;
    return { title: out.title, html: out.text, tech: tech + (out.line ? ' · línea ' + out.line : ''), line: out.line };
  }

  /** Consejos estáticos: errores típicos que JavaScript NO siempre reporta. */
  function lint(code) {
    var tips = [], src = CQ.Code.stripComments(code), seen = {};
    function add(line, html) { var k = line + html; if (!seen[k]) { seen[k] = 1; tips.push({ line: line, html: html }); } }

    CQ.Code.conditions(src).forEach(function (cnd) {
      if (cnd.kw !== 'for' && /(^|[^=!<>])=($|[^=>])/.test(CQ.Code.blankStrings(cnd.text))) {
        add(cnd.line, 'En la condición del ' + c(cnd.kw) + ' (línea ' + cnd.line + ') usaste ' + c('=') + ', que <b>asigna</b>. Para <b>comparar</b> usa ' + c('===') + '.');
      }
      if (cnd.semicolonAfter) {
        add(cnd.line, 'Hay un ' + c(';') + ' justo después del paréntesis del ' + c(cnd.kw) + ' (línea ' + cnd.line + '). Eso termina la instrucción ahí mismo y el bloque { } ya no depende de ella.');
      }
    });
    var lines = src.split('\n');
    lines.forEach(function (l, i) {
      var m = /\b(Let|Const|Var|If|Else|For|While|Function|Return|Console|Document)\b/.exec(CQ.Code.blankStrings(l));
      if (m) add(i + 1, 'Línea ' + (i + 1) + ': ' + c(m[1]) + ' debe escribirse en minúsculas: ' + c(m[1].toLowerCase()) + '. JavaScript distingue mayúsculas y minúsculas.');
      var re = /\.([A-Za-z_$][\w$]*)/g, mm;
      var bl = CQ.Code.blankStrings(l);
      while ((mm = re.exec(bl))) {
        var w = mm[1];
        CASE_SENSITIVE.forEach(function (k) {
          if (k !== w && k.toLowerCase() === w.toLowerCase()) add(i + 1, 'Línea ' + (i + 1) + ': escribiste ' + c(w) + ', pero se escribe ' + c(k) + ' (cuidado con las mayúsculas).');
        });
        if (w === 'lenght') add(i + 1, 'Línea ' + (i + 1) + ': se escribe ' + c('length') + ' (la h va al final).');
        if (w === 'getElementByID') add(i + 1, 'Línea ' + (i + 1) + ': se escribe ' + c('getElementById') + ' (con "d" minúscula).');
      }
      if (/getElementById\(\s*["']#/.test(l)) add(i + 1, 'Línea ' + (i + 1) + ': con ' + c('getElementById') + ' el id se escribe <b>sin</b> el símbolo #. El # solo se usa con ' + c('querySelector') + '.');
      if (/addEventListener\(\s*["']on\w+/.test(l)) add(i + 1, 'Línea ' + (i + 1) + ': en ' + c('addEventListener') + ' el nombre del evento va sin "on": ' + c('"click"') + ', no ' + c('"onclick"') + '.');
      if (/addEventListener\([^,]+,\s*[\w$]+\(\s*\)\s*\)/.test(l)) add(i + 1, 'Línea ' + (i + 1) + ': en ' + c('addEventListener') + ' se pasa el <b>nombre</b> de la función, sin paréntesis. Con ( ) la función se ejecuta de inmediato en lugar de esperar al evento.');
    });
    if (/[“”‘’]/.test(code)) add(0, 'Hay comillas tipográficas “ ”. Usa comillas rectas " o \'.');
    return tips;
  }

  CQ.Errors = { explain: explain, lint: lint };
})(window.CQ = window.CQ || {});
