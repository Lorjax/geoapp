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

function lookupObjects(req, res, next) {
	// Id aus params des request holen
	console.log("[DEBUG] SELECT ALL");
	var tablenames = ['graffiti', 'illegale_entsorgung', 'haltestelle',
						'fahrradstaender', 'strassenschaden', 'givebox'];

	var data = [];

	for (j = 0; j < tablenames.length; j++) {
		console.log("[DEBUG] Starte SQL QUERY auf " + tablenames[j]);
		var sql = 'SELECT * FROM ' + tablenames[j];

		query = client.query(sql, function(err, results) {
			if(err) {
				console.error(err);
				res.statusCode = 500;
				return res.json({errors: "could not lookup " + tablenames[j]});
			}

			if(results.rows.length === 0) {
				res.statusCode = 404;
				return res.json({errors: "nothing found in table " + tablenames[j]});
			}

			for(i = 0; i < results.rows.length; i++) {
				data.push(results.rows[i]);
			}

			console.log("[DEBUG] gefundene Eintraege: " + results.rows.length);
		});

	}
	console.log(data);
	req.data = geoJson.parse(data, {Point: ['latitude', 'longitude']});
	next();

	// SQL-Statement mit Platzhalter $1 für id und Parsen zum Integer
	// var sql = 'SELECT * FROM Post';
	// // Ausführen des Query
	// query = client.query(sql, function(err, results) {
	// 	if(err) {
	// 		console.error(err);
	// 		res.statusCode = 500;
	// 		return res.json({ errors: "could not retrieve posts" });
	// 	}

	// 	if(results.rows.length === 0) {
	// 		res.statusCode = 404;
	// 		return res.json({ errors: "No Posts found"});
	// 	}
	// 	var data = []
	// 	for (i = 0; i < results.rows.length; i++) {
	// 		data.push(results.rows[i]);
	// 	}
	// 	console.log(JSON.stringify(geoJson.parse(data, {Point: ['latitude', 'longitude']})));
	// 	//console.log(results.rows[0]);
	// 	req.post = geoJson.parse(data, {Point: ['latitude', 'longitude']});
	// 	//req.post += geoJson.parse(data, {Point: ['latitude', 'longitude']});
	// 	next();
	// });

}

function insertObject(req, res, next) {
	console.log("[DEBUG] INSERT INTO "  + req.body.type);
	var sql = "INSERT INTO ";
	var data = [];
	switch(req.body.type) {
		case 'graffiti':
			sql += "graffiti VALUES(DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8) RETURNING id";
			data = [req.body.oeffentlich, req.body.gegenstand, req.body.sittenwidrig,
						req.body.ausdehnung, req.body.latitude, req.body.longitude,
						req.body.beschreibung, req.body.foto];
			break;

		case 'illegale_entsorgung':
			sql += "illegale_entsorgung VALUES (DEFAULT,$1,$2,$3,$4,$5,$6) RETURNING id";
			data = [req.body.ort, req.body.art, req.body.volumen, req.body.latitude,
					req.body.longitude, req.body.bemerkung];
			break;

		case 'haltestelle':
			sql += "haltestelle VALUES (DEFAULT,$1,$2,$3,$4,$5) RETURNING id";
			data = [req.body.bezeichnung, req.body.zustand, req.body.latitude,
					req.body.longitude, req.body.bemerkung];
			break;

		case 'fahrradstaender':
			sql += "fahrradstaender VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,$7) RETURNING id";
			data = [req.body.anzahl, req.body.art, req.body.diebstaehle, req.body.geschuetzteGegend,
					req.body.latitude, req.body.longitude, req.body.bemerkung];
			break;

		case 'strassenschaden':
			sql += "strassenschaden VALUES (DEFAULT,$1,$2,$3,$4,$5,$6) RETURNING id";
			data = [req.body.stelle, req.body.groesse, req.body.gefahr, 
					req.body.latitude, req.body.longitude, req.body.bemerkung];
			break;

		case 'givebox':
			sql += "givebox VALUES (DEFAULT,$1,$2,$3,$4,$5,$6) RETURNING id";
			data = [req.body.art, req.body.inhalt, req.body.qualitaet,
					req.body.latitude, req.body.longitude, req.body.bemerkung];
			break;

	}

	//var sql = "INSERT INTO " + req.body.type + 
	//			" VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id";
	//var data = [req.body.title, req.body.message, req.body.longitude, req.body.latitude];
	console.log("[DEBUG] Insert-Parameter: \n");
	console.log(data);
	console.log("[DEBUG] SQL-Statement: \n");
	console.log(sql);
	//console.log("DEBUG: Photo: \n");
	//console.log(req.file.path);
	// Starte Insert
	client.query(sql, data, function(err, result) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({ errors: "could not create object!" });
		}

		var sql = 'SELECT * FROM ' + req.body.type + ' WHERE id = $1';
		client.query(sql, [result.rows[0].id], function(err, result) {
			if(err) {
				console.error(err);
				res.statusCode = 500;
				return res.json({ errors: "could not retrieve object after create" });
			}
		});

		res.statusCode = 201;

		res.json(result.rows[0]);

	});	

}

module.exports = {
	lookupPost: lookupPost,
	insertObject: insertObject,
	lookupObjects: lookupObjects
};