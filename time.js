const moment = require('moment'); // Utilizamos la biblioteca Moment.js

// Obtenemos la hora actual en formato UTC
let currentTimeUTC = moment().utc().format();
currentTimeUTC = convertDateUTC(currentTimeUTC);

// Restamos 5 minutos a la hora actual
let fiveMinutesAgo = moment().utc().subtract(5, 'minutes').format();
fiveMinutesAgo = convertDateUTC(fiveMinutesAgo);

console.log(currentTimeUTC);
console.log(fiveMinutesAgo);

// Convierte las fechas a diferentes formatos
function convertDateUTC (fechaUTC){
  return moment.utc(fechaUTC).format('YYYYMMDDTHHmmss');
}

