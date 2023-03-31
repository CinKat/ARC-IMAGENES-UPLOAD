const request = require('request');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Config cloudinary
cloudinary.config({
    cloud_name: 'dbgxebj5z',
    api_key: '538253581545242',
    api_secret: 'A3btTtxKSJH1X9U2UjUkUmEbnF8'
});

// URL de carpeta cloudinary
const folderUrl = cloudinary.url('image-eluniverso', { type: 'fetch' });
console.log(folderUrl)

// Definir la URL y el token de autenticación de Photo Center
const url = process.env.URL;
const token = process.env.TOKEN;

// Definir la ruta de la carpeta que se desea subir
const carpeta = folderUrl;
console.log(carpeta)

// Leer los archivos de la carpeta y agregarlos a un objeto de tipo FormData
const formData = {};
fs.readdirSync(carpeta).forEach(file => {
  if (file.endsWith('.jpg') || file.endsWith('.png')) {
    formData[file] = fs.createReadStream(`${carpeta}/${file}`);
  }
});
console.log(formData)
// Enviar la petición HTTP POST con los archivos a la URL de Photo Center
request.post({
  url: url,
  headers: {
    'Authorization': `Bearer ${token}`
  },
  formData: formData
}, function optionalCallback(err, httpResponse, body) {
  if (err) {
    return console.error('Error:', err);
  }
  console.log('Respuesta:', body);
});