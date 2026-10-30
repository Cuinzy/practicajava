/* =====================================================================
   BLOQUE 2 · Barrio de las Puertas — Condicionales y decisiones
   Mundos: puerta inteligente y semáforo
   ===================================================================== */
CQ.Levels.register({
  n: 2,
  name: 'Barrio de las Puertas',
  topic: 'Booleanos, if, else, else if y condiciones compuestas con && || !',
  icon: '🚪',
  color: '#f472b6',
  intro: 'En este barrio todas las puertas y semáforos quedaron bloqueados. Necesitan programas que <b>tomen decisiones</b> según lo que miden sus sensores.',
  concepts: ['Booleanos', 'if', 'else', 'else if', 'Comparaciones', '&& || !', 'Decisiones anidadas'],
  levels: [
    /* ------------------------------ 2.1 ------------------------------ */
    {
      title: 'La puerta inteligente',
      story: 'Un laboratorio está bloqueado. La puerta solo puede abrirse si el nivel de energía es <b>mayor o igual a 50</b>. Si no, debe mostrar una alerta.',
      scene: { world: 'door', sensors: ['energia'] },
      setup: 'var energia = 65;',
      learn: {
        what: '<p>Una <b>condicional</b> permite que el programa <b>decida</b> qué instrucciones ejecutar según si una condición es verdadera o falsa.</p>',
        why: '<p>Sin condicionales, un programa haría siempre lo mismo. Con ellas puede reaccionar: abrir o no abrir, aprobar o rechazar, avanzar o detenerse.</p>',
        when: '<p>Cuando la respuesta a una pregunta (¿hay suficiente energía?) determina qué hacer.</p>',
        how: 'if (energia >= 50) {\n  abrirPuerta();\n} else {\n  mostrarAlerta();\n}',
        symbols: [
          ['if', 'Significa «si». Inicia la decisión.'],
          ['( )', 'Los paréntesis encierran la <b>condición</b>: la pregunta que se evalúa.'],
          ['energia >= 50', 'La condición. Da <code>true</code> o <code>false</code>.'],
          ['>=', '«Mayor o igual que». 50 >= 50 es true.'],
          ['{ }', 'Las llaves agrupan las instrucciones que se ejecutan si la condición es verdadera.'],
          ['abrirPuerta();', 'Instrucción interna: solo se ejecuta si se cumple la condición.'],
          ['else', 'Significa «si no». Su bloque se ejecuta cuando la condición es <code>false</code>.']
        ],
        mistakes: [
          'Olvidar los paréntesis de la condición: <code>if energia >= 50</code> ❌.',
          'Poner punto y coma después de la condición: <code>if (energia >= 50);</code> — el bloque se ejecutaría siempre.',
          'Escribir <code>=&gt;</code> en lugar de <code>&gt;=</code>.',
          'No cerrar la llave <code>}</code> antes del <code>else</code>.'
        ],
        analogy: 'Es como un guardia en una puerta: «<b>si</b> tienes suficiente energía, pasa; <b>si no</b>, te aviso que no puedes». Solo uno de los dos caminos ocurre.'
      },
      observe: {
        code: 'if (energia >= 50) {\n  abrirPuerta();\n} else {\n  mostrarAlerta("Energía insuficiente");\n}',
        steps: [
          { lines: [1, 1], run: false, text: 'El sensor marca energia = 65. Se evalúa la condición: ¿65 >= 50? → <b>true</b>.' },
          { lines: [2, 2], run: false, text: 'Como la condición es true, se ejecutan las instrucciones entre las primeras llaves: <code>abrirPuerta()</code>.' },
          { lines: [3, 5], upTo: 5, text: 'El bloque <code>else</code> se <b>salta</b>, porque solo se ejecuta cuando la condición es false. Observa la puerta abrirse.' }
        ],
        result: '<p>Con energía 65 se abrió la puerta. Con un valor menor que 50 se habría ejecutado el bloque <code>else</code>. Pruébalo en la siguiente fase.</p>'
      },
      experiment: {
        intro: 'Mueve el control de energía: el programa se ejecuta de nuevo y la puerta reacciona.',
        code: 'if (energia >= 50) {\n  abrirPuerta();\n} else {\n  mostrarAlerta("Energía insuficiente");\n}\n',
        controls: [{ var: 'energia', type: 'range', min: 0, max: 100, step: 1, value: 30 }],
        ideas: ['Encuentra el valor exacto donde la puerta empieza a abrirse.', 'Cambia <code>&gt;=</code> por <code>&gt;</code>: ¿qué pasa con 50?', 'Agrega <code>console.log("Energía:", energia);</code> antes del if.']
      },
      solve: {
        activity: 'D',
        title: 'Programa la condición',
        story: 'El sensor mide la energía y la guarda en la variable <code>energia</code>. Tu programa debe decidir.',
        goal: '<p>Si <code>energia</code> es <b>mayor o igual a 50</b>, llama a <code>abrirPuerta()</code>. En caso contrario, llama a <code>mostrarAlerta()</code>.</p><p>La variable <code>energia</code> ya existe: <b>no la declares</b>. Probaremos tu puerta con distintos valores.</p>',
        starter: '// La variable energia ya existe: la mide el sensor.\n// Escribe aquí tu condición\n',
        requires: [[/\bif\s*\(/, 'Usa `if`'], [/\belse\b/, 'Usa `else`']],
        forbids: [[/\b(let|const|var)\s+energia\b/, 'No declares `energia` (la mide el sensor)']],
        tests: [
          { label: 'Energía 65 → la puerta se abre', check: function (t) { return (t.world.door === 'abierta' && !t.world.alerts.length) || 'Con energía 65 la puerta debería abrirse sin alertas.'; } },
          { label: 'Energía 50 (justo el límite) → se abre', setup: 'energia = 50;', check: function (t) { return t.world.door === 'abierta' || 'Con 50 la puerta debería abrirse: «mayor o igual» incluye el 50.'; } },
          { label: 'Energía 49 → cerrada y con alerta', setup: 'energia = 49;', check: function (t) { if (t.world.door === 'abierta') return 'Con 49 la puerta NO debería abrirse.'; return t.world.alerts.length > 0 || 'Con 49 debería mostrarse una alerta.'; } },
          { label: 'Energía 0 → cerrada y con alerta', setup: 'energia = 0;', check: function (t) { return (t.world.door === 'cerrada' && t.world.alerts.length > 0) || 'Con 0 la puerta debe quedar cerrada y mostrar alerta.'; } },
          { label: 'Energía 100 → se abre', setup: 'energia = 100;', check: function (t) { return t.world.door === 'abierta' || 'Con 100 la puerta debería abrirse.'; } }
        ],
        hints: [
          'La estructura tiene dos caminos: uno para cuando se cumple la condición y otro para cuando no.',
          'Revisa el operador: «mayor o igual» se escribe con dos símbolos, y el <code>=</code> va al final.',
          'Ejemplo distinto: <code>if (edad >= 18) { votar(); } else { esperar(); }</code>'
        ],
        celebrate: '✔ PUERTA REPARADA',
        success: 'La puerta se abre exactamente cuando debe. ¡Tu primer programa que toma decisiones!'
      },
      prove: {
        activity: 'G',
        title: 'Puerta de carga',
        story: 'En el almacén vecino, la puerta de carga se daña si pasa un paquete demasiado pesado.',
        scene: { world: 'door', sensors: ['peso'], sign: 'CARGA', inside: '📦', title: 'Almacén · Puerta de carga' },
        setup: 'var peso = 320;',
        goal: '<p>La variable <code>peso</code> ya existe. Abre la puerta solo si el peso es <b>menor que 500</b>. Si no, activa la alarma con <code>activarAlarma()</code>.</p>',
        starter: '',
        requires: [[/\bif\s*\(/, 'Usa `if`']],
        forbids: [[/\b(let|const|var)\s+peso\b/, 'No declares `peso`']],
        tests: [
          { label: '320 kg → abre', check: function (t) { return (t.world.door === 'abierta' && !t.world.alarm) || 'Con 320 kg la puerta debería abrirse sin alarma.'; } },
          { label: '499 kg → abre', setup: 'peso = 499;', check: function (t) { return (t.world.door === 'abierta' && !t.world.alarm) || 'Con 499 kg debería abrirse.'; } },
          { label: '500 kg → alarma y cerrada', setup: 'peso = 500;', check: function (t) { return (t.world.door === 'cerrada' && t.world.alarm) || 'Con 500 kg no debe abrirse: debe sonar la alarma («menor que» no incluye el 500).'; } },
          { label: '750 kg → alarma y cerrada', setup: 'peso = 750;', check: function (t) { return (t.world.door === 'cerrada' && t.world.alarm) || 'Con 750 kg debe sonar la alarma.'; } }
        ],
        hints: ['Es la misma estructura que el reto anterior, con otra pregunta y otra acción.', '«Menor que» se escribe con un solo símbolo.', 'Piensa qué pasa exactamente con 500: ¿se cumple «menor que 500»?'],
        success: 'El almacén está protegido. Ya sabes construir decisiones por tu cuenta.'
      }
    },

    /* ------------------------------ 2.2 ------------------------------ */
    {
      title: '¿Puede pasar?',
      story: 'La zona de robots tiene reglas de acceso. Algunos datos ya son <b>booleanos</b>: verdadero o falso.',
      scene: { world: 'door', sensors: ['tieneCredencial'], sign: 'ZONA ROBOTS', inside: '🤖' },
      setup: 'var tieneCredencial = true;',
      learn: {
        what: '<p>Un <b>booleano</b> solo puede valer <code>true</code> o <code>false</code>. Como ya es una respuesta de sí/no, puede usarse <b>directamente</b> como condición.</p>',
        why: '<p>Muchos datos son naturalmente de sí/no: ¿tiene credencial?, ¿está encendido?, ¿es de noche?</p>',
        when: '<p>Cuando la decisión depende de un dato que ya es verdadero o falso. Usa <code>!</code> para preguntar lo contrario.</p>',
        how: 'if (tieneCredencial) {        // igual que: tieneCredencial === true\n  abrirPuerta();\n}\nif (!estaBloqueado) {         // "si NO está bloqueado"\n  console.log("Libre");\n}',
        symbols: [['!', 'Negación: <code>!true</code> es false y <code>!false</code> es true.']],
        mistakes: ['Escribir <code>"true"</code> entre comillas: es un texto, no un booleano.', 'Escribir <code>if (tieneCredencial = true)</code>: asigna en vez de comparar.'],
        analogy: 'Un booleano es un interruptor de luz: encendido o apagado, no hay término medio.'
      },
      observe: {
        code: 'if (tieneCredencial) {\n  abrirPuerta();\n  console.log("Bienvenido");\n} else {\n  mostrarAlerta("Sin credencial");\n}',
        steps: [
          { lines: [1, 1], run: false, text: 'No hace falta comparar: <code>tieneCredencial</code> ya es <code>true</code> o <code>false</code>.' },
          { lines: [2, 3], run: false, text: 'Si es true, se ejecutan <b>dos</b> instrucciones: un bloque puede tener varias.' },
          { lines: [4, 6], upTo: 6, text: 'Si fuera false, se mostraría la alerta.' }
        ],
        result: '<p>El sensor indicaba <code>true</code>, así que la puerta se abrió y se mostró el saludo.</p>'
      },
      experiment: {
        code: 'if (tieneCredencial) {\n  abrirPuerta();\n  console.log("Bienvenido");\n} else {\n  mostrarAlerta("Sin credencial");\n}\n',
        controls: [{ var: 'tieneCredencial', type: 'bool', value: false }],
        ideas: ['Activa y desactiva la credencial.', 'Cambia la condición a <code>!tieneCredencial</code>: ¿qué ocurre ahora?']
      },
      solve: {
        activity: 'E',
        mode: 'order',
        title: 'Ordena el control de acceso',
        story: 'El programa de la puerta del depósito quedó desordenado.',
        scene: { world: 'door', sensors: ['nivelAcceso'], sign: 'DEPÓSITO', inside: '🗄️' },
        setup: 'var nivelAcceso = 4;',
        goal: '<p>Ordena las piezas: si <code>nivelAcceso</code> es 3 o más, la puerta se abre y se muestra «Acceso concedido»; si no, se muestra la alerta «Nivel insuficiente».</p>',
        lines: [
          'if (nivelAcceso >= 3) {',
          '  abrirPuerta();',
          '  console.log("Acceso concedido");',
          '} else {',
          '  mostrarAlerta("Nivel insuficiente");',
          '}'
        ],
        tests: [
          { label: 'Nivel 4 → abre y muestra «Acceso concedido»', check: function (t) { return (t.world.door === 'abierta' && t.logHas('Acceso concedido')) || 'Con nivel 4 la puerta debe abrirse y mostrar el mensaje.'; } },
          { label: 'Nivel 3 → abre', setup: 'nivelAcceso = 3;', check: function (t) { return t.world.door === 'abierta' || 'Con nivel 3 la puerta debe abrirse.'; } },
          { label: 'Nivel 2 → cerrada, con alerta y sin mensaje de acceso', setup: 'nivelAcceso = 2;', check: function (t) { if (t.world.door === 'abierta') return 'Con nivel 2 la puerta no debería abrirse.'; if (t.logHas('Acceso concedido')) return 'Con nivel 2 no debería decir «Acceso concedido».'; return t.world.alerts.length > 0 || 'Falta la alerta.'; } }
        ],
        hints: ['Toda decisión empieza por el <code>if</code> con su condición.', 'Las instrucciones con sangría van dentro de un bloque. ¿Cuál pertenece al caso «sí» y cuál al «no»?', 'La llave que cierra el if se une con el else en la misma línea.'],
        success: 'El depósito vuelve a funcionar.'
      },
      prove: {
        activity: 'G',
        title: 'Detector de metales',
        story: 'En la zona de robots no se permite entrar con objetos metálicos.',
        scene: { world: 'door', sensors: ['llevaMetal'], sign: 'ZONA ROBOTS', inside: '🤖' },
        setup: 'var llevaMetal = false;',
        goal: '<p>La variable booleana <code>llevaMetal</code> ya existe. Usa el operador <code>!</code> para abrir la puerta cuando la persona <b>no</b> lleve metal. Si lleva metal, muestra una alerta.</p>',
        starter: '',
        requires: [[/!\s*llevaMetal/, 'Usa el operador `!` con `llevaMetal`']],
        tests: [
          { label: 'Sin metal → abre', check: function (t) { return t.world.door === 'abierta' || 'Sin metal la puerta debería abrirse.'; } },
          { label: 'Con metal → cerrada y con alerta', setup: 'llevaMetal = true;', check: function (t) { return (t.world.door === 'cerrada' && t.world.alerts.length > 0) || 'Con metal la puerta debe quedar cerrada y mostrar una alerta.'; } }
        ],
        hints: ['La condición pregunta lo contrario de la variable.', '<code>!</code> va justo antes del nombre de la variable, dentro de los paréntesis.', 'Ejemplo distinto: <code>if (!lloviendo) { salir(); }</code>'],
        success: 'Detector funcionando. Dominas los booleanos y la negación.'
      }
    },

    /* ------------------------------ 2.3 ------------------------------ */
    {
      title: 'Semáforo inteligente',
      story: 'Los semáforos de la Avenida Central deben cambiar según el tráfico. Hay <b>más de dos</b> opciones posibles.',
      scene: { world: 'traffic', sensors: ['velocidad'] },
      setup: 'var velocidad = 50;',
      learn: {
        what: '<p><code>else if</code> permite encadenar varias condiciones. Se revisan <b>en orden</b> y se ejecuta <b>solo el primer bloque</b> cuya condición sea verdadera.</p>',
        why: '<p>Muchas situaciones tienen más de dos caminos: rojo, amarillo o verde; aprobado, recuperación o reprobado.</p>',
        when: '<p>Cuando hay varias opciones excluyentes que dependen de rangos o casos.</p>',
        how: 'if (velocidad > 60) {\n  cambiarLuz("rojo");\n} else if (velocidad > 40) {\n  cambiarLuz("amarillo");\n} else {\n  cambiarLuz("verde");\n}',
        symbols: [['else if', '«Si no, pero si…»: otra condición que se revisa solo si las anteriores fueron false.']],
        mistakes: [
          'Poner las condiciones en un orden que hace imposible llegar a algunas (por ejemplo, revisar <code>&gt; 40</code> antes que <code>&gt; 60</code>).',
          'Usar varios <code>if</code> separados en lugar de <code>else if</code>: se ejecutarían varios bloques.',
          'Olvidar el caso final <code>else</code>.'
        ],
        analogy: 'Es como una fila de preguntas en un concurso: en cuanto respondes «sí» a una, ganas ese premio y ya no se hacen las demás preguntas.'
      },
      observe: {
        code: 'if (velocidad > 60) {\n  cambiarLuz("rojo");\n} else if (velocidad > 40) {\n  cambiarLuz("amarillo");\n} else {\n  cambiarLuz("verde");\n}',
        steps: [
          { lines: [1, 1], run: false, text: 'Velocidad 50. ¿50 > 60? false → se salta el primer bloque.' },
          { lines: [3, 3], run: false, text: '¿50 > 40? true → entra en este bloque.' },
          { lines: [4, 4], run: false, text: 'Se enciende el amarillo.' },
          { lines: [5, 7], upTo: 7, text: 'Como ya se ejecutó un bloque, el <code>else</code> final se ignora.' }
        ],
        result: '<p>Aunque 50 también es menor que 60, solo se ejecutó <b>un</b> bloque: el primero cuya condición fue verdadera.</p>'
      },
      experiment: {
        code: 'if (velocidad > 60) {\n  cambiarLuz("rojo");\n} else if (velocidad > 40) {\n  cambiarLuz("amarillo");\n} else {\n  cambiarLuz("verde");\n}\n',
        controls: [{ var: 'velocidad', type: 'range', min: 0, max: 100, step: 1, value: 50 }],
        ideas: ['Encuentra los dos valores donde cambia la luz.', 'Intercambia el orden de las dos primeras condiciones: ¿cuándo se enciende ahora el rojo?', 'Agrega otro <code>else if</code> para velocidades mayores que 90.']
      },
      solve: {
        activity: 'G',
        title: 'Semáforo según el tráfico',
        story: 'El sensor cuenta los autos que esperan en la esquina.',
        scene: { world: 'traffic', sensors: ['autos'] },
        setup: 'var autos = 12;',
        goal: '<p><code>autos</code> ya existe. Programa el semáforo:</p><ul><li>más de 10 autos → <b>verde</b></li><li>entre 5 y 10 (incluidos) → <b>amarillo</b></li><li>menos de 5 → <b>rojo</b></li></ul><p>La luz debe cambiar <b>una sola vez</b>.</p>',
        starter: '',
        requires: [[/else\s+if/, 'Usa `else if`']],
        tests: [
          { label: '12 autos → verde', check: function (t) { return t.world.light === 'verde' || 'Con 12 autos la luz debería ser verde (está en ' + t.show(t.world.light) + ').'; } },
          { label: '10 autos → amarillo', setup: 'autos = 10;', check: function (t) { return t.world.light === 'amarillo' || 'Con 10 autos debería ser amarillo.'; } },
          { label: '5 autos → amarillo', setup: 'autos = 5;', check: function (t) { return t.world.light === 'amarillo' || 'Con 5 autos debería ser amarillo (5 está incluido).'; } },
          { label: '4 autos → rojo', setup: 'autos = 4;', check: function (t) { return t.world.light === 'rojo' || 'Con 4 autos debería ser rojo.'; } },
          { label: 'La luz cambia una sola vez', setup: 'autos = 7;', check: function (t) { return t.world.changes.length === 1 || 'La luz cambió ' + t.world.changes.length + ' veces. Con else if solo se ejecuta una rama.'; } }
        ],
        hints: ['Ordena las condiciones de la más exigente a la menos exigente.', 'Si la primera pregunta es «más de 10», la segunda solo se revisa cuando hay 10 o menos.', 'Recuerda: «incluidos» → <code>&gt;=</code>.'],
        success: 'El tráfico fluye. Las cadenas else if no tienen secretos para ti.'
      },
      prove: {
        activity: 'H',
        title: 'Semáforo del túnel',
        story: 'El semáforo del túnel debe avisar del calor. Pero siempre se queda en verde… Ejecútalo con varias temperaturas y descubre por qué.',
        scene: { world: 'traffic', sensors: ['temperatura'], title: 'Túnel norte · semáforo térmico' },
        setup: 'var temperatura = 45;',
        goal: '<p>Reglas: más de 40 °C → <b>rojo</b>; más de 30 °C → <b>amarillo</b>; en cualquier otro caso → <b>verde</b>. Corrige el programa sin borrarlo todo.</p>',
        starter: 'if (temperatura > 0) {\n  cambiarLuz("verde");\n} else if (temperatura > 30) {\n  cambiarLuz("amarillo");\n} else if (temperatura > 40) {\n  cambiarLuz("rojo");\n}\n',
        tests: [
          { label: '45 °C → rojo', check: function (t) { return t.world.light === 'rojo' || 'Con 45 °C debería ser rojo y está en ' + t.show(t.world.light) + '.'; } },
          { label: '35 °C → amarillo', setup: 'temperatura = 35;', check: function (t) { return t.world.light === 'amarillo' || 'Con 35 °C debería ser amarillo.'; } },
          { label: '40 °C → amarillo', setup: 'temperatura = 40;', check: function (t) { return t.world.light === 'amarillo' || 'Con 40 °C debería ser amarillo («más de 40» no incluye el 40).'; } },
          { label: '20 °C → verde', setup: 'temperatura = 20;', check: function (t) { return t.world.light === 'verde' || 'Con 20 °C debería ser verde.'; } },
          { label: '-5 °C → verde', setup: 'temperatura = -5;', check: function (t) { return t.world.light === 'verde' || 'Con -5 °C también debería ser verde.'; } }
        ],
        hints: ['Prueba con 45 °C: ¿cuál es la primera condición verdadera?', 'El problema es el orden de las preguntas. ¿Y qué pasa con temperaturas bajo cero?', 'Las condiciones más estrictas deben ir primero, y el caso «cualquier otro» es un else.'],
        success: 'El túnel ahora avisa correctamente. ¡Depuraste la lógica, no solo la sintaxis!'
      }
    },

    /* ------------------------------ 2.4 ------------------------------ */
    {
      title: 'Condiciones compuestas',
      story: 'La bóveda central exige varias comprobaciones a la vez.',
      scene: { world: 'door', sensors: ['tieneTarjeta', 'huellaValida', 'esEmergencia'], sign: 'BÓVEDA', inside: '💎' },
      setup: 'var tieneTarjeta = true; var huellaValida = false; var esEmergencia = true;',
      learn: {
        what: '<p>Una <b>condición compuesta</b> une varias comparaciones con <code>&&</code> (y), <code>||</code> (o) y <code>!</code> (no).</p>',
        why: '<p>Las reglas reales casi nunca dependen de un único dato.</p>',
        when: '<p>«Tiene tarjeta <b>y</b> huella», «es de día <b>o</b> hay luz artificial», «<b>no</b> está bloqueado».</p>',
        how: 'if (tieneTarjeta && huellaValida) {\n  abrirPuerta();\n}\nif (esEmergencia || tieneLlaveMaestra) {\n  abrirPuerta();\n}\nif ((a && b) || c) { }   // los paréntesis agrupan',
        symbols: [['&&', 'true solo si las dos partes son true.'], ['||', 'true si al menos una parte es true.'], ['( )', 'Agrupan partes de la condición para decidir qué se evalúa primero.']],
        mistakes: ['Confundir && con ||.', 'Escribir <code>hora >= 8 && <= 18</code>: cada lado necesita su variable: <code>hora >= 8 && hora <= 18</code>.', 'Olvidar paréntesis al mezclar && y ||.'],
        analogy: '<table class="sym"><tr><td>A && B</td><td>true solo si A y B son true</td></tr><tr><td>A || B</td><td>false solo si A y B son false</td></tr></table>'
      },
      observe: {
        code: 'if (tieneTarjeta && huellaValida) {\n  abrirPuerta();\n} else if (esEmergencia) {\n  abrirPuerta();\n  console.log("Apertura de emergencia");\n} else {\n  mostrarAlerta("Acceso denegado");\n}',
        steps: [
          { lines: [1, 1], run: false, text: 'tieneTarjeta es true pero huellaValida es false: true && false → <b>false</b>.' },
          { lines: [3, 3], run: false, text: 'Se revisa la siguiente: esEmergencia es true.' },
          { lines: [4, 5], run: false, text: 'Se abre la puerta y se registra que fue una apertura especial.' },
          { lines: [6, 8], upTo: 8, text: 'El else no se ejecuta.' }
        ],
        result: '<p>Aunque la huella falló, la emergencia permitió abrir. Cada operador lógico combina booleanos para producir uno nuevo.</p>'
      },
      experiment: {
        code: 'if (tieneTarjeta && huellaValida) {\n  abrirPuerta();\n} else if (esEmergencia) {\n  abrirPuerta();\n  console.log("Apertura de emergencia");\n} else {\n  mostrarAlerta("Acceso denegado");\n}\n',
        controls: [{ var: 'tieneTarjeta', type: 'bool', value: true }, { var: 'huellaValida', type: 'bool', value: false }, { var: 'esEmergencia', type: 'bool', value: false }],
        ideas: ['¿Qué combinaciones abren la puerta?', 'Cambia <code>&&</code> por <code>||</code> en la primera condición y vuelve a probar.']
      },
      solve: {
        activity: 'A',
        title: 'Cerradura doble',
        story: 'La bóveda se abre si (tiene tarjeta <b>y</b> huella válida) <b>o</b> si quien llega es la persona que dirige el centro.',
        scene: { world: 'door', sensors: ['tieneTarjeta', 'huellaValida', 'esDirector'], sign: 'BÓVEDA', inside: '💎' },
        setup: 'var tieneTarjeta = true; var huellaValida = true; var esDirector = false;',
        goal: '<p>Completa los dos <code>___</code> con los operadores lógicos correctos.</p>',
        starter: '// Abre si (tiene tarjeta Y huella válida) O si es director/a\nif ((tieneTarjeta ___ huellaValida) ___ esDirector) {\n  abrirPuerta();\n} else {\n  mostrarAlerta("Acceso denegado");\n}\n',
        tests: [
          { label: 'Tarjeta + huella → abre', check: function (t) { return t.world.door === 'abierta' || 'Con tarjeta y huella debería abrirse.'; } },
          { label: 'Solo tarjeta → no abre', setup: 'huellaValida = false;', check: function (t) { return t.world.door === 'cerrada' || 'Solo con tarjeta no debería abrirse.'; } },
          { label: 'Director/a sin tarjeta → abre', setup: 'tieneTarjeta = false; huellaValida = false; esDirector = true;', check: function (t) { return t.world.door === 'abierta' || 'Quien dirige debe poder entrar siempre.'; } },
          { label: 'Nada → no abre', setup: 'tieneTarjeta = false; huellaValida = false; esDirector = false;', check: function (t) { return (t.world.door === 'cerrada' && t.world.alerts.length > 0) || 'Sin ningún permiso debe quedar cerrada con alerta.'; } }
        ],
        hints: ['Lee el comentario: aparecen las palabras «Y» y «O».', '«Y» se escribe con dos símbolos iguales; «O» también.', 'Ejemplo distinto: <code>(llueve && sinParaguas) || frio</code>'],
        success: 'La bóveda distingue cada caso a la perfección.'
      },
      prove: {
        activity: 'G',
        title: 'Horario de la biblioteca',
        story: 'La biblioteca robótica abre según el horario y el calendario.',
        scene: { world: 'door', sensors: ['hora', 'esFeriado'], sign: 'BIBLIOTECA', inside: '📚' },
        setup: 'var hora = 10; var esFeriado = false;',
        goal: '<p><code>hora</code> (0 a 23) y <code>esFeriado</code> ya existen. Abre la puerta si <b>no</b> es feriado y la hora está entre 8 y 18 (<b>8 incluida, 18 no</b>). En otro caso, muestra una alerta.</p>',
        starter: '',
        tests: [
          { label: '10 h, día normal → abre', check: function (t) { return t.world.door === 'abierta' || 'A las 10 de un día normal debería abrir.'; } },
          { label: '8 h → abre (incluida)', setup: 'hora = 8;', check: function (t) { return t.world.door === 'abierta' || 'A las 8 debería abrir.'; } },
          { label: '18 h → cerrada (no incluida)', setup: 'hora = 18;', check: function (t) { return (t.world.door === 'cerrada' && t.world.alerts.length > 0) || 'A las 18 ya está cerrada: debe mostrar alerta.'; } },
          { label: '7 h → cerrada', setup: 'hora = 7;', check: function (t) { return t.world.door === 'cerrada' || 'A las 7 aún está cerrada.'; } },
          { label: 'Feriado a las 12 h → cerrada', setup: 'hora = 12; esFeriado = true;', check: function (t) { return (t.world.door === 'cerrada' && t.world.alerts.length > 0) || 'En feriado no abre, aunque sea buena hora.'; } }
        ],
        hints: ['Necesitas tres condiciones unidas: feriado, hora mínima y hora máxima.', '«No es feriado» usa <code>!</code>. «8 incluida» → <code>&gt;=</code>; «18 no» → <code>&lt;</code>.', 'Todas deben cumplirse a la vez: ¿qué operador las une?'],
        success: 'La biblioteca respeta el horario. ¡Combinas condiciones con precisión!'
      }
    },

    /* ------------------------------ 2.5 ------------------------------ */
    {
      title: 'Sistema de seguridad',
      story: 'El centro de control necesita un sistema de seguridad completo: contraseñas, intentos y permisos.',
      scene: { world: 'door', sensors: ['codigo', 'intentos'], sign: 'CONTROL', inside: '🛰️' },
      setup: 'var codigo = 1234; var intentos = 0; var alarmaActiva = false;',
      learn: {
        what: '<p>Las condicionales pueden <b>anidarse</b>: un <code>if</code> dentro de otro. Así se construyen sistemas con varias reglas.</p>',
        why: '<p>Los sistemas reales tienen prioridades: primero lo más grave (una alarma), luego lo demás.</p>',
        when: '<p>Cuando una decisión solo tiene sentido después de otra.</p>',
        how: 'if (alarmaActiva) {\n  activarAlarma();\n} else {\n  if (codigo === 1234) {\n    abrirPuerta();\n  } else {\n    mostrarAlerta("Código incorrecto");\n  }\n}',
        mistakes: ['Usar <code>=</code> en una condición: asigna y casi siempre "se cumple".', 'Un <code>;</code> justo después de <code>if (…)</code>.', 'Perder la cuenta de las llaves: indenta para ver qué está dentro de qué.'],
        analogy: 'La indentación es como las sangrías de un índice: muestra qué está dentro de qué.'
      },
      observe: {
        code: 'if (alarmaActiva) {\n  activarAlarma();\n} else {\n  if (codigo === 1234) {\n    abrirPuerta();\n  } else {\n    mostrarAlerta("Código incorrecto");\n  }\n}',
        steps: [
          { lines: [1, 1], run: false, text: 'Primero lo más importante: ¿la alarma está activa? No.' },
          { lines: [3, 4], run: false, text: 'Dentro del else hay otra decisión: ¿el código es 1234? Sí.' },
          { lines: [5, 9], upTo: 9, text: 'Se abre la puerta. Observa la indentación: cada nivel está más a la derecha.' }
        ],
        result: '<p>Las decisiones anidadas permiten establecer prioridades.</p>'
      },
      experiment: {
        code: 'if (alarmaActiva) {\n  activarAlarma();\n} else {\n  if (codigo === 1234) {\n    abrirPuerta();\n  } else {\n    mostrarAlerta("Código incorrecto");\n  }\n}\n',
        controls: [{ var: 'codigo', type: 'select', options: [1234, 1111, 9999], value: 1234 }, { var: 'alarmaActiva', type: 'bool', value: false }],
        ideas: ['Elige un código incorrecto y observa la alerta.', 'Activa la alarma: ¿importa el código en ese caso? ¿Por qué?', 'Cambia el código secreto del programa por otro número.']
      },
      solve: {
        activity: 'B',
        title: 'Saboteo en el teclado',
        story: 'Un saboteador alteró el sistema: ahora la puerta se abre con cualquier código.',
        setup: 'var codigo = 1234; var intentos = 0;',
        goal: '<p>Reglas correctas: si el código es <b>4321</b> → abrir. Si no, y hay <b>3 o más intentos</b> → activar la alarma. En cualquier otro caso → alerta «Código incorrecto». Corrige los errores.</p>',
        starter: 'if (codigo = 4321) {\n  abrirPuerta();\n} else if (intentos >= 3); {\n  activarAlarma();\n} else {\n  mostrarAlerta("Código incorrecto");\n}\n',
        tests: [
          { label: 'Código 4321 → abre', setup: 'codigo = 4321;', check: function (t) { return (t.world.door === 'abierta' && !t.world.alarm) || 'Con 4321 debería abrirse.'; } },
          { label: 'Código 1234 con 0 intentos → alerta, sin abrir', check: function (t) { if (t.world.door === 'abierta') return 'Con un código incorrecto la puerta NO debe abrirse.'; return (t.world.alerts.length > 0 && !t.world.alarm) || 'Debería mostrar la alerta (sin alarma).'; } },
          { label: 'Código incorrecto con 3 intentos → alarma', setup: 'intentos = 3;', check: function (t) { return (t.world.alarm && t.world.door === 'cerrada') || 'Con 3 intentos fallidos debe activarse la alarma.'; } },
          { label: 'El código no cambia (se compara, no se asigna)', check: function (t) { return t.get('codigo') === 1234 || 'La variable codigo cambió a ' + t.show(t.get('codigo')) + ': estás asignando en lugar de comparar.'; } }
        ],
        hints: ['Hay dos errores típicos de condicionales.', 'Uno está en la primera condición (¿asignar o comparar?) y otro justo después de la segunda.', 'Revisa los consejos 💡 que aparecen en la consola al ejecutar.'],
        success: 'Saboteo neutralizado. Conoces los dos errores más traicioneros de los if.'
      },
      prove: {
        activity: 'G',
        title: 'Seguridad del centro de control',
        story: 'Diseña la lógica completa del acceso al centro de control.',
        scene: { world: 'door', sensors: ['esAdmin', 'codigo', 'intentos'], sign: 'CONTROL', inside: '🛰️' },
        setup: 'var esAdmin = false; var codigo = 2468; var intentos = 1;',
        goal: '<p>Las variables <code>esAdmin</code>, <code>codigo</code> e <code>intentos</code> ya existen. Reglas, por prioridad:</p><ol><li>Si es administrador/a → abrir.</li><li>Si no, si el código es <b>2468</b> y hay <b>menos de 3</b> intentos → abrir.</li><li>Si no, si hay <b>3 o más</b> intentos → activar alarma.</li><li>En cualquier otro caso → mostrar alerta.</li></ol>',
        starter: '',
        tests: [
          { label: 'Código correcto con 1 intento → abre', check: function (t) { return (t.world.door === 'abierta' && !t.world.alarm) || 'Debería abrir.'; } },
          { label: 'Administrador/a con código erróneo y 5 intentos → abre', setup: 'esAdmin = true; codigo = 0; intentos = 5;', check: function (t) { return (t.world.door === 'abierta' && !t.world.alarm) || 'Quien administra siempre puede entrar.'; } },
          { label: 'Código correcto pero 3 intentos → alarma', setup: 'intentos = 3;', check: function (t) { return (t.world.alarm && t.world.door === 'cerrada') || 'Con 3 intentos se bloquea aunque el código sea correcto.'; } },
          { label: 'Código erróneo con 2 intentos → alerta', setup: 'codigo = 1111; intentos = 2;', check: function (t) { return (t.world.alerts.length > 0 && !t.world.alarm && t.world.door === 'cerrada') || 'Debería mostrarse solo una alerta.'; } },
          { label: 'Código erróneo con 4 intentos → alarma', setup: 'codigo = 1111; intentos = 4;', check: function (t) { return (t.world.alarm && t.world.door === 'cerrada') || 'Debería activarse la alarma.'; } }
        ],
        hints: ['Traduce cada regla a una rama de una cadena if / else if / else.', 'La regla 2 tiene dos condiciones que se cumplen a la vez.', 'El orden de las ramas es el orden de prioridad de las reglas.'],
        success: '¡El Barrio de las Puertas está completamente reparado!'
      }
    }
  ],

  special: {
    title: 'Clasificador de energía',
    scene: { world: 'terminal', title: 'CLASIFICADOR DE ENERGÍA' },
    solve: {
      activity: 'G',
      title: 'Clasificador de energía',
      story: 'Cada distrito informa su nivel de energía (0 a 100).',
      setup: 'var nivel = 15;',
      goal: '<p><code>nivel</code> ya existe. Muestra en la consola: <b>crítico</b> si es menor que 20; <b>bajo</b> si es menor que 50; <b>normal</b> si es menor que 80; y <b>alto</b> en otro caso.</p>',
      starter: '',
      tests: [
        { label: '15 → crítico', check: function (t) { return t.logHas('crítico') || 'Con 15 debería mostrar «crítico».'; } },
        { label: '20 → bajo', setup: 'nivel = 20;', check: function (t) { return (t.logHas('bajo') && t.logs.length === 1) || 'Con 20 debería mostrar solo «bajo».'; } },
        { label: '79 → normal', setup: 'nivel = 79;', check: function (t) { return (t.logHas('normal') && t.logs.length === 1) || 'Con 79 debería mostrar solo «normal».'; } },
        { label: '80 → alto', setup: 'nivel = 80;', check: function (t) { return (t.logHas('alto') && t.logs.length === 1) || 'Con 80 debería mostrar solo «alto».'; } }
      ],
      hints: ['Cuatro categorías → if, dos else if y un else.', 'Empieza por el rango más bajo y sube.', 'Muestra un único mensaje por caso.'],
      success: 'Clasificador listo.'
    }
  }
});
