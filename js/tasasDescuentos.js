// Historial inmutable de parámetros: no contiene contraseñas ni datos de empleados.
const inicial = {
    afp:'2.87', sfs:'3.04', tope_afp:'464460.00', tope_sfs:'232230.00',
    exento:'416220.00', limite1:'624329.00', limite2:'867123.00',
    tasa1:'15.00', tasa2:'20.00', tasa3:'25.00', cuota2:'31216.00', cuota3:'79776.00'
};
function validar(datos) {
    if (!datos || typeof datos !== 'object') throw Error('Revise los valores de las tasas.');
    const resultado = {};
    for (const campo of Object.keys(inicial)) {
        const texto = String(datos[campo] ?? '');
        if (!/^\d{1,9}(\.\d{1,2})?$/.test(texto)) throw Error('Revise los valores de las tasas.');
        const valor = Number(texto);
        if ((['afp','sfs','tasa1','tasa2','tasa3'].includes(campo) && valor > 100)
            || (campo.startsWith('tope_') && valor <= 0)) throw Error('Revise los valores de las tasas.');
        resultado[campo] = valor.toFixed(2);
    }
    if (Number(resultado.afp)+Number(resultado.sfs) >= 100
        || Number(resultado.exento) >= Number(resultado.limite1)
        || Number(resultado.limite1) >= Number(resultado.limite2)
        || Number(resultado.cuota2) > Number(resultado.limite1)
        || Number(resultado.cuota3) > Number(resultado.limite2)) throw Error('Revise los límites y porcentajes.');
    return resultado;
}
async function cargar(db) {
    const [filas] = await db.query("SELECT id_tasa, DATE_FORMAT(vigente_desde,'%Y-%m-%d') vigente_desde, parametros, motivo, creado_por, creado_en FROM tasas_descuentos ORDER BY vigente_desde");
    return filas.map(f => ({...f, parametros: typeof f.parametros === 'string' ? JSON.parse(f.parametros) : f.parametros}));
}
function elegir(versiones, mes) {
    const version = [...versiones].reverse().find(v => v.vigente_desde <= mes+'-01');
    if (!version) {
        const error = new Error('Falta configurar las tasas y los topes para el mes '+mes+'.');
        error.codigo = 'TASAS_NO_CONFIGURADAS'; throw error;
    }
    return version;
}
function registrar(app, conexion) {
    const db = conexion.promise();
    const admin = (req,res,next) => req.cuenta?.rol === 'admin' ? next() : res.status(403).json({error:'Acceso reservado al administrador.'});
    app.get('/api/tasas-descuentos', admin, async (req,res) => {
        try { res.json(await cargar(db)); }
        catch { res.status(500).json({error:'No se pudo cargar el historial de tasas.'}); }
    });
    app.post('/api/tasas-descuentos', admin, async (req,res) => {
        let parametros;
        const {vigente_desde, motivo, ultima_version} = req.body || {};
        try {
            parametros = validar(req.body?.parametros);
            if (typeof vigente_desde !== 'string' || !/^20\d{2}-(0[1-9]|1[0-2])-01$/.test(vigente_desde))
                throw Error('La vigencia debe comenzar el primer día de un mes.');
            if (typeof motivo !== 'string' || !motivo.trim() || motivo.length > 250) throw Error('Escriba un motivo de hasta 250 caracteres.');
            if (!Number.isSafeInteger(ultima_version)) throw Error('Recargue el historial antes de guardar.');
        } catch(error) { return res.status(400).json({error:error.message}); }
        let cx;
        try {
            cx = await db.getConnection(); await cx.beginTransaction();
            await cx.query("SELECT id_rol FROM rol WHERE nombre='admin' FOR UPDATE");
            const [autor] = await cx.query("SELECT u.usuario FROM usuarios u JOIN rol r ON r.id_rol=u.id_rol WHERE u.id_usuario=? AND u.estado='Activo' AND r.nombre='admin' FOR UPDATE",[req.cuenta.id_usuario]);
            if (!autor.length) throw Object.assign(Error('Su cuenta ya no tiene acceso.'),{status:403});
            const [ultimas] = await cx.query("SELECT id_tasa, DATE_FORMAT(vigente_desde,'%Y-%m-%d') vigente_desde FROM tasas_descuentos ORDER BY vigente_desde DESC LIMIT 1 FOR UPDATE");
            if (!ultimas.length || ultimas[0].id_tasa !== ultima_version) throw Object.assign(Error('El historial cambió. Recárguelo antes de guardar.'),{status:409});
            const [[hoy]] = await cx.query("SELECT DATE_FORMAT(CURDATE(),'%Y-%m-01') mes");
            if (vigente_desde <= hoy.mes || vigente_desde <= ultimas[0].vigente_desde)
                throw Object.assign(Error('Seleccione un mes futuro posterior a la última versión.'),{status:409});
            await cx.query('INSERT INTO tasas_descuentos (vigente_desde,parametros,motivo,creado_por) VALUES (?,?,?,?)',
                [vigente_desde,JSON.stringify(parametros),motivo.trim(),autor[0].usuario]);
            await cx.commit(); res.status(201).json({mensaje:'Nueva versión de tasas guardada.'});
        } catch(error) {
            if(cx) await cx.rollback();
            res.status(error.status || (error.code==='ER_DUP_ENTRY'?409:500)).json({error:error.status?error.message:'No se pudo guardar la versión de tasas.'});
        } finally { if(cx) cx.release(); }
    });
}
module.exports = {inicial,validar,cargar,elegir,registrar};
