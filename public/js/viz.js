var margin = { top: 20, right: 30, bottom: 40, left: 30 };

var width = parseInt(d3.select('#viz').style('width'), 10)-32;
var	height = 620;

	if(width > 900) { width = 900; } 
	else if(width < 620) { height = width;  }
	
	width = width - margin.left - margin.right;


	height = height - margin.top - margin.bottom;

var svg = d3.select('#viz').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

var tooltip = d3.select("body")
		.append("div")
		.attr("id", "tooltip");

svg.append('rect')
				.attr('x', -margin.left)
				.attr('y', -margin.top)
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.style('fill', '#15202D');

var tx = width/2 + margin.left;
var ty = height/2 + margin.top;

var g = svg.append('g')
			.attr('transform', 'translate('+ tx +','+ ty +')');

var innerRadius = 140;
var outerRadius = height/2 - 10;

var linearScale = d3.scale.linear()
					.domain([0, 4.524]) // [0, max log value] -> radius
					.range([innerRadius, outerRadius]);

var angleScale = d3.scale.linear()
					.domain([0, 1130]) // [0, size of data] -> axis
					.range([0, 2 * Math.PI]); // 0 - 360 degree

queue()
	.defer(d3.csv, 'metagenomic_genus.csv')
	.await(draw);

function draw(error, data) {
	radiusGuide();
	textGuide();

	var lines = g.selectAll('.line')
					.data(data)
				.enter().append('line')
					.attr('x1', function(d, i) { return getX1(d.value, i); })
					.attr('y1', function(d, i) { return getY1(d.value, i); })
					.attr('x2', function(d, i) { return getX(d.value, i); })
					.attr('y2', function(d, i) { return getY(d.value, i); })
					.style('opacity', 0.18)
					.attr('stroke-width', 0.5)
					.attr('stroke', '#92A7B4');


	var dots = g.selectAll('.dot')
					.data(data)
				.enter().append('circle')
					.attr('class', 'dot')
					.attr('r', 1.6)
					.attr('cx', function(d, i) { return getX(d.value, i); })
					.attr('cy', function(d, i) { return getY(d.value, i); })
					// .style('fill', '#DA6164')// pink
					.style('fill', '#92A7B4')
					.on("mouseover", function(d) {
						d3.select(this).attr("stroke-width", 2);
						d3.select(this).attr("stroke", "#fff");

						tooltip.text(d.genus +", " + d.value);
						tooltip.style("visibility", "visible");
					})
					.on("mousemove", function(){
						tooltip.style("top", (event.pageY-35)+"px").style("left",(event.pageX+10)+"px");
					})
					.on("mouseout", function(d) {
						d3.select(this).attr("stroke-width", 0);
						tooltip.style("visibility", "hidden");
					});

	
}

function getX(d, i) {
	var r = linearScale( Math.log10(d) );
	var th = angleScale(i);

	return r * Math.cos(th);
} 

function getY(d, i) {
	var r = linearScale( Math.log10(d) );
	var th = angleScale(i);

	return r * Math.sin(th);
}

function getX1(d, i) {
	var r = innerRadius;
	var th = angleScale(i);

	return r * Math.cos(th);
} 

function getY1(d, i) {
	var r = innerRadius;
	var th = angleScale(i);

	return r * Math.sin(th);
}

var radiusValues = [1, 10, 100, 1000, 10000, 100000];
// var radiusValues = [100000];

function radiusGuide() {

	for(var i = 0; i < radiusValues.length; i++) {
		var r = radiusValues[i];
		// var logr = Math.sin(r);
		// console.log(logr);

		g.append('circle')
			.attr('r', linearScale( Math.log10(r) ) )
			.attr('cx', 0)
			.attr('cy', 0)
			.style('fill', '#fff')
			.style('fill-opacity', 0.06);

		g.append('text')
			.attr('class', 'scaleText')
			.attr('x', 336 )
			// .attr('x', Math.cos(-Math.PI/2) * linearScale( Math.log10(r) ))
			.attr('y', Math.sin(Math.PI/2) * linearScale( Math.log10(r) ) )
			.text(r)
			.attr('stroke-width', 1)
			.style("text-anchor", "start");

		g.append('line')
			.attr('x1', 5 )
			.attr('y1', Math.sin(Math.PI/2) * linearScale( Math.log10(r) ) )
			.attr('x2', 335 )
			.attr('y2', Math.sin(Math.PI/2) * linearScale( Math.log10(r) ) )
			.text(r)
			.attr('stroke', '#fff')
			.style('opacity', 0.2)
			.attr('stroke-width', 1);

	}
}

function textGuide() {

	g.append('text')
		.attr('class', 'middleText')
		.attr('x', 0)
		.attr('y', 0 )
		.text('1130 genus')
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");
}
