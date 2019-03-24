d3.csv("city_of_calgary_census_2016.csv").then(function (data) {
    let margin = 60;
    let width = 1000 - (2 * margin);
    let height = 600 - (2 * margin);
    let svg = d3.select('svg')
        .style("height", (height + (2 * margin))+ 'px')
        .style("width", (width + (2 * margin)) + 'px')
        .style("margin", margin + "px");
    
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
    
    let initialValue = 0;

    let filteredData = data.filter(neededCommunity);
    filteredData.sort(function(a, b){
        let x = a.NAME.toLowerCase();
        let y = b.NAME.toLowerCase();
        if (x < y) {return -1;}
        if (x > y) {return 1;}
        return 0;
    });
    
    let totalPop = filteredData.reduce( function (accumulator, currentValue) { 
        return accumulator + Number(currentValue.RES_CNT);
    }, initialValue);
    
    totalPop = totalPop / 2 ;
    
    let barGraph = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`);
    
    let yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, totalPop]);
    
    barGraph.append('g')
        .call(d3.axisLeft(yScale));
    
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
    bars
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (s) => xScale(s.NAME))
        .attr('y', (s) => yScale(s.RES_CNT))
        .attr('height', (s) => height - yScale(s.RES_CNT))
        .attr('width', xScale.bandwidth())
        .on('mouseenter', function (s, i) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 0.5)
        })
        .on('mouseleave', function () { 
            d3.select(this)
                .transition()
                .duration(200)
                .attr('opacity', 1)
        });
    
        bars.append('text')
        .attr('x', (s) => xScale(s.NAME) + xScale.bandwidth() / 2)
        .attr('y', (s) => yScale(s.RES_CNT) + 30)
        .attr('text-anchor', 'middle')
        .style("fill", '#FFFFFF')
        .text((s) => s.RES_CNT);
});



function neededCommunity(obj) {
    let communities = ['edgemont', 'acadia', 'banff trail', 'crescent heights', 'panorama hills'];
    return communities.includes(obj.NAME.toLowerCase());
}