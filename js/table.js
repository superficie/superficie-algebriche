// dimensions of the SVG viewport
var w = 600;
var h = 400;
var r = 3;

// TODO change domain and range according to some configuration
var constraint_function = function(d) { return true; };

// scale for the x-axis
var xcoord = d3.scale.linear()
  .domain([-20, 80])
  .range([0, w]);

// scale for the y-axis
var ycoord = d3.scale.linear()
  .domain([-30, 60])
  .range([h, 0]);

// axis for the x-axis
var xAxis = d3.svg.axis()
  // .tickValues([-10, 0, 10, 20, 30, 40, 50, 60, 70])
  .scale(xcoord);

// axis for the y-axis
var yAxis = d3.svg.axis()
  .scale(ycoord)
  // .tickValues([-20, -10, 0, 10, 20, 30, 40, 50])
  .orient("left");

// scale for the Kodaira dimension
var kodaira = d3.scale.ordinal()
  .domain([-1, 0, 1, 2])
  .range(["kodaira-infty", "kodaira-0", "kodaira-1", "kodaira-2"]);

// all the points (pg, q, K2) corresponding to a minimal projective surface
var points = [];

function Point(invariants) {
  if ("kodaira" in invariants) {
    this.kodaira = invariants.kodaira;
  }
  else {
    console.log("No Kodaira dimension specified for the Point invariants: " + JSON.stringify(invariants));
  }
  // the idea is to compute the Hodge numbers based on the input data, as all other invariants are expressed in terms of these
  if ("pg" in invariants && "q" in invariants && "K2" in invariants) {
    // this computation assumes that the surface is Kaehler
    this.h02 = invariants.pg;
    this.h01 = invariants.q;
    this.chi = this.h02 - this.h01 + 1;
    this.e = 12*this.chi - invariants.K2;
    this.h11 = this.e - 2 + 4*this.h01 - 2*this.h02;

    // the surface is Kaehler so we have computed everything now
    this.q = this.h10 = this.h21 = this.h12 = this.h01; 
    this.pg = this.h20 = this.h02;
  }
  else {
    console.log("Didn't recognise the input format for the Point invariants: " + JSON.stringify(invariants));
  }

  // Chern numbers
  this.e = this.c2 = 2 - this.h10 - this.h01 - this.h21 - this.h12 + this.h02 + this.h11 + this.h20;
  this.K2 = this.c12 = 12 * (this.h02 - this.h01 + 1) - this.c2;

  // Betti numbers
  this.b0 = 1;
  this.b1 = this.h01 + this.h10;
  this.b2 = this.h20 + this.h11 + this.h02;
  this.b3 = this.h21 + this.h21;
  this.b4 = 1;

  // Euler number
  this.e = this.b0 - this.b1 + this.b2 - this.b3 + this.b4;

  // arithmetic genus
  this.pa = this.h02 - this.h01;

  // holomorphic Euler characteristic
  this.chi = this.h02 - this.h01 + 1;

  // signature
  this.tau = 4 * this.chi - this.e;

  this.hasExamples = false;
}

// projective plane
points.push(new Point({kodaira: -1, pg: 0, q: 0, K2: 9}));

// minimal surfaces of Kodaira dimension 0
points.push(new Point({kodaira: 0, pg: 1, q: 2, K2: 0})); // abelian, hyperelliptic and Kodaira surfaces
// points.push(new Point(12, 0, 0)); // Enriques surfaces
points.push(new Point({kodaira: 0, pg: 1, q: 0, K2: 0})); // K3 surfaces

for (var g = 0; g < 20; g++) {
  points.push(new Point({kodaira: -1, pg: 0, q: g, K2: 8*(1-g)})); // ruled surfaces
  for (var k = 0; k < 10; k++) { // See Miranda `Elliptic surfaces' pages 33-35
    if (g >= 2) {
      points.push(new Point({kodaira: 1, K2: 0, pg: g + k, q: g + 1}));
    }
    if (g >= 2 || (g == 1 && k >= 1) || (g == 0 && k >= 3)) {
      points.push(new Point({kodaira: 1, K2: 0, pg: g + k - 1, q: g}));
    }
  }
}

for (var pg = 0; pg <= 10; pg++) {
  for (var q = 0; q <= pg; q++) {
    var chi = pg - q + 1;
    for (var K2 = 1; K2 <= 9*chi; K2++) {
      // K2 <= 9*chi is the BMY inequality
      var debarre = (q == 0 || K2 >= 2*pg);
      var noether = (K2 >= 2*chi - 6);
      if (debarre && noether) {
        points.push(new Point({kodaira: 2, pg: pg, q: q, K2: K2}));
      }
    }
  }
}

// see which points have surfaces associated with them
for (var i = 0; i < points.length; i++) {
  for (var j = 0; j < surfaces.length; j++) {
    if (surfaces[j].q == points[i].q &&
        surfaces[j].pg == points[i].pg &&
        surfaces[j].K2 == points[i].K2 &&
        surfaces[j].kodaira == points[i].kodaira) {
      points[i].hasExamples = true;
    }
  }
}

var svg = d3.select("div#table")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// horizontal axis
svg.append("g")
  .attr("class", "axis")
  .attr("id", "xaxis")
  .attr("transform", "translate(0," + ycoord(0) + ")")
  .call(xAxis);

// vertical axis
svg.append("g")
  .attr("class", "axis")
  .attr("id", "yaxis")
  .attr("transform", "translate(" + xcoord(0) + ",0)")
  .call(yAxis);

// improve origin: remove double 0
svg.selectAll(".axis g text")
  .filter(function(d) { return d === 0; })
  .style("opacity", function(d, i) { if (i !== 0) return 0; })
  .attr("dx", function(d, i) { if (i === 0) return "-10px"; });

var surface2x = function(d) { return d.e; }
var surface2y = function(d) { return d.K2; }

// all the minimal points
svg.selectAll("circle")
  .data(points)
  .enter()
  .append("circle")
  .attr("cx", function(d) {return xcoord(surface2x(d)); })
  .attr("cy", function(d) {return ycoord(surface2y(d)); })
  .attr("r", function(d) { return d.hasExamples ? r + 1 : r - 1; })
  .attr("data-toggle", "tooltip")
  // .attr("data-c2", function(d) { return d.c2; })
  // .attr("data-c12", function(d) { return d.c12; })
  .attr("class", function(d) { return kodaira(d.kodaira); });

// // draw Noether inequality (hardcoded constants...)
// svg.append("line")
//   .attr("x1", c2(36))
//   .attr("x2", c2(86))
//   .attr("y1", c12(0))
//   .attr("y2", c12(10))
//   .attr("class", "axis");
// svg.append("text")
//   .attr("x", c2(65))
//   .attr("y", c12(2))
//   .attr("class", "kodaira-2 inactive")
//   .attr("text-anchor", "middle")
//   .attr("transform", "rotate(-7, " + c2(65) + ", " + c12(2) + ")") 
//   .text("Noether inequality");

// // draw the BMY inequality (hardcoded constants...)
// svg.append("line")
//   .attr("x1", c2(0))
//   .attr("x2", c2(20))
//   .attr("y1", c12(0))
//   .attr("y2", c12(60))
//   .attr("class", "axis");
// svg.append("text")
//   .attr("x", c2(10))
//   .attr("y", c12(35))
//   .attr("class", "kodaira-2 inactive")
//   .attr("text-anchor", "middle")
//   .attr("transform", "rotate(-66, " + c2(10) + ", " + c12(35) + ")") 
//   .text("Bogomolov–Miyaoka–Yau inequality");

// // draw the positive / negative signature line (hardcoded constants...)
// svg.append("line")
//   .attr("x1", c2(0))
//   .attr("x2", c2(30))
//   .attr("y1", c12(0))
//   .attr("y2", c12(60))
//   .attr("class", "axis");
// $("div#table").prepend("<p id='signatureline' class='kodaira-2 inactive'>signature is zero</p>");


// assign click event to points
d3.selectAll("circle").on("click", clickedPoint);

function clickedPoint(point) {
  // only act when the clicked node is active (i.e. has the correct Kodaira dimension)
  if (!d3.select(this).classed("inactive")) {
    // make all nodes inactive
    d3.selectAll("circle").classed("active", false);

    // make this node active
    d3.select(this).classed("active", true);

    // SVG doesn't have a z-index...
    d3.select(this).moveToFront();

    // remove candidates
    clearCandidates();

    // reset the Hodge diamond
    setInactive();

    xclicked = Math.round(xcoord.invert(this.cx.baseVal.value));
    yclicked = Math.round(ycoord.invert(this.cy.baseVal.value));
    // add the coordinates to the legend in the fieldset
    $("fieldset#candidates legend")
      .html("Candidates<br>for $x=" + xclicked + "$, $y=" + yclicked + "$");
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    // look for surfaces with the correct invariants
    for (var i = 0; i < surfaces.length; i++) {
      // invariants are correct
      if (surface2x(surfaces[i]) == xclicked &&
          surface2y(surfaces[i]) == yclicked &&
          constraint_function(surfaces[i])) {
        addCandidateSurface(surfaces[i]);
      }
    }

    // check whether we have found surfaces, otherwise display a message
    if ($("fieldset#candidates ol li").length === 0) {
      $("fieldset#candidates").prepend("<p class='message'>No surfaces in the database with these invariants, sorry.<br>This does not mean that they do not exist, just that we do not have them in our database. If you think you can add one, please get in touch via <a href='mailto:superficie.algebriche@gmail.com'><code>superficie.algebriche@gmail.com</code></a>.");
    } else if ($("fieldset#candidates ol li").length === 1) {
      $("fieldset#candidates ol li a").click();
      $("fieldset#candidates ol li").addClass("active");
    }

    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }
}

