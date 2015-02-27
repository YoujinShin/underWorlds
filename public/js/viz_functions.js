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
			// d3.select(this).style("fill-opacity", 0.9);
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

	if(depth == 5) {
		unselectDots();
		// selectDots(d.name);
		selectDots2(d.name, d.parent.name);
	} else if(depth == 4) {
		unselectDots();

		d.children.forEach(function(e) {
			// selectDots(e.name);
			selectDots2(e.name, e.parent.name);
		});
	} else if(depth == 3) {
		unselectDots();
		data = d.children;

		d.children.forEach(function(e1) {
			e1.children.forEach(function(e2) {
				// selectDots(e2.name);
				selectDots2(e2.name, e2.parent.name);
			});
		});
	} else if(depth == 2) {
		unselectDots();
		
		d.children.forEach(function(e1) {
			e1.children.forEach(function(e2) {
				e2.children.forEach(function(e3) {
					// selectDots(e3.name);
					selectDots2(e3.name, e3.parent.name);
				});
			});
		});
	} else if(depth == 1) {
		unselectDots();

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

// function selectDots(name) {

// 	svg.selectAll(".dot").each(function(e) {
// 		if(e.genus == name) {
// 			d3.select(this).transition().duration(480)
// 				.attr('r', 4);
// 				// .style('fill', '#fff');
// 		}

// 	});
// }

