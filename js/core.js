/**
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (core.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
* 	as part of https://github.com/BeardTeam/opendata-experiments
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


/*
 * side menu zone
 */
var menuItemsMap = {
	'bar_hierarchy': "Bar Hierarchy",
	'bubble_chart': "Bubble Chart",
	'collapsible_tree': 'Collapsible Tree',
	'collapsible_indented_tree': 'Collapsible Indented Tree',
	partition: 'Partition',
	'radial_reingold': "Radial Reingold",
	'tree_reingold': "Tree Reingold",
	'tree_map': "Tree Map",
	'zoomable_circle': "Zoomable Circle",
	'code_flower': "Code Flower",
	choropleth: "Choropleth",
	timeline: "Timeline",
	openhours: "OpenHours",	
	rickshaw: "Richshaw (D3)",
	'google_stacklines': "StackLines Chart (Google)",
	'google_timeline': 'Timeline Chart (Google)',
	'multidimensional_timeline': 'MultiDimensional<br/>Interactive Timeline'	
};
function createMenuItems() {
  var menu_li = document.getElementById('menu_li');
  
  var html = "";
  var hrefs = Object.keys(menuItemsMap);
  for (var h in hrefs) {
    var href = hrefs[h];
    htmlValue = menuItemsMap[href];
    html += "<a class='menu_href' href='"+href+".html'>"+htmlValue+"</a>";
  }
  menu_li.innerHTML = html;
}
createMenuItems();

/*
 * localization zone
 */
function getLanguage() {
  var language = window.navigator.userLanguage || window.navigator.language;
  return language;
}
function setTranslateLabels(language,labelsMap) {
	switch(language) {
	  case "it":
	    if (labelsMap !== undefined) {
	      applyLabels(labelsMap.it);
	    }
	    jQuery("#about").html("Informazioni");	    
	    break;
	  default:
	//     var defaultLabels = labelsMap.default;		  
	    if (labelsMap !== undefined) {
//	    	console.log(labelsMap['default']);
	    	applyLabels(labelsMap['default']);
	    }	    
	    document.getElementById("about").innerHTML = "About";
	    jQuery("#about").html("About");
	    break;
	}
}
function applyLabels(languageLabelsMap) {
//  var languageLabelsMap = labelsSubMap;
//	console.log(languageLabelsMap);
	for (var divId in languageLabelsMap) {
//	    var divId = i;
//	    console.log(divId);
	    var htmlValue = languageLabelsMap[divId];
	    jQuery('#'+divId).html(htmlValue);
//	    console.log(htmlValue);
	}
}

/*
 * moving #core inside .content
 */
function moveDiv(divToMove,newDivContainer) {
	/*document.getElementById(newDivContainer)
	.appendChild( document.getElementById(divToMove) );
	*/
	jQuery("#"+divToMove)
    .appendTo("#"+newDivContainer);
}
moveDiv('core','content');

//jQuery("menu-item-divided pure-menu-selected").css("font","12pt");

//jQuery('#home')

