/*******************************************************************************
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (palermobile-map.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
* 	as part of https://github.com/BeardTeam/opendata-experiments
*
*    palermobile-map.js is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    palermobile-map.js is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

/**
 * @author "Massimiliano Leone - maximilianus@gmail.com"
 */
function PalerMobileMap(mapcanvasDiv) {
	
	var map;	// Google map object
	var currentMarker;
	this._mapcanvasDiv = mapcanvasDiv;
	this.init = mapInit;
	this.setMarker = setMarker;

// Initialize and display a google map
	function mapInit() {
		// Create a Google coordinate object for where to initially center the map
		var latlng = new google.maps.LatLng( 38.115702,13.361281 );	// Palermo
		
		// Map options for how to display the Google map
		var mapOptions = { zoom: 11, center: latlng  };
		
		// Show the Google map in the div with the attribute id 'map-canvas'.
		map = new google.maps.Map(document.getElementById(this._mapcanvasDiv), mapOptions);
	};
	function setMarker(latlng, title, address, phone, tipiSpecifici, web) {
		clearMarker();
		var marker = new google.maps.Marker({
			position: latlng,
			map: map
//			,title: title
		});
		currentMarker = marker;
		// Create an InfoWindow for the marker
		var contentString = 
			"<div class='infowindow'>"
				+ "<div class='infowindow_title'>"
					+ "<b>"+title+"</b>"
				+ "</div>"
				+ "<div class='infowindow_content'" // start content
					+ "<div>"+"<i>"+tipiSpecifici+"</i></div>"
					+ "<div>"+address+"</div>"
					+ "<div>"+phone+"</div>";
		var web = checkField(web);
		contentString += "<div><a href="+web+">"+web+"</a></web>";
		contentString += "</div>" // end content
			+"</div>"; // HTML text to display in the InfoWindow
		var infowindow = new google.maps.InfoWindow({ content: contentString });
		
		// Set event to display the InfoWindow anchored to the marker when the marker is clicked.
		google.maps.event.addListener( marker, 'click', function() { infowindow.open( map, marker ); });
		
		map.setZoom( 12 );
		map.setCenter(latlng);
	}
	function clearMarker() {
		if (currentMarker!=null)
			currentMarker.setMap(null);
	}
}
