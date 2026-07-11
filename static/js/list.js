// Renders the /table/ page: one row per surface in the database (from surfaces.js),
// sortable by any column. Distinct from table.js, which draws the geography scatter plot.
document.addEventListener("DOMContentLoaded", function () {
  var table = document.getElementById("surface-table");
  if (!table || typeof surfaces === "undefined") return;
  var tbody = table.querySelector("tbody");

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

  var COLSPAN = 9; // expand + name + 7 numeric columns

  var html = "";
  rows.forEach(function (s, i) {
    // link back to the graph with this specific surface pre-selected (issue #25)
    var href = "/" + s.kodaira + "/" + s.c2 + "-" + s.c12 + "/" + s.slug;
    // an expandable "+" only for surfaces that carry a description
    var expand = s.description ? "<td class='expand' data-expandable='1'>+</td>" : "<td class='expand'></td>";
    html += "<tr class='" + kodairaClass(s.kodaira) + "' data-idx='" + i + "'>" +
      expand +
      "<td class='name'><a href='" + href + "'>" + s.name + "</a></td>" +
      "<td class='num' data-sort='" + s.kodaira + "'>" + kodairaLabel(s.kodaira) + "</td>" +
      "<td class='num'>" + s.c12 + "</td>" +
      "<td class='num'>" + s.c2 + "</td>" +
      "<td class='num'>" + s.h02 + "</td>" +
      "<td class='num'>" + s.h01 + "</td>" +
      "<td class='num'>" + s.chi + "</td>" +
      "<td class='num'>" + s.chiTS + "</td>" +
      "</tr>";
  });
  tbody.innerHTML = html;

  // tag each row with a search key and whether it is algebraic (via dataset, to avoid escaping)
  var trs = tbody.querySelectorAll("tr");
  trs.forEach(function (tr, i) {
    tr.dataset.search = searchKey(rows[i].name);
    tr.dataset.algebraic = rows[i].algebraic ? "1" : "0";
  });

  window.renderMath(table);
  if (window.Tablesort) new Tablesort(table);

  // --- expand a row to show the surface's description (a full-width detail row underneath) ---
  tbody.addEventListener("click", function (e) {
    var cell = e.target.closest("td.expand[data-expandable]");
    if (!cell) return;
    var tr = cell.parentElement;
    var next = tr.nextElementSibling;
    if (next && next.classList.contains("detail")) {
      next.remove();
      tr.classList.remove("expanded");
      cell.textContent = "+";
    } else {
      var detail = document.createElement("tr");
      detail.className = "detail";
      detail.innerHTML = "<td colspan='" + COLSPAN + "'>" + rows[tr.dataset.idx].description + "</td>";
      tr.after(detail);
      window.renderMath(detail);
      tr.classList.add("expanded");
      cell.textContent = "−";
    }
  });

  // master toggle in the header: expand all visible descriptions at once, or collapse them all
  var master = table.querySelector("thead .expand-all");
  if (master) {
    master.addEventListener("click", function (e) {
      e.stopPropagation(); // don't let Tablesort sort this column
      var expand = master.textContent.trim() === "+";
      tbody.querySelectorAll("td.expand[data-expandable]").forEach(function (cell) {
        var tr = cell.parentElement;
        var hasDetail = tr.nextElementSibling && tr.nextElementSibling.classList.contains("detail");
        if (expand && !hasDetail && tr.style.display !== "none") cell.click();
        else if (!expand && hasDetail) cell.click();
      });
      master.textContent = expand ? "−" : "+";
    });
  }

  // sorting reorders the tbody rows, which would strand detail rows: collapse everything first
  table.addEventListener("beforeSort", function () {
    if (master) master.textContent = "+";
    tbody.querySelectorAll("tr.detail").forEach(function (d) { d.remove(); });
    tbody.querySelectorAll("tr.expanded").forEach(function (r) {
      r.classList.remove("expanded");
      var c = r.querySelector("td.expand[data-expandable]");
      if (c) c.textContent = "+";
    });
  });

  // a row shows iff it matches the search (issue #20) AND is algebraic or the toggle is on;
  // any open detail row follows its parent's visibility
  var search = document.getElementById("surface-search");
  var nonAlgebraic = document.getElementById("include-nonalgebraic");
  function applyFilters() {
    var q = search ? search.value.trim().toLowerCase() : "";
    var showNonAlgebraic = nonAlgebraic ? nonAlgebraic.checked : false;
    trs.forEach(function (tr) {
      var matches = !q || tr.dataset.search.indexOf(q) !== -1;
      var visible = matches && (tr.dataset.algebraic === "1" || showNonAlgebraic);
      tr.style.display = visible ? "" : "none";
      var detail = tr.nextElementSibling;
      if (detail && detail.classList.contains("detail")) detail.style.display = visible ? "" : "none";
    });
  }
  if (search) search.addEventListener("input", applyFilters);
  if (nonAlgebraic) nonAlgebraic.addEventListener("change", applyFilters);
  applyFilters(); // default: hide non-algebraic surfaces
});
