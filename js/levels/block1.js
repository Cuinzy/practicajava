/* =====================================================================
   BLOQUE 1 · Planta de Energía — Variables y operadores
   Mundo principal: memoria (variables como cajas) + generador
   ===================================================================== */
CQ.Levels.register({
  n: 1,
  name: 'Planta de Energía',
  topic: 'Variables (let, const), tipos de datos y operadores aritméticos, de comparación y lógicos',
  icon: '⚡',
  color: '#fbbf24',
  intro: 'La planta que alimenta Neópolis está fuera de control: nadie sabe cuánta energía hay ni cuánta se necesita. Aprende a <b>guardar datos en variables</b> y a <b>calcular</b> con ellos.',
  concepts: ['let y const', 'var (y por qué evitarla)', 'Declarar e inicializar', 'Números, textos y booleanos', '+ - * / %', 'Comparaciones', '&& || !', 'Actualizar valores'],
  levels: [
    /* ------------------------------ 1.1 ------------------------------ */
    {
      title: 'Generador en marcha',
      story: 'El generador principal necesita saber cuánta energía tiene. Para recordarlo, el programa usará una <b>variable</b>.',
      scene: { world: 'memory', title: 'Planta de energía · memoria', watch: ['energia'], gauge: { var: 'energia', max: 100, goal: 80, label: 'Generador' } },
      learn: {
        what: '<p>Una <b>variable</b> es un espacio con <b>nombre</b> donde el programa guarda un dato para usarlo después.</p>',
        why: '<p>Sin variables el programa no podría recordar nada: ni la energía, ni tu nombre, ni los puntos de un juego.</p>',
        when: '<p>Cada vez que necesites guardar un dato que vas a usar o modificar más adelante.</p>',
        how: 'let energia = 50;      // declarar e inicializar\nlet nombre = "Pixel";  // un texto\nlet activo = true;     // un booleano (true / false)\nconst MAXIMO = 100;    // una constante: no cambiará',
        howNote: '<p><b>Declarar</b> es crear la variable (<code>let energia</code>). <b>Inicializar</b> es darle su primer valor (<code>= 50</code>). Usa <code>let</code> si el valor cambiará y <code>const</code> si no. La palabra <code>var</code> es la forma antigua: funciona, pero tiene reglas confusas, así que en este juego usaremos <code>let</code> y <code>const</code>.</p>',
        symbols: [
          ['let', 'Crea una variable cuyo valor puede cambiar.'],
          ['const', 'Crea una constante: su valor no se puede reasignar.'],
          ['=', '<b>Asignar</b>: guarda el valor de la derecha en la variable de la izquierda. ¡No significa "igual" como en matemáticas!'],
          ['true / false', 'Valores <b>booleanos</b>: verdadero o falso.']
        ],
        mistakes: [
          'Usar una variable antes de declararla.',
          'Nombres con espacios o que empiezan con número: <code>let 2energia</code> ❌, <code>let mi energia</code> ❌. Usa <code>miEnergia</code>.',
          'Escribir <code>energia</code> y luego <code>Energia</code>: son variables distintas.',
          'Poner un número entre comillas: <code>"80"</code> es un texto, no un número.'
        ],
        analogy: 'Una variable es una <b>caja con etiqueta</b>. La etiqueta es el nombre (<code>energia</code>) y dentro guardas un valor (50). Puedes abrir la caja para leer el valor o cambiar su contenido.'
      },
      observe: {
        code: 'let energia = 50;\nenergia = energia + 20;\nconsole.log(energia);',
        steps: [
          { lines: [1, 1], text: '<code>let energia = 50;</code> crea una caja llamada <b>energia</b> y guarda dentro el número 50. Mira la caja y el generador.' },
          { lines: [2, 2], text: 'Se lee de derecha a izquierda: toma el valor actual (50), le suma 20 y guarda el resultado (70) en la misma caja. El valor anterior se reemplaza.' },
          { lines: [3, 3], text: '<code>console.log(energia)</code> muestra el <b>valor</b> de la variable (70), no la palabra "energia", porque no lleva comillas.' }
        ],
        result: '<p>La caja <code>energia</code> pasó de 50 a 70. Una variable puede cambiar su contenido tantas veces como necesites.</p>'
      },
      experiment: {
        code: 'let energia = 50;\nenergia = energia + 20;\nconsole.log(energia);\n',
        scene: { world: 'memory', title: 'Laboratorio de variables', watch: 'auto', gauge: { var: 'energia', max: 100, goal: 80, label: 'Generador' } },
        ideas: [
          'Cambia el 50 inicial por 10 y ejecuta.',
          'Cambia <code>+ 20</code> por <code>- 20</code>.',
          'Crea otra variable, por ejemplo <code>let nombre = "Planta Norte";</code>: aparecerá una nueva caja.',
          '¿Qué pasa si pones <code>energia</code> entre comillas en el console.log?'
        ]
      },
      solve: {
        activity: 'D',
        title: 'Configura el generador',
        story: 'El generador se estabiliza con exactamente 80 unidades de energía.',
        goal: '<p>Declara una variable llamada <code>energia</code> que guarde el número <b>80</b>. Observa cómo responde el generador.</p>',
        starter: '// Declara aquí la variable energia\n',
        requires: [[/\b(let|const|var)\s+energia\b/, 'Declara la variable con `let` (o `const`)']],
        tests: [
          { label: 'Existe una variable llamada `energia`', check: function (t) { return t.has('energia') || 'No encuentro la variable energia. Revisa que el nombre esté escrito exactamente así, en minúsculas y sin tilde.'; } },
          { label: '`energia` guarda el número 80', check: function (t) { var v = t.get('energia'); if (v === '80') return 'energia guarda el TEXTO "80" (con comillas). El generador necesita un número: quita las comillas.'; return v === 80 || 'energia vale ' + t.show(v) + ', pero el generador necesita 80.'; } }
        ],
        hints: [
          'Para crear una variable se usa la palabra <code>let</code>.',
          'La estructura es: palabra clave, nombre, signo igual, valor y punto y coma.',
          'Ejemplo con otro dato: <code>let velocidad = 30;</code>'
        ],
        success: '¡El generador brilla en verde! Creaste tu primera variable.'
      },
      prove: {
        activity: 'G',
        title: 'Panel del generador',
        story: 'El panel de control necesita tres datos sobre el nuevo generador.',
        scene: { world: 'memory', title: 'Panel del generador', watch: ['modelo', 'potencia', 'activo'] },
        goal: '<p>Crea tres variables:</p><ul><li><code>modelo</code>: un <b>texto</b> con el nombre que quieras para el generador.</li><li><code>potencia</code>: un <b>número</b> mayor que 100.</li><li><code>activo</code>: el valor booleano <b>true</b>.</li></ul>',
        starter: '',
        tests: [
          { label: '`modelo` es un texto (no vacío)', check: function (t) { if (!t.has('modelo')) return 'No existe la variable modelo.'; var v = t.get('modelo'); return (typeof v === 'string' && v.trim().length > 0) || 'modelo debe guardar un texto entre comillas; ahora es ' + t.show(v) + '.'; } },
          { label: '`potencia` es un número mayor que 100', check: function (t) { if (!t.has('potencia')) return 'No existe la variable potencia.'; var v = t.get('potencia'); if (typeof v !== 'number') return 'potencia debe ser un número (sin comillas); ahora es ' + t.show(v) + '.'; return v > 100 || 'potencia vale ' + v + ': debe ser mayor que 100.'; } },
          { label: '`activo` vale `true`', check: function (t) { if (!t.has('activo')) return 'No existe la variable activo.'; var v = t.get('activo'); if (v === 'true') return 'activo guarda el texto "true". Los booleanos se escriben sin comillas.'; return v === true || 'activo vale ' + t.show(v) + ', debería ser true.'; } }
        ],
        hints: [
          'Necesitas tres declaraciones, una por línea.',
          'Cada tipo de dato se escribe distinto: texto con comillas, número y booleano sin comillas.',
          'Ejemplo distinto: <code>let ciudad = "Neópolis";</code>, <code>let pisos = 12;</code>, <code>let abierto = false;</code>'
        ],
        success: 'El panel muestra los tres datos. Ya distingues textos, números y booleanos.'
      }
    },

    /* ------------------------------ 1.2 ------------------------------ */
    {
      title: 'Recursos de la máquina',
      story: 'La fábrica de paneles solares necesita calcular cuántos recursos usar. ¡Las variables también sirven para hacer cuentas!',
      scene: { world: 'memory', title: 'Calculadora de recursos', watch: 'auto' },
      learn: {
        what: '<p>Los <b>operadores aritméticos</b> permiten calcular con números y con variables que guardan números.</p>',
        why: '<p>Casi todos los programas calculan algo: totales, promedios, distancias, puntajes…</p>',
        when: '<p>Cuando un valor depende de otros: total = cantidad × precio.</p>',
        how: 'let cajas = 3;\nlet porCaja = 12;\nlet total = cajas * porCaja;   // 36\nlet mitad = total / 2;         // 18\nlet resto = 10 % 3;            // 1 (lo que sobra de 10 ÷ 3)',
        symbols: [
          ['+  -', 'Suma y resta.'],
          ['*', 'Multiplicación (no se usa la x).'],
          ['/', 'División.'],
          ['%', 'Resto (o módulo): lo que sobra de una división entera. 10 % 3 → 1.'],
          ['( )', 'Agrupan: lo que está entre paréntesis se calcula primero.']
        ],
        mistakes: [
          'Olvidar el orden de las operaciones: <code>2 + 3 * 4</code> da 14, no 20. Multiplicación y división van primero.',
          'Escribir el resultado a mano en vez de calcularlo con las variables.',
          'Usar <code>x</code> para multiplicar.'
        ],
        analogy: 'Las variables en una cuenta son como los ingredientes de una receta: si cambias la cantidad de harina, el resultado cambia solo, sin reescribir la receta.'
      },
      observe: {
        code: 'let paneles = 4;\nlet energiaPorPanel = 25;\nlet total = paneles * energiaPorPanel;\nlet conReserva = total + 10;\nconsole.log(total, conReserva);',
        steps: [
          { lines: [1, 2], text: 'Dos variables con los datos del problema.' },
          { lines: [3, 3], text: 'JavaScript reemplaza cada variable por su valor (4 * 25) y guarda el resultado, 100, en <code>total</code>.' },
          { lines: [4, 4], text: 'Una variable puede calcularse a partir de otra: 100 + 10 = 110.' },
          { lines: [5, 5], text: 'Se muestran ambos valores.' }
        ],
        result: '<p>Si cambiaras <code>paneles</code> a 6, todo lo demás se recalcularía automáticamente: ese es el poder de calcular con variables.</p>'
      },
      experiment: {
        code: 'let a = 2 + 3 * 4;\nlet b = (2 + 3) * 4;\nlet resto = 17 % 5;\nconsole.log(a, b, resto);\n',
        ideas: [
          '¿Por qué <code>a</code> y <code>b</code> son distintos? Cambia los paréntesis de lugar.',
          'Prueba <code>%</code> con otros números: <code>20 % 6</code>, <code>9 % 3</code>.',
          'Divide entre cero: <code>console.log(5 / 0)</code>. ¿Qué devuelve JavaScript?'
        ]
      },
      solve: {
        activity: 'A',
        title: 'Cuenta los tornillos',
        story: 'La máquina ensambladora necesita saber cuántos tornillos hay en total.',
        goal: '<p>Completa el espacio <code>___</code> para que <code>totalTornillos</code> se <b>calcule</b> a partir de las variables <code>cajas</code> y <code>tornillosPorCaja</code>.</p>',
        starter: 'let cajas = 6;\nlet tornillosPorCaja = 12;\n// Calcula el total multiplicando las variables\nlet totalTornillos = ___;\nconsole.log(totalTornillos);\n',
        requires: [[/totalTornillos\s*=[^;\n]*(cajas[^;\n]*\*[^;\n]*tornillosPorCaja|tornillosPorCaja[^;\n]*\*[^;\n]*cajas)/, 'Calcula con `cajas * tornillosPorCaja`']],
        forbids: [[/totalTornillos\s*=\s*72\b/, 'No escribas el resultado (72) a mano']],
        tests: [
          { label: '`totalTornillos` vale 72', check: function (t) { return t.get('totalTornillos') === 72 || 'totalTornillos vale ' + t.show(t.get('totalTornillos')) + '.'; } }
        ],
        hints: ['¿Qué operador multiplica en JavaScript?', 'Usa los <b>nombres</b> de las variables, no sus valores.', 'Ejemplo distinto: <code>let area = ancho * alto;</code>'],
        success: '72 tornillos listos. Si cambias la cantidad de cajas, el total se recalcula solo.'
      },
      prove: {
        activity: 'G',
        title: 'Energía necesaria',
        story: 'Los sensores de la máquina miden su consumo por hora, las horas de trabajo y una reserva de seguridad. Los valores cambian cada día.',
        scene: { world: 'memory', title: 'Sensores de la máquina', sensors: ['consumo', 'horas', 'reserva'], watch: ['energiaNecesaria'], gauge: { var: 'energiaNecesaria', max: 300, label: 'Energía necesaria' } },
        setup: 'var consumo = 35; var horas = 4; var reserva = 20;',
        goal: '<p>Las variables <code>consumo</code>, <code>horas</code> y <code>reserva</code> <b>ya existen</b> (las llenan los sensores).</p><p>Crea la variable <code>energiaNecesaria</code> = consumo por hora multiplicado por las horas, más la reserva. Tu cálculo debe funcionar con <b>cualquier</b> valor de los sensores.</p>',
        starter: '// consumo, horas y reserva ya existen. No las vuelvas a declarar.\n',
        forbids: [[/\b(let|const|var)\s+(consumo|horas|reserva)\b/, 'No redeclares `consumo`, `horas` ni `reserva` (ya existen)']],
        tests: [
          { label: 'Con consumo 35, 4 horas y reserva 20 → 160', check: function (t) { if (!t.has('energiaNecesaria')) return 'No existe la variable energiaNecesaria.'; return t.get('energiaNecesaria') === 160 || 'Se esperaba 160 y se obtuvo ' + t.show(t.get('energiaNecesaria')) + '.'; } },
          { label: 'Con consumo 10, 3 horas y reserva 5 → 35', setup: 'consumo = 10; horas = 3; reserva = 5;', check: function (t) { return t.get('energiaNecesaria') === 35 || 'Con otros valores de los sensores se esperaba 35 y se obtuvo ' + t.show(t.get('energiaNecesaria')) + '. ¿Escribiste números a mano en lugar de usar las variables?'; } },
          { label: 'Con consumo 0, 8 horas y reserva 12 → 12', setup: 'consumo = 0; horas = 8; reserva = 12;', check: function (t) { return t.get('energiaNecesaria') === 12 || 'Se esperaba 12 y se obtuvo ' + t.show(t.get('energiaNecesaria')) + '.'; } }
        ],
        hints: [
          'Primero escribe el cálculo en palabras: consumo por horas, más reserva.',
          'Recuerda el orden de las operaciones: la multiplicación se hace antes que la suma.',
          'Ejemplo distinto: <code>let pago = precio * cantidad + envio;</code>'
        ],
        success: 'Tu cálculo funciona con cualquier lectura de los sensores. ¡Eso es programar con variables!'
      }
    },

    /* ------------------------------ 1.3 ------------------------------ */
    {
      title: 'El estado de Pixel',
      story: 'Pixel tiene variables que describen su estado: nombre, batería y si está encendido. Al trabajar, esos valores <b>cambian</b>.',
      scene: { world: 'memory', title: 'Estado de Pixel', watch: ['nombre', 'bateria', 'encendido'], robot: { name: 'nombre', battery: 'bateria', on: 'encendido' } },
      learn: {
        what: '<p><b>Reasignar</b> es cambiar el valor de una variable que ya existe. Solo se puede con variables creadas con <code>let</code>; las de <code>const</code> no cambian.</p>',
        why: '<p>El mundo cambia: la batería baja, los puntos suben, un interruptor se enciende. Las variables reflejan esos cambios.</p>',
        when: '<p>Cada vez que un dato se actualiza. Si un dato nunca debe cambiar (un nombre fijo, un máximo), usa <code>const</code> para protegerlo.</p>',
        how: 'let bateria = 40;\nbateria = bateria + 30;  // 70\nbateria += 10;           // atajo: 80\nbateria -= 5;            // 75\nbateria++;               // suma 1: 76\nbateria--;               // resta 1: 75',
        symbols: [
          ['+=', '<code>x += 5</code> es lo mismo que <code>x = x + 5</code>.'],
          ['-=', '<code>x -= 5</code> es lo mismo que <code>x = x - 5</code>.'],
          ['++', 'Suma 1 a la variable.'],
          ['--', 'Resta 1 a la variable.']
        ],
        mistakes: [
          'Volver a escribir <code>let</code> al cambiar el valor: <code>let bateria = 80;</code> por segunda vez da error. Solo escribe <code>bateria = 80;</code>',
          'Intentar cambiar una variable <code>const</code>.',
          'Escribir <code>bateria + 10;</code> sin asignar: calcula, pero no guarda el resultado.'
        ],
        analogy: '<code>let</code> es una caja con tapa: puedes abrirla y cambiar su contenido. <code>const</code> es una caja sellada 🔒: puedes mirar dentro, pero no cambiar lo que tiene.'
      },
      observe: {
        code: 'const nombre = "Pixel";\nlet bateria = 40;\nlet encendido = false;\nbateria = bateria + 30;\nbateria += 10;\nbateria--;\nencendido = true;\nconsole.log(nombre, bateria, encendido);',
        steps: [
          { lines: [1, 1], text: '<code>nombre</code> es una constante (verás un candado 🔒): el nombre de Pixel no cambiará.' },
          { lines: [2, 3], text: 'La batería empieza en 40 y Pixel está apagado.' },
          { lines: [4, 4], text: 'Reasignación: 40 + 30 = 70.' },
          { lines: [5, 5], text: 'El atajo <code>+=</code> suma 10: ahora 80.' },
          { lines: [6, 6], text: '<code>--</code> resta 1: 79.' },
          { lines: [7, 8], text: 'Cambiamos el booleano a <code>true</code>: ¡Pixel se enciende!' }
        ],
        result: '<p>Las variables con <code>let</code> cambiaron varias veces; la constante <code>nombre</code> se mantuvo. El robot refleja su estado final.</p>'
      },
      experiment: {
        code: 'const nombre = "Pixel";\nlet bateria = 40;\nlet encendido = false;\n\nbateria += 25;\nencendido = true;\n',
        ideas: [
          'Escribe <code>nombre = "Bit";</code> y lee el error.',
          'Haz que la batería termine en 100 usando <code>+=</code>.',
          'Cambia <code>encendido</code> a <code>false</code>: ¿cómo se ve el robot?',
          'Escribe dos veces <code>let bateria</code> y observa el mensaje.'
        ]
      },
      solve: {
        activity: 'B',
        title: 'Batería bloqueada',
        story: 'Alguien programó la batería de Pixel como constante y ahora no puede recargarse.',
        goal: '<p>Corrige el código para que la batería termine en <b>70</b> y Pixel quede <b>encendido</b>.</p>',
        starter: 'const nombre = "Pixel";\nconst bateria = 20;\nbateria = bateria + 50;\nlet encendido = false;\nencendido = true;\nconsole.log("Batería:", bateria);\n',
        tests: [
          { label: '`bateria` termina valiendo 70', check: function (t) { return t.get('bateria') === 70 || 'bateria vale ' + t.show(t.get('bateria')) + '.'; } },
          { label: '`bateria` puede cambiar (no es constante)', check: function (t) { return !t.isConst('bateria') || 'bateria sigue siendo const.'; } },
          { label: 'Pixel queda encendido', check: function (t) { return t.get('encendido') === true || 'encendido debería ser true.'; } }
        ],
        hints: ['Ejecuta y lee el error: ¿qué línea falla y por qué?', '¿Qué palabra permite que una variable cambie?', 'Compara: <code>const x = 1; x = 2;</code> ❌ vs <code>let x = 1; x = 2;</code> ✔'],
        success: 'Pixel se recarga. Sabes cuándo usar let y cuándo const.'
      },
      prove: {
        activity: 'D',
        title: 'Un día de trabajo',
        story: 'Pixel empieza el día con la batería llena. Programa cómo cambia durante la jornada.',
        goal: '<p>Actualiza <code>bateria</code> <b>usando operadores de actualización</b> (<code>-=</code> y <code>+=</code>), en este orden:</p><ol><li>Camina por la ciudad: gasta 15.</li><li>Carga cajas: gasta 30.</li><li>Un panel solar lo recarga: recupera 10.</li></ol><p>Al final, muestra la batería en la consola.</p>',
        starter: 'const nombre = "Pixel";\nlet encendido = true;\nlet bateria = 100;\n\n// 1. Camina (gasta 15)\n\n// 2. Carga cajas (gasta 30)\n\n// 3. Panel solar (recupera 10)\n\n',
        requires: [[/bateria\s*-=/, 'Usa el operador `-=`'], [/bateria\s*\+=/, 'Usa el operador `+=`']],
        forbids: [[/bateria\s*=\s*65\b/, 'Escribir el resultado a mano']],
        tests: [
          { label: 'La batería termina en 65', check: function (t) { return t.get('bateria') === 65 || 'bateria termina en ' + t.show(t.get('bateria')) + '.'; } },
          { label: 'La consola muestra el valor final (65)', check: function (t) { return t.values.indexOf(65) >= 0 || t.logs.some(function (l) { return /\b65\b/.test(l); }) || 'Muestra la batería con console.log al final.'; } }
        ],
        hints: ['Cada paso es una línea que modifica <code>bateria</code>.', '<code>x -= 3</code> resta 3 a x y guarda el resultado.', 'Ejemplo distinto: <code>puntos += 50;</code> <code>vidas -= 1;</code>'],
        success: 'Jornada completa: 100 → 85 → 55 → 65. ¡Dominas la actualización de variables!'
      }
    },

    /* ------------------------------ 1.4 ------------------------------ */
    {
      title: 'Comparar y combinar',
      story: 'El sistema de seguridad de la planta debe saber si la temperatura es peligrosa. Para eso compara valores y obtiene <b>verdadero</b> o <b>falso</b>.',
      scene: { world: 'memory', title: 'Monitor térmico', watch: 'auto' },
      learn: {
        what: '<p>Los <b>operadores de comparación</b> comparan dos valores y producen un <b>booleano</b>: <code>true</code> o <code>false</code>. Los <b>operadores lógicos</b> combinan booleanos.</p>',
        why: '<p>Son la base de las decisiones: «¿la energía es suficiente?», «¿la clave es correcta Y el usuario está autorizado?».</p>',
        when: '<p>Siempre que necesites hacer una pregunta de sí o no sobre tus datos.</p>',
        how: 'let temp = 72;\nlet caliente = temp > 90;               // false\nlet normal = temp >= 20 && temp <= 80;  // true\nlet alerta = caliente || !normal;       // false',
        symbols: [
          ['> <', 'Mayor que, menor que.'],
          ['>= <=', 'Mayor o igual, menor o igual (el = siempre va a la derecha).'],
          ['===', '¿Son iguales (en valor y tipo)?'],
          ['!==', '¿Son distintos?'],
          ['&&', '«Y»: true solo si <b>ambas</b> partes son true.'],
          ['||', '«O»: true si <b>al menos una</b> parte es true.'],
          ['!', '«NO»: invierte el booleano. <code>!true</code> → false.']
        ],
        mistakes: [
          'Usar <code>=</code> (asignar) cuando quieres comparar (<code>===</code>).',
          'Usar <code>==</code>: compara "flexible" (<code>5 == "5"</code> es true). Prefiere <code>===</code>.',
          'Escribir <code>20 <= temp <= 80</code>: en JavaScript hay que separar: <code>temp >= 20 && temp <= 80</code>.'
        ],
        analogy: '<code>&&</code> es como una puerta con dos cerraduras: necesitas las dos llaves. <code>||</code> es como una casa con dos puertas: basta con abrir una.'
      },
      observe: {
        code: 'let temperatura = 72;\nlet sobrecalentado = temperatura > 90;\nlet enRango = temperatura >= 20 && temperatura <= 80;\nlet alerta = sobrecalentado || !enRango;\nconsole.log(sobrecalentado, enRango, alerta);',
        steps: [
          { lines: [1, 1], text: 'La temperatura actual: 72.' },
          { lines: [2, 2], text: '¿72 > 90? No → <code>false</code>. La variable guarda un booleano.' },
          { lines: [3, 3], text: '¿72 ≥ 20? sí. ¿72 ≤ 80? sí. true && true → <code>true</code>.' },
          { lines: [4, 4], text: '<code>!enRango</code> es false. false || false → <code>false</code>: no hay alerta.' },
          { lines: [5, 5], text: 'Se muestran los tres booleanos.' }
        ],
        result: '<p>Las comparaciones no muestran "sí/no": producen <code>true</code> y <code>false</code>, que pueden guardarse en variables y combinarse.</p>'
      },
      experiment: {
        intro: 'Mueve la temperatura con el control y observa cómo cambian los booleanos.',
        code: 'let sobrecalentado = temperatura > 90;\nlet enRango = temperatura >= 20 && temperatura <= 80;\nlet alerta = sobrecalentado || !enRango;\n',
        scene: { world: 'memory', title: 'Monitor térmico', sensors: ['temperatura'], watch: 'auto' },
        controls: [{ var: 'temperatura', type: 'range', min: -10, max: 120, step: 1, value: 72 }],
        ideas: ['Lleva la temperatura a 95: ¿qué variables cambian?', 'Pon 10 grados: ¿por qué hay alerta si no está sobrecalentado?', 'Cambia <code>&&</code> por <code>||</code> en <code>enRango</code> y analiza.']
      },
      solve: {
        activity: 'C',
        mode: 'predict',
        title: '¿Igual o idéntico?',
        story: 'Dos sensores reportan "10", pero uno lo hace como número y otro como texto.',
        goal: '<p>Predice qué mostrará la consola en las tres líneas.</p>',
        code: 'let a = 10;\nlet b = "10";\nconsole.log(a == b);\nconsole.log(a === b);\nconsole.log(a > 5 && b < 5);',
        options: ['true\ntrue\nfalse', 'true\nfalse\nfalse', 'false\nfalse\ntrue', 'true\nfalse\ntrue'],
        answer: 1,
        explain: '<code>==</code> compara de forma flexible (convierte "10" en 10) → true. <code>===</code> también compara el tipo: número vs texto → false. En la última, <code>a > 5</code> es true pero <code>b < 5</code> es false, y true && false → false.',
        wrongHint: 'Fíjate en la diferencia entre <code>==</code> y <code>===</code>, y recuerda que && necesita que ambas partes sean true.',
        hints: ['Una de las variables es texto y otra número.', '=== exige mismo valor <b>y</b> mismo tipo.', 'Evalúa cada lado del && por separado.'],
        success: '¡Exacto! Ahora entiendes por qué conviene usar === .'
      },
      prove: {
        activity: 'G',
        title: 'Condición segura',
        story: 'El reactor solo es seguro si la temperatura está entre 20 y 80 grados (ambos incluidos) <b>y</b> la presión es menor que 5.',
        scene: { world: 'memory', title: 'Reactor', sensors: ['temperatura', 'presion'], watch: ['seguro'] },
        setup: 'var temperatura = 75; var presion = 3;',
        goal: '<p><code>temperatura</code> y <code>presion</code> ya existen. Crea una variable booleana <code>seguro</code> que sea <code>true</code> solo cuando se cumplan las dos condiciones, y <code>false</code> en cualquier otro caso.</p>',
        starter: '// temperatura y presion ya existen\n',
        forbids: [[/\b(let|const|var)\s+(temperatura|presion)\b/, 'No redeclares `temperatura` ni `presion`']],
        tests: [
          { label: '75 °C y presión 3 → seguro', check: function (t) { if (!t.has('seguro')) return 'No existe la variable seguro.'; return t.get('seguro') === true || 'Con 75 °C y presión 3, seguro debería ser true.'; } },
          { label: '85 °C → no seguro', setup: 'temperatura = 85; presion = 3;', check: function (t) { return t.get('seguro') === false || 'Con 85 °C, seguro debería ser false.'; } },
          { label: 'Presión 6 → no seguro', setup: 'temperatura = 50; presion = 6;', check: function (t) { return t.get('seguro') === false || 'Con presión 6, seguro debería ser false.'; } },
          { label: 'Límites incluidos: 20 °C y 80 °C → seguro', setup: 'temperatura = 20; presion = 4.9;', check: function (t) { return t.get('seguro') === true || 'Con 20 °C (límite incluido) debería ser seguro. ¿Usaste >= ?'; } },
          { label: '80 °C con presión 0 → seguro', setup: 'temperatura = 80; presion = 0;', check: function (t) { return t.get('seguro') === true || 'Con 80 °C (límite incluido) debería ser seguro. ¿Usaste <= ?'; } },
          { label: '19 °C → no seguro', setup: 'temperatura = 19; presion = 1;', check: function (t) { return t.get('seguro') === false || 'Con 19 °C debería ser false.'; } }
        ],
        hints: ['Hay tres comparaciones: temperatura mínima, temperatura máxima y presión.', '«Incluidos» significa usar <code>>=</code> y <code>&lt;=</code>. Todas deben cumplirse a la vez: ¿qué operador lógico une?', 'Ejemplo distinto: <code>let aprobado = nota >= 6 && asistencia > 80;</code>'],
        success: 'Tu condición protege el reactor en todos los casos, incluso en los límites.'
      }
    },

    /* ------------------------------ 1.5 ------------------------------ */
    {
      title: 'Calculadora de la planta',
      story: 'Para cerrar la reparación de la planta, construirás pequeños sistemas de cálculo que funcionen con cualquier dato.',
      scene: { world: 'memory', title: 'Calculadora de la planta', watch: 'auto' },
      learn: {
        what: '<p>Un <b>sistema de cálculo</b> combina variables, operadores y mensajes para resolver un problema completo. Hoy sumamos dos herramientas: <code>Math.floor()</code> (redondear hacia abajo) y las <b>plantillas de texto</b>.</p>',
        why: '<p>Los programas reales reciben datos, calculan y comunican resultados de forma clara.</p>',
        when: '<p>Para repartir cantidades (cuántos caben, cuánto sobra) y para armar mensajes con valores dentro.</p>',
        how: 'let litros = 17;\nlet capacidad = 5;\nlet llenos = Math.floor(litros / capacidad); // 3\nlet sobra = litros % capacidad;              // 2\nconsole.log("Llenos: " + llenos);\nconsole.log(`Sobran ${sobra} litros`);',
        symbols: [
          ['Math.floor(x)', 'Quita los decimales hacia abajo: Math.floor(3.4) → 3.'],
          ['` `', 'Comillas invertidas: crean una <b>plantilla de texto</b>.'],
          ['${ }', 'Dentro de una plantilla, inserta el valor de una variable o cálculo.']
        ],
        mistakes: ['Usar comillas normales con <code>${}</code>: solo funciona con las invertidas <code>`</code>.', 'Olvidar que <code>17 / 5</code> da 3.4 (no 3).', 'Unir texto y número sin espacio: <code>"Total:" + 5</code> → "Total:5".'],
        analogy: 'Una plantilla de texto es como un formulario con huecos: <code>`Hola, ${nombre}`</code> rellena el hueco con el valor actual.'
      },
      observe: {
        code: 'let litros = 17;\nlet capacidad = 5;\nlet bidonesLlenos = Math.floor(litros / capacidad);\nlet sobrante = litros % capacidad;\nconsole.log("Bidones llenos: " + bidonesLlenos);\nconsole.log(`Sobran ${sobrante} litros`);',
        steps: [
          { lines: [1, 2], text: 'Datos: 17 litros y bidones de 5.' },
          { lines: [3, 3], text: '17 / 5 = 3.4 → <code>Math.floor</code> lo baja a 3 bidones completos.' },
          { lines: [4, 4], text: '17 % 5 = 2: el resto que no llena otro bidón.' },
          { lines: [5, 5], text: 'Concatenación: el texto se une con el número.' },
          { lines: [6, 6], text: 'Plantilla: el valor de <code>sobrante</code> se inserta en el hueco <code>${}</code>.' }
        ],
        result: '<p>Con <code>Math.floor</code> y <code>%</code> puedes repartir cualquier cantidad. Con plantillas, armar mensajes es más fácil de leer.</p>'
      },
      experiment: {
        code: 'let litros = 17;\nlet capacidad = 5;\nlet llenos = Math.floor(litros / capacidad);\nlet sobra = litros % capacidad;\nconsole.log(`Con ${litros} litros se llenan ${llenos} bidones y sobran ${sobra}`);\n',
        ideas: ['Cambia los litros a 20: ¿cuánto sobra?', 'Quita <code>Math.floor</code> y observa el resultado.', 'Escribe la última línea usando + en vez de plantilla.']
      },
      solve: {
        activity: 'H',
        title: 'Factura equivocada',
        story: 'La planta emitió una factura absurda. Ejecuta el código, compara el resultado con lo esperado y corrígelo.',
        scene: { world: 'memory', title: 'Facturación', sensors: ['precioKwh', 'consumoDiario', 'dias'], watch: ['costoDiario', 'costoSemanal'] },
        setup: 'var precioKwh = 0.2; var consumoDiario = 30; var dias = 7;',
        goal: '<p>El costo diario es <b>precio por kWh × consumo diario</b>, y el costo total es <b>costo diario × días</b>. Con los datos actuales debe dar 6 por día y 42 en total. Corrige el programa para que funcione con cualquier valor de los sensores.</p>',
        starter: '// Calcula cuánto cuesta la energía del período\nlet costoDiario = precioKwh + consumoDiario;\nlet costoSemanal = costoDiario * dia;\nconsole.log("Costo total: " + costoSemanal);\n',
        tests: [
          { label: 'Con los datos actuales: 6 por día y 42 en total', check: function (t) { if (!t.near(t.get('costoDiario'), 6)) return 'costoDiario vale ' + t.show(t.get('costoDiario')) + ' y debería valer 6.'; return t.near(t.get('costoSemanal'), 42) || 'costoSemanal vale ' + t.show(t.get('costoSemanal')) + ' y debería valer 42.'; } },
          { label: 'Funciona con otros datos (0.5 × 10 × 2 días = 10)', setup: 'precioKwh = 0.5; consumoDiario = 10; dias = 2;', check: function (t) { return t.near(t.get('costoSemanal'), 10) || 'Con otros datos se esperaba 10 y se obtuvo ' + t.show(t.get('costoSemanal')) + '.'; } },
          { label: 'Muestra el costo total en la consola', check: function (t) { return t.logs.some(function (l) { return /42/.test(l); }) || 'La consola debería mostrar el costo total (42).'; } }
        ],
        hints: ['Hay dos errores: uno de operador y uno de nombre.', 'Lee el error de la consola: ¿qué variable no existe? Compara con las variables de los sensores.', '"Precio por cantidad" se calcula multiplicando, no sumando.'],
        success: 'Factura corregida: 6 diarios, 42 en total. Depuraste un sistema de cálculo.'
      },
      prove: {
        activity: 'G',
        title: 'Reparto de baterías',
        story: 'La planta debe repartir la energía disponible en baterías de capacidad fija.',
        scene: { world: 'memory', title: 'Reparto de baterías', sensors: ['energia', 'capacidadBateria'], watch: ['bateriasLlenas', 'sobrante'] },
        setup: 'var energia = 47; var capacidadBateria = 10;',
        goal: '<p><code>energia</code> y <code>capacidadBateria</code> ya existen. Crea:</p><ul><li><code>bateriasLlenas</code>: cuántas baterías se llenan <b>completas</b>.</li><li><code>sobrante</code>: cuánta energía queda sin usar.</li><li>Un mensaje en la consola que incluya ambos números.</li></ul>',
        starter: '',
        forbids: [[/\b(let|const|var)\s+(energia|capacidadBateria)\b/, 'No redeclares `energia` ni `capacidadBateria`']],
        tests: [
          { label: '47 de energía, capacidad 10 → 4 llenas, sobran 7', check: function (t) { if (!t.has('bateriasLlenas') || !t.has('sobrante')) return 'Faltan las variables bateriasLlenas y/o sobrante.'; return (t.get('bateriasLlenas') === 4 && t.get('sobrante') === 7) || 'Se esperaba 4 y 7; se obtuvo ' + t.show(t.get('bateriasLlenas')) + ' y ' + t.show(t.get('sobrante')) + '.'; } },
          { label: '30 de energía, capacidad 6 → 5 llenas, sobran 0', setup: 'energia = 30; capacidadBateria = 6;', check: function (t) { return (t.get('bateriasLlenas') === 5 && t.get('sobrante') === 0) || 'Se esperaba 5 y 0; se obtuvo ' + t.show(t.get('bateriasLlenas')) + ' y ' + t.show(t.get('sobrante')) + '.'; } },
          { label: '9 de energía, capacidad 4 → 2 llenas, sobra 1', setup: 'energia = 9; capacidadBateria = 4;', check: function (t) { return (t.get('bateriasLlenas') === 2 && t.get('sobrante') === 1) || 'Se esperaba 2 y 1; se obtuvo ' + t.show(t.get('bateriasLlenas')) + ' y ' + t.show(t.get('sobrante')) + '.'; } },
          { label: 'El mensaje incluye ambos resultados', check: function (t) { var a = String(t.get('bateriasLlenas')), b = String(t.get('sobrante')); return t.logs.some(function (l) { return l.indexOf(a) >= 0 && l.indexOf(b) >= 0; }) || 'Muestra un mensaje que contenga los dos números.'; } }
        ],
        hints: ['Es el mismo problema que el de los bidones, con otros nombres.', 'Una división da decimales: necesitas quitarlos. El resto se obtiene con otro operador.', 'Repasa la fase Observa: <code>Math.floor</code> y <code>%</code>.'],
        success: '¡La Planta de Energía funciona de nuevo! Neópolis tiene electricidad.'
      }
    }
  ],

  special: {
    title: 'Conversor térmico',
    scene: { world: 'memory', title: 'Conversor', sensors: ['celsius'], watch: ['fahrenheit'] },
    solve: {
      activity: 'G',
      title: 'Conversor térmico',
      story: 'Los visitantes de otra ciudad usan grados Fahrenheit.',
      setup: 'var celsius = 25;',
      goal: '<p>La variable <code>celsius</code> ya existe. Crea <code>fahrenheit</code> con la fórmula <b>F = C × 9 / 5 + 32</b>.</p>',
      starter: '',
      tests: [
        { label: '25 °C → 77 °F', check: function (t) { return t.near(t.get('fahrenheit'), 77) || 'Se esperaba 77 y se obtuvo ' + t.show(t.get('fahrenheit')) + '.'; } },
        { label: '100 °C → 212 °F', setup: 'celsius = 100;', check: function (t) { return t.near(t.get('fahrenheit'), 212) || 'Se esperaba 212.'; } },
        { label: '-40 °C → -40 °F', setup: 'celsius = -40;', check: function (t) { return t.near(t.get('fahrenheit'), -40) || 'Se esperaba -40.'; } }
      ],
      hints: ['Traduce la fórmula paso a paso a JavaScript.', 'Usa la variable celsius, no un número fijo.', 'El orden de operaciones ya funciona como en la fórmula.'],
      success: 'Conversor listo para los visitantes.'
    }
  }
});
