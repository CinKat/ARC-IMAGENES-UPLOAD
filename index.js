const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');


const url = process.env.URL;
const token = process.env.TOKEN;

// Ruta de la imagen que deseas cargar
const imagePath = './imagen/El-Universo.jpg';
// Cargar el archivo de imagen como un flujo de lectura de archivo
const imageStream = fs.createReadStream(imagePath);
const detailSource = {
    "mode": "reference",
    "reference_id": "d660f933-57d4-462e-8bcd-f6020a73edb5"
}

// Configurar los encabezados necesarios para la autenticación de la API
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'multipart/form-data',
};

// Configurar los datos de la carga
const formData = new FormData();
formData.append('distributor', JSON.stringify(detailSource));
formData.append('file', imageStream);
// const currentData = { ...formData, 'distributor': JSON.stringify(detailSource)}
console.log(formData)


// Realizar la solicitud POST para cargar la imagen
axios.post(url, formData, { headers })
  .then(response => {
    console.log('Imagen cargada con éxito:', response);
  })
  .catch(error => {
    console.error('Error al cargar imagen:', error.message);
  });

// d660f933-57d4-462e-8bcd-f6020a73edb5
// d660f933-57d4-462e-8bcd-f6020a73edb5
