function setKodairaDimension(value) {
  if (value == -1)
    $("output#kodaira-output").text("$-\\infty$");
  else
    $("output#kodaira-output").text(value);

  var className = "kodaira-" + value;
  if (value == -1)
    className = "kodaira-infty";

  console.log(d3.selectAll("circle"));
  d3.selectAll("circle")
    .classed("inactive", true);

  d3.selectAll("circle")
    .filter(function(d, i) { return d[2] == value; })
    .classed("inactive", false);


  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

$(document).ready(function() {
  setKodairaDimension("-1");
});

