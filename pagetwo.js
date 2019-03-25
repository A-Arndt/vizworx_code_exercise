d3.csv("city_of_calgary_census_2016.csv").then(function (data) { 
    let sectors = [...new Set(data.map(x => x.SECTOR))];
    let dataset = sectors.map(function(sector){
        var item = {};
        item['sector'] = sector;
        item['population'] = areaPopulation(data, sector);
        return item;
    });
    
    let totalPopulation = dataset.reduce( function (accumulator, currentValue) { 
        return accumulator + Number(currentValue.population);
    }, 0);



    drawChart(dataset);
   
});

function drawChart(dataset) {
    let margin = 60;
    let width = 700 - (2 * margin);
    let height = 600 - (2 * margin);
    let radius = Math.min(width, height) /2;
    
    let svg = d3.select('svg')
        .style("height", (height + (2 * margin))+ 'px')
        .style("width", (width + (2 * margin)) + 'px')
        .style("margin", margin + "px")
        .attr("radius", radius);
    
    let g = svg.append("g")
                   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    let color = d3.scaleOrdinal(d3.schemePaired);
    
    let pie = d3.pie().value(function(d) { 
        return d.population; 
    });

    let path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(100);

    let label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - (2 * margin));
    
     let arc = g.selectAll('.arc')
        .data(pie(dataset))
        .enter().append('g')
        .attr("class", "arc")
        .on('mouseenter', function (s, i) {
            d3.selectAll(".arc")

                .attr('opacity', 0.5);
            d3.select(this)
                .attr('opacity', 1)
                .append("text")
                .attr("class", "population")
                .text(s.data.population).style("font", "20px");
        })
        .on('mouseleave', function () { 
            d3.selectAll(".arc")
                .attr('opacity', 1)
            d3.selectAll(".population")
                .remove();
        });
    
    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.population); });
        
    arc.append("text")
        .attr("transform", function(d) {
            return "translate(" +label.centroid(d)+")";
        })
        .text(function(d) { return d.data.sector; });
    
    svg.append("g")
        .attr("transform", "translate(" + (width / 2 - (2 * margin)) + "," + (height + margin) + ")")
        .append("text")
        .text("Calgary Population By Sector 2016")
        .attr("class", "title")
}

function areaPopulation(obj, area) {
    let filteredSector = obj.filter(function(obj){
        return obj.SECTOR === area || obj.COMM_STRUCTURE === area;
    });

    return filteredSector.reduce( function (accumulator, currentValue) { 
        return accumulator + Number(currentValue.RES_CNT);
    }, 0);
}


