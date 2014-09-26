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
(-1, 0, 0, None, 1, None, None, 4, "Rational surfaces"),
(-1, 0, 0, 9, 1, 3, 1, 7, '''The projective plane $\\mathbb{P}^{2}$.'''),
(-1, 0, 0, 8, 1, 4, 2, 7, "A Hirzebruch surface $\\Sigma_{n}$, with $n = 0$, or $n \ge 2$.")]

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", rationalsurfaces)

c.executemany("INSERT INTO bibliography VALUES (?,?,?,?,?,?,?,?,?)", rationalsurfaces)

c.close()
conn.commit()
