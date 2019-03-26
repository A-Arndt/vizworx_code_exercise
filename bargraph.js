"use strict";
d3.csv("city_of_calgary_census_2016.csv").then(function (data) {
    let margin = 60;
    let width = 1000 - (2 * margin);
    let height = 600 - (2 * margin);
    let formatComma = d3.format(",");
    let svg = d3.select('svg');

    svg.append('text')
        .attr('x', width / 2 + margin)
        .attr('y', height + 2 * margin)
        .attr('text-anchor', 'middle')
        .text('Communities');
    
    svg.append('text')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 5)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Population');
    
    /*Filter the larger dataset to get the needed data. Sort that data alphabetically.*/
    let filteredData = data.filter(neededCommunity);
    filteredData.sort(function(a, b){
        let x = a.NAME.toLowerCase();
        let y = b.NAME.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
    
    /*Find the largest populattion, add one fourth of that population to find a good scale.*/
    let largestPop = filteredData.reduce( function (accumulator, currentValue) { 
        return Math.max(accumulator, Number(currentValue.RES_CNT));
    }, 0);
    largestPop = largestPop + largestPop/4;
    
    let barGraph = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);
    
    /*Set the y axis and scale to that of the population.*/
    let yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, largestPop]);
    
    barGraph.append('g')
        .call(d3.axisLeft(yScale).ticks(10, "s"));
    
    /*Set the x axis and scale to that of the communities.*/
    let xScale = d3.scaleBand()
        .range([0, width])
        .domain(filteredData.map((s) => s.NAME))
        .padding(0.2);
    
    barGraph.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));
    
    let bars = barGraph.selectAll()
        .data(filteredData)
        .enter()
        .append('g');
    
    /*Create the bars for the graph.*/
    bars.append('rect')
        .attr('class', 'bar')
        .attr('x', (s) => xScale(s.NAME))
        .attr('y', (s) => yScale(s.RES_CNT))
        .attr('height', (s) => height - yScale(s.RES_CNT))
        .attr('width', xScale.bandwidth());
    
    /*Attach the each communities population to their bar.*/
    bars.append('text')
        .attr('x', (s) => xScale(s.NAME) + xScale.bandwidth() / 2)
        .attr('y', (s) => yScale(s.RES_CNT) + 30)
        .attr('text-anchor', 'middle')
        .style("fill", '#FFFFFF')
        .text((s) => formatComma(s.RES_CNT));
});


/*Take a single data object and see if it is within the needed community. If yes return true.*/
function neededCommunity(obj) {
    let communities = ['edgemont', 'acadia', 'banff trail', 'crescent heights', 'panorama hills'];
    return communities.includes(obj.NAME.toLowerCase());
}