var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
const chaves = require('../modules/chaves');

router.use(express.static('views/imagens')); 
const s3 = new AWS.S3({
  accessKeyId: chaves.id,
  secretAccessKey: chaves.secret
});

router.get('/', function (req, res) {
 
  var params = {
    Bucket: chaves.bucketName,
    Prefix: req.user.displayName,  
  }; 

  s3.listObjects(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      var arquivo = data.Contents;
      console.log(data)
      res.render('principal.hbs', { arquivo });
    }
  });
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: chaves.bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, req.user.displayName + "/" + file.originalname)
    }
  })
})

router.post('/upload', upload.single('upload'), function (req, res, next) {
  var str = '';
  if ( !req.file){
    str = "Nenhum arquivo foi selecionado"
    res.render("upload", {str})
  }
  else{
    str = req.file.originalname + " foi salvo com sucesso";    
    res.render("upload", {str})
  }
})

router.post('/deletado', function (req, res, next) {
  var delArray = [];
 if(!req.body.arquivos){
  
  delArray.push("Nenhum arquivo foi selecionado")
  res.render("delete", {delArray})
 } 
 else if (typeof req.body.arquivos === 'string') {
    
    var delParams = {
      Bucket: chaves.bucketName,
      Key: req.body.arquivos
    };

    s3.deleteObject(delParams, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
    delArray.push(req.body.arquivos)
    res.render("delete", {delArray})
  }

  else {
    for (var i = 0; i < req.body.arquivos.length; i++) {
      var delParams = {
        Bucket: chaves.bucketName,
        Key: req.body.arquivos[i]
      };
      s3.deleteObject(delParams, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data);           // successful response
      });
      delArray.push(req.body.arquivos[i]);
    }
    console.log(delArray)
    res.render("delete", {delArray})
  }
  
})

module.exports = router;

