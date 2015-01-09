var surfaces = [];

function Surface(name, kodaira, c2, c12, h11) {
  this.name = name;
  this.kodaira = kodaira;
  this.c2 = c2;
  this.c12 = c12;
  this.h11 = h11;
}

// Kodaira dimension -\infty

var plane = new Surface("projective plane", -1, 3, 9, 1);
surfaces.push(plane);

var hirzebruch = new Surface("Hirzebruch surfaces", -1, 4, 8, 2);
hirzebruch.construction = "Ruled surface over $\\mathbb{P}^1$, i.e. it is defined as $\\operatorname{Proj}(\\mathcal{O}_{\\mathbb{P}^1}\\oplus\\mathcal{O}_{\\mathbb{P}^1}(n))$ for some $n\\geq 0$.";
surfaces.push(hirzebruch);

// this can increase whenever we increase the size of the viewport, currently not implemented
for (var g = 1; g < 5; g++) {
  var ruled = new Surface("ruled surfaces", -1, 4 - 4*g, 8 - 8*g, 2);
  surfaces.push(ruled);
}

// Kodaira dimension 0

var abelian = new Surface("abelian surfaces", 0, 0, 0, 4);
abelian.description = "Abelian variety of dimension $2$.";
surfaces.push(abelian);

var enriques = new Surface("Enriques surfaces", 0, 12, 0, 10);
enriques.description = "Algebraic surface such that $\\mathrm{q}=0$ and the canonical line bundle is non-trivial but has trivial square.";
surfaces.push(enriques);

var k3 = new Surface("K3 surfaces", 0, 24, 0, 20);
k3.description = "Algebraic surface such that $q = 0$ and the canonical bundle is trivial.";
surfaces.push(k3);

var bielliptic = new Surface("bielliptic surfaces", 0, 0, 0, 2);
bielliptic.description = "Algebraic surface with an elliptic fibration over an elliptic curve.";
surfaces.push(bielliptic);

// Kodaira dimension 1

// this can increase whenever we increase the size of the viewport, currently not implemented
//for (var x = 1; x < 9; x++) {
//  surfaces.push(
//    {
//      "name" : "elliptic surfaces",
//      "kodaira" : 1,
//      "c2" : 12*x,
//      "c12" : 0,
//      "description" : "Algebraic surface with a proper morphism to a curve, such that almost all fibres are smooth curves of genus $1$.",
//    }
//  );
//}

// Kodaira dimension 2

var fakeproj = new Surface("fake projective planes", 2, 3, 9, 1);
fakeproj.description = "Algebraic surface with the same Betti numbers as the projective plane (but not isomorphic to it). There are 50 different such surfaces.";
surfaces.push(fakeproj);

var beauville = new Surface("Beauville surfaces", 2, 4, 8, 2);
beauville.description = "<p>Algebraic surface introduced by Beauville, with the same numerical characteristics as a quadric surface (or Hirzebruch surface). See <em>Complex algebraic surfaces</em>, Arnaud Beauville (1996).";
beauville.construction = "Take two smooth curves $C_1$ and $C_2$ of genus $g_1$ and $g_2$. Let $G$ be a finite group acting on $C_1$ and $C_2$ such that<ul><li>$\\#G=(g_1-1)(g_2-1)$<li>no $g\\in G\\setminus\\{1\\}$ has a fix point on both $C_1$ and $C_2$<li>$C_i/G$ is rational</ul> Then $(C_1\\times C_2)/G$ is a Beauville surface.";
surfaces.push(beauville);

for (var n = 2; n <= 6; n++) {
  var burniat = new Surface("Burniat surfaces", 2, 12 - n, n, 10 - n);
  burniat.description = "Algebraic surface introduced by Burniat. See <em>Sur les surfaces de genre $P_{12}>1$</em>, Pol Burniat (1966).";
  surfaces.push(burniat);
}

var campedelli = new Surface("Campedelli surface", 2, 10, 2, 8);
campedelli.description = "Algebraic surface introduced by Campedelli.";
surfaces.push(campedelli);

var catanese = new Surface("Catanese surface", 2, 10, 2, 8);
catanese.description = "Algebraic surface introduced by Catanese, in <em>Babbage's conjecture, contact of surfaces, symmetric determinantal varieties and applications</em> (1981).";
surfaces.push(catanese);

var godeaux = new Surface("Godeaux surface", 2, 11, 1, 9);
godeaux.description = "Algebraic surface introduced by Lucien Godeaux.";
surfaces.push(godeaux);

var barlow = new Surface("Barlow surface", 2, 11, 1, 9);
barlow.description = "Algebraic surface introduced by Rebecca Barlow. See </em>Some new surfaces with $p_{g} = 0$</em>, Rebecca Barlow (1984).";
surfaces.push(barlow);

var fano = new Surface("Fano surfaces", 2, 27, 45, 25);
fano.description = "These surfaces parametrise lines on a non-singular cubic threefold.";
fano.construction = "Subvariety in the Grassmannian of lines in $\\mathbb{P}^4$ lying on a non-singular cubic threefold.";
surfaces.push(fano);

// products of two curves of genus >= 2
for (var g1 = 2; g1 < 5; g1++) {
  // some (i,j)'s don't show up in the graph, but this is the easiest solution
  for (var g2 = g1; g2 < 9; g2++) {
    var c2 = 4 - 4*(g1+g2) + 4*g1*g2;
    var c12 = 8*g1*g2 - 8*(g1+g2) + 8;
    var h11 = 2*g1*g2 + 2;

    var product = new Surface("Product of curves of genus " + g1 + " and " + g2, 2, c2, c12, h11);
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

  var ci = new Surface("Complete intersection of degree $(" + degrees[i].join(",") + ")$", 2, c2, c12, h11);
    surfaces.push(ci);
}
