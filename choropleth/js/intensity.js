/**
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (intensity.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
* 	as part of https://github.com/BeardTeam/opendata-experiments
*
*    intensity.js is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    intensity.js is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
//queue
(function(){function n(n){function t(){for(;f=a<c.length&&n>p;){var u=a++,t=c[u],r=l.call(t,1);r.push(e(u)),++p,t[0].apply(null,r)}}function e(n){return function(u,l){--p,null==d&&(null!=u?(d=u,a=s=0/0,r()):(c[n]=l,--s?f||t():r()))}}function r(){null!=d?v(d):i?v(d,c):v.apply(null,[d].concat(c))}var o,f,i,c=[],a=0,p=0,s=0,d=null,v=u;return n||(n=1/0),o={defer:function(){return d||(c.push(arguments),++s,t()),o},await:function(n){return v=n,i=!1,s||r(),o},awaitAll:function(n){return v=n,i=!0,s||r(),o}}}function u(){}"undefined"==typeof module?self.queue=n:module.exports=n,n.version="1.0.4";var l=[].slice})();

var width = document.getElementById('container').offsetWidth-30;
width = 900;
//console.log(document.getElementById('container').width);
var height = width / 2;

var topo,projection,path,svg,g,graticule;

var tooltip = d3.select("body").append("div").attr("class", "tooltip hidden");

setup(width,height);

function setup(width,height){

	projection = d3.geo.mercator().translate([0, 0]).scale(width / 2 / Math.PI);
//		 projection = d3.geo.hammer().translate([0, 0]).scale(width / 2 / Math.PI);

	path = d3.geo.path().projection(projection);

	graticule = d3.geo.graticule();

	svg = d3.select("#container").append("svg")
		.attr("width", width)
		.attr("height", height);


	var outterg = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	g = outterg.append("g").attr("id", "innerg");

	g.append("defs").append("path")
		.datum({type: "Sphere"})
		.attr("id", "sphere")
		.attr("d", path);

	g.append("use")
		.attr("class", "stroke")
		.attr("xlink:href", "#sphere");

	g.append("use")
		.attr("class", "fill")
		.attr("xlink:href", "#sphere");

	g.append("path")
	.datum(graticule)
	.attr("class", "graticule")
	.attr("d", path);

}

function addCommas(nStr){
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

var world = "choropleth/map/world-110m-cia.json";
var area = "choropleth/map/area.csv";
var turisti = "choropleth/data/turisti_stranieri_2011.csv";

queue()
	.defer(d3.json, world)
	.defer(d3.csv, turisti)
	.defer(d3.csv, area)		
	.await(ready);

function ready(error, world, population, area) {

topo = topojson.feature(world, world.objects.countries).features;

//update topo with population density
topo.forEach(function(f){
		var cpop = population.filter(function(a){
			var b = a.country == f.id;
			return b;
			});
// 					console.log(cpop);
	if(cpop.length>0){
		/*
			var carea = area.filter(function(a){ return a.code == f.properties.iso});
			if(carea.length>0){
					f.properties.density = cpop[0].population/carea[0].area;
			}
			*/
		f.properties.density = cpop[0].population;
		}
});

//sort it by density
topo.sort(function(a, b){ 
	return d3.descending(parseInt(a.properties.density), parseInt(b.properties.density));
});

var split = 	[ 280, 	6000,       12000,	24000, 		36000, 	48000,		60000,	72000,		84000,	96000,		108000,  111064		];
var colors = ["#FFFFFF","#F7FBFF","#DEEBF7","#C6DBEF","#9ECAE1","#6BAED6","#4292C6","#2171B5","#08519C","#08306C","#08203B","#05105A"];

var color = d3.scale.threshold()
				.domain(split)
				.range(colors);

		var country = d3.select("#innerg").selectAll(".country").data(topo);

	//ofsets
	var offsetL = document.getElementById('container').offsetLeft+30;
	var offsetT =document.getElementById('container').offsetTop-30;

	country.enter().insert("path")
			.attr("class", "country")
			.attr("d", path)
			.attr("id", function(d,i) { return d.id; })
			.attr("title", function(d,i) { return d.properties.name; })
			.style("fill", function(d,i) { 
					if(d.properties.density !== undefined){
							return color(d.properties.density);								 
					} else {
//										 console.log(d);
					}
			})
			.style("stroke", "#111")
			.on("mousemove", function(d,i) {
					var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
					var pop = ' | Affluenza: '+parseInt(d.properties.density)+'.';

					tooltip.classed("hidden", false)
							.attr("style", "left:"+(mouse[0]+offsetL)+"px;top:"+(mouse[1]+offsetT)+"px")
							.html(d.properties.name+pop);
			})
			.on("mouseout",		function(d,i) {
					tooltip.classed("hidden", true);
			});


	//create a custom legend
	var legend = 'Numero turisti per nazione<br>';

	colors.forEach(function(f,i){
// 						console.log(split[i]);
		var label = "";
		if(i==0){
			label = '0-'+addCommas(split[i]);
// 									var label = "No data";
		} else if(i==12){
			label = addCommas(split[i-1])+'-'+addCommas(parseInt(topo[0].properties.density));
		} else {
			label = addCommas(split[i-1])+'-'+addCommas(split[i]);
		}
		legend += '<div style="background:'+f+';"></div><label>'+label+'</label>';
	});

	d3.select("#legend").html(legend);


	//create sorted html table
	var table = d3.select("#info").append("table"),
					thead = table.append("thead"),
					tbody = table.append("tbody"),
					theadtr = thead.append("tr");

					theadtr.append("th").text("Nazione");
					theadtr.append("th").text("Numero turisti ")
					;

	topo.forEach(function(c){
		if(c.properties.density !== undefined){
			tbody.append("tr").html('<td>'
				+c.properties.name
				+'</td><td>'
				+addCommas(parseInt(c.properties.density))
				+'</td>');
		}
	});
}
