require('dotenv').config();
const axios = require('axios');
const ftp = require("ftp");
const request = require("request");
var fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');

// constantes globales
// Configuración del servidor FTP
const config = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
};
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const url_efe = process.env.URL_API_EFE;
let continue_execution = false; let date_from = 0;
const ftp_folder="img-efe";
const dir_lock="./lock";
const file_lock="manage.lock";
const dbPath = "/home/cinthia/var/lib/efe/db/db-efe.sqlite";
const dir_logs= "./logs";


// Conectarse a BD
// Crear una nueva instancia de la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
    errorlog('BDError', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos SQLite.');
    db.get('SELECT date_from FROM agencia WHERE name = ?', ['agencia-efe'], (err, row) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(row.date_from);
        if(row.date_from !== 0){
          date_from = row.date_from;
        }
      }
    });
  }
});

async function manageImagesFromAPi() {

  try {
    let counter = 0;
    const token = await getToken(url_efe);
    const downloaded_images = await getData(url_efe, token);
    console.log(`Hay en total ${downloaded_images.length} imagenes`);
    if(downloaded_images.length < 0) {
      console.log('No hay imagenes por subir')
      return;
    }
    // Se agrega archivo de bloqueo
    if (fs.existsSync(dir_lock)) {
      fs.appendFile(`${dir_lock}/${file_lock}`, 'Downloading images...', function (err) {
        if (err)
          throw err;
        console.log('Download Locked!');
      });
    }

    // Conexión al servidor FTP
    console.log('Conectando al servidor FTP');
    const client = new ftp();
    client.connect(config);

    client.on("ready", () => {
      console.log(`Conexión al servidor FTP establecida.`);
      downloaded_images.forEach(element => {
        const originalUrl = element.objects[0].files[0].url;
        const fileName = element.objects[0].files[0].fileName;
        const folderPath = `/${ftp_folder}/${fileName}`;

        console.log(`Archivo: ${fileName} - id: ${element.packageInfo.id} - fecha : ${element.packageInfo.date}`)
        // Obtenemos la imagen como un flujo de lectura desde la URL

        const urll='prueba';
        let imageStream;
        try {
          imageStream = request.get(urll);
        } catch (error) {
          if (error.code === 'ECONNRESET') {
            errorlog('TypeError', error)
            throw new ConnectionResetError('Error de conexión');
          } else {
            console.log(error)
            errorlog('TypeError', error)
          }
        }

         // Subimos la imagen al servidor FTP
        client.put(imageStream, folderPath, (err) => {
          if (err) {
            console.error('Este es el error: ' + err);
            errorlog('TypeError', err);
          } else {
            counter++;
            console.log(`La imagen ${fileName} se subió correctamente.`);
            if (counter === downloaded_images.length) {
              console.log('Se subieron todas las imágenes exitosamente.');
              //borrado del archivo lock que valida que el proceso se este ejecutando
              try {
                  fs.unlinkSync(`${dir_lock}/${file_lock}`)
                  console.log('File manage.lock removed')
              } catch(err) {
                  console.error('Something wrong happened removing the file manage.lock', err)
              }

              // Cierra la conexión FTP y muestra un mensaje de aviso
              client.on('end', () => {
                console.log('La conexión FTP ha sido cerrada.');
              });
              client.end()
            }
          }
        });

      });
    })

    // Manejo de errores conexión FTP
    client.on("error", (err) => {
      console.error(`Error al conectarse al servidor FTP: ${err}`);
      errorlog('ConnectionError', err);
    });

  } catch (error) {
    console.error(`Error en la función manageImagesFromAPi: ${error}`);
    errorlog('TypeError', error);
  }
}

// Bloque principal

//creacion del directorio
if (!fs.existsSync(dir_lock)) {
  fs.mkdirSync(dir_lock, { recursive: true });
}

// se verifica la existencia del archivo
if (!fs.existsSync(`${dir_lock}/${file_lock}`)) {
   continue_execution=false;
}else {
  continue_execution=true;
}

// se verifica si el proceso se encuentra en ejecucion
if (continue_execution) {
  console.log('La función ya se está ejecutando, se omitirá esta ejecución');
} else {
  try {
    manageImagesFromAPi();  
} catch(err) {
    console.error('error en manage', err)
}
}

function getData(url, token) {
  // Obtenemos la hora actual en formato UTC
  let currentTimeUTC = moment().utc().format();
  currentTimeUTC = convertDateUTC(currentTimeUTC);
  // Restamos 5 minutos a la hora actual
  let fiveMinutesAgo = moment().utc().subtract(5, 'minutes').format();
  fiveMinutesAgo = convertDateUTC(fiveMinutesAgo);

  db.run('UPDATE agencia SET date_from = ? WHERE name = ?', [currentTimeUTC, 'agencia-efe'], function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Se actualizó la columna`);
    }
  });

  const response = axios.get(
    `${url}/content/items_ByProductId?product_id=158&sort=asc&date_from=${date_from || fiveMinutesAgo}&date_to=${currentTimeUTC}&page=0&page_size=20&start_itemId=0&lang_code=ES&format=json`, 
    { headers: {
        'Accept':'text/plain; version=1.0',
        'Authorization': `Bearer ${token}`
      }
  })
  .then(response => {
    return response.data.data.items;
  })
  .catch(error => {
    console.log(error);
    errorlog('APIError', error);
  });
  return response;
}

function getToken(url) {
  const token = axios.get(
    `${url}/account/token?clientId=${clientId}&clientSecret=${clientSecret}`, 
    {headers : {'Accept':'application/json'}})
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.log(error);
    errorlog('APIError', error);
  });
  return token;
}

function errorlog(tipo, error) {
  console.log('ingreso el error')
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const hour = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  const logFile = `${dir_logs}/error_${tipo}_${date}.log`;
  const filePath = `${logFile}`;
  const message = `${tipo}: ${error.message || error} - ${hour}\n`;

  fs.appendFile(filePath, message, (error) => {
    if (error) {
      console.error('Sucedio error en el archivo' +  error);
    } else {
      console.log(`Se ha registrado un error de tipo ${tipo} en el archivo ${filePath}`);
    }
  });

  if (fs.existsSync(`${dir_lock}/${file_lock}`)) {
    fs.unlinkSync(`${dir_lock}/${file_lock}`)
    console.log('File manage.lock removed')
  }
}

// Convierte las fechas a diferentes formatos
function convertDateUTC (fechaUTC){
  return moment.utc(fechaUTC).format('YYYYMMDDTHHmmss');
}