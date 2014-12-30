// dimensions of the SVG viewport
var w = 600;
var h = 400;
var r = 3;

// TODO change domain and range according to some configuration

// scale for the second Chern number
var c2 = d3.scale.linear()
  .domain([-20, 80])
  .range([0, w]);

// scale for the first Chern number
var c12 = d3.scale.linear()
  .domain([-30, 60])
  .range([h, 0]);

// axis for the second Chern number
var c2Axis = d3.svg.axis()
  .scale(c2);

// axis for the first Chern number
var c12Axis = d3.svg.axis()
  .scale(c12)
  .orient("left");

// scale for the Kodaira dimension
var kodaira = d3.scale.ordinal()
  .domain([-1, 0, 1, 2])
  .range(["kodaira-infty", "kodaira-0", "kodaira-1", "kodaira-2"]);

// all the pairs (c_2,c_1^2) corresponding to a minimal projective surface
var points = []

// projective plane
points.push([3, 9, -1]);

// minimal surfaces of Kodaira dimension 0
points.push([0, 0, 0]); // abelian and hyperelliptic surfaces
points.push([12, 0, 0]); // Enriques surfaces
points.push([24, 0, 0]); // K3 surfaces

for (var i2 = c2.domain()[0]; i2 < c2.domain()[1]; i2++) {
  for (var i12 = c12.domain()[0]; i12 < c12.domain()[1]; i12++) {
    // ruled surfaces
    var positivity = (i2 <= 4) && (i12 <= 8);
    var congruence = (i2 % 4 == 0) && (i12 % 8 == 0) && (i12 == i2 * 2);
    if (congruence && positivity)
      points.push([i2, i12, -1]);

    // minimal surface of Kodaira dimension 1
    var congruence = ((i12 + i2) % 12 == 0);
    var positivity = (i12 == 0) && (i2 >= 0);
    if (congruence && positivity)
      points.push([i2, i12, 1]);

    // minimal surface of general type
    var congruence = ((i12 + i2) % 12 == 0);
    var positivity = (i12 >= 0) && (i2 >= 0);
    var BMY = (i12 <= (3 * i2));
    var noether = ((5 * i12 - i2 + 36) >= 0);

    if (congruence && positivity && BMY && noether)
      points.push([i2, i12, 2]);
  }
}

var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// all the minimal nodes
svg.selectAll("circle")
  .data(points)
  .enter()
  .append("circle")
  .attr("cx", function(d) { return c2(d[0]); })
  .attr("cy", function(d) { return c12(d[1]); })
  .attr("r", function(d) { return r; })
  .attr("class", function(d) { return kodaira(d[2]); })

// horizontal axis
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + c12(0) + ")")
  .call(c2Axis);

// vertical axis
svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + c2(0) + ",0)")
  .call(c12Axis);

// assign click event to points
d3.selectAll("circle").on("click", clickedPoint);

function clickedPoint(point) {
  // only act when the clicked node is active (i.e. has the correct Kodaira dimension)
  if (!d3.select(this).classed("inactive")) {
    // make all nodes inactive
    d3.selectAll("circle").classed("active", false);

    // make this node active
    d3.select(this).classed("active", true);

    // remove candidates
    clearCandidates();

    // reset the Hodge diamond
    setInactive();

    // add the coordinates to the legend in the fieldset
    $("fieldset#candidates legend").html("Candidates<br>for $\\mathrm{c}_2=" + point[0] + "$, $\\mathrm{c}_1^2=" + point[1] + "$");
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

    // look for surfaces with the correct invariants
    for (var i = 0; i < surfaces.length; i++) {
      if (surfaces[i].c2 == point[0] && surfaces[i].c12 == point[1] && surfaces[i].kodaira == point[2])
        addCandidateSurface(surfaces[i]);
    }

    // check whether we have found surfaces, otherwise display a message
    if ($("fieldset#candidates ol li").length == 0)
      $("fieldset#candidates").prepend("<p class='message'>No surfaces known with these invariants, sorry.");
  }
}
