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

        function limpiarLogin() {
        document.getElementById('usuario').value = '';
        document.getElementById('password').value = '';
    }

    limpiarLogin();
    window.addEventListener('pageshow', limpiarLogin);


        enviar(login,async()=>{
            const cuenta=await solicitar('/api/login','POST',{usuario:document.getElementById('usuario').value.trim(),password:document.getElementById('password').value});
            location.href=cuenta.inicio;
        });
        document.querySelector('.forgot-password')?.addEventListener('click',e=>{e.preventDefault();mostrar('Contacte al administrador para recuperar su acceso.');});
        return;
    }
    let cuenta;
    try{cuenta=await solicitar('/api/sesion');}catch{location.href='/';return;}
    const fotoForm = document.getElementById('fotoPerfilForm');
    if (fotoForm) {
        if (cuenta.rol === 'admin') {
            const enlace = document.createElement('a');
            enlace.href = '/html/usuarios.html';
            enlace.className = 'change-photo-button';
            enlace.textContent = 'Administrar usuarios';
            const tarjeta = document.querySelector('a[href="/html/cambiarContrasena.html"]')?.closest('.settings-card');
            (tarjeta || fotoForm.parentElement).append(enlace);
        }
        const input = document.getElementById('imagenPerfil');
        const vista = document.getElementById('vistaFoto');
        const inicial = document.getElementById('inicialFoto');
        const aviso = document.getElementById('mensajeFoto');
        const boton = fotoForm.querySelector('button');
        let pendiente = null;
        let version = 0;
        function mostrarFoto(foto) {
            vista.hidden = !foto; inicial.hidden = !!foto;
            if (foto) vista.src = foto;
            inicial.textContent = cuenta.usuario.slice(0,1).toUpperCase();
        }
        mostrarFoto(cuenta.foto_perfil);
        boton.disabled = true;
        input.addEventListener('change', async () => {
            const actual = ++version;
            pendiente = null; boton.disabled = true; aviso.textContent = '';
            const archivo = input.files[0];
            if (!archivo) { mostrarFoto(cuenta.foto_perfil); return; }
            try {
                if (!['image/jpeg','image/png','image/webp'].includes(archivo.type) || archivo.size > 5*1024*1024)
                    throw Error('Selecciona una imagen JPG, PNG o WebP de hasta 5 MB.');
                // Reducir la imagen antes de enviarla: una foto de perfil no necesita tamaño original.
                const imagen = await createImageBitmap(archivo);
                if (actual !== version) {imagen.close();return;}
                const canvas = document.createElement('canvas');canvas.width=192;canvas.height=192;
                const ctx=canvas.getContext('2d');ctx.fillStyle='#11141b';ctx.fillRect(0,0,192,192);
                const lado=Math.min(imagen.width,imagen.height);
                ctx.drawImage(imagen,(imagen.width-lado)/2,(imagen.height-lado)/2,lado,lado,0,0,192,192);
                imagen.close();
                pendiente=canvas.toDataURL('image/jpeg',0.8);
                if(pendiente.length>70000) throw Error('La imagen es demasiado compleja. Selecciona otra.');
                mostrarFoto(pendiente);boton.disabled=false;
            } catch(error) {if(actual===version){pendiente=null;aviso.textContent=error.message;mostrarFoto(cuenta.foto_perfil);}}
        });
        fotoForm.addEventListener('submit', async e => {
            e.preventDefault();if(!pendiente)return;
            boton.disabled=true;input.disabled=true;aviso.textContent='Guardando…';
            try {
                const r=await solicitar('/api/perfil/foto','POST',{foto:pendiente});
                cuenta.foto_perfil=r.foto_perfil;pendiente=null;input.value='';
                aviso.textContent=r.mensaje;
                document.dispatchEvent(new CustomEvent('foto-perfil-actualizada',{detail:r.foto_perfil}));
            }catch(error){aviso.textContent=error.message;}
            finally{input.disabled=false;boton.disabled=!pendiente;}
        });
    }
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
    if (cuenta.rol !== 'admin') { usuarios.hidden = true; return; }
    const dialogo=document.createElement('dialog');
    dialogo.style.cssText='background:#11141b;color:white;border:1px solid #444;border-radius:12px;padding:24px;width:min(420px,85vw)';
    dialogo.innerHTML=`<form id="claveAdminForm" autocomplete="off">
        <h2 id="tituloClaveAdmin">Editar usuario</h2>
        <label for="editarUsername">Nombre de usuario</label>
        <input id="editarUsername" type="text" autocomplete="off" minlength="3" maxlength="50" required style="display:block;width:100%;box-sizing:border-box;margin:12px 0;padding:10px">
        <label for="editarRol">Rol</label>
        <select id="editarRol" style="display:block;width:100%;box-sizing:border-box;margin:12px 0;padding:10px">
            <option value="admin">Admin</option><option value="manager">Manager</option><option value="viewer">Viewer</option>
        </select>
        <p>Deja la contraseña vacía para conservar la actual.</p>
        <label for="claveAdminNueva">Nueva contraseña</label>
        <input id="claveAdminNueva" type="password" autocomplete="new-password" minlength="10" maxlength="128" style="display:block;width:100%;box-sizing:border-box;margin:12px 0;padding:10px">
        <label for="claveAdminConfirmar">Confirmar contraseña</label>
        <input id="claveAdminConfirmar" type="password" autocomplete="new-password" minlength="10" maxlength="128" style="display:block;width:100%;box-sizing:border-box;margin:12px 0;padding:10px">
        <p id="avisoClaveAdmin" role="status"></p>
        <button type="button" id="cancelarClaveAdmin">Cancelar</button>
        <button type="submit">Guardar cambios</button>
    </form>`;
    dialogo.setAttribute('aria-labelledby','tituloClaveAdmin');document.body.append(dialogo);
    const formClave=dialogo.querySelector('form');
    let destino=null,guardando=false;
    const avisoClave=dialogo.querySelector('#avisoClaveAdmin');
    dialogo.querySelector('#cancelarClaveAdmin').onclick=()=>dialogo.close();
    dialogo.addEventListener('cancel',e=>{if(guardando)e.preventDefault();});
    dialogo.addEventListener('close',()=>{formClave.reset();destino=null;avisoClave.textContent='';});
    formClave.addEventListener('submit',async e=>{
        e.preventDefault();if(guardando||!destino)return;
        const nueva=dialogo.querySelector('#claveAdminNueva').value;
        const confirmar=dialogo.querySelector('#claveAdminConfirmar').value;
        if(nueva!==confirmar){avisoClave.textContent='Las contraseñas no coinciden.';return;}
        guardando=true;formClave.querySelectorAll('button').forEach(b=>b.disabled=true);
        try{
            const resultado=await solicitar('/api/usuarios/'+destino,'PATCH',{usuario:dialogo.querySelector('#editarUsername').value.trim(),rol:dialogo.querySelector('#editarRol').value,nueva,confirmar});
            dialogo.close();
            if(resultado.cerrar_sesion){location.href='/';return;}
            await cargar();
            mostrar(resultado.mensaje);
        }catch(error){avisoClave.textContent=error.message;}
        finally{guardando=false;formClave.querySelectorAll('button').forEach(b=>b.disabled=false);}
    });


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
            const clave=document.createElement('button');
            clave.type = 'button';
            clave.textContent = 'Editar usuario';
            clave.className = 'btn-cambiar-clave';
            clave.addEventListener('click',()=>{
                destino=usuario.id_usuario;
                dialogo.querySelector('#tituloClaveAdmin').textContent='Editar usuario';
                dialogo.querySelector('#editarUsername').value=usuario.usuario;
                dialogo.querySelector('#editarRol').value=usuario.rol;
                dialogo.showModal();
            });
            td.append(clave);
            const borrar = document.createElement('button');
            borrar.type = 'button';
            borrar.className = 'btn-borrar-usuario';
            borrar.textContent = 'Borrar';
            borrar.disabled = usuario.id_usuario === cuenta.id_usuario;
            borrar.addEventListener('click', async () => {
                if (borrar.disabled) return;
                const pregunta = typeof traducirTexto === 'function'
                    ? traducirTexto('¿Borrar esta cuenta de usuario? El empleado se conservará.')
                    : '¿Borrar esta cuenta de usuario? El empleado se conservará.';
                if (!confirm(pregunta + '\n' + usuario.usuario)) return;
                borrar.disabled = true;
                try {
                    const resultado = await solicitar('/api/usuarios/' + usuario.id_usuario, 'DELETE');
                    mostrar(resultado.mensaje);
                    await cargar();
                } catch (error) {
                    mostrar(error.message, true);
                    borrar.disabled = false;
                }
            });
            td.append(borrar);
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
