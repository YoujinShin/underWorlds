function selectParents(d, path) {

	var depth = d.depth;
	var taxo;

	if(depth == 1) {

		taxo =  d.parent.name+ ' - '+ d.name;
		selectArc(path, d.name, "", "", "", "", depth);
		// changeTaxoName(d.name, "", "", "", "");
	} else if(depth == 2) {

		taxo = d.parent.parent.name+ ' - '+ d.parent.name+ ' - '+d.name;
		selectArc(path, d.name, d.parent.name, "", "", "", depth);
		// changeTaxoName(d.name, d.parent.name, "", "", "");
	} else if(depth == 3) {

		taxo = d.parent.parent.parent.name + ' - '+ d.parent.parent.name
				+ ' - '+d.parent.name+ ' - '+ d.name ;		
		selectArc(path, d.name, d.parent.name, d.parent.parent.name, "", "", depth);	
		// changeTaxoName(d.name, d.parent.name, d.parent.parent.name, "", "");
	} else if(depth == 4) {

		taxo = d.parent.parent.parent.parent.name + ' - '+ d.parent.parent.parent.name
				+ ' - '+ d.parent.parent.name + ' - '+ d.parent.name+' - '+ d.name;
		selectArc(path, d.name, d.parent.name, d.parent.parent.name, d.parent.parent.parent.name, "", depth);
		// changeTaxoName(d.name, d.parent.name, d.parent.parent.name, d.parent.parent.parent.name, "");	
	} else if(depth == 5) {

		taxo = d.parent.parent.parent.parent.parent.name + ' - '+ d.parent.parent.parent.parent.name
				+ ' - '+ d.parent.parent.parent.name+ ' - '+d.parent.parent.name+ ' - '+ d.parent.name
				+ ' - '+d.name;
		selectArc(path, d.name, d.parent.name, d.parent.parent.name, d.parent.parent.parent.name, d.parent.parent.parent.parent.name, depth);
		// changeTaxoName(d.name, d.parent.name, d.parent.parent.name, d.parent.parent.parent.name, d.parent.parent.parent.parent.name);	
	}

	$( "#taxo" ).html( taxo );
}

function selectParents2(d, path) {

	var taxo = 'Bacteria' + ' - '+ d.phylum
				+ ' - '+ d.class+ ' - '+d.order+ ' - '+ d.family
				+ ' - '+d.genus;

	$( "#taxo" ).html( taxo );
}

var opacScale = d3.scale.linear()
					.domain([5, 1])  
					.range([0.5, 0.99]);


function selectArc(path, name0, name1, name2, name3, name4, depth) {
	

	if(depth == 1) { changeTaxoName(name0, "", "", "", ""); }
	if(depth == 2) { changeTaxoName(name1, name0, "", "", ""); }
	if(depth == 3) { changeTaxoName(name2, name1, name0, "", ""); }
	if(depth == 4) { changeTaxoName(name3, name2, name1, name0, ""); }
	if(depth == 5) { changeTaxoName(name4, name3, name2, name1, name0); }

	changeSelectedBox(depth);

	svg.selectAll("path").each(function(e) {
		var e_depth = e.depth;
		    
		if(e.name==name0 && e.depth==depth) {
			d3.select(this).style("fill-opacity", opacScale(e_depth));
			// d3.select(this).style("fill-opacity", 0.9);
		} else if(e.name==name1 && e.depth==(depth-1)) {
			d3.select(this).style("fill-opacity", opacScale(e_depth));
			// d3.select(this).style("fill-opacity", 0.9);
		} else if(e.name==name2 && e.depth==(depth-2)) {
			d3.select(this).style("fill-opacity", opacScale(e_depth));
			// d3.select(this).style("fill-opacity", 0.9);
		} else if(e.name==name3 && e.depth==(depth-3)) {
			d3.select(this).style("fill-opacity", opacScale(e_depth));
			// d3.select(this).style("fill-opacity", 0.9);
		} else if(e.name==name4 && e.depth==(depth-4)) {
			d3.select(this).style("fill-opacity", opacScale(e_depth));
			// d3.select(this).style("fill-opacity", 0.9);
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

