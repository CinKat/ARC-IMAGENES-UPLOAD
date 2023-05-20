const sqlite3 = require('sqlite3').verbose();
const db_file = 'db-efe.sqlite'

const db = new sqlite3.Database(`/home/cinthia/var/lib/efe/db/${db_file}`, (error) => {
    if (error) {
      console.error('Error al abrir la base de datos:', error.message);
    } else {
      console.log('Base de datos creada exitosamente.');
    }
});

const crearTablaProducts = `
    CREATE TABLE IF NOT EXISTS agencia (
        name TEXT,
        date_from INTEGER DEFAULT 0
    )
`;

const insertarDatos = `
    INSERT INTO agencia (name) VALUES ('agencia-efe')
`

db.run(crearTablaProducts, (error) => {
  if (error) {
    console.error('Error al crear la tabla:', error.message);
  } else {
    console.log('Tabla creada exitosamente.');

    db.run(insertarDatos, (error) => {
        if (error) {
          console.error('Error al insertar datos:', error.message);
        } else {
          console.log('Se inserto datos exitosamente.');
        }
    });
  }
});


