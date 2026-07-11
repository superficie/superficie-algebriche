var surfaces = [];

// true iff the invariants object has exactly these keys (used to pick the input format)
function invariantsAre(invariants, keys) {
  var actual = Object.keys(invariants).sort();
  keys = keys.slice().sort();
  return actual.length === keys.length && actual.every(function (k, i) { return k === keys[i]; });
}

function Surface(name, kodaira, invariants) {
  this.name = name;
  this.kodaira = kodaira;

  this.algebraic = true;

  // the idea is to compute the Hodge numbers based on the input data, as all other invariants are expressed in terms of these
  if (invariantsAre(invariants, ["c12", "c2", "h11"])) {
    this.h11 = invariants.h11;

    // compute Hodge numbers from the input
    this.h01 = (invariants.c12 - 5*invariants.c2 + 6*this.h11) / 12;
    this.h20 = (invariants.c2 + 4*this.h01 - this.h11 - 2 ) / 2;

    // the surface is Kaehler so we have computed everything now
    this.h10 = this.h21 = this.h12 = this.h01;
    this.h02 = this.h20;
  }
  else if (invariantsAre(invariants, ["c12", "pg", "q"])) {
    this.h10 = this.h01 = this.h21 = this.h12 = invariants.q;
    this.h20 = this.h02 = invariants.pg;

    // compute Hodge number from the input
    this.h11 = 10*invariants.pg - 8*invariants.q + 10 - invariants.c12;
  }
  else if (invariantsAre(invariants, ["h01", "h02", "h11"])) {
    this.h11 = invariants.h11;
    this.h02 = invariants.h02;
    this.h01 = invariants.h01;

    // the surface is Kaehler so we have computed everything now
    this.h10 = this.h21 = this.h12 = this.h01;
    this.h20 = this.h02;
  }
  // for non-algebraic surfaces: four Hodge numbers are required
  else if (invariantsAre(invariants, ["h01", "h10", "h11", "h20"])) {
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

  // holomorphic Euler characteristic of the tangent bundle, by Riemann-Roch:
  // chi(T_S) = 2 c_1^2 - 10 chi(O_S) = (7 c_1^2 - 5 c_2) / 6
  this.chiTS = 2 * this.c12 - 10 * this.chi;

  // signature
  this.tau = 4 * this.chi - this.e;
}

// Kodaira dimension -\infty

var plane = new Surface("projective planes", -1, {c2 : 3, c12 : 9, h11 : 1});
plane.description = "The projective plane $\\mathbb{P}^2$.";
surfaces.push(plane);

var hirzebruch = new Surface("Hirzebruch surfaces", -1, {c2 : 4, c12 : 8, h11 : 2});
hirzebruch.construction = "Ruled surface over $\\mathbb{P}^1$, i.e. it is defined as $\\operatorname{Proj}(\\mathcal{O}_{\\mathbb{P}^1}\\oplus\\mathcal{O}_{\\mathbb{P}^1}(n))$ for some $n\\geq 0$.";
hirzebruch.description = "The rational ruled surfaces $\\mathbb{F}_n$ over $\\mathbb{P}^1$. Every minimal rational surface other than $\\mathbb{P}^2$ is some $\\mathbb{F}_n$ with $n\\neq 1$; here $\\mathbb{F}_0=\\mathbb{P}^1\\times\\mathbb{P}^1$, while $\\mathbb{F}_1$ is the blow-up of $\\mathbb{P}^2$ at a point.";
surfaces.push(hirzebruch);

// this can increase whenever we increase the size of the viewport, currently not implemented
for (var g = 1; g < 5; g++) {
  var ruled = new Surface("ruled surfaces", -1, {c2 : 4 - 4*g, c12 : 8 - 8*g, h11 : 2});
  ruled.description = "A geometrically ruled surface $\\mathbb{P}(E)\\to C$ over a smooth curve $C$ of genus $" + g + "$, i.e. a $\\mathbb{P}^1$-bundle, with irregularity $\\mathrm q=" + g + "$.";
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

// class VII surfaces with positive second Betti number (non-Kähler, Kodaira dimension -infty):
// h^{1,1}=b_2=n, so (c_2, c_1^2) = (n, -n). Kato surfaces (those with a global spherical shell)
// realise every n>=1; Enoki and Inoue-Hirzebruch surfaces are examples.
for (var n = 1; n <= 30; n++) {
  var kato = new Surface("Kato surfaces", -1, {h10: 0, h01: 1, h20: 0, h11: n});
  kato.description = "Class VII surface with second Betti number $\\mathrm b_2=" + n + ">0$ that admits a global spherical shell. Examples include Enoki surfaces and Inoue&ndash;Hirzebruch surfaces; conjecturally these exhaust the class VII surfaces with $\\mathrm b_2>0$.";
  kato.references = ["MR0768987", "MR2030225"];
  surfaces.push(kato);
}

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
primaryKodaira.description = "Non-Kähler compact complex surface with trivial canonical bundle and $\\mathrm b_1=3$, hence of Kodaira dimension $0$. It is a holomorphic principal bundle of elliptic curves over an elliptic curve.";
primaryKodaira.construction = "A quotient of $\\mathbb{C}^2$ by a discrete group of affine transformations acting freely and properly discontinuously.";
primaryKodaira.references = ["MR2030225"];
surfaces.push(primaryKodaira);

var secondaryKodaira = new Surface("secondary Kodaira surfaces", 0, {h10 : 0, h01 : 1, h20 : 0, h11 : 0});
secondaryKodaira.algebraic = false;
secondaryKodaira.description = "Non-Kähler compact complex surface with $\\mathrm b_1=1$ and Kodaira dimension $0$, obtained as a free quotient of a primary Kodaira surface by a finite cyclic group.";
secondaryKodaira.references = ["MR2030225"];
surfaces.push(secondaryKodaira);

// Kodaira dimension 1

for (var g = 2; g <= 5; g++) {
  var ellipticSurfaceProduct = new Surface("products of elliptic curves with curves of genus " + g, 1, {h01: g + 1, h02: g, h11: 2 * (g + 1)});
  ellipticSurfaceProduct.construction = "The product $E\\times C$ of an elliptic curve $E$ and a curve $C$ of genus $" + g + "$.";
  ellipticSurfaceProduct.description = "Isotrivially fibred surface of Kodaira dimension $1$, with $\\mathrm q=" + (g + 1) + "$, $\\mathrm p_{\\mathrm g}=" + g + "$ and $\\chi=0$.";
  surfaces.push(ellipticSurfaceProduct);
}

var dolgachev = new Surface("Dolgachev surfaces", 1, {h01: 0, h02: 0, h11: 10});
dolgachev.description = "Simply connected minimal properly elliptic surface with $\\mathrm p_{\\mathrm g}=\\mathrm q=0$. The surfaces $E(1)_{2,3}$ were the first examples of $4$-manifolds homeomorphic, but not diffeomorphic, to a rational surface.";
dolgachev.construction = "Perform two logarithmic transformations, of coprime multiplicities (for instance $2$ and $3$), on a rational elliptic surface (a generic pencil of plane cubics, blown up at its nine base points).";
dolgachev.references = ["MR2757651", "MR0892034"];
surfaces.push(dolgachev);

var shiodaschutt = new Surface("Shioda-Schütt surfaces", 1, {h01: 1, h02: 1, h11: 12});
surfaces.push(shiodaschutt);

// Simply connected minimal elliptic surfaces E(n) over P^1 with a section, with chi(O)=n and no
// multiple fibres: e=12n, K^2=0, p_g=n-1, q=0. E(1) is rational, E(2) is a K3, E(n>=3) has
// Kodaira dimension 1. Invariants (chi=n, e=12n) are standard; see Schütt-Shioda, "Elliptic surfaces".
for (var n = 3; n <= 6; n++) {
  var en = new Surface("elliptic surface $\\mathrm{E}(" + n + ")$", 1, {h01: 0, h02: n - 1, h11: 10 * n});
  en.description = "Simply connected relatively minimal elliptic surface over $\\mathbb{P}^1$ with a section and $\\chi(\\mathcal{O})=" + n + "$; here $\\mathrm p_{\\mathrm g}=" + (n - 1) + "$, $\\mathrm q=0$ and $\\mathrm K^2=0$.";
  en.construction = "The fibre-connected sum of $" + n + "$ copies of the rational elliptic surface $\\mathrm{E}(1)$; equivalently a generic elliptic surface over $\\mathbb{P}^1$ with $" + (12 * n) + "$ nodal fibres.";
  en.references = ["MR2732092"];
  surfaces.push(en);
}

// logarithmic transform of the elliptic K3 surface E(2), a chi=2 analogue of the Dolgachev surface
var e2pq = new Surface("elliptic surfaces $\\mathrm{E}(2)_{p,q}$", 1, {h01: 0, h02: 1, h11: 20});
e2pq.description = "A logarithmic transform, of coprime multiplicities $p$ and $q$, of the elliptic K3 surface $\\mathrm{E}(2)$; a minimal properly elliptic surface with $\\chi=2$, simply connected when $\\gcd(p,q)=1$. Its Hodge numbers coincide with those of a K3, but its Kodaira dimension is $1$.";
e2pq.references = ["MR2732092", "MR2030225"];
surfaces.push(e2pq);

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

var campedelli = new Surface("Campedelli surfaces", 2, {c2 : 10, c12 : 2, h11 : 8});
campedelli.description = "Algebraic surface introduced by Campedelli.";
surfaces.push(campedelli);

var catanese = new Surface("Catanese surfaces", 2, {c2 : 10, c12 : 2, h11 : 8});
catanese.description = "Algebraic surface introduced by Catanese, in <em>Babbage's conjecture, contact of surfaces, symmetric determinantal varieties and applications</em> (1981).";
surfaces.push(catanese);

var godeaux = new Surface("Godeaux surfaces", 2, {c2 : 11, c12 : 1, h11 : 9});
godeaux.description = "Algebraic surface introduced by Lucien Godeaux.";
surfaces.push(godeaux);

var barlow = new Surface("Barlow surfaces", 2, {c2 : 11, c12 : 1, h11 : 9});
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
  todorov.description = "Surfaces of general type with $\\mathrm p_{\\mathrm g}=1$, $\\mathrm q=0$ and $2\\leq\\mathrm K^2\\leq 8$, giving counterexamples to the global Torelli theorem.";
  todorov.references = ["MR0610540"];
  surfaces.push(todorov);
}

var fatighenti = new Surface("Fatighenti surfaces", 2, {c12: 6, pg: 1, q: 0});
fatighenti.description = "Surfaces of general type with $\\mathrm p_{\\mathrm g}=1$, $\\mathrm q=0$ and $\\mathrm K^2=6$, constructed by Fatighenti as zero loci of homogeneous vector bundles on Grassmannians.";
surfaces.push(fatighenti);

// Special surface with p_g = K^2 = 1 (hence q = 0, chi = 2, c_2 = 23); invariants stated in
// Catanese, Compositio Math. 41 (1980), 401-414 (surfaces with K^2 = p_g = 1).
var kunev = new Surface("Kunev surfaces", 2, {c12: 1, pg: 1, q: 0});
kunev.description = "A special surface of general type with $\\mathrm p_{\\mathrm g}=\\mathrm K^2=1$ (hence $\\mathrm q=0$) whose bicanonical map is a Galois $(\\mathbb{Z}/2)^2$-cover of $\\mathbb{P}^2$. It is a counterexample to the infinitesimal Torelli theorem, and its family gives a counterexample to the generic global Torelli theorem.";
kunev.references = ["MR0589089"];
surfaces.push(kunev);

// remark: Horikawa has computed lots of number of moduli
//
// surfaces *on* the Noether line, classified by Horikawa
for (var pg = 3; pg <= 10; pg++) {
  var horikawa = new Surface("Horikawa surfaces", 2, {c12: 2*pg - 4, pg: pg, q: 0});
  horikawa.description = "Minimal surface of general type on the Noether line $\\mathrm K^2=2\\mathrm p_{\\mathrm g}-4$ (equality in Noether's inequality), with $\\mathrm p_{\\mathrm g}=" + pg + "$ and $\\mathrm K^2=" + (2*pg - 4) + "$; classified by Horikawa.";
  horikawa.references = ["MR0424831"];
  surfaces.push(horikawa);
}

// surfaces *close to* the Noether line, classified by Horikawa
for (var pg = 2; pg <= 10; pg++) {
  // these are "numerical quintic surfaces", and all deformations of the quintic surface, see MR1573789
  if (pg == 4)
    continue;

  var horikawa = new Surface("Horikawa surfaces", 2, {c12: 2*pg - 3, pg: pg, q: 0});
  horikawa.description = "Minimal surface of general type just above the Noether line, with $\\mathrm K^2=2\\mathrm p_{\\mathrm g}-3$; here $\\mathrm p_{\\mathrm g}=" + pg + "$ and $\\mathrm K^2=" + (2*pg - 3) + "$. Classified by Horikawa.";
  horikawa.references = ["MR0460340"];
  surfaces.push(horikawa);
}

// surfaces *close to* but a little further away from the Noether line, classified by Horikawa
for (var pg = 2; pg <= 10; pg++) {
  var horikawa = new Surface("Horikawa surfaces", 2, {c12: 2*pg - 2, pg: pg, q: 0});
  horikawa.description = "Minimal surface of general type close to the Noether line, with $\\mathrm K^2=2\\mathrm p_{\\mathrm g}-2$; here $\\mathrm p_{\\mathrm g}=" + pg + "$ and $\\mathrm K^2=" + (2*pg - 2) + "$. Classified by Horikawa.";
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

  var square = new Surface("symmetric squares of curves of genus " + g, 2, {c2 : c2, c12 : c12, h11 : h11});
  if (g == 3)
    square.description = "Together with Catanese–Ciliberto–Mendes Lopes surfaces ($\\mathrm c_1^2 = 8, \\mathrm c_2 = 4$), " +
      "these are the only minimal surfaces of general type with $\\mathrm p_{\\mathrm g} = \\mathrm q = 3$.";
  else
    square.description = "The symmetric square $C^{(2)}=\\mathrm{Sym}^2 C$ of a smooth curve $C$ of genus $" + g + "$, the surface parametrising effective divisors of degree $2$ on $C$; a minimal surface of general type with $\\mathrm q=" + g + "$.";
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

  var ci = new Surface("Complete intersections of degree $(" + degrees[i].join(",") + ")$", 2, {c2 : c2, c12 : c12, h11 : h11});
  ci.description = "A smooth complete intersection surface of multidegree $(" + degrees[i].join(",") + ")$ in $\\mathbb{P}^{" + (degrees[i].length + 2) + "}$; such surfaces are simply connected and regular ($\\mathrm q=0$).";
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
PPR17.description = "A pair of rigid surfaces of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=2$ and $\\mathrm K^2=8$ whose universal cover is not the bidisk, unlike the surfaces isogenous to a product with the same invariants.";
PPR17.references = ["MR4123110"];
surfaces.push(PPR17);

var inoue = new Surface("Inoue surfaces", 2, {c12: 48, pg: 10, q: 3});
inoue.description = "A surface of general type with $\\mathrm p_{\\mathrm g}=10$, $\\mathrm q=3$ and $\\mathrm K^2=48$, from M.\&nbsp;Inoue's constructions of new surfaces of general type.";
inoue.references = ["MR1305801"]; // proposition 3.2 to be precise
surfaces.push(inoue);

var nc = [0, 4, 8, 12, 16];
for (var i = 0; i < nc.length; i++) {
  var inoue = new Surface("Inoue surfaces", 2, {c12: 6 - nc[i] / 4, pg: 0, q: 0});
  inoue.description = "A surface of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=0$ and $\\mathrm K^2=" + (6 - nc[i] / 4) + "$, from M.\&nbsp;Inoue's constructions of new surfaces of general type.";
  inoue.references = ["MR1305801"]; // proposition 4.1 to be precise
  surfaces.push(inoue);
}

var n = [0]; // the others are already added, they might be a different family but then they'd need a different name [16, 32];
for (var i = 0; i < n.length; i++) {
  var inoue = new Surface("Inoue surfaces", 2, {c12: 7 - n[i] / 16, pg: 0, q: 0});
  inoue.description = "A surface of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=0$ and $\\mathrm K^2=" + (7 - n[i] / 16) + "$, from M.\&nbsp;Inoue's constructions of new surfaces of general type.";
  inoue.references = ["MR1305801"]; // page 318 to be precise
  surfaces.push(inoue);
}

var inoue = new Surface("Inoue surfaces", 2, {c12: 8, pg: 0, q: 0});
inoue.description = "A surface of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=0$ and $\\mathrm K^2=8$, from M.\&nbsp;Inoue's constructions of new surfaces of general type.";
inoue.references = ["MR1305801"]; // page 319 to be precise
surfaces.push(inoue);

var chenshin = new Surface("Chen-Shin surfaces", 2, {c12: 7, pg: 0, q: 0});
chenshin.description = "A two-dimensional family of surfaces of general type with $\\mathrm p_{\\mathrm g}=0$ and $\\mathrm K^2=7$.";
chenshin.references = ["MR4199271"];
surfaces.push(chenshin);

var cataneseciliberto = new Surface("Catanese-Ciliberto surfaces", 2, {c12: 3, pg: 1, q: 1});
cataneseciliberto.description = "Surfaces of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=3$ whose Albanese fibration has genus-$3$ fibres.";
cataneseciliberto.references = ["MR1211993", "MR2221791"];
surfaces.push(cataneseciliberto);

// pg=q=1 surfaces are the irregular surfaces of general type with the smallest chi (=1); they exist
// for 2 <= K^2 <= 9. K^2=4 examples (Albanese fibre genus 3 or 4) constructed by Ling.
var pgq1k4 = new Surface("surfaces with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=4$", 2, {c12: 4, pg: 1, q: 1});
pgq1k4.description = "Minimal surfaces of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=4$, whose Albanese map is a fibration with fibres of genus $3$ or (non-hyperelliptic) genus $4$.";
pgq1k4.references = ["1709.03056", "1711.10650"];
surfaces.push(pgq1k4);

// pg=q=1 isogenous to a product: free quotients (C x F)/G, hence K^2 = 8 chi = 8; classified by
// Carnovale-Polizzi (arXiv:0704.0446).
var pgq1iso = new Surface("surfaces with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ isogenous to a product", 2, {c12: 8, pg: 1, q: 1});
pgq1iso.description = "Surfaces of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ that are isogenous to a product, hence have $\\mathrm K^2=8$.";
pgq1iso.construction = "A free quotient $(C\\times F)/G$ of a product of two smooth curves of genus $\\geq 2$ by a finite group $G$.";
pgq1iso.references = ["0704.0446"];
surfaces.push(pgq1iso);

var oliverio = new Surface("Oliverio surfaces", 2, {c12: 8, pg: 4, q: 0});
oliverio.references = ["MR2168978"];
oliverio.description = "The canonical divisor is divisible by 2, the canonical base locus is empty.";
surfaces.push(oliverio);

for (var c12 = 5; c12 <= 10; c12++) {
  var ciliberto = new Surface("Ciliberto surfaces", 2, {c12: c12, pg: 4, q: 0});
  ciliberto.description = "Canonical surfaces with $\\mathrm p_{\\mathrm g}=\\mathrm p_{\\mathrm a}=4$ and $5\\leq\\mathrm K^2\\leq 10$.";
  ciliberto.references = ["MR0610180"];
  surfaces.push(ciliberto);
}

var cfm = new Surface("Ciliberto-Francia-Mendes Lopes surfaces", 2, {c12: 8, pg: 4, q: 0});
cfm.description = "Surfaces of general type with $\\mathrm p_{\\mathrm g}=4$, $\\mathrm q=0$ and $\\mathrm K^2=8$, appearing in Ciliberto, Francia and Mendes Lopes's study of when the bicanonical map fails to be birational.";
cfm.references = ["MR1427708"];
surfaces.push(cfm);

var bartalesicatanese = new Surface("Bartalesi-Catanese surfaces", 2, {c12: 6, pg: 4, q: 0});
bartalesicatanese.description = "Surfaces of general type with $\\mathrm K^2=6$ and nontrivial torsion, constructed by Bartalesi and Catanese.";
bartalesicatanese.references = ["MR0908914"]
surfaces.push(bartalesicatanese);

for (var c12 = 1; c12 <= 4; c12++) {
  var keumnaie = new Surface("Keum-Naie surfaces", 2, {c12: c12, pg: 0, q: 0});
  keumnaie.description = "Double covers of nodal Enriques surfaces.";
  keumnaie.references = ["MR1259462", "MR2782171"];
  surfaces.push(keumnaie);
}

for (var a = 1; a <= 20; a++) {
  var beauville = new Surface("Beauville's double covers of $C\\times\\mathbb{P}^1$ with $C$ of genus 2", 2, {c12: 8*a, pg: a + 1, q: 2});
  beauville.description = "A family (indexed by $a=" + a + "$) of surfaces of general type with $\\mathrm q=2$, $\\mathrm p_{\\mathrm g}=" + (a + 1) + "$ and $\\mathrm K^2=" + (8*a) + "$, constructed by Beauville as double covers of $C\\times\\mathbb{P}^1$ (with $C$ of genus $2$) in his study of the canonical map.";
  beauville.references = ["MR0553705"]; // section 2.4
  surfaces.push(beauville);
}

for (var a = 2; a <= 20; a++) {
  var beauville = new Surface("Beauville's double covers of bielliptic surfaces of type $\\mathbb{Z}/2\\mathbb{Z}^{\\oplus2}$", 2, {c12: 4*a, pg: a, q: 1});
  beauville.description = "A family (indexed by $a=" + a + "$) of surfaces of general type with $\\mathrm q=1$, $\\mathrm p_{\\mathrm g}=" + a + "$ and $\\mathrm K^2=" + (4*a) + "$, constructed by Beauville as double covers of bielliptic surfaces in his study of the canonical map.";
  beauville.references = ["MR0553705"]; // section 2.6
  surfaces.push(beauville);
}

for (var a = 2; a <= 20; a++) {
  var beauville = new Surface("Beauville's double covers of $C\\times\\mathbb{P}^1$ with $C$ non-hyperelliptic of genus 3", 2, {c12: 16*a, pg: 2*a+2, q: 3});
  beauville.description = "A family (indexed by $a=" + a + "$) of surfaces of general type with $\\mathrm q=3$, $\\mathrm p_{\\mathrm g}=" + (2*a + 2) + "$ and $\\mathrm K^2=" + (16*a) + "$, constructed by Beauville as double covers of $C\\times\\mathbb{P}^1$ (with $C$ non-hyperelliptic of genus $3$) in his study of the canonical map.";
  beauville.references = ["MR0553705"]; // section 4.3
  surfaces.push(beauville);
}

for (var a = 2; a <= 20; a++) {
  var beauville = new Surface("Beauville's double covers of $C\\times\\mathbb{P}^1$ with $C$ of genus 2", 2, {c12: 12*a, pg: 2*a+2, q: 2});
  beauville.description = "A family (indexed by $a=" + a + "$) of surfaces of general type with $\\mathrm q=2$, $\\mathrm p_{\\mathrm g}=" + (2*a + 2) + "$ and $\\mathrm K^2=" + (12*a) + "$, constructed by Beauville as double covers of $C\\times\\mathbb{P}^1$ (with $C$ of genus $2$) in his study of the canonical map.";
  beauville.references = ["MR0553705"]; // section 4.4
  surfaces.push(beauville);
}

var rito = new Surface("Rito surfaces", 2, {c12: 24, pg: 3, q: 0});
rito.construction = "Degree 24 cover of $\\mathbb{P}^2$";
rito.description = "The maximal degree of the canonical morphism in case $q=0$ would be 36, here it is 24.";
rito.references = ["MR3663791"];
surfaces.push(rito);

var rito = new Surface("Rito surfaces", 2, {c12: 16, pg: 3, q: 2});
rito.description = "The maximal degree of the canonical morphism in case $q=2$ would be 18, here it is 16.";
rito.references = ["MR3619737"];
surfaces.push(rito);

var bin = new Surface("Bin surfaces", 2, {c12: 32, pg: 4, q: 1});
bin.description = "A surface of general type whose canonical map has degree $16$.";
bin.references = ["MR4008073"];
surfaces.push(bin);

for (var h = 1; h <= 10; h++) {
  var ciliberto = new Surface("Ciliberto surfaces", 2, {c12: 8*h - 4, pg: 2*h, q: 0});
  ciliberto.description = "A family (indexed by $h=" + h + "$) of surfaces of general type with $\\mathrm q=0$, $\\mathrm p_{\\mathrm g}=" + (2*h) + "$ and $\\mathrm K^2=" + (8*h - 4) + "$, arising as examples in Ciliberto's study of the generators of the canonical ring.";
  ciliberto.references = ["MR0778862"]; // esempio 4.3 to be precise
  surfaces.push(ciliberto);
}

var bf = new Surface("Borisov-Fatighenti surfaces", 2, {c12: 3, pg: 0, q: 0});
bf.description = "A surface of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=0$ and $\\mathrm K^2=3$, obtained by Borisov and Fatighenti through new explicit constructions.";
bf.references = ["MR5022119"];
surfaces.push(bf);

for (var n = 8; n <= 20; n = n + 2) {
  if (n % 3 == 0)
    continue;

  var bp = new Surface("Rigid Bauer&ndash;Pignatelli surfaces", 2, {c12: 2*Math.pow(n-3, 2), pg: (n/2 - 2) * (n/2 - 1), q: 0});
  bp.description = "Surfaces of general type that are rigid, i.e. admit no nontrivial deformations, but are not infinitesimally rigid.";
  bp.references = ["MR4278662"];
  surfaces.push(bp);
}

// I'm not entirely sure about the relationship between Cartwright-Steger and Stover surfaces, the CRAS paper is a little low on details
for (var n = 1; n <= 20; n++) {
  if (n >= 2) {
    var stover = new Surface("Stover surfaces", 2, {q: 1, pg: n, c12: 9*n});
    stover.description = "étale abelian covers of degree $n$ of the first Cartwright-Steger surface";
    stover.references = ["MR3936138"];
    surfaces.push(stover);
  }

  var cs = new Surface("Cartwright&ndash;Steger surfaces", 2, {q: 1, pg: n, c12: 9*n});
  cs.description = "A smooth arithmetic ball quotient ($\\mathrm c_1^2 = 3\\mathrm c_2$) with $\\mathrm q=1$, $\\mathrm p_{\\mathrm g}=" + n + "$ and $\\mathrm K^2=" + (9*n) + "$; for $n=1$ it is the Cartwright&ndash;Steger surface, a close relative of the fake projective planes.";
  cs.references = ["MR2586735"];
  surfaces.push(cs);
}

// double cover of an even 16-nodal quintic surface, equivalently the smooth surface of lines
// on a cubic fourfold meeting a fixed generic line; invariants from Huybrechts, Theorem 0.1
var huybrechts = new Surface("double covers of even 16-nodal quintic surfaces", 2, {c12: 10, pg: 5, q: 0});
huybrechts.description = "The natural double cover $F$ of an even 16-nodal quintic surface, equivalently the smooth surface of lines on a cubic fourfold meeting a fixed generic line. A general-type analogue of the abelian surface behind a singular Kummer quartic; its canonical bundle is ample.";
huybrechts.references = ["MR4795727"];
surfaces.push(huybrechts);

// Lagrangian in their Albanese variety; canonical map 2:1 onto a degree-12 surface with 44 nodes
var grossimoretti = new Surface("Grossi&ndash;Moretti surfaces", 2, {c12: 24, pg: 6, q: 4});
grossimoretti.description = "Surfaces that are Lagrangian in their Albanese variety. The canonical map is $2:1$ onto a degree-$12$ surface in $\\mathbb{P}^5$ with 44 even nodes.";
grossimoretti.references = ["2502.13087"];
surfaces.push(grossimoretti);

// --- additions from a literature sweep of the geography of surfaces of general type ---

// pg = q = 0
var craigherogattazzo = new Surface("Craighero&ndash;Gattazzo surfaces", 2, {c12: 1, pg: 0, q: 0});
craigherogattazzo.description = "A numerical Godeaux surface ($\\mathrm K^2=1$, $\\mathrm p_{\\mathrm g}=\\mathrm q=0$), the smooth minimal model of a special quintic surface in $\\mathbb{P}^3$; it is simply connected.";
craigherogattazzo.references = ["1506.03529"];
surfaces.push(craigherogattazzo);

var leepark = new Surface("Lee&ndash;Park surfaces", 2, {c12: 2, pg: 0, q: 0});
leepark.description = "The first simply connected minimal surfaces of general type with $\\mathrm p_{\\mathrm g}=0$ and $\\mathrm K^2=2$, obtained by a $\\mathbb{Q}$-Gorenstein smoothing of a singular rational surface.";
leepark.references = ["math/0609072"];
surfaces.push(leepark);

var kulikov = new Surface("Kulikov surfaces", 2, {c12: 6, pg: 0, q: 0});
kulikov.description = "Surfaces with $\\mathrm p_{\\mathrm g}=0$ and $\\mathrm K^2=6$ realised as $(\\mathbb{Z}/3)^2$-covers of the plane; they form a connected component of the moduli space and have torsion group $(\\mathbb{Z}/3)^3$.";
kulikov.references = ["1011.5574"];
surfaces.push(kulikov);

var ychen = new Surface("Chen surfaces", 2, {c12: 7, pg: 0, q: 0});
ychen.description = "A family with $\\mathrm p_{\\mathrm g}=0$ and $\\mathrm K^2=7$, obtained as $(\\mathbb{Z}/2)^2$-covers of a $6$-nodal degree-$1$ del Pezzo surface; distinct from the Inoue and Chen&ndash;Shin surfaces with the same invariants.";
ychen.references = ["1210.4633"];
surfaces.push(ychen);

var bauercatanese = new Surface("Bauer&ndash;Catanese surfaces", 2, {c12: 3, pg: 0, q: 0});
bauercatanese.description = "A family of Burniat-type surfaces with $\\mathrm p_{\\mathrm g}=0$ and $\\mathrm K^2=3$ realising a new fundamental group of order $16$.";
bauercatanese.references = ["1209.1980"];
surfaces.push(bauercatanese);

var nevespapadakis = new Surface("Neves&ndash;Papadakis surfaces", 2, {c12: 2, pg: 0, q: 0});
nevespapadakis.description = "Numerical Campedelli surfaces ($\\mathrm K^2=2$, $\\mathrm p_{\\mathrm g}=\\mathrm q=0$) with torsion group $\\mathbb{Z}/6$, built by unprojection.";
nevespapadakis.references = ["0707.0244"];
surfaces.push(nevespapadakis);

// pg = q = 1 (filling the gaps at K^2 = 2, 5, 7)
var pgq1k2 = new Surface("surfaces with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=2$", 2, {c12: 2, pg: 1, q: 1});
pgq1k2.description = "Irregular surfaces of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=2$, the smallest $\\mathrm K^2$ in this class; the Albanese fibres have genus $2$.";
pgq1k2.references = ["1508.01863"];
surfaces.push(pgq1k2);

var pgq1k5 = new Surface("surfaces with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=5$", 2, {c12: 5, pg: 1, q: 1});
pgq1k5.description = "The first minimal surfaces of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=5$, realised as standard isotrivial fibrations with genus-$3$ Albanese fibres.";
pgq1k5.references = ["0805.1424"];
surfaces.push(pgq1k5);

var pgq1k7 = new Surface("surfaces with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=7$", 2, {c12: 7, pg: 1, q: 1});
pgq1k7.description = "Surfaces with $\\mathrm p_{\\mathrm g}=\\mathrm q=1$ and $\\mathrm K^2=7$, obtained as double covers of a Kummer quartic surface.";
pgq1k7.references = ["1506.09117"];
surfaces.push(pgq1k7);

// isogenous to a product, and fake quadrics
var pgq2iso = new Surface("surfaces with $\\mathrm p_{\\mathrm g}=\\mathrm q=2$ isogenous to a product", 2, {c12: 8, pg: 2, q: 2});
pgq2iso.description = "Free quotients $(C\\times F)/G$ with $\\mathrm p_{\\mathrm g}=\\mathrm q=2$; being isogenous to a product forces $\\mathrm K^2=8\\chi=8$.";
pgq2iso.references = ["MR2825713"];
surfaces.push(pgq2iso);

var regiso = new Surface("regular surfaces isogenous to a product with $\\chi=2$", 2, {c12: 16, pg: 1, q: 0});
regiso.description = "Regular ($\\mathrm q=0$) surfaces isogenous to a product of curves with $\\chi=2$, hence $\\mathrm p_{\\mathrm g}=1$ and $\\mathrm K^2=8\\chi=16$.";
regiso.references = ["1310.3110"];
surfaces.push(regiso);

var fakequadric = new Surface("fake quadrics", 2, {c12: 8, pg: 0, q: 0});
fakequadric.description = "Minimal surfaces of general type with the Betti numbers of $\\mathbb{P}^1\\times\\mathbb{P}^1$ (so $\\mathrm p_{\\mathrm g}=\\mathrm q=0$, $\\mathrm K^2=8$, $\\mathrm b_2=2$). Shavel constructed examples uniformised by the bidisk from quaternion algebras.";
fakequadric.references = ["10.2140/pjm.1978.76.221"];
surfaces.push(fakequadric);

var mixedbeauville = new Surface("mixed Beauville surfaces", 2, {c12: 8, pg: 0, q: 0});
mixedbeauville.description = "Surfaces isogenous to a product of mixed type with $\\mathrm p_{\\mathrm g}=\\mathrm q=0$, where the group also exchanges the two factors; the smallest example has a group of order $256$.";
mixedbeauville.references = ["MR2400886"];
surfaces.push(mixedbeauville);

// --- record canonical-map-degree surfaces and a fake del Pezzo (second literature sweep) ---

// canonical map of record degree 32 (pg=3, q=0); free quotients of a product of two curves
var gpr32 = new Surface("Gleissner&ndash;Pignatelli&ndash;Rito surfaces", 2, {c12: 32, pg: 3, q: 0});
gpr32.description = "Surfaces of general type whose canonical map has degree $32$ (a record for $\\mathrm p_{\\mathrm g}=3$), constructed as free quotients of a product of two curves.";
gpr32.references = ["1807.11854"];
surfaces.push(gpr32);

var gpr24 = new Surface("Gleissner&ndash;Pignatelli&ndash;Rito surfaces", 2, {c12: 24, pg: 3, q: 1});
gpr24.description = "Surfaces of general type with $\\mathrm p_{\\mathrm g}=3$, $\\mathrm q=1$ whose canonical map has degree $24$.";
gpr24.references = ["1807.11854"];
surfaces.push(gpr24);

// Fallucca: canonical map of degree 10, 11 or 14; free (Z/7)^2-quotients of a product of Fermat septics
var fallucca = new Surface("Fallucca surfaces", 2, {c12: 32, pg: 3, q: 0});
fallucca.description = "Surfaces of general type with $\\mathrm p_{\\mathrm g}=3$, $\\mathrm q=0$ and canonical map of degree $10$, $11$ or $14$, realised as free $(\\mathbb{Z}/7)^2$-quotients of a product of two Fermat septic curves.";
fallucca.references = ["2207.02969"];
surfaces.push(fallucca);

// fake del Pezzo surface of degree 3: a quotient of a fake projective plane
var fakedelpezzo = new Surface("fake del Pezzo surfaces", 2, {c12: 3, pg: 0, q: 0});
fakedelpezzo.description = "Minimal surfaces of general type with $\\mathrm p_{\\mathrm g}=\\mathrm q=0$ and $\\mathrm K^2=3$ (\"fake del Pezzo surfaces of degree $3$\"), obtained as quotients of a fake projective plane by a group of order $3$.";
fakedelpezzo.references = ["0802.3435"];
surfaces.push(fakedelpezzo);

// --- Persson surfaces: fill the interior of the general-type geography ---
// The Noether region 2*chi-6 <= K^2 <= 8*chi is completely realised (Persson's double covers of
// rational surfaces, Compositio Math. 43 (1981), and refinements). We fill every point of it that
// no named class already occupies, with a regular (q=0, so p_g=chi-1) representative.
(function () {
  var occupied = {};
  surfaces.forEach(function (s) { occupied[s.kodaira + "|" + s.c2 + "|" + s.c12] = true; });
  for (var chi = 2; chi <= 11; chi++) {
    for (var K2 = Math.max(2 * chi - 6, 1); K2 <= 8 * chi; K2++) {
      var c2 = 12 * chi - K2;
      if (c2 < -20 || c2 > 80 || K2 > 60) continue;
      if (occupied["2|" + c2 + "|" + K2]) continue; // only fill points no named class occupies
      var persson = new Surface("Persson surfaces", 2, {c12: K2, pg: chi - 1, q: 0});
      persson.description = "A minimal surface of general type with $\\chi=" + chi + "$ and $\\mathrm K^2=" + K2 + "$, here a regular ($\\mathrm q=0$, so $\\mathrm p_{\\mathrm g}=" + (chi - 1) + "$) representative, a Persson double cover of a rational surface. By varying the branch locus, this construction realises essentially every lattice point of the region $2\\chi-6\\le\\mathrm K^2\\le 8\\chi$: the whole wedge between the <em>Noether line</em> $\\mathrm K^2=2\\chi-6$ (the lower edge of the geography) and the <em>signature-zero line</em> $\\tau=0$, i.e. $\\mathrm K^2=2\\mathrm c_2$, equivalently $\\mathrm K^2=8\\chi$. It thus (almost) exhausts the interior of the general-type region, leaving only the thin strip $8\\chi<\\mathrm K^2<9\\chi$ just below the Bogomolov&ndash;Miyaoka&ndash;Yau line unpopulated.";
      persson.references = ["MR0631426"];
      surfaces.push(persson);
    }
  }
})();

// Give every surface a URL slug, unique among the surfaces sharing its (kodaira, c_2, c_1^2) point,
// so a table row can link straight to it: /<kodaira>/<c2>-<c1^2>/<slug> (see main.js).
(function () {
  function slugify(name) {
    return name
      .replace(/<[^>]*>/g, "")      // strip HTML tags
      .replace(/&[a-z]+;/gi, "-")   // HTML entities (&ndash; etc.) -> separator
      .replace(/[${}\\]/g, "")      // drop TeX punctuation
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  var used = {};
  surfaces.forEach(function (s) {
    var key = s.kodaira + "|" + s.c2 + "|" + s.c12;
    var seen = used[key] || (used[key] = {});
    var base = slugify(s.name) || "surface";
    var slug = base, i = 2;
    while (seen[slug]) slug = base + "-" + (i++);
    seen[slug] = true;
    s.slug = slug;
  });
})();
