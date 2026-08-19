const express = require('express');
const conexion = require('./conexion');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Permitir que Express cargue los archivos CSS
app.use(express.static(__dirname));

// Mostrar el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Index.html'));
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
        numero_empleado,
        nombres,
        apellidos,
        cedula,
        sexo,
        fecha_nacimiento,
        telefono,
        correo,
        direccion,
        fecha_ingreso,
        salario_base,
        id_puesto,
        estado
    )
    SELECT
        COALESCE(MAX(numero_empleado), 0) + 1,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    FROM empleados
`;

const valores = [
    nombres,
    apellidos,
    cedula,
    sexo,
    nacimiento,
    telefono,
    correo,
    direccion,
    fecha_ingreso,
    salario_base,
    puesto,
    estado
];

    conexion.query(sql, valores, (error, resultado) => {

        if (error) {
            console.log('ERROR AL GUARDAR:');
            console.log(error);

            return res.send(`
                <h2>Error al guardar el empleado</h2>
                <p>${error.sqlMessage}</p>
                <a href="/ingresoDeEmpleado.html">Volver al formulario</a>
            `);
        }

        res.send(`
            <h2>Empleado registrado correctamente</h2>
            <p>ID del empleado: ${resultado.insertId}</p>
            <a href="/ingresoDeEmpleado.html"> Registrar otro empleado</a>
        `);
    });
});

app.get('/api/empleados', (req, res) => {

    const sql = `
    SELECT
        e.id_empleado,
        e.numero_empleado,
        e.nombres,
        e.apellidos,
        e.cedula,
        p.nombre_puesto AS puesto,
        e.fecha_ingreso,
        e.estado
    FROM empleados e
    LEFT JOIN puestos p
        ON e.id_puesto = p.id_puesto
    ORDER BY e.numero_empleado ASC
`;

    conexion.query(sql, (error, resultados) => {

        if (error) {
            console.log('ERROR AL CARGAR EMPLEADOS:');
            console.log(error);

            return res.status(500).json({
                error: 'Error al cargar los empleados'
            });
        }

        res.json(resultados);
    });
});

app.get('/api/empleados/:id', (req, res) => {

    const idEmpleado = req.params.id;

    const sql = `
        SELECT
            e.id_empleado,
            e.numero_empleado,
            e.nombres,
            e.apellidos,
            e.cedula,
            e.sexo,
            e.fecha_nacimiento,
            e.telefono,
            e.correo,
            e.direccion,
            e.fecha_ingreso,
            e.salario_base,
            e.id_puesto,
            p.nombre_puesto AS puesto,
            e.estado
        FROM empleados e
        LEFT JOIN puestos p
            ON e.id_puesto = p.id_puesto
        WHERE e.id_empleado = ?
    `;

    conexion.query(sql, [idEmpleado], (error, resultados) => {

        if (error) {
            console.log("ERROR AL BUSCAR EMPLEADO:");
            console.log(error);

            return res.status(500).json({
                error: "Error al buscar el empleado"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                error: "Empleado no encontrado"
            });
        }

        res.json(resultados[0]);
    });
});

app.put('/api/empleados/:id', (req, res) => {

    const idEmpleado = req.params.id;

    const {
        nombres,
        apellidos,
        cedula,
        sexo,
        nacimiento,
        telefono,
        correo,
        direccion,
        fecha_ingreso,
        salario_base,
        id_puesto,
        estado
    } = req.body;

    const sql = `
        UPDATE empleados
        SET
            nombres = ?,
            apellidos = ?,
            cedula = ?,
            sexo = ?,
            fecha_nacimiento = ?,
            telefono = ?,
            correo = ?,
            direccion = ?,
            fecha_ingreso = ?,
            salario_base = ?,
            id_puesto = ?,
            estado = ?
        WHERE id_empleado = ?
    `;

    const valores = [
        nombres,
        apellidos,
        cedula,
        sexo,
        nacimiento,
        telefono,
        correo,
        direccion,
        fecha_ingreso,
        salario_base,
        id_puesto || null,
        estado,
        idEmpleado
    ];

    conexion.query(sql, valores, (error, resultado) => {

        if (error) {
            console.log("ERROR AL ACTUALIZAR EMPLEADO:");
            console.log(error);

            return res.status(500).json({
                error: "No se pudo actualizar el empleado"
            });
        }

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                error: "Empleado no encontrado"
            });
        }

        res.json({
            mensaje: "Empleado actualizado correctamente"
        });
    });
});

app.get('/api/puestos', (req, res) => {

    const sql = `
        SELECT
            id_puesto,
            nombre_puesto
        FROM puestos
        ORDER BY nombre_puesto ASC
    `;

    conexion.query(sql, (error, resultados) => {

        if (error) {
            console.log("ERROR AL CARGAR PUESTOS:");
            console.log(error);

            return res.status(500).json({
                error: "Error al cargar los puestos"
            });
        }

        res.json(resultados);
    });
});

app.post('/api/puestos', (req, res) => {

    const {
        nombre_puesto,
        descripcion,
        id_departamento
    } = req.body;

    const departamento =
        id_departamento === '' || id_departamento === undefined
            ? null
            : id_departamento;

    const sql = `
        INSERT INTO puestos (
            nombre_puesto,
            descripcion,
            id_departamento
        )
        VALUES (?, ?, ?)
    `;

    const valores = [
        nombre_puesto,
        descripcion,
        departamento
    ];

    conexion.query(sql, valores, (error, resultado) => {

        if (error) {
            console.log("ERROR AL GUARDAR PUESTO:");
            console.log(error);

            return res.status(500).json({
                error: "No se pudo registrar el puesto"
            });
        }

        res.status(201).json({
            mensaje: "Puesto registrado correctamente",
            id_puesto: resultado.insertId
        });
    });
});

app.listen(3001, () => {
    console.log('http://localhost:3001');
});