// Check for Browser - Chrome is best option
// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]" 
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

function statsExtract(str){
	return str.split(" ")[0].split("-");
	/* This gets a substring from the beginning of the string 
      	to the first index of the character " " and then splits
	that string into an array delimited by the "-" character.
	e.g. converts ""42-6-2 (1 NC)" into [42,6,2]
   	*/
}


(function() {
    
//Sets the width and height of the viewport, then creates variable called svg and appends an svg.
 var width = 700;
 height = 550;

 var svg = d3.select("#chart")                                                    
  .append("svg")
  .attr("height", height)
  .attr("width", width)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")


// the force variables are called on page load and when the nav bar buttons are clicked
// this is what makes the circles move in a certain way. There is a force on the x axis and y axis.
 var forceXFightsInUfc = d3.forceX(0).strength(0.003)                                   

 var forceXChampions = d3.forceX(function(d) {
  if (d.champion === "yes") {
   return 100
  } else {
   return -200
  }
 }).strength(0.2)

 var forceXBrawl = d3.forceX(0).strength(2)

// The radiusScale sets the radius of the circles and adds a bit of space - it uses the value of the 
// data fights_in_UFC to determine radius, this data is found in the CSV file.

 var forceCollide = d3.forceCollide(function(d) {
  return radiusScale(d.fights_in_UFC) + 1
 })

// The variable simulation determins which force variable is used in the first instance. Makes the circles cluster together.


 var simulation = d3.forceSimulation()
  .force("x", forceXFightsInUfc)
  .force("y", d3.forceY(0).strength(0.01))
  .force("collide", d3.forceCollide(function(d) {
   return radiusScale(d.fights_in_UFC) + 2;
  }))


// The variable defs is used to add the stylings for the image in the circle.

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

// The radius scale range fixes the range of the data i.e the sizes of the circles.

 var radiusScale = d3.scaleSqrt().domain([3, 29]).range([9, 35]);


// Loads the CSV file
 d3.queue()
  .defer(d3.csv, "ufc-data-2.csv")
  .await(ready)

 function ready(error, datapoints) {


  defs.selectAll(".fighter-pattern")
   .data(datapoints)
   .enter().append("pattern")
   .attr("class", "fighter-pattern")
   .attr("id", function(d) {

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
   .attr("xlink:href", function(d) {
    return "images/" + d.fighter_image
    //return d.fighter_image
   });


//Creates the circles and attaches the data to them
  var circles = svg.selectAll(".fighter")
   .data(datapoints)
   .enter().append("circle")
   .attr("class", "fighter")
   .attr("stroke", function(d) {
    if (d.champion == "yes") {
     return "gold";
    } else {
     return "black"
    }
//Determines the border color of the circle - set gold for champions
   })
   .attr("stroke-width", 1)
   .attr("r", function(d) {
    return radiusScale(d.fights_in_UFC);
   })
   .attr("fill", function(d) {

    return "url(#" + d.fighter.toLowerCase().split(' ').join('-') + ")";
    //return "url(#" + d.division + ")";
   })
   .on("mouseover", function(d) {
    // below all needs to be added to make the name pop up
    d3.select(this).raise()
     .attr("class", "fighter")
     .attr("r", function(d) {
      return radiusScale(50);
     })
     //.attr("stroke", "red")
     .attr("stroke-width", 2)
     var circlex = d3.select(this).attr("cx");
     var circley = d3.select(this).attr("cy");
    //console.log("hover over");
    if (isChrome) {
      d3.select("#hover-name")
      .append("text")
      .attr("class", "hover-name")
      .text(d.fighter)
    }
    statsDonut(statsExtract(d.record),circlex,circley,48);
    //statsDonut(d.record,70);
    //statsDonut([42,6,2],70);
    console.log("hover over");
   })
   .on("mouseout", function(d) {
    // below needs to be added to make the pop-up name disappear
    //    d3.selectAll("text.stats").remove();
    d3.selectAll(".fighter")
     .attr("r", function(d) {
      return radiusScale(d.fights_in_UFC);
     })
     .attr("stroke", function(d) {
      if (d.champion == "yes") {
       return "gold";
      } else {
       return "black"
      }
     })
     .attr("stroke-width", 1)
    if (isChrome) d3.select(".hover-name").remove();
    d3.selectAll(".arc").remove();
   })
   //the on click codes below create the stats section, each time a fighter is clicked the relevant stats are diplayed
   .on("click", function(d) {
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
     .text(((d.win) * 100) + "%")

    d3.select("#fights")
     .append("text")
     .attr("class", "stats")
     .text(d.fights_in_UFC)

    d3.select("#fighter-image")
     .append("img")
     .attr("class", "fighter-image-stats")
     .attr("src", "images/" + d.fighter_image)
   })

//Different forces are used depending on which button is clicked

  d3.select("#champions").on("click", function() {
   simulation
    .force("x", forceXChampions)
    .alphaTarget(0.2)
    .restart()
  })

  d3.select("#brawl").on("click", function() {
   simulation
    .force("x", forceXBrawl)
    .alphaTarget(0.5)
    .restart()
  })

  d3.select("#fights-in-ufc").on("click", function() {
   simulation
    .force("x", forceXFightsInUfc)
    .alphaTarget(1.7)
    .restart()
  })


  simulation.nodes(datapoints)
   .on('tick', ticked)

  function ticked() {
   circles
    .attr("cx", function(d) {
     return d.x
    })
    .attr("cy", function(d) {
     return d.y
    })
  }

  var divisions = d3.nest()
   //.data(datapoints)
   .key(function(d) {
    return d.division
   })
   .rollup(function(a) {
    return a.length;
   })
   .entries(datapoints);

  divisions.unshift({
   "key": "All Divisions",
   "value": d3.sum(divisions, function(d) {
    return d.value;
   })
  })
//Creates the selector for the divisions, non-selected devisions's circles will got transparent.
  var selector = d3.select("#selector");

  selector
   .selectAll("option")
   .data(divisions)
   .enter()
   .append("option")
   .text(function(d) {
    return d.key;
   })
   .attr("value", function(d) {
    return d.key;
   })

  selector
   .on("change", function() {
    d3.selectAll(".fighter")
     .attr("opacity", 1.0);
    var value = selector.property("value");
    if (value != "All Divisions") {
     d3.selectAll(".fighter")
      .filter(function(d) {
       return d.division != value;
      })
      .attr("opacity", 0.1);
    }
   })
 }

// --------------------------------------------------------------------


function statsDonut(data,donutx, donuty,donutRad) {

 var arcColor = d3.scaleOrdinal()
	.range(["lightgreen", "red", "orange"]);

  var arc = d3.arc()
	.innerRadius(donutRad)
	.outerRadius(donutRad+10);

  var pie = d3.pie()
	//.padAngle(0.005)
  .value(function(d) {return d;});

  var arcs = svg.selectAll(".arc")
	.data(pie(data))
	.enter()
	.append("g")
	.attr("transform","translate(" + donutx + ","+ donuty + ")")
	.attr("class","arc");

  arcs.append("path")
	.attr("d",arc)
	.attr("fill", function(d) {return arcColor(d.data);})

}

// --------------------------------------------------------------------



})();