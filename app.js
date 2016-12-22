// Express
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var upload = multer({dest: './uploads/'});

var app = express();

var jsonParser = bodyParser.json();

// Database
var db = require('./queries');


// Routes
var router = express.Router();

router.post('/:table', upload.single('photo'), jsonParser, db.insertObject, function(req, res) {
});

router.get('/:table', db.dbLookup, function(req, res) {
	res.json(req.post);
});

// router.patch('/:id', function(req, res) { });

// router.delete('/:id', function(req, res) { });

app.use('/api', router);

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/map.js', function(req, res) {
	res.sendFile(path.join(__dirname+'/map.js'));
});

// Listenport definieren
app.listen(3000, function(){
	console.log("Server running under port 3000.");
})


module.exports = app;