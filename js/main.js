$(document).ready(function() {
  // we initialise everything on Kodaira dimension -oo
  setKodairaDimension("-1");

  // smooth scrolling
  $(".scroll").click(function(e) {
    // disable the click
    event.preventDefault();

    // compute the location for the scrolling
    var name = this.href.split("#")[1];
    var target = $("a[name='" + name + "']").offset().top;
    // compensate for header
    target -= 170;

    // execute the scroll
    $("html, body").animate({scrollTop: target}, "slow");

    location.hash = "#" + name;
  });
});
