/* =====================================================================
   BLOQUE 6 · Torre de Interfaces — Introducción al DOM
   Mundo: página web real dentro del entorno aislado + árbol DOM visual.
   Cuando el código selecciona un elemento, se ilumina en la página y en
   el árbol.
   ===================================================================== */
(function () {
  'use strict';

  // Estilos compartidos de los paneles de la torre
  var CSS = [
    '.panel{background:linear-gradient(160deg,#13204a,#0b1430);border:1px solid #2c3d73;border-radius:14px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,.4);max-width:560px}',
    '.panel h1{font-size:20px;color:#67e8f9;letter-spacing:.05em}',
    '.panel h2{font-size:18px}',
    '.mensaje{color:#cbd5e1}',
    '.fila{display:flex;gap:12px;align-items:center;margin:8px 0;flex-wrap:wrap}',
    '.foco{width:46px;height:46px;border-radius:50%;background:#334155;border:3px solid #475569;transition:all .4s}',
    '.foco.grande{width:70px;height:70px}',
    '.foco.encendido{background:#fde047;border-color:#fef08a;box-shadow:0 0 24px 8px rgba(253,224,71,.6)}',
    '.estado{display:inline-block;padding:4px 12px;border-radius:999px;background:#7f1d1d;color:#fecaca}',
    '.pantalla{font-family:ui-monospace,Consolas,monospace;background:#020617;border:1px solid #22d3ee;border-radius:8px;padding:8px 10px;color:#86efac}',
    '.aviso{color:#fbbf24}',
    '.reactor{width:110px;height:110px;display:flex;align-items:center;justify-content:center;font-size:44px;background:#334155;border:3px solid #64748b;transition:all .5s;margin:8px 0}',
    '.indicador{display:inline-block;width:46px;padding:8px 0;text-align:center;margin-right:6px;border-radius:8px;background:#1e293b;border:1px solid #334155;transition:all .3s}',
    '.modulo{display:inline-block;padding:8px 12px;margin:4px;border-radius:10px;background:#1e293b;border:1px solid #334155;transition:all .3s}',
    '.modulo.activo{background:#14532d;border-color:#22c55e;box-shadow:0 0 12px rgba(34,197,94,.5)}',
    '.modulo.verde{background:#14532d;border-color:#22c55e}.modulo.rojo{background:#7f1d1d;border-color:#ef4444}',
    '.barra-wrap{height:18px;background:#1e293b;border-radius:99px;overflow:hidden;border:1px solid #334155;margin:8px 0}',
    '#barra{height:100%;width:5%;background:#22d3ee;transition:all .6s}',
    '#barra.baja{background:#ef4444}',
    '.edificio{display:grid;grid-template-columns:repeat(3,54px);gap:8px;padding:12px;background:#111827;border:2px solid #334155;border-radius:10px;width:max-content}',
    '.ventana{height:44px;background:#1e293b;border:2px solid #334155;border-radius:4px;transition:all .3s}',
    '.ventana.luz{background:#fde68a;box-shadow:0 0 14px rgba(253,230,138,.7)}',
    '.indicador-temp{font:700 28px ui-monospace,Consolas,monospace;padding:14px 20px;border-radius:12px;display:inline-block;border:2px solid #475569;background:#1e293b;transition:all .4s}',
    '.indicador-temp.ok{border-color:#22c55e;color:#86efac}.indicador-temp.alerta{border-color:#f59e0b;color:#fde68a}.indicador-temp.critico{border-color:#ef4444;color:#fecaca;box-shadow:0 0 20px rgba(239,68,68,.6)}',
    '.chip{display:inline-block;font-size:22px;margin:3px}'
  ].join('\n');

  function page(html) { return { world: 'page', html: html, css: CSS }; }

  var P61 = page('<div id="panel" class="panel">\n  <h1 id="titulo">Torre de Interfaces</h1>\n  <p id="mensaje" class="mensaje">Sistema sin datos</p>\n  <div id="foco" class="foco"></div>\n</div>');
  var P62 = page('<div class="panel">\n  <h2 class="estado">Desconectado</h2>\n  <p id="mensaje" class="mensaje">Esperando conexión…</p>\n  <p id="pantalla" class="pantalla">---</p>\n  <p id="aviso" class="aviso">Revisar sistema</p>\n</div>');
  var P63 = page('<div class="panel">\n  <h1 id="titulo">Reactor</h1>\n  <div id="reactor" class="reactor">⚛</div>\n  <div class="fila"><span class="indicador">A</span><span class="indicador">B</span><span class="indicador">C</span></div>\n  <p id="info">Sin información</p>\n</div>');
  var P64 = page('<div class="panel">\n  <h1>Sala de máquinas</h1>\n  <div class="fila"><div id="lampara" class="foco grande"></div></div>\n  <div class="fila"><div id="foco1" class="foco"></div><div id="foco2" class="foco encendido"></div><div id="foco3" class="foco"></div></div>\n</div>');
  var P64b = page('<div class="panel">\n  <h1>Edificio de oficinas</h1>\n  <div class="edificio">\n    <div class="ventana luz"></div><div class="ventana"></div><div class="ventana luz"></div>\n    <div class="ventana luz"></div><div class="ventana"></div><div class="ventana"></div>\n  </div>\n</div>');
  var P65 = page('<div class="panel">\n  <h1>Monitor térmico</h1>\n  <div id="indicador" class="indicador-temp ok">-- °C</div>\n</div>');
  var P65b = page('<div class="panel">\n  <h1>Diagnóstico de módulos</h1>\n  <span class="modulo">OK</span><span class="modulo">Error</span><span class="modulo">OK</span><span class="modulo">Error</span><span class="modulo">OK</span>\n</div>');
  var P66 = page('<div class="panel">\n  <h1 id="titulo">Torre fuera de línea</h1>\n  <div class="fila"><span class="modulo">Radar</span><span class="modulo">Antena</span><span class="modulo">Escudo</span><span class="modulo">Comms</span></div>\n  <div class="barra-wrap"><div id="barra"></div></div>\n  <p>Energía: <b id="porcentaje">0%</b></p>\n</div>');

  CQ.Levels.register({
    n: 6,
    name: 'Torre de Interfaces',
    topic: 'El DOM: document, árbol de nodos, getElementById, querySelector(All), textContent, innerHTML, style y classList',
    icon: '🌳',
    color: '#e879f9',
    intro: 'Las pantallas de la Torre de Interfaces muestran datos viejos y colores equivocados. Para repararlas, JavaScript debe <b>encontrar</b> los elementos de la página y <b>modificarlos</b>. Bienvenido/a al <b>DOM</b>.',
    concepts: ['¿Qué es el DOM?', 'HTML ↔ JavaScript', 'Árbol de nodos', 'document', 'getElementById()', 'querySelector()', 'querySelectorAll()', 'textContent', 'innerHTML', 'style', 'classList'],
    levels: [
      /* ------------------------------ 6.1 ------------------------------ */
      {
        title: 'El árbol de la página',
        story: 'La torre tiene una página con un título, un mensaje y un foco. A la derecha verás el <b>árbol DOM</b>: el mapa que JavaScript usa para encontrar cada elemento.',
        scene: P61,
        learn: {
          what: '<p>El <b>DOM</b> (Document Object Model) es la representación que el navegador crea de una página HTML: un <b>árbol</b> de <b>nodos</b>. Cada etiqueta es un nodo-elemento y el texto dentro de ellas es un nodo de texto.</p>',
          why: '<p>JavaScript no modifica el archivo HTML: modifica el <b>DOM</b>, y el navegador redibuja la página al instante. Así funcionan todas las páginas interactivas.</p>',
          when: '<p>Siempre que tu código necesite leer o cambiar algo que se ve en la página.</p>',
          how: '// "document" es la raíz del árbol: la página completa\nlet titulo = document.getElementById("titulo");\nconsole.log(titulo.textContent);  // "Torre de Interfaces"',
          howNote: '<p><code>document.getElementById("titulo")</code> busca en el árbol el elemento cuyo atributo <code>id</code> sea <b>titulo</b> y lo devuelve. Si no existe, devuelve <code>null</code>.</p>',
          symbols: [['document', 'Objeto que representa toda la página.'], ['getElementById("x")', 'Busca el elemento con id="x". El id va <b>sin</b> #.'], ['null', 'Valor que significa "no se encontró nada".']],
          mistakes: ['Escribir <code>getElementByID</code> (la d final es minúscula).', 'Poner # dentro de getElementById.', 'Olvidar que los ids distinguen mayúsculas: "Titulo" ≠ "titulo".'],
          analogy: 'El DOM es como un árbol genealógico de la página: <code>body</code> es madre de <code>div</code>, que es madre del <code>h1</code> y el <code>p</code> (hermanos entre sí). Con el id, encuentras a una persona concreta sin recorrer toda la familia.',
          extra: '<div class="lcard wide"><h3>HTML → DOM</h3>' + CQ.Highlight.block('<div id="panel">\n  <h1 id="titulo">Torre</h1>\n  <p id="mensaje">Sin datos</p>\n</div>') + '<p>se convierte en el árbol:</p><pre class="code-block" style="padding:8px 12px">document\n └─ html\n     └─ body\n         └─ div#panel\n             ├─ h1#titulo → "Torre"\n             └─ p#mensaje → "Sin datos"</pre></div>'
        },
        observe: {
          intro: 'Fíjate en el <b>árbol DOM</b> y en la página: cada vez que el código selecciona un elemento, ambos se iluminan.',
          code: 'let titulo = document.getElementById("titulo");\nconsole.log(titulo);\nconsole.log(titulo.textContent);',
          steps: [
            { lines: [1, 1], text: 'JavaScript busca el nodo con id <b>titulo</b>. Mira cómo se ilumina en el árbol y en la página.' },
            { lines: [2, 2], text: 'La variable guarda el <b>elemento</b> (el nodo), no solo su texto. La consola lo muestra como etiqueta.' },
            { lines: [3, 3], text: '<code>textContent</code> es el texto que contiene ese elemento.' }
          ],
          result: '<p>Una variable puede guardar un <b>elemento de la página</b>. A partir de ahí puedes leerlo y cambiarlo.</p>'
        },
        experiment: {
          code: 'let elemento = document.getElementById("mensaje");\nconsole.log(elemento);\nconsole.log(elemento.textContent);\n',
          ideas: ['Busca el elemento con id "panel".', 'Busca un id que no existe, como "radar": ¿qué devuelve?', 'Haz clic en un nodo del árbol para ubicarlo en la página.']
        },
        solve: {
          activity: 'D',
          title: 'Encuentra el foco',
          story: 'El foco de emergencia no responde. Primero hay que encontrarlo.',
          goal: '<p>Busca el elemento con id <b>foco</b>, guárdalo en una variable llamada <code>foco</code> y muéstralo en la consola.</p>',
          starter: '',
          requires: [[/getElementById|querySelector/, 'Usa `getElementById` (o `querySelector`)']],
          tests: [
            { label: 'La variable `foco` contiene el elemento #foco', check: function (t) { if (!t.has('foco')) return 'No existe la variable foco.'; var v = t.get('foco'); if (v === null) return 'foco vale null: no se encontró el elemento. Revisa el id.'; return v === t.$('#foco') || 'foco no contiene el elemento con id "foco".'; } },
            { label: 'Se muestra el elemento en la consola', check: function (t) { return t.logs.some(function (l) { return /id="foco"/.test(l); }) || 'Muestra la variable foco con console.log.'; } }
          ],
          hints: ['Usa el método de <code>document</code> que busca por id.', 'El id va entre comillas y sin #.', 'Ejemplo distinto: <code>let boton = document.getElementById("enviar");</code>'],
          celebrate: '✔ ELEMENTO LOCALIZADO',
          success: '¡Encontraste el foco en el árbol! Seleccionar es el primer paso para modificar.'
        },
        prove: {
          activity: 'C',
          mode: 'predict',
          title: 'Una letra lo cambia todo',
          story: 'Un técnico escribió este código para leer el mensaje del panel.',
          goal: '<p>Recuerda que en la página el párrafo tiene <code>id="mensaje"</code>. ¿Qué mostrará la consola?</p>',
          code: 'let x = document.getElementById("Mensaje");\nconsole.log(x);',
          options: ['&lt;p id="mensaje" class="mensaje"&gt;', 'null', 'Error: Mensaje is not defined', 'Sistema sin datos'],
          answer: 1,
          explain: 'Los ids distinguen mayúsculas y minúsculas: "Mensaje" no es igual a "mensaje". getElementById no lanza error: devuelve <code>null</code> cuando no encuentra nada. Si después intentaras usar <code>x.textContent</code>, entonces sí habría un error.',
          wrongHint: '¿El id del código coincide exactamente (letra por letra) con el de la página?',
          hints: ['Compara mayúsculas y minúsculas.', '¿Qué devuelve getElementById cuando no encuentra nada?', 'Repasa la sección «Símbolos nuevos» de Aprende.'],
          success: 'Exacto: null. Ahora reconocerás este error al instante.'
        }
      },

      /* ------------------------------ 6.2 ------------------------------ */
      {
        title: 'Cambia el mensaje',
        story: 'Las pantallas de la torre muestran mensajes desactualizados.',
        scene: P62,
        learn: {
          what: '<p><code>querySelector()</code> busca el <b>primer</b> elemento que coincide con un <b>selector CSS</b>. <code>textContent</code> permite <b>leer</b> o <b>cambiar</b> el texto de un elemento.</p>',
          why: '<p>Con selectores CSS puedes encontrar elementos por id, clase, etiqueta o combinaciones. Y cambiar textos es la forma más básica de actualizar una página.</p>',
          when: '<p>Para mostrar resultados, mensajes, puntajes, estados…</p>',
          how: 'document.querySelector("#mensaje");   // por id (con #)\ndocument.querySelector(".estado");    // por clase (con .)\ndocument.querySelector("h2");         // por etiqueta\n\nlet m = document.querySelector("#mensaje");\nm.textContent = "¡Conectado!";       // cambia el texto',
          symbols: [['#', 'En un selector: busca por id.'], ['.', 'En un selector: busca por clase.'], ['textContent', 'El texto del elemento. Leer: <code>el.textContent</code>. Cambiar: <code>el.textContent = "…"</code>.']],
          mistakes: ['Olvidar el # o el punto: <code>querySelector("mensaje")</code> busca una etiqueta &lt;mensaje&gt;.', 'Escribir <code>textcontent</code> en minúsculas: no da error, ¡pero no cambia nada!', 'Usar getElementById con #.'],
          analogy: 'Un selector es como una dirección: "#mensaje" es "la casa con el número mensaje"; ".estado" es "la primera casa pintada de color estado".'
        },
        observe: {
          code: 'let mensaje = document.querySelector("#mensaje");\nconsole.log(mensaje.textContent);\nmensaje.textContent = "¡Sistema en línea!";',
          steps: [
            { lines: [1, 1], text: 'Selecciona el párrafo con id "mensaje" (fíjate en el #).' },
            { lines: [2, 2], text: 'Lee su texto actual.' },
            { lines: [3, 3], text: 'Asigna un texto nuevo: la página cambia de inmediato. Mira el nodo de texto en el árbol.' }
          ],
          result: '<p>Leer y escribir <code>textContent</code> usa el mismo nombre: la diferencia es si hay un <code>=</code>.</p>'
        },
        experiment: {
          code: 'let estado = document.querySelector(".estado");\nestado.textContent = "Reiniciando…";\n',
          ideas: ['Cambia el texto de la pantalla (#pantalla).', 'Prueba <code>document.querySelector("p")</code>: ¿cuál párrafo selecciona?', 'Escribe <code>textcontent</code> en minúsculas: ¿cambia algo? ¿hay error?']
        },
        solve: {
          activity: 'G',
          title: 'Torre en línea',
          story: 'La conexión volvió. Actualiza los textos de la pantalla principal.',
          goal: '<p>Usa <code>querySelector</code> para:</p><ul><li>cambiar el texto del elemento con clase <b>estado</b> a <b>Conectado</b>;</li><li>cambiar el texto del párrafo <b>#mensaje</b> por un mensaje de bienvenida que contenga la palabra <b>Neópolis</b>.</li></ul>',
          starter: '',
          requires: [[/querySelector\s*\(/, 'Usa `querySelector`']],
          tests: [
            { label: 'El estado dice «Conectado»', check: function (t) { return t.text('.estado') === 'Conectado' || 'El estado dice «' + t.text('.estado') + '».'; } },
            { label: 'El mensaje menciona Neópolis', check: function (t) { return t.norm(t.text('#mensaje')).indexOf('neopolis') >= 0 || 'El mensaje dice «' + t.text('#mensaje') + '».'; } }
          ],
          hints: ['Para clases el selector empieza con punto; para ids, con #.', 'Primero selecciona, después asigna <code>textContent</code>.', 'Ejemplo distinto: <code>document.querySelector(".titulo").textContent = "Hola";</code>'],
          success: 'Pantallas actualizadas.'
        },
        prove: {
          activity: 'H',
          title: 'Pantallas que no cambian',
          story: 'Este programa debería actualizar la pantalla y el aviso, pero falla de varias formas. Ejecútalo, mira el árbol (¿qué se selecciona?) y repáralo.',
          goal: '<p>La pantalla <b>#pantalla</b> debe decir <b>Energía: 100%</b> y el aviso <b>#aviso</b> debe decir <b>Todo en orden</b>.</p>',
          starter: 'let pantalla = document.querySelector("pantalla");\npantalla.textContent = "Energía: 100%";\nlet aviso = document.getElementById("#aviso");\naviso.textcontent = "Todo en orden";\n',
          tests: [
            { label: 'La pantalla dice «Energía: 100%»', check: function (t) { return t.text('#pantalla') === 'Energía: 100%' || 'La pantalla dice «' + t.text('#pantalla') + '».'; } },
            { label: 'El aviso dice «Todo en orden»', check: function (t) { return t.text('#aviso') === 'Todo en orden' || 'El aviso dice «' + t.text('#aviso') + '».'; } }
          ],
          hints: ['Hay tres errores. Cada uno es de un tipo distinto.', 'Revisa cuándo se usa # y cuándo no.', 'Hay una propiedad con mayúsculas incorrectas: no produce error, pero no funciona.'],
          success: 'Pantallas reparadas. Distingues selectores y propiedades como un/a profesional.'
        }
      },

      /* ------------------------------ 6.3 ------------------------------ */
      {
        title: 'Colores y estilos',
        story: 'El reactor de la torre debe cambiar de color según su estado, y los indicadores están apagados.',
        scene: P63,
        learn: {
          what: '<p>La propiedad <code>style</code> de un elemento permite cambiar su CSS desde JavaScript. Los nombres con guion pasan a <b>camelCase</b>: <code>background-color</code> → <code>backgroundColor</code>.</p><p><code>innerHTML</code> cambia el contenido <b>interpretando HTML</b>.</p>',
          why: '<p>Para dar retroalimentación visual: colores de estado, tamaños, mostrar u ocultar.</p>',
          when: '<p>Para cambios de estilo puntuales. (Para cambios reutilizables es mejor usar clases: lo verás en el siguiente nivel).</p>',
          how: 'let caja = document.querySelector("#reactor");\ncaja.style.backgroundColor = "lime";\ncaja.style.width = "160px";      // ¡con unidad!\ncaja.style.borderRadius = "50%";\n\nlet info = document.querySelector("#info");\ninfo.innerHTML = "Estado <strong>estable</strong>";',
          symbols: [['style.propiedad', 'Estilo en línea del elemento. Los valores son textos: <code>"20px"</code>, <code>"red"</code>.'], ['camelCase', 'font-size → fontSize, border-radius → borderRadius.'], ['innerHTML', 'Contenido como HTML: las etiquetas se interpretan.']],
          mistakes: ['Escribir <code>style.background-color</code>: el guion se interpreta como una resta.', 'Olvidar la unidad: <code>"20"</code> en lugar de <code>"20px"</code>.', '<b>Precaución:</b> nunca pongas con <code>innerHTML</code> un texto escrito por una persona usuaria: podría inyectar código. Para textos, usa <code>textContent</code>.'],
          analogy: '<code>textContent</code> es como escribir con un rotulador: lo que escribes aparece tal cual. <code>innerHTML</code> es como enviar instrucciones a una imprenta: las etiquetas se convierten en formato.'
        },
        observe: {
          code: 'let caja = document.querySelector("#reactor");\ncaja.style.backgroundColor = "lime";\ncaja.style.width = "160px";\ncaja.style.borderRadius = "50%";\ndocument.querySelector("#info").innerHTML = "Estado <strong>estable</strong>";',
          steps: [
            { lines: [1, 1], text: 'Seleccionamos el reactor.' },
            { lines: [2, 2], text: 'Cambia el color de fondo. En el árbol aparece 🎨: el nodo tiene estilos en línea.' },
            { lines: [3, 4], text: 'Ancho con unidad (px) y bordes redondeados.' },
            { lines: [5, 5], text: '<code>innerHTML</code> crea un nodo <code>&lt;strong&gt;</code> nuevo dentro de #info: ¡míralo en el árbol!' }
          ],
          result: '<p>Con <code>style</code> cambiaste el aspecto; con <code>innerHTML</code> cambiaste la <b>estructura</b> del árbol.</p>'
        },
        experiment: {
          code: 'let caja = document.querySelector("#reactor");\ncaja.style.backgroundColor = "lime";\ncaja.style.width = "160px";\n',
          ideas: ['Prueba otros colores: "tomato", "#e879f9", "rgb(0, 200, 255)".', 'Cambia <code>caja.style.fontSize</code>.', 'Escribe <code>innerHTML</code> y <code>textContent</code> con el mismo texto con etiquetas: ¿qué diferencia ves?']
        },
        solve: {
          activity: 'A',
          title: 'Reactor naranja',
          story: 'El reactor debe indicar "precaución" con color naranja y bordes suaves.',
          goal: '<p>Completa los <code>___</code>: selecciona el reactor (id <b>reactor</b>), pon su color de fondo en <b>orange</b> y sus esquinas redondeadas en <b>20px</b>.</p>',
          starter: 'let reactor = document.querySelector("___");\nreactor.style.___ = "orange";       // color de fondo\nreactor.style.borderRadius = "___"; // esquinas de 20px\n',
          tests: [
            { label: 'El fondo del reactor es naranja', check: function (t) { return t.css('#reactor', 'backgroundColor') === 'rgb(255, 165, 0)' || 'El fondo es ' + t.css('#reactor', 'backgroundColor') + '.'; } },
            { label: 'Las esquinas tienen 20px', check: function (t) { return t.css('#reactor', 'borderTopLeftRadius') === '20px' || 'El radio es ' + t.css('#reactor', 'borderTopLeftRadius') + '. ¿Incluiste la unidad px?'; } }
          ],
          hints: ['El selector de un id empieza con #.', 'background-color en JavaScript se escribe en camelCase.', 'Las medidas llevan unidad: "20px".'],
          success: 'Reactor en modo precaución.'
        },
        prove: {
          activity: 'G',
          title: 'Panel de indicadores',
          story: 'El jefe de turno pide resaltar información del reactor.',
          goal: '<ul><li>Pon el fondo del <b>primer</b> elemento con clase <b>indicador</b> de color verde (<b>green</b>).</li><li>Cambia el tamaño de letra (<code>fontSize</code>) de <b>#titulo</b> a <b>32px</b>.</li><li>Usa <code>innerHTML</code> para que <b>#info</b> contenga: <code>Energía &lt;strong&gt;estable&lt;/strong&gt;</code></li></ul>',
          starter: '',
          requires: [[/innerHTML/, 'Usa `innerHTML`']],
          tests: [
            { label: 'El primer indicador es verde', check: function (t) { var m = /rgb\((\d+), (\d+), (\d+)/.exec(t.css('.indicador', 'backgroundColor') || ''); return (m && +m[2] > +m[1] && +m[2] > +m[3]) || 'El primer indicador no es verde.'; } },
            { label: 'El título mide 32px', check: function (t) { return t.css('#titulo', 'fontSize') === '32px' || 'El título mide ' + t.css('#titulo', 'fontSize') + '.'; } },
            { label: '#info contiene un <strong> con «estable»', check: function (t) { var s = t.$('#info strong'); return (!!s && s.textContent.trim() === 'estable') || 'No encuentro un elemento <strong> con el texto «estable» dentro de #info.'; } }
          ],
          hints: ['querySelector devuelve el <b>primer</b> elemento que coincide.', 'font-size → fontSize.', 'innerHTML recibe un texto que incluye las etiquetas.'],
          success: 'Panel de indicadores perfecto.'
        }
      },

      /* ------------------------------ 6.4 ------------------------------ */
      {
        title: 'Enciende y apaga',
        story: 'La sala de máquinas tiene focos controlados por <b>clases CSS</b>. La clase <code>encendido</code> ya está definida en el CSS: solo hay que ponerla o quitarla.',
        scene: P64,
        learn: {
          what: '<p><code>classList</code> permite agregar, quitar o alternar <b>clases CSS</b> de un elemento. El aspecto de cada clase lo define el CSS; JavaScript solo decide <b>cuándo</b> aplicarla.</p>',
          why: '<p>Es la forma recomendada de cambiar estilos: separa el diseño (CSS) del comportamiento (JS).</p>',
          when: '<p>Para estados visuales: encendido/apagado, activo, error, oculto…</p>',
          how: 'let foco = document.querySelector("#foco1");\nfoco.classList.add("encendido");      // agrega la clase\nfoco.classList.remove("encendido");   // la quita\nfoco.classList.toggle("encendido");   // si la tiene, la quita; si no, la agrega\nfoco.classList.contains("encendido"); // true o false',
          symbols: [['classList.add("x")', 'Agrega la clase x.'], ['classList.remove("x")', 'Quita la clase x.'], ['classList.toggle("x")', 'Alterna: interruptor.'], ['classList.contains("x")', 'Pregunta si la tiene.']],
          mistakes: ['Escribir el punto en el nombre: <code>add(".encendido")</code> ❌ (el punto solo va en los selectores).', 'Usar <code>classlist</code> en minúsculas.'],
          analogy: 'Las clases son como disfraces preparados en un armario (el CSS). JavaScript solo decide qué disfraz se pone o se quita cada elemento.'
        },
        observe: {
          intro: '<b>Código → Acción → Consecuencia.</b> Observa el antes y el después de la lámpara.',
          code: 'let lampara = document.querySelector("#lampara");\nlampara.classList.add("encendido");\nconsole.log(lampara.classList.contains("encendido"));\nlampara.classList.toggle("encendido");\nconsole.log(lampara.classList.contains("encendido"));',
          steps: [
            { lines: [1, 1], text: 'Localizamos la lámpara: se ilumina en el árbol.' },
            { lines: [2, 2], text: '<b>Antes:</b> gris. <b>Después:</b> amarilla. El árbol muestra la clase <code>.encendido</code> en el nodo.' },
            { lines: [3, 3], text: '<code>contains</code> confirma: true.' },
            { lines: [4, 5], text: '<code>toggle</code> la quita porque ya la tenía: apagada otra vez.' }
          ],
          result: '<p>No escribiste ni un color: solo cambiaste clases. El CSS se encargó del resto.</p>'
        },
        experiment: {
          code: 'document.querySelector("#lampara").classList.toggle("encendido");\n',
          ideas: ['Ejecuta varias veces: el toggle alterna.', 'Enciende los tres focos pequeños.', 'Escribe <code>add(".encendido")</code> con punto: ¿qué pasa?']
        },
        solve: {
          activity: 'D',
          title: 'Focos de la sala',
          story: 'Los focos 1 y 3 deben encenderse y el foco 2, que quedó prendido, debe apagarse.',
          goal: '<p>Agrega la clase <b>encendido</b> a <b>#foco1</b> y <b>#foco3</b>, y quítala de <b>#foco2</b>.</p>',
          starter: '',
          requires: [[/classList\s*\.\s*add/, 'Usa `classList.add`'], [/classList\s*\.\s*remove/, 'Usa `classList.remove`']],
          tests: [
            { label: '#foco1 encendido', check: function (t) { return t.cls('#foco1', 'encendido') || '#foco1 no tiene la clase encendido.'; } },
            { label: '#foco2 apagado', check: function (t) { return !t.cls('#foco2', 'encendido') || '#foco2 sigue encendido.'; } },
            { label: '#foco3 encendido', check: function (t) { return t.cls('#foco3', 'encendido') || '#foco3 no tiene la clase encendido.'; } }
          ],
          hints: ['Selecciona cada foco por su id.', 'El nombre de la clase va sin punto.', 'Ejemplo distinto: <code>document.querySelector("#menu").classList.add("abierto");</code>'],
          celebrate: '💡 ¡LUCES CORRECTAS!',
          success: 'Sala de máquinas iluminada correctamente.'
        },
        prove: {
          activity: 'G',
          title: 'Cambio de turno',
          story: 'Cambio de turno en el edificio de oficinas: las ventanas encendidas se apagan y las apagadas se encienden.',
          scene: P64b,
          goal: '<p>Hay 6 elementos con clase <b>ventana</b>. Usa <code>querySelectorAll</code> y un <b>ciclo</b> para alternar (<code>toggle</code>) la clase <b>luz</b> en todas.</p>',
          starter: '',
          requires: [[/querySelectorAll\s*\(/, 'Usa `querySelectorAll`'], [/classList\s*\.\s*toggle/, 'Usa `classList.toggle`'], [/\b(for|while)\s*\(|forEach/, 'Usa un ciclo']],
          tests: [
            { label: 'Las ventanas 1, 3 y 4 se apagaron', check: function (t) { var v = t.$$('.ventana'); return [0, 2, 3].every(function (i) { return !v[i].classList.contains('luz'); }) || 'Alguna ventana que estaba encendida sigue encendida.'; } },
            { label: 'Las ventanas 2, 5 y 6 se encendieron', check: function (t) { var v = t.$$('.ventana'); return [1, 4, 5].every(function (i) { return v[i].classList.contains('luz'); }) || 'Alguna ventana que estaba apagada no se encendió.'; } }
          ],
          hints: ['querySelectorAll devuelve una lista (NodeList) que se recorre como un arreglo.', 'Usa <code>.length</code> para saber cuántas hay.', 'Dentro del ciclo: <code>lista[i].classList.toggle(...)</code>.'],
          success: 'Cambio de turno completo con un solo ciclo.'
        }
      },

      /* ------------------------------ 6.5 ------------------------------ */
      {
        title: 'Clases de estado',
        story: 'El monitor térmico debe cambiar de color según la temperatura. Hay tres clases: <code>ok</code>, <code>alerta</code> y <code>critico</code>.',
        scene: P65,
        setup: 'var temperatura = 50;',
        learn: {
          what: '<p>Combinando <b>condicionales</b> y <code>classList</code>, la interfaz refleja el estado de los datos.</p>',
          why: '<p>Así funcionan los tableros, alertas y validaciones de cualquier aplicación.</p>',
          when: '<p>Cuando la apariencia depende de un valor.</p>',
          how: 'let panel = document.querySelector("#indicador");\npanel.classList.remove("ok", "alerta", "critico"); // quita varias a la vez\nif (temperatura > 80) {\n  panel.classList.add("critico");\n} else {\n  panel.classList.add("ok");\n}\npanel.textContent = temperatura + " °C";',
          mistakes: ['Agregar la clase nueva sin quitar la anterior: el elemento queda con dos estados.', 'Olvidar actualizar el texto.'],
          analogy: 'Como un semáforo: primero apagas todas las luces y después enciendes la que corresponde.'
        },
        observe: {
          code: 'let panel = document.querySelector("#indicador");\nif (temperatura > 80) {\n  panel.classList.add("critico");\n} else {\n  panel.classList.remove("critico");\n}\npanel.textContent = temperatura + " °C";',
          steps: [
            { lines: [1, 1], text: 'Seleccionamos el indicador.' },
            { lines: [2, 6], text: 'Con 50 °C la condición es false: se asegura de que no tenga la clase crítico.' },
            { lines: [7, 7], text: 'Se actualiza el texto con el valor y la unidad.' }
          ],
          result: '<p>La interfaz ahora depende de un dato. Prueba otros valores en el laboratorio.</p>'
        },
        experiment: {
          code: 'let panel = document.querySelector("#indicador");\nif (temperatura > 80) {\n  panel.classList.add("critico");\n} else {\n  panel.classList.remove("critico");\n}\npanel.textContent = temperatura + " °C";\n',
          controls: [{ var: 'temperatura', type: 'range', min: 0, max: 120, step: 1, value: 50 }],
          ideas: ['Lleva la temperatura a 95.', 'Observa en el árbol: con 95 el nodo tiene dos clases (ok y critico). ¿Es un problema?', 'Agrega la lógica para la clase alerta.']
        },
        solve: {
          activity: 'G',
          title: 'Monitor de tres estados',
          story: 'El monitor debe mostrar siempre un único estado.',
          goal: '<p><code>temperatura</code> ya existe. El elemento <b>#indicador</b> debe tener <b>exactamente una</b> de estas clases:</p><ul><li><b>ok</b> si es menor que 60;</li><li><b>alerta</b> si está entre 60 y 85 (incluidos);</li><li><b>critico</b> si es mayor que 85.</li></ul><p>Además, su texto debe mostrar la temperatura seguida de <b>°C</b> (por ejemplo «72 °C»). Ojo: el indicador <b>empieza con la clase ok</b>.</p>',
          starter: '',
          tests: [
            { label: '50 °C → solo «ok»', check: function (t) { var e = t.$('#indicador'); return (e.classList.contains('ok') && !e.classList.contains('alerta') && !e.classList.contains('critico')) || 'Clases actuales: ' + e.className; } },
            { label: '70 °C → solo «alerta»', setup: 'temperatura = 70;', check: function (t) { var e = t.$('#indicador'); return (e.classList.contains('alerta') && !e.classList.contains('ok') && !e.classList.contains('critico')) || 'Con 70 °C las clases son: ' + e.className + '. ¿Quitaste «ok»?'; } },
            { label: '85 °C → «alerta» (incluido)', setup: 'temperatura = 85;', check: function (t) { var e = t.$('#indicador'); return (e.classList.contains('alerta') && !e.classList.contains('critico')) || 'Con 85 °C debería ser alerta.'; } },
            { label: '90 °C → solo «critico»', setup: 'temperatura = 90;', check: function (t) { var e = t.$('#indicador'); return (e.classList.contains('critico') && !e.classList.contains('ok') && !e.classList.contains('alerta')) || 'Con 90 °C las clases son: ' + e.className + '.'; } },
            { label: 'El texto muestra la temperatura con °C', setup: 'temperatura = 72;', check: function (t) { var s = t.text('#indicador'); return (s.indexOf('72') >= 0 && s.indexOf('°C') >= 0) || 'El texto es «' + s + '».'; } }
          ],
          hints: ['Empieza quitando todas las clases de estado; luego agrega la correcta.', 'Usa una cadena if / else if / else.', '<code>classList.remove("a", "b", "c")</code> quita varias a la vez.'],
          success: 'Monitor confiable en todos los rangos.'
        },
        prove: {
          activity: 'E',
          mode: 'order',
          title: 'Diagnóstico de módulos',
          story: 'Cada módulo muestra «OK» o «Error». Su color debe reflejarlo.',
          scene: P65b,
          setup: '',
          goal: '<p>Ordena las piezas: el programa recorre todos los <b>.modulo</b>; si su texto es «Error» les agrega la clase <b>rojo</b>, y si no, la clase <b>verde</b>.</p>',
          lines: [
            'let modulos = document.querySelectorAll(".modulo");',
            'for (let i = 0; i < modulos.length; i++) {',
            '  if (modulos[i].textContent === "Error") {',
            '    modulos[i].classList.add("rojo");',
            '  } else {',
            '    modulos[i].classList.add("verde");',
            '  }',
            '}'
          ],
          tests: [
            { label: 'Los módulos con «Error» están en rojo', check: function (t) { return t.$$('.modulo').filter(function (m) { return m.textContent === 'Error'; }).every(function (m) { return m.classList.contains('rojo') && !m.classList.contains('verde'); }) || 'Algún módulo con Error no está solo en rojo.'; } },
            { label: 'Los módulos «OK» están en verde', check: function (t) { return t.$$('.modulo').filter(function (m) { return m.textContent === 'OK'; }).every(function (m) { return m.classList.contains('verde') && !m.classList.contains('rojo'); }) || 'Algún módulo OK no está solo en verde.'; } }
          ],
          hints: ['Primero hay que seleccionar; después recorrer.', 'Dentro del ciclo hay una decisión con dos ramas.', 'Cuenta las llaves: cada <code>{</code> necesita su <code>}</code>.'],
          success: 'Diagnóstico visual completo.'
        }
      },

      /* ------------------------------ 6.6 ------------------------------ */
      {
        title: 'Repara la interfaz',
        story: 'La consola central de la torre está fuera de línea. Es momento de usar todo lo que sabes del DOM.',
        scene: P66,
        setup: 'var energia = 72;',
        learn: {
          what: '<p>Reparar una interfaz combina: <b>seleccionar</b> (getElementById, querySelector, querySelectorAll), <b>modificar</b> (textContent, style, classList) y <b>decidir</b> (if, ciclos).</p>',
          why: '<p>Es exactamente lo que hacen las aplicaciones web: tomar datos y reflejarlos en la página.</p>',
          when: '<p>Cada vez que los datos cambian y la página debe mostrarlo.</p>',
          how: '// 1. Seleccionar\nconst barra = document.querySelector("#barra");\n// 2. Decidir\nif (energia < 30) {\n  barra.classList.add("baja");\n}\n// 3. Modificar\nbarra.style.width = energia + "%";',
          mistakes: ['Recorrer una NodeList con <code>&lt;=</code> length.', 'Usar <code>style.background-color</code> (con guion).', 'Olvidar el % o el px en las medidas.'],
          analogy: 'Como un técnico de mantenimiento: localiza la pieza, decide qué necesita y la ajusta.'
        },
        observe: {
          code: 'const barra = document.querySelector("#barra");\nbarra.style.width = energia + "%";\ndocument.querySelector("#porcentaje").textContent = energia + "%";\nconst modulos = document.querySelectorAll(".modulo");\nmodulos[0].classList.add("activo");',
          steps: [
            { lines: [1, 2], text: 'La barra se ajusta al porcentaje de energía (72%).' },
            { lines: [3, 3], text: 'El texto se actualiza con el mismo dato.' },
            { lines: [4, 5], text: 'querySelectorAll selecciona los 4 módulos (todos se iluminan en el árbol); activamos solo el primero.' }
          ],
          result: '<p>Un solo dato (<code>energia</code>) controla varias partes de la interfaz.</p>'
        },
        experiment: {
          code: 'const barra = document.querySelector("#barra");\nbarra.style.width = energia + "%";\ndocument.querySelector("#porcentaje").textContent = energia + "%";\n',
          controls: [{ var: 'energia', type: 'range', min: 0, max: 100, step: 1, value: 72 }],
          ideas: ['Activa todos los módulos con un ciclo.', 'Agrega la clase "baja" a la barra cuando la energía sea menor que 30.']
        },
        solve: {
          activity: 'H',
          title: 'Código saboteado',
          story: 'El virus final dejó este script lleno de errores. Ejecútalo varias veces, corrigiendo un error cada vez, y observa el árbol.',
          goal: '<p>El programa debe: cambiar el título <b>#titulo</b> a <b>Torre en línea</b>, agregar la clase <b>activo</b> a <b>todos</b> los <b>.modulo</b> y poner el fondo de <b>#barra</b> en <b>lime</b>.</p>',
          starter: 'const titulo = document.querySelector(".titulo");\ntitulo.textContent = "Torre en línea";\nconst modulos = document.querySelectorAll("modulo");\nfor (let i = 0; i <= modulos.length; i++) {\n  modulos[i].classlist.add("activo");\n}\ndocument.querySelector("#barra").style.background-color = "lime";\n',
          tests: [
            { label: 'El título dice «Torre en línea»', check: function (t) { return t.text('#titulo') === 'Torre en línea' || 'El título dice «' + t.text('#titulo') + '».'; } },
            { label: 'Todos los módulos están activos', check: function (t) { var m = t.$$('.modulo'); var n = m.filter(function (x) { return x.classList.contains('activo'); }).length; return n === m.length || n + ' de ' + m.length + ' módulos activos.'; } },
            { label: 'La barra es de color lime', check: function (t) { return t.css('#barra', 'backgroundColor') === 'rgb(0, 255, 0)' || 'El fondo de la barra es ' + t.css('#barra', 'backgroundColor') + '.'; } }
          ],
          hints: ['Corrige primero el error de sintaxis (el programa no arranca hasta entonces).', 'Luego revisa cada selector: ¿id o clase? ¿falta el punto?', 'Revisa el límite del ciclo y las mayúsculas de classList.'],
          success: 'Virus eliminado de la consola central.'
        },
        prove: {
          activity: 'G',
          title: 'Torre en línea',
          story: 'Última reparación: la consola central debe reflejar el nivel de energía de la torre, que cambia constantemente.',
          goal: '<p><code>energia</code> (0 a 100) ya existe. Escribe un programa que:</p><ol><li>cambie <b>#titulo</b> a <b>Torre en línea</b>;</li><li>agregue la clase <b>activo</b> a todos los <b>.modulo</b>;</li><li>ponga el ancho de <b>#barra</b> en <code>energia + "%"</code>;</li><li>muestre en <b>#porcentaje</b> el texto <code>energia + "%"</code>;</li><li>si la energía es <b>menor que 30</b>, agregue la clase <b>baja</b> a <b>#barra</b>.</li></ol>',
          starter: '',
          tests: [
            { label: 'Título y módulos activos', check: function (t) { if (t.text('#titulo') !== 'Torre en línea') return 'El título no dice «Torre en línea».'; return t.$$('.modulo').every(function (m) { return m.classList.contains('activo'); }) || 'No todos los módulos están activos.'; } },
            { label: 'Energía 72 → barra al 72% y texto «72%»', check: function (t) { if (t.$('#barra').style.width !== '72%') return 'El ancho de la barra es «' + t.$('#barra').style.width + '».'; if (t.text('#porcentaje') !== '72%') return 'El porcentaje dice «' + t.text('#porcentaje') + '».'; return !t.cls('#barra', 'baja') || 'Con 72% la barra no debería tener la clase baja.'; } },
            { label: 'Energía 15 → barra al 15% y con clase «baja»', setup: 'energia = 15;', check: function (t) { if (t.$('#barra').style.width !== '15%') return 'Con 15, el ancho es «' + t.$('#barra').style.width + '».'; return t.cls('#barra', 'baja') || 'Con energía 15 la barra debería tener la clase baja.'; } },
            { label: 'Energía 30 → sin clase «baja»', setup: 'energia = 30;', check: function (t) { return !t.cls('#barra', 'baja') || 'Con 30 no debería tener la clase baja («menor que 30»).'; } }
          ],
          hints: ['Divide el problema en los 5 pasos de la lista y resuélvelos uno por uno, ejecutando entre paso y paso.', 'Para "todos los módulos" necesitas querySelectorAll y un ciclo.', 'El ancho es un texto: el número más el símbolo %.'],
          success: '¡La Torre de Interfaces vuelve a brillar! Dominas la manipulación del DOM.'
        }
      }
    ],

    special: {
      title: 'Cazador del DOM',
      scene: page('<div class="panel">\n  <h1>Recolector de chips</h1>\n  <div id="zona"></div>\n  <p>Chips detectados: <b id="contador">?</b></p>\n</div>'),
      solve: {
        activity: 'G',
        title: 'Cazador del DOM',
        story: 'Cada día aparece una cantidad distinta de chips (<code>.chip</code>) en la zona.',
        setup: 'var __n = 5; for (var __k = 0; __k < __n; __k++) { var __c = document.createElement("span"); __c.className = "chip"; __c.textContent = "💾"; document.getElementById("zona").appendChild(__c); }',
        goal: '<p>Cuenta cuántos elementos con clase <b>chip</b> hay en la página y escribe ese número en <b>#contador</b>.</p>',
        starter: '',
        requires: [[/querySelectorAll|getElementsByClassName/, 'Selecciona todos los chips']],
        tests: [
          { label: 'Cuenta 5 chips', check: function (t) { return t.text('#contador') === '5' || '#contador dice «' + t.text('#contador') + '».'; } },
          { label: 'Funciona con otra cantidad (3 chips)', setup: 'document.querySelectorAll(".chip")[0].remove(); document.querySelectorAll(".chip")[0].remove();', check: function (t) { return t.text('#contador') === '3' || 'Con 3 chips, #contador dice «' + t.text('#contador') + '».'; } }
        ],
        hints: ['querySelectorAll devuelve una lista.', 'Las listas tienen <code>length</code>.', 'Asigna el número al textContent del contador.'],
        success: '¡Ningún chip escapa a tu selector!'
      }
    }
  });
})();
