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

### Kodaira dimension = -1  --- rational surfaces

rationalsurfaces = [(-1, 0, 0, 9, 1, 3, 0)]
for n in range(2,60):
	h11 = n+1
	e = n+3
	K2 = 12 - e
	rationalsurfaces.append((-1, 0, 0, K2, e, h11, n))

c.executemany("INSERT INTO invariants VALUES (?,?,?,?,?,?,?)", rationalsurfaces)

### Kodaira dimension = 2   ---  a.k.a. general type

kdim = 2

for pg in range(0,pgmax+1):
    for q in range(0,qmax+1):
        for K2 in range(1,K2max+1):
            chi = pg - q + 1
            e = 12*chi - K2
            h11 = e - 2*pg - 2 + 4*q

            if !(chi > 0):
                continue
            if !(e >= 0):
                continue
            if !(h11 >= 0):
                continue
            if !(K2 <= 3*e): # Bogomolov-Miyaoka-Yau
                continue
            if (q > 0 and !(K2 >= 2*pg)): # Debarre
                continue
            if !(2*pg <= K2 + 4): # Noether
                continue
            query = "INSERT INTO invariants VALUES (%d,%d,%d,%d,%d,%d,%d);" % (kdim, pg, q, K2, chi, e, h11)
            c.execute(query)

### Kodaira

c.close()
conn.commit()
