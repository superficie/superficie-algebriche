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
}

$(document).ready(function() {
  setKodairaDimension("-1");
});

