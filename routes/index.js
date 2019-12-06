var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')


const ID = 'AKIA4OYJ4MIIK77BDNO6';
const SECRET = '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';
const BUCKET_NAME = 'projeto-nodejs';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

router.get('/', function (req, res) {

  var params = {
    Bucket: BUCKET_NAME,

  };



  s3.listObjects(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      var arquivo = data.Contents;
      console.log(data)
      res.render('index.hbs', { arquivo });
    }
  });
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})

router.post('/', upload.array('upload', 3), function (req, res, next) {


  res.send('Salvado Com Sucesso ' + req.files.length + ' Arquivos!')
})

router.post('/deletado', function (req, res, next) {
  
  for (var i = 0; i <= req.body.arquivos.length; i++) {
    console.log(req.body.arquivos[i])
    if (req.body.arquivos[i]) {
      
      console.log(req.body.arquivos[i])
     
      
      var delParams = {
        Bucket: BUCKET_NAME,
        Key: req.body.arquivos[i]
      };
      s3.deleteObject(delParams, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response

      });

      
    }

  }
  res.send("deletado")
})

module.exports = router;

