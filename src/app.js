const express = require('express');
const conexion = require('./conexion');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

// Permitir que Express cargue los archivos CSS
app.use(express.static(path.join(__dirname, '..', 'css')));

// Mostrar el formulario
app.get('/', (req, res) => {
    res.sendFile(__dirname + 'Index.html');
});

// Registrar empleado
app.post('/registrar', (req, res) => {

    const {
        nombres, apellidos, cedula, sexo, nacimiento, telefono, correo, direccion, 
        fecha_ingreso, salario_base, id_puesto, estado
    } = req.body;

    

   
    const puesto = id_puesto === '' || id_puesto === undefined
        ? null
        : id_puesto;

    const sql = `
        INSERT INTO empleados (
            nombres, apellidos, cedula, sexo, fecha_nacimiento, telefono,correo, direccion,
             fecha_ingreso, salario_base, id_puesto, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nombres, apellidos,cedula,sexo, nacimiento,  telefono,correo,direccion,
        fecha_ingreso, salario_base, puesto,estado ];

    conexion.query(sql, valores, (error, resultado) => {

        if (error) {
            console.log('ERROR AL GUARDAR:');
            console.log(error);

            return res.send(`
                <h2>Error al guardar el empleado</h2>
                <p>${error.sqlMessage}</p>
                <a href="/">Volver al formulario</a>
            `);
        }

        res.send(`
            <h2>Empleado registrado correctamente</h2>
            <p>ID del empleado: ${resultado.insertId}</p>
            <a href="/">Registrar otro empleado</a>
        `);
    });
});


app.listen(3000, () => {
    
    console.log('http://localhost:3000'); 
});