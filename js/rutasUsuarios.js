const crypto = require('node:crypto');
const { promisify } = require('node:util');

// Convierte crypto.scrypt en una función compatible con async/await
const scrypt = promisify(crypto.scrypt);

// Configuración utilizada para generar y verificar las contraseñas
const OPCIONES = {
    N: 32768,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024
};


/* =========================================
PERMISOS DE LOS ROLES
========================================= */

const permisos = {

    // El administrador tiene acceso completo
    admin: {
        paginas: '*',

        reglas: [
            ['*', /.*/]
        ]
    },


    // El manager tiene acceso limitado
    manager: {

        paginas: [
            'empleados.html',
            'ingresoDeEmpleado.html',
            'verEmpleado.html',
            'asistencia.html'
        ],

        reglas: [

            [
                'GET',
                /^\/api\/empleados(?:\/\d+(?:\/tarifas)?)?$/
            ],

            [
                'GET',
                /^\/api\/(puestos|estados-empleado|asistencia)$/
            ],

            [
                'POST',
                /^\/(registrar|api\/asistencia)$/
            ]

        ]
    },


    // El viewer tiene permisos principalmente de consulta
    viewer: {

        paginas: [
            'empleados.html',
            'verEmpleado.html',
            'nomina.html',
            'verNomina.html'
        ],

        reglas: [

            [
                'GET',
                /^\/api\/empleados(?:\/\d+(?:\/tarifas)?)?$/
            ],

            [
                'GET',
                /^\/api\/nominas(?:\/\d+(?:\/calculo-regular)?)?$/
            ]

        ]
    }

};


/* =========================================
VERIFICAR PERMISOS
========================================= */

function permitido(rol, metodo, ruta) {

    return !!permisos[rol]?.reglas.some(

        ([m, patron]) =>

            (m === '*' || m === metodo) &&
            patron.test(ruta)

    );

}


/* =========================================
VALIDAR CONTRASEÑA
========================================= */

function validarPassword(password) {

    if (
        typeof password !== 'string' ||
        password.length < 10 ||
        password.length > 128
    ) {

        throw Object.assign(

            new Error(
                'La contraseña debe tener entre 10 y 128 caracteres.'
            ),

            {
                status: 400
            }

        );

    }

}


/* =========================================
CREAR HASH DE CONTRASEÑA
========================================= */

async function hashPassword(password) {

    // Se genera un salt aleatorio para la contraseña
    const sal =
        crypto.randomBytes(16).toString('hex');


    // Se genera el hash usando scrypt
    const hash =
        await scrypt(
            password,
            sal,
            64,
            OPCIONES
        );


    // Formato que se guardará en la base de datos
    return (
        `scrypt$${sal}$${hash.toString('hex')}`
    );

}


/* =========================================
VERIFICAR CONTRASEÑA
========================================= */

async function verificarPassword(
    password,
    guardada
) {

    // Verifica que el valor guardado tenga el formato esperado
    const valida =
        typeof guardada === 'string' &&
        /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/
            .test(guardada);


    // Se separan las partes del hash
    const [
        ,
        sal,
        hash
    ] = valida

        ? guardada.split('$')

        : [
            'scrypt',
            '0'.repeat(32),
            '0'.repeat(128)
        ];


    // Se genera nuevamente el hash usando la contraseña ingresada
    const prueba =
        await scrypt(
            password,
            sal,
            64,
            OPCIONES
        );


    // Se compara el hash calculado con el guardado
    return (

        crypto.timingSafeEqual(
            prueba,
            Buffer.from(hash, 'hex')
        ) &&

        valida

    );

}


/* =========================================
CONFIGURAR RUTAS DE USUARIOS
========================================= */

function registrarUsuarios(
    app,
    conexion
) {

    // Conexión MySQL usando promesas
    const db =
        conexion.promise();


    // Sesiones activas almacenadas temporalmente
    const sesiones =
        new Map();


    // Registro de intentos de login
    const intentos =
        new Map();


    // Nombre de la cookie utilizada para la sesión
    const cookie =
        'wayvvy_sesion';


    /* =========================================
    CONFIGURACIÓN DE COOKIE
    ========================================= */

    const opcionesCookie = req => ({

        httpOnly: true,

        sameSite: 'strict',

        secure: req.secure,

        path: '/'

    });


    /* =========================================
    OBTENER TOKEN DE LA COOKIE
    ========================================= */

    const tokenPeticion = req =>

        (req.headers.cookie || '')

            .split(';')

            .map(
                valor =>
                    valor.trim()
            )

            .find(
                valor =>
                    valor.startsWith(
                        cookie + '='
                    )
            )

            ?.slice(
                cookie.length + 1
            );


    /* =========================================
    CREAR CLAVE INTERNA DE LA SESIÓN
    ========================================= */

    const clave = token =>

        crypto
            .createHash('sha256')
            .update(token || '')
            .digest('hex');


    /* =========================================
    DATOS PÚBLICOS DEL USUARIO
    ========================================= */

    const publico = usuario => ({
        foto_perfil: usuario.foto_perfil || null,

        id_usuario:
            usuario.id_usuario,

        usuario:
            usuario.usuario,

        rol:
            usuario.rol,

        // Los administradores entran al Dashboard
        // Los demás entran a Empleados
        inicio:
            usuario.rol === 'admin'
                ? '/html/dashboard.html'
                : '/html/empleados.html'

    });


    /* =========================================
    LIMITAR INTENTOS DE LOGIN
    ========================================= */

    function limitar(
        req,
        res,
        next
    ) {

        const ahora =
            Date.now();


        // Elimina registros que ya vencieron
        for (
            const [ip, valor]
            of intentos
        ) {

            if (
                valor.fin < ahora
            ) {

                intentos.delete(ip);

            }

        }


        const ip =
            req.ip;


        const registro =
            intentos.get(ip) || {

                total: 0,

                fin:
                    ahora +
                    15 * 60 * 1000

            };


        // Máximo de intentos durante el período
        if (
            registro.total >= 30 ||
            intentos.size > 5000
        ) {

            return res
                .status(429)
                .json({
                    error:
                        'Demasiados intentos. Espere 15 minutos.'
                });

        }


        registro.total++;

        intentos.set(
            ip,
            registro
        );


        next();

    }


    /* =========================================
    MANEJO GENERAL DE ERRORES
    ========================================= */

    function ruta(fn) {

        return async (
            req,
            res,
            next
        ) => {

            try {

                await fn(
                    req,
                    res,
                    next
                );

            }
            catch (error) {

                const duplicado =
                    error.code ===
                    'ER_DUP_ENTRY';


                res
                    .status(
                        duplicado
                            ? 409
                            : error.status || 500
                    )
                    .json({

                        error:
                            duplicado
                                ? 'Ese usuario ya existe.'
                                : error.status
                                    ? error.message
                                    : 'No se pudo completar la operación de usuarios.'

                    });

            }

        };

    }


    /* =========================================
    EXIGIR ROL ADMIN
    ========================================= */

    const exigirAdmin =
        (
            req,
            res,
            next
        ) =>

            req.cuenta.rol === 'admin'

                ? next()

                : res
                    .status(403)
                    .json({
                        error:
                            'Acceso reservado al administrador.'
                    });


    /* =========================================
    PROTECCIÓN DE PETICIONES
    ========================================= */

    app.use(
        (
            req,
            res,
            next
        ) => {

            // Evita guardar respuestas sensibles en caché
            res.setHeader(
                'Cache-Control',
                'no-store'
            );


            // Valida el origen de peticiones que modifican datos
            if (
                ![
                    'GET',
                    'HEAD',
                    'OPTIONS'
                ].includes(
                    req.method
                )
            ) {

                if (
                    req.headers.origin !==
                    `${req.protocol}://${req.get('host')}`
                ) {

                    return res
                        .status(403)
                        .json({
                            error:
                                'Origen no permitido.'
                        });

                }

            }


            next();

        }
    );


    /* =========================================
    LOGIN
    ========================================= */

    app.post(
        '/api/login',

        limitar,

        ruta(
            async (
                req,
                res
            ) => {

                const {
                    usuario,
                    password
                } =
                    req.body || {};


                // Validación básica de los datos recibidos
                if (
                    typeof usuario !==
                        'string' ||
                    usuario.length > 50 ||
                    typeof password !==
                        'string' ||
                    password.length > 128
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Complete usuario y contraseña.'
                        });

                }


                // Buscar usuario y rol en la base de datos
                const [filas] =
                    await db.query(
                        `
                        SELECT
                            u.*,
                            r.nombre AS rol
                        FROM usuarios u
                        JOIN rol r
                            ON r.id_rol =
                            u.id_rol
                        WHERE u.usuario = ?
                        `,
                        [
                            usuario.trim()
                        ]
                    );


                const cuenta =
                    filas[0];


                // Comparar contraseña ingresada con el hash guardado
                const coincide =
                    await verificarPassword(
                        password,
                        cuenta?.password_hash
                    );


                // Verificar contraseña, estado y rol
                if (
                    !coincide ||
                    cuenta.estado !==
                        'Activo' ||
                    !permisos[
                        cuenta.rol
                    ]
                ) {

                    return res
                        .status(401)
                        .json({
                            error:
                                'Usuario o contraseña incorrectos.'
                        });

                }


                // Limpiar sesiones vencidas
                for (
                    const [id, sesion]
                    of sesiones
                ) {

                    if (
                        sesion.fin <
                        Date.now()
                    ) {

                        sesiones.delete(
                            id
                        );

                    }

                }


                // Evitar demasiadas sesiones almacenadas
                if (
                    sesiones.size >=
                    1000
                ) {

                    return res
                        .status(503)
                        .json({
                            error:
                                'Intente iniciar sesión más tarde.'
                        });

                }


                // Eliminar una sesión anterior del mismo navegador
                sesiones.delete(
                    clave(
                        tokenPeticion(req)
                    )
                );


                // Crear token aleatorio para la sesión
                const token =
                    crypto
                        .randomBytes(32)
                        .toString('hex');


                // Guardar sesión en memoria
                sesiones.set(
                    clave(token),
                    {

                        id:
                            cuenta.id_usuario,

                        hash:
                            cuenta.password_hash,

                        fin:
                            Date.now() +
                            8 * 3600000

                    }
                );


                // Registrar último acceso
                await db.query(
                    `
                    UPDATE usuarios
                    SET ultimo_acceso = NOW()
                    WHERE id_usuario = ?
                    `,
                    [
                        cuenta.id_usuario
                    ]
                );


                // Crear cookie de sesión
                res.cookie(
                    cookie,
                    token,
                    {
                        ...opcionesCookie(req),

                        maxAge:
                            8 * 3600000
                    }
                );


                // Enviar datos necesarios al frontend
                res.json(
                    publico(cuenta)
                );

            }
        )
    );


    /* =========================================
    VALIDAR SESIÓN
    ========================================= */

    app.use(
        ruta(
            async (
                req,
                res,
                next
            ) => {

                const id =
                    clave(
                        tokenPeticion(req)
                    );


                const sesion =
                    sesiones.get(id);


                let cuenta;


                // Buscar usuario si la sesión todavía es válida
                if (
                    sesion &&
                    sesion.fin >
                        Date.now()
                ) {

                    const [filas] =
                        await db.query(
                            `
                            SELECT
                                u.*,
                                r.nombre AS rol
                            FROM usuarios u
                            JOIN rol r
                                ON r.id_rol =
                                u.id_rol
                            WHERE
                                u.id_usuario = ?
                            `,
                            [
                                sesion.id
                            ]
                        );


                    cuenta =
                        filas[0];

                }


                // Validar cuenta y sesión
                if (
                    !cuenta ||
                    cuenta.estado !==
                        'Activo' ||
                    cuenta.password_hash !==
                        sesion?.hash ||
                    !permisos[
                        cuenta.rol
                    ]
                ) {

                    sesiones.delete(id);


                    res.clearCookie(
                        cookie,
                        opcionesCookie(req)
                    );


                    // Las páginas regresan al login
                    // Las APIs devuelven error 401
                    return req.path
                        .startsWith(
                            '/html/'
                        )

                        ? res.redirect('/')

                        : res
                            .status(401)
                            .json({
                                error:
                                    'Inicie sesión para continuar.'
                            });

                }


                req.cuenta =
                    cuenta;


                next();

            }
        )
    );


    /* =========================================
    CONSULTAR SESIÓN ACTUAL
    ========================================= */

    app.get(
        '/api/sesion',
        (
            req,
            res
        ) => {

            res.json(
                publico(
                    req.cuenta
                )
            );

        }
    );


    // El identificador procede de la sesión, nunca del formulario.
    app.post('/api/perfil/foto', ruta(async (req, res) => {
        const foto = req.body?.foto;
        if (typeof foto !== 'string' || foto.length > 70000 ||
            !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(foto)) {
            return res.status(400).json({error:'La imagen no es válida o es demasiado grande.'});
        }
        const bytes = Buffer.from(foto.split(',')[1], 'base64');
        if (bytes.length < 4 || bytes[0] !== 255 || bytes[1] !== 216 ||
            bytes[bytes.length-2] !== 255 || bytes[bytes.length-1] !== 217) {
            return res.status(400).json({error:'El formato de la imagen no es válido.'});
        }
        await db.query('UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?', [foto, req.cuenta.id_usuario]);
        res.json({mensaje:'Foto guardada.', foto_perfil:foto});
    }));

    /* =========================================
    CERRAR SESIÓN
    ========================================= */

    app.post(
        '/api/logout',
        (
            req,
            res
        ) => {

            sesiones.delete(
                clave(
                    tokenPeticion(req)
                )
            );


            res.clearCookie(
                cookie,
                opcionesCookie(req)
            );


            res.json({
                mensaje:
                    'Sesión cerrada.'
            });

        }
    );


    /* =========================================
    CAMBIAR CONTRASEÑA
    ========================================= */

    app.post(
        '/api/cambiar-password',
        exigirAdmin,

        limitar,

        ruta(
            async (
                req,
                res
            ) => {

                const {
                    actual,
                    nueva,
                    confirmar
                } =
                    req.body || {};


                validarPassword(
                    nueva
                );


                // Confirmar que ambas nuevas contraseñas coincidan
                if (
                    nueva !==
                    confirmar
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Las nuevas contraseñas no coinciden.'
                        });

                }


                // Verificar contraseña actual
                if (
                    typeof actual !==
                        'string' ||
                    actual.length >
                        128 ||
                    !await verificarPassword(
                        actual,
                        req.cuenta
                            .password_hash
                    )
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'La contraseña actual es incorrecta.'
                        });

                }


                // Impedir reutilizar la misma contraseña
                if (
                    actual === nueva
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'La nueva contraseña debe ser diferente.'
                        });

                }


                // Generar hash de la nueva contraseña
                const hash =
                    await hashPassword(
                        nueva
                    );


                // Actualizar la contraseña
                const [resultado] =
                    await db.query(
                        `
                        UPDATE usuarios
                        SET password_hash = ?
                        WHERE
                            id_usuario = ?
                            AND password_hash = ?
                        `,
                        [
                            hash,

                            req.cuenta
                                .id_usuario,

                            req.cuenta
                                .password_hash
                        ]
                    );


                if (
                    resultado
                        .affectedRows !== 1
                ) {

                    return res
                        .status(409)
                        .json({
                            error:
                                'La cuenta cambió. Inicie sesión nuevamente.'
                        });

                }


                // Cerrar todas las sesiones del usuario
                for (
                    const [id, sesion]
                    of sesiones
                ) {

                    if (
                        sesion.id ===
                        req.cuenta
                            .id_usuario
                    ) {

                        sesiones.delete(
                            id
                        );

                    }

                }


                res.clearCookie(
                    cookie,
                    opcionesCookie(req)
                );


                res.json({
                    mensaje:
                        'Contraseña cambiada. Inicie sesión nuevamente.'
                });

            }
        )
    );


    /* =========================================
    LISTAR USUARIOS
    ========================================= */

    app.get(
        '/api/usuarios',

        exigirAdmin,

        ruta(
            async (
                req,
                res
            ) => {

                const [filas] =
                    await db.query(
                        `
                        SELECT
                            u.id_usuario,
                            u.id_empleado,
                            u.usuario,
                            r.nombre AS rol,
                            u.estado,
                            u.ultimo_acceso
                        FROM usuarios u
                        JOIN rol r
                            ON r.id_rol =
                            u.id_rol
                        ORDER BY
                            u.id_usuario
                        `
                    );


                res.json(
                    filas
                );

            }
        )
    );


    /* =========================================
    CREAR USUARIO
    ========================================= */

    app.post(
        '/api/usuarios',

        exigirAdmin,

        ruta(
            async (
                req,
                res
            ) => {

                // Datos recibidos desde el formulario
                const {
                    id_empleado,
                    usuario,
                    password,
                    rol
                } =
                    req.body || {};


                // Convertir id_empleado a número
                const idEmpleado =
                    Number(
                        id_empleado
                    );


                // Validar empleado seleccionado
                if (
                    !Number.isSafeInteger(
                        idEmpleado
                    ) ||
                    idEmpleado < 1
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Seleccione un empleado válido.'
                        });

                }


                // Validar nombre de usuario
                if (
                    typeof usuario !==
                        'string' ||
                    !/^[a-zA-Z0-9_.-]{3,50}$/
                        .test(usuario)
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Use entre 3 y 50 letras, números, puntos, guiones o guiones bajos.'
                        });

                }


                // Validar rol
                if (
                    !Object.hasOwn(
                        permisos,
                        rol
                    )
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Seleccione un rol válido.'
                        });

                }


                // Validar longitud de contraseña
                validarPassword(
                    password
                );


                // Confirmar que el empleado existe
                const [empleados] =
                    await db.query(
                        `
                        SELECT id_empleado
                        FROM empleados
                        WHERE id_empleado = ?
                        LIMIT 1
                        `,
                        [
                            idEmpleado
                        ]
                    );


                if (
                    !empleados.length
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'El empleado seleccionado no existe.'
                        });

                }


                // Buscar el ID correspondiente al rol
                const [roles] =
                    await db.query(
                        `
                        SELECT id_rol
                        FROM rol
                        WHERE nombre = ?
                        LIMIT 1
                        `,
                        [
                            rol
                        ]
                    );


                if (
                    !roles.length
                ) {

                    return res
                        .status(409)
                        .json({
                            error:
                                'Falta preparar los roles en la base de datos.'
                        });

                }


                // Convertir contraseña en hash antes de guardarla
                const hash =
                    await hashPassword(
                        password
                    );


                // Guardar usuario asociado al empleado seleccionado
                await db.query(
                    `
                    INSERT INTO usuarios
                    (
                        id_empleado,
                        id_rol,
                        usuario,
                        password_hash,
                        estado
                    )
                    VALUES
                    (
                        ?,
                        ?,
                        ?,
                        ?,
                        'Activo'
                    )
                    `,
                    [
                        idEmpleado,
                        roles[0].id_rol,
                        usuario,
                        hash
                    ]
                );


                res
                    .status(201)
                    .json({
                        mensaje:
                            'Usuario creado.'
                    });

            }
        )
    );


    /* =========================================
    ACTIVAR O DESACTIVAR USUARIO
    ========================================= */

    app.patch(
        '/api/usuarios/:id/estado',

        exigirAdmin,

        ruta(
            async (
                req,
                res
            ) => {

                const id =
                    Number(
                        req.params.id
                    );


                // Validar usuario y nuevo estado
                if (
                    !Number.isSafeInteger(
                        id
                    ) ||
                    id < 1 ||
                    ![
                        'Activo',
                        'Inactivo'
                    ].includes(
                        req.body?.estado
                    )
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'Usuario o estado inválido.'
                        });

                }


                // El administrador no puede desactivarse a sí mismo
                if (
                    id ===
                    req.cuenta
                        .id_usuario
                ) {

                    return res
                        .status(400)
                        .json({
                            error:
                                'No puede desactivar su propia cuenta.'
                        });

                }


                const cx =
                    await db
                        .getConnection();


                try {

                    await cx
                        .beginTransaction();


                    // Bloquear el rol admin durante la operación
                    await cx.query(
                        `
                        SELECT id_rol
                        FROM rol
                        WHERE nombre = 'admin'
                        FOR UPDATE
                        `
                    );


                    // Obtener administradores activos
                    const [admins] =
                        await cx.query(
                            `
                            SELECT
                                u.id_usuario
                            FROM usuarios u
                            JOIN rol r
                                ON r.id_rol =
                                u.id_rol
                            WHERE
                                r.nombre =
                                    'admin'
                                AND
                                u.estado =
                                    'Activo'
                            FOR UPDATE
                            `
                        );


                    // Confirmar que la cuenta actual sigue siendo admin
                    if (
                        !admins.some(
                            admin =>
                                admin.id_usuario ===
                                req.cuenta
                                    .id_usuario
                        )
                    ) {

                        throw Object.assign(
                            new Error(
                                'Su cuenta ya no tiene acceso.'
                            ),
                            {
                                status: 403
                            }
                        );

                    }


                    // Evitar eliminar el último administrador activo
                    if (
                        req.body.estado ===
                            'Inactivo' &&
                        admins.length === 1 &&
                        admins[0]
                            .id_usuario === id
                    ) {

                        throw Object.assign(
                            new Error(
                                'Debe conservar un administrador activo.'
                            ),
                            {
                                status: 400
                            }
                        );

                    }


                    // Actualizar estado del usuario
                    const [resultado] =
                        await cx.query(
                            `
                            UPDATE usuarios
                            SET estado = ?
                            WHERE id_usuario = ?
                            `,
                            [
                                req.body
                                    .estado,

                                id
                            ]
                        );


                    if (
                        !resultado
                            .affectedRows
                    ) {

                        throw Object.assign(
                            new Error(
                                'El usuario no existe.'
                            ),
                            {
                                status: 404
                            }
                        );

                    }


                    await cx.commit();

                }
                catch (error) {

                    await cx.rollback();

                    throw error;

                }
                finally {

                    cx.release();

                }


                // Eliminar sesiones activas del usuario modificado
                for (
                    const [
                        token,
                        sesion
                    ]
                    of sesiones
                ) {

                    if (
                        sesion.id === id
                    ) {

                        sesiones.delete(
                            token
                        );

                    }

                }


                res.json({
                    mensaje:
                        'Estado actualizado.'
                });

            }
        )
    );




    // Borrar únicamente la cuenta de acceso, conservando el empleado.
    app.delete('/api/usuarios/:id', exigirAdmin, ruta(async (req, res) => {
        const id = Number(req.params.id);
        if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1)
            return res.status(400).json({error:'Usuario inválido.'});
        if (id === req.cuenta.id_usuario)
            return res.status(400).json({error:'No puedes borrar tu propia cuenta.'});
        const cx = await db.getConnection();
        try {
            await cx.beginTransaction();
            // Coordinar con cambios de rol y desactivaciones concurrentes.
            await cx.query("SELECT id_rol FROM rol WHERE nombre = 'admin' FOR UPDATE");
            const [admins] = await cx.query("SELECT u.id_usuario FROM usuarios u JOIN rol r ON r.id_rol = u.id_rol WHERE r.nombre = 'admin' AND u.estado = 'Activo' FOR UPDATE");
            if (!admins.some(a => a.id_usuario === req.cuenta.id_usuario))
                throw Object.assign(new Error('Su cuenta ya no tiene acceso.'), {status:403});
            const [cuentas] = await cx.query('SELECT id_usuario FROM usuarios WHERE id_usuario = ? FOR UPDATE', [id]);
            if (!cuentas.length) throw Object.assign(new Error('El usuario no existe.'), {status:404});
            if (admins.length === 1 && admins[0].id_usuario === id)
                throw Object.assign(new Error('Debe conservar un administrador activo.'), {status:400});
            // Conservar también la autoría de los cambios salariales.
            const [historial] = await cx.query('SELECT registrado_por FROM historial_salario WHERE registrado_por = ? LIMIT 1 FOR UPDATE', [id]);
            if (historial.length)
                throw Object.assign(new Error('Este usuario tiene historial asociado. Puedes desactivarlo.'), {status:409});
            const [resultado] = await cx.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
            if (resultado.affectedRows !== 1)
                throw Object.assign(new Error('El usuario no existe.'), {status:404});
            await cx.commit();
        } catch (error) {
            await cx.rollback();
            if (error.code === 'ER_ROW_IS_REFERENCED_2')
                return res.status(409).json({error:'Este usuario tiene historial asociado. Puedes desactivarlo.'});
            throw error;
        } finally { cx.release(); }
        for (const [token, sesion] of sesiones) if (sesion.id === id) sesiones.delete(token);
        res.json({mensaje:'Usuario eliminado.'});
    }));

    // Editar la cuenta completa: solo administradores.
    app.patch('/api/usuarios/:id', exigirAdmin, limitar, ruta(async (req, res) => {
        const id = Number(req.params.id);
        const {usuario, rol, nueva = '', confirmar = ''} = req.body || {};
        if (!/^\d+$/.test(req.params.id) || !Number.isSafeInteger(id) || id < 1)
            return res.status(400).json({error:'Usuario inválido.'});
        if (typeof usuario !== 'string' || !/^[a-zA-Z0-9_.-]{3,50}$/.test(usuario))
            return res.status(400).json({error:'Use entre 3 y 50 letras, números, puntos, guiones o guiones bajos.'});
        if (typeof rol !== 'string' || !Object.hasOwn(permisos, rol))
            return res.status(400).json({error:'Seleccione un rol válido.'});
        if (nueva !== '') validarPassword(nueva);
        if (nueva !== confirmar)
            return res.status(400).json({error:'Las contraseñas no coinciden.'});
        const hash = nueva === '' ? null : await hashPassword(nueva);
        const cx = await db.getConnection();
        try {
            await cx.beginTransaction();
            // Mismo bloqueo que al desactivar: protege al último admin.
            await cx.query("SELECT id_rol FROM rol WHERE nombre = 'admin' FOR UPDATE");
            const [admins] = await cx.query("SELECT u.id_usuario FROM usuarios u JOIN rol r ON r.id_rol = u.id_rol WHERE r.nombre = 'admin' AND u.estado = 'Activo' FOR UPDATE");
            if (!admins.some(a => a.id_usuario === req.cuenta.id_usuario))
                throw Object.assign(new Error('Su cuenta ya no tiene acceso.'), {status:403});
            const [actual] = await cx.query('SELECT id_usuario FROM usuarios WHERE id_usuario = ? FOR UPDATE', [id]);
            if (!actual.length) throw Object.assign(new Error('El usuario no existe.'), {status:404});
            if (rol !== 'admin' && admins.length === 1 && admins[0].id_usuario === id)
                throw Object.assign(new Error('Debe conservar un administrador activo.'), {status:400});
            const [roles] = await cx.query('SELECT id_rol FROM rol WHERE nombre = ?', [rol]);
            if (!roles.length) throw Object.assign(new Error('Seleccione un rol válido.'), {status:400});
            await cx.query('UPDATE usuarios SET usuario = ?, id_rol = ?, password_hash = COALESCE(?, password_hash) WHERE id_usuario = ?', [usuario, roles[0].id_rol, hash, id]);
            await cx.commit();
        } catch (error) {
            await cx.rollback();
            if (error.code === 'ER_DUP_ENTRY')
                return res.status(409).json({error:'Ese nombre de usuario ya existe.'});
            throw error;
        } finally { cx.release(); }
        for (const [token, sesion] of sesiones) if (sesion.id === id) sesiones.delete(token);
        const propia = id === req.cuenta.id_usuario;
        if (propia) res.clearCookie(cookie, opcionesCookie(req));
        res.json({mensaje:'Usuario actualizado. Debe iniciar sesión nuevamente.', cerrar_sesion:propia});
    }));

    app.patch('/api/usuarios/:id/password', exigirAdmin, limitar, ruta(async (req,res) => {
        const id=Number(req.params.id);
        if(!/^\d+$/.test(req.params.id)||!Number.isSafeInteger(id)||id<1)
            return res.status(400).json({error:'Usuario inválido.'});
        const {nueva,confirmar}=req.body || {};
        validarPassword(nueva);
        if(nueva!==confirmar)return res.status(400).json({error:'Las contraseñas no coinciden.'});
        const hash=await hashPassword(nueva);
        const [resultado]=await db.query('UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?', [hash,id]);
        if(!resultado.affectedRows)return res.status(404).json({error:'El usuario no existe.'});
        // La nueva clave invalida las sesiones anteriores de esa cuenta.
        for(const [token,sesion] of sesiones)if(sesion.id===id)sesiones.delete(token);
        const propia=id===req.cuenta.id_usuario;
        if(propia)res.clearCookie(cookie,opcionesCookie(req));
        res.json({mensaje:'Contraseña actualizada.',cerrar_sesion:propia});
    }));

    /* =========================================
    CONTROL DE ACCESO A PÁGINAS Y APIs
    ========================================= */

    app.use(
        (
            req,
            res,
            next
        ) => {

            if(req.path === '/html/cambiarContrasena.html' && req.cuenta.rol !== 'admin')
                return res.status(403).send('El administrador gestiona los cambios de contraseña.');
            // Verificar páginas HTML protegidas
            if (
                req.path.startsWith(
                    '/html/'
                )
            ) {

                const pagina =
                    req.path.slice(6);


                if (
                    pagina ===
                        'cambiarContrasena.html' || pagina === 'configuracion.html' ||

                    permisos[
                        req.cuenta.rol
                    ].paginas === '*' ||

                    permisos[
                        req.cuenta.rol
                    ].paginas.includes(
                        pagina
                    )
                ) {

                    // Solo admin puede editar empleados existentes
                    if (
                        pagina ===
                            'ingresoDeEmpleado.html' &&

                        req.query.id &&

                        req.cuenta.rol !==
                            'admin'
                    ) {

                        return res
                            .status(403)
                            .send(
                                'No tiene permiso para editar empleados.'
                            );

                    }


                    return next();

                }

            }

            // Verificar permisos sobre rutas API
            else if (
                permitido(
                    req.cuenta.rol,
                    req.method,
                    req.path
                )
            )
            {

                return next();

            }


            // Bloquear cualquier acceso no autorizado
            res
                .status(403)
                .json({
                    error:
                        'Su rol no permite esta operación.'
                });

        }
    );

}


/* =========================================
EXPORTAR FUNCIONES
========================================= */

module.exports =
    registrarUsuarios;

module.exports.permitido =
    permitido;

module.exports.hashPassword =
    hashPassword;

module.exports.verificarPassword =
    verificarPassword;