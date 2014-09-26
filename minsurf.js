var minsurf = {};
minsurf.sliders = {};
minsurf.invariants = {
	"kdim" : {
		"text" : "\\kappa",
		"v" : -1,
		"min": -1,
		"max": 2,
		"immutable" : false
	},
	"pg" : {
		"text" : "p_{g}",
		"v" : 1, // value
		"min" : 0, // minimum value
		"max" : 15, // maximum value (in this app)
		"immutable" : false
	},
	"q" : {
		"text" : "q",
		"v" : 0, // value
		"min" : 0, // minimum value
		"max" : 15, // maximum value (in this app)
		"immutable" : false
	},
	"K2" : {
		"text" : "K^{2}",
		"v" : 0, // value
		"min" : 0, // minimum value
		"max" : 40, // maximum value (in this app)
		"immutable" : false
	},
	"e" : {
		"text" : "e",
		"v" : 24, // value
		"min" : 0, // minimum value
		"max" : 40, // maximum value (in this app)
		"immutable" : false
	},
	"chi" : {
		"text" : "\\chi",
		"v" : 2, // value
		"min" : 0, // minimum value
		"max" : 15, // maximum value (in this app)
		"immutable" : false
	},
	"h11" : {
		"text" : "h^{11}",
		"v" : 20, // value
		"min" : 0, // minimum value
		"max" : 40, // maximum value (in this app)
		"immutable" : false
	}
};
minsurf.values = {};
minsurf.references = [];

minsurf.update_invariants = function(i, v) {
	var vs = minsurf.values[i];
	var nearest = 0;
	var m = 99999;
	$.each(vs, function(a, b) {
		if (Math.abs(v - b) < m) {
			m = Math.abs(v - b);
			nearest = b;
		}
	});
	var url = "surfapi.php?" + i + "=" + nearest;
	$.each(minsurf.invariants, function(a, b) {
		if (a != i && b.immutable) {
			url += "&" + a + "=" + b.v;
		}
	});
	$.getJSON(url, function(data) {
		minsurf.values = data.values;
		minsurf.references = data.references;
		$.each(minsurf.invariants, function(a, b) {
			minsurf.invariants[a].v = data.invariants[a];
		});
		minsurf.update_output();
	});
	if (minsurf.invariants[i].immutable === false) {
		toggle_lock(i);
	}
	return (nearest == v);
};

minsurf.refresh = function() {
	var url = "surfapi.php?";
	var params = "";
	$.each(minsurf.invariants, function(a, b) {
		if (b.immutable) {
			if (params === "") {
				params += a + "=" + b.v;
			} else {
				params += "&" + a + "=" + b.v;
			}
		}
	});
	url += params;
	$.getJSON(url, function(data) {
		minsurf.values = data.values;
		minsurf.references = data.references;
		$.each(minsurf.invariants, function(a, b) {
			minsurf.invariants[a].v = data.invariants[a];
		});
		minsurf.update_output();
	});
};

minsurf.update_output = function() {
	var inv = this.invariants;
	var texlist = "$$ \\begin{align*}";
	$.each(minsurf.sliders, function(i, s) {
		s.slider("value", inv[i].v);
		texlist += inv[i].text + " &= " + inv[i].v + "\\\\";
		var labels = "";
		var vs = minsurf.values[i];
		var min = s.slider("option", "min");
		var max = s.slider("option", "max");
		$.each(vs, function(a,b) {
			var r = (100 * (b - min)/(max - min)).toFixed(1);
			if (r > 1 && r < 99) {
				labels += "<div class='ui-slider-label-ticks' style='left: " + r + "%;'><span>|</span></div>";
			}
		});
		$("#" + i + "_labels").html(labels);
	});
	var reflist = $("<ol>");
	$.each(minsurf.references, function(a,b) {
		reflist.append($("<li>" + b + "</li>"));
	});
	$("#theory").empty().append(reflist);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"theory"]);
	texlist += "\\end{align*} $$";
	$("#values").text(texlist);
	MathJax.Hub.Queue(["Typeset",MathJax.Hub,"values"]);
	$("td.pg").text(inv.pg.v);
	$("td.q").text(inv.q.v);
	$("td.h11").text(inv.h11.v);
};

function toggle_lock(i) {
	var lock = $("#" + i + "_lock");
	if (minsurf.invariants[i].immutable) {
		minsurf.invariants[i].immutable = false;
		lock.removeClass("ui-icon-locked");
		lock.addClass("ui-icon-unlocked");
	} else {
		minsurf.invariants[i].immutable = true;
		lock.removeClass("ui-icon-unlocked");
		lock.addClass("ui-icon-locked");
	}
}

$(function() {
	var slider_box = $("<table width='100%'>");
	$("#input").append(slider_box);
	$.each(minsurf.invariants, function(i,v) {
		var container = $("<tr id='" + i + "_container' class='slider-container'></tr>");
		var text = $("<span class='text'>$" + v.text + "$</span>");
		var lock = $("<span id='" + i + "_lock' class='lock ui-icon ui-icon-unlocked'></span>");
		lock.click( function() { toggle_lock(i); minsurf.refresh(); });
		var slider = $("<div id='" + i + "_slider' class='slider'></div>").slider({
			min: v.min,
			max: v.max,
			step: v.step
		});
		slider.on("slide", function(event, ui) {
			return minsurf.update_invariants(i, ui.value);
		});
		minsurf.sliders[i] = slider;
		var labels_div = $("<div id ='" + i + "_labels' class='slider-labels'></div>");
		slider.append(labels_div);
		container.append($("<td width='2em'>").append(text));
		container.append($("<td>").append(slider));
		container.append($("<td width='1ex'>").append(lock));
		slider_box.append(container);
	});
	minsurf.refresh();
});
