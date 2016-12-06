var pg = require('pg');

var connectionString = 'postgres://geoapp:geoapp@localhost:5432/geoapp';
var connectionConfig = {user: 'geoapp', password: 'geoapp', database: 'geoapp', host: 'localhost', port: 5432}

var client = new pg.Client(connectionConfig);

//var postId = req.params.id;


client.connect();

query = client.query("SELECT * FROM post WHERE id = 1");

query.on("row", function(row) {
	console.log(row)
})