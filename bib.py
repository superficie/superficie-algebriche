import sqlite3
conn = sqlite3.connect('surfaces.db')
c = conn.cursor()
c.execute('''CREATE TABLE bibliography (
pg  INT, 
q   INT,
K2  INT,
chi INT,
e   INT,
h11 INT,
sp  INT,
ref TEXT
);
''')

c.close()
conn.commit()
