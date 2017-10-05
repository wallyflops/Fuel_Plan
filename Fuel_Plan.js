define( ["qlik",
		"jquery", 
		"text!./style.css", 
		"text!./template.html",
		"./d3/d3",
	], 
	function (qlik, $, cssContent, template, d3 ) {'use strict';
    $("<style>").html(cssContent).appendTo("head");
	return {
       template: template,
       initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 500
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1
				},
				measures : {
					uses : "measures",
					min : 1
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label : "Initial fetch rows",
							type : "number",
							defaultValue : 500
						}
					}
				}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		paint: function ($element, layout) {
			console.log("painting...");
			console.log(layout);
			 

			var gateValues;
			var transData;
			
			// gate positions on the img
			var gatePos = [ 
				{ gate: 1, x: 1177, y: 200 },
				{ gate: 2, x: 1109, y: 200 },
				{ gate: 3, x: 1042, y: 200 },
				{ gate: 4, x: 975, y: 200 },
				{ gate: 5, x: 908, y: 200 },
				{ gate: 6, x: 842, y: 200 },
				{ gate: 7, x: 774, y: 200 },
				{ gate: 8, x: 708, y: 200 },
				{ gate: 9, x: 641, y: 200 },
				{ gate: 10, x: 578, y: 200 }
			];

			var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
			var gateValues = qMatrix.map(function(d){
				return {
					"gate":d[0].qText, 
					"value":d[1].qNum
				};
			});

			joinDatasets();

			var width = $element.width();  
			var height = $element.height();  

			console.log("width: " + $element.width() + " | height: " + $element.height());
			
            var id = "container_" + layout.qInfo.qId;  
            if (document.getElementById(id)) {  
				console.log("it exists already");

				$("#" + id).empty();  
				var svg = drawArea();
				generateVis(svg);
				
            }  
            else {  
				console.log("creating div");

				$element.append($('<div />;')
					.attr("id", id));
				//	.width(width)
				//	.height(height));  
				var svg = drawArea();
			    generateVis(svg);
			};
			
			function drawArea() {
				console.log(id);
		
				//var svg = d3.select(".mydiv")
				var svg = d3.select("#" + id)
					.append("svg")
					.attr("width", width)
					.attr("height", height);

				d3.selectAll("svg").append("svg:image")
					.attr("xlink:href", "/content/Default/background.png")
					.attr("width", width)
					.attr("height", height)
					.style("preserveAspectRatio", "true");
				
				return svg;
			};

			function joinDatasets(){
				var  joinedData = function (left, right, on, key) {
					var hash = Object.create(null),
					joinedData = left.map(function (o) {
							return hash[o[on]] = Object.assign({}, o);
						});
					right.forEach(function (o) {
						if (hash[o[on]]) {
							hash[o[on]][key] = o[key];
						}
					});
					return joinedData;
				}(gatePos, gateValues, 'gate', 'value');
				console.log("dataset joined...");
			
				transData = joinedData;
			};
				
			function generateVis(svg) {
				console.log("generating vis...");
			
				svg.selectAll("rect")
					.data(transData)
					.enter()
					.append("rect")
					.attr("width", 50)
					.attr("height", 20)
					.attr("x", function(d, key) {
						return d.x;
					})
					.attr("y", function(d, key) {
						return d.y;
					})
					.attr("fill", "black");
			
				var textLabels = svg.selectAll("text")
					.data(transData, function(d) {
						return d.gate;
					})
					.enter()
					.append("text")
					.attr("x", function(d, key) {
						return d.x + 13;
					})
					.attr("y", function(d, key) {
						return d.y + 15;
					})
					.attr("text-anchor", "left")
					.text(function(d, key) {
						return d.value;
					})
					.style("fill", "red");
			};
		},
		controller: ['$scope', function (/*$scope*/) {
		}]
	};

} );
