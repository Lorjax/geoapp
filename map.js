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

var map = L.map('map',{
	center: [49.87,8.65],
	zoom: 15,
	crs: L.CRS.EPSG3857,
	layers: [openstreetmap, graffiti, illegale_entsorgung,
			haltestellen, fahrradstaender, strassenschaden,
			givebox]
});

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


// Load data via jquery
// Graffiti
$.ajax({url: "http://localhost:2999/api/graffiti",
	success: function(result) {
		L.geoJSON(result, {
			pointToLayer: function(feature, latlng) {
				var icon = new L.Icon({
					iconSize: [25, 41],
					iconAnchor: [12, 40],
					popupAnchor: [1, -32],
					iconUrl: 'icons/rot-graffiti.png'
				});
				return L.marker(latlng, {icon: icon});
			},
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					var popupData = ["<h2>Graffiti</h2>"];

					for (var prop in feature.properties) {
						popupData.push(prop + ": " + feature.properties[prop]);
					}
					popupData.splice(1,1);
					layer.bindPopup(popupData.join("<br />"));
				}
			}
		}).addTo(graffiti);
	}});

//illegale_entsorgung
$.ajax({url: "http://localhost:2999/api/illegale_entsorgung",
	success: function(result) {
		L.geoJSON(result, {
			pointToLayer: function(feature, latlng) {
				var icon = new L.Icon({
					iconSize: [25, 41],
					iconAnchor: [12, 40],
					popupAnchor: [1, -32],
					iconUrl: 'icons/gruen-illegaleEntsorgung.png'
				});
				return L.marker(latlng, {icon: icon});
			},
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					var popupData = ["<h2>Illegale Entsorgung</h2>"];

					for (var prop in feature.properties) {
						popupData.push(prop + ": " + feature.properties[prop]);
					}
					popupData.splice(1,1);
					layer.bindPopup(popupData.join("<br />"));
				}
			}
		}).addTo(illegale_entsorgung);
	}});

// haltestelle
$.ajax({url: "http://localhost:2999/api/haltestelle",
	success: function(result) {
		L.geoJSON(result, {
			pointToLayer: function(feature, latlng) {
				var icon = new L.Icon({
					iconSize: [25, 41],
					iconAnchor: [12, 40],
					popupAnchor: [1, -32],
					iconUrl: 'icons/gelb-haltestelle.png'
				});
				return L.marker(latlng, {icon: icon});
			},
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					var popupData = ["<h2>Haltestelle</h2>"];

					for (var prop in feature.properties) {
						popupData.push(prop + ": " + feature.properties[prop]);
					}
					popupData.splice(1,1);
					layer.bindPopup(popupData.join("<br />"));
				}
			}
		}).addTo(haltestellen);
	}});

// fahrradstaender
$.ajax({url: "http://localhost:2999/api/fahrradstaender",
	success: function(result) {
		L.geoJSON(result, {
			pointToLayer: function(feature, latlng) {
				var icon = new L.Icon({
					iconSize: [25, 41],
					iconAnchor: [12, 40],
					popupAnchor: [1, -32],
					iconUrl: 'icons/lila-fahrradstaender.png'
				});
				return L.marker(latlng, {icon: icon});
			},
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					var popupData = ["<h2>Fahrradständer</h2>"];

					for (var prop in feature.properties) {
						popupData.push(prop + ": " + feature.properties[prop]);
					}
					popupData.splice(1,1);
					layer.bindPopup(popupData.join("<br />"));
				}
			}
		}).addTo(fahrradstaender);
	}});

//strassenschaden
$.ajax({url: "http://localhost:2999/api/strassenschaden",
	success: function(result) {
		L.geoJSON(result, {
			pointToLayer: function(feature, latlng) {
				var icon = new L.Icon({
					iconSize: [25, 41],
					iconAnchor: [12, 40],
					popupAnchor: [1, -32],
					iconUrl: 'icons/blau-strassenschaeden.png'
				});
				return L.marker(latlng, {icon: icon});
			},
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					var popupData = ["<h2>Straßenschaden</h2>"];

					for (var prop in feature.properties) {
						popupData.push(prop + ": " + feature.properties[prop]);
					}
					popupData.splice(1,1);
					layer.bindPopup(popupData.join("<br />"));
				}
			}
		}).addTo(strassenschaden);
	}});

// givebox
$.ajax({url: "http://localhost:2999/api/givebox",
	success: function(result) {
		L.geoJSON(result, {
			pointToLayer: function(feature, latlng) {
				var icon = new L.Icon({
					iconSize: [25, 41],
					iconAnchor: [12, 40],
					popupAnchor: [1, -32],
					iconUrl: 'icons/hellblau-givebox.png'
				});
				return L.marker(latlng, {icon: icon});
			},
			onEachFeature: function(feature, layer) {
				if (feature.properties) {
					var popupData = ["<h2>Givebox</h2>"];

					for (var prop in feature.properties) {
						popupData.push(prop + ": " + feature.properties[prop]);
					}
					popupData.splice(1,1);
					layer.bindPopup(popupData.join("<br />"));
				}
			}
		}).addTo(givebox);
	}});
