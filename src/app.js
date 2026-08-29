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

        res.redirect("/app.html?pagina=empleados");
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
    console.log("ERROR AL CARGAR PUESTOS:");
    console.log(error);

    return res.status(500).json({
        error: "Error al cargar los puestos",
        detalle: error.sqlMessage || error.message
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
            nombre_puesto,
             descripcion
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

app.get('/api/estados-empleado', (req, res) => {

    const sql = `
        SHOW COLUMNS
        FROM empleados
        LIKE 'estado'
    `;

    conexion.query(sql, (error, resultados) => {

        if (error) {
            console.log("ERROR AL CARGAR ESTADOS:");
            console.log(error);

            return res.status(500).json({
                error: "No se pudieron cargar los estados"
            });
        }

        const tipo = resultados[0].Type;

        const estados = tipo
            .replace("enum(", "")
            .replace(")", "")
            .replaceAll("'", "")
            .split(",");

        res.json(estados);
    });
});

app.put('/api/puestos/:id', (req, res) => {

    const idPuesto = req.params.id;

    const {
        nombre_puesto,
        descripcion,
        id_departamento
    } = req.body;


    const departamento =
        id_departamento === '' ||
        id_departamento === undefined
            ? null
            : id_departamento;


    const sql = `
        UPDATE puestos
        SET
            nombre_puesto = ?,
            descripcion = ?,
            id_departamento = ?
        WHERE id_puesto = ?
    `;


    const valores = [
        nombre_puesto,
        descripcion,
        departamento,
        idPuesto
    ];


    conexion.query(sql, valores, (error, resultado) => {

        if (error) {

            console.log("ERROR AL ACTUALIZAR PUESTO:");
            console.log(error);

            return res.status(500).json({
                error: "No se pudo actualizar el puesto"
            });
        }


        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                error: "Puesto no encontrado"
            });
        }


        res.json({
            mensaje: "Puesto actualizado correctamente"
        });

    });

});

// =====================================================
// OBTENER HORAS DE ASISTENCIA POR EMPLEADO Y PERÍODO
// =====================================================

app.get("/api/asistencia", (req, res) => {

    const {
        id_empleado,
        fecha_inicio,
        fecha_fin
    } = req.query;


    if (
        !id_empleado ||
        !fecha_inicio ||
        !fecha_fin
    ) {

        return res.status(400).json({
            error: "Faltan datos para consultar la asistencia"
        });

    }


    const sql = `
        SELECT
            id_asistencia,
            id_empleado,
            fecha,
            horas_trabajadas,
            horas_extras,
            estado,
            observacion
        FROM asistencia

        WHERE id_empleado = ?
        AND fecha BETWEEN ? AND ?

        ORDER BY fecha ASC
    `;


    conexion.query(
        sql,
        [
            id_empleado,
            fecha_inicio,
            fecha_fin
        ],
        (error, resultados) => {

            if (error) {

                console.error(
                    "Error al cargar asistencia:",
                    error
                );

                return res.status(500).json({
                    error:
                        "No se pudo cargar la asistencia"
                });

            }


            res.json(resultados);

        }
    );

});

// =====================================================
// GUARDAR / ACTUALIZAR HORAS DE ASISTENCIA
// =====================================================

app.post("/api/asistencia", async (req, res) => {

    const {
        id_empleado,
        registros
    } = req.body;


    // Validación básica
    if (
        !id_empleado ||
        !Array.isArray(registros)
    ) {

        return res.status(400).json({
            error: "Datos de asistencia inválidos"
        });

    }


    const db =
        conexion.promise();


    try {

        await db.beginTransaction();


        for (const registro of registros) {

            const fecha =
                registro.fecha;

            const horasTrabajadas =
                Number(
                    registro.horas_trabajadas
                ) || 0;

            const horasExtras =
                Number(
                    registro.horas_extras
                ) || 0;


            if (!fecha) {
                continue;
            }


            // ==========================================
// VALIDAR HORAS
// ==========================================

if (
    horasTrabajadas < 0 ||
    horasExtras < 0
) {

    await db.rollback();

    return res.status(400).json({
        error:
            "Las horas no pueden ser negativas"
    });

}


if (
    horasTrabajadas + horasExtras > 24
) {

    await db.rollback();

    return res.status(400).json({
        error:
            "Las horas de un día no pueden superar 24"
    });

}

            // ==========================================
            // SI LAS HORAS SON 0
            // ELIMINAR REGISTRO EXISTENTE
            // ==========================================

            if (
                horasTrabajadas === 0 &&
                horasExtras === 0
            ) {

                await db.query(
                    `
                    DELETE FROM asistencia
                    WHERE id_empleado = ?
                    AND fecha = ?
                    `,
                    [
                        id_empleado,
                        fecha
                    ]
                );

                continue;
            }


            // ==========================================
            // INSERTAR O ACTUALIZAR
            // ==========================================

            await db.query(
                `
                INSERT INTO asistencia
                (
                    id_empleado,
                    fecha,
                    hora_entrada,
                    hora_salida,
                    horas_trabajadas,
                    horas_extras,
                    estado,
                    observacion
                )
                VALUES
                (
                    ?,
                    ?,
                    NULL,
                    NULL,
                    ?,
                    ?,
                    'Presente',
                    NULL
                )

                ON DUPLICATE KEY UPDATE

                    horas_trabajadas =
                        VALUES(horas_trabajadas),

                    horas_extras =
                        VALUES(horas_extras),

                    estado =
                        'Presente',

                    hora_entrada =
                        NULL,

                    hora_salida =
                        NULL
                `,
                [
                    id_empleado,
                    fecha,
                    horasTrabajadas,
                    horasExtras
                ]
            );

        }


        await db.commit();


        res.json({
            mensaje:
                "Horas guardadas correctamente"
        });


    }
    catch (error) {

        await db.rollback();


        console.error(
            "Error al guardar asistencia:",
            error
        );


        res.status(500).json({
            error:
                "No se pudieron guardar las horas"
        });

    }

});

// =====================================================
// REPORTE DE HORAS TRABAJADAS
// =====================================================

app.get("/api/reportes/horas", (req, res) => {

    const {
        fecha_inicio,
        fecha_fin,
        id_empleado
    } = req.query;


    // ==========================================
    // VALIDAR FECHAS
    // ==========================================

    if (!fecha_inicio || !fecha_fin) {

        return res.status(400).json({
            error:
                "Debe indicar una fecha inicial y una fecha final"
        });

    }


    if (fecha_fin < fecha_inicio) {

        return res.status(400).json({
            error:
                "La fecha final no puede ser anterior a la fecha inicial"
        });

    }


    // ==========================================
    // CONSULTA BASE
    // ==========================================

    let sql = `
        SELECT
            a.id_asistencia,
            a.id_empleado,
            e.numero_empleado,
            e.nombres,
            e.apellidos,
            a.fecha,
            a.horas_trabajadas,
            a.horas_extras,
            a.estado,
            a.observacion
        FROM asistencia a

        INNER JOIN empleados e
            ON a.id_empleado = e.id_empleado

        WHERE a.fecha BETWEEN ? AND ?
    `;


    const valores = [
        fecha_inicio,
        fecha_fin
    ];


    // ==========================================
    // FILTRAR POR EMPLEADO
    // SI NO SE ENVÍA, TRAER TODOS
    // ==========================================

    if (
        id_empleado &&
        id_empleado !== "todos"
    ) {

        sql += `
            AND a.id_empleado = ?
        `;

        valores.push(
            id_empleado
        );

    }


    sql += `
        ORDER BY
            e.numero_empleado ASC,
            a.fecha ASC
    `;


    // ==========================================
    // EJECUTAR CONSULTA
    // ==========================================

    conexion.query(
        sql,
        valores,
        (error, resultados) => {

            if (error) {

                console.error(
                    "Error al generar reporte de horas:",
                    error
                );


                return res.status(500).json({
                    error:
                        "No se pudo generar el reporte de horas"
                });

            }


            res.json(resultados);

        }
    );

});

app.listen(3001, () => {
    console.log('http://localhost:3001');
});