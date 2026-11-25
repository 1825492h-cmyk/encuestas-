// Recibe los datos de la app de encuestas (y del POS) y los guarda en pestañas de esta hoja.
// Cada pestaña tiene una fila por registro; la primera columna es la clave (código).
// Si llega otra vez la misma clave, se actualiza la misma fila; una encuesta ya
// completa no se vuelve a sobrescribir.
//
// Pestañas que se crean solas:
//   respuestas      Fase 1 (tablet y QR)          negativas, qr_entregados
//   invitaciones    teléfonos, aparte              negocios     los 20 códigos del piloto
//   piloto_D0       encuesta del día 0             piloto_S6    encuesta de la semana 6
//   pos_cortes, pos_diario, pos_cierre            copia de los datos del POS
//
// Usa este mismo código en la hoja de la tesis y en la de práctica.
// Si lo actualizas: Implementar → Administrar implementaciones → lápiz → Versión: Nueva versión → Implementar.

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const datos = JSON.parse(e.postData.contents);
    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const items = datos.lote ? datos.lote : [datos];
    items.forEach(function (it) { guardarFila(libro, normalizar(it)); });
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}

// Versiones anteriores de la app mandaban {tipo: ...} sin nombre de pestaña.
function normalizar(d) {
  if (d.hoja) return d;
  if (d.tipo === "invitacion") return { hoja: "invitaciones", columnas: ["codigo", "telefono", "fecha"], fila: d.fila };
  return { hoja: "respuestas", columnas: d.columnas, fila: d.fila };
}

function guardarFila(libro, d) {
  if (d.hoja.indexOf("piloto_") === 0 && !tokenValido(libro, String(d.fila.codigo), d.token)) return;
  const hoja = libro.getSheetByName(d.hoja) || libro.insertSheet(d.hoja);
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(d.columnas);
    hoja.setFrozenRows(1);
  }
  const encabezado = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  d.columnas.forEach(function (c) {
    if (encabezado.indexOf(c) < 0) {
      encabezado.push(c);
      hoja.getRange(1, encabezado.length).setValue(c);
    }
  });
  const valores = encabezado.map(function (c) {
    const v = d.fila[c];
    if (v === undefined || v === null) return "";
    if (c === "telefono" && v !== "") return "'" + v;
    return v;
  });
  const clave = String(d.fila[encabezado[0]]);
  const n = hoja.getLastRow() - 1;
  const claves = n > 0 ? hoja.getRange(2, 1, n, 1).getValues().map(function (r) { return String(r[0]); }) : [];
  const i = claves.indexOf(clave);
  if (i < 0) { hoja.appendRow(valores); return; }
  const colCompleta = encabezado.indexOf("completa") + 1;
  if (colCompleta > 0 && String(hoja.getRange(i + 2, colCompleta).getValue()) === "1") return;
  hoja.getRange(i + 2, 1, 1, valores.length).setValues([valores]);
}

// El enlace del piloto trae un código (N07) y dos letras (K3). Si no coinciden con la
// pestaña "negocios", la respuesta se descarta: así nadie contesta por otro negocio.
function tokenValido(libro, codigo, token) {
  const h = libro.getSheetByName("negocios");
  if (!h || h.getLastRow() < 2) return true;
  const filas = h.getRange(2, 1, h.getLastRow() - 1, 2).getValues();
  for (let i = 0; i < filas.length; i++) {
    if (String(filas[i][0]) === codigo) return String(filas[i][1]) === String(token);
  }
  return true;
}

// La tablet pregunta qué encuestas del piloto ya están completas.
function doGet(e) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const res = { D0: {}, S6: {} };
  ["D0", "S6"].forEach(function (m) {
    const h = libro.getSheetByName("piloto_" + m);
    if (!h || h.getLastRow() < 2) return;
    const enc = h.getRange(1, 1, 1, h.getLastColumn()).getValues()[0];
    const ic = enc.indexOf("completa");
    h.getRange(2, 1, h.getLastRow() - 1, h.getLastColumn()).getValues().forEach(function (f) {
      res[m][String(f[0])] = String(f[ic]) === "1" ? 1 : 0;
    });
  });
  return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
}
