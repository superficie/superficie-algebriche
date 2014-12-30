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
    "name" : "Abelian surfaces",
    "kodaira" : 0,
    "c2" : 0,
    "c12" : 0,
    "h11" : 4,
  }
);

surfaces.push(
  {
    "name" : "Enriques surfaces",
    "kodaira" : 0,
    "c2" : 12,
    "c12" : 0,
    "h11" : 10,
  }
);

surfaces.push(
  {
    "name" : "K3 surfaces",
    "kodaira" : 0,
    "c2" : 24,
    "c12" : 0,
    "h11" : 20,
  }
);

surfaces.push(
  {
    "name" : "Hyperelliptic surfaces",
    "kodaira" : 0,
    "c2" : 36,
    "c12" : 0,
    "h11" : 2,
  }
);
