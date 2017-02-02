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

router.delete('/:table/:id', db.deleteObject, function(req, res) {
	
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
app.get('/verwaltung.html', function(req, res) {
	res.sendFile(path.join(__dirname+'/verwaltung.html'));
});
app.get('/verwaltung.js', function(req, res) {
	res.sendFile(path.join(__dirname+'/verwaltung.js'));
});
app.use('/icons', express.static(__dirname+'/icons'));


// Listenport definieren
app.listen(2999, function(){
	console.log("Server running under port 2999.");
})


module.exports = app;
