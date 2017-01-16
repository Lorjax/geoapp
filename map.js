// Hintergrundkarten
// osm
var openstreetmap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | '
});

// WebAtlas-Light
var webatlas = L.tileLayer.wms('http://sg.geodatenzentrum.de/wms_webatlasde.light?', {
	layers:'webatlasde.light',
	format:'image/png',
	transparent:'true',
	srs:'EPSG3857',
	attribution:'© GeoBasis-DE / <a href="http://www.bkg.bund.de">BKG</a> 2016'
});

var baselayers = {
	"OpenStreetMap": openstreetmap,
	"WebAtlas-Light": webatlas
}

var map = L.map('map',{
	center: [49.87,8.65],
	zoom: 15,
	crs: L.CRS.EPSG3857,
	layers: openstreetmap,
});

var haltestellen = new L.LayerGroup();
var graffiti = new L.LayerGroup();
var illegale_entsorgung = new L.LayerGroup();
var fahrradstaender = new L.LayerGroup();
var strassenschaden = new L.LayerGroup();
var givebox = new L.LayerGroup();

var overlays = {
	"Graffiti": graffiti,
	"Illegale Entsorgung": illegale_entsorgung,
	"Haltestellen": haltestellen,
	"Fahrradständer": fahrradstaender,
	"Straßenschäden":strassenschaden,
	"Giveboxen":givebox
}

L.control.layers(baselayers, overlays).addTo(map);

function onEachFeature(feature, layer) {
	if (feature.properties) {
		var popupData = [];

		for (var prop in feature.properties) {
			popupData.push(prop + ": " + feature.properties[prop]);
		}

		layer.bindPopup(popupData.join("<br />"));
	}
}

var myStyle = {
    "color": "#ffff00",
    "weight": 5,
    "opacity": 0.65
};
// Load data via jquery
// Graffiti
$.ajax({url: "http://130.83.41.54:2999/api/graffiti",
	success: function(result) {
		L.geoJSON(result, {
			onEachFeature: onEachFeature
		}).addTo(graffiti);
	}});

//illegale_entsorgung
$.ajax({url: "http://130.83.41.54:2999/api/illegale_entsorgung",
	success: function(result) {
		L.geoJSON(result, {
			onEachFeature: onEachFeature,
		}).addTo(illegale_entsorgung);
	}});

// haltestelle
$.ajax({url: "http://130.83.41.54:2999/api/haltestelle",
	success: function(result) {
		L.geoJSON(result, {
			onEachFeature: onEachFeature,
		}).addTo(haltestellen);
	}});

// fahrradstaender
$.ajax({url: "http://130.83.41.54:2999/api/fahrradstaender",
	success: function(result) {
		L.geoJSON(result, {
			onEachFeature: onEachFeature,
		}).addTo(fahrradstaender);
	}});

//strassenschaden
$.ajax({url: "http://130.83.41.54:2999/api/strassenschaden",
	success: function(result) {
		L.geoJSON(result, {
			onEachFeature: onEachFeature,
		}).addTo(strassenschaden);
	}});

// givebox
$.ajax({url: "http://130.83.41.54:2999/api/givebox",
	success: function(result) {
		L.geoJSON(result, {
			onEachFeature: onEachFeature,
		}).addTo(givebox);
	}});
