var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
require('dotenv').config()

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(process.cwd() + '/public'));

const UPLOAD_DIR = 'public/uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const uploadDir = `./${UPLOAD_DIR}`;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res)=>{
  if(!req.file){
    return res.json({ error: "Not found file upload!" });
  }
  const {originalname, mimetype, size} = req.file;
  return res.json({
    name: originalname,
    type: mimetype,
    size: size
  });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
