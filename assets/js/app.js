// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv('assets/data/data.csv')
  .then(function(scatterData){

    // Step 1: Parse data/cast as numbers
    // ==================================
    scatterData.forEach(function (data) {
      data.income = +data.income;
      data.obesity = +data.obesity;
    })

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([(d3.min(scatterData, data => data.income) - 2500), d3.max(scatterData, data => data.income)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([(d3.min(scatterData, data => data.obesity) - 2), d3.max(scatterData, data => data.obesity)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // =============================
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ================================
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append('g')
        .call(yAxis);

    // Step 5: Create circles
    // ======================
    chartGroup.selectAll('circle')
        .data(scatterData)
        .enter()
        .append('circle')
        .attr('cx', data => xLinearScale(data.income))
        .attr('cy', data => yLinearScale(data.obesity))
        .attr('r', '12.5')
        .attr('fill', 'pink')
        .attr('opacity', '0.4')
    

    // Step 6: Append state abbreviations 
    // ======================
    chartGroup.selectAll('#abbr')
        .data(scatterData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.income))
        .attr("y", d => yLinearScale(d.obesity))
        .text(d => d.abbr)
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "black");
    
    // Step 7: Creat Axis Labels
    // ======================
    chartGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obese (%)");

    chartGroup.append('text')
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .text("Median Income");
  });