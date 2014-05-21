
       data = [{
                percent: Math.round((Math.random() * (100 - 1) + 1)*100)/100 , 
                start_point: 0,
       }];

        var w = 110, //width
            h = w, //height
            r = (Math.min(w, h) / 2), //radius
            color = d3.scale.category20c(); //builtin range of colors

            //Scale of data
            var scale_precentage = d3.scale.linear().range([0, (2 * Math.PI)]).domain([0, 100])


            var id_svg = d3.select("body");
            var svg = id_svg.append("svg")//create the SVG element inside the <body>
                           .data([data]) //associate our data with the document
                           .attr("width", w)//set the width and height of our visualization (these will be attributes of the <svg> tag
                           .attr("height", h);

            var svg_group = svg.append("g")//make a group to hold our pie chart
                              //move the center of the pie chart from 0, 0 to radius, radius
                              .attr("transform", "translate(" + w / 2 + "," + (h) / 2 + ")");    

            var circleBack = svg_group.append("circle")
                                .attr("cx", 0)
                                .attr("cy", 0)
                                .attr("r", w/2)
                                .style("fill", "#d4d4d4");

            var arc = d3.svg.arc()//this will create <path> elements for us using arc data
                .outerRadius(r)
                .innerRadius(function(){
                    return w/2.35;
                })
                .startAngle(function(d, i){
                    return scale_precentage(d.data.start_point);//Calculate the scale for the precentage Init
                })
                .endAngle(function(d, i){
                    return scale_precentage(d.data.percent);//Calculate the scale for the precentage End
                });

            var pie = d3.layout.pie()//this will create arc data for us given a list of values
                .value(function(d) { 
                    console.log("--> ",d);
                    return d.percent; 
                })    //we must tell it out to access the value of each element in our data array
               
            var arcs = svg_group.selectAll("path")//this selects all <g> elements with class slice (there aren't any yet)
                .data(pie) 
                .enter() 
               //     .append("g")//create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                //        .attr("class", "donuts_analytics");    //allow us to style things in the slices (like text)

                arcs.append("path")
                    .transition()
                    .duration(500)
                    .attr("fill", function(d, i) { 
                        return color(i); 
                    }) //set the color for each slice to be chosen from the color function defined above
                    .attr("d", arc)
                    .style("stroke-width", 1)//this creates the actual SVG path using the associated data (pie) with the arc drawing function
                    .attr("d", arc)
        			.each(function(d) { this._current = d; }); // store the initial angles

            var circleFront = svg_group.append("circle")
                                .attr("cx", 0)
                                .attr("cy", 0)
                                .attr("r", 48)
                                .style("fill", "#fff");

            //Add the SVG Text Element to the svgContainer
            var text = svg.selectAll("text")
                                    .data(data)
                                    .enter()
                                    .append("text");
            
            //Add SVG Text Element Attributes
            var textLabels = text
                            // .attr("class", "chart-pie-percent")
                             .attr("x", function(d) { return circleBack.attr("r"); })
                             .attr("y", function(d) { return ((w/3)*2) - 7; })
                             .text( function (d) { return d.percent; })
                             .attr("font-size", "33px")
                             .attr("fill", "red")
                             .attr("text-anchor", "middle");

        d3.select("#actualizar").on("click", change);

        function change(){
            data = [{
                percent: Math.round((Math.random() * (100 - 1) + 1)*100)/100 , 
                start_point: 0,
            }];

			path = svg_group.selectAll("path").data(pie(data));
			path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs

			text = svg.selectAll("text");
			text.transition()
    			.duration(750)
        		.tween("text", function(d) {
        			var new_value = data[0].percent;
            		var i = d3.interpolate(this.textContent, new_value),
                		prec = (new_value + "").split("."),
                		round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

            		return function(t) {
                		this.textContent = Math.round(i(t) * round) / round;
            		};
        		});
			/*path.enter().append("path")
			  .attr("fill", function(d, i) { return color(d.data.percent); })
			  .attr("d", arc)
			  .each(function(d) { this._current = d; });*/
		}


		// Store the displayed angles in _current.
		// Then, interpolate from _current to the new angles.
		// During the transition, _current is updated in-place by d3.interpolate.
		function arcTween(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) {
		    return arc(i(t));
		  };
		}
