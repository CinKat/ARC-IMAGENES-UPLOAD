const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const url =  process.env.URL;
const token = process.env.TOKEN;
const imagePath = './imagen/banner-300.png';

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
};

const ans = {
  source: {
    name: "AFP",
    source_type: "wires",
    additional_properties: {
      editor: "photo center"
    },
    system: "arc i/o"
  }
};

const formData = new FormData();
formData.append('file', fs.createReadStream(imagePath));
formData.append('ans', JSON.stringify(ans));


// Realizar la solicitud POST para cargar la imagen
axios.post(url, formData, { headers })
  .then(response => {
    console.log('Imagen cargada con éxito:', response);
  })
  .catch(error => {
    console.error('Error al cargar imagen:', error.message);
  });