var dataset = [
    {name: 'Yahoo', live: 20, native: 25, embedded: 55},
    {name: 'ESPN', live: 83, native: 7, embedded: 10},
    {name: 'MTV', live: 91, native: 5, embedded: 4},
    {name: 'NYTimes', live: 30, native: 25, embedded: 45},
    {name: 'Huffington Post', live: 50, native: 25, embedded: 15}
];
var margin = {top: 20, right: 40, bottom: 40, left: 85};

var svg = d3.select('svg').attr('width', 350).attr('height', 400);

var width = +svg.attr('width') - margin.left - margin.right;

var height = +svg.attr('height') - margin.top - margin.bottom;

var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

var yScale = d3.scaleBand()
    .domain(dataset.map(function (d) {
        return d.name;
    }))
    .range([height, 0]);

var yAxis = d3.axisLeft(yScale);

g.append('g')
    .call(yAxis);

var xScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, width]);

var xAxis = d3.axisBottom(xScale).ticks(5, '%');

g.append('g')
    .attr('transform', 'translate(0, ' + height + ')')
    .call(xAxis);

var zScale = d3.scaleOrdinal()
    .range(["#356f75", "#409ac2", "#b4c68f"])
    .domain(Object.keys(dataset[0]).slice(1));

var stack = d3.stack()
    .offset(d3.stackOffsetExpand);

