var dataset = [
    {name: 'Yahoo', live: 20, native: 25, embedded: 55},
    {name: 'ESPN', live: 83, native: 7, embedded: 10},
    {name: 'MTV', live: 91, native: 5, embedded: 4},
    {name: 'NYTimes', live: 30, native: 25, embedded: 45},
    {name: 'Huffington Post', live: 50, native: 25, embedded: 15}
];
var colorMapping = Object.keys(dataset[0]).slice(1);

var margin = {top: 20, right: 40, bottom: 40, left: 85};

var svg = d3.select('svg').attr('width', 560).attr('height', 340);

var width = +svg.attr('width') - margin.left - margin.right;

var height = +svg.attr('height') - margin.top - margin.bottom;

var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

var xAxis = d3.axisBottom(x)
    .ticks(5, '%');

g.append('g')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);

var y = d3.scaleBand()
    .domain(dataset.map(function (d) {
        return d.name;
    }))
    .range([height, 0])
    .padding(0.5);

var yAxis = d3.axisLeft(y);

g.append('g')
    .call(yAxis);

var z = d3.scaleOrdinal()
    .range(["#356f75", "#409ac2", "#b4c68f"])
    .domain(colorMapping);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

var bars = g.selectAll(".bar")
    .data(stack.keys(colorMapping)(dataset))
    .enter().append("g")
    .attr("class", "bar")
    .attr("fill", function(d) {
        return z(d.key);
    });

bars.selectAll("rect")
    .data(function(d) {
        return d;
    })
    .enter()
    .append("rect")
    .attr("y", function(d, i) {
        return y(d.data.name);
    })
    .attr("x", function(d) {
        return x(d[0]);
    })
    .attr("width", function(d) {
        return x(d[1] - d[0]);
    })
    .attr("height", y.bandwidth());
