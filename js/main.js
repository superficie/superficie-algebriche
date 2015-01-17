var tooltipConfig = 
  {
    "container" : "body",
    "animation" : "false",
    "placement" : function(div, circle) {
      $(div).css({"margin-top" : 8});
      return "right";
    },
    "delay" : { "show" : 200, "hide" : 0 },
    "title" : function() {
      return "$\\mathrm{c}_2=" + $(this).attr("data-c2") + "$, $\\mathrm{c}_1^2=" + $(this).attr("data-c12") + "$";
    }
  };

$(document).ready(function() {
  // we initialise everything on Kodaira dimension -oo
  setKodairaDimension("-1");
  $("input#kodaira").val(-1);

  // smooth scrolling
  $(".scroll").click(function(e) {
    // disable the click
    e.preventDefault();

    // compute the location for the scrolling
    var name = this.href.split("#")[1];
    var target = $("#" + name).offset().top;
    // compensate for header
    target -= 130;

    // execute the scroll
    $("html, body").animate({scrollTop: target}, "slow");

    location.hash = "#" + name;
  });

  // only apply tooltips to currently active nodes
  $("[data-toggle='tooltip']:not(.inactive)").tooltip(tooltipConfig);

  $("[data-toggle='tooltip']").on("shown.bs.tooltip", function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  });

});

// compare two arrays, see http://stackoverflow.com/questions/7837456/comparing-two-arrays-in-javascript
Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length)
    return false;

  for (var i = 0, l=this.length; i < l; i++) {
    // check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      // warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }

  return true;
}
