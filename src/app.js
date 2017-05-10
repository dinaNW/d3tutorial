var dataset1 = [
    {name: 'Yahoo', live: 20, native: 25, embedded: 55},
    {name: 'ESPN', live: 83, native: 7, embedded: 10},
    {name: 'MTV', live: 91, native: 5, embedded: 4},
    {name: 'NYTimes', live: 30, native: 25, embedded: 45},
    {name: 'Huffington Post', live: 50, native: 25, embedded: 15},
    {name: 'BuzzFeed', live: 60, native: 15, embedded: 15}
];
var dataset2 = [
    {name: 'Yahoo', live: 83, native: 7, embedded: 10},
    {name: 'ESPN', live: 20, native: 25, embedded: 55},
    {name: 'MTV', live: 30, native: 25, embedded: 45},
    {name: 'NYTimes', live: 91, native: 5, embedded: 4},
    {name: 'Huffington Post', live: 50, native: 15, embedded: 25}
];

var margin = {top: 20, right: 40, bottom: 40, left: 85};

var svg = d3.select('svg').attr('width', 560).attr('height', 340);

var width = +svg.attr('width') - margin.left - margin.right;

var height = +svg.attr('height') - margin.top - margin.bottom;

var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// create x axis
var x = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

var xAxis = d3.axisBottom(x)
    .ticks(5, '%');

// append x axis
g.append('g')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);

// create y axis
var y = d3.scaleBand()
    .range([height, 0])
    .padding(0.5);

var yAxis = g.append('g')
    .call(d3.axisLeft(y));

// create z axis
var z = d3.scaleOrdinal()
    .range(["#356f75", "#409ac2", "#b4c68f"]);

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

var render = function (dataset) {
    var t = d3.transition().duration(1000);

    // set y domain
    y.domain(dataset.map(function (d) {
        return d.name;
    }));
    yAxis.call(d3.axisLeft(y));

    // map stack bar colours
    var colorMapping = Object.keys(dataset[0]).slice(1);
    z.domain(colorMapping);

    // create stack series
    stack.keys(colorMapping); // returns a stack generator function which can take a data array as arg
    var stackSeries = stack(dataset);

    //render bars
    var bars = g.selectAll(".bar")
        .data(stackSeries)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("fill", function (d) {
            return z(d.key);
        });
    bars.selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("y", function (d, i) {
            return y(d.data.name);
        })
        .transition(t)
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("width", function (d) {
            return x(d[1] - d[0]);
        })
        .attr("height", y.bandwidth());
};

render(dataset1); // init

document.getElementById('render1').addEventListener('click', function () {
    render(dataset1);
});
document.getElementById('render2').addEventListener('click', function () {
    render(dataset2);
});