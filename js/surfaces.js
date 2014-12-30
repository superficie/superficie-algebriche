var surfaces = [];

// Kodaira dimension -\infty

surfaces.push(
  {
    "name" : "projective plane",
    "kodaira" : -1,
    "c2" : 3,
    "c12" : 9,
    "h11" : 1,
  }
);

surfaces.push(
  {
    "name" : "Hirzebruch surfaces",
    "kodaira" : -1,
    "c2" : 4,
    "c12" : 8,
    "h11" : 2,
    "description" : "Ruled surface over $\\mathbb{P}^1$, i.e. it is defined as $\\operatorname{Proj}(\\mathcal{O}_{\\mathbb{P}^1}\\oplus\\mathcal{O}_{\\mathbb{P}^1}(n))$ for some $n\\geq 0$.",
  }
);

// this can increase whenever we increase the size of the viewport, currently not implemented
for (var g = 1; g < 5; g++) {
  surfaces.push(
    {
      "name" : "ruled surfaces",
      "kodaira" : -1,
      "c2" : 4 - 4*g,
      "c12" : 8 - 8*g,
      "h11" : 2,
    }
  );
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
    "name" : "Beauville surface",
    "kodaira" : 2,
    "c2" : 4,
    "c12" : 8,
    "h11" : 2,
    "description" : "Algebraic surface introduced by Beauville. See <em>Complex algebraic surfaces</em>, Arnaud Beauville (1996).",
  }
);

for (var n = 2; n < 6; n++) {
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
