# App de encuestas · Fase 1

Archivos: `index.html` (la app y el texto de las preguntas), `sw.js` (hace que funcione sin internet), `manifest.json` y dos íconos. No necesitan instalar nada en la computadora.

## 1. Publicarla gratis (una sola vez, unos 10 minutos)

Opción recomendada, sin programas: **GitHub Pages**.

1. Crea una cuenta en github.com si no tienes.
2. Arriba a la derecha toca **+ → New repository**. Nombre: `encuestas`. Déjalo **Public** y toca **Create repository**.
3. En la página que aparece toca **uploading an existing file**, arrastra los archivos de esta carpeta (no la carpeta, los archivos) y toca **Commit changes**.
4. Ve a **Settings → Pages**. En *Branch* elige `main` y `/ (root)`, y toca **Save**.
5. Espera 1 o 2 minutos. Tu app queda en `https://TU-USUARIO.github.io/encuestas/`.

Nota: el repositorio público solo contiene las preguntas, nunca las respuestas. Las respuestas viven únicamente en la tablet.

## 2. Instalarla en la tablet

1. Abre esa dirección en **Chrome** en la tablet (con internet, solo esta vez).
2. Menú de los tres puntos → **Agregar a la pantalla principal** (o **Instalar app**).
3. Abre la app desde el ícono nuevo. Pon la tablet en modo avión y ábrela otra vez: debe abrir igual.

## 3. Uso en campo

- **Volver al inicio a escondidas:** mantén presionado 2 segundos el puntito gris (arriba a la derecha durante la encuesta, abajo a la derecha en la pantalla de gracias). Durante la encuesta te pregunta si quieres salir; si sales, queda como incompleta.
- **Exportar:** Inicio → Datos y exportación → Descargar (o Compartir para mandarlo a tu Drive o correo). El de teléfonos se descarga aparte.
- **Antes de salir a campo:** Datos → Borrar todo, para quitar las pruebas y que el código empiece en E001.

## 4. Si cambias una pregunta

Abre `index.html`, busca la sección INSTRUMENTO al principio, cambia el texto y sube el número de `VERSION_INSTRUMENTO`. En `sw.js` cambia `encuestas-v1` por `encuestas-v2`. Sube los archivos de nuevo a GitHub. En la tablet, abre la app con internet dos veces para que tome la versión nueva.

## 5. Conectar las hojas de Google (QR de la tesis y práctica de la materia)

Hay dos hojas separadas para que los datos nunca se mezclen:

| Hoja | Para qué | Línea en index.html |
|---|---|---|
| "Respuestas QR tesis" | Negocios que no pudieron contestar en la tablet y se llevaron un QR | `ENDPOINT_TESIS` |
| "Respuestas práctica materia" | Tus compañeros, con `?modo=enlace` | `ENDPOINT_PRACTICA` |

Haz esto **dos veces**, una por hoja:

1. En Google Drive crea una hoja de cálculo nueva con el nombre de la tabla.
2. **Extensiones → Apps Script**. Borra lo que aparece, pega todo `Codigo.gs` y guarda.
3. **Implementar → Nueva implementación →** engrane **→ App web**. Ejecutar como: **Yo**. Quién tiene acceso: **Cualquier usuario**. **Implementar** y autoriza (si sale "Google no verificó esta app": Configuración avanzada → Ir a… → Permitir).
4. Copia la URL de la app web (termina en `/exec`) y pégala entre las comillas de su línea en `index.html`.

Después sube otra vez `index.html` y `sw.js` a GitHub.

## 6. El QR en campo (tesis)

Si el dueño acepta participar pero no puede contestar en ese momento: Inicio → **Entregar QR**, escribe la colonia y toca **Generar QR**. El dueño lo escanea con la cámara de su celular, o tocas **Enviar por WhatsApp** si tienes datos. Cada QR tiene su código (Q001-XX) y vale para una sola encuesta.

**Tarjetas impresas.** Desde la tablet: Datos y exportación → **Imprimir tarjetas QR** → elige cuántas (8 por hoja carta) → Imprimir (impresora o "Guardar como PDF"). Cada tarjeta trae un código distinto (I001-XX…). Imprímelas desde la tablet, no desde la PC, para que la tablet conozca esos códigos. Cuando entregues una: Inicio → Entregar QR → escribe la colonia → **Entregué uno impreso** → escribe el código de la tarjeta. Las tarjetas que no entregues no cuentan para nada.

- Las respuestas llegan a la pestaña "respuestas" de la hoja de la tesis, con `modo = qr`; los teléfonos de invitación, a la pestaña "invitaciones".
- La colonia de cada QR queda en `qr_entregados.csv` (Datos y exportación); se une con las respuestas por el código.
- Si el negocio no contesta, simplemente no aparece en la hoja: cuenta como no respuesta.

## 7. Práctica de la materia

Manda a tus compañeros `https://TU-USUARIO.github.io/encuestas/index.html?modo=enlace`. Sus respuestas llegan a la hoja de práctica con códigos L-… y `modo = practica`. No se pide teléfono.
