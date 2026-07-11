// Renders the /table/ page: one row per surface in the database (from surfaces.js),
// sortable by any column. Distinct from table.js, which draws the geography scatter plot.
document.addEventListener("DOMContentLoaded", function () {
  var table = document.getElementById("surface-table");
  if (!table || typeof surfaces === "undefined") return;

  function kodairaLabel(k) { return k == -1 ? "−∞" : String(k); } // "−∞" or 0/1/2
  function kodairaClass(k) { return k == -1 ? "kodaira-infty" : "kodaira-" + k; }
  // plain-text form of a surface name for searching (drop HTML, entities and TeX punctuation)
  function searchKey(name) {
    return name.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/gi, " ").replace(/[${}\\]/g, "").toLowerCase();
  }

  // only surfaces that appear as a point in the geography graph, i.e. within its domain (see table.js)
  function inGraph(s) { return s.c2 >= -20 && s.c2 <= 80 && s.c12 >= -30 && s.c12 <= 60; }

  // default order: by Kodaira dimension, then c_1^2, then c_2
  var rows = surfaces.filter(inGraph).sort(function (a, b) {
    return a.kodaira - b.kodaira || a.c12 - b.c12 || a.c2 - b.c2;
  });

  var html = "";
  rows.forEach(function (s) {
    // link back to the graph with this specific surface pre-selected (issue #25)
    var href = "/" + s.kodaira + "/" + s.c2 + "-" + s.c12 + "/" + s.slug;
    html += "<tr class='" + kodairaClass(s.kodaira) + "'>" +
      "<td class='name'><a href='" + href + "'>" + s.name + "</a></td>" +
      "<td class='num' data-sort='" + s.kodaira + "'>" + kodairaLabel(s.kodaira) + "</td>" +
      "<td class='num'>" + s.c12 + "</td>" +
      "<td class='num'>" + s.c2 + "</td>" +
      "<td class='num'>" + s.h02 + "</td>" +
      "<td class='num'>" + s.h01 + "</td>" +
      "<td class='num'>" + s.chi + "</td>" +
      "</tr>";
  });
  table.querySelector("tbody").innerHTML = html;

  // tag each row with a search key and whether it is algebraic (via dataset, to avoid escaping)
  var trs = table.querySelectorAll("tbody tr");
  trs.forEach(function (tr, i) {
    tr.dataset.search = searchKey(rows[i].name);
    tr.dataset.algebraic = rows[i].algebraic ? "1" : "0";
  });

  window.renderMath(table);
  if (window.Tablesort) new Tablesort(table);

  // a row shows iff it matches the search (issue #20) AND is algebraic or the toggle is on
  var search = document.getElementById("surface-search");
  var nonAlgebraic = document.getElementById("include-nonalgebraic");
  function applyFilters() {
    var q = search ? search.value.trim().toLowerCase() : "";
    var showNonAlgebraic = nonAlgebraic ? nonAlgebraic.checked : false;
    trs.forEach(function (tr) {
      var matches = !q || tr.dataset.search.indexOf(q) !== -1;
      var allowed = tr.dataset.algebraic === "1" || showNonAlgebraic;
      tr.style.display = matches && allowed ? "" : "none";
    });
  }
  if (search) search.addEventListener("input", applyFilters);
  if (nonAlgebraic) nonAlgebraic.addEventListener("change", applyFilters);
  applyFilters(); // default: hide non-algebraic surfaces
});
