function updateHodgeDiamond(surface) {
  $("output#h01").text(surface.h01);
  $("output#h10").text(surface.h10);

  $("output#h20").text(surface.h20);
  $("output#h11").text(surface.h11);
  $("output#h02").text(surface.h02);

  $("output#h21").text(surface.h21);
  $("output#h12").text(surface.h12);
}

function updateInvariant(element, value) {
  // on the first run we save the LaTeX code for future use in a location that MathJax cannot mess with
  if (!element.data("latex"))
    element.data("latex", element.text());

  // the text between the first and second equals sign is what is changed
  var parts = element.data("latex").split("=");
  parts[1] = value;

  element.text(parts.join("="));
}

function updateInvariants(surface) {
  updateInvariant($("dd#kodaira"), surface.kodaira);
  updateInvariant($("dd#b1"), surface.b1);
  updateInvariant($("dd#b2"), surface.b2);
  updateInvariant($("dd#b3"), surface.b3);

  updateInvariant($("dd#e"), surface.e);

  updateInvariant($("dd#q"), surface.h01);

  updateInvariant($("dd#pg"), surface.h02);

  updateInvariant($("dd#pa"), surface.pa);

  updateInvariant($("dd#chi"), surface.chi);

  updateInvariant($("dd#tau"), surface.tau);

  updateInvariant($("dd#c2"), surface.c2);
  updateInvariant($("dd#c12"), surface.c12);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function updateProjection(projection_contents) {
  eval(projection_contents)
  // scale for the x-axis
  xcoord = d3.scale.linear()
    .domain(xrange)
    .range([0, w]);

  // scale for the y-axis
  ycoord = d3.scale.linear()
    .domain(yrange)
    .range([h, 0]);

  // axis for the x-axis
  xAxis = d3.svg.axis()
    // .tickValues([-10, 0, 10, 20, 30, 40, 50, 60, 70])
    .scale(xcoord);

  // axis for the y-axis
  yAxis = d3.svg.axis()
    .scale(ycoord)
    // .tickValues([-20, -10, 0, 10, 20, 30, 40, 50])
    .orient("left");

  // place axes
  svg.selectAll("#xaxis")
    .attr("transform", "translate(0," + ycoord(0) + ")")
    .call(xAxis);
  svg.selectAll("#yaxis")
    .attr("transform", "translate(" + xcoord(0) + ",0)")
    .call(yAxis);

  // improve origin: remove double 0
  svg.selectAll(".axis g text")
    .filter(function(d) { return d === 0; })
    .style("opacity", function(d, i) { if (i !== 0) return 0; })
    .attr("dx", function(d, i) { if (i === 0) return "-10px"; });

  surface2x = function(d) {
      var c12 = d.c12;
      var c2 = d.c2;
      var e = d.e;
      var pa = d.pa;
      var chi = d.chi;
      var h01 = d.h01;
      var h10 = d.h10;
      var h02 = d.h02;
      var h11 = d.h11;
      var h20 = d.h20;
      var h21 = d.h21;
      var h12 = d.h12;
      var b0 = d.b0;
      var b1 = d.b1;
      var b2 = d.b2;
      var b3 = d.b3;
      var b4 = d.b4;
      var pg = d.pg;
      var q = d.q;
      var tau = d.tau;
      var K2 = d.K2;
      var kodaira = d.kodaira;
      eval(projection_contents);
    return x;
  }
  surface2y = function(d) {
      var c12 = d.c12;
      var c2 = d.c2;
      var e = d.e;
      var pa = d.pa;
      var chi = d.chi;
      var h01 = d.h01;
      var h10 = d.h10;
      var h02 = d.h02;
      var h11 = d.h11;
      var h20 = d.h20;
      var h21 = d.h21;
      var h12 = d.h12;
      var b0 = d.b0;
      var b1 = d.b1;
      var b2 = d.b2;
      var b3 = d.b3;
      var b4 = d.b4;
      var pg = d.pg;
      var q = d.q;
      var tau = d.tau;
      var K2 = d.K2;
      var kodaira = d.kodaira;
      eval(projection_contents);
    return y;
  }
  d3.selectAll("circle")
  .attr("cx", function(d) {return xcoord(surface2x(d)); })
  .attr("cy", function(d) {return ycoord(surface2y(d)); })
}

function updateConstraints(constraints_contents) {
  // make all nodes inactive
  d3.selectAll("circle")
    .classed("inactive", true);

  // at some point use this to move interesting stuff to the front
    // d3.select(this).moveToFront();

  // make the nodes satisfying the constraints active
  var activeNodes = d3.selectAll("circle")
    .filter(function(d) {
      var c12 = d.c12;
      var c2 = d.c2;
      var e = d.e;
      var pa = d.pa;
      var chi = d.chi;
      var h01 = d.h01;
      var h10 = d.h10;
      var h02 = d.h02;
      var h11 = d.h11;
      var h20 = d.h20;
      var h21 = d.h21;
      var h12 = d.h12;
      var b0 = d.b0;
      var b1 = d.b1;
      var b2 = d.b2;
      var b3 = d.b3;
      var b4 = d.b4;
      var pg = d.pg;
      var q = d.q;
      var tau = d.tau;
      var K2 = d.K2;
      var kodaira = d.kodaira;
      eval(constraints_contents);
      return constraint;
    });
  activeNodes.classed("inactive", false);
  // SVG doesn't have a z-index so we change the order of elements
  activeNodes.moveToFront();

  // // make the inequalities active if Kodaira dimension 2
  // $("p.kodaira-2").toggleClass("inactive", value != 2);
  // d3.selectAll("text.kodaira-2").classed("inactive", value != 2);

  // remove candidates
  clearCandidates();
  // make the Hodge diamond and invariants shaded
  setInactive();

  // indicate that no Chern numbers have been selected
  noSelectionMessage();

  // make all nodes inactive
  d3.selectAll("circle").classed("active", false);

  // destroy tooltips for all nodes
  $("[data-toggle='tooltip']").tooltip("destroy");
  // enable tooltips for currently active nodes
  $("[data-toggle='tooltip']:not(.inactive)").tooltip(tooltipConfig);
  $("[data-toggle='tooltip']").on("shown.bs.tooltip", function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  });

  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

// the state is the value for toggleClass to inactive
function toggleHodgeDiamond(state) {
  $("fieldset#diamond output:not(.constant)").toggleClass("inactive", state);

  // if the state is true it means we want to make the Hodge diamond inactive
  if (state)
    $("output#h01, output#h10, output#h02, output#h11, output#h20, output#h12, output#h21").text("?");
}

// the state is the value for toggleClass to inactive
function toggleInvariants(state) {
  $("fieldset#overview output").toggleClass("inactive", state);

  // if the state is true it means we want to make the invariants inactive
  if (state) {
    var invariants = ["kodaira", "b1", "b2", "b3", "e", "q", "pg", "pa", "chi", "tau", "c2", "c12"];

    for (var i = 0; i < invariants.length; i++)
      updateInvariant($("dd#" + invariants[i]), "{\\color{undefined-gray}{?}}");
  }
}

// clear candidates
function clearCandidates() {
  // remove the "no pair selected" message
  $("fieldset#candidates p").remove();

  // remove all children in the candidates list
  $("fieldset#candidates ol").empty();

  // remove the coordinates from the legend in the fieldset
  $("fieldset#candidates legend").text("Candidates");
}

// show that no selection of Chern numbers has been made
function noSelectionMessage() {
  $("fieldset#candidates").prepend("<p class='message'>No pair of Chern numbers selected.");
}

// add a surface to the candidates list
function addCandidateSurface(surface) {
  var link = $("<a href='javascript:void(0)'>" + surface.name + "</a>").click(function(e) { loadSurface($(e.currentTarget).parent(), surface); });
  $("fieldset#candidates ol").append($("<li>").append(link));
}

// we make the Hodge diamond and the invariants inactive and empty, and reset the description
function setInactive() {
  toggleHodgeDiamond(true);
  toggleInvariants(true);

  $("fieldset#surface div").remove();
  $("fieldset#surface").append("<div><p class='message'>No surface selected.</div>");
}

// load the invariants of a surface
function loadSurface(element, surface) {
  // make the correct list element active
  $("fieldset#candidates li").removeClass("active");
  element.toggleClass("active", true);

  toggleHodgeDiamond(false);
  toggleInvariants(false);
  updateHodgeDiamond(surface);
  updateInvariants(surface);

  $("fieldset#surface div").remove();
  if ("description" in surface)
    $("fieldset#surface").append("<div>" + surface.description + "</div>");
  else
    $("fieldset#surface").append("<div><p class='message'>No description available.</div>");

  if ("construction" in surface)
    $("fieldset#surface div").append("<h3>Construction</h3>" + surface.construction);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
