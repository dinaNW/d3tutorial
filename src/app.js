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

var publishedChartDivWrapper = document.getElementsByClassName('published-pie-chart')[0];
var engagementChartDivWrapper = document.getElementsByClassName('engagement-pie-chart')[0];

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
        .attr('transform', 'translate(0, ' + height + ')')
        .call(d3.axisBottom(x)
            .ticks(5, '%'));

// create y axis
    y = d3.scaleBand()
        .range([height, 0])
        .padding(0.5);

// set y domain
    y.domain(dataset.map(function (d) {
        return d.name;
    }));
    if (!hideYaxis)
        g.append('g').call(d3.axisLeft(y));

// create z axis
    z = d3.scaleOrdinal()
        .range(["#356f75", "#409ac2", "#b4c68f"]);

    stack = d3.stack()
        .offset(d3.stackOffsetExpand);

    // map stack bar colours
    var colorMapping = Object.keys(dataset[0]).slice(1);
    z.domain(colorMapping);

    // create stack series
    stack.keys(colorMapping); // returns a stack generator function which can take a data array as arg

    var stackSeries = stack(dataset);

    //draw bars
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
        .append("rect");

    renderColouredRects(bars);
}

function updateChart(dataset, elWrapper) {
    var stackSeries = stack(dataset);

    var bars = d3.selectAll('.' + elWrapper.className + ' .bar')
        .data(stackSeries);

    renderColouredRects(bars);
}

function renderColouredRects(bars) {

    var selection = bars.selectAll('rect')
        .data(function (d) {
            return d;
        });
    initRectDimentions(selection);
    selection
        .on('mouseover', function (d, i, elements) {
            var i = i + 1,
                j = bars.nodes().indexOf(this.parentNode) + 1;
            var s1 = d3.select('.' + publishedChartDivWrapper.className + ' .bar:nth-child(' + j + ') rect:nth-child(' + i + ')'),
                s2 = d3.select('.' + engagementChartDivWrapper.className + ' .bar:nth-child(' + j + ') rect:nth-child(' + i + ')');
            onMouseOver(d, s1, s2);
        })
        .on('mouseleave', function (d, i, elements) {
            var i = i + 1,
                j = bars.nodes().indexOf(this.parentNode) + 1;
            var s1 = d3.select('.' + publishedChartDivWrapper.className + ' .bar:nth-child(' + j + ') rect:nth-child(' + i + ')'),
                s2 = d3.select('.' + engagementChartDivWrapper.className + ' .bar:nth-child(' + j + ') rect:nth-child(' + i + ')');
            onMouseOut(s1, s2);
        });
}

function initRectDimentions(selection) {
    selection
        .transition()
        .duration(200)
        .attr("y", function (d, i) {
            return y(d.data.name);
        })
        .attr("x", function (d) {
            return x(d[0]);
        })
        .attr("width", function (d) {
            return x(d[1] - d[0]);
        })
        .attr("height", y.bandwidth());
}

function onMouseOver(d, selection1, selection2) {
    var h = y.bandwidth(),
        yPos = y(d.data.name),
        hScale = 1.4;

    selection1
        .transition()
        .duration(200)
        .attr('y', yPos - (h * hScale - h) / 2)
        .attr('height', h * hScale);

    selection2
        .transition()
        .duration(200)
        .attr('y', yPos - (h * hScale - h) / 2)
        .attr('height', h * hScale);
}
function onMouseOut(selection1, selection2) {
    initRectDimentions(selection1);
    initRectDimentions(selection2);
}

// init
drawChart(dataset1, publishedChartDivWrapper);
drawChart(dataset1, engagementChartDivWrapper, true);

document.getElementById('render1').addEventListener('click', function () {
    updateChart(dataset1, publishedChartDivWrapper);
    updateChart(dataset1, engagementChartDivWrapper);

});
document.getElementById('render2').addEventListener('click', function () {
    updateChart(dataset2, publishedChartDivWrapper);
    updateChart(dataset2, engagementChartDivWrapper);
});