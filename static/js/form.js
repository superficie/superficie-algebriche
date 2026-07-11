function updateHodgeDiamond(surface) {
  document.getElementById("h01").textContent = surface.h01;
  document.getElementById("h10").textContent = surface.h10;

  document.getElementById("h20").textContent = surface.h20;
  document.getElementById("h11").textContent = surface.h11;
  document.getElementById("h02").textContent = surface.h02;

  document.getElementById("h21").textContent = surface.h21;
  document.getElementById("h12").textContent = surface.h12;
}

function updateInvariant(el, value) {
  // on the first run we save the LaTeX source somewhere KaTeX cannot mess with it
  if (!el.dataset.latex) el.dataset.latex = el.textContent.trim();

  // the text between the first and second equals sign is what is changed
  var parts = el.dataset.latex.split("=");
  parts[1] = value;

  el.textContent = parts.join("=");
  window.renderMath(el);
}

function updateInvariants(surface) {
  updateInvariant(document.getElementById("b1"), surface.b1);
  updateInvariant(document.getElementById("b2"), surface.b2);
  updateInvariant(document.getElementById("b3"), surface.b3);

  updateInvariant(document.getElementById("e"), surface.e);

  updateInvariant(document.getElementById("q"), surface.h01);

  updateInvariant(document.getElementById("pg"), surface.h02);

  updateInvariant(document.getElementById("pa"), surface.pa);

  updateInvariant(document.getElementById("chi"), surface.chi);

  updateInvariant(document.getElementById("tau"), surface.tau);

  updateInvariant(document.getElementById("c2"), surface.c2);
  updateInvariant(document.getElementById("c12"), surface.c12);

  updateInvariant(document.getElementById("chiTS"), surface.chiTS);
}

d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

function setKodairaDimension(value) {
  var output = document.getElementById("kodaira-output");
  output.textContent = value == -1 ? "$-\\infty$" : value;
  window.renderMath(output);

  // make all nodes inactive
  d3.selectAll("circle").classed("inactive", true);

  // make the nodes of the correct Kodaira dimension active
  var activeNodes = d3.selectAll("circle").filter(function (d) { return d.kodaira == value; });
  activeNodes.classed("inactive", false);
  // SVG doesn't have a z-index so we change the order of elements
  activeNodes.moveToFront();

  // make the inequalities active if Kodaira dimension 2
  document.querySelectorAll("p.kodaira-2").forEach(function (p) { p.classList.toggle("inactive", value != 2); });
  d3.selectAll("text.kodaira-2").classed("inactive", value != 2);

  // remove candidates
  clearCandidates();
  // make the Hodge diamond and invariants shaded
  setInactive();

  // indicate that no Chern numbers have been selected
  noSelectionMessage();

  // make all nodes inactive
  d3.selectAll("circle").classed("active", false);

  // rebuild the tooltips for the currently active nodes
  refreshTooltips();
}

// the state is the value for toggleClass to inactive
function toggleHodgeDiamond(state) {
  document.querySelectorAll("#diamond output:not(.constant)").forEach(function (o) { o.classList.toggle("inactive", state); });

  // if the state is true it means we want to make the Hodge diamond inactive
  if (state)
    ["h01", "h10", "h02", "h11", "h20", "h12", "h21"].forEach(function (id) { document.getElementById(id).textContent = "?"; });
}

// the state is the value for toggleClass to inactive
function toggleInvariants(state) {
  // if the state is true it means we want to make the invariants inactive
  if (state) {
    var invariants = ["b1", "b2", "b3", "e", "q", "pg", "pa", "chi", "tau", "c2", "c12", "chiTS"];

    for (var i = 0; i < invariants.length; i++)
      updateInvariant(document.getElementById(invariants[i]), "{\\color{#dbdbdb}{?}}");
  }
}

// clear candidates
function clearCandidates() {
  var candidates = document.getElementById("candidates");

  // remove the "no pair selected" message
  candidates.querySelectorAll("p").forEach(function (p) { p.remove(); });

  // remove all children in the candidates list
  candidates.querySelector("ol").innerHTML = "";

  // remove the coordinates from the legend in the fieldset
  candidates.querySelector("legend").textContent = "Candidates";
}

// show that no selection of Chern numbers has been made
function noSelectionMessage() {
  document.getElementById("candidates").insertAdjacentHTML("afterbegin", "<p class='message'>No pair of Chern numbers selected.");
}

// add a surface to the candidates list
function addCandidateSurface(surface) {
  var li = document.createElement("li");
  li.dataset.slug = surface.slug;
  var a = document.createElement("a");
  a.href = "javascript:void(0)";
  a.innerHTML = surface.name;
  a.addEventListener("click", function () { loadSurface(li, surface); });
  li.appendChild(a);
  document.querySelector("#candidates ol").appendChild(li);
}

// we make the Hodge diamond and the invariants inactive and empty, and reset the description
function setInactive() {
  toggleHodgeDiamond(true);
  toggleInvariants(true);

  document.getElementById("surface-title").textContent = "About the surface";
  document.getElementById("surface").innerHTML = "<p class='message'>No surface selected.</p>";
  document.getElementById("references-heading").hidden = true;
  document.getElementById("references").innerHTML = "";
}

// render a full citation for a reference key, using the bibliography in references.js when present
function formatCitation(key) {
  var r = (typeof references !== "undefined") ? references[key] : null;
  var link;
  if (key.slice(0, 2) === "MR")
    link = "<a href='https://mathscinet.ams.org/mathscinet-getitem?mr=" + key.slice(2) + "'>" + key + "</a>";
  else if (key.indexOf("10.") === 0) // a DOI
    link = "<a href='https://doi.org/" + key + "'>doi:" + key + "</a>";
  else
    link = "<a href='https://arxiv.org/abs/" + key + "'>arXiv:" + key + "</a>";
  if (!r) return link;
  var s = r.author + ", <em>" + r.title + "</em>";
  if (r.year) s += " (" + r.year + ")";
  if (r.journal) s += ", " + r.journal;
  if (r.volume) s += " <strong>" + r.volume + "</strong>";
  if (r.pages) s += ", " + r.pages[0] + "–" + r.pages[1];
  return s + " [" + link + "]";
}

// load the invariants of a surface
function loadSurface(element, surface) {
  // make the correct list element active
  document.querySelectorAll("#candidates li").forEach(function (li) { li.classList.remove("active"); });
  element.classList.add("active");

  // reflect the selected surface in the URL (issue #25)
  updateURL(surface.kodaira, surface.c12, surface.c2, surface.slug);

  toggleHodgeDiamond(false);
  toggleInvariants(false);
  updateHodgeDiamond(surface);
  updateInvariants(surface);

  // title
  var title = document.getElementById("surface-title");
  title.innerHTML = surface.name;
  window.renderMath(title);

  // description and construction
  var body = "description" in surface ? surface.description : "<p class='message'>No description available.</p>";
  if ("construction" in surface) body += "<h3>Construction</h3>" + surface.construction;
  var surf = document.getElementById("surface");
  surf.innerHTML = body;
  window.renderMath(surf);

  // references
  var heading = document.getElementById("references-heading");
  var refs = document.getElementById("references");
  if ("references" in surface && surface.references.length) {
    var html = "<ul>";
    for (var i = 0; i < surface.references.length; i++)
      html += "<li>" + formatCitation(surface.references[i]) + "</li>";
    refs.innerHTML = html + "</ul>";
    heading.hidden = false;
    window.renderMath(refs);
  } else {
    refs.innerHTML = "";
    heading.hidden = true;
  }
}
