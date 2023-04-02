const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

// Obtener las variables de entorno necesarias
const photoCenterUrl = process.env.URL;
const photoCenterApiKey = process.env.TOKEN;
const sourceId = process.env.SOURCE_ID;
const imagePath = './imagen/El-Universo.jpg';

console.log(sourceId)
console.log(photoCenterApiKey)


// Crear un objeto FormData para enviar la imagen y los metadatos
const formData = new FormData();
formData.append('file', fs.createReadStream(imagePath));
formData.append('source_id', sourceId);
formData.append('additional_properties', JSON.stringify({
  editor: 'photo center'
}));

// Enviar la solicitud POST a la API de Photo Center
axios.post(photoCenterUrl, formData, {
  headers: {
    'X-API-Key': photoCenterApiKey,
    ...formData.getHeaders()
  }
})
  .then(response => {
    console.log('Imagen cargada con éxito:', response.data);
  })
  .catch(error => {
    console.error('Error al cargar imagen:', error.message);
  });

  // newsml:afp.com:20221108T151548Z:doc-32n48tu.xml
  // newsml:afp.com:20221108T152002Z:doc-32n494p.xml
  // newsml:afp.com:20221108T154233Z:doc-32n49br.xml



