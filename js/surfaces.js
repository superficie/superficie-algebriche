var surfaces = [];

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
  }
);

// TODO this must increase whenever we increase the size of the viewport...
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
