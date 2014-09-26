import sqlite3
conn = sqlite3.connect('surfaces.db')
c = conn.cursor()
c.execute('''CREATE TABLE bibliography (
kdim INT,
pg   INT, 
q    INT,
K2   INT,
chi  INT,
e    INT,
h11  INT,
sp   INT,
ref  TEXT
);
''')


rationalsurfaces = [(-1, 0, 0, "NULL", "NULL", "NULL", 0, 4, '''The projective plane, birational to the Hirzebruch surface $\\Sigma_{0} = \\mathbb{P}^{1} \\times \mathbb{P}^{1}$.''')]
for n in range(2,60):
	rationalsurfaces.append((-1, 0, 0, "NULL", "NULL", "NULL", n, 4, "The Hirzebruch surface $\\Sigma_{" + str(n) + "}$."))

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", rationalsurfaces)

c.close()
conn.commit()
