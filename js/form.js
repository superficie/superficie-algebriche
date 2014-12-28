function setKodairaDimension(value) {
  if (value == -1)
    $("output#kodaira-output").text("$-\\infty$");
  else
    $("output#kodaira-output").text(value);

  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}

$(document).ready(function() {
  setKodairaDimension("-1");
});

