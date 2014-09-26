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
(0, 1, 2, 0, 0, 0,  4,  7, "Abelian surfaces."),
]

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", kdim0)

c.close()
conn.commit()
