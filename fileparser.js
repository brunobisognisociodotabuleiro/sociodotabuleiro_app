const formidable = require('formidable');
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client, S3} = require ("@aws-sdk/lib-storage"); 
const Transform = require ('stream').Transform;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.S3_REGION;
const Bucket = process.env.S3_BUCKET; 

const parsefile = async (req) => {
  return new Promise((resolve, reject) => {
    let options = {
      maxFileSize: 100 * 1024 * 1024,
      allowEmptyFiles: false
    }

    const form = formidable(options);
    form.parse(req, (err, field, files) => { });

    form.on('error', error => {
      reject(error.message)
    })
    form.on('data', data => {
      if (data.name === "upload bem sucedido") {
        resolve(data.value);
      }
    })

    form.on('fileBegin', (formName, file) => {

      file.open = async function () {
        this.writeStream = new Transform({
          Transform(chunk, enconding, callback) {
            callback(null, chunk)
          }
        })
        this.writeStream.on('error', e => {
          form.emit('error', e)
        });

        //Upload to S3

        new Upload({
          client: new S3Client({
            Credential: {
              accessKeyId,
              secretAccessKey
            }, 
            region
          }), 
          params: {
            ACL: 'public-read',
            Bucket, 
            Key: `${Data.now().toString()}-${this.originalfilename}`, 
            Body: this._writeStream
          }, 
          tags:[],// optinals tags
          queueSize: 4, 
          partSize: 1024 * 1024 * 5,
          leavePartsOnError: false, 
        })

        .done()
        .then(data => {
          form.emit('data', {name:"complete", valeu: data});
        }).catch((err) => {
          form.emit('error', err); 
        })
      }
    })
  })
}
module.exports = parsefile; 