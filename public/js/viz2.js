var margin = { top: 20, right: 30, bottom: 40, left: 30 };

var width = 900,
	width = width - margin.left - margin.right,
	height = 640,
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

var innerRadius = 200;
var outerRadius = height/2 - 5;

var linearScale = d3.scale.linear()
					.domain([0, 4.524]) // [0, max log value] -> radius
					.range([innerRadius, outerRadius]);

var angleScale = d3.scale.linear()
					.domain([0, 510]) // [0, size of data] -> axis
					// .range([0, 2 * Math.PI]); // 0 - 360 degree
					.range([-0.5 * Math.PI, 1.5 * Math.PI]);

queue()
	// .defer(d3.csv, 'metagenomic_genus.csv')
	.defer(d3.csv, 'taxonomy_final_color.csv')
	// .defer(d3.json, 'flare.json')
	.defer(d3.json, 'bacteria.json')
	// .defer(d3.csv, 'metagenomic_phylum.csv')
	.await(draw);

var radius = Math.min(width, height) / 2,
	radius = innerRadius - 35,
    color = d3.scale.category20c();

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

var lines;
var dots;
var path;

function draw(error, genus, root) {
	radiusGuide();
	textGuide();

	// console.log(genus);

	lines = g.selectAll('.line')
					.data(genus)
				.enter().append('line')
					.attr('x1', function(d, i) { return getX1(d.value, i); })
					.attr('y1', function(d, i) { return getY1(d.value, i); })
					.attr('x2', function(d, i) { return getX(d.value, i); })
					.attr('y2', function(d, i) { return getY(d.value, i); })
					.style('opacity', 0.3) // 0.18
					.attr('stroke-width', 1)
					.attr('stroke', '#92A7B4')
					.on("mouseover", function(d) {
						d3.select(this).attr("stroke-width", 2);
						d3.select(this).style('opacity', 0.9);
						// d3.select(this).attr("stroke", "#fff");

						selectParents2(d, path);

						// selectDots(d.genus);
						selectDots2(d.genus, d.family);
						selectArc(path, d.genus, d.family, d.order, d.class, d.phylum, 5);

						tooltip.text(d.genus +", " + d.value);
						tooltip.style("visibility", "visible");
					})
					.on("mousemove", function(){
						tooltip.style("top", (event.pageY-35)+"px").style("left",(event.pageX+10)+"px");
					})
					.on("mouseout", function(d) {
						unselectDots();
						unselectArc(path);

						d3.select(this).attr("stroke-width", 1);
						tooltip.style("visibility", "hidden");
						d3.select(this).style('opacity', 0.3);
						// d3.select(this).attr("stroke", "#92A7B4");
					});


	dots = g.selectAll('.dot')
					.data(genus)
				.enter().append('circle')
					.style('opacity', 0.7)
					.attr('r', 1.7) //1.6
					.attr('cx', function(d, i) { return getX(d.value, i); })
					.attr('cy', function(d, i) { return getY(d.value, i); })
					// .style('fill', '#DA6164')// pink
					.style('fill', '#92A7B4')
					.on("mouseover", function(d) {
						// d3.select(this).attr("stroke-width", 2);
						// d3.select(this).attr("stroke", "#fff");
						d3.select(this).style('opacity', 0.9);

						selectParents2(d, path);

						d3.select(this).transition().duration(480).attr('r', 5);
						selectArc(path, d.genus, d.family, d.order, d.class, d.phylum, 5);

						tooltip.text(d.genus +", " + d.value);
						tooltip.style("visibility", "visible");
					})
					.on("mousemove", function(){
						tooltip.style("top", (event.pageY-35)+"px").style("left",(event.pageX+10)+"px");
					})
					.on("mouseout", function(d) {

						d3.select(this).transition().duration(230).attr('r', 1.7);
						unselectArc(path);

						d3.select(this).style('opacity', 0.7);
						// d3.select(this).attr("stroke-width", 0);
						tooltip.style("visibility", "hidden");
					});


	path = g.datum(root).selectAll("path") // ARC
      .data(partition.nodes)
    .enter().append("path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      // .style("stroke", '#15202D')
      .style("stroke", '#92A7B4')
      .attr("stroke-width", 0.4)
      // .style('opacity', 0.7)
      // .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .style("fill",'#92A7B4')
      .style("fill-opacity", 0.2)
      .style("fill-rule", "evenodd")
      .each(stash)
      .on("mouseover", function(d) {
			d3.select(this).style("fill-opacity", 0.9);

			tooltip.text(d.name);
			// console.log(d.parent.name);
			selectParents(d, path);
			selectChildren(d, dots);
			tooltip.style("visibility", "visible");
		})
		.on("mousemove", function(){
			tooltip.style("top", (event.pageY-35)+"px").style("left",(event.pageX+10)+"px");
		})
		.on("mouseout", function(d) {
			unselectArc(path);
			unselectDots();
			d3.select(this).attr("stroke-width", 0.4);
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
			.attr('x', 230)
			// .attr('x', Math.cos(-Math.PI/2) * linearScale( Math.log10(r) ))
			.attr('y', Math.sin(Math.PI/2) * linearScale( Math.log10(r) ) )
			.text(r)
			.attr('stroke-width', 1)
			// .style("text-anchor", "middle");
			.style("text-anchor", "start");

		g.append('line')
			.attr('x1', 5 )
			.attr('y1', Math.sin(Math.PI/2) * linearScale( Math.log10(r) ) )
			.attr('x2', 230)
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
		.text('Bacterial Profile')
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");
}

////////

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}

d3.select(self.frameElement).style("height", height + "px");

