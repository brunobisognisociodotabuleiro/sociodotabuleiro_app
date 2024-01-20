const express = require('express');
const app = express(); 
require('dotenv').config(); 

app.set('json space', 5); 

const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  res.send(`
  <h2>File Upload With <code>"Node.js"</code></h2>
  <form action="/s3://arn:aws:s3:sa-east-1:448222252118:accesspoint/documentos/documentos/" enctype="multipart/form-data" method="post">
    <div>Select a file: 
      <input type="file" name="file" multiple="multiple" />
    </div>
    <input type="submit" value="Upload" />
  </form>
`);
}); 

app.post('/s3://arn:aws:s3:sa-east-1:448222252118:accesspoint/documentos/documentos/', async(req, res) => {
  await fileparser(req)
  .then(data => {
    res.status(200).json({
      message:"uploado feito com sucesso",
      data
    })
  })
  .catch(error => {
    res.status(400).json({
      message:"ocorreu um erro",
      error
    })
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})