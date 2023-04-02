const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();


const url = process.env.URL;
const token = process.env.TOKEN;
const sourceId = process.env.SOURCE_ID;


// Ruta de la imagen que deseas cargar
const imagePath = './imagen/El-Universo.jpg';
// Cargar el archivo de imagen como un flujo de lectura de archivo
const imageStream = fs.createReadStream(imagePath);

// Configurar los encabezados necesarios para la autenticación de la API
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'multipart/form-data',
};

// Configurar los datos de la carga
const formData = new FormData();
formData.append('file', imageStream);
formData.append('source_id', sourceId);
formData.append('additional_properties', JSON.stringify({
  editor: 'photo center'
}));

// Realizar la solicitud POST para cargar la imagen
axios.post(url, formData, { headers })
  .then(response => {
    console.log('Imagen cargada con éxito:', response);
  })
  .catch(error => {
    console.error('Error al cargar imagen:', error.message);
  });
