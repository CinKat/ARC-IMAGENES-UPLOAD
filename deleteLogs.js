const fs = require('fs');
const path = require('path');
const moment = require('moment');

// Obtener la fecha actual en el formato "YYYYMMDD".
const fecha_actual = moment().format('YYYYMMDD');
const logsDir = path.join(__dirname, 'logs');
const lista_archivos = fs.readdirSync(logsDir)

// Iterar sobre la lista de archivos y eliminar aquellos que tienen una fecha anterior a la fecha actual.
lista_archivos.forEach(archivo => {
  const fecha_archivo = archivo.split('_')[2].split('.')[0];
  if (fecha_archivo < fecha_actual) {
    fs.unlinkSync(path.join(logsDir, archivo));
  }
});





