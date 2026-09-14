// Formularios de acceso, contraseña y administración de usuarios.
document.addEventListener('DOMContentLoaded', async () => {
    localStorage.removeItem('password');
    const mensaje = document.getElementById('mensaje');
    const mostrar = (texto, error=false) => { mensaje.textContent=texto; mensaje.style.color=error?'#ff7676':'#86d36b'; };
    async function solicitar(url, metodo='GET', datos) {
        const respuesta=await fetch(url,{method:metodo,headers:{'Content-Type':'application/json'},body:datos===undefined?undefined:JSON.stringify(datos)});
        const resultado=await respuesta.json();
        if(!respuesta.ok) throw new Error(resultado.error || 'No se pudo completar la operación.');
        return resultado;
    }
    function enviar(form, operacion) {
        form.addEventListener('submit',async event=>{
            event.preventDefault();
            const boton=form.querySelector('button[type="submit"]');
            boton.disabled=true;
            mostrar('');
            try{await operacion();}catch(error){mostrar(error.message,true);}finally{boton.disabled=false;}
        });
    }
    const login=document.getElementById('loginForm');
    if(login) {
        enviar(login,async()=>{
            const cuenta=await solicitar('/api/login','POST',{usuario:document.getElementById('usuario').value.trim(),password:document.getElementById('password').value});
            location.href=cuenta.inicio;
        });
        document.querySelector('.forgot-password')?.addEventListener('click',e=>{e.preventDefault();mostrar('Contacte al administrador para recuperar su acceso.');});
        return;
    }
    let cuenta;
    try{cuenta=await solicitar('/api/sesion');}catch{location.href='/';return;}
    const cambio=document.getElementById('cambiarPasswordForm');
    if(cambio) enviar(cambio,async()=>{
        const nueva=document.getElementById('nuevaPassword').value;
        const confirmar=document.getElementById('confirmarPassword').value;
        if(nueva!==confirmar)throw Error('Las nuevas contraseñas no coinciden.');
        const resultado=await solicitar('/api/cambiar-password','POST',{actual:document.getElementById('passwordActual').value,nueva,confirmar});
        cambio.reset();mostrar(resultado.mensaje);
        setTimeout(()=>location.href='/',1500);
    });
    const usuarios = document.getElementById('usuariosForm');

if (usuarios) {

    async function cargarEmpleadosUsuario() {

        const empleados =
            await solicitar('/api/empleados');

        const select =
            document.getElementById('empleadoUsuario');

        select.innerHTML = `
            <option value="">
                Seleccione un empleado...
            </option>
        `;

        for (const empleado of empleados) {

            const opcion =
                document.createElement('option');

            opcion.value =
                empleado.id_empleado;

            opcion.textContent =
                `${empleado.nombres} ${empleado.apellidos}`;

            select.append(opcion);
        }
    }


    async function cargar() {

        const filas =
            await solicitar('/api/usuarios');

        const cuerpo =
            document.getElementById('usuariosBody');

        cuerpo.replaceChildren();

        for (const usuario of filas) {

            const tr =
                document.createElement('tr');


            for (
                const valor of [
                    usuario.usuario,
                    usuario.rol,
                    usuario.estado
                ]
            ) {

                const td =
                    document.createElement('td');

                td.textContent =
                    valor;

                tr.append(td);
            }


            const td =
                document.createElement('td');

            const boton =
                document.createElement('button');


            boton.textContent =
                usuario.estado === 'Activo'
                    ? 'Desactivar'
                    : 'Activar';


            boton.disabled =
                usuario.id_usuario ===
                cuenta.id_usuario;


            boton.addEventListener(
                'click',
                async () => {

                    boton.disabled = true;

                    try {

                        await solicitar(
                            '/api/usuarios/' +
                            usuario.id_usuario +
                            '/estado',
                            'PATCH',
                            {
                                estado:
                                    usuario.estado === 'Activo'
                                        ? 'Inactivo'
                                        : 'Activo'
                            }
                        );

                        await cargar();

                        mostrar(
                            'Estado actualizado.'
                        );

                    }
                    catch (e) {

                        mostrar(
                            e.message,
                            true
                        );

                        boton.disabled = false;
                    }
                }
            );


            td.append(boton);
            tr.append(td);

            cuerpo.append(tr);
        }
    }


    try {

        await cargarEmpleadosUsuario();
        await cargar();

    }
    catch (e) {

        mostrar(
            e.message,
            true
        );
    }


    enviar(
        usuarios,
        async () => {

            await solicitar(
                '/api/usuarios',
                'POST',
                {
                    id_empleado:
                        document.getElementById(
                            'empleadoUsuario'
                        ).value,

                    usuario:
                        document.getElementById(
                            'nuevoUsuario'
                        ).value.trim(),

                    password:
                        document.getElementById(
                            'passwordUsuario'
                        ).value,

                    rol:
                        document.getElementById(
                            'rolUsuario'
                        ).value
                }
            );


            usuarios.reset();

            await cargar();

            mostrar(
                'Usuario creado.'
            );
        }
    );
}
});
