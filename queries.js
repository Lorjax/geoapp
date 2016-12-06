var pg = require('pg');

var connectionString = 'postgres://geoapp:geoapp@localhost:5432/geoapp';
var connectionConfig = {user: 'geoapp', password: 'geoapp', database: 'geoapp', host: 'localhost', port: 5432}

var client = new pg.Client(connectionConfig);



function lookupPost(req, res, next) {
	var postId = req.params.id;
	console.log("[DEBUG] Angefragte ID: " + postId);

	var sql = 'SELECT * FROM Post WHERE id = $1::integer';
	client.connect(function (err) {
		if (err) console.log("FEHLER bei Verbindungsaufbau mit Datenbank!" + err);
	});
	query = client.query(sql, [ postId ], function(err, results) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({ errors: "could not retrieve post" });
		}

		if(results.rows.length === 0) {
			res.statusCode = 404;
			return res.json({ errors: "No Post found"});
		}
		console.log(results.rows[0]);
		req.post = results.rows[0];
		next();
	});

	// query = client.query("SELECT * FROM post WHERE id = $1", [ "1" ]);

	// query.on("row", function(row) {
	// 	console.log(row)
	// })
}

module.exports = {
	lookupPost: lookupPost
};