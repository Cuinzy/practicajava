/* =====================================================================
   BLOQUE 8 · Núcleo de Neópolis — Desafío final
   Una aplicación interactiva real que se construye nivel a nivel:
   cada reto parte del código que el propio estudiante escribió antes
   (propiedad "carry"), integrando variables, condicionales, ciclos,
   funciones, arreglos, objetos, DOM y eventos.
   ===================================================================== */
(function () {
  'use strict';

  var CSS = [
    '.panel{background:linear-gradient(160deg,#13204a,#0b1430);border:1px solid #2c3d73;border-radius:14px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,.4);max-width:620px}',
    '.panel h1{font-size:20px;color:#67e8f9;letter-spacing:.05em;margin-top:0}',
    '.resumen{display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:8px}',
    '.estado{padding:2px 10px;border-radius:999px;background:#334155}',
    '.estado.estable{background:#14532d;color:#bbf7d0}.estado.alerta{background:#78350f;color:#fde68a}.estado.emergencia{background:#7f1d1d;color:#fecaca;animation:pulso 1s infinite}',
    '@keyframes pulso{50%{box-shadow:0 0 16px #ef4444}}',
    '#lista-distritos{list-style:none;padding:0;margin:8px 0;display:grid;gap:6px}',
    '#lista-distritos li{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:7px 10px;border-radius:10px;background:#1e293b;border:1px solid #334155;border-left:5px solid #22c55e;transition:all .3s}',
    '#lista-distritos li.critico{border-left-color:#ef4444;background:#2a1220}',
    '#lista-distritos li button{padding:4px 10px;margin:0;font-size:13px}',
    '.form{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin-top:8px}',
    '#aviso{color:#fca5a5;margin-left:6px}',
    '#reparar-todo{background:#15803d}'
  ].join('\n');

  var HTML = '<div class="panel">\n  <h1>⚡ Núcleo de Neópolis</h1>\n  <div class="resumen"><span>Energía total: <b id="total">—</b></span><span>Estado: <b id="estado" class="estado">—</b></span></div>\n  <input id="buscar" placeholder="Buscar distrito">\n  <button id="reparar-todo">Reparar todo</button>\n  <ul id="lista-distritos"></ul>\n  <div class="form"><input id="nuevo-nombre" placeholder="Nombre del distrito"><input id="nueva-energia" type="number" placeholder="Energía (0-100)"><button id="agregar">Agregar distrito</button><span id="aviso"></span></div>\n</div>';

  var SCENE = { world: 'page', html: HTML, css: CSS };
  var DATA = 'var distritos = [\n  { nombre: "Norte", energia: 80 },\n  { nombre: "Sur", energia: 25 },\n  { nombre: "Este", energia: 55 },\n  { nombre: "Oeste", energia: 10 },\n  { nombre: "Centro", energia: 95 }\n];';
  var MEM = { world: 'memory', title: 'Núcleo · diagnóstico de datos', watch: ['distritos'] };

  // Implementaciones de referencia: solo se usan si no hay código previo guardado.
  var REF_DATOS = 'function energiaTotal(lista) {\n  let total = 0;\n  for (const d of lista) {\n    total += d.energia;\n  }\n  return total;\n}\n\nfunction distritosCriticos(lista) {\n  const criticos = [];\n  for (const d of lista) {\n    if (d.energia < 30) {\n      criticos.push(d.nombre);\n    }\n  }\n  return criticos;\n}';
  var REF_ESTADO = 'function estadoCiudad(lista) {\n  const n = distritosCriticos(lista).length;\n  if (n === 0) {\n    return "estable";\n  } else if (n <= 2) {\n    return "alerta";\n  }\n  return "emergencia";\n}';
  var REF_PINTAR = 'function pintarDistritos(lista) {\n  const ul = document.querySelector("#lista-distritos");\n  ul.innerHTML = "";\n  for (const d of lista) {\n    const li = document.createElement("li");\n    li.className = "distrito";\n    li.textContent = d.nombre + ": " + d.energia + "%";\n    if (d.energia < 30) {\n      li.classList.add("critico");\n    }\n    ul.appendChild(li);\n  }\n}';
  var REF_RESUMEN = 'function actualizarResumen(lista) {\n  document.querySelector("#total").textContent = energiaTotal(lista);\n  const estado = estadoCiudad(lista);\n  const el = document.querySelector("#estado");\n  el.textContent = estado;\n  el.className = "estado " + estado;\n}';

  // Aplicación completa que funciona (base del último reto)
  var APP = REF_DATOS + '\n\n' + REF_ESTADO + '\n\n' +
    'function pintarDistritos(lista) {\n  const ul = document.querySelector("#lista-distritos");\n  ul.innerHTML = "";\n  for (const d of lista) {\n    const li = document.createElement("li");\n    const texto = document.createElement("span");\n    texto.textContent = d.nombre + ": " + d.energia + "%";\n    li.appendChild(texto);\n    if (d.energia < 30) {\n      li.classList.add("critico");\n    }\n    const boton = document.createElement("button");\n    boton.textContent = "Reparar";\n    boton.addEventListener("click", function () {\n      d.energia = 100;\n      actualizar();\n    });\n    li.appendChild(boton);\n    ul.appendChild(li);\n  }\n}\n\n' +
    REF_RESUMEN + '\n\n' +
    'function actualizar() {\n  pintarDistritos(distritos);\n  actualizarResumen(distritos);\n}\n\n' +
    'document.querySelector("#agregar").addEventListener("click", function () {\n  const nombre = document.querySelector("#nuevo-nombre").value.trim();\n  const energia = Number(document.querySelector("#nueva-energia").value);\n  if (nombre !== "" && energia >= 0 && energia <= 100) {\n    distritos.push({ nombre: nombre, energia: energia });\n    document.querySelector("#aviso").textContent = "";\n    actualizar();\n  } else {\n    document.querySelector("#aviso").textContent = "Datos inválidos";\n  }\n});\n\nactualizar();';

  // Versión saboteada por el virus (para depurar)
  var SABOTAGED = 'function energiaTotal(lista) {\n  let total = 0;\n  for (let i = 1; i < lista.length; i++) {\n    total += lista[i].energia;\n  }\n  return total;\n}\n\nfunction distritosCriticos(lista) {\n  const criticos = [];\n  for (const d of lista) {\n    if (d.energia > 30) {\n      criticos.push(d.nombre);\n    }\n  }\n  return criticos;\n}\n\n' + REF_ESTADO + '\n\n' +
    'function pintarDistritos(lista) {\n  const ul = document.querySelector("lista-distritos");\n  ul.innerHTML = "";\n  for (const d of lista) {\n    const li = document.createElement("li");\n    const texto = document.createElement("span");\n    texto.textContent = d.nombre + ": " + d.energia + "%";\n    li.appendChild(texto);\n    if (d.energia < 30) {\n      li.classList.add("critico");\n    }\n    const boton = document.createElement("button");\n    boton.textContent = "Reparar";\n    boton.addEventListener("click", function () {\n      d.energia = 100;\n      actualizar();\n    });\n    li.appendChild(boton);\n    ul.appendChild(li);\n  }\n}\n\n' +
    'function actualizarResumen(lista) {\n  document.querySelector("#total").textContent = energiaTotal(lista);\n  const estado = estadoCiudad(lista);\n  const el = document.querySelector("#estado");\n  el.textContent = estado;\n  el.classname = "estado " + estado;\n}\n\n' +
    'function actualizar() {\n  pintarDistritos(distritos);\n  actualizarResumen(distritos);\n}\n\nactualizar();';

  CQ.Levels.register({
    n: 8,
    name: 'Núcleo de Neópolis',
    topic: 'Desafío final: una aplicación completa con datos, lógica, funciones, DOM y eventos',
    icon: '🏙️',
    color: '#facc15',
    intro: 'El Núcleo controla la energía de todos los distritos. El virus del Gran Apagón lo dejó en blanco. Construirás —paso a paso y con <b>tu propio código</b>— el centro de control que reactivará Neópolis.',
    concepts: ['Pensar → expresar → comprobar', 'Descomposición en funciones', 'Arreglos de objetos', 'Renderizar con el DOM', 'Eventos', 'Validación', 'Depuración integral'],
    levels: [
      /* ------------------------------ 8.1 ------------------------------ */
      {
        title: 'Diagnóstico de datos',
        story: 'El Núcleo guarda los distritos como un arreglo de objetos. Antes de mostrar nada, necesitas funciones que <b>analicen</b> esos datos.',
        scene: MEM,
        setup: DATA,
        learn: {
          what: '<p>El desafío final es una aplicación real. La clave para no perderse es la <b>descomposición</b>: dividir el problema en funciones pequeñas que se pueden probar por separado.</p>',
          why: '<p>Los programadores profesionales no escriben todo de una vez: <b>piensan</b> qué quieren lograr, lo <b>expresan</b> en código por partes y <b>comprueban</b> cada parte.</p>',
          when: '<p>En cualquier proyecto con más de un paso. Este nivel empieza por los datos: sin datos correctos, la interfaz mostraría información falsa.</p>',
          how: '// Los datos del Núcleo (ya existen):\nlet distritos = [\n  { nombre: "Norte", energia: 80 },\n  { nombre: "Sur", energia: 25 },\n  // ...\n];\n// Plan:\n// 1. energiaTotal(lista)      → número\n// 2. distritosCriticos(lista) → arreglo de nombres\n// 3. estadoCiudad(lista)      → "estable" | "alerta" | "emergencia"',
          mistakes: ['Escribir todo en una sola función gigante.', 'Usar la variable global <code>distritos</code> dentro de las funciones en lugar del parámetro <code>lista</code>: la función dejaría de servir para otros datos.', 'No probar cada función por separado con console.log.'],
          analogy: 'Como armar un mueble: primero verificas que tienes todas las piezas correctas (datos), luego armas módulos, y al final los unes.'
        },
        observe: {
          code: 'function energiaPromedio(lista) {\n  let suma = 0;\n  for (const d of lista) {\n    suma += d.energia;\n  }\n  return suma / lista.length;\n}\nconsole.log(energiaPromedio(distritos));\nconsole.log(energiaPromedio([{ nombre: "Prueba", energia: 40 }]));',
          steps: [
            { lines: [1, 7], text: 'Una función que recibe <b>cualquier</b> lista de distritos (parámetro <code>lista</code>), acumula y devuelve el promedio.' },
            { lines: [8, 8], text: 'La probamos con los datos reales: 53.' },
            { lines: [9, 9], text: 'Y con datos inventados: así compruebas que funciona en general, no solo con un caso.' }
          ],
          result: '<p>Pensar → expresar → comprobar. Esa es la forma de trabajar del desafío final.</p>'
        },
        experiment: {
          code: 'for (const d of distritos) {\n  console.log(d.nombre, d.energia, d.energia < 30 ? "CRÍTICO" : "ok");\n}\n',
          ideas: ['Explora los datos: ¿qué distritos son críticos (menos de 30)?', 'Prueba <code>distritos.length</code> y <code>distritos[0].nombre</code>.', '(La expresión <code>condición ? a : b</code> es un if corto: si es true da a, si no b).']
        },
        solve: {
          activity: 'G',
          title: 'Funciones de diagnóstico',
          story: 'El primer paso: medir la energía y detectar los distritos en peligro.',
          goal: '<p>Crea dos funciones que trabajen con su parámetro <code>lista</code>:</p><ul><li><code>energiaTotal(lista)</code>: devuelve la suma de la energía de todos los distritos.</li><li><code>distritosCriticos(lista)</code>: devuelve un arreglo con los <b>nombres</b> de los distritos con energía <b>menor que 30</b>.</li></ul>',
          starter: '// El arreglo distritos ya existe. Tus funciones deben servir para CUALQUIER lista.\n\n',
          tests: [
            { label: 'energiaTotal(distritos) → 265', check: function (t) { if (!t.isFn('energiaTotal')) return 'No existe la función energiaTotal.'; var r = t.call('energiaTotal', t.get('distritos')); return r === 265 || 'Devolvió ' + t.show(r) + '.'; } },
            { label: 'energiaTotal con otra lista → 70', check: function (t) { var r = t.call('energiaTotal', [{ nombre: 'A', energia: 30 }, { nombre: 'B', energia: 40 }]); return r === 70 || 'Con otra lista devolvió ' + t.show(r) + '. ¿Usas el parámetro lista?'; } },
            { label: 'distritosCriticos(distritos) → ["Sur", "Oeste"]', check: function (t) { if (!t.isFn('distritosCriticos')) return 'No existe la función distritosCriticos.'; var r = t.call('distritosCriticos', t.get('distritos')); return t.eq(r, ['Sur', 'Oeste']) || 'Devolvió ' + t.show(r) + '.'; } },
            { label: 'distritosCriticos sin críticos → []', check: function (t) { var r = t.call('distritosCriticos', [{ nombre: 'A', energia: 30 }]); return t.eq(r, []) || 'Con energía 30 (no es menor que 30) devolvió ' + t.show(r) + '.'; } }
          ],
          hints: ['Ambas funciones recorren la lista con un ciclo.', 'La primera usa un acumulador numérico; la segunda, un arreglo vacío al que haces push.', 'Repasa el nivel 5.4 (Robots sin carga): es el mismo patrón.'],
          celebrate: '✔ DIAGNÓSTICO LISTO',
          success: 'El Núcleo ya entiende sus datos.'
        },
        prove: {
          activity: 'G',
          title: 'Estado de la ciudad',
          story: 'El Núcleo debe resumir la situación en una sola palabra.',
          goal: '<p>Debajo de tu código anterior, crea <code>estadoCiudad(lista)</code> que devuelva:</p><ul><li><b>"estable"</b> si no hay distritos críticos;</li><li><b>"alerta"</b> si hay 1 o 2;</li><li><b>"emergencia"</b> si hay 3 o más.</li></ul><p><b>Reutiliza</b> tu función <code>distritosCriticos</code>.</p>',
          carry: ['b8l1:solve'],
          carryFallback: REF_DATOS,
          starter: '// Escribe aquí estadoCiudad(lista)\n',
          tests: [
            { label: 'Datos actuales (2 críticos) → "alerta"', check: function (t) { if (!t.isFn('estadoCiudad')) return 'No existe la función estadoCiudad.'; var r = t.call('estadoCiudad', t.get('distritos')); return r === 'alerta' || 'Devolvió ' + t.show(r) + '.'; } },
            { label: 'Sin críticos → "estable"', check: function (t) { return t.call('estadoCiudad', [{ nombre: 'A', energia: 90 }]) === 'estable' || 'No devolvió "estable".'; } },
            { label: '3 críticos → "emergencia"', check: function (t) { return t.call('estadoCiudad', [{ nombre: 'A', energia: 1 }, { nombre: 'B', energia: 2 }, { nombre: 'C', energia: 3 }]) === 'emergencia' || 'No devolvió "emergencia".'; } },
            { label: 'estadoCiudad reutiliza distritosCriticos', check: function (t) { return /function\s+estadoCiudad[\s\S]*distritosCriticos\s*\(/.test(t.src) || 'Llama a distritosCriticos(lista) dentro de estadoCiudad.'; } }
          ],
          hints: ['¿Qué devuelve distritosCriticos? Un arreglo. ¿Cómo sabes cuántos elementos tiene?', 'Guarda esa cantidad en una variable y decide con if / else if / else.', 'Cada rama hace return de un texto.'],
          success: 'El Núcleo ya sabe cómo está la ciudad.'
        }
      },

      /* ------------------------------ 8.2 ------------------------------ */
      {
        title: 'Panel de distritos',
        story: 'Los datos ya están analizados. Ahora hay que <b>mostrarlos</b> en el panel del Núcleo.',
        scene: SCENE,
        setup: DATA,
        learn: {
          what: '<p><b>Renderizar</b> es convertir datos en elementos del DOM. El patrón es: vaciar el contenedor, recorrer los datos y crear un elemento por cada uno.</p>',
          why: '<p>Si los datos cambian, basta con volver a renderizar para que la pantalla los refleje.</p>',
          when: '<p>Cada vez que una lista de datos debe verse en la página.</p>',
          how: 'function pintar(lista) {\n  const ul = document.querySelector("#lista-distritos");\n  ul.innerHTML = "";                // 1. vaciar\n  for (const d of lista) {          // 2. recorrer\n    const li = document.createElement("li");\n    li.textContent = d.nombre;      // 3. crear y configurar\n    ul.appendChild(li);             // 4. insertar\n  }\n}',
          mistakes: ['No vaciar el contenedor: al volver a pintar, los elementos se duplican.', 'Crear el elemento fuera del ciclo: solo habría uno.'],
          analogy: 'Como borrar la pizarra antes de escribir la lista actualizada.'
        },
        observe: {
          code: 'const ul = document.querySelector("#lista-distritos");\nul.innerHTML = "";\nfor (const d of distritos) {\n  const li = document.createElement("li");\n  li.textContent = d.nombre;\n  ul.appendChild(li);\n}',
          steps: [
            { lines: [1, 2], text: 'Seleccionamos la lista y la vaciamos.' },
            { lines: [3, 7], text: 'Un &lt;li&gt; por distrito. Observa cómo el árbol DOM se llena de nodos nuevos.' }
          ],
          result: '<p>Cinco objetos del arreglo → cinco elementos en la página.</p>'
        },
        experiment: {
          code: 'const ul = document.querySelector("#lista-distritos");\nul.innerHTML = "";\nfor (const d of distritos) {\n  const li = document.createElement("li");\n  li.textContent = d.nombre + ": " + d.energia + "%";\n  ul.appendChild(li);\n}\n',
          ideas: ['Quita el <code>ul.innerHTML = ""</code> y ejecuta el ciclo dos veces: ¿qué pasa?', 'Marca con la clase "critico" los distritos con poca energía.']
        },
        solve: {
          activity: 'G',
          title: 'Pinta los distritos',
          story: 'El panel debe mostrar cada distrito con su energía y resaltar los críticos.',
          goal: '<p>Agrega a tu código la función <code>pintarDistritos(lista)</code> que:</p><ul><li>vacíe <b>#lista-distritos</b>;</li><li>cree un <code>&lt;li&gt;</code> por distrito con el texto <code>nombre + ": " + energia + "%"</code> (por ejemplo «Sur: 25%»);</li><li>agregue la clase <b>critico</b> a los distritos con energía <b>menor que 30</b>.</li></ul><p>Al final, llama a <code>pintarDistritos(distritos)</code>.</p>',
          carry: ['b8l1:prove'],
          carryFallback: REF_DATOS + '\n\n' + REF_ESTADO,
          starter: '// Escribe aquí pintarDistritos(lista)\n\n',
          requires: [[/createElement\s*\(/, 'Usa `createElement`']],
          tests: [
            { label: 'Se muestran los 5 distritos', check: function (t) { var li = t.$$('#lista-distritos li'); return li.length === 5 || 'Hay ' + li.length + ' elementos en la lista.'; } },
            { label: 'Texto con el formato «Sur: 25%»', check: function (t) { var li = t.$$('#lista-distritos li'); return li.some(function (x) { return x.textContent.indexOf('Sur: 25%') >= 0; }) || 'No encuentro «Sur: 25%» en la lista.'; } },
            { label: 'Solo Sur y Oeste tienen la clase critico', check: function (t) { var li = t.$$('#lista-distritos li'); var crit = li.filter(function (x) { return x.classList.contains('critico'); }).map(function (x) { return x.textContent; }); return (crit.length === 2 && /Sur/.test(crit.join()) && /Oeste/.test(crit.join())) || 'Distritos marcados como críticos: ' + (crit.join(' | ') || 'ninguno') + '.'; } },
            { label: 'Al volver a pintar no se duplica la lista', check: function (t) { t.call('pintarDistritos', [{ nombre: 'Prueba', energia: 5 }]); var li = t.$$('#lista-distritos li'); return (li.length === 1 && li[0].classList.contains('critico')) || 'Después de pintar otra lista hay ' + li.length + ' elementos. ¿Vacías el contenedor?'; } }
          ],
          hints: ['Sigue el patrón de la fase Aprende: vaciar, recorrer, crear, configurar, insertar.', 'La clase depende de un if dentro del ciclo.', 'No olvides la llamada final con <code>distritos</code>.'],
          success: 'El panel muestra la ciudad.'
        },
        prove: {
          activity: 'G',
          title: 'Resumen del Núcleo',
          story: 'Arriba del panel hay un resumen con la energía total y el estado de la ciudad.',
          goal: '<p>Agrega <code>actualizarResumen(lista)</code> que, <b>usando tus funciones anteriores</b>:</p><ul><li>muestre en <b>#total</b> la energía total;</li><li>muestre en <b>#estado</b> el estado de la ciudad;</li><li>deje en <b>#estado</b> las clases <b>estado</b> y la del estado actual (por ejemplo «estado alerta»).</li></ul><p>Llama a <code>actualizarResumen(distritos)</code> al final.</p>',
          carry: ['b8l2:solve'],
          carryFallback: REF_DATOS + '\n\n' + REF_ESTADO + '\n\n' + REF_PINTAR + '\n\npintarDistritos(distritos);',
          starter: '// Escribe aquí actualizarResumen(lista)\n\n',
          tests: [
            { label: '#total muestra 265', check: function (t) { return t.text('#total') === '265' || '#total dice «' + t.text('#total') + '».'; } },
            { label: '#estado muestra «alerta» con sus clases', check: function (t) { return (t.text('#estado') === 'alerta' && t.cls('#estado', 'estado') && t.cls('#estado', 'alerta')) || '#estado: «' + t.text('#estado') + '», clases: ' + t.$('#estado').className; } },
            { label: 'Con otra lista cambia a «estable» sin la clase anterior', check: function (t) { t.call('actualizarResumen', [{ nombre: 'A', energia: 90 }]); return (t.text('#estado') === 'estable' && t.cls('#estado', 'estable') && !t.cls('#estado', 'alerta') && t.text('#total') === '90') || '#estado: «' + t.text('#estado') + '», clases: ' + t.$('#estado').className + ', total: ' + t.text('#total'); } },
            { label: 'actualizarResumen reutiliza tus funciones', check: function (t) { return /function\s+actualizarResumen[\s\S]*(energiaTotal|estadoCiudad)\s*\(/.test(t.src) || 'Usa energiaTotal y estadoCiudad dentro de actualizarResumen.'; } }
          ],
          hints: ['Llama a energiaTotal(lista) y a estadoCiudad(lista) y guarda sus resultados.', 'Para las clases, <code>className = "estado " + estado</code> reemplaza las anteriores.', 'Recuerda la llamada final.'],
          success: 'El Núcleo informa la situación en tiempo real.'
        }
      },

      /* ------------------------------ 8.3 ------------------------------ */
      {
        title: 'Controles de la ciudad',
        story: 'El panel ya muestra datos. Ahora debe permitir <b>actuar</b>: reparar distritos y agregar nuevos.',
        scene: SCENE,
        setup: DATA,
        learn: {
          what: '<p>Una interfaz interactiva sigue el ciclo: <b>evento</b> → <b>cambiar los datos</b> → <b>volver a pintar</b>. Nunca se edita la pantalla "a mano": se cambian los datos y se renderiza de nuevo.</p>',
          why: '<p>Así la pantalla siempre coincide con los datos, sin importar cuántas acciones haya.</p>',
          when: '<p>En cualquier aplicación con datos que cambian por acciones de la persona usuaria.</p>',
          how: 'function actualizar() {\n  pintarDistritos(distritos);\n  actualizarResumen(distritos);\n}\n// Dentro de pintarDistritos, por cada distrito d:\nconst boton = document.createElement("button");\nboton.textContent = "Reparar";\nboton.addEventListener("click", function () {\n  d.energia = 100;   // 1. cambiar los datos\n  actualizar();      // 2. volver a pintar\n});\nli.appendChild(boton);',
          mistakes: ['Cambiar solo la pantalla y no los datos: al repintar, el cambio se pierde.', 'Olvidar llamar a actualizar() después de cambiar los datos.'],
          analogy: 'Los datos son la partitura; la pantalla es la música que suena. Si quieres otra melodía, cambias la partitura y vuelves a tocar.'
        },
        observe: {
          code: 'function actualizar() {\n  const ul = document.querySelector("#lista-distritos");\n  ul.innerHTML = "";\n  for (const d of distritos) {\n    const li = document.createElement("li");\n    li.textContent = d.nombre + " ";\n    const b = document.createElement("button");\n    b.textContent = "+10";\n    b.addEventListener("click", function () {\n      d.energia += 10;\n      console.log(d.nombre, "ahora tiene", d.energia);\n      actualizar();\n    });\n    li.appendChild(b);\n    ul.appendChild(li);\n  }\n}\nactualizar();',
          steps: [
            { lines: [1, 3], text: 'Una función que repinta todo.' },
            { lines: [4, 16], text: 'Cada distrito tiene su propio botón. La función del evento "recuerda" a qué distrito <code>d</code> pertenece.' },
            { lines: [17, 18], text: 'Pintamos por primera vez. <b>Pulsa los botones +10</b> del escenario y mira la consola.' }
          ],
          result: '<p>Cada botón modifica <b>su</b> distrito y la lista se vuelve a pintar con los datos nuevos.</p>'
        },
        experiment: {
          code: 'document.querySelector("#agregar").addEventListener("click", function () {\n  const nombre = document.querySelector("#nuevo-nombre").value;\n  console.log("Quieren agregar:", nombre);\n});\n',
          ideas: ['Escribe un nombre en el escenario y pulsa «Agregar distrito».', 'Lee también la energía con <code>Number(...)</code>.']
        },
        solve: {
          activity: 'G',
          title: 'Botones de reparación',
          story: 'Cada distrito necesita un botón para reparar su energía.',
          goal: '<p>Modifica tu código para que:</p><ul><li>cada <code>&lt;li&gt;</code> de la lista tenga un <code>&lt;button&gt;</code> con el texto <b>Reparar</b>;</li><li>al pulsarlo, la energía de <b>ese</b> distrito pase a <b>100</b> y se actualicen la lista y el resumen.</li></ul><p>Sugerencia: crea una función <code>actualizar()</code> que llame a <code>pintarDistritos(distritos)</code> y <code>actualizarResumen(distritos)</code>.</p>',
          carry: ['b8l2:prove'],
          carryFallback: REF_DATOS + '\n\n' + REF_ESTADO + '\n\n' + REF_PINTAR + '\n\n' + REF_RESUMEN + '\n\npintarDistritos(distritos);\nactualizarResumen(distritos);',
          starter: '// Modifica pintarDistritos para agregar el botón "Reparar" a cada distrito\n',
          tests: [
            { label: 'Cada distrito tiene un botón «Reparar»', check: function (t) { var li = t.$$('#lista-distritos li'); return (li.length === 5 && li.every(function (x) { var b = x.querySelector('button'); return b && b.textContent.trim() === 'Reparar'; })) || 'No todos los distritos tienen su botón «Reparar».'; } },
            { label: 'Reparar «Sur» → su energía pasa a 100 en los datos', check: function (t) { var li = t.$$('#lista-distritos li').filter(function (x) { return /Sur/.test(x.textContent); })[0]; if (!li) return 'No encuentro el distrito Sur.'; t.click(li.querySelector('button')); var sur = t.get('distritos').filter(function (d) { return d.nombre === 'Sur'; })[0]; return sur.energia === 100 || 'La energía de Sur es ' + sur.energia + '.'; } },
            { label: 'La lista y el resumen se actualizan tras reparar', check: function (t) { var li = t.$$('#lista-distritos li'); var sur = li.filter(function (x) { return /Sur/.test(x.textContent); })[0]; return (sur && sur.textContent.indexOf('100%') >= 0 && !sur.classList.contains('critico') && li.length === 5 && t.text('#total') === '340') || 'Tras reparar Sur: «' + (sur ? sur.textContent : '?') + '», total ' + t.text('#total') + ', ' + li.length + ' elementos.'; } }
          ],
          hints: ['El botón se crea dentro del ciclo de pintarDistritos, junto con su li.', 'Dentro del evento: cambia <code>d.energia</code> y vuelve a pintar todo.', 'Si el texto del li lo pones con textContent después de agregar el botón, ¡borras el botón! Agrega primero el texto (o usa un span).'],
          success: 'Los técnicos ya pueden reparar distritos.'
        },
        prove: {
          activity: 'G',
          title: 'Nuevos distritos',
          story: 'Neópolis crece: hay que poder agregar distritos desde el panel.',
          goal: '<p>Programa el formulario: al pulsar <b>#agregar</b>, lee <b>#nuevo-nombre</b> y <b>#nueva-energia</b>.</p><ul><li>Si el nombre no está vacío y la energía está entre <b>0 y 100</b>: agrega el distrito <code>{ nombre, energia }</code> al arreglo <code>distritos</code>, vacía <b>#aviso</b> y actualiza la lista y el resumen.</li><li>Si no: <b>#aviso</b> = <b>Datos inválidos</b> y no se agrega nada.</li></ul>',
          carry: ['b8l3:solve'],
          carryFallback: APP.split('\n\ndocument.querySelector("#agregar")')[0] + '\n\nactualizar();',
          starter: '// Programa aquí el botón #agregar\n',
          tests: [
            { label: 'Agregar «Puerto» con 40 → aparece en la lista y en los datos', check: function (t) { t.write('#nuevo-nombre', 'Puerto'); t.write('#nueva-energia', '40'); t.click('#agregar'); var ok = t.get('distritos').some(function (d) { return d.nombre === 'Puerto' && d.energia === 40; }); if (!ok) return 'El arreglo distritos no contiene { nombre: "Puerto", energia: 40 } (¿convertiste la energía a número?).'; return t.$$('#lista-distritos li').some(function (x) { return x.textContent.indexOf('Puerto: 40%') >= 0; }) || 'Puerto no aparece en la lista.'; } },
            { label: 'El total se actualiza (265 + 40 = 305)', check: function (t) { return t.text('#total') === '305' || '#total dice «' + t.text('#total') + '».'; } },
            { label: 'Nombre vacío → «Datos inválidos»', setup: '// caso 2', check: function (t) { t.write('#nuevo-nombre', '  '); t.write('#nueva-energia', '50'); t.click('#agregar'); return (t.text('#aviso') === 'Datos inválidos' && t.get('distritos').length === 5) || 'aviso: «' + t.text('#aviso') + '», distritos: ' + t.get('distritos').length; } },
            { label: 'Energía 150 → «Datos inválidos»', setup: '// caso 3', check: function (t) { t.write('#nuevo-nombre', 'Isla'); t.write('#nueva-energia', '150'); t.click('#agregar'); return (t.text('#aviso') === 'Datos inválidos' && t.get('distritos').length === 5) || 'Con energía 150 no debería agregarse.'; } }
          ],
          hints: ['Lee los valores dentro del evento: <code>.value.trim()</code> y <code>Number(...)</code>.', 'Si es válido, push al arreglo y llama a actualizar().', 'Revisa la validación del nivel 7.4.'],
          success: 'El Núcleo admite nuevos distritos.'
        }
      },

      /* ------------------------------ 8.4 ------------------------------ */
      {
        title: 'Reactivar Neópolis',
        story: 'El virus del Gran Apagón contraataca en el Núcleo. Es la última misión: depúralo y completa el centro de control.',
        scene: SCENE,
        setup: DATA,
        learn: {
          what: '<p>La <b>depuración integral</b> consiste en encontrar errores en un programa completo. Estrategia:</p><ol><li><b>Ejecuta</b> y lee el primer error.</li><li><b>Observa</b> el escenario y el árbol DOM: ¿qué no aparece o no cambia?</li><li><b>Aísla</b>: prueba cada función con <code>console.log</code>.</li><li><b>Corrige un error a la vez</b> y vuelve a ejecutar.</li></ol>',
          why: '<p>Programar es, en gran parte, encontrar y corregir errores. Con método, ningún error es imposible.</p>',
          when: '<p>Cuando el programa falla y no sabes por dónde empezar.</p>',
          how: '// Aislar una función sospechosa:\nconsole.log(energiaTotal([{ nombre: "A", energia: 10 }])); // ¿da 10?\nconsole.log(distritosCriticos([{ nombre: "A", energia: 5 }])); // ¿da ["A"]?',
          mistakes: ['Cambiar muchas cosas a la vez sin volver a ejecutar.', 'Ignorar los consejos 💡 y los errores silenciosos (mayúsculas en propiedades).'],
          analogy: 'Como un detective: no adivina, reúne pistas (errores, consola, árbol) y descarta sospechosos uno por uno.'
        },
        observe: {
          intro: 'Esta es la aplicación <b>completa y funcionando</b>. Ejecútala, repara distritos y agrega uno nuevo desde el escenario. En el reto, el virus habrá dañado una copia.',
          code: APP,
          steps: [
            { lines: [1, 17], text: 'Funciones de datos: total y críticos.' },
            { lines: [19, 27], text: 'Estado de la ciudad, que reutiliza distritosCriticos.' },
            { lines: [29, 49], text: 'pintarDistritos: crea un li con su texto y su botón Reparar.' },
            { lines: [51, 62], text: 'Resumen y función actualizar() que repinta todo.' },
            { lines: [64, 76], text: 'El formulario para agregar distritos y la primera llamada a actualizar(). ¡Interactúa con el escenario!' }
          ],
          result: '<p>Datos → funciones → DOM → eventos → datos… Este ciclo es la base de todas las aplicaciones web.</p>'
        },
        experiment: {
          code: APP,
          ideas: ['Agrega un distrito con energía 5 y mira cómo cambia el estado.', 'Cambia el umbral de crítico a 50.', 'Haz que el botón Reparar sume 20 en vez de poner 100.']
        },
        solve: {
          activity: 'H',
          title: 'El virus del Núcleo',
          story: 'El virus alteró cinco partes del código del Núcleo. Algunos errores detienen el programa; otros son silenciosos.',
          goal: '<p>Depura el programa hasta que el Núcleo funcione: lista de 5 distritos con su botón, total <b>265</b>, estado <b>alerta</b> (con sus clases) y botones de reparación operativos.</p>',
          starter: SABOTAGED,
          tests: [
            { label: 'La lista muestra los 5 distritos', check: function (t) { return t.$$('#lista-distritos li').length === 5 || 'La lista tiene ' + t.$$('#lista-distritos li').length + ' elementos.'; } },
            { label: 'El total es 265', check: function (t) { return t.text('#total') === '265' || '#total dice «' + t.text('#total') + '».'; } },
            { label: 'Solo Sur y Oeste son críticos y el estado es «alerta»', check: function (t) { var crit = t.$$('#lista-distritos li.critico').length; if (crit !== 2) return 'Hay ' + crit + ' distritos marcados como críticos.'; return t.call('distritosCriticos', t.get('distritos')).length === 2 && t.text('#estado') === 'alerta' || 'El estado dice «' + t.text('#estado') + '». Revisa distritosCriticos.'; } },
            { label: '#estado tiene las clases «estado alerta»', check: function (t) { return (t.cls('#estado', 'estado') && t.cls('#estado', 'alerta')) || 'Clases de #estado: «' + t.$('#estado').className + '».'; } },
            { label: 'Reparar Oeste actualiza el total a 355', check: function (t) { var li = t.$$('#lista-distritos li').filter(function (x) { return /Oeste/.test(x.textContent); })[0]; if (!li) return 'No encuentro Oeste.'; t.click(li.querySelector('button')); return t.text('#total') === '355' || 'Tras reparar Oeste el total es ' + t.text('#total') + '.'; } }
          ],
          hints: ['Empieza por el error que detiene el programa (mira la consola y la línea indicada).', 'Luego prueba cada función por separado: ¿energiaTotal cuenta el primer distrito? ¿distritosCriticos usa el operador correcto?', 'Hay un error silencioso de mayúsculas en una propiedad (los consejos 💡 te ayudan).'],
          success: 'Virus eliminado. El Núcleo vuelve a responder.'
        },
        prove: {
          activity: 'G',
          title: 'Centro de control definitivo',
          story: 'Para reactivar Neópolis por completo, el centro de control necesita dos funciones finales.',
          goal: '<p>Partiendo de la aplicación completa (ya está en el editor), agrega:</p><ol><li><b>Reparar todo</b>: al pulsar <b>#reparar-todo</b>, todos los distritos pasan a energía 100 (usa un ciclo) y se actualiza la pantalla.</li><li><b>Buscador</b>: al escribir en <b>#buscar</b> (evento <b>input</b>), la lista muestra solo los distritos cuyo nombre contiene lo escrito, sin distinguir mayúsculas. Si el buscador está vacío, se muestran todos. El resumen siempre refleja <b>todos</b> los distritos.</li></ol>',
          starter: APP + '\n\n// ── Tu código final ──\n',
          requires: [[/["'`]input["'`]/, 'Usa el evento `input` en el buscador']],
          tests: [
            { label: '«Reparar todo» → todos al 100%, total 500 y estado «estable»', check: function (t) { t.click('#reparar-todo'); var all = t.get('distritos').every(function (d) { return d.energia === 100; }); if (!all) return 'No todos los distritos quedaron en 100.'; return (t.text('#total') === '500' && t.text('#estado') === 'estable' && t.$$('#lista-distritos li.critico').length === 0) || 'Total «' + t.text('#total') + '», estado «' + t.text('#estado') + '».'; } },
            { label: 'Buscar «nor» → solo Norte', setup: '// buscar', check: function (t) { t.write('#buscar', 'nor'); var li = t.$$('#lista-distritos li'); return (li.length === 1 && /Norte/.test(li[0].textContent)) || 'Con «nor» se muestran ' + li.length + ' distritos.'; } },
            { label: 'Buscar «E» (mayúscula) → Norte, Este, Oeste y Centro', setup: '// buscar 2', check: function (t) { t.write('#buscar', 'E'); var n = t.$$('#lista-distritos li').length; return n === 4 || 'Con «E» se muestran ' + n + ' distritos (se esperaban 4: la búsqueda no distingue mayúsculas).'; } },
            { label: 'Buscador vacío → los 5 distritos; el resumen usa todos', setup: '// buscar 3', check: function (t) { t.write('#buscar', 'sur'); if (t.text('#total') !== '265') return 'Al filtrar, el total cambió a ' + t.text('#total') + ': el resumen debe usar todos los distritos.'; t.write('#buscar', ''); return t.$$('#lista-distritos li').length === 5 || 'Con el buscador vacío se muestran ' + t.$$('#lista-distritos li').length + ' distritos.'; } }
          ],
          hints: ['Reparar todo: un ciclo sobre <code>distritos</code> y luego <code>actualizar()</code>.', 'Buscador: arma un arreglo nuevo con los distritos cuyo <code>nombre.toLowerCase()</code> incluya (<code>.includes()</code>) el texto buscado en minúsculas, y pásalo a <code>pintarDistritos</code>.', 'Para que el filtro no se pierda al reparar, puedes hacer que actualizar() lea el buscador y pinte la lista filtrada.'],
          celebrate: '🏙️ ¡NEÓPOLIS REACTIVADA!',
          success: '¡Lo lograste! Escribiste, depuraste y completaste una aplicación interactiva real. Neópolis brilla gracias a tu JavaScript.'
        }
      }
    ]
  });
})();
