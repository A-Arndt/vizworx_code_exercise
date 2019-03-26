/*
    PARAMS: value: 0 or 1 (not 0). 
                0 indicates the Sector dataset.
                1 (or not 0) indicates the Community Structure dataset.
    This function takes the full csv file and breaks it down into a 
        filtered dataset based on the value passed in.
    Calls the drawChart function based on dataset created.
*/
function initDataset(value) {
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
    let innerRadius = radius - (2.5 * margin);
    let formatComma = d3.format(",");
    
    let svg = d3.select('svg')
        .attr("radius", radius);
    
    let g = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    let color = d3.scaleOrdinal(d3.schemePaired);
    
    let pie = d3.pie().value(function(d) { 
        return d.population; 
    });
    
    pie.padAngle(.03);

    let path = d3.arc()
        .outerRadius(radius)
        .innerRadius(100);
    
    let label = d3.arc()
        .outerRadius(radius)
        .innerRadius(innerRadius);
    
     let arc = g.selectAll('.arc')
        .data(pie(dataset))
        .enter().append('g')
        .attr("class", "arc")
        .on('mouseenter', function (s, i) {
            //Clear the help info and fade non-hovered slices
            d3.selectAll(".info").remove();
            d3.selectAll(".arc")
                .attr('opacity', 0.1);
            
            //Display the total residents for an area
            d3.select(this)
                .attr('opacity', 1)
                .append("text")
                .attr("class", "population")
                .text(`Residents: ${formatComma(s.data.population)}`);
            
            //Display the title for small slices
            d3.select(this).select(".area").attr("opacity", 1);
            
        })
        .on('mouseleave', function () { 
            //Fade in all other slices, remove resident data and hide small slice titles
            d3.selectAll(".arc")
                .attr('opacity', 1);
            d3.selectAll(".population").remove();
            d3.selectAll(".area").attr("opacity", function(d) {
                return (d.endAngle - d.startAngle < (4*Math.PI/180) ? 0 : 1);
            });
        });
    
    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.population); });
    
    /*Put in some guiding info to get users to see more data.*/ 
    arc.append("text")
        .attr("class", "info")
        .text(`Hover over slice for info.`);
    
    /*Append area names to each slice, but only those that are large enough to avoid overlapping.*/
    arc.append("text")
        .attr("transform", function(d) {
            return `translate(${label.centroid(d)})`;
        })
        .text(function(d) { return d.data.area; })
        .attr("class", "area")
        .attr("opacity", function(d) {
            return (d.endAngle - d.startAngle < (4*Math.PI/180) ? 0 : 1); 
        });
    
    /*Append the title of the chart.*/
    svg.append("g")
        .attr("transform", `translate( ${(width / 2 )}, ${(height + margin)})`)
        .append("text")
        .attr('text-anchor',  'middle')
        .text(title)
        .attr("class", "title");
}

/*
    This function takes an array, and a string (either a Community structure or sector)
        to determine if the object conains that string and create a filtered array.
    Once filtered the population is summed up into a total population for that area.
*/
function areaPopulation(obj, area) {
    let filteredSector = obj.filter(function(obj){
        return obj.SECTOR === area || obj.COMM_STRUCTURE === area;
    });

    return filteredSector.reduce( function (accumulator, currentValue) { 
        return accumulator + Number(currentValue.RES_CNT);
    }, 0);
}

/*  On load, call the initDataset to draw the first dataset. 
    Add an event listener to the button to change the visualization.
*/
window.addEventListener("load", function(){
    let button = document.getElementById('change');
    initDataset(0);
    button.addEventListener('click', function(e){
        toggle =Number(e.target.value);
        initDataset(toggle);
        if(toggle === 1){
            e.target.value = 0;
        } else {
            e.target.value = 1;
        }
    });
});
