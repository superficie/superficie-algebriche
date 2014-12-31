$(document).ready(function() {
  // we initialise everything on Kodaira dimension -oo
  setKodairaDimension("-1");

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

  $("[data-toggle='tooltip']").tooltip({
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
  });

  $("[data-toggle='tooltip']").on("shown.bs.tooltip", function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  });

});
