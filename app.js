// Express
var express = require('express');

var app = express();

// Database
var db = require('./queries');


// Routes
var router = express.Router();

router.get('/', function(req, res) { });
router.post('/', function(req, res) { });
router.get('/:id', db.lookupPost, function(req, res) {
	res.json(req.post);
});
router.patch('/:id', function(req, res) { });
router.delete('/:id', function(req, res) { });

app.use('/api', router);


app.listen(3000, function(){
	console.log("Server running under port 3000.");
})


module.exports = app;