// Bootstrap 5 tooltips for the currently active points. We dispose and recreate them whenever
// the active set changes (Kodaira dimension / algebraic toggle), mirroring the old jQuery version.
var tooltipInstances = [];

function renderTooltipMath() {
  document.querySelectorAll(".tooltip-inner").forEach(function (inner) { window.renderMath(inner); });
}

function refreshTooltips() {
  tooltipInstances.forEach(function (t) { t.dispose(); });
  tooltipInstances = [];

  document.querySelectorAll("circle[data-bs-toggle='tooltip']:not(.inactive)").forEach(function (el) {
    var tip = new bootstrap.Tooltip(el, {
      container: "body",
      html: true,
      animation: false,
      placement: "right",
      delay: { show: 200, hide: 0 },
      title: function () {
        return "$\\mathrm{c}_2=" + el.getAttribute("data-c2") + "$, $\\mathrm{c}_1^2=" + el.getAttribute("data-c12") + "$";
      }
    });
    // re-render KaTeX inside the tooltip once shown (bound once per element, survives disposes)
    if (!el.dataset.tooltipBound) {
      el.addEventListener("shown.bs.tooltip", renderTooltipMath);
      el.dataset.tooltipBound = "1";
    }
    tooltipInstances.push(tip);
  });
}

// --- URL state (issue #25): pretty paths /<kodaira>/<c2>-<c1^2>/<slug>, e.g. /2/3-12/godeaux-surface ---
// Served on GitHub Pages via the 404.html fallback (see layouts/404.html), which renders the app.

function updateURL(kodaira, c12, c2, slug) {
  var path = "/" + kodaira;
  if (c12 !== null && c12 !== undefined && c2 !== null && c2 !== undefined) {
    path += "/" + c2 + "-" + c12;
    if (slug) path += "/" + slug;
  }
  history.replaceState(null, "", path);
}

function readStateFromURL() {
  // /<kodaira>/<c2>-<c1^2>/<slug> (each numeric value may be negative)
  var withSurface = location.pathname.match(/^\/(-?\d+)\/(-?\d+)-(-?\d+)\/([^\/]+)\/?$/);
  if (withSurface) return { kodaira: withSurface[1], c2: withSurface[2], c12: withSurface[3], slug: decodeURIComponent(withSurface[4]) };
  var point = location.pathname.match(/^\/(-?\d+)\/(-?\d+)-(-?\d+)\/?$/);
  if (point) return { kodaira: point[1], c2: point[2], c12: point[3] };
  var kodairaOnly = location.pathname.match(/^\/(-?\d+)\/?$/);
  if (kodairaOnly) return { kodaira: kodairaOnly[1] };
  return null;
}

// slider handler: set the dimension and reflect it in the URL (clears any selected point)
function onKodairaChange(value) {
  setKodairaDimension(value);
  updateURL(value);
}

// select the point matching (c12, c2) among the active circles by dispatching a click,
// which d3 forwards to clickedPoint together with the bound datum; then, if a slug is given,
// open that specific surface among the candidates
function selectPoint(c12, c2, slug) {
  var el = document.querySelector(
    "circle[data-bs-toggle='tooltip']:not(.inactive)[data-c12='" + c12 + "'][data-c2='" + c2 + "']");
  if (!el) return;
  el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  if (slug) {
    var candidate = document.querySelector("#candidates li[data-slug='" + slug + "'] a");
    if (candidate) candidate.click();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Save the LaTeX source of the invariant cells before KaTeX rewrites their contents.
  document.querySelectorAll("dd[id]").forEach(function (dd) { dd.dataset.latex = dd.textContent.trim(); });

  // Render all static math on the page.
  window.renderMath(document.body);

  // Non-algebraic surfaces toggle (set up before restoring state, which may switch it on).
  var algebraic = document.getElementById("algebraic");
  algebraic.checked = false;
  algebraic.addEventListener("change", function () {
    document.querySelectorAll("circle.nonalgebraic").forEach(function (c) {
      c.style.visibility = algebraic.checked ? "visible" : "hidden";
    });
    // resetting the selection is the easiest way to keep everything consistent
    var kodaira = document.getElementById("kodaira").value;
    setKodairaDimension(kodaira);
    updateURL(kodaira);
  });

  // Smooth scrolling for the in-page navigation links.
  document.querySelectorAll("a.scroll").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = this.getAttribute("href").split("#")[1];
      var target = document.getElementById(id);
      if (!target) return; // link points at another page: let the browser navigate
      e.preventDefault();
      var header = document.getElementById("header");
      var offset = header ? header.offsetHeight + 10 : 0;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    });
  });

  // Restore state from the URL, or default to Kodaira dimension -oo.
  var state = readStateFromURL();
  var kodaira = state ? state.kodaira : "-1";
  document.getElementById("kodaira").value = kodaira;

  // if the linked surface is non-algebraic, switch those on so it appears among the candidates
  if (state && state.slug) {
    var target = surfaces.filter(function (s) {
      return s.slug === state.slug && String(s.kodaira) === String(state.kodaira) &&
        String(s.c2) === String(state.c2) && String(s.c12) === String(state.c12);
    })[0];
    if (target && !target.algebraic) {
      algebraic.checked = true;
      document.querySelectorAll("circle.nonalgebraic").forEach(function (c) { c.style.visibility = "visible"; });
    }
  }

  setKodairaDimension(kodaira);
  if (state && state.c12 !== undefined) selectPoint(state.c12, state.c2, state.slug);
});
