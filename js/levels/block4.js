/* =====================================================================
   BLOQUE 4 · Taller de Robots — Funciones
   Mundos: pista del robot, memoria y avenida de luces
   ===================================================================== */
CQ.Levels.register({
  n: 4,
  name: 'Taller de Robots',
  topic: 'Funciones: declaración, llamada, parámetros, argumentos, return, reutilización y alcance',
  icon: '🤖',
  color: '#60a5fa',
  intro: 'En el Taller de Robots, cada máquina repite las mismas secuencias una y otra vez. Enséñales <b>habilidades reutilizables</b>: funciones.',
  concepts: ['¿Qué es una función?', 'Declarar', 'Llamar (invocar)', 'Parámetros', 'Argumentos', 'return', 'Reutilizar', 'Alcance de variables'],
  levels: [
    /* ------------------------------ 4.1 ------------------------------ */
    {
      title: 'Habilidades reutilizables',
      story: 'Pixel aprende movimientos nuevos. En lugar de repetir las mismas instrucciones, puede guardarlas con un <b>nombre</b> y usarlas cuando quiera.',
      scene: { world: 'robot', n: 10 },
      learn: {
        what: '<p>Una <b>función</b> es un bloque de código con nombre que realiza una tarea. Primero se <b>declara</b> (se define qué hace) y después se <b>llama</b> (se ejecuta) tantas veces como quieras.</p>',
        why: '<p>Evita repetir código, lo organiza en partes con nombre y facilita corregirlo: si cambias la función, cambia en todos los lugares donde se usa.</p>',
        when: '<p>Cuando una secuencia de pasos se repite o representa una idea clara («saludar», «calcularTotal», «abrirPuerta»).</p>',
        how: '// Declarar: definir la habilidad\nfunction saludar() {\n  robot.decir("¡Hola!");\n}\n\n// Llamar: usar la habilidad\nsaludar();\nsaludar();',
        symbols: [['function', 'Palabra que declara una función.'], ['saludar', 'El nombre de la función (como el de una variable).'], ['( )', 'En la declaración van los parámetros; al llamar, los argumentos. Siempre se escriben, aunque estén vacíos.'], ['{ }', 'El cuerpo: las instrucciones que hace la función.']],
        mistakes: ['Declarar la función pero nunca llamarla: no pasa nada.', 'Llamarla sin paréntesis: <code>saludar;</code> no la ejecuta.', 'Escribir el nombre distinto al declararla y al llamarla.'],
        analogy: 'Una función es como una receta guardada en un libro: escribirla no cocina nada; cocinas cuando decides "hacer la receta" (llamarla), y puedes hacerla muchas veces.'
      },
      observe: {
        code: 'function saludar() {\n  robot.decir("¡Hola, Neópolis!");\n}\n\nsaludar();\nrobot.avanzar();\nrobot.avanzar();\nsaludar();',
        steps: [
          { lines: [1, 3], text: 'Se <b>declara</b> la función. Observa: al ejecutar solo estas líneas, Pixel no hace nada. Solo aprendió la habilidad.' },
          { lines: [5, 5], text: 'Se <b>llama</b> a la función: ahora sí se ejecuta su cuerpo y Pixel saluda.' },
          { lines: [6, 7], text: 'Pixel avanza dos casillas.' },
          { lines: [8, 8], text: 'Reutilizamos la habilidad: la misma función, llamada otra vez.' }
        ],
        result: '<p>Escribiste el saludo una sola vez y lo usaste dos. Declarar ≠ ejecutar.</p>'
      },
      experiment: {
        code: 'function saludar() {\n  robot.decir("¡Hola, Neópolis!");\n}\n\nsaludar();\n',
        ideas: ['Borra la llamada <code>saludar();</code>: ¿qué pasa?', 'Agrega <code>robot.avanzar();</code> dentro de la función y llámala 3 veces.', 'Crea otra función, <code>retrocederDos()</code>, y úsala.']
      },
      solve: {
        activity: 'D',
        title: 'Paso doble',
        story: 'Pixel quiere moverse más rápido: necesita una habilidad que avance dos casillas a la vez.',
        goal: '<p>Declara una función llamada <code>pasoDoble</code> que haga avanzar a Pixel <b>dos</b> casillas. Luego llámala <b>3 veces</b> para llegar a la casilla 6.</p>',
        starter: '',
        requires: [[/function\s+pasoDoble\s*\(/, 'Declara la función `pasoDoble`']],
        tests: [
          { label: 'Pixel llega a la casilla 6', check: function (t) { return t.world.pos === 6 || 'Pixel terminó en la casilla ' + t.world.pos + '.'; } },
          { label: '`pasoDoble()` avanza exactamente 2 casillas', check: function (t) { if (!t.isFn('pasoDoble')) return 'No existe la función pasoDoble.'; t.W.reset(1); t.call('pasoDoble'); return t.world.pos === 3 || 'Al llamar pasoDoble() desde la casilla 1, Pixel terminó en ' + t.world.pos + ' (esperado: 3).'; } }        ],
        hints: ['Primero declara la función con <code>function</code>; dentro, dos avances.', 'Después de la llave de cierre, escribe las llamadas.', 'Una llamada es el nombre seguido de paréntesis: <code>nombre();</code>'],
        celebrate: '✔ HABILIDAD APRENDIDA',
        success: 'Pixel aprendió el paso doble. ¡Tu primera función!'
      },
      prove: {
        activity: 'G',
        title: 'Pixel baila',
        story: 'Para celebrar, Pixel quiere una rutina de baile.',
        goal: '<p>Crea una función <code>bailar</code> que: avance una casilla, retroceda una casilla y diga <b>¡Bailando!</b>. Llámala <b>dos</b> veces.</p>',
        starter: '',
        tests: [
          { label: 'Existe la función `bailar`', check: function (t) { return t.isFn('bailar') || 'No existe la función bailar.'; } },
          { label: 'Pixel dice «¡Bailando!» dos veces', check: function (t) { var n = t.world.said.filter(function (s) { return /bailando/i.test(s); }).length; return n === 2 || 'Pixel dijo «¡Bailando!» ' + n + ' veces.'; } },
          { label: 'Una llamada a `bailar()` no cambia la posición final', check: function (t) { t.W.reset(4); t.call('bailar'); return (t.world.pos === 4 && t.world.moves === 2) || 'Después de bailar, Pixel debería volver a su casilla tras moverse 2 veces.'; } }
        ],
        hints: ['La función tiene tres instrucciones dentro.', 'Avanzar y luego retroceder deja a Pixel donde empezó.', 'No olvides las dos llamadas después de declararla.'],
        success: '¡Qué ritmo! Ya creas habilidades propias.'
      }
    },

    /* ------------------------------ 4.2 ------------------------------ */
    {
      title: 'Funciones que calculan',
      story: 'El taller necesita una calculadora de piezas. Las funciones pueden <b>recibir datos</b> y <b>devolver resultados</b>.',
      scene: { world: 'memory', title: 'Calculadora del taller', watch: 'auto' },
      learn: {
        what: '<p>Los <b>parámetros</b> son variables que la función recibe. Los <b>argumentos</b> son los valores concretos que le pasas al llamarla. <code>return</code> <b>devuelve</b> un resultado a quien la llamó.</p>',
        why: '<p>Una misma función sirve para muchos datos distintos: <code>doble(3)</code>, <code>doble(50)</code>…</p>',
        when: '<p>Cuando una tarea depende de datos de entrada o produce un valor que necesitas usar después.</p>',
        how: 'function doble(numero) {   // numero es el PARÁMETRO\n  return numero * 2;       // devuelve el resultado\n}\nlet r = doble(21);         // 21 es el ARGUMENTO → r vale 42',
        symbols: [['numero', 'Parámetro: un nombre para el dato que llegará.'], ['return', 'Termina la función y entrega el valor indicado.'], ['doble(21)', 'Llamada con argumento: <code>numero</code> valdrá 21 durante esa ejecución.']],
        mistakes: ['Usar <code>console.log</code> en lugar de <code>return</code>: muestra el valor, pero no lo entrega.', 'Escribir código después del <code>return</code>: nunca se ejecuta.', 'Pasar los argumentos en otro orden que los parámetros.'],
        analogy: 'Una función con return es como una máquina expendedora: le das algo (argumentos), procesa, y te <b>devuelve</b> un producto que puedes guardar (en una variable).'
      },
      observe: {
        code: 'function doble(numero) {\n  return numero * 2;\n}\nlet resultado = doble(21);\nlet otro = doble(5);\nconsole.log(resultado, otro);',
        steps: [
          { lines: [1, 3], text: 'Se declara <code>doble</code> con un parámetro, <code>numero</code>. Aún no se calcula nada.' },
          { lines: [4, 4], text: 'Se llama con 21: dentro, numero = 21, se devuelve 42 y se guarda en <code>resultado</code>.' },
          { lines: [5, 5], text: 'Misma función, otro argumento: devuelve 10.' },
          { lines: [6, 6], text: 'Se muestran los dos resultados.' }
        ],
        result: '<p>La función se escribió una vez y produjo resultados distintos según el argumento.</p>'
      },
      experiment: {
        code: 'function doble(numero) {\n  return numero * 2;\n}\nlet resultado = doble(21);\nconsole.log(resultado);\n',
        ideas: ['Cambia <code>return</code> por <code>console.log</code>: ¿qué vale ahora <code>resultado</code>?', 'Crea <code>triple(n)</code>.', 'Llama a <code>doble(doble(3))</code>.']
      },
      solve: {
        activity: 'A',
        title: 'Área de paneles',
        story: 'Para cubrir un techo con paneles solares hay que calcular áreas.',
        goal: '<p>Completa el <code>___</code> para que la función <code>areaPanel</code> devuelva el área (ancho × alto).</p>',
        starter: 'function areaPanel(ancho, alto) {\n  ___ ancho * alto;\n}\nconsole.log(areaPanel(3, 4));\n',
        tests: [
          { label: 'areaPanel(3, 4) devuelve 12', check: function (t) { var r = t.call('areaPanel', 3, 4); return r === 12 || 'areaPanel(3, 4) devolvió ' + t.show(r) + '.'; } },
          { label: 'areaPanel(5, 2) devuelve 10', check: function (t) { return t.call('areaPanel', 5, 2) === 10 || 'areaPanel(5, 2) no devolvió 10.'; } },
          { label: 'areaPanel(0, 9) devuelve 0', check: function (t) { return t.call('areaPanel', 0, 9) === 0 || 'areaPanel(0, 9) no devolvió 0.'; } }
        ],
        hints: ['La función debe <b>entregar</b> el resultado.', 'La palabra que entrega un valor está en la fase Aprende.', 'Ejemplo distinto: <code>function mitad(x) { return x / 2; }</code>'],
        success: 'Calculadora de áreas lista.'
      },
      prove: {
        activity: 'G',
        title: 'Conversor de energía',
        story: 'Los medidores entregan vatios-hora (Wh), pero la central trabaja en kilovatios-hora (kWh).',
        goal: '<p>Crea una función <code>convertirAKwh(wh)</code> que <b>devuelva</b> la energía en kWh (divide entre 1000).</p>',
        starter: '',
        tests: [
          { label: 'convertirAKwh(1000) → 1', check: function (t) { if (!t.isFn('convertirAKwh')) return 'No existe la función convertirAKwh.'; var r = t.call('convertirAKwh', 1000); if (r === undefined) return 'Tu función devuelve undefined: ¿usaste return? (console.log solo muestra, no devuelve).'; return r === 1 || 'Devolvió ' + t.show(r) + '.'; } },
          { label: 'convertirAKwh(2500) → 2.5', check: function (t) { return t.near(t.call('convertirAKwh', 2500), 2.5) || 'convertirAKwh(2500) debería devolver 2.5.'; } },
          { label: 'convertirAKwh(0) → 0', check: function (t) { return t.call('convertirAKwh', 0) === 0 || 'convertirAKwh(0) debería devolver 0.'; } }
        ],
        hints: ['Necesitas un parámetro para recibir los Wh.', 'Dentro, calcula y devuelve.', 'Pruébala tú con <code>console.log(convertirAKwh(1500));</code>'],
        success: 'La central ya entiende los medidores.'
      }
    },

    /* ------------------------------ 4.3 ------------------------------ */
    {
      title: 'Sistemas con parámetros',
      story: 'El sistema de alumbrado debe controlar tramos distintos de la avenida con una sola función.',
      scene: { world: 'lights', n: 8 },
      learn: {
        what: '<p>Una función puede tener <b>varios parámetros</b>, separados por comas. Y dentro puede usar todo lo que ya sabes: ciclos, condicionales, otras funciones…</p>',
        why: '<p>Los parámetros hacen que una función sea flexible: la misma lógica sirve para muchos casos.</p>',
        when: '<p>Cuando la tarea necesita más de un dato de entrada.</p>',
        how: 'function encenderRango(desde, hasta) {\n  for (let i = desde; i <= hasta; i++) {\n    encenderLuz(i);\n  }\n}\nencenderRango(2, 4);   // luces 2, 3 y 4',
        mistakes: ['Olvidar la coma entre parámetros.', 'Pasar menos argumentos de los necesarios: los que faltan valen <code>undefined</code>.'],
        analogy: 'Como un control remoto con dos perillas: el mismo aparato, configurado de distintas formas.'
      },
      observe: {
        code: 'function encenderDesde(inicio) {\n  for (let i = inicio; i < 8; i++) {\n    encenderLuz(i);\n  }\n}\nencenderDesde(5);',
        steps: [
          { lines: [1, 5], text: 'La función recibe <code>inicio</code> y lo usa como valor inicial del ciclo. Todavía no se encendió nada.' },
          { lines: [6, 6], text: 'Al llamarla con 5, el ciclo recorre 5, 6 y 7.' }
        ],
        result: '<p>Los parámetros pueden controlar ciclos, condiciones o cualquier parte del cuerpo de la función.</p>'
      },
      experiment: {
        code: 'function encenderDesde(inicio) {\n  for (let i = inicio; i < 8; i++) {\n    encenderLuz(i);\n  }\n}\nencenderDesde(5);\n',
        ideas: ['Llama con 0 y con 7.', 'Agrega un segundo parámetro <code>fin</code>.', 'Crea <code>apagarTodas()</code> que use <code>apagarLuz</code>.']
      },
      solve: {
        activity: 'G',
        title: 'Tramos de avenida',
        story: 'Los técnicos piden encender tramos de la avenida indicando dónde empieza y dónde termina.',
        goal: '<p>Crea <code>encenderRango(desde, hasta)</code> que encienda las luces desde <code>desde</code> hasta <code>hasta</code>, <b>ambas incluidas</b>. Después llama a <code>encenderRango(2, 5)</code>.</p>',
        starter: '',
        tests: [
          { label: 'Tras encenderRango(2, 5): luces 2 a 5 encendidas y el resto apagadas', check: function (t) { var L = t.world.lights; var ok = L.every(function (v, i) { return v === (i >= 2 && i <= 5); }); return ok || 'Estado de las luces: ' + L.map(function (v) { return v ? '●' : '○'; }).join(' '); } },
          { label: 'encenderRango(0, 1) enciende las luces 0 y 1', check: function (t) { t.call('encenderRango', 0, 1); return (t.world.lights[0] && t.world.lights[1] && !t.world.lights[6]) || 'encenderRango(0, 1) no encendió correctamente las luces 0 y 1.'; } },
          { label: 'encenderRango(7, 7) enciende solo la luz 7', check: function (t) { t.call('encenderRango', 7, 7); return t.world.lights[7] || 'encenderRango(7, 7) no encendió la luz 7.'; } }
        ],
        hints: ['La función necesita dos parámetros y un ciclo.', 'El ciclo empieza en <code>desde</code>. ¿Qué comparación incluye a <code>hasta</code>?', 'No olvides la llamada final con 2 y 5.'],
        success: 'Los técnicos pueden encender cualquier tramo.'
      },
      prove: {
        activity: 'G',
        title: 'Mensajes de estado',
        story: 'Cada robot del taller debe reportar su estado según su batería.',
        scene: { world: 'memory', title: 'Reportes del taller', watch: 'auto' },
        goal: '<p>Crea <code>mensajeEstado(nombre, bateria)</code> que <b>devuelva</b>:</p><ul><li><code>nombre + " necesita carga"</code> si la batería es menor que 20,</li><li><code>nombre + " listo"</code> en otro caso.</li></ul><p>Ejemplo: <code>mensajeEstado("Volt", 10)</code> → <code>"Volt necesita carga"</code>.</p>',
        starter: '',
        tests: [
          { label: 'mensajeEstado("Volt", 10) → "Volt necesita carga"', check: function (t) { if (!t.isFn('mensajeEstado')) return 'No existe la función mensajeEstado.'; var r = t.call('mensajeEstado', 'Volt', 10); return r === 'Volt necesita carga' || 'Devolvió ' + t.show(r) + '.'; } },
          { label: 'mensajeEstado("Nano", 80) → "Nano listo"', check: function (t) { var r = t.call('mensajeEstado', 'Nano', 80); return r === 'Nano listo' || 'Devolvió ' + t.show(r) + '.'; } },
          { label: 'mensajeEstado("Bit", 20) → "Bit listo" (20 no es menor que 20)', check: function (t) { var r = t.call('mensajeEstado', 'Bit', 20); return r === 'Bit listo' || 'Devolvió ' + t.show(r) + '.'; } }
        ],
        hints: ['Dentro de la función hay un if / else, y cada rama tiene su propio return.', 'Une el nombre con el texto usando +. Fíjate en el espacio.', 'Ejemplo distinto: <code>if (x &gt; 0) { return "positivo"; } else { return "no positivo"; }</code>'],
        success: 'Reportes automáticos funcionando.'
      }
    },

    /* ------------------------------ 4.4 ------------------------------ */
    {
      title: 'Detective de funciones',
      story: 'Algunas funciones del taller fallan de forma misteriosa. Para investigarlas necesitas entender el <b>alcance</b> de las variables.',
      scene: { world: 'memory', title: 'Memoria del taller', watch: 'auto' },
      learn: {
        what: '<p>El <b>alcance</b> (scope) indica desde dónde se puede usar una variable. Una variable declarada <b>dentro</b> de una función solo existe allí. Una declarada <b>fuera</b> puede usarse en todo el programa.</p>',
        why: '<p>Así cada función tiene su propio espacio de trabajo y no interfiere con las demás.</p>',
        when: '<p>Siempre que declares variables: piensa si deben ser locales (dentro) o globales (fuera).</p>',
        how: 'let ciudad = "Neópolis";       // global\nfunction presentar() {\n  let robot = "Pixel";         // local: solo existe aquí\n  console.log(robot, ciudad);  // puede usar ambas\n}\npresentar();\n// console.log(robot);  ❌ error: robot no existe fuera',
        mistakes: ['Usar fuera de la función una variable declarada dentro.', 'Olvidar el <code>return</code>: la función devuelve <code>undefined</code>.', 'Escribir mal el nombre de un parámetro dentro del cuerpo.', 'Declarar la función y olvidar llamarla.'],
        analogy: 'Las variables locales son como lo que pasa en una habitación con la puerta cerrada: quien está dentro ve el pasillo (lo global), pero desde el pasillo no se ve lo de dentro.'
      },
      observe: {
        code: 'let ciudad = "Neópolis";\nfunction presentar() {\n  let robotNombre = "Pixel";\n  console.log(robotNombre + " vive en " + ciudad);\n}\npresentar();\nconsole.log(typeof robotNombre);',
        steps: [
          { lines: [1, 1], text: '<code>ciudad</code> es global: aparece en la memoria.' },
          { lines: [2, 5], text: 'Se declara la función. <code>robotNombre</code> será local.' },
          { lines: [6, 6], text: 'Dentro de la función se usan las dos variables sin problema.' },
          { lines: [7, 7], text: 'Afuera, <code>robotNombre</code> no existe: <code>typeof</code> dice "undefined". Fíjate que en la memoria tampoco aparece.' }
        ],
        result: '<p>Las variables locales nacen al ejecutarse la función y desaparecen al terminar.</p>'
      },
      experiment: {
        code: 'let ciudad = "Neópolis";\nfunction presentar() {\n  let robotNombre = "Pixel";\n  console.log(robotNombre + " vive en " + ciudad);\n}\npresentar();\n',
        ideas: ['Agrega <code>console.log(robotNombre);</code> al final y lee el error.', 'Cambia <code>ciudad</code> dentro de la función (sin let): ¿cambia afuera?', 'Declara <code>let ciudad = "Otra";</code> dentro de la función: ¿cuál se usa?']
      },
      solve: {
        activity: 'C',
        mode: 'predict',
        title: 'Dos variables con el mismo nombre',
        story: 'Hay una variable <code>energia</code> fuera de la función y otra dentro. ¿Cuál cambia?',
        goal: '<p>Predice qué mostrará la consola.</p>',
        code: 'let energia = 100;\nfunction recargar(cantidad) {\n  let energia = cantidad * 2;\n  return energia;\n}\nlet nueva = recargar(5);\nconsole.log(nueva);\nconsole.log(energia);',
        options: ['10\n100', '10\n10', '100\n100', 'Error: energia ya fue declarada'],
        answer: 0,
        explain: 'Dentro de la función, <code>let energia</code> crea una variable <b>local</b> nueva (vale 10) que no afecta a la global. La función devuelve 10 → <code>nueva</code> = 10, y la <code>energia</code> global sigue en 100. No hay error porque están en alcances distintos.',
        wrongHint: 'Fíjate en el <code>let</code> dentro de la función: ¿crea una variable nueva o modifica la de afuera?',
        hints: ['¿Dónde se declara cada <code>energia</code>?', 'Una declaración dentro de la función es local.', 'Lo local desaparece al terminar la función.'],
        success: 'Entiendes el alcance de las variables. ¡Excelente detective!'
      },
      prove: {
        activity: 'B',
        title: 'Calculadora de descuentos rota',
        story: 'La tienda del taller cobra precios absurdos. Encuentra los errores en las funciones.',
        goal: '<p>Corrige el código para que <code>calcularDescuento(precio, porcentaje)</code> devuelva el descuento y <code>precioFinal(precio, porcentaje)</code> devuelva el precio con el descuento aplicado. Ejemplo: <code>precioFinal(200, 10)</code> → 180.</p>',
        starter: 'function calcularDescuento(precio, porcentaje) {\n  let descuento = precio * porcentaje / 100;\n}\n\nfunction precioFinal(precio, porcentaje) {\n  return precio - calcularDescuento(precio, porcentage);\n}\n\nconsole.log(precioFinal(200, 10));\n',
        tests: [
          { label: 'calcularDescuento(100, 20) → 20', check: function (t) { var r = t.call('calcularDescuento', 100, 20); return r === 20 || 'calcularDescuento(100, 20) devolvió ' + t.show(r) + '.'; } },
          { label: 'precioFinal(200, 10) → 180', check: function (t) { var r = t.call('precioFinal', 200, 10); return r === 180 || 'precioFinal(200, 10) devolvió ' + t.show(r) + '.'; } },
          { label: 'precioFinal(50, 50) → 25', check: function (t) { return t.call('precioFinal', 50, 50) === 25 || 'precioFinal(50, 50) no devolvió 25.'; } }
        ],
        hints: ['Ejecuta y lee el error: ¿qué nombre no existe?', 'Además del nombre mal escrito, una de las funciones calcula pero no entrega su resultado.', 'Si una función devuelve undefined, revisa si tiene <code>return</code>.'],
        success: 'Precios corregidos. Eres un/a detective de funciones.'
      }
    },

    /* ------------------------------ 4.5 ------------------------------ */
    {
      title: 'Controlador del robot',
      story: 'Para terminar el taller, construirás un controlador hecho de varias funciones que trabajan juntas.',
      scene: { world: 'robot', n: 10, crystals: [2, 5] },
      learn: {
        what: '<p>Los programas grandes se dividen en <b>funciones pequeñas</b>, cada una con una tarea clara. Unas funciones pueden <b>llamar a otras</b>.</p>',
        why: '<p>Dividir un problema en partes lo hace más fácil de pensar, probar y corregir.</p>',
        when: '<p>Cuando un problema tiene varios pasos o sub-tareas.</p>',
        how: 'function avanzarVarias(veces) {\n  for (let i = 0; i < veces; i++) {\n    robot.avanzar();\n  }\n}\nfunction misionCorta() {\n  avanzarVarias(3);         // una función usa otra\n  robot.decir("Listo");\n}\nmisionCorta();',
        mistakes: ['Hacer funciones enormes que lo hacen todo.', 'Nombres poco claros: <code>f1</code>, <code>cosa</code>.'],
        analogy: 'Como un equipo de trabajo: cada integrante sabe hacer una tarea, y quien coordina les pide las cosas en orden.'
      },
      observe: {
        code: 'function avanzarVarias(veces) {\n  for (let i = 0; i < veces; i++) {\n    robot.avanzar();\n  }\n}\nfunction recogerSiHay() {\n  if (robot.hayCristal()) {\n    robot.recoger();\n  }\n}\navanzarVarias(2);\nrecogerSiHay();\navanzarVarias(3);\nrecogerSiHay();',
        steps: [
          { lines: [1, 5], text: 'Una función con parámetro y un ciclo dentro.' },
          { lines: [6, 10], text: 'Otra función con un if dentro.' },
          { lines: [11, 12], text: 'Combinadas: avanza 2 casillas y recoge el cristal.' },
          { lines: [13, 14], text: 'Las reutilizamos: 3 casillas más y otro cristal.' }
        ],
        result: '<p>El programa principal (las últimas 4 líneas) se lee casi como un plan en español.</p>'
      },
      experiment: {
        code: 'function avanzarVarias(veces) {\n  for (let i = 0; i < veces; i++) {\n    robot.avanzar();\n  }\n}\nfunction recogerSiHay() {\n  if (robot.hayCristal()) {\n    robot.recoger();\n  }\n}\navanzarVarias(2);\nrecogerSiHay();\n',
        ideas: ['Crea una función <code>mision()</code> que use las otras dos.', 'Agrega a <code>recogerSiHay</code> un mensaje con <code>robot.decir</code>.']
      },
      solve: {
        activity: 'E',
        mode: 'order',
        title: 'Cargador con límite',
        story: 'La función que carga baterías no debe pasar de 100. Sus líneas se desordenaron.',
        scene: { world: 'memory', title: 'Cargador', watch: 'auto' },
        goal: '<p>Ordena las piezas: <code>cargarBateria(actual, extra)</code> suma la carga, la limita a un máximo de 100 y devuelve el resultado. Al final se prueba con 80 + 50.</p>',
        lines: [
          'function cargarBateria(actual, extra) {',
          '  let nueva = actual + extra;',
          '  if (nueva > 100) {',
          '    nueva = 100;',
          '  }',
          '  return nueva;',
          '}',
          'console.log(cargarBateria(80, 50));'
        ],
        tests: [
          { label: 'cargarBateria(80, 50) → 100', check: function (t) { var r = t.call('cargarBateria', 80, 50); return r === 100 || 'Devolvió ' + t.show(r) + '. ¿El return está antes del límite?'; } },
          { label: 'cargarBateria(10, 20) → 30', check: function (t) { var r = t.call('cargarBateria', 10, 20); return r === 30 || 'Devolvió ' + t.show(r) + '.'; } },
          { label: 'La consola muestra 100', check: function (t) { return t.values.indexOf(100) >= 0 || 'La prueba final debería mostrar 100.'; } }
        ],
        hints: ['Primero se declara la función; la línea de prueba va al final, afuera.', 'Hay que calcular antes de limitar, y limitar antes de devolver.', '<code>return</code> termina la función: lo que esté después no se ejecuta.'],
        success: 'Cargador seguro.'
      },
      prove: {
        activity: 'G',
        title: 'Patrulla automática',
        story: 'Pixel debe patrullar el taller por su cuenta, empiece donde empiece.',
        goal: '<p>Crea dos funciones:</p><ul><li><code>avanzarHasta(destino)</code>: hace avanzar a Pixel hasta la casilla <code>destino</code>.</li><li><code>patrullar()</code>: usa <code>avanzarHasta</code> para ir a la casilla <b>9</b> y luego dice <b>Patrulla completa</b>.</li></ul><p>Al final, llama a <code>patrullar()</code>.</p>',
        starter: '',
        tests: [
          { label: 'Pixel llega a la casilla 9 y dice «Patrulla completa»', check: function (t) { return (t.world.pos === 9 && t.world.said.some(function (s) { return /patrulla completa/i.test(s); })) || 'Pixel terminó en ' + t.world.pos + ' y dijo: ' + t.show(t.world.said) + '.'; } },
          { label: 'Funciona empezando desde la casilla 4', setup: '__CQ.cfg.start = 4;', check: function (t) { return t.world.pos === 9 || 'Empezando en 4, terminó en ' + t.world.pos + '.'; } },
          { label: 'avanzarHasta(6) lleva de la casilla 2 a la 6', check: function (t) { if (!t.isFn('avanzarHasta')) return 'No existe la función avanzarHasta.'; t.W.reset(2); t.call('avanzarHasta', 6); return t.world.pos === 6 || 'avanzarHasta(6) dejó a Pixel en ' + t.world.pos + '.'; } },
          { label: '`patrullar` usa `avanzarHasta`', check: function (t) { return /function\s+patrullar\s*\([^)]*\)\s*\{[^}]*avanzarHasta\s*\(/.test(t.src) || 'patrullar() debería llamar a avanzarHasta().'; } }
        ],
        hints: ['avanzarHasta necesita un ciclo que dependa de la posición, no de un número fijo de pasos.', 'Repasa el reto de la estación de carga del bloque anterior: es la misma idea dentro de una función.', 'patrullar() tiene solo dos instrucciones.'],
        success: '¡El Taller de Robots funciona con habilidades reutilizables!'
      }
    }
  ],

  special: {
    title: 'Saludos inteligentes',
    scene: { world: 'memory', title: 'Recepción', watch: 'auto' },
    solve: {
      activity: 'G',
      title: 'Saludos inteligentes',
      story: 'La recepción del taller saluda según la hora.',
      goal: '<p>Crea <code>crearSaludo(nombre, hora)</code> que devuelva <b>"Buenos días, NOMBRE"</b> si la hora es menor que 12, <b>"Buenas tardes, NOMBRE"</b> si es menor que 20 y <b>"Buenas noches, NOMBRE"</b> en otro caso.</p>',
      starter: '',
      tests: [
        { label: 'crearSaludo("Ana", 9)', check: function (t) { return t.call('crearSaludo', 'Ana', 9) === 'Buenos días, Ana' || 'Se esperaba "Buenos días, Ana".'; } },
        { label: 'crearSaludo("Leo", 12)', check: function (t) { return t.call('crearSaludo', 'Leo', 12) === 'Buenas tardes, Leo' || 'Se esperaba "Buenas tardes, Leo".'; } },
        { label: 'crearSaludo("Sam", 21)', check: function (t) { return t.call('crearSaludo', 'Sam', 21) === 'Buenas noches, Sam' || 'Se esperaba "Buenas noches, Sam".'; } }
      ],
      hints: ['Usa if / else if / else con un return en cada rama.', 'Fíjate en la coma y el espacio del texto.', 'Puedes usar plantillas: <code>`Hola, ${nombre}`</code>.'],
      success: 'La recepción ya saluda con educación.'
    }
  }
});
