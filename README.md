# CODE QUEST · La Ciudad del Código

Videojuego serio para aprender JavaScript desde cero hasta el DOM y los eventos.
Está hecho solo con HTML5, CSS3 y JavaScript puro, sin frameworks ni dependencias externas.

## Cómo ejecutarlo

**Opción A (recomendada): servidor local**
```bash
python -m http.server 8000
```
Ejecuta ese comando dentro de la carpeta `code-quest` y abre `http://localhost:8000`.

**Opción B: doble clic en `index.html`**
También funciona desde `file://`: se usan scripts clásicos (no módulos ES) y los iframes `srcdoc`. Algunos navegadores tratan de forma especial el `localStorage` de `file://`; si el progreso no se guarda, usa la opción A.

## Estructura
```
index.html
css/styles.css, css/animations.css
js/ui.js           Toasts, modales, confeti
js/codeutil.js     Análisis de código (paréntesis, comentarios, guardián de ciclos)
js/highlight.js    Resaltado de sintaxis
js/restrictions.js Bloqueo pedagógico de copiar/pegar
js/progress.js     Progreso, XP, insignias, tiempo y desbloqueo (localStorage)
js/worlds.js       Escenarios: terminal, memoria, puerta, semáforo, luces, robot, fábrica, página
js/sandbox.js      Ejecución aislada (iframe sandbox + postMessage + límites)
js/errors.js       Errores técnicos → explicaciones para principiantes
js/evaluator.js    Evaluación funcional (sintaxis, conceptos, pruebas con varios datos)
js/editor.js       Editor con números de línea, resaltado e indentación
js/levels.js       Registro de bloques y niveles
js/levels/blockN.js Contenido pedagógico (bloques 0 a 8)
js/game.js         Pantalla de nivel (5 fases), árbol DOM, actividades, laboratorio
js/app.js          Inicio, mapa, HUD, insignias, reporte, ayuda
```

## Contenido
Hay 9 bloques, 46 niveles y 92 retos evaluables. Además, los bloques 0 a 7 tienen una misión especial. Cada nivel tiene 5 fases: **Aprende → Observa (paso a paso) → Experimenta (laboratorio, con controles deslizantes en algunos niveles) → Resuelve → Demuestra**.
Se usan las actividades A–H: código incompleto, encuentra el error, predice, programa el dispositivo, ordena la lógica, laboratorio libre (también hay uno general en el mapa), construye y depuración visual.
El Bloque 8 construye una aplicación completa reutilizando el código que el propio estudiante escribió en los niveles anteriores (`carry`).

## Ejecución y evaluación
- El código corre en un `<iframe sandbox="allow-scripts">` sin `allow-same-origin`. Se comunica solo por `postMessage`, con un token por ejecución.
- Primero se revisa la sintaxis (el código se compila sin ejecutarse). Después se ejecuta con un **guardián de ciclos**, que detiene un ciclo tras 100 000 repeticiones o 2,5 s. Además, un temporizador de 4 s elimina el iframe, y hay un botón **■ Detener**.
- Cada prueba vuelve a ejecutar el programa en iframes ocultos con distintos datos (`setup`). Por eso se acepta cualquier solución que funcione, no un texto exacto.
- Los errores muestran una explicación pedagógica, el detalle técnico real y la línea afectada. Además, hay consejos para errores que JavaScript no reporta, como `=` en un `if` o `textcontent`.

## Progreso
Solo el bloque 0 empieza desbloqueado. Los niveles se juegan en orden, y las fases de cada nivel también. Un bloque se aprueba cuando se superan todos sus niveles con un **desempeño promedio de al menos 80%**. Cada reto vale entre 60% y 100% según los intentos fallidos y las pistas usadas. Se guarda la mejor puntuación de cada nivel.
En `localStorage` se guardan: el bloque actual, los niveles, las puntuaciones, los intentos, las insignias, los retos, el tiempo activo (solo con la pestaña visible y actividad reciente), los borradores y los intentos de pegado.
**Aviso:** `localStorage` se puede modificar desde el navegador. Es un progreso **pedagógico**, no una evaluación académica segura. Una firma simple solo *detecta* ediciones manuales casuales. Para calificar de verdad hay que validar los retos en un servidor.

## Restricción de copiar y pegar (y sus límites)
Están bloqueados Ctrl/Cmd + C/V/X, Shift+Insert, Ctrl+Insert y Shift+Supr, y también los eventos `copy`/`cut`/`paste`. El menú contextual está desactivado en las zonas de código. También se bloquean arrastrar y soltar y `beforeinput` (`insertFromPaste`/`Drop`/`Yank`). Las inserciones masivas de más de 40 caracteres de golpe se rechazan. Los mismos controles se aplican dentro del escenario.
No es infalible: las extensiones, el autotipeo externo, el dictado por voz o editar el código fuente pueden saltárselo. No afecta a otras aplicaciones.

## Cómo agregar un desafío
En `js/levels/blockN.js`, agrega un objeto al arreglo `levels`:
```js
{
  title: 'Mi nivel', story: '...',
  scene: { world: 'door', sensors: ['energia'] },  // ver js/worlds.js
  setup: 'var energia = 60;',                        // datos del escenario
  learn: { what, why, when, how, symbols, mistakes, analogy },
  observe: { code: '...', steps: [{ lines: [1, 2], text: '...' }], result: '...' },
  experiment: { code: '...', ideas: ['...'], controls: [{ var: 'energia', type: 'range', min: 0, max: 100, value: 30 }] },
  solve: {
    activity: 'D', title: '...', goal: '<p>...</p>', starter: '',
    requires: [[/\bif\s*\(/, 'Usa `if`']],          // conceptos obligatorios
    forbids:  [[/let\s+energia/, 'No redeclares energia']],
    tests: [
      { label: 'Energía 49 → cerrada', setup: 'energia = 49;',
        check: function (t) { return t.world.door === 'cerrada' || 'Mensaje si falla'; } }
    ],
    hints: ['Concepto', 'Dónde está el problema', 'Ejemplo distinto']
  },
  prove: { /* igual que solve; también mode: 'predict' (code, options, answer) o 'order' (lines) */ }
}
```
Dentro de `check`, la `t` ofrece: `get(nombre)`, `has`, `isFn`, `isConst`, `call(fn, ...args)`, `logs`, `values`, `warnings`, `world` (estado del escenario), `W` (mundo), `$`/`$$`, `text`, `cls`, `css`, `click`, `write`, `choose`, `check`, `src`/`raw`, `norm`, `logHas`, `eq` y `near`.
Las funciones `check` se serializan, así que solo pueden usar `t` y no variables externas. Las pruebas con el mismo `setup` comparten una ejecución.
