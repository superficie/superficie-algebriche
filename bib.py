# This script adds bibliographical data to the database
# for certain invariants.
pgmax = 30 
qmax  = 30 
K2max = 180

import sqlite3
conn = sqlite3.connect('surfaces.db')
c = conn.cursor()
c.execute('''CREATE TABLE bibliography (
kdim INT DEFAULT NULL,
pg   INT DEFAULT NULL, 
q    INT DEFAULT NULL,
K2   INT DEFAULT NULL,
chi  INT DEFAULT NULL,
e    INT DEFAULT NULL,
h11  INT DEFAULT NULL,
sp   INT,
ref  TEXT
);
''')

### Kodaira dimension = -1 ###

## Rational surfaces ##

rationalsurfaces = [
(-1, 0, 0, None, 1, None, None, 4, "Rational surfaces."),
(-1, 0, 0, 9, 1, 3, 1, 7, "The projective plane $\\mathbb{P}^{2}$."),
(-1, 0, 0, 8, 1, 4, 2, 7, "A Hirzebruch surface $\\Sigma_{n}$, with $n = 0$, or $n \ge 2$.")]

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", rationalsurfaces)

## Ruled surfaces over higher genus curves ##

ruledsurfaces = [(-1, 0, None, None, None, None, None, 2, "Ruled surfaces.")]
for g in range(0,qmax):
        chi = 1-g
        ruledsurfaces.append((-1, 0, g, 8*chi, chi, 4*chi, 2, 7, "Ruled surface over a curve of genus $" + str(g) + "$."))

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", ruledsurfaces)

### Kodaira dimension = 0 ###

kdim0 = [
(0, 0, 0, 0, 1, 12, 10, 7, "Enriques surfaces."),
(0, 1, 0, 0, 2, 24, 20, 7, "K3 surfaces."),
(0, 0, 1, 0, 0, 0,  2,  7, "Hyperelliptic surfaces."),
(0, 1, 2, 0, 0, 0,  4,  7, "Abelian surfaces.")
]

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", kdim0)

### Kodaira dimension = 1 ###

### Kodaira dimension = 2 ###

pg2q2 = [
(2, 2, 2, None, 1, None, None, 4, '''Penegini, Matteo. On the classification of surfaces of general type with $p_{g}=q=2$. Boll. Unione Mat. Ital. (9) 6 (2013), no. 3, 549&ndash;563.'''),
(2, 2, 2, 4, 1, 8, 10, 7, '''At least 1 component in the moduli space, consisting of surfaces that are a double cover of an abelian surface.'''),
(2, 2, 2, 5, 1, 7, 9, 4, '''At least 1 component of dimension 4 in the moduli space, consisting of Chen&ndash;Hacon surfaces.'''),
(2, 2, 2, 6, 1, 6, 8, 4, '''At least 4 components in the moduli space; 3 generically smooth components in the moduli space, of dimensions 4, 4, 3.'''),
(2, 2, 2, 7, 1, 5, 7, 4, '''No examples known.'''),
(2, 2, 2, 8, 1, 4, 6, 4, '''If the image of the albanese map is a curve, there are 24 components in the moduli space coming from surfaces isogenous to a product of curves. It is not know if there are more components.'''),
(2, 2, 2, 8, 1, 4, 6, 4, '''If the image of the albanese map is a surface, there are at least 4 components in the moduli space.'''),
(2, 2, 2, 9, 1, 3, 5, 4, '''No examples known.''')
]

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", pg2q2)

pg1q0 = [
(2, 1, 0, 1, 2, 23, 19, 7, '''Irreducible moduli space of dimension 18.'''),
(2, 1, None, 1, None, None, None, 3, '''Catanese, Fabrizio. Surfaces with $K^{2}=p_{g}=1$ and their period mapping. Algebraic geometry (Proc. Summer Meeting, Univ. Copenhagen, Copenhagen, 1978), pp. 1&ndash;29, Lecture Notes in Math., 732, Springer, Berlin, 1979.'''),
(2, 1, None, 1, None, None, None, 3, '''Catanese, F. The moduli and the global period mapping of surfaces with $K^{2}=p_{g}=1$: a counterexample to the global Torelli problem. Compositio Math. 41 (1980), no. 3, 401&ndash;414.'''),
(2, 1, None, 1, None, None, None, 3, '''Todorov, Andrei N. Surfaces of general type with $p_{g}=1$ and $(K,K)=1$. I. Ann. Sci. &Eacute;cole Norm. Sup. (4) 13 (1980), no. 1, 1&ndash;21.'''),
]

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", pg1q0)



c.close()
conn.commit()
