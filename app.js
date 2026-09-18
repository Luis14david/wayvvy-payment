const express = require('express');
const conexion = require('./js/conexion');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

// Permitir que Express cargue los archivos CSS
// Publicar únicamente recursos del navegador, nunca conexión, rutas ni respaldos.
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
const scriptsPublicos = new Set(['script.js','logout.js','lang.js','dashboard.js','empleados.js',
    'ingresoEmpleado.js','verEmpleado.js','nomina.js','verNomina.js','asistencia.js','incentivos.js',
    'puestos.js','reportes.js','fechasNomina.js','fechaPagoVista.js','calculoRegularVista.js']);
app.get('/js/:archivo', (req,res) => {
    if (!scriptsPublicos.has(req.params.archivo)) return res.sendStatus(404);
    res.sendFile(path.join(__dirname,'js',req.params.archivo));
});
app.get(['/','/Index.html'], (req,res)=>res.sendFile(path.join(__dirname,'Index.html')));
require('./js/rutasUsuarios')(app, conexion);
app.use('/html', express.static(path.join(__dirname,'html')));

// Mostrar el formulario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/Index.html'));
});

// Registrar empleado
require('./js/rutasTarifas')(app, conexion);

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
            (SELECT h.salario FROM historial_salario h
                WHERE h.id_empleado = e.id_empleado AND h.fecha_inicio <= CURDATE()
                ORDER BY h.fecha_inicio DESC LIMIT 1) AS salario_base,
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

require("./js/rutasAsistencia")(app, conexion);

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
            a.minutos_regulares / 60 AS horas_trabajadas,
            a.minutos_regulares,
            a.minutos_extras / 60 AS horas_extras,
            a.minutos_extras,
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


            res.json(resultados.map(registro => ({
                ...registro,
                horas_trabajadas: Number(registro.minutos_regulares) / 60,
                horas_extras: Number(registro.minutos_extras) / 60
            })));

        }
    );

});

// =====================================================
// CONCEPTOS DE UNA NÓMINA POR EMPLEADO
// =====================================================

app.get(
    "/api/nomina/conceptos",
    (req, res) => {

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
                error:
                    "Faltan datos para consultar los conceptos"
            });

        }


        const sql = `

            SELECT
                cn.id_concepto,
                cn.nombre,
                cn.tipo,
                cn.metodo_calculo,
                dc.monto,
                dc.cantidad,
                dc.tasa_aplicada,
                dc.base_calculo

            FROM detalle_concepto dc

            INNER JOIN concepto_nomina cn
                ON dc.id_concepto =
                   cn.id_concepto

            INNER JOIN detalle_nomina dn
                ON dc.id_detalle =
                   dn.id_detalle

            INNER JOIN nomina n
                ON dn.id_nomina =
                   n.id_nomina

            WHERE dn.id_empleado = ?

            AND n.periodo_inicio = ?

            AND n.periodo_fin = ?

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
                        "Error al consultar conceptos:",
                        error
                    );

                    return res.status(500).json({
                        error:
                            "Error al consultar los conceptos"
                    });

                }


                res.json(
                    resultados
                );

            }
        );

    }
);

// =====================================================
// LISTAR NÓMINAS
// =====================================================

app.get(
    "/api/nominas",
    (req, res) => {

        const sql = `
            SELECT
                id_nomina,
                periodo_inicio,
                periodo_fin,
                fecha_pago,
                anio,
                estado
            FROM nomina
            ORDER BY periodo_inicio DESC
        `;


        conexion.query(
            sql,
            (error, resultados) => {

                if (error) {

                    console.error(
                        "Error al cargar nóminas:",
                        error
                    );

                    return res.status(500).json({
                        error:
                            "Error al cargar las nóminas"
                    });

                }


                res.json(resultados);

            }
        );

    }
);

// =====================================================
// GUARDAR INCENTIVO
// =====================================================

app.post(
    "/api/incentivos",
    async (req, res) => {

        const {
            id_empleado,
            id_nomina,
            monto,
            descripcion
        } = req.body;


        if (
            !id_empleado ||
            !id_nomina ||
            monto === undefined ||
            monto === null
        ) {

            return res.status(400).json({
                error:
                    "Faltan datos para guardar el incentivo"
            });

        }


        const montoIncentivo =
            Number(monto);


        if (
            !Number.isFinite(montoIncentivo) ||
            montoIncentivo <= 0
        ) {

            return res.status(400).json({
                error:
                    "El monto del incentivo debe ser mayor que cero"
            });

        }


        let db;

        try {
            db = await conexion.promise().getConnection();
            await db.beginTransaction();


            const [nominas] =
                await db.query(
                    `
                    SELECT
                        id_nomina,
                        anio,
                        estado
                    FROM nomina
                    WHERE id_nomina = ?
                    LIMIT 1
                    FOR UPDATE
                    `,
                    [
                        id_nomina
                    ]
                );


            if (
                nominas.length === 0
            ) {

                await db.rollback();

                return res.status(404).json({
                    error:
                        "La nómina seleccionada no existe"
                });

            }


            if (
                nominas[0].estado !== "Borrador"
            ) {

                await db.rollback();

                return res.status(409).json({
                    error:
                        "Solo se pueden agregar incentivos a una nómina en estado Borrador"
                });

            }


            const anioCalculo =
                nominas[0].anio;


            const [conceptos] =
                await db.query(
                    `
                    SELECT
                        id_concepto
                    FROM concepto_nomina
                    WHERE nombre = 'Incentivo'
                    AND estado = 'Activo'
                    LIMIT 1
                    `
                );


            if (
                conceptos.length === 0
            ) {

                await db.rollback();

                return res.status(404).json({
                    error:
                        "No existe el concepto Incentivo"
                });

            }


            const idConcepto =
                conceptos[0].id_concepto;


            const [detalles] =
                await db.query(
                    `
                    SELECT
                        id_detalle
                    FROM detalle_nomina
                    WHERE id_nomina = ?
                    AND id_empleado = ?
                    LIMIT 1
                    `,
                    [
                        id_nomina,
                        id_empleado
                    ]
                );


            let idDetalle;


            if (
                detalles.length > 0
            ) {

                idDetalle =
                    detalles[0].id_detalle;

            }
            else {

                const [resultadoDetalle] =
                    await db.query(
                        `
                        INSERT INTO detalle_nomina
                        (
                            id_nomina,
                            id_empleado,
                            salario_bruto,
                            total_ingresos,
                            total_deducciones,
                            salario_neto
                        )
                        VALUES
                        (
                            ?,
                            ?,
                            0.00,
                            0.00,
                            0.00,
                            0.00
                        )
                        `,
                        [
                            id_nomina,
                            id_empleado
                        ]
                    );


                idDetalle =
                    resultadoDetalle.insertId;

            }


            await db.query(
                `
                INSERT INTO detalle_concepto
                (
                    id_detalle,
                    id_concepto,
                    monto,
                    descripcion,
                    anio_calculo
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,
                [
                    idDetalle,
                    idConcepto,
                    montoIncentivo,
                    descripcion || null,
                    anioCalculo
                ]
            );


            await db.commit();


            res.json({
                mensaje:
                    "Incentivo guardado correctamente"
            });


        }
        catch (error) {
            if (db) {
                try {
                    await db.rollback();
                } catch (errorRollback) {
                    console.error('Error al revertir la operación:', errorRollback);
                }
            }


            console.error(
                "Error al guardar incentivo:",
                error
            );


            res.status(500).json({
                error:
                    "No se pudo guardar el incentivo"
            });

        } finally {
            if (db) {
                db.release();
            }
        }

    }
);

// =====================================================
// LISTAR INCENTIVOS
// =====================================================

app.get(
    "/api/incentivos",
    (req, res) => {

        const {
            id_empleado,
            id_nomina
        } = req.query;


        if (
            !id_empleado ||
            !id_nomina
        ) {

            return res.status(400).json({
                error:
                    "Faltan datos para consultar los incentivos"
            });

        }


        const sql = `
            SELECT
                dc.id_detalle_concepto,
                dc.monto,
                dc.descripcion,
                dc.anio_calculo,
                cn.nombre AS concepto

            FROM detalle_concepto dc

            INNER JOIN concepto_nomina cn
                ON dc.id_concepto =
                   cn.id_concepto

            INNER JOIN detalle_nomina dn
                ON dc.id_detalle =
                   dn.id_detalle

            WHERE dn.id_empleado = ?

            AND dn.id_nomina = ?

            AND cn.nombre = 'Incentivo'

            ORDER BY
                dc.id_detalle_concepto DESC
        `;


        conexion.query(
            sql,
            [
                id_empleado,
                id_nomina
            ],
            (error, resultados) => {

                if (error) {

                    console.error(
                        "Error al consultar incentivos:",
                        error
                    );

                    return res.status(500).json({
                        error:
                            "No se pudieron cargar los incentivos"
                    });

                }


                res.json(resultados);

            }
        );

    }
);


// =====================================================
// ACTUALIZAR INCENTIVO
// =====================================================

app.put(
    "/api/incentivos/:id",
    async (req, res) => {

        const idIncentivo =
            req.params.id;


        const {
            monto,
            descripcion
        } = req.body;


        const montoNuevo =
            Number(monto);


        if (
            !Number.isFinite(montoNuevo) ||
            montoNuevo <= 0
        ) {

            return res.status(400).json({
                error:
                    "El monto debe ser mayor que cero"
            });

        }


        let db;

        try {
            db = await conexion.promise().getConnection();
            await db.beginTransaction();


            const [incentivos] =
                await db.query(
                    `
                    SELECT
                        dc.id_detalle_concepto,
                        n.estado

                    FROM detalle_concepto dc

                    INNER JOIN concepto_nomina cn
                        ON dc.id_concepto =
                           cn.id_concepto

                    INNER JOIN detalle_nomina dn
                        ON dc.id_detalle =
                           dn.id_detalle

                    INNER JOIN nomina n
                        ON dn.id_nomina =
                           n.id_nomina

                    WHERE dc.id_detalle_concepto = ?

                    AND cn.nombre = 'Incentivo'

                    LIMIT 1

                    FOR UPDATE
                    `,
                    [
                        idIncentivo
                    ]
                );


            if (
                incentivos.length === 0
            ) {

                await db.rollback();

                return res.status(404).json({
                    error:
                        "El incentivo no existe"
                });

            }


            if (
                incentivos[0].estado !== "Borrador"
            ) {

                await db.rollback();

                return res.status(409).json({
                    error:
                        "Solo se pueden modificar incentivos de una nómina en estado Borrador"
                });

            }


            await db.query(
                `
                UPDATE detalle_concepto
                SET
                    monto = ?,
                    descripcion = ?
                WHERE id_detalle_concepto = ?
                `,
                [
                    montoNuevo,
                    descripcion || null,
                    idIncentivo
                ]
            );


            await db.commit();


            res.json({
                mensaje:
                    "Incentivo actualizado correctamente"
            });


        }
        catch (error) {
            if (db) {
                try {
                    await db.rollback();
                } catch (errorRollback) {
                    console.error('Error al revertir la operación:', errorRollback);
                }
            }


            console.error(
                "Error al actualizar incentivo:",
                error
            );


            res.status(500).json({
                error:
                    "No se pudo actualizar el incentivo"
            });

        } finally {
            if (db) {
                db.release();
            }
        }

    }
);

// =====================================================
// ELIMINAR INCENTIVO
// =====================================================

app.delete(
    "/api/incentivos/:id",
    async (req, res) => {

        const idIncentivo =
            req.params.id;


        let db;

        try {
            db = await conexion.promise().getConnection();
            await db.beginTransaction();


            const [incentivos] =
                await db.query(
                    `
                    SELECT
                        dc.id_detalle_concepto,
                        n.estado

                    FROM detalle_concepto dc

                    INNER JOIN concepto_nomina cn
                        ON dc.id_concepto =
                           cn.id_concepto

                    INNER JOIN detalle_nomina dn
                        ON dc.id_detalle =
                           dn.id_detalle

                    INNER JOIN nomina n
                        ON dn.id_nomina =
                           n.id_nomina

                    WHERE dc.id_detalle_concepto = ?

                    AND cn.nombre = 'Incentivo'

                    LIMIT 1

                    FOR UPDATE
                    `,
                    [
                        idIncentivo
                    ]
                );


            if (
                incentivos.length === 0
            ) {

                await db.rollback();

                return res.status(404).json({
                    error:
                        "El incentivo no existe"
                });

            }


            if (
                incentivos[0].estado !== "Borrador"
            ) {

                await db.rollback();

                return res.status(409).json({
                    error:
                        "Solo se pueden eliminar incentivos de una nómina en estado Borrador"
                });

            }


            await db.query(
                `
                DELETE FROM detalle_concepto
                WHERE id_detalle_concepto = ?
                `,
                [
                    idIncentivo
                ]
            );


            await db.commit();


            res.json({
                mensaje:
                    "Incentivo eliminado correctamente"
            });


        }
        catch (error) {
            if (db) {
                try {
                    await db.rollback();
                } catch (errorRollback) {
                    console.error('Error al revertir la operación:', errorRollback);
                }
            }


            console.error(
                "Error al eliminar incentivo:",
                error
            );


            res.status(500).json({
                error:
                    "No se pudo eliminar el incentivo"
            });

        } finally {
            if (db) {
                db.release();
            }
        }

    }
);

require('./js/rutasNomina')(app, conexion);

app.listen(3001, () => {
    console.log('http://localhost:3001');
});
