var dataset = [
    {name: 'Yahoo', score: 96, age: 20},
    {name: 'ESPN', score: 83, age: 30},
    {name: 'MTV', score: 91, age: 10},
    {name: 'NYTimes', score: 96, age: 15},
    {name: 'Huffington Post', score: 88, age: 25}
];
var margin = {top: 20, right: 40, bottom: 40, left: 85};

var svg = d3.select('svg').attr('width', 350).attr('height', 400);

var width = +svg.attr('width') - margin.left - margin.right;

var height = +svg.attr('height') - margin.top - margin.bottom;

var g = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// g.append('rect')
//     .attr('width', width)
//     .attr('height', height)
//     .style('fill', 'lightblue')
//     .style('stroke', 'green');

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

// var chart = g.data(scores)
//     .enter()
//     .append('g')
//     .attr('transform', function (d, i) {
//         return 'translate(0, ' + i * 33 + ')';
//     });
// chart.append('rect')
//     .style('width', function (d) {
//         return d.score
//     })
//     .attr('class', 'bar');
//
// chart.append('text')
//     .attr('y', 20)
//     .text(function (d) {
//         return d.name;
//     });
