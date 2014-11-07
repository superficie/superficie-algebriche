var minsurf = {};
minsurf.sliders = {}; // Object containing JQuery objects for the sliders
minsurf.invariants = {
	"kdim" : {
		"text" : "\\kappa",
		"v" : -1, // value
		"min": -1, // minimum value
		"max": 2, // maximum value
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

// This function is called when a slider is moved
// We have to round of the movement to the nearest tick
minsurf.update_invariants = function(i, v) {
	var vs = minsurf.values[i];

	// Calculate the nearest tick on the slider
	var nearest = 0;
	var m = 99999; // infinity
	$.each(vs, function(a, b) {
		if (Math.abs(v - b) < m) {
			m = Math.abs(v - b);
			nearest = b;
		}
	});

	// Add the nearest value to the API query
	var url = "surfapi.php?" + i + "=" + nearest;

	// Add all other locked values to the query
	$.each(minsurf.invariants, function(a, b) {
		if (a != i && b.immutable) {
			url += "&" + a + "=" + b.v;
		}
	});

	// Merge the response with the current state
	// Update the display
	$.getJSON(url, function(data) {
		minsurf.values = data.values;
		minsurf.references = data.references;
		$.each(minsurf.invariants, function(a, b) {
			minsurf.invariants[a].v = data.invariants[a];
		});
		minsurf.update_output();
	});

	// Lock the slider if it was not yet locked
	if (minsurf.invariants[i].immutable === false) {
		toggle_lock(i);
	}

	// Return whether the position of the mouse equals that of the nearest
	// tick
	return (nearest == v);
};

// This function is called when a lock is toggled
// Toggling a lock might change the ticks (possible values) on a slider
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

	// Merge the response with the current state
	// Update the display
	$.getJSON(url, function(data) {
		minsurf.values = data.values;
		minsurf.references = data.references;
		$.each(minsurf.invariants, function(a, b) {
			minsurf.invariants[a].v = data.invariants[a];
		});
		minsurf.update_output();
	});
};

// Update the display math with the values of the invariants
// Update the tick marks for possible values of a slider
// Update the bibliography (#theory)
// Call MathJax on certain DOM items
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
			if (r > -0.2 && r < 100.2) {
				if (r < 0.3) {
					r = 0.3;
				} else if (r > 99.7) {
					r = 99.7;
				}
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

// Toggle the lock icon, and save the state (minsurf.invariants[i].immutable)
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

// Build the slider interface
// The Hodge diamond is hard-coded in the HTML file
// Currently this is done as a table.
// For each row, we make three cells (text, slider, lock)
// Finally, call the refresh function
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
		// Only actually slide the slider if it pulled onto a tick
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
