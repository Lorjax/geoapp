$(document).ready(function() {
	loadEntries("graffiti");
	loadEntries("illegale_entsorgung");
	loadEntries("haltestelle");
	loadEntries("fahrradstaender");
	loadEntries("strassenschaden");
	loadEntries("givebox");

	$("#graffiti").on("click", "#btnDelete", (function() {
		var id = $(this).val();
		deleteEntry("graffiti", id);
	}));

	$("#illegale_entsorgung").on("click", "#btnDelete", (function() {
		var id = $(this).val();
		deleteEntry("illegale_entsorgung", id);
	}));

	$("#haltestelle").on("click", "#btnDelete", (function() {
		var id = $(this).val();
		deleteEntry("haltestelle", id);
	}));

	$("#fahrradstaender").on("click", "#btnDelete", (function() {
		var id = $(this).val();
		deleteEntry("fahrradstaender", id);
	}));

	$("#strassenschaden").on("click", "#btnDelete", (function() {
		var id = $(this).val();
		deleteEntry("strassenschaden", id);
	}));

	$("#givebox").on("click", "#btnDelete", (function() {
		var id = $(this).val();
		deleteEntry("givebox", id);
	}));
});

function deleteEntry(table, id) {
	var url = '/api/' + table + '/' + id + '/'
	$.ajax({
		url: url,
		type: 'DELETE',
		success: function(result) {
			location.reload(true);
		}
	});
}

function loadEntries(table) {
	$.getJSON({url: 'http://localhost:2999/api/' + table + '/',
			headers: { Accept: "application/json"},
			success: function(data) {
			var items = "";
			for (var i = 0; i < data.length; i++) {
				items += "<tr>";
				for (var prop in data[i]) {
				items += "<td>" + data[i][prop] + "</td>";
				}
				items += '<td><button id="btnDelete" value="' + data[i]['id'] + '">löschen</button></td>'
				items += "</tr>";
			}
			
			console.log(items);
			$('#' + table + ' tbody').append(items);
		}});

	
}