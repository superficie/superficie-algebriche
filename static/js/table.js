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
  .tickValues([-10, 0, 10, 20, 30, 40, 50, 60, 70])
  .scale(c2);

// axis for the first Chern number
var c12Axis = d3.svg.axis()
  .scale(c12)
  .tickValues([-20, -10, 0, 10, 20, 30, 40, 50])
  .orient("left");

// scale for the Kodaira dimension
var kodaira = d3.scale.ordinal()
  .domain([-1, 0, 1, 2])
  .range(["kodaira-infty", "kodaira-0", "kodaira-1", "kodaira-2"]);

// all the pairs (c_2,c_1^2) corresponding to a minimal projective surface
var points = [];

function Point(c2, c12, kodaira, algebraic) {
  this.c2 = c2;
  this.c12 = c12;
  this.kodaira = kodaira;

  this.algebraic = typeof algebraic !== "undefined" ? algebraic : true;

  this.hasExamples = false;
  this.hasNamedExample = false; // a surface other than a generic Persson filler
}

// projective plane
points.push(new Point(3, 9, -1));

// minimal surfaces of Kodaira dimension 0
points.push(new Point(0, 0, 0)); // abelian, hyperelliptic and Kodaira surfaces
points.push(new Point(12, 0, 0)); // Enriques surfaces
points.push(new Point(24, 0, 0)); // K3 surfaces

for (var i2 = c2.domain()[0]; i2 < c2.domain()[1]; i2++) {
  for (var i12 = c12.domain()[0]; i12 < c12.domain()[1]; i12++) {
    // ruled surfaces
    var positivity = (i2 <= 4) && (i12 <= 8);
    var congruence = (i2 % 4 === 0) && (i12 % 8 === 0) && (i12 == i2 * 2);
    if (congruence && positivity)
      points.push(new Point(i2, i12, -1));

    // Kodaira surfaces
    var positivity = (i2 >= 0) && (i12 <= 0);
    var congruence = (i2 + i12) == 0;
    if (congruence && positivity)
      points.push(new Point(i2, i12, -1, false));

    // minimal surface of Kodaira dimension 1
    var congruence = ((i12 + i2) % 12 === 0);
    var positivity = (i12 === 0) && (i2 >= 0);
    if (congruence && positivity)
      points.push(new Point(i2, i12, 1));

    // minimal surface of general type
    var congruence = ((i12 + i2) % 12 === 0);
    var positivity = (i12 > 0) && (i2 > 0);
    var BMY = (i12 <= (3 * i2));
    var noether = ((5 * i12 - i2 + 36) >= 0);

    if (congruence && positivity && BMY && noether)
      points.push(new Point(i2, i12, 2));
  }
}

// see which points have surfaces associated to them
for (var i = 0; i < points.length; i++) {
  for (var j = 0; j < surfaces.length; j++) {
    if (surfaces[j].c2 == points[i].c2 && surfaces[j].c12 == points[i].c12 && surfaces[j].kodaira == points[i].kodaira) {
      points[i].hasExamples = true;
      if (surfaces[j].name !== "Persson surfaces") points[i].hasNamedExample = true;
    }
  }
}

var svg = d3.select("div#table")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// --- coordinate systems: two projections of the same points ---------------------
// The Noether, signature-zero and Bogomolov–Miyaoka–Yau bounds are meaningful in both;
// here chi = (c_1^2 + c_2) / 12. Switching only re-positions the points and redraws the
// axes and bound lines: the circles (with their tooltips and click handler) are untouched.
var chi = d3.scale.linear().domain([-4, 12]).range([0, w]);
var chiAxis = d3.svg.axis().scale(chi).tickValues([-2, 0, 2, 4, 6, 8, 10]);

var systems = {
  "c2-c12": {
    x: function(d) { return d.c2; }, xScale: c2, xAxis: c2Axis, xLabelTeX: "$\\mathrm{c}_2$",
    y: function(d) { return d.c12; }, yScale: c12, yAxis: c12Axis,
    lines: [
      { a: [36, 0], b: [86, 10], at: [65, 2], text: "Noether inequality" },
      { a: [0, 0], b: [20, 60], at: [10, 35], text: "Bogomolov–Miyaoka–Yau inequality" },
      { a: [0, 0], b: [30, 60], at: [24, 48], text: "signature is zero" }
    ]
  },
  "chi-c12": {
    x: function(d) { return (d.c2 + d.c12) / 12; }, xScale: chi, xAxis: chiAxis, xLabelTeX: "$\\chi$",
    y: function(d) { return d.c12; }, yScale: c12, yAxis: c12Axis,
    // Noether c_1^2 = 2chi-6, signature-zero c_1^2 = 8chi, BMY c_1^2 = 9chi
    lines: [
      { a: [1, -4], b: [8, 10], at: [6.5, 7], text: "Noether inequality" },
      { a: [0, 0], b: [60 / 9, 60], at: [4.2, 38], text: "Bogomolov–Miyaoka–Yau inequality" },
      { a: [0, 0], b: [7.5, 60], at: [6.4, 51], text: "signature is zero" }
    ]
  }
};

// the points: drawn once, only re-positioned when the coordinate system changes
svg.selectAll("circle")
  .data(points)
  .enter()
  .append("circle")
  // three sizes: a named example (r+1), only a generic Persson filler (r), or nothing yet (r-1)
  .attr("r", function(d) { return d.hasNamedExample ? r + 1 : (d.hasExamples ? r : r - 1); })
  .attr("data-bs-toggle", "tooltip")
  .attr("data-c2", function(d) { return d.c2; })
  .attr("data-c12", function(d) { return d.c12; })
  .attr("class", function(d) {
    if (d.algebraic)
      return kodaira(d.kodaira);
    else
      return kodaira(d.kodaira) + " " + "nonalgebraic";
  });

// groups for the axes and bound lines, cleared and redrawn on a switch
var gAxes = svg.append("g");
var gLines = svg.append("g");

function drawCoordinates(key) {
  var s = systems[key];

  // (re)position the points
  svg.selectAll("circle")
    .attr("cx", function(d) { return s.xScale(s.x(d)); })
    .attr("cy", function(d) { return s.yScale(s.y(d)); });

  // axes
  gAxes.selectAll("*").remove();
  gAxes.append("g").attr("class", "axis").attr("transform", "translate(0," + s.yScale(0) + ")").call(s.xAxis);
  gAxes.append("g").attr("class", "axis").attr("transform", "translate(" + s.xScale(0) + ",0)").call(s.yAxis);
  // improve origin: remove double 0
  gAxes.selectAll(".axis g text")
    .filter(function(d) { return d === 0; })
    .style("opacity", function(d, i) { if (i !== 0) return 0; })
    .attr("dx", function(d, i) { if (i === 0) return "-10px"; });

  // bound lines and their (rotated) labels; labels only show in Kodaira dimension 2
  gLines.selectAll("*").remove();
  var output = document.getElementById("kodaira-output");
  var inactive = (output && output.textContent.trim() === "2") ? "" : " inactive";
  s.lines.forEach(function(L) {
    var x1 = s.xScale(L.a[0]), y1 = s.yScale(L.a[1]), x2 = s.xScale(L.b[0]), y2 = s.yScale(L.b[1]);
    gLines.append("line").attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2).attr("class", "axis");
    var lx = s.xScale(L.at[0]), ly = s.yScale(L.at[1]);
    var angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    gLines.append("text")
      .attr("x", lx).attr("y", ly)
      .attr("class", "kodaira-2" + inactive)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(" + angle + ", " + lx + ", " + ly + ")")
      .text(L.text);
  });

  // relabel the x-axis (the y-axis stays c_1^2) and highlight the active switch link
  var xlab = document.getElementById("c2label");
  if (xlab) { xlab.textContent = s.xLabelTeX; window.renderMath(xlab); }
  document.querySelectorAll("#coord-toggle a").forEach(function(a) {
    a.classList.toggle("active-coord", a.dataset.coords === key);
  });
}

// the coordinate-system switcher, shown under the plot
(function() {
  var toggle = document.createElement("p");
  toggle.id = "coord-toggle";
  toggle.innerHTML =
    "coordinates: " +
    "<a href='javascript:void(0)' data-coords='c2-c12'>$(\\mathrm c_2,\\mathrm c_1^2)$</a>" +
    "<a href='javascript:void(0)' data-coords='chi-c12'>$(\\chi,\\mathrm c_1^2)$</a>";
  document.getElementById("table").appendChild(toggle);
  window.renderMath(toggle);
  toggle.querySelectorAll("a").forEach(function(a) {
    a.addEventListener("click", function() { drawCoordinates(a.dataset.coords); });
  });
})();

drawCoordinates("c2-c12");

// assign click event to points
d3.selectAll("circle").on("click", clickedPoint);

function clickedPoint(point) {
  // only act when the clicked node is active (i.e. has the correct Kodaira dimension)
  if (d3.select(this).classed("inactive")) return;

  // make all nodes inactive, then make this one active
  d3.selectAll("circle").classed("active", false);
  d3.select(this).classed("active", true);
  // SVG doesn't have a z-index...
  d3.select(this).moveToFront();

  // remove candidates
  clearCandidates();
  // reset the Hodge diamond
  setInactive();

  // add the coordinates to the legend in the fieldset
  var legend = document.querySelector("#candidates legend");
  legend.innerHTML = "Candidates<br>for $\\mathrm{c}_2=" + point.c2 + "$, $\\mathrm{c}_1^2=" + point.c12 + "$";
  window.renderMath(legend);

  // reflect the selected Chern numbers in the URL (issue #25)
  updateURL(point.kodaira, point.c12, point.c2);

  // look for surfaces with the correct invariants
  var includeNonAlgebraic = document.getElementById("algebraic").checked;
  for (var i = 0; i < surfaces.length; i++) {
    if (surfaces[i].c2 == point.c2 && surfaces[i].c12 == point.c12 && surfaces[i].kodaira == point.kodaira) {
      if (includeNonAlgebraic || surfaces[i].algebraic)
        addCandidateSurface(surfaces[i]);
    }
  }
  window.renderMath(document.querySelector("#candidates ol"));

  // check whether we have found surfaces, otherwise display a message
  var items = document.querySelectorAll("#candidates ol li");
  if (items.length === 0) {
    document.getElementById("candidates").insertAdjacentHTML("afterbegin",
      "<p class='message'>No surfaces in the database with these invariants, sorry.<br>This does not mean that they do not exist, just that we do not have them in our database. If you think you can add one, please <a href='https://github.com/superficie/superficie-algebriche/issues'>open an issue on GitHub</a>.");
  } else if (items.length === 1) {
    items[0].querySelector("a").click();
    items[0].classList.add("active");
  }
}
