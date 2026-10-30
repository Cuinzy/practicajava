/* =====================================================================
   BLOQUE 0 · Estación Arranque — Primer contacto con JavaScript
   Mundo principal: terminal de Pixel (console.log)
   ===================================================================== */
CQ.Levels.register({
  n: 0,
  name: 'Estación Arranque',
  topic: 'Primer contacto: qué es JavaScript, instrucciones, sintaxis y console.log()',
  icon: '🔌',
  color: '#22d3ee',
  intro: 'Pixel, el robot de mantenimiento, está apagado. Su terminal solo entiende <b>JavaScript</b>. Aprende a darle tus primeras instrucciones para despertarlo.',
  concepts: ['¿Qué es JavaScript?', 'HTML, CSS y JS', 'Instrucciones', 'Sintaxis', 'console.log()', 'Textos y números', 'Comentarios'],
  levels: [
    /* ------------------------------ 0.1 ------------------------------ */
    {
      title: 'Despierta a Pixel',
      story: 'La terminal de Pixel parpadea. Para reactivarlo necesitas enviarle tu <b>primera instrucción</b> en JavaScript.',
      scene: { world: 'terminal' },
      learn: {
        what: '<p><b>JavaScript</b> es un lenguaje de programación: una forma de darle <b>instrucciones</b> a la computadora. En la web, es el lenguaje que hace que las páginas <b>reaccionen</b>: botones que responden, mensajes que cambian, juegos, formularios que se validan…</p>',
        why: '<p>Sirve para dar <b>comportamiento</b> a una página. Una página web se construye con tres lenguajes que trabajan en equipo:</p>' +
          '<div class="lcard trio"><div class="trio-item" style="background:rgba(251,146,60,.12);border:1px solid #fb923c"><b>HTML</b>la estructura<br><small>¿qué hay? títulos, botones…</small></div>' +
          '<div class="trio-item" style="background:rgba(96,165,250,.12);border:1px solid #60a5fa"><b>CSS</b>el aspecto<br><small>colores, tamaños, posición</small></div>' +
          '<div class="trio-item" style="background:rgba(250,204,21,.12);border:1px solid #facc15"><b>JS</b>el comportamiento<br><small>¿qué pasa cuando…?</small></div></div>' +
          '<p>JavaScript se conecta con HTML mediante la etiqueta <code>&lt;script src="app.js"&gt;&lt;/script&gt;</code>. Aquí no la necesitas: el juego ejecuta tu código directamente.</p>',
        when: '<p>Siempre que quieras que algo <b>ocurra</b>: mostrar un mensaje, hacer un cálculo, tomar una decisión o cambiar algo en la pantalla.</p>',
        how: 'console.log("Hola, Pixel");',
        howNote: '<p>Una <b>instrucción</b> es una orden. <code>console.log()</code> es una instrucción que <b>muestra</b> en la consola lo que pongas dentro de los paréntesis. La consola es la pantalla donde el programa nos "habla".</p>',
        symbols: [
          ['console', 'La consola: la pantalla de mensajes del programa.'],
          ['.', 'El punto significa "de": <code>console.log</code> = la acción <i>log</i> de la consola.'],
          ['( )', 'Los paréntesis contienen lo que le das a la instrucción.'],
          ['" "', 'Las comillas marcan un <b>texto</b>. Todo lo que está entre ellas se muestra tal cual.'],
          [';', 'El punto y coma marca el final de la instrucción (como el punto final de una frase).']
        ],
        mistakes: [
          'Escribir <code>Console.log</code> con mayúscula: JavaScript distingue mayúsculas y minúsculas.',
          'Olvidar cerrar las comillas o los paréntesis.',
          'Escribir <code>consola.log</code>: las instrucciones del lenguaje están en inglés.'
        ],
        analogy: 'Programar es como dar una receta a un robot muy obediente pero muy literal: hará <b>exactamente</b> lo que escribas, letra por letra. Si escribes mal una palabra, no adivinará lo que querías.'
      },
      observe: {
        code: '// Esto es un comentario: el programa lo ignora\nconsole.log("Hola, Pixel");\nconsole.log("¿Me escuchas?");',
        steps: [
          { lines: [1, 1], text: 'Las líneas que empiezan con <code>//</code> son <b>comentarios</b>: notas para las personas. El programa no las ejecuta.' },
          { lines: [2, 2], text: '<code>console.log("Hola, Pixel")</code> envía el texto <i>Hola, Pixel</i> a la consola. Mira la pantalla de Pixel.' },
          { lines: [3, 3], text: 'Las instrucciones se ejecutan <b>en orden</b>, de arriba hacia abajo. Este segundo mensaje aparece después del primero.' }
        ],
        result: '<p>Pixel recibió dos mensajes, en el mismo orden en que fueron escritos. Las comillas no se muestran: solo indican dónde empieza y termina el texto.</p>'
      },
      experiment: {
        code: 'console.log("Hola, Pixel");\nconsole.log("Soy nuevo en Neópolis");\n',
        ideas: [
          'Cambia el texto entre comillas y vuelve a ejecutar.',
          'Agrega una tercera línea con otro mensaje.',
          'Borra una comilla a propósito y lee el mensaje de error que aparece.',
          'Escribe <code>Console.log</code> con C mayúscula: ¿qué ocurre?'
        ]
      },
      solve: {
        activity: 'D',
        title: 'Activa la consola',
        story: 'Pixel necesita una señal exacta para encender sus sistemas.',
        goal: '<p>Escribe una instrucción que muestre en la consola el mensaje <b>Sistema activado</b>.</p>',
        starter: '// Escribe tu instrucción debajo de esta línea\n',
        requires: [[/console\s*\.\s*log\s*\(/, 'Usa `console.log()`']],
        tests: [
          { label: 'La consola muestra «Sistema activado»', check: function (t) { return t.logHas('Sistema activado') || 'No veo el mensaje «Sistema activado» en la consola. Revisa que el texto esté entre comillas.'; } }
        ],
        hints: [
          'La instrucción que muestra mensajes es <code>console.log( )</code>.',
          'El texto debe ir <b>dentro</b> de los paréntesis y <b>entre comillas</b>.',
          'Ejemplo con otro texto: <code>console.log("Buenos días");</code>'
        ],
        success: 'Los ojos de Pixel se encendieron: ¡ya escribiste tu primera instrucción de JavaScript!'
      },
      prove: {
        activity: 'G',
        title: 'Preséntate a Pixel',
        story: 'Pixel ya está despierto y quiere saber quién lo reparó.',
        goal: '<p>Escribe un programa que muestre un saludo que contenga la palabra <b>Hola</b> y tu nombre (o el nombre que quieras), por ejemplo <i>Hola, soy Ana</i>.</p>',
        starter: '',
        requires: [[/console\s*\.\s*log\s*\(/, 'Usa `console.log()`']],
        tests: [
          { label: 'Se muestra un saludo con la palabra «Hola»', check: function (t) { return t.logs.some(function (l) { return /hola/i.test(l); }) || 'Ningún mensaje contiene la palabra «Hola».'; } },
          { label: 'El saludo incluye un nombre (más que solo «Hola»)', check: function (t) { return t.logs.some(function (l) { return /hola/i.test(l) && t.norm(l).replace('hola', '').trim().length >= 3; }) || 'Agrega un nombre después de «Hola».'; } }
        ],
        hints: [
          'Necesitas la misma instrucción que usaste en el reto anterior.',
          'Todo el saludo puede ir en un solo texto entre comillas.',
          'Piensa en cómo mostrarías «Buenas tardes, Luis» y adapta la idea.'
        ],
        success: 'Pixel guardó tu nombre en su memoria. ¡Ahora son un equipo!'
      }
    },

    /* ------------------------------ 0.2 ------------------------------ */
    {
      title: 'Mensajes para Pixel',
      story: 'Pixel puede recibir <b>textos</b> y <b>números</b>. Pero no los trata igual… descubre la diferencia.',
      scene: { world: 'terminal' },
      learn: {
        what: '<p>Los programas trabajan con <b>datos</b>. Los dos tipos más básicos son:</p><ul><li><b>Cadenas de texto</b> (strings): van entre comillas. <code>"Hola"</code>, <code>\'42\'</code>.</li><li><b>Números</b>: van sin comillas. <code>42</code>, <code>3.5</code>, <code>-7</code>.</li></ul>',
        why: '<p>Con los números se pueden hacer <b>cálculos</b>. Con los textos se pueden formar <b>mensajes</b>. JavaScript decide qué hacer según el tipo de dato.</p>',
        when: '<p>Usa números cuando necesites calcular (energía, puntos, precios) y textos cuando necesites mostrar palabras.</p>',
        how: 'console.log("Batería:", 75);\nconsole.log(10 + 5);\nconsole.log("10" + "5");',
        howNote: '<p>Dentro de <code>console.log()</code> puedes poner varios valores separados por <b>comas</b>: se muestran uno junto al otro.</p>',
        symbols: [
          [',', 'Separa varios valores dentro de los paréntesis.'],
          ['+', 'Con números <b>suma</b>. Con textos <b>une</b> (concatena).'],
          ['- * /', 'Resta, multiplicación y división (solo con números).'],
          ["' '", 'Las comillas simples también sirven para textos. Usa el mismo tipo para abrir y cerrar.']
        ],
        mistakes: [
          'Poner un número entre comillas cuando quieres calcular: <code>"10" + "5"</code> da <code>105</code>, no 15.',
          'Abrir con <code>"</code> y cerrar con <code>\'</code>.',
          'Olvidar la coma entre dos valores: <code>console.log("Edad" 20)</code> produce un error.'
        ],
        analogy: 'Un número es como una moneda: puedes sumarla con otras. Un texto es como una etiqueta: si "sumas" dos etiquetas, solo las pegas una al lado de la otra.'
      },
      observe: {
        code: 'console.log("Batería:", 75);\nconsole.log(10 + 5);\nconsole.log("10" + "5");\nconsole.log("Pixel" + " " + "listo");',
        steps: [
          { lines: [1, 1], text: 'Un texto y un número separados por coma: se muestran juntos, con un espacio entre ellos.' },
          { lines: [2, 2], text: '<code>10 + 5</code> son números: JavaScript <b>calcula</b> y muestra 15.' },
          { lines: [3, 3], text: '<code>"10" + "5"</code> son <b>textos</b> (tienen comillas): el + los <b>une</b> y el resultado es 105.' },
          { lines: [4, 4], text: 'Con + puedes armar frases uniendo textos. El <code>" "</code> del medio es un espacio.' }
        ],
        result: '<p>El mismo símbolo <code>+</code> hace cosas distintas según el tipo de dato: suma números y une textos.</p>'
      },
      experiment: {
        code: 'console.log(7 * 6);\nconsole.log("7" + "6");\nconsole.log("Energía:", 100 - 35);\n',
        ideas: [
          'Cambia el <code>*</code> por <code>-</code> o <code>/</code>.',
          '¿Qué muestra <code>console.log("7" * "6")</code>? (¡sorpresa!)',
          'Une tu nombre y tu ciudad en una sola frase con +.',
          'Quita las comillas de un texto y observa el error.'
        ]
      },
      solve: {
        activity: 'C',
        mode: 'predict',
        title: 'El misterio del +',
        story: 'Pixel recibió dos instrucciones casi iguales. ¿Mostrará lo mismo en ambas?',
        goal: '<p>Lee el código del editor y <b>predice</b> qué mostrará la consola antes de ejecutarlo.</p>',
        code: 'console.log(4 + 6);\nconsole.log("4" + "6");',
        options: ['10\n10', '10\n46', '46\n10', 'Error: no se pueden sumar textos'],
        answer: 1,
        explain: 'La primera línea suma <b>números</b> (10). La segunda une <b>textos</b>, porque los números están entre comillas: "4" + "6" → "46".',
        wrongHint: 'Fíjate en las comillas: ¿cuáles valores son números y cuáles son textos?',
        hints: ['Busca qué valores tienen comillas.', 'El + con textos no suma: los pega.', 'Piensa en "sol" + "ar": ¿qué palabra se forma?'],
        success: '¡Buen razonamiento! Entiendes que el tipo de dato cambia el resultado.'
      },
      prove: {
        activity: 'G',
        title: 'Reporte de energía',
        story: 'La central pide a Pixel un reporte con un texto y un cálculo.',
        goal: '<p>Escribe un programa que:</p><ol><li>Muestre el texto <b>Código de acceso</b>.</li><li>Muestre el resultado de calcular <code>1500 + 548</code> (que JavaScript haga la suma: debe aparecer <b>2048</b> como número).</li></ol>',
        starter: '',
        requires: [[/1500\s*\+\s*548|548\s*\+\s*1500/, 'Calcula la suma `1500 + 548` en el código']],
        forbids: [[/["'`]\s*2048\s*["'`]/, 'No escribas 2048 como texto entre comillas']],
        tests: [
          { label: 'Se muestra el texto «Código de acceso»', check: function (t) { return t.logHas('Código de acceso') || 'No encuentro el texto «Código de acceso» en la consola.'; } },
          { label: 'Se muestra el número 2048 calculado por JavaScript', check: function (t) { return t.values.some(function (v) { return v === 2048; }) || 'No aparece el número 2048. ¿Pusiste la suma sin comillas dentro de console.log?'; } }
        ],
        hints: [
          'Necesitas dos instrucciones <code>console.log()</code>, una por cada dato.',
          'Para que JavaScript calcule, la operación debe ir <b>sin comillas</b>.',
          'Ejemplo distinto: <code>console.log(30 + 12);</code> muestra 42.'
        ],
        success: 'La central confirmó el código 2048. ¡Diferencias textos de números como un/a profesional!'
      }
    },

    /* ------------------------------ 0.3 ------------------------------ */
    {
      title: 'Sintaxis rota',
      story: 'Un virus desordenó las instrucciones de Pixel. Cuando la <b>sintaxis</b> falla, el programa no puede ejecutarse.',
      scene: { world: 'terminal' },
      learn: {
        what: '<p>La <b>sintaxis</b> son las reglas de escritura de un lenguaje, como la ortografía y la puntuación del español. Si una instrucción no sigue esas reglas, JavaScript no la entiende y muestra un <b>error</b>.</p>',
        why: '<p>Conocer la sintaxis te permite escribir instrucciones válidas y, sobre todo, <b>leer los errores</b> para corregirlos rápido.</p>',
        when: '<p>Siempre. Cada vez que algo falla, lo primero es revisar la sintaxis de la línea que indica el error.</p>',
        how: 'console.log("Pixel listo");\n// console  .   log  (  "Pixel listo"  )  ;\n//   objeto punto acción paréntesis texto fin',
        howNote: '<p>Partes de una instrucción: <b>objeto</b> (console) · <b>punto</b> · <b>acción</b> (log) · <b>paréntesis</b> que abren y cierran · el <b>dato</b> · y el <b>punto y coma</b> final.</p>',
        mistakes: [
          'Comillas que no cierran: <code>"Hola)</code>.',
          'Paréntesis sin cerrar: <code>console.log("Hola";</code>.',
          'Faltan comas entre valores: <code>console.log("Nivel" 3)</code>.',
          'Mayúsculas incorrectas: <code>Console</code>, <code>console.Log</code>.'
        ],
        analogy: 'Un error de sintaxis es como una frase sin sentido: «perro el corre parque». Las palabras existen, pero el orden y los signos no permiten entenderla.'
      },
      observe: {
        intro: 'Observa cómo se lee cada error. El juego te muestra dos cosas: una <b>explicación para principiantes</b> y el <b>detalle técnico</b> real de JavaScript.',
        code: 'console.log("Diagnóstico iniciado");\nconsole.log("Error en sensor:", 3);\nconsole.log("Diagnóstico terminado");',
        steps: [
          { lines: [1, 1], text: 'Instrucción correcta: objeto, punto, acción, paréntesis, texto entre comillas y punto y coma.' },
          { lines: [2, 2], text: 'Dos valores separados por coma. Si quitaras la coma, JavaScript no sabría dónde termina uno y empieza el otro.' },
          { lines: [3, 3], text: 'Todo correcto: el programa llega al final. Prueba en la siguiente fase a romper algo a propósito.' }
        ],
        result: '<p>Cuando la sintaxis es correcta, el programa se ejecuta completo. Si una sola línea tiene un error de sintaxis, <b>no se ejecuta ninguna</b>: JavaScript revisa todo antes de empezar.</p>'
      },
      experiment: {
        intro: 'Aquí puedes <b>romper el código a propósito</b>. Es la mejor manera de aprender a leer los mensajes de error.',
        code: 'console.log("Prueba de errores");\nconsole.log("Sensor", 1);\n',
        ideas: [
          'Quita el paréntesis de cierre <code>)</code> de la primera línea.',
          'Borra la comilla final del texto.',
          'Quita la coma entre "Sensor" y 1.',
          'Escribe <code>console.Log</code> y lee la sugerencia del error.'
        ]
      },
      solve: {
        activity: 'B',
        title: 'Repara la terminal',
        story: 'El virus dejó tres instrucciones dañadas. Pixel no puede ejecutar nada hasta que las corrijas.',
        goal: '<p>Corrige los errores para que la consola muestre, en orden:</p><ol><li><b>Iniciando reparación</b></li><li><b>Nivel de daño: 80</b> (el texto y el número 80)</li><li><b>Reparación completa</b></li></ol>',
        starter: 'console.log("Iniciando reparación);\nconsole.log("Nivel de daño:" 80);\nConsole.log("Reparación completa");\n',
        tests: [
          { label: 'Se muestra «Iniciando reparación»', check: function (t) { return t.logHas('Iniciando reparación') || 'Falta el primer mensaje.'; } },
          { label: 'Se muestra «Nivel de daño:» junto al número 80', check: function (t) { return t.logs.some(function (l) { return /da[ñn]o/i.test(l) && /80/.test(l); }) || 'Falta el mensaje con el nivel de daño y el 80.'; } },
          { label: 'Se muestra «Reparación completa»', check: function (t) { return t.logHas('Reparación completa') || 'Falta el último mensaje.'; } },
          { label: 'Los mensajes aparecen en el orden correcto', check: function (t) { var L = t.logs.map(t.norm); var a = L.findIndex(function (l) { return l.indexOf('iniciando') >= 0; }), c = L.findIndex(function (l) { return l.indexOf('completa') >= 0; }); return (a >= 0 && c > a) || 'El orden de los mensajes no es el esperado.'; } }
        ],
        hints: [
          'Hay un error en cada línea. Ejecuta y lee qué línea señala el error.',
          'Línea 1: revisa las comillas. Línea 2: ¿cómo se separan dos valores? Línea 3: mayúsculas.',
          'Ejemplo correcto parecido: <code>console.log("Vida:", 3);</code>'
        ],
        success: '¡Terminal reparada! Ya sabes leer y corregir errores de sintaxis.'
      },
      prove: {
        activity: 'H',
        title: 'Reporte de puertas',
        story: 'El reporte de puertas de la estación también está dañado. Ejecútalo, observa qué falla y corrígelo.',
        goal: '<p>Haz que el programa funcione y muestre tres mensajes: el estado de la <b>puerta norte</b> (abierta), el de la <b>puerta sur</b> (cerrada) y <b>Fin del reporte</b>.</p>',
        starter: "console.log('Puerta norte: abierta\");\nconsole.log(\"Puerta sur:\", \"cerrada\"\nconsol.log(\"Fin del reporte\");\n",
        tests: [
          { label: 'Se muestra el estado de la puerta norte', check: function (t) { return t.logs.some(function (l) { return /norte/i.test(l) && /abierta/i.test(l); }) || 'Falta el mensaje de la puerta norte.'; } },
          { label: 'Se muestra el estado de la puerta sur', check: function (t) { return t.logs.some(function (l) { return /sur/i.test(l) && /cerrada/i.test(l); }) || 'Falta el mensaje de la puerta sur.'; } },
          { label: 'Se muestra «Fin del reporte»', check: function (t) { return t.logHas('Fin del reporte') || 'Falta el mensaje final.'; } }
        ],
        hints: [
          'Los errores son de los mismos tipos que en el reto anterior, pero en otro lugar.',
          'Mira con atención qué comilla abre y cuál cierra en la línea 1. ¿Qué le falta a la línea 2 al final?',
          'Si un nombre parece "casi" correcto, compáralo letra por letra con <code>console</code>.'
        ],
        success: 'El reporte llega completo. ¡Tu ojo para los errores mejora rápido!'
      }
    },

    /* ------------------------------ 0.4 ------------------------------ */
    {
      title: 'Comentarios y fragmentos',
      story: 'Los ingenieros de Neópolis dejaron notas en el código de Pixel. Aprende a usarlas y a completar instrucciones.',
      scene: { world: 'terminal' },
      learn: {
        what: '<p>Un <b>comentario</b> es texto dentro del código que el programa <b>ignora</b>. Sirve para explicar qué hace el código o para "apagar" líneas sin borrarlas.</p>',
        why: '<p>El código lo leen personas. Los comentarios ayudan a entenderlo (incluso a ti en el futuro).</p>',
        when: '<p>Para explicar partes importantes, dejar recordatorios o desactivar temporalmente una instrucción mientras pruebas.</p>',
        how: '// Comentario de una línea\nconsole.log("Esto sí se ejecuta");\n\n/* Comentario de\n   varias líneas */\n// console.log("Esto NO se ejecuta");',
        symbols: [
          ['//', 'Todo lo que sigue en esa línea es comentario.'],
          ['/* */', 'Comentario que puede ocupar varias líneas.']
        ],
        mistakes: [
          'Escribir una sola barra <code>/</code>: eso es una división, no un comentario.',
          'Olvidar cerrar <code>/*</code> con <code>*/</code>: ¡todo el resto del código se vuelve comentario!'
        ],
        analogy: 'Los comentarios son como las notas al margen de un libro: ayudan a quien lee, pero no cambian la historia.'
      },
      observe: {
        code: '// Programa de saludo de Pixel\nconsole.log("Hola, equipo");\n// console.log("Este mensaje está apagado");\nconsole.log("Robots activos:", 3); // comentario al final de una línea',
        steps: [
          { lines: [1, 1], text: 'Un comentario que explica el propósito del programa.' },
          { lines: [2, 2], text: 'Instrucción normal: se ejecuta.' },
          { lines: [3, 3], text: 'Esta instrucción tiene <code>//</code> delante: está "apagada" y no muestra nada.' },
          { lines: [4, 4], text: 'También se puede comentar al final de una línea: la instrucción se ejecuta y el comentario se ignora.' }
        ],
        result: '<p>Solo se ejecutaron las líneas 2 y 4. Los comentarios no producen ningún efecto.</p>'
      },
      experiment: {
        code: '// Activa o desactiva mensajes agregando o quitando //\nconsole.log("Motor encendido");\n// console.log("Radar encendido");\nconsole.log("Luces encendidas");\n',
        ideas: [
          'Quita las <code>//</code> de la línea del radar.',
          'Agrega <code>//</code> delante de «Luces encendidas».',
          'Escribe un comentario de varias líneas con <code>/* */</code>.'
        ]
      },
      solve: {
        activity: 'A',
        title: 'Completa el diagnóstico',
        story: 'El diagnóstico de Pixel tiene huecos <code>___</code>. Complétalos.',
        goal: '<p>Reemplaza cada <code>___</code> para que el programa muestre el texto <b>Estación Arranque</b> y luego el <b>número</b> 3. La última línea debe convertirse en comentario.</p>',
        starter: '// Muestra el nombre de la estación\nconsole.___("Estación Arranque");\n// Muestra cuántos robots están activos (es un número)\nconsole.log(___);\n___ Esta línea debe ser un comentario\n',
        tests: [
          { label: 'Se muestra «Estación Arranque»', check: function (t) { return t.logHas('Estación Arranque') || 'No aparece «Estación Arranque».'; } },
          { label: 'Se muestra el número 3 (sin comillas)', check: function (t) { return t.values.some(function (v) { return v === 3; }) || 'No aparece el número 3. Recuerda: los números van sin comillas.'; } },
          { label: 'Se muestran exactamente 2 mensajes', check: function (t) { return t.logs.length === 2 || 'Se esperaban 2 mensajes y hubo ' + t.logs.length + '.'; } }
        ],
        hints: [
          'El primer hueco es el nombre de la acción que muestra mensajes.',
          'Un número se escribe sin comillas. ¿Qué símbolo convierte una línea en comentario?',
          'Ejemplo: <code>console.log(10);</code> y <code>// nota</code>.'
        ],
        success: 'Diagnóstico completo y bien documentado.'
      },
      prove: {
        activity: 'G',
        title: 'Silencio selectivo',
        story: 'Pixel muestra demasiados mensajes y distrae a la central.',
        goal: '<p><b>Sin borrar ninguna línea</b>, conviértelas en comentarios para que la consola solo muestre <b>Motor OK</b> y <b>Radar OK</b>.</p>',
        starter: 'console.log("Motor OK");\nconsole.log("Turbo en pruebas");\nconsole.log("Radar OK");\nconsole.log("Antena calibrándose");\nconsole.log("Bocina sin revisar");\n',
        tests: [
          { label: 'Se muestran «Motor OK» y «Radar OK»', check: function (t) { return (t.logHas('Motor OK') && t.logHas('Radar OK')) || 'Deben aparecer «Motor OK» y «Radar OK».'; } },
          { label: 'Solo se muestran esos 2 mensajes', check: function (t) { return t.logs.length === 2 || 'Hay ' + t.logs.length + ' mensajes; deberían ser solo 2.'; } },
          { label: 'No se borró ninguna línea (están comentadas)', check: function (t) { return ['Turbo', 'Antena', 'Bocina'].every(function (w) { return t.raw.indexOf(w) >= 0; }) || 'Parece que borraste alguna línea. Debes comentarlas, no eliminarlas.'; } }
        ],
        hints: [
          'Un comentario empieza con dos símbolos iguales.',
          'Pon esos dos símbolos al inicio de cada línea que quieras apagar.',
          'Si <code>// console.log("Hola")</code> no muestra nada, ¿qué líneas necesitan ese tratamiento?'
        ],
        success: 'La consola quedó limpia. Sabes usar comentarios para controlar qué se ejecuta.'
      }
    },

    /* ------------------------------ 0.5 ------------------------------ */
    {
      title: 'Programa de arranque',
      story: 'Para salir de la estación, Pixel debe ejecutar su secuencia de arranque completa. El <b>orden</b> importa.',
      scene: { world: 'terminal' },
      learn: {
        what: '<p>Un <b>programa</b> es una secuencia de instrucciones que se ejecutan <b>una tras otra</b>, de arriba hacia abajo. A esto se le llama <b>ejecución secuencial</b>.</p>',
        why: '<p>Muchas tareas solo tienen sentido en cierto orden: no puedes decir «memoria lista» antes de cargarla.</p>',
        when: '<p>En todo programa. Antes de escribir, piensa: ¿qué debe ocurrir primero, qué después?</p>',
        how: 'console.log("Paso 1: conectar batería");\nconsole.log("Paso 2: cargar memoria");\nconsole.log("Paso 3: ¡en línea!");',
        mistakes: ['Pensar que el programa ejecuta las líneas en cualquier orden.', 'Escribir todo en una misma línea sin separar instrucciones.'],
        analogy: 'Es como vestirse: primero los calcetines, luego los zapatos. Si cambias el orden, el resultado no tiene sentido.'
      },
      observe: {
        code: 'console.log("Conectando batería...");\nconsole.log("Batería conectada");\nconsole.log("Energía disponible:", 100);\nconsole.log("¡Pixel en línea!");',
        steps: [
          { lines: [1, 1], text: 'Primera instrucción: se ejecuta primero.' },
          { lines: [2, 2], text: 'La segunda espera a que termine la primera.' },
          { lines: [3, 3], text: 'Puedes mezclar textos y números en cada instrucción.' },
          { lines: [4, 4], text: 'La última instrucción cierra la secuencia.' }
        ],
        result: '<p>Los mensajes aparecieron en el mismo orden en que están escritos. Eso es la ejecución secuencial.</p>'
      },
      experiment: {
        code: 'console.log("Conectando batería...");\nconsole.log("Batería conectada");\nconsole.log("¡Pixel en línea!");\n',
        ideas: ['Cambia el orden de las líneas y observa el resultado.', 'Agrega un mensaje con un cálculo, por ejemplo <code>console.log("Total:", 50 * 2);</code>']
      },
      solve: {
        activity: 'E',
        mode: 'order',
        title: 'Secuencia de arranque',
        story: 'Las instrucciones de arranque se mezclaron. Ordénalas para que la secuencia tenga sentido.',
        goal: '<p>Ordena las piezas para que Pixel: conecte la batería, confirme la conexión, cargue la memoria, confirme la memoria y, al final, diga que está en línea.</p>',
        lines: [
          'console.log("Conectando batería...");',
          'console.log("Batería conectada");',
          'console.log("Cargando memoria...");',
          'console.log("Memoria lista");',
          'console.log("¡Pixel en línea!");'
        ],
        tests: [
          { label: 'La batería se conecta antes de confirmarse', check: function (t) { var L = t.logs; return L.indexOf('Conectando batería...') < L.indexOf('Batería conectada') || 'Primero hay que conectar la batería y después confirmarlo.'; } },
          { label: 'La memoria se carga antes de confirmarse', check: function (t) { var L = t.logs; return L.indexOf('Cargando memoria...') < L.indexOf('Memoria lista') || 'La memoria debe cargarse antes de estar lista.'; } },
          { label: 'La batería va antes que la memoria', check: function (t) { var L = t.logs; return L.indexOf('Batería conectada') < L.indexOf('Cargando memoria...') || 'Sin batería no se puede cargar la memoria.'; } },
          { label: '«¡Pixel en línea!» es el último mensaje', check: function (t) { return t.logs[t.logs.length - 1] === '¡Pixel en línea!' || 'Pixel solo puede estar en línea al final.'; } }
        ],
        hints: ['Piensa en qué necesita cada paso para poder ocurrir.', 'Los mensajes con «...» indican que algo está empezando; los otros, que terminó.', 'La energía siempre va primero.'],
        success: '¡Secuencia perfecta! Pixel arrancó sin problemas.'
      },
      prove: {
        activity: 'G',
        title: 'Tu propio programa de arranque',
        story: 'La central te pide diseñar el arranque de otro robot de la estación.',
        goal: '<p>Escribe un programa propio que tenga:</p><ul><li>un <b>comentario</b> que explique qué hace,</li><li>al menos <b>3</b> mensajes en la consola,</li><li>al menos un mensaje con un <b>texto</b> y otro que muestre un <b>número</b>,</li><li>una <b>operación matemática</b> (+, -, * o /) calculada por JavaScript.</li></ul>',
        starter: '',
        requires: [
          [/console\s*\.\s*log\s*\([^)]*\d\s*[-+*/]\s*\d/, 'Calcula una operación matemática dentro de `console.log()`']
        ],
        tests: [
          { label: 'El programa incluye un comentario', check: function (t) { return /\/\/|\/\*/.test(t.raw) || 'Agrega un comentario con // que explique tu programa.'; } },
          { label: 'Muestra al menos 3 mensajes', check: function (t) { return t.logs.length >= 3 || 'Solo hay ' + t.logs.length + ' mensaje(s).'; } },
          { label: 'Muestra al menos un texto', check: function (t) { return t.values.some(function (v) { return typeof v === 'string' && v.trim(); }) || 'Ningún mensaje contiene un texto.'; } },
          { label: 'Muestra al menos un número', check: function (t) { return t.values.some(function (v) { return typeof v === 'number'; }) || 'Ningún mensaje contiene un número (sin comillas).'; } }
        ],
        hints: [
          'Repasa los niveles anteriores: comentarios, textos, números y operaciones.',
          'Un mensaje puede combinar texto y número separados por coma.',
          'Ejemplo de una línea válida (no la copies, inventa la tuya): <code>console.log("Ruedas:", 2 * 2);</code>'
        ],
        success: '¡Escribiste tu primer programa completo! La Estación Arranque está reparada.'
      }
    }
  ],

  special: {
    title: 'Mensaje cifrado',
    scene: { world: 'terminal' },
    solve: {
      activity: 'G',
      title: 'Mensaje cifrado',
      story: 'Una señal llegó partida en dos textos: <code>"Neópolis"</code> y <code>" vive"</code>.',
      goal: '<p>Usa el operador <code>+</code> para <b>unir dos textos</b> y mostrar exactamente <b>Neópolis vive</b>.</p>',
      starter: '',
      requires: [[/["'`][^"'`]*["'`]\s*\+\s*["'`]/, 'Une dos textos con el operador `+`']],
      tests: [
        { label: 'Se muestra «Neópolis vive»', check: function (t) { return t.logs.some(function (l) { return l.trim() === 'Neópolis vive'; }) || 'El mensaje debe ser exactamente «Neópolis vive» (revisa el espacio).'; } }
      ],
      hints: ['Recuerda qué hace + con textos.', 'El espacio también es un carácter: debe estar dentro de alguna de las comillas.', '"Buen" + "as" → "Buenas".'],
      success: 'Señal descifrada: ¡Neópolis vive!'
    }
  }
});
