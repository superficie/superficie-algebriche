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
});
