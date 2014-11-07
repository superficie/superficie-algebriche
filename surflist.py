# This script populates the database with invariants that satisfy all known
# (in)equalities

pgmax = 30 
qmax  = 30 
K2max = 180

import sqlite3
conn = sqlite3.connect('surfaces.db')
c = conn.cursor()
c.execute('''CREATE TABLE invariants (
kdim INT,
pg   INT, 
q    INT,
K2   INT,
chi  INT,
e    INT,
h11  INT
);
''')

### Kodaira dimension = -1 ###

## rational surfaces

rationalsurfaces = [(-1, 0, 0, 9, 1, 3, 1), (-1, 0, 0, 8, 1, 4, 2)]

c.executemany("INSERT INTO invariants VALUES (?,?,?,?,?,?,?)", rationalsurfaces)

## ruled surfaces over higher genus curves

ruledsurfaces = []
for g in range(1,qmax):
	chi = 1-g
	ruledsurfaces.append((-1, 0, g, 8*chi, chi, 4*chi, 2))

c.executemany("INSERT INTO invariants VALUES (?,?,?,?,?,?,?)", ruledsurfaces)

### Kodaira dimension = 0 ###

kdim0 = [
(0, 0, 0, 0, 1, 12, 10),
(0, 1, 0, 0, 2, 24, 20),
(0, 0, 1, 0, 0, 0,  2),
(0, 1, 2, 0, 0, 0,  4),
]

c.executemany("INSERT INTO invariants VALUES (?,?,?,?,?,?,?)", kdim0)

### Kodaira dimension = 2   ---  a.k.a. general type

kdim = 2

for pg in range(0,pgmax+1):
    for q in range(0,qmax+1):
        for K2 in range(1,K2max+1):
            chi = pg - q + 1
            e = 12*chi - K2
            h11 = e - 2*pg - 2 + 4*q

            if not (chi > 0):
                continue
            if not (e >= 0):
                continue
            if not (h11 >= 0):
                continue
            if not (K2 <= 3*e): # Bogomolov-Miyaoka-Yau
                continue
            if (q > 0 and not (K2 >= 2*pg)): # Debarre
                continue
            if not (2*pg <= K2 + 4): # Noether
                continue
            query = "INSERT INTO invariants VALUES (%d,%d,%d,%d,%d,%d,%d);" % (kdim, pg, q, K2, chi, e, h11)
            c.execute(query)

### Kodaira

c.close()
conn.commit()
