var pg = require('pg');

var connectionString = 'postgres://geoapp:geoapp@localhost:5432/geoapp';

var client = new pg.Client(connectionString);
client.connect();


function lookupPost(req, res, next) {
	var postId = req.params.id;

	var sql = 'SELECT * FROM Post WHERE id = ?';

	client.query(sql, [ postId ], function(err, results) {
		if(err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({ errors: "could not retrieve post" });
		}

		if(results.rows.length === 0) {
			res.statusCode = 404;
			return res.json({ errors: "No Post found"});
		}

		req.post = results.rows[0];
		next();
	})
}

module.exports = {
	lookupPost: lookupPost
};