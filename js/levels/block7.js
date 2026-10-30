/* =====================================================================
   BLOQUE 7 · Plaza Interactiva — Eventos e interactividad
   Mundo: página web real. Después de ejecutar, el estudiante puede
   interactuar con la página (clics, escritura) y ver la reacción.
   Las pruebas simulan clics y escritura de forma automática.
   ===================================================================== */
(function () {
  'use strict';

  var CSS = [
    '.panel{background:linear-gradient(160deg,#13204a,#0b1430);border:1px solid #2c3d73;border-radius:14px;padding:14px 16px;box-shadow:0 8px 24px rgba(0,0,0,.4);max-width:560px}',
    '.panel h1{font-size:20px;color:#67e8f9}',
    '.panel label{display:block;margin:8px 0}',
    '.mensaje{color:#cbd5e1;min-height:1.4em}',
    '.caja{padding:12px;border-radius:10px;background:#1e293b;border:2px solid #334155;margin-top:8px;transition:all .3s}',
    '.caja.alerta{background:#7f1d1d;border-color:#ef4444;box-shadow:0 0 18px rgba(239,68,68,.6)}',
    '.foco{width:70px;height:70px;border-radius:50%;background:#334155;border:3px solid #475569;transition:all .4s;margin:10px 0}',
    '.foco.on{background:#fde047;border-color:#fef08a;box-shadow:0 0 30px 10px rgba(253,224,71,.6)}',
    '.puerta{padding:2px 8px;border-radius:6px;background:#7f1d1d}',
    '.puerta.abierta{background:#14532d}',
    '#contador,#nivel{font:700 26px ui-monospace,Consolas,monospace;color:#fde68a}',
    '.barra-wrap{height:18px;background:#1e293b;border-radius:99px;overflow:hidden;border:1px solid #334155;margin:8px 0}',
    '#barra{height:100%;background:#22d3ee;transition:width .4s}',
    '#fuerza{padding:2px 8px;border-radius:6px;background:#7f1d1d}',
    '#fuerza.ok{background:#14532d}',
    '#resultado{padding:6px 10px;border-radius:8px;min-height:1.4em}',
    '#resultado.exito{background:#14532d}#resultado.error{background:#7f1d1d}',
    '#lista li,#pedidos li{margin:4px 0}',
    '#lista li button{padding:2px 8px;margin-left:8px;background:#7f1d1d}',
    '.aviso{color:#fca5a5;min-height:1.2em}',
    '.mapa{height:70px;border-radius:10px;background:#1e293b;border:2px dashed #334155;transition:all .4s;margin-top:8px}',
    '.mapa.norte{background:#1e3a8a}.mapa.sur{background:#14532d}.mapa.este{background:#7c2d12}',
    'body.noche{filter:brightness(.6) hue-rotate(200deg)}'
  ].join('\n');

  function page(html) { return { world: 'page', html: html, css: CSS }; }

  var P71 = page('<div class="panel">\n  <h1>Plaza Interactiva</h1>\n  <button id="saludar">Saludar</button>\n  <p id="salida" class="mensaje">…</p>\n  <button id="activar">Activar fuente</button>\n  <p>Fuente: <b id="estado">Inactiva</b></p>\n  <button id="alarma">Probar alarma</button>\n  <div id="panel" class="caja">Panel de seguridad</div>\n</div>');
  var P72 = page('<div class="panel">\n  <h1>Faro del puerto</h1>\n  <div id="lampara" class="foco"></div>\n  <button id="interruptor">Encender</button>\n  <label><input type="checkbox" id="sensor"> Sensor de movimiento</label>\n  <p><b id="puerta" class="puerta">Puerta cerrada</b></p>\n</div>');
  var P73 = page('<div class="panel">\n  <h1>Acceso a la plaza</h1>\n  <p>Visitantes: <b id="contador">0</b></p>\n  <button id="mas">+1</button><button id="menos">−1</button>\n</div>');
  var P73b = page('<div class="panel">\n  <h1>Regulador de energía</h1>\n  <p>Nivel: <b id="nivel">50</b></p>\n  <div class="barra-wrap"><div id="barra" style="width:50%"></div></div>\n  <button id="bajar">−10</button><button id="subir">+10</button>\n</div>');
  var P74 = page('<div class="panel">\n  <h1>Seguridad de la plaza</h1>\n  <label>Contraseña del sistema <input id="clave" type="password"></label>\n  <p>Fuerza: <b id="fuerza">—</b></p>\n  <label>Tu nombre <input id="nombre"></label>\n  <p>Vista previa: <span id="vista"></span></p>\n</div>');
  var P74b = page('<div class="panel">\n  <h1>Alta de robot</h1>\n  <input id="nombre" placeholder="Nombre">\n  <input id="edad" type="number" placeholder="Edad">\n  <button id="registrar">Registrar</button>\n  <p id="resultado"></p>\n</div>');
  var P75 = page('<div class="panel">\n  <h1>Tareas de mantenimiento</h1>\n  <input id="tarea" placeholder="Nueva tarea">\n  <button id="agregar">Agregar</button>\n  <ul id="lista"></ul>\n  <p>Total: <b id="total">0</b></p>\n</div>');
  var P76 = page('<div class="panel">\n  <h1>Centro de distritos</h1>\n  <select id="distrito">\n    <option value="">Elige un distrito</option>\n    <option value="norte">Norte</option>\n    <option value="sur">Sur</option>\n    <option value="este">Este</option>\n  </select>\n  <p id="info">Ningún distrito seleccionado</p>\n  <div id="mapa" class="mapa"></div>\n</div>');
  var P76b = page('<div class="panel">\n  <h1>Pedidos de energía</h1>\n  <input id="cantidad" type="number" placeholder="kWh">\n  <button id="pedir">Pedir</button>\n  <p id="error" class="aviso"></p>\n  <ul id="pedidos"></ul>\n  <p>Total: <b id="total">0</b> kWh</p>\n</div>');

  CQ.Levels.register({
    n: 7,
    name: 'Plaza Interactiva',
    topic: 'Eventos: addEventListener, click, input, change, formularios, value, createElement, appendChild y remove',
    icon: '🎛️',
    color: '#22d3ee',
    intro: 'La Plaza Interactiva tiene botones, interruptores y formularios… que no responden. Aprende a programar <b>eventos</b>: código que se ejecuta cuando la persona usuaria hace algo.',
    concepts: ['¿Qué es un evento?', 'addEventListener()', 'click', 'input', 'change', 'Formularios', '.value', 'createElement()', 'appendChild()', 'remove()'],
    levels: [
      /* ------------------------------ 7.1 ------------------------------ */
      {
        title: 'Botón funcional',
        story: 'Los botones de la plaza no hacen nada. Hay que decirles qué hacer <b>cuando</b> alguien los pulse.',
        scene: P71,
        learn: {
          what: '<p>Un <b>evento</b> es algo que ocurre en la página: un clic, una tecla, escribir en un campo… Con <code>addEventListener</code> le dices a un elemento: «cuando ocurra este evento, ejecuta esta función».</p>',
          why: '<p>Sin eventos, el código se ejecuta una vez al cargar y ya. Con eventos, la página <b>reacciona</b> a las personas.</p>',
          when: '<p>Siempre que algo deba ocurrir como respuesta a una acción del usuario.</p>',
          how: 'let boton = document.querySelector("#saludar");\nboton.addEventListener("click", function () {\n  // esto se ejecuta CADA VEZ que se hace clic\n  console.log("¡Clic!");\n});',
          symbols: [['addEventListener', '«Agregar un oyente»: el elemento queda escuchando un evento.'], ['"click"', 'El tipo de evento (sin "on").'], ['function () { }', 'La función que se ejecutará cuando ocurra. No se ejecuta al escribirla: se guarda para después.']],
          mistakes: ['Escribir <code>"onclick"</code> en lugar de <code>"click"</code>.', 'Pasar <code>miFuncion()</code> con paréntesis: la ejecuta de inmediato en vez de esperar al clic. Se pasa <code>miFuncion</code>.', 'Olvidar cerrar <code>});</code> al final.'],
          analogy: 'Es como un timbre: instalarlo (addEventListener) no hace sonar nada. Suena cada vez que alguien lo presiona.'
        },
        observe: {
          intro: 'Ejecuta el ejemplo y luego <b>haz clic en el botón «Saludar»</b> dentro del escenario.',
          code: 'let boton = document.querySelector("#saludar");\nboton.addEventListener("click", function () {\n  document.querySelector("#salida").textContent = "¡Hola, Neópolis!";\n  console.log("Alguien hizo clic");\n});\nconsole.log("Listo: haz clic en Saludar");',
          steps: [
            { lines: [1, 1], text: 'Seleccionamos el botón.' },
            { lines: [2, 5], run: false, text: 'Registramos un oyente para el evento <code>click</code>. Fíjate: el mensaje NO aparece todavía.' },
            { lines: [6, 6], upTo: 6, text: 'El programa termina, pero el oyente queda esperando. <b>Haz clic en «Saludar»</b> en el escenario: cada clic ejecuta la función.' }
          ],
          result: '<p>El código de dentro de la función se ejecuta <b>después</b>, cada vez que ocurre el evento. Esa es la programación orientada a eventos.</p>'
        },
        experiment: {
          code: 'let boton = document.querySelector("#saludar");\nboton.addEventListener("click", function () {\n  document.querySelector("#salida").textContent = "¡Hola, Neópolis!";\n});\n',
          ideas: ['Haz que el clic muestre otro texto.', 'Agrega un contador de clics con una variable.', 'Cambia "click" por "dblclick" (doble clic).']
        },
        solve: {
          activity: 'D',
          title: 'Activa la fuente',
          story: 'La fuente de la plaza debe activarse con su botón.',
          goal: '<p>Cuando se haga clic en <b>#activar</b>, el texto de <b>#estado</b> debe cambiar a <b>Activa</b>. Antes del clic, debe seguir diciendo «Inactiva».</p>',
          starter: '',
          requires: [[/addEventListener\s*\(\s*["'`]click["'`]/, 'Usa `addEventListener("click", …)`']],
          tests: [
            { label: 'Antes del clic, la fuente sigue «Inactiva»', check: function (t) { return t.text('#estado') === 'Inactiva' || 'El texto cambió antes del clic: el cambio debe ocurrir DENTRO de la función del evento.'; } },
            { label: 'Al hacer clic en #activar, dice «Activa»', check: function (t) { t.click('#activar'); return t.text('#estado') === 'Activa' || 'Después del clic, #estado dice «' + t.text('#estado') + '».'; } }
          ],
          hints: ['Primero selecciona el botón #activar.', 'El cambio de texto va dentro de la función que pasas a addEventListener.', 'Ejemplo distinto: <code>btn.addEventListener("click", function () { titulo.textContent = "Hola"; });</code>'],
          celebrate: '⛲ ¡FUENTE ACTIVA!',
          success: 'La fuente responde al botón. ¡Tu página reacciona!'
        },
        prove: {
          activity: 'B',
          title: 'La alarma no espera',
          story: 'Este código debería encender el panel de seguridad al pulsar «Probar alarma», pero falla.',
          goal: '<p>Corrige el código para que el panel <b>#panel</b> reciba la clase <b>alerta</b> solo <b>al hacer clic</b> en <b>#alarma</b>.</p>',
          starter: 'let boton = document.querySelector("#alarma");\nboton.addEventListener("onclick", sonar());\n\nfunction sonar() {\n  document.querySelector("#panel").classList.add("alerta");\n}\n',
          tests: [
            { label: 'Antes del clic, el panel NO está en alerta', check: function (t) { return !t.cls('#panel', 'alerta') || 'El panel entró en alerta sin que nadie hiciera clic: la función se está ejecutando de inmediato.'; } },
            { label: 'Al hacer clic, el panel entra en alerta', check: function (t) { t.click('#alarma'); return t.cls('#panel', 'alerta') || 'Después del clic el panel no tiene la clase alerta. ¿El nombre del evento es correcto?'; } }
          ],
          hints: ['Hay dos errores en la misma línea.', 'Los nombres de evento van sin "on".', 'Para que la función espere al clic, se pasa su nombre sin paréntesis.'],
          success: 'Alarma corregida: solo suena cuando debe.'
        }
      },

      /* ------------------------------ 7.2 ------------------------------ */
      {
        title: 'Interruptor',
        story: 'El faro del puerto necesita un interruptor que encienda y apague, y un sensor que abra la puerta.',
        scene: P72,
        learn: {
          what: '<p>Un <b>interruptor</b> alterna entre dos estados. Se programa con <code>classList.toggle</code> y, si hace falta recordar el estado, con una <b>variable booleana</b> que cambia con <code>!</code>.</p><p>El evento <code>change</code> se dispara cuando cambia un control de formulario, como una casilla (<code>checked</code>) o una lista.</p>',
          why: '<p>Modo oscuro, mostrar/ocultar, activar/desactivar: son interruptores.</p>',
          when: '<p>Cuando un mismo control alterna entre dos estados.</p>',
          how: 'let encendido = false;\nboton.addEventListener("click", function () {\n  encendido = !encendido;           // invierte el estado\n  lampara.classList.toggle("on");\n});\n\ncasilla.addEventListener("change", function () {\n  console.log(casilla.checked);     // true o false\n});',
          symbols: [['estado = !estado', 'Invierte un booleano.'], ['"change"', 'Evento de cambio en un control.'], ['.checked', 'true si la casilla está marcada.']],
          mistakes: ['Declarar la variable de estado <b>dentro</b> de la función: se reinicia en cada clic.', 'Usar <code>.value</code> en una casilla: para saber si está marcada se usa <code>.checked</code>.'],
          analogy: 'Como el interruptor de una lámpara: el mismo botón enciende y apaga.'
        },
        observe: {
          intro: 'Ejecuta y luego <b>haz clic varias veces</b> en el botón del faro.',
          code: 'let clics = 0;\nconst lampara = document.querySelector("#lampara");\ndocument.querySelector("#interruptor").addEventListener("click", function () {\n  clics++;\n  lampara.classList.toggle("on");\n  console.log("Clic número", clics, "· encendida:", lampara.classList.contains("on"));\n});',
          steps: [
            { lines: [1, 2], text: 'Una variable de estado <b>fuera</b> de la función, y la lámpara seleccionada.' },
            { lines: [3, 7], text: 'Cada clic suma 1 y alterna la clase. Haz clic en el escenario y mira la consola y el árbol.' }
          ],
          result: '<p>La variable <code>clics</code> sobrevive entre clic y clic porque fue declarada fuera de la función.</p>'
        },
        experiment: {
          code: 'const casilla = document.querySelector("#sensor");\ncasilla.addEventListener("change", function () {\n  console.log("Sensor:", casilla.checked);\n});\n',
          ideas: ['Marca y desmarca la casilla en el escenario.', 'Cambia el texto de #puerta según <code>casilla.checked</code>.']
        },
        solve: {
          activity: 'G',
          title: 'Interruptor del faro',
          story: 'El botón del faro debe indicar siempre la acción que hará.',
          goal: '<p>Cada clic en <b>#interruptor</b> debe alternar la clase <b>on</b> de <b>#lampara</b>. Además, el texto del botón debe ser <b>Apagar</b> cuando la lámpara está encendida y <b>Encender</b> cuando está apagada.</p>',
          starter: '',
          tests: [
            { label: '1er clic → encendida y el botón dice «Apagar»', check: function (t) { t.click('#interruptor'); return (t.cls('#lampara', 'on') && t.text('#interruptor') === 'Apagar') || 'Tras 1 clic: lámpara ' + (t.cls('#lampara', 'on') ? 'encendida' : 'apagada') + ', botón «' + t.text('#interruptor') + '».'; } },
            { label: '2º clic → apagada y el botón dice «Encender»', check: function (t) { t.click('#interruptor'); return (!t.cls('#lampara', 'on') && t.text('#interruptor') === 'Encender') || 'Tras 2 clics: botón «' + t.text('#interruptor') + '».'; } },
            { label: '3er clic → encendida otra vez', check: function (t) { t.click('#interruptor'); return (t.cls('#lampara', 'on') && t.text('#interruptor') === 'Apagar') || 'Tras 3 clics la lámpara debería estar encendida con «Apagar».'; } }
          ],
          hints: ['Después del toggle, pregunta con <code>classList.contains("on")</code> o usa una variable booleana.', 'Un if / else decide qué texto poner.', 'Si usas una variable de estado, declárala fuera de la función.'],
          success: 'El faro guía a los barcos otra vez.'
        },
        prove: {
          activity: 'G',
          title: 'Puerta con sensor',
          story: 'La puerta del puerto se abre cuando el sensor de movimiento está activo.',
          goal: '<p>Usa el evento <b>change</b> de la casilla <b>#sensor</b>: si está marcada, <b>#puerta</b> debe tener la clase <b>abierta</b> y el texto <b>Puerta abierta</b>; si no, sin esa clase y con el texto <b>Puerta cerrada</b>.</p>',
          starter: '',
          requires: [[/["'`]change["'`]/, 'Usa el evento `change`'], [/\.checked/, 'Usa la propiedad `.checked`']],
          tests: [
            { label: 'Al marcar → puerta abierta', check: function (t) { t.check('#sensor', true); return (t.cls('#puerta', 'abierta') && t.text('#puerta') === 'Puerta abierta') || 'Al marcar: clase abierta = ' + t.cls('#puerta', 'abierta') + ', texto «' + t.text('#puerta') + '».'; } },
            { label: 'Al desmarcar → puerta cerrada', check: function (t) { t.check('#sensor', true); t.check('#sensor', false); return (!t.cls('#puerta', 'abierta') && t.text('#puerta') === 'Puerta cerrada') || 'Al desmarcar la puerta debería cerrarse.'; } }
          ],
          hints: ['El oyente se agrega a la casilla, no a la puerta.', 'Dentro de la función, pregunta por <code>.checked</code>.', 'Usa add/remove (o toggle con un segundo argumento) y cambia el texto en cada rama.'],
          success: 'Puerta automática funcionando.'
        }
      },

      /* ------------------------------ 7.3 ------------------------------ */
      {
        title: 'Contador interactivo',
        story: 'La plaza necesita contar visitantes con botones.',
        scene: P73,
        learn: {
          what: '<p>Un contador interactivo combina: una <b>variable de estado</b>, <b>eventos</b> que la modifican y una <b>actualización del DOM</b> que la muestra.</p>',
          why: '<p>Es el patrón básico de toda interfaz: estado → evento → actualizar pantalla.</p>',
          when: '<p>Carritos de compra, likes, marcadores, cantidades…</p>',
          how: 'let cuenta = 0;\nconst pantalla = document.querySelector("#contador");\ndocument.querySelector("#mas").addEventListener("click", function () {\n  cuenta++;                         // 1. cambiar el estado\n  pantalla.textContent = cuenta;    // 2. mostrarlo\n});',
          mistakes: ['Cambiar la variable pero olvidar actualizar la pantalla.', 'Permitir valores imposibles (visitantes negativos).'],
          analogy: 'Como el marcador de un partido: el número real (estado) cambia con cada gol (evento), y el tablero (DOM) lo refleja.'
        },
        observe: {
          intro: 'Ejecuta y pulsa <b>+1</b> varias veces.',
          code: 'let visitantes = 0;\nconst contador = document.querySelector("#contador");\ndocument.querySelector("#mas").addEventListener("click", function () {\n  visitantes++;\n  contador.textContent = visitantes;\n});',
          steps: [
            { lines: [1, 2], text: 'El estado empieza en 0 y guardamos el elemento donde se muestra.' },
            { lines: [3, 6], text: 'Cada clic: cambia el estado y actualiza la pantalla. ¡Prueba!' }
          ],
          result: '<p>Estado → evento → actualización: memoriza este patrón, lo usarás siempre.</p>'
        },
        experiment: {
          code: 'let visitantes = 0;\nconst contador = document.querySelector("#contador");\ndocument.querySelector("#mas").addEventListener("click", function () {\n  visitantes++;\n  contador.textContent = visitantes;\n});\n',
          ideas: ['Programa el botón −1.', 'Haz que +1 sume de 5 en 5.', 'Cambia el color del contador cuando pase de 10.']
        },
        solve: {
          activity: 'A',
          title: 'Control de aforo',
          story: 'El contador de la plaza está a medio programar.',
          goal: '<p>Completa los <code>___</code>: <b>+1</b> suma un visitante y <b>−1</b> resta uno, pero nunca debe bajar de 0.</p>',
          starter: 'let visitantes = 0;\nconst contador = document.querySelector("#contador");\n\ndocument.querySelector("#mas").addEventListener("___", function () {\n  visitantes___;\n  contador.textContent = visitantes;\n});\n\ndocument.querySelector("#menos").addEventListener("click", function () {\n  if (visitantes ___ 0) {\n    visitantes--;\n  }\n  contador.textContent = visitantes;\n});\n',
          tests: [
            { label: '3 clics en +1 → 3', check: function (t) { t.click('#mas'); t.click('#mas'); t.click('#mas'); return t.text('#contador') === '3' || 'El contador muestra ' + t.text('#contador') + '.'; } },
            { label: 'Luego −1 → 2', check: function (t) { t.click('#menos'); return t.text('#contador') === '2' || 'El contador muestra ' + t.text('#contador') + '.'; } },
            { label: 'Nunca baja de 0', check: function (t) { t.click('#menos'); t.click('#menos'); t.click('#menos'); t.click('#menos'); return t.text('#contador') === '0' || 'El contador muestra ' + t.text('#contador') + ': no puede ser negativo.'; } }
          ],
          hints: ['El primer hueco es el nombre del evento.', 'El segundo es el operador que suma 1.', 'Solo se resta si hay más de 0 visitantes.'],
          success: 'Aforo controlado.'
        },
        prove: {
          activity: 'G',
          title: 'Regulador de energía',
          story: 'Un regulador ajusta la energía de la plaza en pasos de 10.',
          scene: P73b,
          goal: '<p>El nivel empieza en <b>50</b>. <b>#subir</b> suma 10 y <b>#bajar</b> resta 10, pero el nivel debe quedar siempre entre <b>0</b> y <b>100</b>. Tras cada clic, <b>#nivel</b> muestra el número y el ancho de <b>#barra</b> es <code>nivel + "%"</code>.</p>',
          starter: '',
          tests: [
            { label: 'Subir 2 veces → 70 y barra al 70%', check: function (t) { t.click('#subir'); t.click('#subir'); return (t.text('#nivel') === '70' && t.$('#barra').style.width === '70%') || 'Nivel «' + t.text('#nivel') + '», barra «' + t.$('#barra').style.width + '».'; } },
            { label: 'Nunca pasa de 100', check: function (t) { for (var i = 0; i < 8; i++) t.click('#subir'); return t.text('#nivel') === '100' || 'Tras muchos clics el nivel es ' + t.text('#nivel') + '.'; } },
            { label: 'Nunca baja de 0', check: function (t) { for (var i = 0; i < 15; i++) t.click('#bajar'); return (t.text('#nivel') === '0' && t.$('#barra').style.width === '0%') || 'El nivel quedó en ' + t.text('#nivel') + '.'; } }
          ],
          hints: ['Necesitas una variable de estado que empiece en 50.', 'En cada evento: cambia el estado, corrige si se pasó del límite y actualiza la pantalla.', 'Puede ayudarte una función <code>actualizar()</code> que llamen ambos botones.'],
          success: 'Energía bajo control.'
        }
      },

      /* ------------------------------ 7.4 ------------------------------ */
      {
        title: 'Valida el formulario',
        story: 'Los formularios de la plaza aceptan cualquier cosa. Hay que validarlos.',
        scene: P74,
        learn: {
          what: '<p>La propiedad <code>.value</code> de un <code>&lt;input&gt;</code> contiene lo que la persona escribió (<b>siempre como texto</b>). El evento <code>input</code> se dispara con cada tecla.</p>',
          why: '<p>Validar evita datos incorrectos y ayuda con mensajes inmediatos.</p>',
          when: '<p>En registros, contraseñas, buscadores, cantidades…</p>',
          how: 'const campo = document.querySelector("#nombre");\ncampo.addEventListener("input", function () {\n  console.log(campo.value);          // lo escrito hasta ahora\n  console.log(campo.value.length);   // cuántos caracteres\n});\nlet edad = Number(campoEdad.value);  // convertir texto → número\nlet limpio = campo.value.trim();     // quitar espacios de los extremos',
          symbols: [['.value', 'Texto escrito en el campo.'], ['"input"', 'Evento que ocurre con cada cambio al escribir.'], ['Number(x)', 'Convierte un texto en número.'], ['.trim()', 'Quita espacios al inicio y al final.']],
          mistakes: ['Comparar números sin convertir: <code>"9" &gt; "10"</code> es true (compara como textos).', 'Leer <code>.value</code> fuera del evento: obtienes el valor del momento de la carga (vacío).', 'Aceptar un nombre de solo espacios.'],
          analogy: 'Como un guardia que revisa los documentos en la ventanilla: lee, comprueba y dice "adelante" o "revisa tus datos".'
        },
        observe: {
          intro: 'Ejecuta y luego <b>escribe tu nombre</b> en el campo del escenario.',
          code: 'const campo = document.querySelector("#nombre");\nconst vista = document.querySelector("#vista");\ncampo.addEventListener("input", function () {\n  vista.textContent = campo.value;\n  console.log("Caracteres:", campo.value.length);\n});',
          steps: [
            { lines: [1, 2], text: 'Seleccionamos el campo y la vista previa.' },
            { lines: [3, 6], text: 'Con cada tecla se copia el valor a la vista previa. ¡Escribe en el escenario!' }
          ],
          result: '<p>El evento <code>input</code> permite reaccionar mientras la persona escribe.</p>'
        },
        experiment: {
          code: 'const campo = document.querySelector("#nombre");\nconst vista = document.querySelector("#vista");\ncampo.addEventListener("input", function () {\n  vista.textContent = campo.value.toUpperCase();\n});\n',
          ideas: ['Muestra la cantidad de caracteres en la vista previa.', 'Usa <code>"change"</code> en vez de <code>"input"</code>: ¿cuándo se dispara?']
        },
        solve: {
          activity: 'G',
          title: 'Medidor de contraseña',
          story: 'El sistema necesita contraseñas de al menos 8 caracteres.',
          goal: '<p>Mientras se escribe en <b>#clave</b> (evento <b>input</b>): si tiene <b>8 o más</b> caracteres, <b>#fuerza</b> debe decir <b>Segura</b> y tener la clase <b>ok</b>; si no, decir <b>Débil</b> y no tener esa clase.</p>',
          starter: '',
          requires: [[/["'`]input["'`]/, 'Usa el evento `input`']],
          tests: [
            { label: '"abc" → Débil', check: function (t) { t.write('#clave', 'abc'); return (t.text('#fuerza') === 'Débil' && !t.cls('#fuerza', 'ok')) || 'Con "abc" se muestra «' + t.text('#fuerza') + '».'; } },
            { label: '"abcdefgh" (8) → Segura con clase ok', check: function (t) { t.write('#clave', 'abcdefgh'); return (t.text('#fuerza') === 'Segura' && t.cls('#fuerza', 'ok')) || 'Con 8 caracteres se muestra «' + t.text('#fuerza') + '».'; } },
            { label: 'Si se borra hasta "abc" → Débil otra vez', check: function (t) { t.write('#clave', 'abcdefghij'); t.write('#clave', 'abc'); return (t.text('#fuerza') === 'Débil' && !t.cls('#fuerza', 'ok')) || 'Al acortar la clave debería volver a «Débil» y perder la clase ok.'; } }
          ],
          hints: ['El valor escrito está en <code>.value</code> y su tamaño en <code>.value.length</code>.', 'Dentro del evento, un if / else con add y remove.', 'No olvides quitar la clase en el caso «Débil».'],
          success: 'Contraseñas más seguras en la plaza.'
        },
        prove: {
          activity: 'G',
          title: 'Alta de robot',
          story: 'El registro de robots acepta datos imposibles. Valídalo.',
          scene: P74b,
          goal: '<p>Al hacer clic en <b>#registrar</b>:</p><ul><li>el nombre (<b>#nombre</b>) no puede estar vacío ni ser solo espacios;</li><li>la edad (<b>#edad</b>) debe ser un número entre <b>1 y 99</b>.</li></ul><p>Si todo es válido: <b>#resultado</b> = <code>"Registrado: " + nombre</code> (nombre sin espacios extra) con la clase <b>exito</b>. Si no: <b>#resultado</b> = <b>Revisa los datos</b> con la clase <b>error</b> (y sin <b>exito</b>).</p>',
          starter: '',
          tests: [
            { label: 'Volt, 5 años → «Registrado: Volt»', check: function (t) { t.write('#nombre', 'Volt'); t.write('#edad', '5'); t.click('#registrar'); return (t.text('#resultado') === 'Registrado: Volt' && t.cls('#resultado', 'exito')) || 'Se muestra «' + t.text('#resultado') + '».'; } },
            { label: 'Nombre vacío → error', check: function (t) { t.write('#nombre', ''); t.write('#edad', '5'); t.click('#registrar'); return (t.text('#resultado') === 'Revisa los datos' && t.cls('#resultado', 'error') && !t.cls('#resultado', 'exito')) || 'Con nombre vacío se muestra «' + t.text('#resultado') + '».'; } },
            { label: 'Nombre de solo espacios → error', check: function (t) { t.write('#nombre', '   '); t.write('#edad', '5'); t.click('#registrar'); return t.text('#resultado') === 'Revisa los datos' || 'Un nombre de solo espacios no es válido. ¿Usaste trim()?'; } },
            { label: 'Edad 0 o 120 → error', check: function (t) { t.write('#nombre', 'Nano'); t.write('#edad', '0'); t.click('#registrar'); if (t.text('#resultado') !== 'Revisa los datos') return 'La edad 0 debería ser inválida.'; t.write('#edad', '120'); t.click('#registrar'); return t.text('#resultado') === 'Revisa los datos' || 'La edad 120 debería ser inválida.'; } },
            { label: 'Tras un error, un registro válido muestra éxito sin la clase error', check: function (t) { t.write('#nombre', ''); t.click('#registrar'); t.write('#nombre', ' Gear '); t.write('#edad', '30'); t.click('#registrar'); return (t.text('#resultado') === 'Registrado: Gear' && t.cls('#resultado', 'exito') && !t.cls('#resultado', 'error')) || 'Se muestra «' + t.text('#resultado') + '» con clases: ' + t.$('#resultado').className; } }
          ],
          hints: ['Lee los valores <b>dentro</b> de la función del clic.', 'Convierte la edad con <code>Number()</code> y limpia el nombre con <code>trim()</code>.', 'Combina las condiciones con && y recuerda quitar la clase contraria en cada caso.'],
          success: 'Registro a prueba de datos imposibles.'
        }
      },

      /* ------------------------------ 7.5 ------------------------------ */
      {
        title: 'Lista dinámica',
        story: 'El tablero de tareas de mantenimiento debe crecer y encogerse según las necesidades.',
        scene: P75,
        learn: {
          what: '<p>JavaScript puede <b>crear</b> elementos nuevos con <code>document.createElement()</code>, <b>insertarlos</b> en la página con <code>appendChild()</code> y <b>eliminarlos</b> con <code>remove()</code>.</p>',
          why: '<p>Así funcionan listas de tareas, chats, comentarios, carritos: contenido que no existía al cargar la página.</p>',
          when: '<p>Cuando la cantidad de elementos depende de lo que haga la persona usuaria.</p>',
          how: 'const li = document.createElement("li");  // 1. crear (aún no se ve)\nli.textContent = "Revisar radar";          // 2. configurar\ndocument.querySelector("#lista").appendChild(li); // 3. insertar\n\nli.remove();                               // eliminarlo',
          symbols: [['createElement("li")', 'Crea un elemento nuevo, fuera de la página.'], ['padre.appendChild(hijo)', 'Lo agrega como último hijo de "padre": ahora sí se ve.'], ['elemento.remove()', 'Lo quita del árbol.']],
          mistakes: ['Crear el elemento y olvidar el appendChild: nunca aparece.', 'Pasar un texto a appendChild: necesita un elemento.', 'Crear el elemento fuera del evento: solo existiría uno.'],
          analogy: 'Fabricar un mueble (createElement), pintarlo (configurar) y colocarlo en una habitación (appendChild). remove() es sacarlo de la casa.'
        },
        observe: {
          intro: 'Ejecuta y pulsa <b>Agregar</b> varias veces. Mira cómo crece el árbol DOM.',
          code: 'let n = 0;\ndocument.querySelector("#agregar").addEventListener("click", function () {\n  n++;\n  const li = document.createElement("li");\n  li.textContent = "Tarea número " + n;\n  document.querySelector("#lista").appendChild(li);\n});',
          steps: [
            { lines: [1, 1], text: 'Un contador para numerar las tareas.' },
            { lines: [2, 7], text: 'Cada clic crea un &lt;li&gt; nuevo, le pone texto y lo inserta en #lista. ¡Haz clic y mira aparecer nodos en el árbol!' }
          ],
          result: '<p>Los elementos creados con JavaScript son nodos del DOM como cualquier otro.</p>'
        },
        experiment: {
          code: 'document.querySelector("#agregar").addEventListener("click", function () {\n  const li = document.createElement("li");\n  li.textContent = "Nueva tarea";\n  document.querySelector("#lista").appendChild(li);\n});\n',
          ideas: ['Usa el texto escrito en #tarea.', 'Haz que cada li se elimine al hacerle clic: <code>li.addEventListener("click", function () { li.remove(); });</code>', 'Crea un &lt;b&gt; en lugar de un li.']
        },
        solve: {
          activity: 'D',
          title: 'Agregar tareas',
          story: 'Los técnicos escriben tareas y las agregan al tablero.',
          goal: '<p>Al hacer clic en <b>#agregar</b>: crea un <code>&lt;li&gt;</code> con el texto escrito en <b>#tarea</b>, agrégalo a <b>#lista</b> y <b>vacía</b> el campo. No agregues tareas vacías (o de solo espacios).</p>',
          starter: '',
          requires: [[/createElement\s*\(/, 'Usa `createElement`'], [/appendChild\s*\(/, 'Usa `appendChild`']],
          tests: [
            { label: 'Agregar «Revisar radar» crea un <li>', check: function (t) { t.write('#tarea', 'Revisar radar'); t.click('#agregar'); var li = t.$$('#lista li'); return (li.length === 1 && li[0].textContent.indexOf('Revisar radar') >= 0) || 'La lista tiene ' + li.length + ' elementos.'; } },
            { label: 'El campo queda vacío después de agregar', check: function (t) { t.write('#tarea', 'Algo'); t.click('#agregar'); return t.$('#tarea').value === '' || 'El campo sigue diciendo «' + t.$('#tarea').value + '».'; } },
            { label: 'No se agregan tareas vacías', check: function (t) { var antes = t.$$('#lista li').length; t.write('#tarea', '   '); t.click('#agregar'); return t.$$('#lista li').length === antes || 'Se agregó una tarea vacía.'; } },
            { label: 'Las tareas se agregan en orden', check: function (t) { t.write('#tarea', 'Cambiar foco'); t.click('#agregar'); var li = t.$$('#lista li'); return li[li.length - 1].textContent.indexOf('Cambiar foco') >= 0 || 'La última tarea no es «Cambiar foco».'; } }
          ],
          hints: ['Todo ocurre dentro del evento click.', 'Lee el valor con <code>.value</code>, compruébalo con <code>.trim()</code>, crea, configura e inserta.', 'Para vaciar el campo: <code>campo.value = ""</code>.'],
          success: 'Tablero de tareas operativo.'
        },
        prove: {
          activity: 'G',
          title: 'Tareas que se pueden borrar',
          story: 'Cuando una tarea se termina, debe poder quitarse del tablero.',
          goal: '<p>Programa el tablero completo:</p><ul><li>al hacer clic en <b>#agregar</b> se crea un <code>&lt;li&gt;</code> con el texto de <b>#tarea</b> (si no está vacío);</li><li>cada <code>&lt;li&gt;</code> contiene un <code>&lt;button&gt;</code> con el texto <b>X</b> que, al pulsarlo, <b>elimina</b> ese <code>&lt;li&gt;</code>;</li><li><b>#total</b> muestra siempre cuántas tareas hay.</li></ul>',
          starter: '',
          requires: [[/remove\s*\(\s*\)/, 'Usa `remove()`']],
          tests: [
            { label: 'Agregar 2 tareas → total 2', check: function (t) { t.write('#tarea', 'Radar'); t.click('#agregar'); t.write('#tarea', 'Antena'); t.click('#agregar'); return (t.$$('#lista li').length === 2 && t.text('#total') === '2') || 'Hay ' + t.$$('#lista li').length + ' tareas y #total dice ' + t.text('#total') + '.'; } },
            { label: 'Cada tarea tiene su botón X', check: function (t) { t.write('#tarea', 'Radar'); t.click('#agregar'); var b = t.$('#lista li button'); return (!!b && b.textContent.trim() === 'X') || 'No encuentro un botón «X» dentro de la tarea.'; } },
            { label: 'Pulsar X elimina su tarea y actualiza el total', check: function (t) { t.write('#tarea', 'Radar'); t.click('#agregar'); t.write('#tarea', 'Antena'); t.click('#agregar'); var n = t.$$('#lista li').length; t.click(t.$('#lista li button')); var li = t.$$('#lista li'); return (li.length === n - 1 && li[li.length - 1].textContent.indexOf('Antena') >= 0 && t.text('#total') === String(n - 1)) || 'Después de pulsar X hay ' + li.length + ' tareas y #total dice ' + t.text('#total') + '.'; } }
          ],
          hints: ['Crea el botón con <code>createElement("button")</code> y agrégalo DENTRO del li con appendChild.', 'Al botón agrégale su propio evento click que haga <code>li.remove()</code>.', 'Para el total, cuenta los li: <code>document.querySelectorAll("#lista li").length</code>, después de agregar y de borrar.'],
          success: 'Tablero dinámico completo.'
        }
      },

      /* ------------------------------ 7.6 ------------------------------ */
      {
        title: 'Interfaz completa',
        story: 'El centro de la plaza necesita interfaces completas que combinen todo: eventos, validación, DOM dinámico y cálculos.',
        scene: P76,
        learn: {
          what: '<p>Una <b>interfaz completa</b> une: datos (variables, arreglos), lógica (if, ciclos, funciones), DOM (selección y modificación) y eventos (click, input, change).</p>',
          why: '<p>Así se construyen las aplicaciones web reales.</p>',
          when: '<p>Cuando un problema requiere reaccionar, validar, calcular y mostrar.</p>',
          how: 'const lista = document.querySelector("#distrito");\nlista.addEventListener("change", function () {\n  const valor = lista.value;   // el value de la opción elegida\n  console.log("Elegiste:", valor);\n});',
          symbols: [['select.value', 'El atributo value de la opción seleccionada.'], ['elemento.className', 'Todas las clases como un texto: asignarlo reemplaza las anteriores.']],
          mistakes: ['Agregar clases nuevas sin quitar las anteriores.', 'Sumar textos en vez de números al calcular totales.'],
          analogy: 'Como dirigir una orquesta: cada parte sabe tocar, tú decides cuándo y en qué orden.'
        },
        observe: {
          intro: 'Ejecuta y luego <b>elige un distrito</b> en la lista del escenario.',
          code: 'const lista = document.querySelector("#distrito");\nlista.addEventListener("change", function () {\n  console.log("Elegiste:", lista.value);\n  document.querySelector("#info").textContent = "Cargando " + lista.value + "…";\n});',
          steps: [
            { lines: [1, 1], text: 'Seleccionamos la lista desplegable.' },
            { lines: [2, 5], text: 'El evento change ocurre al elegir otra opción. <code>lista.value</code> es el value de esa opción.' }
          ],
          result: '<p>El evento <code>change</code> y <code>.value</code> funcionan igual en listas, casillas y campos.</p>'
        },
        experiment: {
          code: 'const lista = document.querySelector("#distrito");\nlista.addEventListener("change", function () {\n  console.log("Elegiste:", lista.value);\n});\n',
          ideas: ['Muestra el valor en #info.', 'Cambia el color de #mapa según el distrito con <code>className</code>.']
        },
        solve: {
          activity: 'G',
          title: 'Selector de distritos',
          story: 'El mapa debe mostrar el distrito elegido.',
          goal: '<p>Al cambiar la lista <b>#distrito</b>:</p><ul><li><b>#info</b> debe decir <code>"Distrito: " + valor</code> (por ejemplo «Distrito: norte»);</li><li><b>#mapa</b> debe tener la clase <b>mapa</b> y la clase del distrito elegido, <b>sin</b> la del distrito anterior.</li></ul>',
          starter: '',
          requires: [[/["'`]change["'`]/, 'Usa el evento `change`']],
          tests: [
            { label: 'Elegir «norte»', check: function (t) { t.choose('#distrito', 'norte'); return (t.text('#info') === 'Distrito: norte' && t.cls('#mapa', 'norte') && t.cls('#mapa', 'mapa')) || '#info: «' + t.text('#info') + '»; #mapa: ' + t.$('#mapa').className; } },
            { label: 'Luego elegir «sur» quita «norte»', check: function (t) { t.choose('#distrito', 'norte'); t.choose('#distrito', 'sur'); return (t.cls('#mapa', 'sur') && !t.cls('#mapa', 'norte') && t.cls('#mapa', 'mapa')) || '#mapa quedó con las clases: ' + t.$('#mapa').className; } }
          ],
          hints: ['El valor elegido está en <code>.value</code> de la lista.', 'Puedes reemplazar todas las clases con <code>className = "mapa " + valor</code>.', 'Otra opción: remove de las tres y add de la elegida.'],
          success: 'Mapa interactivo funcionando.'
        },
        prove: {
          activity: 'G',
          title: 'Pedidos de energía',
          story: 'La central recibe pedidos de energía de la plaza. Construye la interfaz completa.',
          scene: P76b,
          goal: '<p>Al hacer clic en <b>#pedir</b>:</p><ul><li>si <b>#cantidad</b> es un número entre <b>1 y 50</b>: agrega un <code>&lt;li&gt;</code> a <b>#pedidos</b> con el texto <code>cantidad + " kWh"</code>, actualiza <b>#total</b> con la <b>suma</b> de todos los pedidos y deja <b>#error</b> vacío;</li><li>si no: <b>#error</b> dice <b>Cantidad inválida</b> y no se agrega nada.</li></ul>',
          starter: '',
          tests: [
            { label: 'Pedir 10 y 25 → 2 pedidos, total 35', check: function (t) { t.write('#cantidad', '10'); t.click('#pedir'); t.write('#cantidad', '25'); t.click('#pedir'); var li = t.$$('#pedidos li'); return (li.length === 2 && li[0].textContent.trim() === '10 kWh' && t.text('#total') === '35') || 'Pedidos: ' + li.length + ', total: ' + t.text('#total') + '. ¿Sumas números o textos?'; } },
            { label: 'Pedir 80 → «Cantidad inválida» y no se agrega', setup: '// caso 2', check: function (t) { t.write('#cantidad', '80'); t.click('#pedir'); return (t.text('#error') === 'Cantidad inválida' && t.$$('#pedidos li').length === 0) || 'Con 80: error «' + t.text('#error') + '», pedidos ' + t.$$('#pedidos li').length + '.'; } },
            { label: 'Pedir 0 o vacío → inválido', setup: '// caso 3', check: function (t) { t.write('#cantidad', '0'); t.click('#pedir'); t.write('#cantidad', ''); t.click('#pedir'); return t.$$('#pedidos li').length === 0 || 'No deberían agregarse pedidos con 0 o vacío.'; } },
            { label: 'Un pedido válido después de un error limpia el error', setup: '// caso 4', check: function (t) { t.write('#cantidad', '99'); t.click('#pedir'); t.write('#cantidad', '5'); t.click('#pedir'); return (t.text('#error') === '' && t.text('#total') === '5') || '#error: «' + t.text('#error') + '», total: ' + t.text('#total') + '.'; } }
          ],
          hints: ['Divide: leer y convertir → validar → (agregar + sumar + mostrar) o (mostrar error).', 'Guarda el total en una variable de estado fuera del evento.', 'Number("") es 0, así que el vacío también queda fuera del rango 1–50.'],
          success: '¡La Plaza Interactiva vuelve a la vida!'
        }
      }
    ],

    special: {
      title: 'Modo nocturno',
      scene: page('<div class="panel">\n  <h1>Plaza de noche</h1>\n  <p>Prueba el modo nocturno de la plaza.</p>\n  <button id="modo">Modo noche</button>\n</div>'),
      solve: {
        activity: 'G',
        title: 'Modo nocturno',
        story: 'De noche, la plaza debe atenuar sus pantallas.',
        goal: '<p>Cada clic en <b>#modo</b> alterna la clase <b>noche</b> en <code>document.body</code>. El botón debe decir <b>Modo día</b> cuando el modo noche está activo, y <b>Modo noche</b> cuando no.</p>',
        starter: '',
        tests: [
          { label: '1 clic → noche y botón «Modo día»', check: function (t) { t.click('#modo'); return (t.doc.body.classList.contains('noche') && t.text('#modo') === 'Modo día') || 'Tras 1 clic el botón dice «' + t.text('#modo') + '».'; } },
          { label: '2 clics → día y botón «Modo noche»', check: function (t) { t.click('#modo'); t.click('#modo'); return (!t.doc.body.classList.contains('noche') && t.text('#modo') === 'Modo noche') || 'Tras 2 clics el botón dice «' + t.text('#modo') + '».'; } }
        ],
        hints: ['<code>document.body</code> es el elemento body.', 'toggle + contains.', 'Es el mismo patrón del interruptor del faro.'],
        success: 'Buenas noches, Neópolis.'
      }
    }
  });
})();
