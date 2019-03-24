d3.csv("city_of_calgary_census_2016.csv").then(function (data) {
    let margin = 60;
    let width = 1000 - (2 * margin);
    let height = 600 - (2 * margin);
    let svg = d3.select('svg')
        .style("height", (height + (2 * margin))+ 'px')
        .style("width", (width + (2 * margin)) + 'px')
        .style("margin", margin + "px");
    
    let initialValue = 0;
    let sectors = [...new Set(data.map(x => x.SECTOR))];
    let dataset = sectors.map(function(sector){
        var item = {};
        item['sector'] = sector;
        item['population'] = areaPopulation(data, sector);
        return item;
    });
    
    console.log(dataset);

});



function areaPopulation(obj, area) {
    let filteredSector = obj.filter(function(obj){
        return obj.SECTOR === area || obj.COMM_STRUCTURE === area;
    });

    return filteredSector.reduce( function (accumulator, currentValue) { 
        return accumulator + Number(currentValue.RES_CNT);
    }, 0);
}
