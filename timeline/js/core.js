/*******************************************************************************
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (core.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
*
*    core.js is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    core.js is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
/**
* Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
* This file (core.js) is part of ipc-d3, and developed by: Massimiliano Leone - <maximilianus@gmail.com> - https://plus.google.com/+MassimilianoLeone.
* 
*     core.js is free software: you can redistribute it and/or modify
*     it under the terms of the GNU General Public License as published by
*     the Free Software Foundation, either version 3 of the License, or
*     (at your option) any later version.
* 
*     core.js is distributed in the hope that it will be useful,
*     but WITHOUT ANY WARRANTY; without even the implied warranty of
*     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*     GNU General Public License for more details.
* 
*     You should have received a copy of the GNU General Public License
*     along with .  If not, see <http://www.gnu.org/licenses/>.
*/
// "jsonFile" name is by convention
var jsonFile = "timeline/divertimento_e_ristoro_-_timeline.json";

// "visualize(data)" function signature is by convention
function visualize(data) {
var width = 450;

var colorScale = d3.scale.ordinal()
	//		 purple,   	pink,     	light blue, blue, 		dark green, bordeaux, 	red,		black
	.range(['#ff00cc',	'#9900ff',	'#3399CC',	'#000033',	'#009900',  '#990000',	'#ff0000',	"#000000"])
	.domain(["Discoteca","DiscoPub","Cocktail",	"American",	"Panineria","Pub",		"Wine",		"Default"]);

var chart = '';
chart = d3
	.timeline()	
	.colors( colorScale )
	.colorProperty('tipiSpecificiReduced')
	.width(width*2)
	.stack()
	.margin({left:120, right:10, top:0, bottom:0})
	.tickFormat( // 
		{	format: d3.time.format("%H"), 
			tickTime: d3.time.hours,
			tickInterval: 1,
			tickSize: 6	})
	.hover(function (d, i, datum) {
		var div = $('#hover');
		var colors = chart.colors();
//		console.log(" "+" "+i+" "+colors);
		var color = colors(i);
		var label = datum.label;
//		console.log(i+" "+color+" "+label);
		div.find('.colored').css('background-color', color);
		div.find('#name').text(label);
	})
	.scroll(function (x, scale) {
		$("#scrolled_date").text(scale.invert(x) + " to " + scale.invert(x+width));
	})
	.click(function (d, i, datum) {
		var title = datum.label;
		var address = datum.indirizzo+" "+datum['numeroCivico'];
		var tipiSpecifici = datum['tipiSpecifici'];
		var latlngArray = datum.geolocazione.split(",");
		var lat = latlngArray[0];
		var lng = latlngArray[1];
		var latlng = new google.maps.LatLng(lat,lng);
		var phone = getPhone(datum);
		palerMobileMap.setMarker(latlng, title, address, phone, tipiSpecifici, datum.web);
		scrollToElement('#map-canvas_timeline');
		
		function getPhone(datum) {
			var tel = checkField(datum.telefono);
			if (tel != "")
				return tel;
			return checkField(datum.mobile);
		}
	});

var svg = d3.select("#out").append("svg")
	.attr("width", width*2)
	.datum(data).call(chart);
}
      
