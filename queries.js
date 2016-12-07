// Dependencies
var pg = require('pg');
var geoJson = require('geojson');

// Database configuration
var connectionString = 'postgres://geoapp:geoapp@localhost:5432/geoapp';
var client = new pg.Client(connectionString);

// Verbindung mit Datenbank herstellen
client.connect(function (err) {
	if (err) console.log("FEHLER bei Verbindungsaufbau mit Datenbank!\n" + err);
});

function lookupPost(req, res, next) {
	// Id aus params des request holen
	var postId = req.params.id;
	console.log("[DEBUG] SELECT");
	console.log("[DEBUG] Angefragte ID: " + postId);
	// SQL-Statement mit Platzhalter $1 für id und Parsen zum Integer
	var sql = 'SELECT * FROM Post WHERE id = $1::integer';
	// Ausführen des Query
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
		req.post = geoJson.parse(results.rows[0], {Point: ['latitude', 'longitude']});
		console.log("GeoJSON: \n" + JSON.stringify(req.post));
		next();
	});

}

function lookupPosts(req, res, next) {
	// Id aus params des request holen
	console.log("[DEBUG] SELECT ALL");
	// SQL-Statement mit Platzhalter $1 für id und Parsen zum Integer
	var sql = 'SELECT * FROM Post';
	// Ausführen des Query
	query = client.query(sql, function(err, results) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({ errors: "could not retrieve posts" });
		}

		if(results.rows.length === 0) {
			res.statusCode = 404;
			return res.json({ errors: "No Posts found"});
		}
		var data = []
		for (i = 0; i < results.rows.length; i++) {
			data.push(results.rows[i]);
		}
		console.log(JSON.stringify(geoJson.parse(data, {Point: ['latitude', 'longitude']})));
		//console.log(results.rows[0]);
		req.post = geoJson.parse(data, {Point: ['latitude', 'longitude']});
		//req.post += geoJson.parse(data, {Point: ['latitude', 'longitude']});
		next();
	});

}

function insertPost(req, res, next) {
	console.log("[DEBUG] INSERT");
	var sql = "INSERT INTO post(id, title, message, longitude, latitude) " +
				"VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id";
	var data = [req.body.title, req.body.message, req.body.longitude, req.body.latitude];
	console.log("[DEBUG] Insert-Parameter: \n");
	console.log(data);
	// Starte Insert
	client.query(sql, data, function(err, result) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({ errors: "could not create post" });
		}

		var sql = 'SELECT * FROM post WHERE id = $1';
		client.query(sql, [result.rows[0].id], function(err, result) {
			if(err) {
				console.error(err);
				res.statusCode = 500;
				return res.json({ errors: "could not retrieve post after create" });
			}
		});

		res.statusCode = 201;

		res.json(result.rows[0]);

	});	
}

module.exports = {
	lookupPost: lookupPost,
	insertPost: insertPost,
	lookupPosts: lookupPosts
};