pgmax = 30 
qmax  = 30 
K2max = 180

import sqlite3
conn = sqlite3.connect('surfaces.db')
c = conn.cursor()
c.execute('''CREATE TABLE invariants (
pg  INT, 
q   INT,
K2  INT,
chi INT,
e   INT,
h11 INT
);
''')

entries = 0
for pg in range(0,pgmax+1):
    for q in range(0,qmax+1):
        for K2 in range(1,K2max+1):
            chi = pg - q + 1
            e = 12*chi - K2
            h11 = e - 2*pg - 2 + 4*q

            if (chi <= 0):
                continue
            if (e < 0):
                continue
            if (h11 < 0):
                continue
            if (K2 > 3*e): # Bogomolov-Miyaoka-Yau
                continue
            if (q > 0 and K2 < 2*pg): # Debarre
                continue
            if (5*K2 + 36 < e + 12*q): # Noether
                continue
            query = "INSERT INTO invariants VALUES (%d,%d,%d,%d,%d,%d);" % (pg, q, K2, chi, e, h11)
            c.execute(query)
            #print("pg = %d, q = %d, K2 = %d, chi = %d, e = %d, h11 = %d" % (pg, q, K2, chi, e, h11))
            entries += 1

print("pg <= %d, q <= %d, K2 <= %d :: %d hits" % (pgmax, qmax, K2max, entries))

c.close()
conn.commit()
