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
* This file (core.js) is part of rickshaw, and developed by: Massimiliano Leone - <maximilianus@gmail.com> - https://plus.google.com/+MassimilianoLeone.
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
var seriesDataCircolantiEImmatricolate = [

{ color: "green",
	name: "Immatricolate",
	data: [ 
//	        { x: 1999, y: 25977 },{ x: 2000, y: 25956 },{ x: 2001, y: 27117 },{ x: 2002, y: 26850 },{ x: 2003, y: 25184 },{ x: 2004, y: 27906 },{ x: 2005, y: 24869 },{ x: 2006, y: 22914 },{ x: 2007, y: 24649 },{ x: 2008, y: 20873 },{ x: 2009, y: 20213 },{ x: 2010, y: 17682 },{ x: 2011, y: 13634 }
		{ x: 0, y: 25977 },{ x: 1, y: 25956 },{ x: 2, y: 27117 },{ x: 3, y: 26850 },{ x: 4, y: 25184 },{ x: 5, y: 27906 },{ x: 6, y: 24869 },{ x: 7, y: 22914 },{ x: 8, y: 24649 },{ x: 9, y: 20873 },{ x: 10, y: 20213 },{ x: 11, y: 17682 },{ x: 12, y: 13634 }
    ] }
,{ color: "red",
	name: "Circolanti",
	data: [ 
//	        { x: 1999, y: 387055 },{ x: 2000, y: 390844 },{ x: 2001, y: 393177 },{ x: 2002, y: 397059 },{ x: 2003, y: 403262 },{ x: 2004, y: 381970 },{ x: 2005, y: 387613 },{ x: 2006, y: 393245 },{ x: 2007, y: 395196 },{ x: 2008, y: 395143 },{ x: 2009, y: 392841 },{ x: 2010, y: 391889 },{ x: 2011, y: 390988 }
		{ x: 0, y: 387055 },{ x: 1, y: 390844 },{ x: 2, y: 393177 },{ x: 3, y: 397059 },{ x: 4, y: 403262 },{ x: 5, y: 381970 },{ x: 6, y: 387613 },{ x: 7, y: 393245 },{ x: 8, y: 395196 },{ x: 9, y: 395143 },{ x: 10, y: 392841 },{ x: 11, y: 391889 },{ x: 12, y: 390988 }
    ] }
];

var palette = new Rickshaw.Color.Palette( { scheme: 'classic9' } );

// instantiate our graph!

var graph = new Rickshaw.Graph( {
	element: document.getElementById("chart"),
	width: 700,
	height: 400,
	renderer: 'area',
	stroke: true,
	preserve: true,
	series: seriesDataCircolantiEImmatricolate
} );

graph.render();

var preview = new Rickshaw.Graph.RangeSlider( {
	graph: graph,
	element: document.getElementById('preview'),
} );

var hoverDetail = new Rickshaw.Graph.HoverDetail( {
	graph: graph,
	xFormatter: function(x) {
//		return new Date(x,"01","01").toString();
		var date = new Date(x,"11","31" );
 		return date.toString();
	}
} );

var annotator = new Rickshaw.Graph.Annotate( {
	graph: graph,
	element: document.getElementById('timeline')
} );

var legend = new Rickshaw.Graph.Legend( {
	graph: graph,
	element: document.getElementById('legend')

} );

var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
	graph: graph,
	legend: legend
} );

var order = new Rickshaw.Graph.Behavior.Series.Order( {
	graph: graph,
	legend: legend
} );

var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
	graph: graph,
	legend: legend
} );

var smoother = new Rickshaw.Graph.Smoother( {
	graph: graph,
	element: document.querySelector('#smoother')
} );

var format = function(n) {
	var map = {
		0: '1999', 1: '2000', 2: '2001', 3: '2002', 4: '2003', 5: '2004', 6: '2005', 7: '2006', 8: '2007', 9: '2008', 10: '2009', 11: '2010', 12: '2011'		
	};
	return map[n];
};


var ticksTreatment = 'glow';
/*
var xAxisTime = new Rickshaw.Graph.Axis.Time({
	graph: graph,
//	orientation: 'bottom',
	ticksTreatment: ticksTreatment,
	timeFixture: new Rickshaw.Fixtures.Time.Local()
//	,timeUnit: new Rickshaw.Fixtures.Time().unit("day")
	,tickFormat: format
});
*/

//console.log(Rickshaw.Graph.Axis.X);

var xAxis = new Rickshaw.Graph.Axis.X({
	graph: graph,
	orientation: 'bottom',
	element: document.getElementById('timeline'),
	pixelsPerTick: 70,
	tickFormat: format
});

//console.log(xAxis);

xAxis.render();



var yAxis = new Rickshaw.Graph.Axis.Y( {
	graph: graph,
	tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
	ticksTreatment: ticksTreatment
} );

yAxis.render();


var controls = new RenderControls({
	element: document.querySelector('form'),
	graph: graph
});

//console.log(controls);

// add some data every so often

var messages = [
	"Changed home page welcome message",
	"Minified JS and CSS",
	"Changed button color from blue to green",
	"Refactored SQL query to use indexed columns",
	"Added additional logging for debugging",
	"Fixed typo",
	"Rewrite conditional logic for clarity",
	"Added documentation for new methods"
];

/*setInterval( function() {
	random.removeData(seriesDataCircolantiEImmatricolate);
	random.addData(seriesDataCircolantiEImmatricolate);
	graph.updsate();
}, 3000 );*/

/*
function addAnnotation(force) {
	if (messages.length > 0 && (force || Math.random() >= 0.95)) {
//		annotator.add(seriesData[2][seriesData[2].length-1].x, messages.shift());
//		console.log(seriesDataCircolantiEImmatricolate);
		annotator.add(
				seriesDataCircolantiEImmatricolate[1][seriesDataCircolantiEImmatricolate[1].length-1].x, 
				messages.shift());
		annotator.update();
	}
}
addAnnotation(true);
setTimeout( function() { setInterval( addAnnotation, 6000 ); }, 6000 );
*/

/*var previewXAxis = new Rickshaw.Graph.Axis.Time({
	graph: preview.previews[0],
	timeFixture: new Rickshaw.Fixtures.Time.Local(),
	ticksTreatment: ticksTreatment
});
previewXAxis.render();
*/
