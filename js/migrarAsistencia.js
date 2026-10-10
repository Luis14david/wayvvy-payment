const fs = require('node:fs');
const path = require('node:path');
const conexion = require('./conexion');

// Sin --aplicar, solamente revisa los datos.
async function migrar() {
    const db = conexion.promise();
    const [filas] = await db.query('SELECT * FROM asistencia ORDER BY id_asistencia');
    const [esquema] = await db.query('SHOW CREATE TABLE asistencia');
    for (const fila of filas) {
        for (const campo of ['minutos_regulares', 'minutos_extras']) {
            if (fila[campo] != null && (!Number.isInteger(fila[campo]) || fila[campo] < 0 || fila[campo] > 1440)) {
                throw new Error(`Revise los minutos de la asistencia ${fila.id_asistencia}.`);
            }
        }
        if (fila.minutos_regulares != null && fila.minutos_extras != null &&
            fila.minutos_regulares + fila.minutos_extras > 1440) {
            throw new Error(`La asistencia ${fila.id_asistencia} supera 24 horas.`);
        }
        const minutos = ['horas_trabajadas', 'horas_extras'].map(campo => Number(fila[campo] ?? 0) * 60);
        if (minutos.some(valor => !Number.isFinite(valor) || valor < 0 || Math.abs(valor - Math.round(valor)) > 0.000001) ||
            minutos[0] + minutos[1] > 1440) {
            // Si ya tiene minutos válidos, las horas decimales son solo una copia aproximada.
            if (!(Number.isInteger(fila.minutos_regulares) && Number.isInteger(fila.minutos_extras) &&
                fila.minutos_regulares >= 0 && fila.minutos_extras >= 0 && fila.minutos_regulares + fila.minutos_extras <= 1440)) {
                throw new Error(`Revise la asistencia ${fila.id_asistencia}: no puede convertirse sin interpretar o redondear datos.`);
            }
        }
    }
    console.log(`${filas.length} registros revisados.`);
    if (!process.argv.includes('--aplicar')) {
        console.log('Revisión terminada. No se modificó la base de datos.');
        return;
    }
    const carpetaRespaldo = path.resolve(__dirname, '..', '..', 'respaldos-wayvvy');
    fs.mkdirSync(carpetaRespaldo, { recursive: true });
    const respaldo = path.join(carpetaRespaldo, `respaldo-asistencia-${Date.now()}.json`);
    fs.writeFileSync(respaldo, JSON.stringify({ esquema, filas }, null, 2), { flag: 'wx' });
    console.log(`Respaldo de asistencia: ${respaldo}`);
    const [columnas] = await db.query('SHOW COLUMNS FROM asistencia');
    for (const campo of ['minutos_regulares', 'minutos_extras']) {
        if (!columnas.some(columna => columna.Field === campo)) {
            await db.query(`ALTER TABLE asistencia ADD COLUMN ${campo} INT UNSIGNED NULL`);
        }
    }
    await db.query(`UPDATE asistencia SET
        minutos_regulares = COALESCE(minutos_regulares, ROUND(COALESCE(horas_trabajadas, 0) * 60)),
        minutos_extras = COALESCE(minutos_extras, ROUND(COALESCE(horas_extras, 0) * 60))
        WHERE minutos_regulares IS NULL OR minutos_extras IS NULL`);
    console.log('Migración completada. Ya puede iniciar el servidor actualizado.');
}

migrar().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
}).finally(() => conexion.end());
