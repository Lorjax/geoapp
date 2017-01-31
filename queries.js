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

function dbLookup(req, res, next) {
	// Tablename aus params des request holen
	var table = req.params.table;
	// SQL-Statement mit Platzhalter $1 für id und Parsen zum Integer
	var sql = 'SELECT * FROM ' + table;
	console.log("[DEBUG] SELECT: \n" + sql);
	// Ausführen des Query
	query = client.query(sql, function(err, results) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({ errors: "could not retrieve objects from table " + table });
		}

		if(results.rows.length === 0) {
			res.statusCode = 404;
			return res.json({ errors: "No objects found in " + table});
		}
		var data = [];
		for(i = 0; i < results.rows.length; i++) {
			data.push(results.rows[i])
		}
		req.post = geoJson.parse(data, {Point: ['latitude', 'longitude']});
		console.log("GeoJSON: \n" + JSON.stringify(req.post));
		next();
	});

}


function insertObject(req, res, next) {
	console.log("[DEBUG] INSERT INTO "  + req.params.table);
	var sql = "INSERT INTO ";
	var data = [];
	switch(req.params.table) {
		case 'graffiti':
			sql += "graffiti VALUES(DEFAULT,$1,$2,$3,$4,$5,$6,DEFAULT,$7,$8) RETURNING id";
			data = [req.body.oeffentlich, req.body.gegenstand, req.body.sittenwidrig,
						req.body.schriftzug, req.body.latitude, req.body.longitude,
						req.body.bemerkung, req.body.foto];
			break;

		case 'illegale_entsorgung':
			sql += "illegale_entsorgung VALUES (DEFAULT,$1,$2,$3,$4,$5,DEFAULT,$6) RETURNING id";
			data = [req.body.ort, req.body.art, req.body.volumen, req.body.latitude,
					req.body.longitude, req.body.bemerkung];
			break;

		case 'haltestelle':
			sql += "haltestelle VALUES (DEFAULT,$1,$2,$3,$4,DEFAULT,$5) RETURNING id";
			data = [req.body.bezeichnung, req.body.zustand, req.body.latitude,
					req.body.longitude, req.body.bemerkung];
			break;

		case 'fahrradstaender':
			sql += "fahrradstaender VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,DEFAULT,$7) RETURNING id";
			data = [req.body.anzahl, req.body.art, req.body.diebstaehle, req.body.geschuetzteGegend,
					req.body.latitude, req.body.longitude, req.body.bemerkung];
			break;

		case 'strassenschaden':
			sql += "strassenschaden VALUES (DEFAULT,$1,$2,$3,$4,$5,DEFAULT,$6) RETURNING id";
			data = [req.body.stelle, req.body.groesse, req.body.gefahr, 
					req.body.latitude, req.body.longitude, req.body.bemerkung];
			break;

		case 'givebox':
			sql += "givebox VALUES (DEFAULT,$1,$2,$3,$4,$5,DEFAULT,$6) RETURNING id";
			data = [req.body.art, req.body.inhalt, req.body.qualitaet,
					req.body.latitude, req.body.longitude, req.body.bemerkung];
			break;
		default:
			res.statusCode = 404;
			return res.json({ errors: "could not find specified table in database!" });

	}

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

		var sql = 'SELECT * FROM ' + req.params.table + ' WHERE id = $1';
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
	dbLookup: dbLookup,
	insertObject: insertObject
};
