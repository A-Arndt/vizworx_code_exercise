d3.csv("city_of_calgary_census_2016.csv").then(function(data) {
    let initialValue = 0;

    let totalPop = data.reduce( function (accumulator, currentValue) { 
        return accumulator + Number(currentValue.RES_CNT);
    }, initialValue);
    
    
    let communities = ['edgemont', 'acadia', 'banf trail', 'crescent heights', 'panorama hills'];
    console.log(communities);
    console.log(communities.includes('acadia'));
    let filteredData = data.filter(neededCommunity);
});



function neededCommunity(obj) {
    let communities = ['edgemont', 'acadia', 'banff trail', 'crescent heights', 'panorama hills'];
    return communities.includes(obj.NAME.toLowerCase());
}