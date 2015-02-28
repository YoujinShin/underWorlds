var radiusValues = [1, 10, 100, 1000, 10000, 100000];
// var radiusValues = [100000];

function radiusGuide() {

	for(var i = 0; i < radiusValues.length; i++) {
		var r = radiusValues[i];
		// var logr = Math.sin(r);

		g.append('circle')
			.attr('r', linearScale( Math.log10(r) ) )
			.attr('cx', 0)
			.attr('cy', 0)
			.style('fill', '#fff')
			.style('opacity', 0.1)
			.attr('stroke', '#fff')
			.attr('stroke-width', function() {
				if(i==0) {
					return 1;
				}else {
					return 0.5;
				}
			})
			.style('fill-opacity', 0.06);

		g.append('text')
			.attr('class', 'scaleText')
			.attr('x', -400-4)
			// .attr('x', Math.cos(-Math.PI/2) * linearScale( Math.log10(r) ))
			.attr('y', Math.sin(Math.PI/2) * linearScale( Math.log10(r) ) )
			.text(r)
			.attr('stroke-width', 1)
			// .style("text-anchor", "middle");
			.style("text-anchor", "end");

		g.append('line')
			.attr('x1', 0 )
			.attr('y1', Math.sin(Math.PI/2) * linearScale( Math.log10(r) ) )
			.attr('x2', -400-1)
			.attr('y2', Math.sin(Math.PI/2) * linearScale( Math.log10(r) ) )
			.text(r)
			.attr('stroke', '#fff')
			.style("stroke-dasharray", ("1,4"))
			.style('opacity', 0.17)
			.attr('stroke-width', 1);
	}
}

function textGuide() {

	// g.append('text')
	// 	.attr('class', 'middleText')
	// 	.attr('x', 0)
	// 	.attr('y', -5 )
	// 	.text('Bacteria') //Bacterial Profile
	// 	.attr('stroke-width', 1)
	// 	.style("text-anchor", "middle");

	g.append('text')
		.attr('class', 'middleText')
		.attr('x', 0)
		.attr('y', 5 )
		.text('Taxonomy') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	g.append('text')
		.attr('class', 'middleTextBIG')
		.attr('x', -400)
		.attr('y', -100 )
		.text('BOSTON SEWAGE') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	g.append('text')
		.attr('class', 'middleTextBIG')
		.attr('x', -400)
		.attr('y', -80 )
		.text('BACTERIAL PROFILE') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	g.append('line') //upper line
			.attr('x1', -480+1 )
			.attr('y1', -70 )
			.attr('x2', -320-1 )
			.attr('y2', -70 )
			.attr('stroke', '#fff')
			.style('opacity', 0.65)
			.attr('stroke-width', 1);

	g.append('line') //lower line
			.attr('x1', -400 )
			.attr('y1', 0 )
			.attr('x2', -268 )
			.attr('y2', 0 )
			.attr('stroke', '#fff')
			.style('opacity', 0.3)
			.attr('stroke-width', 1);

	g.append('line') //vertical line
			.attr('x1', -400 )
			.attr('y1', 0 )
			.attr('x2', -400 )
			.attr('y2', -70 )
			.attr('stroke', '#fff')
			.style('opacity', 0.3)
			.attr('stroke-width', 1);
}

var domain_taxo, phylum_taxo, class_taxo, order_taxo, 
	family_taxo, genus_taxo;

var domain_name, phylum_name, class_name, order_name, 
	family_name, genus_name, selected, selectedBox;

var yScale = d3.scale.linear()
				.domain([0, 5])  
				.range([-height*0.18, height*0.25]);
// phylum,class,order,family,genus,value

var xpos = 360;
var xpos2 = xpos + 80;

function texonomyList() {

	domain_taxo = g.append('text')
		.attr('class', 'taxoName')
		.attr('x', xpos)
		.attr('y', yScale(0) )
		.text('DOMAIN') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	phylum_taxo = g.append('text')
		.attr('class', 'taxoName')
		.attr('x', xpos)
		.attr('y', yScale(1) )
		.text('PHYLUM') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	class_taxo = g.append('text')
		.attr('class', 'taxoName')
		.attr('x', xpos)
		.attr('y', yScale(2) )
		.text('CLASS') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	order_taxo = g.append('text')
		.attr('class', 'taxoName')
		.attr('x', xpos)
		.attr('y', yScale(3) )
		.text('ORDER') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	family_taxo = g.append('text')
		.attr('class', 'taxoName')
		.attr('x', xpos)
		.attr('y', yScale(4) )
		.text('FAMILY') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	genus_taxo = g.append('text')
		.attr('class', 'taxoName')
		.attr('x', xpos)
		.attr('y', yScale(5) )
		.text('GENUS') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "middle");

	///////////////////////////////////////////////
	domain_name = g.append('text')
		.attr('class', 'selected')
		.attr('x', xpos2)
		.attr('y', yScale(0) )
		.text('Bacteria') //Bacterial Profile
		.attr('stroke-width', 1)
		.style("text-anchor", "start");

	phylum_name = g.append('text')
		.attr('class', 'selected')
		.attr('x', xpos2)
		.attr('y', yScale(1) )
		.text('PHYLUM') //Bacterial Profile
		.attr('stroke-width', 1)
		.style('fill-opacity', 0)
		.style("text-anchor", "start");

	class_name = g.append('text')
		.attr('class', 'selected')
		.attr('x', xpos2)
		.attr('y', yScale(2) )
		.text('CLASS') //Bacterial Profile
		.attr('stroke-width', 1)
		.style('fill-opacity', 0)
		.style("text-anchor", "start");

	order_name = g.append('text')
		.attr('class', 'selected')
		.attr('x', xpos2)
		.attr('y', yScale(3) )
		.text('ORDER') //Bacterial Profile
		.attr('stroke-width', 1)
		.style('fill-opacity', 0)
		.style("text-anchor", "start");

	family_name = g.append('text')
		.attr('class', 'selected')
		.attr('x', xpos2)
		.attr('y', yScale(4) )
		.text('FAMILY') //Bacterial Profile
		.attr('stroke-width', 1)
		.style('fill-opacity', 0)
		.style("text-anchor", "start");

	genus_name = g.append('text')
		.attr('class', 'selected')
		.attr('x', xpos2)
		.attr('y', yScale(5) )
		.text('GENUS') //Bacterial Profile
		.attr('stroke-width', 1)
		.style('fill-opacity', 0)
		.style("text-anchor", "start");

	// selected = g.append('text')
	// 	.attr('class', 'selected')
	// 	.attr('x', 450)
	// 	.attr('y', yScale(0) )
	// 	.text('BACTERIA') //Bacterial Profile
	// 	.attr('stroke-width', 1)
	// 	.style("text-anchor", "middle");

	selectedBox = g.append('rect')
		.attr('x', xpos - 50)
		.attr('y', yScale(0) - 20 )
		.attr('width', 100)
		.attr('height', 30)
		.style('fill', 'rgba(0,0,0,0)')
		.attr('stroke-width', 1)
		.attr('stroke', '#fff');

}

function changeSelectedBox(depth) {
	selectedBox.transition().duration(300).attr('y', yScale(depth) - 20);
}

function changeTaxoName(p, c, o, f, g) {
	phylum_name.text(p);
	phylum_name.transition().duration(100).style('fill-opacity', 0.9);

	class_name.text(c);
	class_name.transition().duration(100).style('fill-opacity', 0.9);

	order_name.text(o);
	order_name.transition().duration(100).style('fill-opacity', 0.9);

	family_name.text(f);
	family_name.transition().duration(100).style('fill-opacity', 0.9);

	genus_name.text(g);
	genus_name.transition().duration(100).style('fill-opacity', 0.9);
}
 

