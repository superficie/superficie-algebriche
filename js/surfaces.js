var surfaces = [];

function Surface(name, kodaira, invariants) {
  this.name = name;
  this.kodaira = kodaira;

  this.algebraic = true;

  // the idea is to compute the Hodge numbers based on the input data, as all other invariants are expressed in terms of these
  if (Object.keys(invariants).sort().equals(Array("c12", "c2", "h11"))) {
    this.h11 = invariants.h11;

    // compute Hodge numbers from the input
    this.h01 = (invariants.c12 - 5*invariants.c2 + 6*this.h11) / 12;
    this.h20 = (invariants.c2 + 4*this.h01 - this.h11 - 2 ) / 2;

    // the surface is Kaehler so we have computed everything now
    this.h10 = this.h21 = this.h12 = this.h01;
    this.h02 = this.h20;
  }
  else if (Object.keys(invariants).sort().equals(Array("c12", "pg", "q"))) {
    this.h10 = this.h01 = this.h21 = this.h12 = invariants.q;
    this.h20 = this.h02 = invariants.pg;

    // compute Hodge number from the input
    this.h11 = 10*invariants.pg - 8*invariants.q + 10 - invariants.c12;
  }
  else if (Object.keys(invariants).sort().equals(Array("h01", "h02", "h11"))) {
    this.h11 = invariants.h11;
    this.h02 = invariants.h02;
    this.h01 = invariants.h01;

    // the surface is Kaehler so we have computed everything now
    this.h10 = this.h21 = this.h12 = this.h01;
    this.h20 = this.h02;
  }
  // for non-algebraic surfaces: four Hodge numbers are required
  else if (Object.keys(invariants).sort().equals(Array("h01", "h10", "h11", "h20"))) {
    this.h10 = invariants.h10;
    this.h01 = invariants.h01;
    this.h20 = invariants.h20;
    this.h11 = invariants.h11;

    // via Serre duality
    this.h02 = this.h20;
    this.h21 = this.h01;
    this.h12 = this.h10;

    if (this.h01 != this.h10) {
      this.algebraic = false;
    }
  }
  else {
    console.log("Didn't recognise the input format for the invariants.");
  }

  // Chern numbers
  this.c2 = 2 - this.h10 - this.h01 - this.h21 - this.h12 + this.h02 + this.h11 + this.h20;
  this.c12 = 12 * (this.h02 - this.h01 + 1) - this.c2;

  // Betti numbers
  this.b0 = 1;
  this.b1 = this.h01 + this.h10;
  this.b2 = this.h20 + this.h11 + this.h02;
  this.b3 = this.h21 + this.h21;
  this.b4 = 1;

  // Euler number
  this.e = this.b0 - this.b1 + this.b2 - this.b3 + this.b4;

  // arithmetic genus
  this.pa = this.h02 - this.h01;

  // holomorphic Euler characteristic
  this.chi = this.h02 - this.h01 + 1;

  // signature
  this.tau = 4 * this.chi - this.e;
}

// Kodaira dimension -\infty

var plane = new Surface("projective plane", -1, {c2 : 3, c12 : 9, h11 : 1});
surfaces.push(plane);

var hirzebruch = new Surface("Hirzebruch surfaces", -1, {c2 : 4, c12 : 8, h11 : 2});
hirzebruch.construction = "Ruled surface over $\\mathbb{P}^1$, i.e. it is defined as $\\operatorname{Proj}(\\mathcal{O}_{\\mathbb{P}^1}\\oplus\\mathcal{O}_{\\mathbb{P}^1}(n))$ for some $n\\geq 0$.";
surfaces.push(hirzebruch);

// this can increase whenever we increase the size of the viewport, currently not implemented
for (var g = 1; g < 5; g++) {
  var ruled = new Surface("ruled surfaces", -1, {c2 : 4 - 4*g, c12 : 8 - 8*g, h11 : 2});
  surfaces.push(ruled);
}

// class VII surfaces

var hopf = new Surface("Hopf surfaces", -1, {h10 : 0, h01 : 1, h20 : 0, h11: 0});
hopf.description = "Compact complex surface obtained as a quotient of the complex vector space (with zero deleted) $\\mathbb{C}^2 \\setminus 0$ by a free action of a discrete group.";
surfaces.push(hopf);

var inoue = new Surface("Inoue surfaces", -1, {h10 : 0, h01 : 1, h20 : 0, h11: 0});
inoue.description = "Inoue introduced three families of surfaces, $S^0$, $S^+$ and $S^-$, which are compact quotients of $\\mathbb{C} \\times \\mathbb{H}$ solvable discrete group which acts holomorphically on $\\mathbb{C} \\times \\mathbb{H}$.";
inoue.construction = "See <a href='http://en.wikipedia.org/wiki/Inoue_surface'>wikipedia</a> for a description of the construction.";
surfaces.push(inoue);

// Kodaira dimension 0

var abelian = new Surface("abelian surfaces", 0, {c2 : 0, c12 : 0, h11 : 4});
abelian.description = "Abelian variety of dimension $2$.";
surfaces.push(abelian);

var enriques = new Surface("Enriques surfaces", 0, {c2 : 12, c12 : 0, h11 : 10});
enriques.description = "Algebraic surface such that $\\mathrm{q}=0$ and the canonical line bundle is non-trivial but has trivial square.";
surfaces.push(enriques);

var k3 = new Surface("K3 surfaces", 0, {c2 : 24, c12 : 0, h11 : 20});
k3.description = "Algebraic surface such that $q = 0$ and the canonical bundle is trivial.";
surfaces.push(k3);

var bielliptic = new Surface("bielliptic surfaces", 0, {c2 : 0, c12 : 0, h11 : 2});
bielliptic.description = "Algebraic surface with an elliptic fibration over an elliptic curve.";
surfaces.push(bielliptic);

var complextorus = new Surface("complex tori", 0, {c2 : 0, c12 : 0, h11 : 4});
complextorus.description = "Complex torus of dimension $2$. It is an abelian surface (i.e., algebraic) if and only if it is polarizable.";
complextorus.construction = "Complex tori are complex vector spaces modulo lattices of full rank. In the case of surfaces, they are hence isomorphic to $\\mathbb{C}^{2}/\\Lambda$, for some lattice $\\Lambda \\subset \\mathbb{C}^{2}$ of rank $2$.";
complextorus.algebraic = false;
surfaces.push(complextorus);

var primaryKodaira = new Surface("primary Kodaira surfaces", 0, {h10 : 1, h01 : 2, h20 : 1, h11 : 2});
primaryKodaira.algebraic = false;
surfaces.push(primaryKodaira);

var secondaryKodaira = new Surface("secondary Kodaira surfaces", 0, {h10 : 0, h01 : 1, h20 : 0, h11 : 0});
secondaryKodaira.algebraic = false;
surfaces.push(secondaryKodaira);

// Kodaira dimension 1

for (var g = 2; g <= 5; g++) {
  var ellipticSurfaceProduct = new Surface("products of elliptic curves with curves of genus " + g, 1, {h01: g + 1, h02: g, h11: 2 * (g + 1)});
  surfaces.push(ellipticSurfaceProduct);
}

var dolgachev = new Surface("Dolgachev surface", 1, {h01: 0, h02: 0, h11: 10});
surfaces.push(dolgachev);

var shiodaschutt = new Surface("Shioda-Schütt surface", 1, {h01: 1, h02: 1, h11: 12});
surfaces.push(shiodaschutt);

// Kodaira dimension 2

var fakeproj = new Surface("fake projective planes", 2, {c2 : 3, c12 : 9, h11 : 1});
fakeproj.description = "Algebraic surface with the same Betti numbers as the projective plane (but not isomorphic to it). There are 50 different such surfaces.";
surfaces.push(fakeproj);

var beauville = new Surface("Beauville surfaces", 2, {c2 : 4, c12 : 8, h11 : 2});
beauville.description = "<p>Algebraic surface introduced by Beauville, with the same numerical characteristics as a quadric surface (or Hirzebruch surface). See <em>Complex algebraic surfaces</em>, Arnaud Beauville (1996).";
beauville.construction = "Take two smooth curves $C_1$ and $C_2$ of genus $g_1$ and $g_2$. Let $G$ be a finite group acting on $C_1$ and $C_2$ such that<ul><li>$\\#G=(g_1-1)(g_2-1)$<li>no $g\\in G\\setminus\\{1\\}$ has a fix point on both $C_1$ and $C_2$<li>$C_i/G$ is rational</ul> Then $(C_1\\times C_2)/G$ is a Beauville surface.";
surfaces.push(beauville);

for (var n = 2; n <= 6; n++) {
  var burniat = new Surface("Burniat surfaces", 2, {c2 : 12 - n, c12 : n, h11 : 10 - n});
  burniat.description = "Algebraic surface introduced by Burniat. See <em>Sur les surfaces de genre $P_{12}>1$</em>, Pol Burniat (1966).";
  surfaces.push(burniat);
}

var campedelli = new Surface("Campedelli surface", 2, {c2 : 10, c12 : 2, h11 : 8});
campedelli.description = "Algebraic surface introduced by Campedelli.";
surfaces.push(campedelli);

var catanese = new Surface("Catanese surface", 2, {c2 : 10, c12 : 2, h11 : 8});
catanese.description = "Algebraic surface introduced by Catanese, in <em>Babbage's conjecture, contact of surfaces, symmetric determinantal varieties and applications</em> (1981).";
surfaces.push(catanese);

var godeaux = new Surface("Godeaux surface", 2, {c2 : 11, c12 : 1, h11 : 9});
godeaux.description = "Algebraic surface introduced by Lucien Godeaux.";
surfaces.push(godeaux);

var barlow = new Surface("Barlow surface", 2, {c2 : 11, c12 : 1, h11 : 9});
barlow.description = "Algebraic surface introduced by Rebecca Barlow. See </em>Some new surfaces with $p_{g} = 0$</em>, Rebecca Barlow (1984).";
surfaces.push(barlow);

var fano = new Surface("Fano surfaces", 2, {c2 : 27, c12 : 45, h11 : 25});
fano.description = "These surfaces parametrise lines on a non-singular cubic threefold.";
fano.construction = "Subvariety in the Grassmannian of lines in $\\mathbb{P}^4$ lying on a non-singular cubic threefold.";
surfaces.push(fano);

var chenhacon = new Surface("Chen\&ndash;Hacon surfaces", 2, {c2 : 7, c12 : 5, h11 : 9});
chenhacon.description = "First surface with these invariants constructed in 2006 by J.A.\&nbsp;Chen and C.D.\&nbsp;Hacon. Later, M.\&nbsp;Penegini constructed more examples, and gave a description of the component in the moduli space together with F.\&nbsp;Polizzi.";
chenhacon.construction = "The general construction goes via Tschirnhausen bundles on $(1,2)$-polarized abelian surfaces. Penegini's construction is a product-quotient of two $S_3$-covers of two elliptic curves. For details, see <em>On surfaces with $p_g = q = 2$, $K^2 = 5$ and Albanese map of degree $3$</em>, M.\&nbsp;Penegini and F.\&nbsp;Polizzi (2013).";
chenhacon.references = ["MR2221025", "MR3128997"];
surfaces.push(chenhacon);

var sicilian = new Surface("Sicilian surfaces", 2, {c12: 6, pg: 1, q: 1});
sicilian.description = "There exists an unramified double cover with $q=3$ such that its Albanese morphism is birational onto its image $Z$, such that $Z^3=12$.";
surfaces.push(sicilian);

var schoen = new Surface("Schoen surfaces", 2, {c12: 16, pg: 5, q: 4});
schoen.description = "Algebraic surfaces introduced by Chad Schoen";
surfaces.push(schoen);

for (var c12 = 2; c12 <= 8; c12++) {
  var todorov = new Surface("Todorov surfaces", 2, {c12: c12, pg: 1, q: 0});
  surfaces.push(todorov);
}

var fatighenti = new Surface("Fatighenti surfaces", 2, {c12: 6, pg: 1, q: 0});
surfaces.push(fatighenti);

// remark: Horikawa has computed lots of number of moduli
//
// surfaces *on* the Noether line, classified by Horikawa
for (var pg = 3; pg <= 10; pg++) {
  var horikawa = new Surface("Horikawa surfaces", 2, {c12: 2*pg - 4, pg: pg, q: 0});
  horikawa.references = ["MR0424831"];
  surfaces.push(horikawa);
}

// surfaces *close to* the Noether line, classified by Horikawa
for (var pg = 2; pg <= 10; pg++) {
  // these are "numerical quintic surfaces", and all deformations of the quintic surface, see MR1573789
  if (pg == 4)
    continue;

  var horikawa = new Surface("Horikawa surfaces", 2, {c12: 2*pg - 3, pg: pg, q: 0});
  horikawa.references = ["MR0460340"];
  surfaces.push(horikawa);
}

// surfaces *close to* but a little further away from the Noether line, classified by Horikawa
for (var pg = 2; pg <= 10; pg++) {
  var horikawa = new Surface("Horikawa surfaces", 2, {c12: 2*pg - 2, pg: pg, q: 0});
  horikawa.references = ["MR0517773"];

  // these received a special treatment
  if (pg == 4)
    horikawa.references.push("MR0501370");

  surfaces.push(horikawa);
}

// symmetric squares of curves of genus >= 3
for (var g = 3; g < 6; g++) {
  var h11 = g*g + 1;
  var c2 = h11 + 2 + g*(g-1) - 4*g;
  var c12 = 12 - 12*g + 6*g*(g-1) - c2;

  var square = new Surface("symmetric squares of a curve of genus " + g, 2, {c2 : c2, c12 : c12, h11 : h11});
  if (g == 3)
    square.description = "Together with Catanese–Ciliberto–Mendes Lopes surfaces ($\\mathrm c_1^2 = 8, \\mathrm c_2 = 4$), " +
      "these are the only minimal surfaces of general type with $\\mathrm p_{\\mathrm g} = \\mathrm q = 3$.";
  surfaces.push(square);
}

// products of two curves of genus >= 2
for (var g1 = 2; g1 < 5; g1++) {
  // some (i,j)'s don't show up in the graph, but this is the easiest solution
  for (var g2 = g1; g2 < 9; g2++) {
    var c2 = 4 - 4*(g1+g2) + 4*g1*g2;
    var c12 = 8*g1*g2 - 8*(g1+g2) + 8;
    var h11 = 2*g1*g2 + 2;

    var title = "products of curves of genus " + g1 + " and " + g2;
    if (g1 == g2)
      title = "products of two curves of genus " + g1;

    var product = new Surface(title, 2, {c2 : c2, c12 : c12, h11 : h11});
    product.construction = "Let $C_1$ and $C_2$ be curves of genus $g_1,g_2\\geq 2$. Then $C_1\\times C_2$ is always of general type.";
    product.description = "The numerical invariants are completely determined in terms of $g_1=" + g1 + "$ and $g_2=" + g2 + "$, with $\\mathrm{q}=g_1+g_2$, $\\mathrm{p}_{\\mathrm{g}}=g_1g_2$ and $\\mathrm{h}^{1,1}=2g_1g_2+2$.";
    surfaces.push(product);
  }
}

// complete intersections

// compute c_1^2 of a complete intersection with degrees d
function cic12(d) {
  var c12 = 0;

  for (var i = 0; i < d.length; i++)
    c12 = c12 + d[i];
  c12 = c12 - (d.length + 3);
  c12 = c12 * c12;

  for (var i = 0; i < d.length; i++)
    c12 = c12 * d[i];

  return c12;
}

// compute c_2 of a complete intersection with degrees d
function cic2(d) {
  var c2 = 0;

  c2 = c2 + ((d.length + 3) * (d.length + 2)) / 2;

  for (var i = 0; i < d.length; i++) {
    c2 = c2 - (d.length + 3) * d[i];
    c2 = c2 + d[i] * d[i];
  }

  for (var i = 0; i < d.length; i++) {
    for (var j = i + 1; j < d.length; j++) {
      c2 = c2 + d[i] * d[j];
    }
  }

  for (var i = 0; i < d.length; i++)
    c2 = c2 * d[i];

  return c2;
}

// compute h^{1,1} of a complete intersection with degrees d
function cih11(d) {
  var c12 = cic12(d);
  var c2 = cic2(d);

  var pg = (c12 + c2) / 12 - 1;

  return c2 - 2 - 2 * pg;
}

// I didn't have a clue of how big the c_1^2 and c_2 would get, apparently this list is way bigger than what can be displayed
var degrees = [[5], [6], [7], [8],
               [2, 4], [2, 5], [2, 6], [3, 4], [3, 5], [4, 4],
               [2, 2, 3], [2, 2, 4], [2, 3, 3], [2, 3, 4], [2, 4, 4],
               [2, 2, 2, 2], [2, 2, 2, 3], [2, 2, 2, 4], [2, 2, 3, 3],
               [2, 2, 2, 2, 2]
              ];

for (var i = 0; i < degrees.length; i++) {
  var c12 = cic12(degrees[i]);
  var c2 = cic2(degrees[i]);
  var h11 = cih11(degrees[i]);

  var ci = new Surface("Complete intersection of degree $(" + degrees[i].join(",") + ")$", 2, {c2 : c2, c12 : c12, h11 : h11});
    surfaces.push(ci);
}

var ccm = new Surface("Catanese–Ciliberto–Mendes Lopes surfaces", 2, {c12: 8, pg: 3, q: 3});
ccm.description = "Together with symmetric squares of genus 3 curves ($\\mathrm c_1^2 = 6, \\mathrm c_2 = 6$), " +
  "these are the only minimal surfaces of general type with $\\mathrm p_{\\mathrm g} = \\mathrm q = 3$.";
ccm.construction = "A quotient $(C_2 \\times C_3)/\\tau$ where $C_g$ is a curve of genus $g$ " +
  "and $\\tau$ is an involution of product type acting on $C_2$ as an elliptic involution " +
  "(i.e., with elliptic quotient), and on $C_3$ as a fixed point-free involution.";
ccm.references = ["MR1422597"];
surfaces.push(ccm);

var cm02 = new Surface("Double covers of abelian surfaces ramified in twice the Theta divisor", 2, {c12: 4, pg: 2, q: 2});
cm02.description = "Here the Theta divisor is required is required to be irreducible and the ramification divisor has at most double points.";
cm02.references = ["MR1924760"];
surfaces.push(cm02);

var PePo = new Surface("Penegini–Polizzi surfaces", 2, {c12: 6, pg: 2, q: 2});
PePo.description = "Several families of surfaces with $\\mathrm p_{\\mathrm g} = \\mathrm q = 2$ and $K^2 = 6$. The Albanese morphism is generically finite of degree 2 or 4.";
PePo.references = ["MR3004463", "MR3291798"];
surfaces.push(PePo);

var PiPo = new Surface("Pignatelli–Polizzi surfaces", 2, {c12: 7, pg: 2, q: 2});
PiPo.description = "A family of surfaces whose Albanese morphism is generically finite of degree 3.";
PiPo.references = ["MR3722504"];
surfaces.push(PiPo);

var PPR17 = new Surface("a pair of rigid surfaces whose universal cover is not the bidisk", 2, {c12: 8, pg: 2, q: 2});
PPR17.references = ["1703.10646"];
surfaces.push(PPR17);

var inoue = new Surface("Inoue surfaces", 2, {c12: 48, pg: 10, q: 3});
inoue.references = ["MR1305801"]; // proposition 3.2 to be precise
surfaces.push(inoue);

var nc = [0, 4, 8, 12, 16];
for (var i = 0; i < nc.length; i++) {
  var inoue = new Surface("Inoue surfaces", 2, {c12: 6 - nc[i] / 4, pg: 0, q: 0});
  inoue.references = ["MR1305801"]; // proposition 4.1 to be precise
  surfaces.push(inoue);
}

var n = [0]; // the others are already added, they might be a different family but then they'd need a different name [16, 32];
for (var i = 0; i < n.length; i++) {
  var inoue = new Surface("Inoue surfaces", 2, {c12: 7 - n[i] / 16, pg: 0, q: 0});
  inoue.references = ["MR1305801"]; // page 318 to be precise
  surfaces.push(inoue);
}

var inoue = new Surface("Inoue surfaces", 2, {c12: 8, pg: 0, q: 0});
inoue.references = ["MR1305801"]; // page 319 to be precise
surfaces.push(inoue);

var chenshin = new Surface("Chen-Shin surfaces", 2, {c12: 7, pg: 0, q: 0});
chenshin.references = ["1912.10387"];
surfaces.push(chenshin);

var cataneseciliberto = new Surface("Catanese-Ciliberto surfaces", 2, {c12: 3, pg: 1, q: 1});
cataneseciliberto.references = ["MR2221791"];
surfaces.push(cataneseciliberto);

var oliverio = new Surface("Oliverio surfaces", 2, {c12: 8, pg: 4, q: 0});
oliverio.references = ["MR2168978"];
oliverio.description = "The canonical divisor is divisible by 2, the canonical base locus is empty.";
surfaces.push(oliverio);

for (var c12 = 5; c12 <= 10; c12++) {
  var ciliberto = new Surface("Ciliberto surfaces", 2, {c12: c12, pg: 4, q: 0});
  ciliberto.references = ["MR0610180"];
  surfaces.push(ciliberto);
}

var cfm = new Surface("Ciliberto-Francia-Mendes Lopes surfaces", 2, {c12: 8, pg: 4, q: 0});
cfm.references = ["MR1427708"];
surfaces.push(cfm);
