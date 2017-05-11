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
    {name: 'Huffington Post', live: 10, native: 85, embedded: 5},
    {name: 'BuzzFeed', live: 20, native: 55, embedded: 25}
];

var margin = {top: 20, right: 40, bottom: 40, left: 85};
var x, y, z, stack;

var postedChartDivWrapper = document.getElementsByClassName('posted-stacked-bar-chart')[0];
var engagementChartDivWrapper = document.getElementsByClassName('engagement-stacked-bar-chart')[0];

function drawChart(dataset, elWrapper, hideYaxis) {

    var svg = d3.select(elWrapper).append('svg').attr('width', 420).attr('height', 255);

    var width = +svg.attr('width') - margin.left - margin.right;

    var height = +svg.attr('height') - margin.top - margin.bottom;

    var g = svg.append('g')
        .attr('transform', 'translate(' + (!hideYaxis ? margin.left : 0) + ', ' + margin.top + ')');

// create x axis
    x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

// create x axis
    g.append('g')
        .attr('class', 'axis-grid')
        .style('stroke-width', 0)
        .attr('transform', 'translate(0, ' + height + ')')
        .call(d3.axisBottom(x)
            .ticks(5, '%')
            .tickSize(-height));

// create y axis
    y = d3.scaleBand()
        .range([height, 0])
        .padding(0.5);

// set y domain
    y.domain(dataset.map(function (d) {
        return d.name;
    }));
    if (!hideYaxis) {
        g.append('g')
            .style('stroke-width', 0)
            .call(d3.axisLeft(y)
                .tickSize(0)
                .tickPadding(15));
    }

// create z axis
    z = d3.scaleOrdinal()
        .range(['#356f75', '#409ac2', '#b4c68f']);

    stack = d3.stack()
        .offset(d3.stackOffsetExpand);

    // map stack bar colours
    var colorMapping = Object.keys(dataset[0]).slice(1);
    z.domain(colorMapping);

    // create stack series
    stack.keys(colorMapping); // returns a stack generator function which can take a data array as arg

    var stackSeries = stack(dataset);

    //draw bars
    var bars = g.selectAll('.bar')
        .data(stackSeries)
        .enter()
        .append('g')
        .attr('class', 'bar')
        .attr('fill', function (d) {
            return z(d.key);
        });

    bars.selectAll('rect')
        .data(function (d) {
            return d;
        })
        .enter()
        .append('rect');

    renderColouredRects(bars, elWrapper);
}

function updateChart(dataset, elWrapper) {
    var stackSeries = stack(dataset);

    var bars = d3.selectAll('.' + elWrapper.className + ' .bar')
        .data(stackSeries);

    renderColouredRects(bars, elWrapper);
}

function renderColouredRects(bars, elWrapper) {
    var rects = d3.select('.' + elWrapper.className).selectAll('rect').nodes();
    var selection = bars.selectAll('rect')
        .data(function (d) {
            return d;
        });

    selection
        .transition()
        .duration(400)
        .attr('y', function (d, i) {
            return y(d.data.name);
        })
        .attr('x', function (d) {
            return x(d[0]);
        })
        .attr('width', function (d) {
            return x(d[1] - d[0]);
        })
        .attr('height', y.bandwidth());

    selection
        .on('mouseover', function (d, i, elements) {
            onMouseOver(rects.indexOf(this), d);
        })
        .on('mouseleave', function (d, i, elements) {
            onMouseOut(rects.indexOf(this), d);
        });
}

function onMouseOver(index, d) {
    var selection1 = d3.select(d3.select('.' + postedChartDivWrapper.className).selectAll('rect').nodes()[index]),
        selection2 = d3.select(d3.select('.' + engagementChartDivWrapper.className).selectAll('rect').nodes()[index]);
    scaleHeight(selection1, d, 2);
    scaleHeight(selection2, d, 2);
}
function onMouseOut(index, d) {
    var selection1 = d3.select(d3.select('.' + postedChartDivWrapper.className).selectAll('rect').nodes()[index]),
        selection2 = d3.select(d3.select('.' + engagementChartDivWrapper.className).selectAll('rect').nodes()[index]);
    scaleHeight(selection1, d, 1);
    scaleHeight(selection2, d, 1);
}
function scaleHeight(selection, d, hScale) {
    var h = y.bandwidth(),
        yPos = y(d.data.name);
    selection
        .transition()
        .duration(400)
        .attr('y', yPos - (h * hScale - h) / 2)
        .attr('height', h * hScale);
}

// init
drawChart(dataset1, postedChartDivWrapper);
drawChart(dataset1, engagementChartDivWrapper, true);

document.getElementById('render1').addEventListener('click', function () {
    updateChart(dataset1, postedChartDivWrapper);
    updateChart(dataset1, engagementChartDivWrapper);

});
document.getElementById('render2').addEventListener('click', function () {
    updateChart(dataset2, postedChartDivWrapper);
    updateChart(dataset2, engagementChartDivWrapper);
});