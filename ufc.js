(function(){
    var width = 700;
        height = 600;
        
    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
       
        

    var forceXFightsInUfc = d3.forceX(0).strength(0.003)
    
    var forceXChampions = d3.forceX(function(d){
        if(d.champion === "yes") {
            return 100
        } else{
            return -200
        }
    }).strength(0.5)
    
        var forceXBrawl = d3.forceX(0).strength(2)
    
    
    
    var forceCollide = d3.forceCollide(function(d){
        return radiusScale(d.fights_in_UFC) + 1
    })
    
    var simulation = d3.forceSimulation()
          .force("x", forceXFightsInUfc)      
          .force("y", d3.forceY(0).strength(0.003))
          .force("collide", d3.forceCollide(function(d){
              return radiusScale(d.fights_in_UFC) + 2;
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
    
    
        
    var radiusScale = d3.scaleSqrt().domain([3, 29]).range([15, 30]);
       
        
        
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
            .attr("stroke", function(d){
            if (d.division == "Heavyweight") {
                return "red";
            } 
            if (d.division == "Light Heavyweight") {
                return "orange";
            }     
            if (d.division == "Middleweight") {
                return "yellow";
            } 
            if (d.division == "Welterweight") {
                return "green";
            }     
            if (d.division == "Lightweight") {
                return "blue";
            }     
            if (d.division == "Featherweight") {
                return "brown";
            }  
            if (d.division == "Bantamweight") {
                return "purple";
            } 
            else{
                return "pink";
            } 
            })
            .attr("stroke-width", 1)
            .attr("r", function(d){
                return radiusScale(d.fights_in_UFC);
            })
            .attr("fill", function(d){
                
            return "url(#" + d.fighter.toLowerCase().split(' ').join('-') + ")";
            //return "url(#" + d.division + ")";
            })
             .on("mouseover", function(d){
               // below all needs to be added to make the name pop up
                d3.select(this).raise()
                    .attr("class", "fighter")
                    .attr("r", function(d){
                    return radiusScale(150);
            })
                //console.log("hover over");
            })
            .on("mouseout", function(d){
                // below needs to be added to make the pop-up name disappear
            //    d3.selectAll("text.stats").remove();
                d3.selectAll(".fighter")
                    .attr("r", function(d){
                    return radiusScale(d.fights_in_UFC);
                    })
            })
            .on("click", function(d){
                //console.log("Clicked");
                d3.selectAll("text.stats").remove();
                d3.selectAll("img.fighter-image-stats").remove();                

                d3.select("#fighter-name")
                .append("text")
                .attr("class", "stats")
                .text(d.fighter)

                d3.select("#country")
                .append("text")
                .attr("class", "stats")
                .text(d.country)
                
                d3.select("#mma-record")
                .append("text")
                .attr("class", "stats")
                .text(d.record)

                d3.select("#age")
                .append("text")
                .attr("class", "stats")
                .text(d.age)
                
                d3.select("#height")
                .append("text")
                .attr("class", "stats")
                .text((d.height / 100) + "m") 

                d3.select("#division")
                .append("text")
                .attr("class", "stats")
                .text(d.division) 

                d3.select("#style")
                .append("text")
                .attr("class", "stats")
                .text(d.style) 

                d3.select("#strikes")
                .append("text")
                .attr("class", "stats")
                .text(d.slpm) 
                
                d3.select("#takedowns")
                .append("text")
                .attr("class", "stats")
                .text(d.td) 

                d3.select("#win-percentage")
                .append("text")
                .attr("class", "stats")
                .text(((d.win)*100) + "%") 
                
                d3.select("#fights-in-ufc")
                .append("text")
                .attr("class", "stats")
                .text(d.fights_in_UFC) 
                
                d3.select("#fighter-image")
                .append("img")
                .attr("class", "fighter-image-stats")
                .attr("src", "images/" + d.fighter_image) 
            })
            
            

        d3.select("#champions").on("click", function(){
            simulation
                .force("x", forceXChampions)
             .alphaTarget(0.1)
                .restart()
        })
        
        d3.select("#brawl").on("click", function(){
            simulation
                .force("x", forceXBrawl)
             .alphaTarget(0.5)
                .restart()
        })

        d3.select("#fights-in-ufc").on("click", function(){
            simulation
                .force("x", forceXFightsInUfc)
                .alphaTarget(1)
                .restart()
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
        
    var divisions = d3.nest()
        //.data(datapoints)
        .key(function(d){ return d.division})
            .rollup(function(a){ return a.length; })
        .entries(datapoints);
        
    divisions.unshift({"key": "All Divisions",
                    "value": d3.sum(divisions, function(d){ return d.value;})
    })
        
    var selector = d3.select("#selector");
    
    selector
        .selectAll("option")
        .data(divisions)
        .enter()
        .append("option")
            .text(function(d){ return d.key;})
            .attr("value", function(d){ return d.key;})
    
    selector    
        .on("change", function(){
            d3.selectAll(".fighter")
                .attr("opacity", 1.0);
            var value = selector.property("value");
                if(value != "All Divisions") {
                    d3.selectAll(".fighter")
                        .filter(function(d) { return d.division != value; })
                        .attr("opacity", 0.1);
                }
        })    
    }


   
    
})();