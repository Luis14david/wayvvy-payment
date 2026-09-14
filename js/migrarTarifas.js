const fs = require('node:fs');
const path = require('node:path');
const { validarMonto, fechaInicioPermitida, validarFecha } = require('./tarifas');

async function migrar(conexion, aplicar = false) {
    const db = await conexion.promise().getConnection();
    let iniciada = false;
    try {
        const [empleados] = await db.query(`SELECT id_empleado, salario_base,
            DATE_FORMAT(fecha_ingreso, '%Y-%m-%d') AS fecha_ingreso FROM empleados ORDER BY id_empleado`);
        const [historial] = await db.query(`SELECT *, DATE_FORMAT(fecha_inicio, '%Y-%m-%d') AS fecha_inicio FROM historial_salario`);
        const claves = new Set();
        for (const fila of historial) {
            const clave = `${fila.id_empleado}/${fila.fecha_inicio}`;
            if (!validarFecha(fila.fecha_inicio) || claves.has(clave)) throw new Error('Hay fechas inválidas o duplicadas en el historial. Revísalas antes de migrar.');
            validarMonto(fila.salario);
            claves.add(clave);
        }
        const pendientes = empleados.filter(empleado => !historial.some(fila => fila.id_empleado === empleado.id_empleado));
        for (const empleado of pendientes) {
            try {
                validarMonto(empleado.salario_base);
                fechaInicioPermitida(empleado.fecha_ingreso);
            } catch (error) { throw new Error(`Empleado ${empleado.id_empleado}: ${error.message}`); }
        }
        console.log(`${empleados.length} empleados revisados; ${pendientes.length} tarifas iniciales por registrar.`);
        console.log('Vigencia: 25 de agosto de 2026, o fecha de ingreso si es posterior.');
        if (!aplicar) {
            console.log('Revisión terminada. No se modificó la base de datos.');
            return;
        }
        // Respaldar fuera de la carpeta que Express publica.
        const [empleadosCompletos] = await db.query('SELECT * FROM empleados');
        const [estructura] = await db.query('SHOW CREATE TABLE historial_salario');
        const carpeta = path.resolve(__dirname, '..', '..', 'respaldos-wayvvy');
        fs.mkdirSync(carpeta, { recursive: true });
        const archivo = path.join(carpeta, `tarifas-${Date.now()}.json`);
        fs.writeFileSync(archivo, JSON.stringify({ estructura, empleados: empleadosCompletos, historial }, null, 2), { flag: 'wx' });
        console.log(`Respaldo: ${archivo}`);
        const [columnas] = await db.query('SHOW COLUMNS FROM historial_salario');
        if (columnas.find(columna => columna.Field === 'registrado_por')?.Null === 'NO') {
            // No atribuir cambios a un usuario cuando todavía no existe una sesión autenticada.
            await db.query('ALTER TABLE historial_salario MODIFY registrado_por INT NULL');
        }
        const [indices] = await db.query('SHOW INDEX FROM historial_salario');
        if (!indices.some(indice => indice.Key_name === 'uq_historial_empleado_fecha')) {
            await db.query('ALTER TABLE historial_salario ADD UNIQUE KEY uq_historial_empleado_fecha (id_empleado, fecha_inicio)');
        }
        await db.beginTransaction();
        iniciada = true;
        for (const empleado of pendientes) {
            const [filas] = await db.query('SELECT id_historial FROM historial_salario WHERE id_empleado = ? LIMIT 1', [empleado.id_empleado]);
            if (filas.length) continue;
            await db.query(`INSERT INTO historial_salario
                (id_empleado, fecha_inicio, salario, motivo_cambio, registrado_por)
                VALUES (?, ?, ?, 'Tarifa inicial confirmada para el inicio del control', NULL)`,
                [empleado.id_empleado, fechaInicioPermitida(empleado.fecha_ingreso), validarMonto(empleado.salario_base)]);
        }
        await db.commit();
        iniciada = false;
        console.log('Historial inicial creado. Las tarifas ya existentes se conservaron.');
    } catch (error) {
        if (iniciada) await db.rollback();
        throw error;
    } finally { db.release(); }
}

module.exports = migrar;
if (require.main === module) {
    const conexion = require('./conexion');
    migrar(conexion, process.argv.includes('--aplicar'))
        .catch(error => { console.error(error.message); process.exitCode = 1; })
        .finally(() => conexion.end());
}
