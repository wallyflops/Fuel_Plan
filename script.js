
var width = 1597;
var height = 386;

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

var gateValues;
var transData;

d3.csv("rawData.csv", function(data) {
	console.log("data loaded...");
	//console.log(data);
	gateValues = data;
	joinDatasets();
	generateVis();
});

var svg = d3.select(".mydiv")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

d3.selectAll("svg").append("svg:image")
	.attr("xlink:href", "background.png")
	.attr("width", width)
	.attr("height", height);

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
	console.log(joinedData);

	transData = joinedData;
};

function generateVis() {
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