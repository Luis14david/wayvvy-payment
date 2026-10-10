const mysql = require('mysql2');

const conexion = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wpayroll_db',
    port: 3306
});

conexion.getConnection((error, connection) => {
    if (error) {
        console.error(
            'Error al conectar con la base de datos:',
            error
        );
        return;
    }

    console.log('Conectado a la base de datos');

    connection.release();
});
 
module.exports = conexion;

