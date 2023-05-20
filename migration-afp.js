const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config();

const url = process.env.URL;
const token = process.env.TOKEN;
const folderPath = './imagen';

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'multipart/form-data',
};

const header = {
  'Authorization': `Bearer ${token}`,
}

fs.readdir(folderPath, (err, files) => {
  if (err) throw err;

  files.forEach(async (fileName) => {
    const imagePath = path.join(folderPath, fileName);
    const imageStream = fs.createReadStream(imagePath);

    const formData = new FormData();
    formData.append('file', imageStream);

    console.log(`Subiendo archivo ${fileName}`)
    const data = await uploadImage(url, formData, headers);
    data.source.system = "ftp";
    data.source.type = "ftp";
    data.distributor = {
      'name':'AFP',
      'category' : 'wires',
      'subcategory' : '',
      'reference_id': process.env.REFERENCE_ID,
      'mode' : 'reference'        
    };
    data.additional_properties.published = "false";
    const _id = data._id;
    
    if(_id){
      console.log(`Actualizando archivo ${fileName} para AFP`)
      const currentImage = await updateImage(_id, data, header)
    }
    
  });
});

function uploadImage(url, formData, headers) {
  const response = axios.post(url, formData, { headers })
    .then(response => {
      console.log(response)
      return response.data;
    })
    .catch(error => {
      console.error(`Error al cargar la imagen ${fileName}:`, error.message);
    });
  
  return response;
}

function updateImage(photoId, formData, headers) {
  const response = axios.put(`${url}/${photoId}`, formData, { headers })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(`Error al actualizar datos`);
      console.log(error)
    });

}