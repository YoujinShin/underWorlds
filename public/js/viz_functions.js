function selectParents(d, path) {

	var depth = d.depth;
	var taxo;

	if(depth == 1) {

		taxo =  d.parent.name+ ' - '+ d.name;
		selectArc(path, d.name, "", "", "", "", depth);
	} else if(depth == 2) {

		taxo = d.parent.parent.name+ ' - '+ d.parent.name+ ' - '+d.name;
		selectArc(path, d.name, d.parent.name, "", "", "", depth);
	} else if(depth == 3) {

		taxo = d.parent.parent.parent.name + ' - '+ d.parent.parent.name
				+ ' - '+d.parent.name+ ' - '+ d.name ;		
		selectArc(path, d.name, d.parent.name, d.parent.parent.name, "", "", depth);	
	} else if(depth == 4) {

		taxo = d.parent.parent.parent.parent.name + ' - '+ d.parent.parent.parent.name
				+ ' - '+ d.parent.parent.name + ' - '+ d.parent.name+' - '+ d.name;
		selectArc(path, d.name, d.parent.name, d.parent.parent.name, d.parent.parent.parent.name, "", depth);	
	} else if(depth == 5) {

		taxo = d.parent.parent.parent.parent.parent.name + ' - '+ d.parent.parent.parent.parent.name
				+ ' - '+ d.parent.parent.parent.name+ ' - '+d.parent.parent.name+ ' - '+ d.parent.name
				+ ' - '+d.name;
		selectArc(path, d.name, d.parent.name, d.parent.parent.name, d.parent.parent.parent.name, d.parent.parent.parent.parent.name, depth);	
	}

	$( "#taxo" ).html( taxo );
}

function selectParents2(d, path) {

	var taxo = 'Bacteria' + ' - '+ d.phylum
				+ ' - '+ d.class+ ' - '+d.order+ ' - '+ d.family
				+ ' - '+d.genus;

	$( "#taxo" ).html( taxo );
}

function selectArc(path, name0, name1, name2, name3, name4, depth) {
	svg.selectAll("path").each(function(e) {
		    
		if(e.name==name0 && e.depth==depth) {
			d3.select(this).style("fill-opacity", 0.9);
		} else if(e.name==name1 && e.depth==(depth-1)) {
			d3.select(this).style("fill-opacity", 0.9);
		} else if(e.name==name2 && e.depth==(depth-2)) {
			d3.select(this).style("fill-opacity", 0.9);
		} else if(e.name==name3 && e.depth==(depth-3)) {
			d3.select(this).style("fill-opacity", 0.9);
		} else if(e.name==name4 && e.depth==(depth-4)) {
			d3.select(this).style("fill-opacity", 0.9);
		} else {
			d3.select(this).style("fill-opacity", 0.2);
		}
	});
}

function selectChildren(d) {

	var depth = d.depth;
	unselectDots();
	unselectLine();

	if(depth == 5) {
		
		// selectDots(d.name);
		selectLine(d.name, d.parent.name);
		selectDots2(d.name, d.parent.name);
	} else if(depth == 4) {

		d.children.forEach(function(e) {
			// selectDots(e.name);
			selectDots2(e.name, e.parent.name);
		});
	} else if(depth == 3) {

		d.children.forEach(function(e1) {
			e1.children.forEach(function(e2) {
				// selectDots(e2.name);
				selectDots2(e2.name, e2.parent.name);
			});
		});
	} else if(depth == 2) {
		
		d.children.forEach(function(e1) {
			e1.children.forEach(function(e2) {
				e2.children.forEach(function(e3) {
					// selectDots(e3.name);
					selectDots2(e3.name, e3.parent.name);
				});
			});
		});
	} else if(depth == 1) {

		d.children.forEach(function(e1) {
			e1.children.forEach(function(e2) {
				e2.children.forEach(function(e3) {
					e3.children.forEach(function(e4) {
						// selectDots(e4.name);
						selectDots2(e4.name, e4.parent.name);
					});
				});
			});
		});
	}

}

function selectDots(name) {
	svg.selectAll(".dot").each(function(e) {
		if(e.genus == name) {
			d3.select(this).transition().duration(480)
				.attr('r', 4);
		}
	});
}

function selectDots2(genus, family) {
	dots.each(function(e) {
		if((e.genus == genus) && (e.family == family)) {
			d3.select(this).transition().duration(480).attr('r', 5);
		}
	});
}

function unselectArc(path) {
	svg.selectAll("path").each(function(e) {
		d3.select(this).style("fill-opacity", 0.2);
	});
}

function unselectDots() {
	dots.each(function(e) {
		d3.select(this).transition().duration(230).attr('r', 1.7);
	});
}

function selectLine(genus, family) {

	lines.each(function(e) {
		if((e.genus == genus) && (e.family == family)) {
			// d3.select(this).attr('r', 5);
			d3.select(this).attr("stroke-width", 2);
			d3.select(this).style('opacity', 0.9);
		}
	});
}

function unselectLine() {
	lines.each(function(e) {
		d3.select(this).attr("stroke-width", 1);
		d3.select(this).style('opacity', 0.3);
	});
}

////////

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


