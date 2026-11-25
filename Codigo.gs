// Recibe las respuestas que se contestan por enlace o por QR.
// - Pestaña "respuestas": una fila por encuesta. Si llega otra vez el mismo código
//   (por ejemplo, primero incompleta y luego completa), se actualiza la misma fila.
//   Una encuesta ya completa no se vuelve a sobrescribir: cada QR vale una sola vez.
// - Pestaña "invitaciones": teléfonos, separados de las respuestas.
// Usa este mismo código en las dos hojas (tesis y práctica de la materia).
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const datos = JSON.parse(e.postData.contents);
    const libro = SpreadsheetApp.getActiveSpreadsheet();

    if (datos.tipo === "invitacion") {
      const inv = libro.getSheetByName("invitaciones") || libro.insertSheet("invitaciones");
      if (inv.getLastRow() === 0) inv.appendRow(["codigo", "telefono", "fecha"]);
      inv.appendRow([datos.fila.codigo, "'" + datos.fila.telefono, datos.fila.fecha]);
      return ContentService.createTextOutput("ok");
    }

    const fila = datos.fila;
    const hoja = libro.getSheetByName("respuestas") || libro.insertSheet("respuestas");
    if (hoja.getLastRow() === 0) {
      hoja.appendRow(datos.columnas);
      hoja.setFrozenRows(1);
    }
    const encabezado = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
    datos.columnas.forEach(function (c) {
      if (encabezado.indexOf(c) < 0) {
        encabezado.push(c);
        hoja.getRange(1, encabezado.length).setValue(c);
      }
    });

    const valores = encabezado.map(function (c) { return fila[c] === undefined ? "" : fila[c]; });
    const n = hoja.getLastRow() - 1;
    const codigos = n > 0 ? hoja.getRange(2, 1, n, 1).getValues().map(function (r) { return String(r[0]); }) : [];
    const i = codigos.indexOf(String(fila.codigo));
    if (i >= 0) {
      const colCompleta = encabezado.indexOf("completa") + 1;
      const yaCompleta = String(hoja.getRange(i + 2, colCompleta).getValue()) === "1";
      if (!yaCompleta) hoja.getRange(i + 2, 1, 1, valores.length).setValues([valores]);
    } else {
      hoja.appendRow(valores);
    }
    return ContentService.createTextOutput("ok");
  } finally {
    lock.releaseLock();
  }
}
