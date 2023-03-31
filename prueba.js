const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('field', 'my value');
form.append('file', fs.createReadStream('/pictures/avatar.png'));

console.log(form);
