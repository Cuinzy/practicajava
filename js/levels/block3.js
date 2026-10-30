/* =====================================================================
   BLOQUE 3 · Fábrica Cíclica — Bucles y repeticiones
   Mundos: avenida de luces, pista del robot y fábrica
   ===================================================================== */
CQ.Levels.register({
  n: 3,
  name: 'Fábrica Cíclica',
  topic: 'Repetición con for y while, contadores, acumuladores y condiciones de finalización',
  icon: '🔁',
  color: '#a3e635',
  intro: 'En la Fábrica Cíclica todo se hace a mano, una pieza a la vez. Aprende a usar <b>ciclos</b> para que las máquinas repitan tareas automáticamente.',
  concepts: ['Repetición', 'for', 'while', 'Contadores', 'Acumuladores', 'Condición de fin', 'Ciclos infinitos', 'Errores de borde'],
  levels: [
    /* ------------------------------ 3.1 ------------------------------ */
    {
      title: 'Luces automáticas',
      story: 'La avenida tiene 8 farolas apagadas, numeradas del 0 al 7. Encenderlas una por una sería eterno.',
      scene: { world: 'lights', n: 8 },
      learn: {
        what: '<p>Un <b>ciclo</b> (o bucle) repite un bloque de instrucciones varias veces. El ciclo <code>for</code> se usa cuando sabes <b>cuántas</b> repeticiones necesitas.</p>',
        why: '<p>Evita escribir lo mismo muchas veces y permite trabajar con cantidades grandes o variables: 8 luces, 1000 datos…</p>',
        when: '<p>Cuando una tarea se repite: encender varias luces, recorrer una lista, contar del 1 al 100.</p>',
        how: 'for (let i = 0; i < 5; i++) {\n  encenderLuz(i);\n}',
        howNote: '<p>El <code>for</code> tiene tres partes separadas por <code>;</code>:</p><ol><li><b>Inicio</b> <code>let i = 0</code>: crea el contador.</li><li><b>Condición</b> <code>i &lt; 5</code>: mientras sea true, se repite.</li><li><b>Actualización</b> <code>i++</code>: se ejecuta al final de cada vuelta.</li></ol>',
        symbols: [['i', 'Nombre habitual del contador (de «índice»). Puedes usar otro.'], ['i++', 'Suma 1 al contador al terminar cada vuelta.'], [';', 'Dentro del for separa las tres partes.']],
        mistakes: ['Usar comas en lugar de punto y coma: <code>for (let i = 0, i &lt; 5, i++)</code> ❌.', 'Una condición que nunca deja de cumplirse: ciclo infinito.', 'Empezar en 1 cuando los elementos empiezan en 0 (o al revés).'],
        analogy: 'Es como dar vueltas a una pista con un contador de vueltas: «empieza en 0; mientras lleves menos de 5 vueltas, corre una más y suma 1 al contador».'
      },
      observe: {
        code: 'for (let i = 0; i < 5; i++) {\n  encenderLuz(i);\n}\nconsole.log("Ciclo terminado");',
        steps: [
          { lines: [1, 1], run: false, text: 'El contador <code>i</code> empieza en 0. Se revisa la condición: ¿0 &lt; 5? Sí.' },
          { lines: [2, 2], run: false, text: 'Se ejecuta el cuerpo con i = 0: se enciende la luz 0. Luego <code>i++</code> → i = 1, y se repite: luz 1, 2, 3, 4.' },
          { lines: [3, 4], upTo: 4, text: 'Cuando i llega a 5, la condición es false y el ciclo termina. El programa continúa con la línea siguiente. ¡Mira las luces!' }
        ],
        result: '<p>Con 3 líneas se encendieron 5 luces. El cuerpo se ejecutó 5 veces, cada vez con un valor distinto de <code>i</code>: 0, 1, 2, 3 y 4.</p>'
      },
      experiment: {
        code: 'for (let i = 0; i < 5; i++) {\n  encenderLuz(i);\n}\n',
        ideas: ['Cambia el 5 por 8.', 'Empieza en <code>i = 3</code>.', 'Cambia <code>i++</code> por <code>i += 2</code>.', 'Usa <code>i &lt;= 8</code> y lee la advertencia: ¿por qué la luz 8 no existe?']
      },
      solve: {
        activity: 'D',
        title: 'Ilumina la avenida',
        story: 'Es de noche y la avenida está a oscuras.',
        goal: '<p>Enciende las <b>8 luces</b> (de la 0 a la 7) usando un ciclo <code>for</code>. No escribas <code>encenderLuz</code> ocho veces: deja que el ciclo repita por ti.</p>',
        starter: '',
        requires: [[/\bfor\s*\(/, 'Usa un ciclo `for`']],
        tests: [
          { label: 'Las 8 luces están encendidas', check: function (t) { var n = t.world.lights.filter(Boolean).length; return n === 8 || 'Hay ' + n + ' luces encendidas de 8.'; } },
          { label: '`encenderLuz` aparece como mucho 2 veces en el código', check: function (t) { return t.count(/encenderLuz\s*\(/) <= 2 || 'Escribiste encenderLuz muchas veces. Un ciclo debería hacer la repetición.'; } }
        ],
        hints: ['Necesitas un for con un contador que tome los valores de cada luz.', 'Las luces van de 0 a 7: ¿dónde empieza el contador y cuál es la condición para que llegue hasta 7?', 'Dentro del ciclo, usa el contador como número de luz: <code>encenderLuz(i)</code>.'],
        celebrate: '✔ AVENIDA ILUMINADA',
        success: '¡La avenida brilla! Un ciclo hizo el trabajo de 8 instrucciones.'
      },
      prove: {
        activity: 'G',
        title: 'Ahorro de energía',
        story: 'Para ahorrar, solo deben encenderse las farolas con número par.',
        goal: '<p>Enciende únicamente las luces <b>0, 2, 4 y 6</b>, y deja apagadas las impares. Usa un ciclo.</p>',
        starter: '',
        requires: [[/\b(for|while)\s*\(/, 'Usa un ciclo']],
        tests: [
          { label: 'Las luces pares están encendidas', check: function (t) { return [0, 2, 4, 6].every(function (i) { return t.world.lights[i]; }) || 'Falta encender alguna luz par.'; } },
          { label: 'Las luces impares están apagadas', check: function (t) { return [1, 3, 5, 7].every(function (i) { return !t.world.lights[i]; }) || 'Hay alguna luz impar encendida.'; } },
          { label: '`encenderLuz` aparece como mucho 2 veces', check: function (t) { return t.count(/encenderLuz\s*\(/) <= 2 || 'Deja que el ciclo haga la repetición.'; } }
        ],
        hints: ['Piensa en cómo cambiar la actualización del contador.', 'El contador puede avanzar de 2 en 2.', 'Otra forma: recorrer todas y usar un if con <code>%</code> para saber si es par.'],
        success: 'Ahorro activado. Controlas cómo avanza un ciclo.'
      }
    },

    /* ------------------------------ 3.2 ------------------------------ */
    {
      title: 'Pixel recorre la pista',
      story: 'Pixel debe llegar a la estación de carga 🏁. No siempre empieza en el mismo lugar, así que no sabes cuántos pasos dará.',
      scene: { world: 'robot', n: 10, goal: 7 },
      learn: {
        what: '<p>El ciclo <code>while</code> («mientras») repite un bloque <b>mientras</b> una condición sea verdadera. Se usa cuando no sabes de antemano cuántas repeticiones habrá.</p>',
        why: '<p>Muchas tareas terminan por una situación, no por un número fijo: «avanza mientras no llegues», «pide datos mientras sean inválidos».</p>',
        when: '<p>Cuando la repetición depende de una condición que cambia durante el ciclo.</p>',
        how: 'while (robot.posicion < 5) {\n  robot.avanzar();\n}',
        mistakes: ['Que nada dentro del ciclo haga cambiar la condición: <b>ciclo infinito</b>.', 'Confundir <code>while</code> con <code>if</code>: el if decide una vez; el while repite.'],
        analogy: '«Mientras el vaso no esté lleno, sigue sirviendo agua». No sabes cuántos chorros serán; paras cuando la condición deja de cumplirse.'
      },
      observe: {
        code: 'while (robot.posicion < 5) {\n  robot.avanzar();\n}\nrobot.decir("¡Casilla 5!");',
        steps: [
          { lines: [1, 1], run: false, text: '¿La posición (0) es menor que 5? Sí → entra al ciclo.' },
          { lines: [2, 2], run: false, text: 'Avanza una casilla. Vuelve arriba y revisa de nuevo: 1 &lt; 5, 2 &lt; 5…' },
          { lines: [3, 4], upTo: 4, text: 'Cuando la posición es 5, la condición es false: sale del ciclo y Pixel habla.' }
        ],
        result: '<p>El ciclo se repitió 5 veces. Si Pixel hubiera empezado en la casilla 3, se habría repetido solo 2: el <code>while</code> se adapta.</p>'
      },
      experiment: {
        code: 'while (robot.posicion < 5) {\n  robot.avanzar();\n}\nrobot.decir("¡Llegué!");\n',
        ideas: ['Cambia el 5 por 9.', 'Usa <code>robot.retroceder()</code> en otro while para volver a la casilla 2.', '¿Qué pasa con <code>while (robot.posicion &lt; 20)</code>? Lee las advertencias.']
      },
      solve: {
        activity: 'D',
        title: 'Rumbo a la estación de carga',
        story: 'La batería de Pixel se agota. La estación está en la casilla 7.',
        goal: '<p>Usa un ciclo <code>while</code> para que Pixel avance hasta la casilla <b>7</b> y se detenga ahí. Probaremos tu programa con Pixel empezando en distintas casillas.</p>',
        starter: '',
        requires: [[/\bwhile\s*\(/, 'Usa un ciclo `while`']],
        tests: [
          { label: 'Desde la casilla 0 llega a la 7', check: function (t) { return t.world.pos === 7 || 'Pixel terminó en la casilla ' + t.world.pos + '.'; } },
          { label: 'Desde la casilla 4 llega a la 7', setup: '__CQ.cfg.start = 4;', check: function (t) { return t.world.pos === 7 || 'Empezando en 4, Pixel terminó en ' + t.world.pos + '. ¿Contaste pasos fijos en lugar de mirar la posición?'; } },
          { label: 'Si ya está en la 7, no se mueve', setup: '__CQ.cfg.start = 7;', check: function (t) { return (t.world.pos === 7 && t.world.moves === 0) || 'Si Pixel ya está en la estación, no debería moverse.'; } }
        ],
        hints: ['La condición del while debe preguntar por la posición de Pixel.', '<code>robot.posicion</code> te dice dónde está. ¿Mientras qué debe seguir avanzando?', 'Ejemplo distinto: <code>while (agua &lt; 100) { servir(); }</code>'],
        success: 'Pixel se está cargando. Tu ciclo se adapta a cualquier punto de partida.'
      },
      prove: {
        activity: 'H',
        title: 'Pixel no se detiene',
        story: 'Este programa debía mover a Pixel 5 casillas, pero Pixel se estrella contra el borde y el guardián de ciclos tiene que detenerlo. Ejecútalo y observa.',
        goal: '<p>Corrige el programa para que Pixel avance <b>exactamente 5</b> casillas usando el contador <code>pasos</code> y después diga «Llegué».</p>',
        starter: 'let pasos = 0;\nwhile (pasos < 5) {\n  robot.avanzar();\n}\nrobot.decir("Llegué");\n',
        requires: [[/\bwhile\s*\(/, 'Mantén el ciclo `while`']],
        tests: [
          { label: 'Pixel termina en la casilla 5', check: function (t) { return t.world.pos === 5 || 'Pixel terminó en la casilla ' + t.world.pos + '.'; } },
          { label: 'El contador `pasos` termina en 5', check: function (t) { return t.get('pasos') === 5 || 'pasos vale ' + t.show(t.get('pasos')) + '.'; } },
          { label: 'Pixel dice «Llegué»', check: function (t) { return t.world.said.some(function (s) { return /lleg/i.test(s); }) || 'Pixel no dijo «Llegué».'; } }
        ],
        hints: ['El guardián detuvo el ciclo porque la condición nunca se volvió false.', '¿Qué variable aparece en la condición? ¿Cambia en algún momento dentro del ciclo?', 'Dentro del ciclo hay que actualizar el contador (por ejemplo, sumándole 1).'],
        success: 'Ciclo infinito resuelto: siempre revisa que la condición pueda volverse false.'
      }
    },

    /* ------------------------------ 3.3 ------------------------------ */
    {
      title: 'Automatiza la fábrica',
      story: 'La fábrica recibe pedidos de distintas cantidades. Un ciclo puede producir cualquier número de piezas.',
      scene: { world: 'factory' },
      learn: {
        what: '<p>El contador del ciclo no solo cuenta: también puede <b>usarse</b> dentro del cuerpo (para numerar, calcular o elegir).</p>',
        why: '<p>Así cada repetición puede ser un poco distinta: «pieza 1», «pieza 2»…</p>',
        when: '<p>Cuando necesitas saber en qué vuelta estás.</p>',
        how: 'for (let i = 1; i <= 3; i++) {\n  fabricar("engranaje");\n  console.log("Engranaje número " + i);\n}',
        mistakes: ['Pensar que el cuerpo del ciclo solo puede tener una instrucción.', 'Modificar el contador dentro del cuerpo sin querer.'],
        analogy: 'Como una máquina que estampa un número de serie distinto en cada pieza que produce.'
      },
      observe: {
        code: 'for (let i = 1; i <= 3; i++) {\n  fabricar("engranaje");\n  console.log("Engranaje número " + i);\n}',
        steps: [
          { lines: [1, 1], run: false, text: 'Esta vez el contador empieza en 1 y la condición usa <code>&lt;=</code>: se repetirá con i = 1, 2 y 3.' },
          { lines: [2, 3], run: false, text: 'El cuerpo tiene dos instrucciones: fabricar y registrar el número de pieza usando <code>i</code>.' },
          { lines: [4, 4], upTo: 4, text: 'Tres vueltas, tres engranajes, tres mensajes distintos.' }
        ],
        result: '<p>Empezar en 0 con <code>&lt; 3</code> o en 1 con <code>&lt;= 3</code> produce la misma cantidad de vueltas; elige la que haga más clara tu intención.</p>'
      },
      experiment: {
        code: 'for (let i = 1; i <= 3; i++) {\n  fabricar("engranaje");\n  console.log("Engranaje número " + i);\n}\n',
        ideas: ['Fabrica 10 piezas.', 'Cambia el tipo a "chip" o "bateria".', 'Haz que cada vuelta fabrique dos piezas distintas.']
      },
      solve: {
        activity: 'A',
        title: 'Lote de chips',
        story: 'Se necesita un lote de exactamente 10 chips.',
        goal: '<p>Completa los <code>___</code> del ciclo para fabricar exactamente <b>10</b> chips.</p>',
        starter: 'for (let i = ___; i ___ 10; i___) {\n  fabricar("chip");\n}\n',
        tests: [
          { label: 'Se fabrican exactamente 10 piezas', check: function (t) { return t.world.items.length === 10 || 'Se fabricaron ' + t.world.items.length + ' piezas.'; } },
          { label: 'Todas son chips', check: function (t) { return t.world.items.every(function (x) { return x === 'chip'; }) || 'Hay piezas que no son chips.'; } }
        ],
        hints: ['Hay más de una respuesta correcta.', 'Si empiezas en 0, ¿qué comparación hace que el último valor sea 9? Si empiezas en 1, ¿y para que sea 10?', 'El último hueco es el operador que suma 1.'],
        success: '10 chips perfectos.'
      },
      prove: {
        activity: 'G',
        title: 'Pedidos variables',
        story: 'Cada cliente pide una cantidad distinta de tornillos.',
        setup: 'var pedido = 4;',
        scene: { world: 'factory', title: 'Fábrica · pedidos' },
        goal: '<p>La variable <code>pedido</code> ya existe y cambia con cada cliente. Fabrica exactamente <code>pedido</code> tornillos y, por cada uno, muestra en consola <b>Pieza 1</b>, <b>Pieza 2</b>, etc.</p>',
        starter: '',
        requires: [[/\b(for|while)\s*\(/, 'Usa un ciclo']],
        tests: [
          { label: 'Pedido de 4 → 4 tornillos', check: function (t) { return (t.world.items.length === 4 && t.world.items.every(function (x) { return x === 'tornillo'; })) || 'Se esperaban 4 tornillos y hubo ' + t.world.items.length + ' piezas.'; } },
          { label: 'Mensajes «Pieza 1» … «Pieza 4»', check: function (t) { var ok = [1, 2, 3, 4].every(function (k) { return t.logs.some(function (l) { return t.norm(l) === 'pieza ' + k; }); }); return ok || 'Faltan mensajes del tipo «Pieza 1».'; } },
          { label: 'Pedido de 7 → 7 tornillos', setup: 'pedido = 7;', check: function (t) { return t.world.items.length === 7 || 'Con pedido 7 se fabricaron ' + t.world.items.length + '.'; } },
          { label: 'Pedido de 0 → nada', setup: 'pedido = 0;', check: function (t) { return t.world.items.length === 0 || 'Con pedido 0 no debería fabricarse nada.'; } }
        ],
        hints: ['La condición del ciclo debe usar la variable <code>pedido</code>.', 'El número de la pieza sale del contador.', 'Si el contador empieza en 1, ¿qué comparación incluye a <code>pedido</code>?'],
        success: 'La fábrica atiende cualquier pedido.'
      }
    },

    /* ------------------------------ 3.4 ------------------------------ */
    {
      title: 'Contabilizar recursos',
      story: 'El almacén de la fábrica tiene cajas de distintos pesos. El camión necesita saber el peso total.',
      scene: { world: 'factory', pesos: [12, 30, 7] },
      learn: {
        what: '<p>Un <b>acumulador</b> es una variable que va <b>sumando</b> valores en cada vuelta. Un <b>contador</b> suma 1 cada vez que ocurre algo.</p>',
        why: '<p>Así se calculan totales, promedios y cantidades: el corazón de muchos programas.</p>',
        when: '<p>Cuando necesitas un resultado que depende de muchos datos.</p>',
        how: 'let total = 0;           // el acumulador empieza en 0\nfor (let i = 0; i < cajas; i++) {\n  total = total + pesoCaja(i);\n}\nlet pesadas = 0;         // contador\n// dentro de un ciclo: if (algo) { pesadas++; }',
        mistakes: ['Declarar el acumulador <b>dentro</b> del ciclo: se reinicia en cada vuelta.', 'Olvidar inicializarlo en 0.', 'Escribir <code>total = pesoCaja(i)</code>: reemplaza en lugar de sumar.'],
        analogy: 'Un acumulador es como una alcancía: empieza vacía y en cada vuelta le echas una moneda.'
      },
      observe: {
        code: 'let total = 0;\nfor (let i = 0; i < cajas; i++) {\n  total = total + pesoCaja(i);\n}\nmostrarTotal(total);',
        steps: [
          { lines: [1, 1], text: 'El acumulador empieza en 0. <code>cajas</code> (3) es la cantidad de cajas del almacén.' },
          { lines: [2, 3], run: false, text: '<table class="sym"><tr><td>vuelta</td><td>i</td><td>pesoCaja(i)</td><td>total</td></tr><tr><td>1</td><td>0</td><td>12</td><td>0 + 12 = 12</td></tr><tr><td>2</td><td>1</td><td>30</td><td>12 + 30 = 42</td></tr><tr><td>3</td><td>2</td><td>7</td><td>42 + 7 = 49</td></tr></table>' },
          { lines: [4, 5], upTo: 5, text: 'Al terminar, <code>total</code> vale 49 y se muestra. Observa cómo se iluminan las cajas una por una.' }
        ],
        result: '<p>El acumulador "recordó" la suma parcial entre vuelta y vuelta. Esa es la clave: declararlo <b>fuera</b> del ciclo.</p>'
      },
      experiment: {
        code: 'let total = 0;\nfor (let i = 0; i < cajas; i++) {\n  total = total + pesoCaja(i);\n  console.log("Vuelta", i, "→ total:", total);\n}\nmostrarTotal(total);\n',
        ideas: ['Mueve <code>let total = 0;</code> dentro del ciclo: ¿qué ocurre?', 'Cambia <code>total + pesoCaja(i)</code> por <code>pesoCaja(i)</code>.', 'Calcula el promedio dividiendo el total entre <code>cajas</code>.']
      },
      solve: {
        activity: 'G',
        title: 'Peso para el camión',
        story: 'Cada día llegan cajas distintas al almacén.',
        scene: { world: 'factory', pesos: [8, 15, 4, 22] },
        goal: '<p>Calcula el peso total de todas las cajas en una variable <code>total</code> y muéstralo con <code>mostrarTotal(total)</code>. Usa <code>cajas</code> y <code>pesoCaja(i)</code>: tu programa debe funcionar con cualquier cantidad de cajas.</p>',
        starter: '',
        requires: [[/\b(for|while)\s*\(/, 'Usa un ciclo']],
        tests: [
          { label: 'Con 4 cajas (8, 15, 4, 22) → 49', check: function (t) { if (t.get('total') !== 49) return 'total vale ' + t.show(t.get('total')) + ' y debería ser 49.'; return t.world.total === 49 || 'Falta mostrarTotal(total).'; } },
          { label: 'Con 3 cajas de 5 → 15', setup: '__CQ.cfg.pesos = [5, 5, 5];', check: function (t) { return t.get('total') === 15 || 'Con otras cajas se esperaba 15 y se obtuvo ' + t.show(t.get('total')) + '.'; } },
          { label: 'Con una sola caja de 40 → 40', setup: '__CQ.cfg.pesos = [40];', check: function (t) { return t.get('total') === 40 || 'Con una caja de 40 se obtuvo ' + t.show(t.get('total')) + '.'; } }
        ],
        hints: ['Necesitas un acumulador declarado antes del ciclo.', 'El ciclo recorre las cajas de 0 a <code>cajas - 1</code>.', 'En cada vuelta: total = total + el peso de la caja i.'],
        success: 'El camión ya sabe cuánto carga.'
      },
      prove: {
        activity: 'G',
        title: 'Cajas pesadas',
        story: 'Las cajas de más de 20 kg necesitan un montacargas especial.',
        scene: { world: 'factory', pesos: [8, 25, 4, 30, 21] },
        goal: '<p>Cuenta cuántas cajas pesan <b>más de 20 kg</b>. Guarda el resultado en la variable <code>pesadas</code> y muéstralo con <code>mostrarTotal(pesadas)</code>.</p>',
        starter: '',
        requires: [[/\b(for|while)\s*\(/, 'Usa un ciclo'], [/\bif\s*\(/, 'Usa un `if` dentro del ciclo']],
        tests: [
          { label: '(8, 25, 4, 30, 21) → 3 pesadas', check: function (t) { if (t.get('pesadas') !== 3) return 'pesadas vale ' + t.show(t.get('pesadas')) + ' y debería ser 3.'; return t.world.total === 3 || 'Falta mostrarTotal(pesadas).'; } },
          { label: '(20, 20) → 0 (20 no es «más de 20»)', setup: '__CQ.cfg.pesos = [20, 20];', check: function (t) { return t.get('pesadas') === 0 || 'Se esperaba 0 y se obtuvo ' + t.show(t.get('pesadas')) + '.'; } },
          { label: '(50) → 1', setup: '__CQ.cfg.pesos = [50];', check: function (t) { return t.get('pesadas') === 1 || 'Se esperaba 1.'; } }
        ],
        hints: ['Esta vez no sumas pesos: cuentas cajas.', 'El contador solo aumenta cuando se cumple una condición.', 'Combina lo que sabes: un ciclo, un if y un <code>++</code>.'],
        success: 'Montacargas asignados. ¡Combinas ciclos y condicionales!'
      }
    },

    /* ------------------------------ 3.5 ------------------------------ */
    {
      title: 'Errores comunes en ciclos',
      story: 'Los ciclos son poderosos, pero un pequeño error puede hacer que no paren nunca o que se salten un elemento.',
      scene: { world: 'robot', n: 10, crystals: [2, 5, 7] },
      learn: {
        what: '<p>Los errores más comunes en ciclos son: <b>ciclos infinitos</b>, errores de <b>uno de más o de menos</b> (off-by-one) y usar un valor fijo donde iba el contador.</p>',
        why: '<p>Reconocerlos te ahorra mucho tiempo de depuración.</p>',
        when: '<p>Cada vez que un ciclo hace una vuelta de más, de menos, o nunca termina.</p>',
        how: '// ❌ infinito: i nunca cambia\nwhile (i < 5) { encenderLuz(i); }\n// ❌ se salta la luz 0\nfor (let i = 1; i < 8; i++) { }\n// ❌ la luz 8 no existe\nfor (let i = 0; i <= 8; i++) { }\n// ❌ el ; termina el for antes de tiempo\nfor (let i = 0; i < 8; i++); { }',
        mistakes: ['Olvidar actualizar el contador.', '<code>&lt;=</code> en lugar de <code>&lt;</code> (o al revés).', 'Escribir un número fijo (<code>encenderLuz(1)</code>) en lugar del contador (<code>encenderLuz(i)</code>).', 'Un <code>;</code> justo después del paréntesis del for.'],
        analogy: 'Contar postes de una cerca: si la cerca mide 10 metros con un poste por metro, ¿son 10 o 11 postes? Ese es el error «de uno».'
      },
      observe: {
        code: 'for (let i = 0; i < 9; i++) {\n  if (robot.hayCristal()) {\n    robot.recoger();\n  }\n  robot.avanzar();\n}\nrobot.decir("Recorrido completo");',
        steps: [
          { lines: [1, 1], run: false, text: '9 vueltas: Pixel avanzará de la casilla 0 a la 9.' },
          { lines: [2, 4], run: false, text: 'En cada casilla pregunta si hay un cristal; solo recoge si lo hay. ¡Un if dentro de un ciclo!' },
          { lines: [5, 7], upTo: 7, text: 'Luego avanza. Al final, habla.' }
        ],
        result: '<p>Pixel revisó cada casilla antes de avanzar. ¿Qué pasaría si hubiera un cristal en la casilla 9? Nunca lo revisaría: es un error de borde. Piénsalo para el reto final.</p>'
      },
      experiment: {
        code: 'for (let i = 0; i < 9; i++) {\n  if (robot.hayCristal()) {\n    robot.recoger();\n  }\n  robot.avanzar();\n}\nrobot.decir("Recorrido completo");\n',
        ideas: ['Cambia <code>i &lt; 9</code> por <code>i &lt; 20</code> y lee las advertencias.', 'Pon el <code>robot.avanzar()</code> antes del if: ¿recoge el cristal de la casilla 0?', 'Agrega un <code>;</code> después del paréntesis del for y observa.']
      },
      solve: {
        activity: 'H',
        title: 'La avenida a medias',
        story: 'Este programa debía encender todas las luces de la avenida, pero algo no cuadra. Ejecútalo y mira la avenida y las advertencias.',
        scene: { world: 'lights', n: 8 },
        goal: '<p>Corrige el ciclo para que se enciendan las <b>8</b> luces (0 a 7) con exactamente una orden por luz.</p>',
        starter: 'for (let i = 1; i <= 8; i++) {\n  encenderLuz(1);\n}\n',
        tests: [
          { label: 'Las 8 luces están encendidas', check: function (t) { var n = t.world.lights.filter(Boolean).length; return n === 8 || 'Hay ' + n + ' luces encendidas.'; } },
          { label: 'Exactamente 8 órdenes válidas (una por luz)', check: function (t) { return t.world.calls === 8 || 'La avenida recibió ' + t.world.calls + ' órdenes válidas; deberían ser 8.'; } },
          { label: 'Ninguna orden a una luz inexistente', check: function (t) { return t.warnings.length === 0 || 'Advertencia: ' + t.warnings[0]; } }
        ],
        hints: ['Hay tres detalles: dónde empieza, dónde termina y qué número se usa dentro.', 'La primera luz es la 0 y la última la 7.', 'Dentro del ciclo, el número de luz debe cambiar en cada vuelta.'],
        success: 'Avenida completa, sin órdenes perdidas.'
      },
      prove: {
        activity: 'G',
        title: 'Recolección completa',
        story: 'Los cristales aparecen en lugares distintos cada día, incluso en los extremos de la pista.',
        scene: { world: 'robot', n: 10, crystals: [2, 5, 7] },
        goal: '<p>Haz que Pixel recorra <b>toda</b> la pista (casillas 0 a 9) recogiendo <b>todos</b> los cristales, incluidos los de las casillas 0 y 9 si los hubiera. Al final, Pixel debe decir cuántos recogió (usa un contador).</p>',
        starter: '',
        requires: [[/\b(for|while)\s*\(/, 'Usa un ciclo']],
        tests: [
          { label: 'Cristales en 2, 5 y 7 → recoge 3', check: function (t) { if (t.world.crystals.length) return 'Quedaron cristales sin recoger en las casillas ' + t.world.crystals.join(', ') + '.'; return t.world.said.some(function (s) { return s.indexOf('3') >= 0; }) || 'Pixel debe decir cuántos recogió (3).'; } },
          { label: 'Cristales en los extremos (0 y 9) → recoge 2', setup: '__CQ.cfg.crystals = [0, 9];', check: function (t) { if (t.world.crystals.length) return 'Quedaron cristales en ' + t.world.crystals.join(', ') + '. ¿Revisas la primera y la última casilla?'; return t.world.said.some(function (s) { return s.indexOf('2') >= 0; }) || 'Pixel debe decir 2.'; } },
          { label: 'Cristales en 1, 2, 3 y 4 → recoge 4', setup: '__CQ.cfg.crystals = [1, 2, 3, 4];', check: function (t) { return (!t.world.crystals.length && t.world.said.some(function (s) { return s.indexOf('4') >= 0; })) || 'Debería recoger 4 y decirlo.'; } },
          { label: 'Pixel termina en la casilla 9', check: function (t) { return t.world.pos === 9 || 'Pixel terminó en la casilla ' + t.world.pos + '.'; } }
        ],
        hints: ['Parte del ejemplo de la fase Observa y piensa qué casilla queda sin revisar.', 'Puedes revisar la última casilla después del ciclo, o reorganizar el ciclo.', 'Para decir el número, usa un contador que aumente cada vez que recoges.'],
        success: '¡La Fábrica Cíclica funciona sola! Dominas los ciclos y sus trampas.'
      }
    }
  ],

  special: {
    title: 'Cuenta regresiva',
    scene: { world: 'terminal', title: 'LANZAMIENTO DEL DRON' },
    solve: {
      activity: 'G',
      title: 'Cuenta regresiva',
      story: 'El dron de reparto despega tras una cuenta regresiva.',
      goal: '<p>Usa un ciclo para mostrar los números del <b>10 al 1</b> (en ese orden) y después el mensaje <b>¡Despegue!</b></p>',
      starter: '',
      requires: [[/\b(for|while)\s*\(/, 'Usa un ciclo']],
      tests: [
        { label: 'Muestra 10, 9, …, 1 en orden', check: function (t) { var nums = t.logs.slice(0, 10).map(Number); return t.eq(nums, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) || 'Los primeros mensajes deberían ser 10, 9, … 1.'; } },
        { label: 'Termina con «¡Despegue!»', check: function (t) { return (t.logs.length === 11 && /despegue/i.test(t.logs[10])) || 'Después del 1 debe aparecer «¡Despegue!» (y nada más).'; } }
      ],
      hints: ['El contador puede ir hacia atrás.', 'Empieza en 10 y usa <code>i--</code>.', '¿Qué condición mantiene el ciclo mientras i sea al menos 1?'],
      success: '3… 2… 1… ¡Despegue!'
    }
  }
});
