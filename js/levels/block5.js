/* =====================================================================
   BLOQUE 5 · Almacén Central — Arreglos y objetos
   Mundo principal: memoria (arreglos como casillas, objetos como fichas)
   ===================================================================== */
CQ.Levels.register({
  n: 5,
  name: 'Almacén Central',
  topic: 'Arreglos, índices, push, pop, length, recorridos, objetos y propiedades',
  icon: '📦',
  color: '#fb923c',
  intro: 'El Almacén Central guarda miles de piezas y robots, pero todo está desordenado. Aprende a manejar <b>colecciones</b> de datos con arreglos y a describir cosas con <b>objetos</b>.',
  concepts: ['Arreglos', 'Índices', 'Acceder y modificar', 'push() y pop()', 'length', 'Recorrer arreglos', 'Objetos', 'Propiedades', 'Punto y corchetes'],
  levels: [
    /* ------------------------------ 5.1 ------------------------------ */
    {
      title: 'Inventario de Pixel',
      story: 'Pixel lleva varias herramientas. Guardar cada una en una variable distinta sería un desorden: mejor una <b>lista</b>.',
      scene: { world: 'memory', title: 'Inventario de Pixel', watch: 'auto' },
      learn: {
        what: '<p>Un <b>arreglo</b> (array) es una lista ordenada de valores guardada en una sola variable. Cada valor ocupa una posición numerada llamada <b>índice</b>, que <b>empieza en 0</b>.</p>',
        why: '<p>Permite manejar muchos datos relacionados juntos: inventarios, puntajes, nombres…</p>',
        when: '<p>Cuando tienes varios datos del mismo tipo que forman un grupo.</p>',
        how: 'let inventario = ["llave", "batería", "chip"];\ninventario[0];          // "llave" (primer elemento)\ninventario[2];          // "chip"\ninventario.length;      // 3 (cantidad de elementos)\ninventario[1] = "linterna"; // modificar una posición',
        symbols: [['[ ]', 'Crean un arreglo, y también sirven para acceder a una posición: <code>lista[0]</code>.'], [',', 'Separa los elementos.'], ['.length', 'Cantidad de elementos. El último índice es <code>length - 1</code>.']],
        mistakes: ['Pensar que el primer elemento es <code>lista[1]</code>.', 'Acceder a <code>lista[lista.length]</code>: ¡esa posición no existe!', 'Escribir <code>lenght</code>.'],
        analogy: 'Un arreglo es como una fila de casilleros numerados desde el 0. El número del casillero es el índice; lo que hay dentro es el valor.'
      },
      observe: {
        code: 'let inventario = ["llave", "batería", "chip"];\nconsole.log(inventario[0]);\nconsole.log(inventario.length);\ninventario[1] = "linterna";\nconsole.log(inventario);',
        steps: [
          { lines: [1, 1], text: 'Un arreglo con 3 textos. Mira los casilleros numerados [0], [1], [2].' },
          { lines: [2, 2], text: 'El índice 0 es el <b>primer</b> elemento: "llave".' },
          { lines: [3, 3], text: '<code>length</code> cuenta los elementos: 3.' },
          { lines: [4, 5], text: 'Se reemplaza el casillero [1]. El arreglo sigue teniendo 3 elementos.' }
        ],
        result: '<p>Con un solo nombre (<code>inventario</code>) y un índice puedes leer o cambiar cualquier elemento.</p>'
      },
      experiment: {
        code: 'let inventario = ["llave", "batería", "chip"];\ninventario[1] = "linterna";\nconsole.log(inventario[2]);\n',
        ideas: ['Muestra <code>inventario[3]</code>: ¿qué obtienes?', 'Muestra el último elemento usando <code>inventario.length - 1</code>.', 'Crea un arreglo de números y súmalos.', 'Asigna <code>inventario[5] = "mapa"</code> y mira los casilleros.']
      },
      solve: {
        activity: 'G',
        title: 'Caja de herramientas',
        story: 'Prepara la caja de herramientas para la próxima misión.',
        goal: '<p>Crea un arreglo <code>herramientas</code> con exactamente <b>4 textos</b> (los que quieras). Luego muestra en la consola el <b>primero</b> y el <b>último</b> usando índices.</p>',
        starter: '',
        requires: [[/herramientas\s*\[\s*0\s*\]/, 'Accede al primero con el índice `[0]`'], [/herramientas\s*\[\s*(3|herramientas\s*\.\s*length\s*-\s*1)\s*\]/, 'Accede al último con su índice']],
        tests: [
          { label: '`herramientas` es un arreglo de 4 textos', check: function (t) { if (!t.has('herramientas')) return 'No existe la variable herramientas.'; var a = t.get('herramientas'); if (!Array.isArray(a)) return 'herramientas debe ser un arreglo (usa corchetes).'; if (a.length !== 4) return 'El arreglo tiene ' + a.length + ' elementos, no 4.'; return a.every(function (x) { return typeof x === 'string'; }) || 'Todos los elementos deben ser textos.'; } },
          { label: 'Se muestran el primero y el último', check: function (t) { var a = t.get('herramientas'); return (t.logs.some(function (l) { return l.indexOf(a[0]) >= 0; }) && t.logs.some(function (l) { return l.indexOf(a[3]) >= 0; })) || 'La consola debe mostrar "' + a[0] + '" y "' + a[3] + '".'; } }
        ],
        hints: ['Un arreglo se escribe entre corchetes, con comas entre elementos.', 'El primer índice es 0. Con 4 elementos, ¿cuál es el último índice?', 'Ejemplo distinto: <code>let frutas = ["pera", "uva"]; console.log(frutas[1]);</code>'],
        success: 'Caja lista. Ya manejas índices.'
      },
      prove: {
        activity: 'B',
        title: 'Mochila desordenada',
        story: 'El programa de la mochila de exploración tiene errores de índices y de nombres.',
        goal: '<p>Corrige el programa para que:</p><ul><li>muestre <b>agua</b> (el último elemento),</li><li>reemplace <b>mapa</b> por el texto <b>linterna</b>,</li><li>muestre la cantidad de elementos (3).</li></ul>',
        starter: 'let mochila = ["mapa", "cuerda", "agua"];\nconsole.log(mochila[3]);   // debería mostrar "agua"\nmochila[0] = linterna;     // cambia "mapa" por "linterna"\nconsole.log(mochila.lenght);\n',
        tests: [
          { label: 'La mochila queda ["linterna", "cuerda", "agua"]', check: function (t) { return t.eq(t.get('mochila'), ['linterna', 'cuerda', 'agua']) || 'La mochila quedó: ' + t.show(t.get('mochila')) + '.'; } },
          { label: 'Se muestra "agua"', check: function (t) { return t.logs.indexOf('agua') >= 0 || 'No se muestra "agua". ¿Qué índice tiene el tercer elemento?'; } },
          { label: 'Se muestra la cantidad 3', check: function (t) { return t.values.indexOf(3) >= 0 || 'No se muestra el número 3 (la cantidad de elementos).'; } }
        ],
        hints: ['Hay tres errores: un índice, un texto y una propiedad.', 'Un texto siempre va entre comillas.', 'Si algo muestra undefined, revisa que ese índice o esa propiedad existan (¿cómo se escribe length?).'],
        success: 'Mochila en orden.'
      }
    },

    /* ------------------------------ 5.2 ------------------------------ */
    {
      title: 'Organiza la colección',
      story: 'Al almacén llegan y salen robots constantemente. La lista debe crecer y encogerse.',
      scene: { world: 'memory', title: 'Colección de robots', watch: 'auto' },
      learn: {
        what: '<p>Los arreglos tienen <b>métodos</b>: acciones que puedes pedirles. <code>push()</code> agrega al final y <code>pop()</code> quita el último (y lo devuelve).</p>',
        why: '<p>Las listas reales cambian: tareas que se agregan, mensajes que llegan, elementos que se eliminan.</p>',
        when: '<p>Cuando no sabes de antemano cuántos elementos habrá.</p>',
        how: 'let robots = ["Bit", "Nano"];\nrobots.push("Volt");        // ["Bit", "Nano", "Volt"]\nlet sale = robots.pop();    // sale = "Volt"; robots = ["Bit", "Nano"]\nconsole.log(robots.length); // 2',
        symbols: [['.push(x)', 'Agrega x al final.'], ['.pop()', 'Quita el último elemento y lo devuelve.']],
        mistakes: ['Escribir <code>robots = robots.push("Volt")</code>: push devuelve la nueva longitud, no el arreglo.', 'Olvidar los paréntesis: <code>robots.pop</code>.'],
        analogy: 'Como una pila de platos: <code>push</code> pone uno arriba y <code>pop</code> saca el de arriba.'
      },
      observe: {
        code: 'let robots = ["Bit", "Nano"];\nrobots.push("Volt");\nconsole.log(robots.length);\nlet ultimo = robots.pop();\nconsole.log(ultimo, robots);',
        steps: [
          { lines: [1, 1], text: 'Dos robots en la colección.' },
          { lines: [2, 3], text: '<code>push</code> agrega "Volt" al final: ahora hay 3.' },
          { lines: [4, 4], text: '<code>pop</code> saca el último y lo guarda en <code>ultimo</code>.' },
          { lines: [5, 5], text: 'La colección volvió a tener 2 robots.' }
        ],
        result: '<p>Los métodos modifican el arreglo original: no hace falta reasignarlo.</p>'
      },
      experiment: {
        code: 'let robots = ["Bit", "Nano"];\nrobots.push("Volt");\nrobots.push("Gear");\nlet sale = robots.pop();\nconsole.log(sale, robots.length);\n',
        ideas: ['Haz <code>pop()</code> sobre un arreglo vacío: ¿qué devuelve?', 'Agrega un número y un booleano al arreglo: ¿se pueden mezclar tipos?', 'Usa un ciclo para hacer 5 <code>push</code>.']
      },
      solve: {
        activity: 'D',
        title: 'Llegadas y reparaciones',
        story: 'Llegan dos robots nuevos, pero el último que llegue irá directo a reparación.',
        scene: { world: 'memory', title: 'Colección de robots', sensors: ['robots'], watch: ['robots', 'enReparacion'] },
        setup: 'var robots = ["Bit", "Nano", "Volt"];',
        goal: '<p>La lista <code>robots</code> ya existe (y puede tener cualquier contenido).</p><ol><li>Agrega <b>"Gear"</b> y luego <b>"Spark"</b> con <code>push</code>.</li><li>Quita el último con <code>pop</code> y guárdalo en la variable <code>enReparacion</code>.</li></ol>',
        starter: '',
        requires: [[/\.push\s*\(/, 'Usa `push()`'], [/\.pop\s*\(\s*\)/, 'Usa `pop()`']],
        forbids: [[/\b(let|const|var)\s+robots\b/, 'No redeclares `robots`']],
        tests: [
          { label: 'Con ["Bit","Nano","Volt"] → queda con Gear al final', check: function (t) { return t.eq(t.get('robots'), ['Bit', 'Nano', 'Volt', 'Gear']) || 'robots quedó: ' + t.show(t.get('robots')) + '.'; } },
          { label: '`enReparacion` es "Spark"', check: function (t) { return t.get('enReparacion') === 'Spark' || 'enReparacion vale ' + t.show(t.get('enReparacion')) + '.'; } },
          { label: 'Funciona con otra lista inicial (["A"])', setup: 'robots = ["A"];', check: function (t) { return (t.eq(t.get('robots'), ['A', 'Gear']) && t.get('enReparacion') === 'Spark') || 'Con ["A"] la lista quedó ' + t.show(t.get('robots')) + '.'; } }
        ],
        hints: ['Son tres instrucciones en orden.', '<code>pop()</code> devuelve el elemento quitado: guárdalo en una variable nueva.', 'Ejemplo distinto: <code>let ultimaTarea = tareas.pop();</code>'],
        success: 'Colección actualizada.'
      },
      prove: {
        activity: 'C',
        mode: 'predict',
        title: 'La fila de carga',
        story: 'Los robots hacen fila para cargar baterías.',
        goal: '<p>Predice qué mostrará la consola.</p>',
        code: 'let cola = ["A", "B"];\ncola.push("C");\ncola.push("D");\nlet sale = cola.pop();\nconsole.log(cola.length, sale);',
        options: ['4 D', '3 D', '3 A', '4 C'],
        answer: 1,
        explain: 'Tras dos push la cola es ["A","B","C","D"] (4). <code>pop()</code> quita el <b>último</b> ("D"), así que quedan 3.',
        wrongHint: 'Sigue los cambios línea por línea. ¿pop quita el primero o el último?',
        hints: ['Escribe el arreglo después de cada línea.', 'pop actúa sobre el final.', 'length se calcula después del pop.'],
        success: '¡Predicción exacta!'
      }
    },

    /* ------------------------------ 5.3 ------------------------------ */
    {
      title: 'Consulta y modifica',
      story: 'Cada robot del almacén tiene una ficha con sus datos. Para eso existen los <b>objetos</b>.',
      scene: { world: 'memory', title: 'Fichas de robots', watch: 'auto' },
      learn: {
        what: '<p>Un <b>objeto</b> agrupa datos relacionados en pares <b>propiedad: valor</b>. Describe una "cosa" con todas sus características.</p>',
        why: '<p>Un robot tiene nombre, batería, color… En vez de tres variables sueltas, un objeto lo reúne todo.</p>',
        when: '<p>Cuando varios datos describen a una misma entidad.</p>',
        how: 'let robot = { nombre: "Pixel", bateria: 80, activo: true };\nrobot.nombre;          // "Pixel"  (notación de punto)\nrobot["bateria"];      // 80       (notación de corchetes)\nrobot.bateria = 95;    // modificar\nrobot.color = "cian";  // agregar una propiedad nueva',
        symbols: [['{ }', 'Crean un objeto.'], ['propiedad: valor', 'Cada dato del objeto. Se separan con comas.'], ['objeto.propiedad', 'Acceso con punto.'], ['objeto["propiedad"]', 'Acceso con corchetes: útil cuando el nombre está en una variable.']],
        mistakes: ['Usar <code>=</code> en lugar de <code>:</code> dentro de las llaves.', 'Olvidar las comillas con corchetes: <code>robot[nombre]</code> busca una variable llamada nombre.', 'Olvidar la coma entre propiedades.'],
        analogy: 'Un objeto es una ficha de registro: cada renglón tiene una etiqueta (propiedad) y un dato (valor).'
      },
      observe: {
        code: 'let robot = { nombre: "Pixel", bateria: 80, activo: true };\nconsole.log(robot.nombre);\nrobot.bateria = 95;\nrobot.color = "cian";\nlet campo = "activo";\nconsole.log(robot[campo]);',
        steps: [
          { lines: [1, 1], text: 'Un objeto con 3 propiedades. Mira la ficha en la memoria.' },
          { lines: [2, 2], text: 'Con punto leemos una propiedad.' },
          { lines: [3, 4], text: 'Modificamos una propiedad y agregamos otra nueva.' },
          { lines: [5, 6], text: 'Con corchetes, el nombre de la propiedad puede venir de una variable.' }
        ],
        result: '<p>Un objeto puede crecer y cambiar, igual que un arreglo, pero se accede por <b>nombre</b> en lugar de por número.</p>'
      },
      experiment: {
        code: 'let robot = { nombre: "Pixel", bateria: 80, activo: true };\nrobot.bateria -= 30;\nrobot.modelo = "PX-1";\nconsole.log(robot);\n',
        ideas: ['Lee una propiedad que no existe: <code>robot.alas</code>.', 'Crea un arreglo de dos objetos.', 'Usa <code>robot["nombre"]</code> y <code>robot.nombre</code>: ¿dan lo mismo?']
      },
      solve: {
        activity: 'A',
        title: 'Ficha del dron',
        story: 'La ficha del dron de reparto está incompleta.',
        goal: '<p>Completa los <code>___</code>: agrega la propiedad <code>helices</code> con valor 4, cambia <code>altitud</code> a 120 usando <b>punto</b> y muestra el modelo usando <b>corchetes</b>.</p>',
        starter: 'let dron = {\n  modelo: "D-9",\n  ___: 4,\n  altitud: 0\n};\ndron.___ = 120;\nconsole.log(dron[___]);\n',
        requires: [[/dron\s*\[\s*["'`]modelo["'`]\s*\]/, 'Accede al modelo con corchetes: `dron["modelo"]`']],
        tests: [
          { label: 'El dron tiene 4 hélices', check: function (t) { return t.get('dron').helices === 4 || 'La propiedad helices no vale 4.'; } },
          { label: 'La altitud es 120', check: function (t) { return t.get('dron').altitud === 120 || 'La altitud vale ' + t.show(t.get('dron').altitud) + '.'; } },
          { label: 'Se muestra el modelo "D-9"', check: function (t) { return t.logs.indexOf('D-9') >= 0 || 'La consola no muestra "D-9".'; } }
        ],
        hints: ['Dentro de las llaves cada propiedad es <code>nombre: valor</code>.', 'Con punto se escribe el nombre de la propiedad directamente.', 'Con corchetes, el nombre va entre comillas.'],
        success: 'Ficha del dron completa.'
      },
      prove: {
        activity: 'G',
        title: 'Actualiza la ficha',
        story: 'El sistema revisa la ficha de cada robot que entra al almacén.',
        scene: { world: 'memory', title: 'Revisión de fichas', watch: ['ficha'] },
        setup: 'var ficha = { nombre: "Volt", bateria: 30, nivel: 2 };',
        goal: '<p>La variable <code>ficha</code> ya existe. Agrega la propiedad <code>estado</code> con <b>"cargando"</b> si la batería es menor que 50, o <b>"operativo"</b> si no. Además, aumenta el <code>nivel</code> en 1.</p>',
        starter: '',
        forbids: [[/\b(let|const|var)\s+ficha\b/, 'No redeclares `ficha`']],
        tests: [
          { label: 'Volt (batería 30) → "cargando", nivel 3', check: function (t) { var f = t.get('ficha'); return (f.estado === 'cargando' && f.nivel === 3) || 'La ficha quedó: ' + t.show(f) + '.'; } },
          { label: 'Batería 80, nivel 5 → "operativo", nivel 6', setup: 'ficha = { nombre: "Nano", bateria: 80, nivel: 5 };', check: function (t) { var f = t.get('ficha'); return (f.estado === 'operativo' && f.nivel === 6) || 'La ficha quedó: ' + t.show(f) + '.'; } },
          { label: 'Batería 50 → "operativo"', setup: 'ficha = { nombre: "Bit", bateria: 50, nivel: 0 };', check: function (t) { return t.get('ficha').estado === 'operativo' || 'Con batería 50 el estado debe ser "operativo".'; } }
        ],
        hints: ['Lee la batería con <code>ficha.bateria</code> dentro de un if.', 'Asignar una propiedad que no existe la crea.', 'Para aumentar: <code>ficha.nivel += 1</code> o <code>ficha.nivel++</code>.'],
        success: 'Fichas actualizadas automáticamente.'
      }
    },

    /* ------------------------------ 5.4 ------------------------------ */
    {
      title: 'Recorre las colecciones',
      story: 'El almacén tiene cientos de registros. Para revisarlos todos se combinan <b>ciclos y arreglos</b>.',
      scene: { world: 'memory', title: 'Registros del almacén', watch: 'auto' },
      learn: {
        what: '<p><b>Recorrer</b> un arreglo es visitar cada elemento con un ciclo. El contador sirve de índice, desde 0 hasta <code>length - 1</code>.</p>',
        why: '<p>Así se calculan totales, se buscan elementos o se filtran datos, sin importar cuántos haya.</p>',
        when: '<p>Siempre que necesites hacer algo con todos los elementos de una lista.</p>',
        how: 'let piezas = [{ nombre: "chip", stock: 3 }, { nombre: "cable", stock: 12 }];\nfor (let i = 0; i < piezas.length; i++) {\n  console.log(piezas[i].nombre, piezas[i].stock);\n}\n// Forma corta:\nfor (const p of piezas) {\n  console.log(p.nombre);\n}',
        symbols: [['i < lista.length', 'Condición típica para recorrer todo el arreglo.'], ['lista[i].prop', 'Propiedad del objeto que está en la posición i.'], ['for (const x of lista)', 'Recorre directamente cada elemento.']],
        mistakes: ['Usar <code>i &lt;= lista.length</code>: la última vuelta lee una posición inexistente.', 'Escribir un número fijo en la condición en lugar de <code>length</code>.'],
        analogy: 'Como revisar cada casillero de la fila, del 0 al último, abriendo uno por uno.'
      },
      observe: {
        code: 'let piezas = [\n  { nombre: "chip", stock: 3 },\n  { nombre: "cable", stock: 12 },\n  { nombre: "tornillo", stock: 50 }\n];\nlet totalStock = 0;\nfor (let i = 0; i < piezas.length; i++) {\n  console.log(piezas[i].nombre + ": " + piezas[i].stock);\n  totalStock += piezas[i].stock;\n}\nconsole.log("Total:", totalStock);',
        steps: [
          { lines: [1, 5], text: 'Un arreglo de objetos: cada casillero contiene una ficha.' },
          { lines: [6, 6], text: 'Un acumulador para el stock total.' },
          { lines: [7, 10], text: 'El ciclo visita i = 0, 1, 2. <code>piezas[i]</code> es la ficha; <code>.nombre</code> y <code>.stock</code> sus datos.' },
          { lines: [11, 11], text: 'Total acumulado: 65.' }
        ],
        result: '<p>Arreglos + ciclos + objetos: la combinación con la que se procesan datos en casi cualquier aplicación.</p>'
      },
      experiment: {
        code: 'let piezas = [\n  { nombre: "chip", stock: 3 },\n  { nombre: "cable", stock: 12 }\n];\nfor (const p of piezas) {\n  console.log(p.nombre, p.stock);\n}\n',
        ideas: ['Agrega una pieza con <code>piezas.push({ nombre: "led", stock: 7 })</code> antes del ciclo.', 'Muestra solo las piezas con stock menor que 10.', 'Cambia la condición a <code>i &lt;= piezas.length</code> en un for clásico y observa el error.']
      },
      solve: {
        activity: 'G',
        title: 'Promedio de lecturas',
        story: 'Los sensores del almacén registran temperaturas a lo largo del día.',
        scene: { world: 'memory', title: 'Sensores', sensors: ['lecturas'], watch: ['promedio'] },
        setup: 'var lecturas = [10, 20, 30, 40];',
        goal: '<p>El arreglo <code>lecturas</code> ya existe (su contenido cambia). Calcula el promedio en la variable <code>promedio</code>: suma todos los valores y divide entre la cantidad.</p>',
        starter: '',
        requires: [[/\b(for|while)\s*\(/, 'Usa un ciclo'], [/lecturas\s*\.\s*length/, 'Usa `lecturas.length`']],
        tests: [
          { label: '[10, 20, 30, 40] → 25', check: function (t) { return t.near(t.get('promedio'), 25) || 'promedio vale ' + t.show(t.get('promedio')) + '.'; } },
          { label: '[7] → 7', setup: 'lecturas = [7];', check: function (t) { return t.near(t.get('promedio'), 7) || 'Con [7] se obtuvo ' + t.show(t.get('promedio')) + '.'; } },
          { label: '[1, 2] → 1.5', setup: 'lecturas = [1, 2];', check: function (t) { return t.near(t.get('promedio'), 1.5) || 'Con [1, 2] se obtuvo ' + t.show(t.get('promedio')) + '.'; } }
        ],
        hints: ['Primero una suma con acumulador; el promedio se calcula después del ciclo.', 'El ciclo va de 0 a <code>lecturas.length - 1</code>.', 'promedio = suma / cantidad de elementos.'],
        success: 'Promedios automáticos.'
      },
      prove: {
        activity: 'G',
        title: 'Robots sin carga',
        story: 'Hay que mandar a cargar a los robots con poca batería.',
        scene: { world: 'memory', title: 'Robots del almacén', watch: ['robots', 'necesitanCarga'] },
        setup: 'var robots = [{ nombre: "Bit", bateria: 12 }, { nombre: "Nano", bateria: 75 }, { nombre: "Volt", bateria: 29 }, { nombre: "Gear", bateria: 30 }];',
        goal: '<p>El arreglo <code>robots</code> ya existe. Crea un arreglo <code>necesitanCarga</code> con los <b>nombres</b> de los robots cuya batería sea <b>menor que 30</b>, en el mismo orden.</p>',
        starter: '',
        forbids: [[/\b(let|const|var)\s+robots\b/, 'No redeclares `robots`']],
        tests: [
          { label: 'Caso inicial → ["Bit", "Volt"]', check: function (t) { return t.eq(t.get('necesitanCarga'), ['Bit', 'Volt']) || 'necesitanCarga quedó ' + t.show(t.get('necesitanCarga')) + '.'; } },
          { label: 'Ninguno bajo 30 → []', setup: 'robots = [{ nombre: "A", bateria: 90 }];', check: function (t) { return t.eq(t.get('necesitanCarga'), []) || 'Debería quedar vacío.'; } },
          { label: 'Todos bajo 30 → todos los nombres', setup: 'robots = [{ nombre: "X", bateria: 1 }, { nombre: "Y", bateria: 0 }];', check: function (t) { return t.eq(t.get('necesitanCarga'), ['X', 'Y']) || 'Debería ser ["X", "Y"].'; } }
        ],
        hints: ['Empieza con un arreglo vacío: <code>[]</code>.', 'Recorre <code>robots</code>; si la batería del robot i es baja, haz push de su nombre.', 'Es un "acumulador", pero de elementos en lugar de números.'],
        success: 'Lista de carga lista.'
      }
    },

    /* ------------------------------ 5.5 ------------------------------ */
    {
      title: 'Sistema de inventarios',
      story: 'Para reabrir el almacén, crearás un pequeño sistema de inventario con funciones, arreglos y objetos.',
      scene: { world: 'memory', title: 'Sistema de inventario', watch: 'auto' },
      learn: {
        what: '<p>Las <b>funciones</b> pueden recibir arreglos y objetos como parámetros, recorrerlos, modificarlos y devolver resultados.</p>',
        why: '<p>Así se construyen sistemas reales: una función para buscar, otra para sumar, otra para agregar…</p>',
        when: '<p>Cuando varias operaciones trabajan sobre la misma colección de datos.</p>',
        how: 'function totalStock(lista) {\n  let total = 0;\n  for (const p of lista) {\n    total += p.cantidad;\n  }\n  return total;\n}\nfunction buscar(lista, nombre) {\n  for (const p of lista) {\n    if (p.nombre === nombre) {\n      return p;          // lo encontré: termino\n    }\n  }\n  return null;           // no estaba\n}',
        mistakes: ['Hacer <code>return</code> dentro del ciclo antes de revisar todos los elementos.', 'Comparar con <code>=</code> en lugar de <code>===</code>.', 'Reemplazar el total (<code>=</code>) en vez de acumular (<code>+=</code>).'],
        analogy: 'El inventario es un archivero; cada función es una persona que sabe hacer un trámite con él.'
      },
      observe: {
        code: 'let inventario = [\n  { nombre: "tornillo", cantidad: 50 },\n  { nombre: "chip", cantidad: 3 }\n];\nfunction agregar(lista, nombre, cantidad) {\n  lista.push({ nombre: nombre, cantidad: cantidad });\n}\nagregar(inventario, "cable", 12);\nconsole.log(inventario.length);',
        steps: [
          { lines: [1, 4], text: 'El inventario: un arreglo de objetos.' },
          { lines: [5, 7], text: 'Una función que recibe la lista y agrega un objeto nuevo.' },
          { lines: [8, 9], text: 'Al llamarla, la lista original crece: ahora tiene 3 productos.' }
        ],
        result: '<p>Cuando pasas un arreglo a una función, la función trabaja sobre el mismo arreglo: sus cambios se ven afuera.</p>'
      },
      experiment: {
        code: 'let inventario = [\n  { nombre: "tornillo", cantidad: 50 },\n  { nombre: "chip", cantidad: 3 }\n];\nfunction agregar(lista, nombre, cantidad) {\n  lista.push({ nombre: nombre, cantidad: cantidad });\n}\nagregar(inventario, "cable", 12);\n',
        ideas: ['Escribe una función que muestre cada producto.', 'Crea una función <code>hayStock(lista, nombre)</code> que devuelva true o false.']
      },
      solve: {
        activity: 'H',
        title: 'El inventario miente',
        story: 'El sistema dice que hay muy pocas piezas y no encuentra productos que sí existen. Pruébalo y depúralo.',
        goal: '<p>Corrige las funciones:</p><ul><li><code>totalPiezas(lista)</code> debe devolver la suma de todas las cantidades.</li><li><code>buscar(lista, nombre)</code> debe devolver el objeto con ese nombre, o <code>null</code> si no existe.</li></ul>',
        starter: 'let inventario = [\n  { nombre: "tornillo", cantidad: 50 },\n  { nombre: "chip", cantidad: 3 },\n  { nombre: "cable", cantidad: 12 }\n];\n\nfunction totalPiezas(lista) {\n  let total = 0;\n  for (let i = 1; i < lista.length; i++) {\n    total = lista[i].cantidad;\n  }\n  return total;\n}\n\nfunction buscar(lista, nombre) {\n  for (let i = 0; i < lista.length; i++) {\n    if (lista[i].nombre = nombre) {\n      return lista[i];\n    }\n  }\n  return null;\n}\n\nconsole.log(totalPiezas(inventario));\nconsole.log(buscar(inventario, "cable"));\n',
        tests: [
          { label: 'totalPiezas(inventario) → 65', check: function (t) { var r = t.call('totalPiezas', [{ nombre: 'tornillo', cantidad: 50 }, { nombre: 'chip', cantidad: 3 }, { nombre: 'cable', cantidad: 12 }]); return r === 65 || 'Devolvió ' + t.show(r) + '.'; } },
          { label: 'totalPiezas con una sola pieza de 7 → 7', check: function (t) { var r = t.call('totalPiezas', [{ nombre: 'x', cantidad: 7 }]); return r === 7 || 'Devolvió ' + t.show(r) + '.'; } },
          { label: 'buscar(..., "chip") devuelve el objeto del chip', check: function (t) { var r = t.call('buscar', [{ nombre: 'tornillo', cantidad: 50 }, { nombre: 'chip', cantidad: 3 }], 'chip'); return (r && r.nombre === 'chip' && r.cantidad === 3) || 'Devolvió ' + t.show(r) + '.'; } },
          { label: 'buscar(..., "láser") devuelve null', check: function (t) { var r = t.call('buscar', [{ nombre: 'tornillo', cantidad: 50 }], 'láser'); return r === null || 'Debería devolver null y devolvió ' + t.show(r) + '.'; } }
        ],
        hints: ['Hay tres errores: dos en totalPiezas y uno en buscar.', 'En totalPiezas: ¿desde qué índice empieza? ¿acumula o reemplaza?', 'En buscar: ¿esa condición compara o asigna? (revisa los consejos 💡)'],
        success: 'Inventario confiable de nuevo.'
      },
      prove: {
        activity: 'G',
        title: 'Reposición inteligente',
        story: 'Cuando llega mercancía, puede ser de un producto existente o de uno nuevo.',
        goal: '<p>Crea <code>reponer(lista, nombre, cantidad)</code>:</p><ul><li>si el producto existe, <b>suma</b> la cantidad a la que ya tiene;</li><li>si no existe, lo <b>agrega</b> como objeto nuevo <code>{ nombre, cantidad }</code> al final;</li><li>en ambos casos, <b>devuelve</b> la lista.</li></ul>',
        starter: '',
        tests: [
          { label: 'Reponer 5 chips (existente) → chip pasa de 3 a 8', check: function (t) { var l = [{ nombre: 'tornillo', cantidad: 50 }, { nombre: 'chip', cantidad: 3 }]; var r = t.call('reponer', l, 'chip', 5); return (l[1].cantidad === 8 && l.length === 2) || 'La lista quedó ' + t.show(l) + '.'; } },
          { label: 'Reponer 4 leds (nuevo) → se agrega al final', check: function (t) { var l = [{ nombre: 'chip', cantidad: 3 }]; t.call('reponer', l, 'led', 4); return (l.length === 2 && l[1].nombre === 'led' && l[1].cantidad === 4) || 'La lista quedó ' + t.show(l) + '.'; } },
          { label: 'Devuelve la lista', check: function (t) { var l = []; var r = t.call('reponer', l, 'x', 1); return r === l || 'reponer debe devolver la misma lista que recibió.'; } }
        ],
        hints: ['Primero busca: recorre la lista comparando nombres.', 'Si lo encuentras, suma y devuelve. Si el ciclo termina sin encontrarlo, haz push.', 'Puedes reutilizar la idea de la función buscar del reto anterior.'],
        success: '¡El Almacén Central está organizado!'
      }
    }
  ],

  special: {
    title: 'El mayor valor',
    scene: { world: 'memory', title: 'Estadísticas', watch: 'auto' },
    solve: {
      activity: 'G',
      title: 'El mayor valor',
      story: 'El almacén quiere saber cuál es el mayor número de una lista, sin usar atajos.',
      goal: '<p>Crea <code>mayor(arreglo)</code> que devuelva el número más grande del arreglo <b>sin usar</b> <code>Math.max</code>.</p>',
      starter: '',
      forbids: [[/Math\s*\.\s*max/, 'Usar `Math.max`']],
      tests: [
        { label: 'mayor([3, 9, 2]) → 9', check: function (t) { return t.call('mayor', [3, 9, 2]) === 9 || 'No devolvió 9.'; } },
        { label: 'mayor([-5, -2, -9]) → -2', check: function (t) { return t.call('mayor', [-5, -2, -9]) === -2 || 'Con negativos debería devolver -2. ¿Empezaste comparando contra 0?'; } },
        { label: 'mayor([4]) → 4', check: function (t) { return t.call('mayor', [4]) === 4 || 'No devolvió 4.'; } }
      ],
      hints: ['Guarda "el mayor hasta ahora" y recorre la lista.', 'Empieza con el primer elemento, no con 0.', 'Si encuentras uno más grande, actualiza.'],
      success: 'Estadística calculada a mano.'
    }
  }
});
