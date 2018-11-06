(function(){
    var width = 1000;
        height = 1300;
        
    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
        
    
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(0).strength(0.003))      
        .force("y", d3.forceY(0).strength(0.003))
        .force("collide", d3.forceCollide(function(d){
            return radiusScale(d.fights_in_UFC) + 1;
        }))
    
        
    var defs = svg.append("defs");
    
    defs.append("pattern")
        .attr("id", "jon-snow")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("patternContentUnits", "objectBoundingBox")
        .append("image")
        .attr("height", 1)
        .attr("width", 1)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", "images/jones.jpg")
    
    
        
    var radiusScale = d3.scaleSqrt().domain([3, 29]).range([10, 80]);
       
        
        
    d3.queue()
        .defer(d3.csv, "ufc-data-2.csv")
        .await(ready)
        
    function ready (error, datapoints) {


        defs.selectAll(".fighter-pattern")
            .data(datapoints)
            .enter().append("pattern")
            .attr("class", "fighter-pattern")
            .attr("id", function(d){
                
            return d.fighter.toLowerCase().split(' ').join('-');
            //return d.division
            })
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits", "objectBoundingBox")
            .append("image")
            .attr("height", 1)
            .attr("width", 1)
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xlink:href", function(d){
               return "images/" + d.fighter_image 
               //return d.fighter_image
            });
            
            
        var circles = svg.selectAll(".fighter")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "fighter")
            .attr("r", function(d){
                return radiusScale(d.fights_in_UFC);
            })
            .attr("fill", function(d){
                
            return "url(#" + d.fighter.toLowerCase().split(' ').join('-') + ")";
            //return "url(#" + d.division + ")";
            })
            .on("click", function(d){
                console.log(d)
            })
        

            
        simulation.nodes(datapoints)
            .on('tick', ticked)
        
        function ticked() {
            circles
                .attr("cx", function(d) {
                    return d.x
                })
                .attr("cy", function(d){
                    return d.y
                })
        }
    }
    
})();