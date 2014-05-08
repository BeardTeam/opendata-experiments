/**
 * @author: Massimiliano Leone
 * based on http://bost.ocks.org/mike/nations/
 */

var dataFile = "multidimensional_timeline/data/italiani_popolazione_reddito_occupazione_1995-2011.json";
// dataFile = "redditi/nations.json";

// var firstYear = 1809;
var firstYear = 1994;
//var lastYear = 2008;
var lastYear = 2012;
//var duration = 30000;
var duration = 7000;

var xDimensionName = "reddito",
	yDimensionName = "occupazione",
	radiusDimensionName = "popolazione",
	colorDimensionName = "area",
	keyDimensionName = "nomeRegione";
var yearFieldName = "year";

var xAxisLabel = "reddito netto (migliaia)";
var yAxisLabel = "numero occupati (migliaia)";

// Various scales. These values make assumptions of data, naturally.
var xMin = 1700, /*1720.553809,*/
	xMax = 300000, /*196097.1345,*/
	yMin = 10, /*53.823,*/
	yMax = 5000, /*4350.907,*/
	radiusMin = 10, /*116*/
	radiusMax = 10000, /*9959.3,*/
	radiusRangeMax = 30;

var labelFooter = "(valori in migliaia)";

var divIdToAppendTooltip = "core";
var customWidth = 1000;
var customHeight = 500;

// Various accessors that specify the four dimensions of data to visualize.
function x(d) {	return d[xDimensionName]; }
function y(d) { return d[yDimensionName]; }
function radius(d) { return d[radiusDimensionName]; }
function color(d) { return d[colorDimensionName]; }
function key(d) { return d[keyDimensionName]; }

// Chart dimensions.
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
	width = customWidth - margin.right,
	height = customHeight - margin.top - margin.bottom;

// Various scales. These domains make assumptions of data, naturally.
var xScale = d3.scale.log().domain([xMin, xMax]).range([0, width]),
	yScale = d3.scale.linear().domain([yMin, yMax]).range([height, 0]),
	radiusScale = d3.scale.sqrt().domain([radiusMin, radiusMax]).range([0, radiusRangeMax]),
	colorScale = d3.scale.category10();

// The x & y axes.
var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
	yAxis = d3.svg.axis().scale(yScale).orient("left");

// Create the SVG container and set the origin.
var svg = d3.select("#chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

// Add the y-axis.
svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

// Add an x-axis label.
svg.append("text")
	.attr("class", "x label")
	.attr("text-anchor", "end")
	.attr("x", width)
	.attr("y", height - 6)
	.text(xAxisLabel);

// Add a y-axis label.
svg.append("text")
	.attr("class", "y label")
	.attr("text-anchor", "end")
	.attr("y", 6)
	.attr("dy", ".75em")
	.attr("transform", "rotate(-90)")
	.text(yAxisLabel);

// Add the year label; the value is set on transition.
var label = svg.append("text")
		.attr("class", "year label")
		.attr("text-anchor", "end")
		.attr("y", height - 24)
		.attr("x", width)
		.text(firstYear);



//add a tooltip for each dot
var tooltip = d3.select("#"+divIdToAppendTooltip)
	.append("div")
	.attr("id", "tooltip")
	.style("opacity", 0);


//var legendLabelsToClear = [];

// Load the data.
d3.json(dataFile, function(data) {

	// A bisector since many nation's data is sparsely-defined.
	var bisect = d3.bisector(function(d) { return d[0]; });

	// Add a dot per nation. Initialize the data at firstYear, and set the colors.
	var dot = svg.append("g")
			.attr("class", "dots")
			.selectAll(".dot")
			.data(interpolateData(firstYear))
			.enter().append("circle")
			.attr("class", "dot")
			.style("fill", function(d) { return colorScale(color(d)); })
			.call(position)
			.sort(order);

	// Add a title.
	dot.append("title")
		.text(function(d) {
			var titleValue = d[keyDimensionName];
//			console.log(titleValue);
			return titleValue ;
		});
	// add mouseover events
	dot.on("mouseover", function(d) {
		var html = getTooltipHtml(d);
		tooltip.transition().duration(200).style("opacity", 1);
		tooltip.html(html)
			.style("left", (d3.event.pageX + 5) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
		tooltip.append("body");
	})
	.on("mouseout", function(d) {
		tooltip.transition().duration(500).style("opacity", 0);
	})
	.on("click", function(d) {
		tooltip.html(getTooltipHtml(d));
	});
	function getTooltipHtml(d) {
		return "<b>"+d[keyDimensionName]+"</b>:<br/>"
		+ "<i>"+xDimensionName+"</i>: " + getRounded(d[xDimensionName])+"<br/>"
		+ "<i>"+yDimensionName+"</i>: " + getRounded(d[yDimensionName])+"<br/>"
		+ "<i>"+radiusDimensionName+"</i>: " + getRounded(d[radiusDimensionName])+"<br/>"
		+ "<i>"+labelFooter+"</i>";
	}
	function getRounded(num) {
		return Math.round(num * 100) / 100;
	}

	// Add an overlay for the year label.
	var box = label.node().getBBox();

	var overlay = svg.append("rect")
					.attr("class", "overlay")
					.attr("x", box.x)
					.attr("y", box.y)
					.attr("width", box.width)
					.attr("height", box.height)
					.on("mouseover", enableInteraction);

	// Start a transition that interpolates the data based on year.
	svg.transition()
			.duration(duration)
			.ease("linear")
			.tween("year", tweenYear)
			.each("end", enableInteraction);

	// Positions the dots based on data.
	function position(dot) {
		dot.attr("cx", function(d) { return xScale(x(d)); })
			.attr("cy", function(d) { return yScale(y(d)); })
			.attr("r", function(d) { return radiusScale(radius(d)); });
	}

	// Defines a sort order so that the smallest dots are drawn on top.
	function order(a, b) {
		return radius(b) - radius(a);
	}
		
	// After the transition finishes, you can mouseover to change the year.
	function enableInteraction() {
		var yearScale = d3.scale.linear()
				.domain([firstYear, lastYear])
				.range([box.x + 10, box.x + box.width - 10])
				.clamp(true);

		// Cancel the current transition, if any.
		svg.transition().duration(0);

		overlay
				.on("mouseover", mouseover)
				.on("mouseout", mouseout)
				.on("mousemove", mousemove)
				.on("touchmove", mousemove);

		function mouseover() {
			label.classed("active", true);
		}

		function mouseout() {
			label.classed("active", false);
		}

		function mousemove() {
			displayYear(yearScale.invert(d3.mouse(this)[0]));
		}
	}

	// Tweens the entire chart by first tweening the year, and then the data.
	// For the interpolated data, the dots and label are redrawn.
	function tweenYear() {
		var year = d3.interpolateNumber(firstYear, lastYear);
		return function(t) { displayYear(year(t)); };
	}

	// Updates the display to show the specified year.
	function displayYear(year) {
		dot.data(interpolateData(year), key).call(position).sort(order);
		label.text(Math.round(year));
	}

	// Interpolates the dataset for the given (fractional) year.
	function interpolateData(year) {
		return data.map(function(d) {
			var mapped = {};
			mapped[keyDimensionName] = d[keyDimensionName],
			mapped[colorDimensionName] = d[colorDimensionName],
			mapped[xDimensionName] = interpolateValues(d[xDimensionName], year),
			mapped[yDimensionName] = interpolateValues(d[yDimensionName], year),
			mapped[radiusDimensionName] = interpolateValues(d[radiusDimensionName], year) ;
//			console.log(mapped);
			return mapped;
		});
	}

	// Finds (and possibly interpolates) the value for the specified year.
	function interpolateValues(values, year) {
		var i = bisect.left(values, year, 0, values.length - 1),
				a = values[i];
		if (i > 0) {
			var b = values[i - 1],
				t = (year - a[0]) / (b[0] - a[0]);
			return a[1] * (1 - t) + b[1] * t;
		}
		return a[1];
	}
	
	var legendYetDrawed = {};
	
	//draw legend
	var legend = svg
		.selectAll(".legend")
		.data(interpolateData(firstYear))
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", function(d, i) { 
			return "translate(0," + i * 20 + ")";
		});
	
	// draw legend text
	legend.append("text")
		.attr("x", 64)
		.attr("y", 9)
		.attr("dy", ".35em")
//		.style("text-anchor", "start")
		.text(function(d) {
//			console.log(d.area);
			var legendLabel = d[colorDimensionName];
			if (!legendYetDrawed.hasOwnProperty(legendLabel )) {
				legendYetDrawed[legendLabel ] = "";
				return legendLabel;
			}
		});

	// draw legend colored rectangles
	legend.append("rect")
		.attr("x", 38)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", function(d) {
//			console.log(legendYetDrawed);
			var colorToDraw = colorScale(color(d));
			var labels = Object.keys(legendYetDrawed);
			for (var k in labels) {
				var label = labels[k];				
				var colorToCheck = legendYetDrawed[label];
//				console.log(label+" "+colorToCheck+" "+colorToDraw);
				if (colorToCheck == colorToDraw) {
//					console.log("found "+colorToCheck);
					return false;
				}
				else {
					legendYetDrawed[label] = colorToDraw;
					return colorToDraw;
				}
			}
//			console.log(legendColor);
//			return legendColor;
		});
	
	function clearUselessLegendLabel(legend) {
		d3.selectAll('.legend').each(function(d,i){
			var g = this;
			var text = g.childNodes[0];
			var content = text.textContent;
			var rect = g.childNodes[1];
			var style = rect.attributes[3];
			var value = style.nodeValue;
			
			if (value.indexOf("rgb") < 1 || content == "") {
				this.remove();
			}
			/*else {
				legendLabelsToClear.push[this];
			}*/
		});
	}
	clearUselessLegendLabel(legend);
	
	svg
	.selectAll(".legend")	
	.attr("transform", function(d, i) { 
		return "translate(0," + i * 20 + ")";
	});
});

