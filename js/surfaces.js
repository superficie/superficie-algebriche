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

surfaces.push(
  {
    "name" : "abelian surfaces",
    "kodaira" : 0,
    "c2" : 0,
    "c12" : 0,
    "h11" : 4,
    "description" : "Abelian variety of dimension $2$.",
  }
);

surfaces.push(
  {
    "name" : "Enriques surfaces",
    "kodaira" : 0,
    "c2" : 12,
    "c12" : 0,
    "h11" : 10,
    "description" : "Algebraic surface such that $\\mathrm{q}=0$ and the canonical line bundle is non-trivial but has trivial square.",
  }
);

surfaces.push(
  {
    "name" : "K3 surfaces",
    "kodaira" : 0,
    "c2" : 24,
    "c12" : 0,
    "h11" : 20,
    "description" : "Algebraic surface such that $q = 0$ and the canonical bundle is trivial.",
  }
);

surfaces.push(
  {
    "name" : "bielliptic surfaces",
    "kodaira" : 0,
    "c2" : 0,
    "c12" : 0,
    "h11" : 2,
    "description" : "Algebraic surface with an elliptic fibration over an elliptic curve.",
  }
);

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

surfaces.push(
  {
    "name" : "fake projective planes",
    "kodaira" : 2,
    "c2" : 3,
    "c12" : 9,
    "h11" : 1,
    "description" : "Algebraic surface with the same Betti numbers as the projective plane (but not isomorphic to it). There are 50 different such surfaces.",
  }
);

surfaces.push(
  {
    "name" : "Beauville surfaces",
    "kodaira" : 2,
    "c2" : 4,
    "c12" : 8,
    "h11" : 2,
    "description" : "<p>Algebraic surface introduced by Beauville, with the same numerical characteristics as a quadric surface (or Hirzebruch surface). See <em>Complex algebraic surfaces</em>, Arnaud Beauville (1996).",
    "construction" : "Take two smooth curves $C_1$ and $C_2$ of genus $g_1$ and $g_2$. Let $G$ be a finite group acting on $C_1$ and $C_2$ such that<ul><li>$\\#G=(g_1-1)(g_2-1)$<li>no $g\\in G\\setminus\\{1\\}$ has a fix point on both $C_1$ and $C_2$<li>$C_i/G$ is rational</ul> Then $(C_1\\times C_2)/G$ is a Beauville surface."
  }
);

for (var n = 2; n <= 6; n++) {
  surfaces.push(
    {
      "name" : "Burniat surfaces",
      "kodaira" : 2,
      "c2" : 12 - n,
      "c12" : n,
      "h11" : 10 - n,
      "description" : "Algebraic surface introduced by Burniat. See <em>Sur les surfaces de genre $P_{12}>1$</em>, Pol Burniat (1966).",
    }
  );
}

surfaces.push(
  {
    "name" : "Campedelli surface",
    "kodaira" : 2,
    "c2" : 10,
    "c12" : 2,
    "h11" : 8,
    "description" : "Algebraic surface introduced by Campedelli.",
  }
);

surfaces.push(
  {
    "name" : "Catanese surface",
    "kodaira" : 2,
    "c2" : 10,
    "c12" : 2,
    "h11" : 8,
    "description" : "Algebraic surface introduced by Catanese, in <em>Babbage's conjecture, contact of surfaces, symmetric determinantal varieties and applications</em> (1981).",
  }
);

surfaces.push(
  {
    "name" : "Godeaux surface",
    "kodaira" : 2,
    "c2" : 11,
    "c12" : 1,
    "h11" : 9,
    "description" : "Algebraic surface introduced by Lucien Godeaux.",
  }
);

surfaces.push(
  {
    "name" : "Barlow surface",
    "kodaira" : 2,
    "c2" : 11,
    "c12" : 1,
    "h11" : 9,
    "description" : "Algebraic surface introduced by Rebecca Barlow. See </em>Some new surfaces with $p_{g} = 0$</em>, Rebecca Barlow (1984).",
  }
);

surfaces.push(
  {
    "name" : "Fano surfaces",
    "kodaira" : 2,
    "c2" : 27,
    "c12" : 45,
    "h11" : 25,
    "description" : "These surfaces parametrise lines on a non-singular cubic threefold.",
    "construction" : "Subvariety in the Grassmannian of lines in $\\mathbb{P}^4$ lying on a non-singular cubic threefold.",
  }
);

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
