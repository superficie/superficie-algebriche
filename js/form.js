function updateHodgeDiamond(pg, q, h11) {
  $("output#h20, output#h02").text(pg);
  $("output#h01, output#h10, output#h21, output#h12").text(q);
  $("output#h11").text(h11);
};

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};

function setKodairaDimension(value) {
  if (value == -1)
    $("output#kodaira-output").text("$-\\infty$");
  else
    $("output#kodaira-output").text(value);

  var className = "kodaira-" + value;
  if (value == -1)
    className = "kodaira-infty";

  // make all nodes inactive
  d3.selectAll("circle")
    .classed("inactive", true);

  // make the nodes of the correct Kodaira dimension active
  var activeNodes = d3.selectAll("circle")
    .filter(function(d, i) { return d[2] == value; })
  activeNodes.classed("inactive", false);
  // SVG doesn't have a z-index so we change the order of elements
  activeNodes.moveToFront();

  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
};

// the state is the value for toggleClass to inactive
function toggleHodgeDiamond(state) {
  $("fieldset#diamond output").toggleClass("inactive", state);
};

// the state is the value for toggleClass to inactive
function toggleInvariants(state) {
  $("fieldset#overview output").toggleClass("inactive", state);
};

// add a surface to the candidates list
function addCandidateSurface(surface) {
  $("fieldset#candidates ol").append("<li><a href='#'>" + surface.name).click(function() { loadSurface(surface); });
};

// load the invariants of a surface
function loadSurface(surface) {
  var c12 = surface.c12;
  var c2 = surface.c2;
  var h11 = surface.h11;

  var q = (c12 - 5*c2 + 6*h11) / 12;
  var pg = (c2 + 4*q - h11 - 2 ) / 2;

  toggleHodgeDiamond(false);
  toggleInvariants(false);
  updateHodgeDiamond(pg, q, h11);
}

$(document).ready(function() {
  // we initialise everything on Kodaira dimension -oo
  setKodairaDimension("-1");

  // we make the Hodge diamond and the invariants inactive
  toggleHodgeDiamond(true);
  toggleInvariants(true);
  updateHodgeDiamond("?", "?", "?");
});

