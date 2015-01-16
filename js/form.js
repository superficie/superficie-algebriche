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
  // this is ugly, but the .text() contains a plaintext version, so we look for the first backslash indicating the actual start of the LaTeX...
  var latex = "\\" + element.text().split("\\").slice(1).join("\\");

  // the text between the first and second equals sign is what is changed
  var parts = latex.split("=");
  parts[1] = value;
  // remove the last $ if there is one (this could be prettier...)
  parts[parts.length - 1] = parts[parts.length - 1].trim();
  if (parts[parts.length - 1][parts[parts.length - 1].length - 1] == "$")
    parts[parts.length - 1] = parts[parts.length - 1].slice(0, -1);

  element.text("$" + parts.join("=") + "$");
}

function updateInvariants(surface) {
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
    .filter(function(d) { return d.kodaira == value; });
  activeNodes.classed("inactive", false);
  // SVG doesn't have a z-index so we change the order of elements
  activeNodes.moveToFront();

  // make the inequalities active if Kodaira dimension 2
  $("p.kodaira-2").toggleClass("inactive", value != 2);
  d3.selectAll("text.kodaira-2").classed("inactive", value != 2);

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
    updateHodgeDiamond("?", "?", "?");
}

// the state is the value for toggleClass to inactive
function toggleInvariants(state) {
  $("fieldset#overview output").toggleClass("inactive", state);

  // if the state is true it means we want to make the invariants inactive
  if (state) {
    var invariants = ["b1", "b2", "b3", "e", "q", "pg", "pa", "chi", "tau", "c2", "c12"];

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
