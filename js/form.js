function updateHodgeDiamond(pg, q, h11) {
  $("output#h20, output#h02").text(pg);
  $("output#h01, output#h10, output#h21, output#h12").text(q);
  $("output#h11").text(h11);
};

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

function updateInvariants(pg, q, h11) {
  // Betti numbers
  var b0 = b4 = 1,
      b1 = b3 = 2 * q,
      b2 = 2 * pg + h11;
  updateInvariant($("dd#b1"), b1);
  updateInvariant($("dd#b2"), b2);
  updateInvariant($("dd#b3"), b3);

  // Euler characteristic
  var e = b0 - b1 + b2 - b3 + b4;
  updateInvariant($("dd#e"), e);

  // irregularity
  updateInvariant($("dd#q"), q);

  // geometric genus
  updateInvariant($("dd#pg"), pg);

  // arithmetic genus
  var pa = pg - q;
  updateInvariant($("dd#pa"), pa);

  // holomorphic Euler characteristic
  var chi = pg - q + 1;
  updateInvariant($("dd#chi"), chi);

  // signature
  var tau = 4 * chi - e;
  updateInvariant($("dd#tau"), tau);

  // Chern numbers
  var c2 = e,
      c12 = 12 * chi - e;
  updateInvariant($("dd#c2"), c2);
  updateInvariant($("dd#c12"), c12);

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
    .filter(function(d) { return d.kodaira == value; })
  activeNodes.classed("inactive", false);
  // SVG doesn't have a z-index so we change the order of elements
  activeNodes.moveToFront();

  // make the inequalities active if Kodaira dimension 2
  if (value == 2)
    d3.selectAll("text.kodaira-2").classed("inactive", false);
  else
    d3.selectAll("text.kodaira-2").classed("inactive", true);


  // remove candidates
  clearCandidates();
  // make the Hodge diamond and invariants shaded
  setInactive();

  // indicate that no Chern numbers have been selected
  noSelectionMessage();

  // make all nodes inactive
  d3.selectAll("circle").classed("active", false);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
};

// the state is the value for toggleClass to inactive
function toggleHodgeDiamond(state) {
  $("fieldset#diamond output:not(.constant)").toggleClass("inactive", state);

  // if the state is true it means we want to make the Hodge diamond inactive
  if (state)
    updateHodgeDiamond("?", "?", "?");
};

// the state is the value for toggleClass to inactive
function toggleInvariants(state) {
  $("fieldset#overview output").toggleClass("inactive", state);

  // if the state is true it means we want to make the invariants inactive
  if (state) {
    var invariants = ["b1", "b2", "b3", "e", "q", "pg", "pa", "chi", "tau", "c2", "c12"];

    for (var i = 0; i < invariants.length; i++)
      updateInvariant($("dd#" + invariants[i]), "{\\color{undefined-gray}{?}}");
  }
};

// clear candidates
function clearCandidates() {
  // remove the "no pair selected" message
  $("fieldset#candidates p").remove();

  // remove all children in the candidates list
  $("fieldset#candidates ol").empty();

  // remove the coordinates from the legend in the fieldset
  $("fieldset#candidates legend").text("Candidates");
};

// show that no selection of Chern numbers has been made
function noSelectionMessage() {
  $("fieldset#candidates").prepend("<p class='message'>No pair of Chern numbers selected.");
};

// add a surface to the candidates list
function addCandidateSurface(surface) {
  var link = $("<a href='#'>" + surface.name + "</a>").click(function(e) { loadSurface($(e.toElement).parent(), surface); });
  $("fieldset#candidates ol").append($("<li>").append(link));
};

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

  var c12 = surface.c12;
  var c2 = surface.c2;
  var h11 = surface.h11;

  var q = (c12 - 5*c2 + 6*h11) / 12;
  var pg = (c2 + 4*q - h11 - 2 ) / 2;

  toggleHodgeDiamond(false);
  toggleInvariants(false);
  updateHodgeDiamond(pg, q, h11);
  updateInvariants(pg, q, h11);

  $("fieldset#surface div").remove();
  if ("description" in surface)
    $("fieldset#surface").append("<div>" + surface.description + "</div>");
  else
    $("fieldset#surface").append("<div><p class='message'>No description available.</div>");

  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
