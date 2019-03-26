function getDataset(value){
    d3.selectAll('g').remove();
    d3.csv("city_of_calgary_census_2016.csv").then(function (data) { 
        
        let message = null;
        let commSectors = [];
        if  (value === 0) {
            title = "Calgary Population By Sector 2016";
            commSectors = [...new Set(data.map(x => x.SECTOR))]
        } else {
            title = "Calgary Population By Community Structure";
            commSectors =[...new Set(data.map(x => x.COMM_STRUCTURE))];
        }

        let dataset = commSectors.map(function(commSector){
            let item = {};
            item['area'] = commSector;
            item['population'] = areaPopulation(data, commSector);
            return item;
        });

        drawChart(dataset, title);
    });
    
}

function drawChart(dataset, title) {
    let margin = 60;
    let width = 1000 - (2 * margin);
    let height = 700 - (2 * margin);
    let radius = Math.min(width, height) /2;
    let innerRadius = radius - (2 * margin);
    let svg = d3.select('svg')
        .attr("radius", radius);
    
    let g = svg.append("g")
                   .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    let color = d3.scaleOrdinal(d3.schemePaired);
    
    let pie = d3.pie().value(function(d) { 
        return d.population; 
    });
    
    pie.padAngle(.02);

    let path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(100);

    let label = d3.arc()
        .outerRadius(radius)
        .innerRadius(innerRadius);
    
     let arc = g.selectAll('.arc')
        .data(pie(dataset))
        .enter().append('g')
        .attr("class", "arc")
        .on('mouseenter', function (s, i) {
            d3.selectAll(".arc")
                .attr('opacity', 0.1);
            d3.select(this)
                .attr('opacity', 1)
                .append("text")
                .attr("class", "population")
                .text(s.data.population);
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
        .text(function(d) { return d.data.area; });
    
    svg.append("g")
        .attr("transform", "translate(" + (width / 2 ) + "," + (height + margin) + ")")
        .append("text")
        .attr('text-anchor',  'middle')
        .text(title)
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

window.addEventListener("load", function(){
    let button = document.getElementById('change');
    getDataset(0);
    button.addEventListener('click', function(e){
        toggle =Number(e.target.value);
        getDataset(toggle);
        if(toggle === 1){
            e.target.value = 0;
        } else {
            e.target.value = 1;
        }
    });
});
