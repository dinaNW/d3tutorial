var scores = [
    {name: 'Alice', score: 96, age: 20},
    {name: 'Billy', score: 83, age: 30},
    {name: 'Cindy', score: 91, age: 10},
    {name: 'David', score: 96, age: 15},
    {name: 'Emily', score: 88, age: 25}
];
var margin = {top: 20, right: 60, bottom: 30, left: 40};

var svg = d3.select('svg');

var width = +svg.attr('width') - margin.left - margin.right;

var height = +svg.attr('height') - margin.top - margin.bottom;

var g = svg.append('g').selectAll('g');

var chart = g.data(scores)
    .enter()
    .append('g')
    .attr('transform', function (d, i) {
        return 'translate(0, ' + i * 33 + ')';
    });
chart.append('rect')
    .style('width', function (d) {
        return d.score
    })
    .attr('class', 'bar');

chart.append('text')
    .attr('y', 20)
    .text(function (d) {
        return d.name;
    });
