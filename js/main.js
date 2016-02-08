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
      return "$x=" + Math.round(xcoord.invert(this.cx.baseVal.value))
        + "$, $y=" + Math.round(ycoord.invert(this.cy.baseVal.value)) + "$";
    }
  };

CodeMirror.defineSimpleMode("superficie", {
  // The start state contains the rules that are intially used
  start: [
    // The regex matches the token, the token property contains the type
    {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
    // You can match multiple tokens at once. Note that the captured
    // groups must span the whole string in this case
    {regex: /(function)(\s+)([a-z$][\w$]*)/,
     token: ["keyword", null, "variable-2"]},
    // Rules are matched in the order in which they appear, so there is
    // no ambiguity between this one and the one above
    {regex: /(?:function|var|return|if|for|while|else|do|this)\b/,
     token: "keyword"},
    {regex: /(K2|b1|b2|b3|b4|c12|c2|chi|e|h01|h02|h10|h11|h12|h20|h21|kodaira|pa|pg|q|tau)\b/,
     token: "superficie"},
    {regex: /true|false|null|undefined/, token: "atom"},
    {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
     token: "number"},
    {regex: /\/\/.*/, token: "comment"},
    {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},
    // A next property will cause the mode to move to a different state
    {regex: /\/\*/, token: "comment", next: "comment"},
    {regex: /[-+\/*=<>!]+/, token: "operator"},
    // indent and dedent properties guide autoindentation
    {regex: /[\{\[\(]/, indent: true},
    {regex: /[\}\]\)]/, dedent: true},
    {regex: /[a-z$][\w$]*/, token: "variable"},
    // You can embed other modes with the mode property. This rule
    // causes all code between << and >> to be highlighted with the XML
    // mode.
    {regex: /<</, token: "meta", mode: {spec: "xml", end: />>/}}
  ],
  // The multi-line comment state.
  comment: [
    {regex: /.*?\*\//, token: "comment", next: "start"},
    {regex: /.*/, token: "comment"}
  ],
  // The meta property contains global information about the mode. It
  // can contain properties like lineComment, which are supported by
  // all modes, and also directives like dontIndentStates, which are
  // specific to simple modes.
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "//"
  }
});

$(document).ready(function() {
  var projectionArea = CodeMirror.fromTextArea($("#projection").get(0),
      {lineWrapping: true,
       viewportMargin: Infinity,
       mode: "superficie"});
  var constraintsArea = CodeMirror.fromTextArea($("#constraints").get(0),
      {lineWrapping: true,
       viewportMargin: Infinity,
       mode: "superficie"});
  $("#update_projection").click(function () {
    updateProjection(projectionArea.getValue());
  });
  $("#update_constraints").click(function () {
    updateConstraints(constraintsArea.getValue());
  });

  // we parse the projection and constraints
  updateProjection(projectionArea.getValue());
  updateConstraints(constraintsArea.getValue());

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
