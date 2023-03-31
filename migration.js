const request = require('request');
const fs = require('fs');

const token = process.env.TOKEN;
const imagePath = './imagen/El-Universo.jpg';

const options = {
  url: process.env.URL,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  },
  formData: {
    // ans: fs.createReadStream('/path/to/photo_ans.json'),
    ans: {
        "source": {
            "name": "AFP",
            "source_type": "wires",
            "additional_properties": {
                "editor": "photo center"
            },
            "system": "arc i/o"
        }
    },
    file: fs.createReadStream(imagePath)
  }
};

request.post(options, function(err, res, body) {
  if (err) {
    console.error('Error uploading image:', err);
    return;
  }

  console.log('Image uploaded successfully:', body);
});