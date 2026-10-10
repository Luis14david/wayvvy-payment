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
    const panelTasas = document.getElementById('panelTasas');
    if (panelTasas && cuenta.rol === 'admin') {
        panelTasas.hidden = false;
        const checkboxDomingo = document.getElementById('habilitarDomingo');
        const mensajeDomingo = document.getElementById('mensajeDomingo');
        let domingoGuardado = false;
        try {
            const configuracion = await solicitar('/api/configuracion-asistencia');
            domingoGuardado = configuracion.domingo_habilitado === true;
            checkboxDomingo.checked = domingoGuardado;
            checkboxDomingo.disabled = false;
        } catch (error) { mensajeDomingo.textContent = error.message; }
        checkboxDomingo.addEventListener('change', async () => {
            checkboxDomingo.disabled = true;
            mensajeDomingo.textContent = 'Guardando...';
            try {
                const configuracion = await solicitar('/api/configuracion-asistencia', 'PUT', {
                    domingo_habilitado: checkboxDomingo.checked
                });
                domingoGuardado = configuracion.domingo_habilitado === true;
                checkboxDomingo.checked = domingoGuardado;
                mensajeDomingo.textContent = domingoGuardado ? 'Domingo habilitado en Asistencia.' : 'Domingo deshabilitado en Asistencia.';
            } catch (error) {
                checkboxDomingo.checked = domingoGuardado;
                mensajeDomingo.textContent = error.message;
            } finally { checkboxDomingo.disabled = false; }
        });
        const form = document.getElementById('tasasForm');
        const aviso = document.getElementById('mensajeTasas');
        const boton = form.querySelector('button');
        const camposMonto = new Set(['tope_afp','tope_sfs','exento','limite1','limite2','cuota2','cuota3']);
        const sinComas = valor => String(valor).replace(/,/g, '');
        function formatoMonto(valor) {
            const partes = sinComas(valor).split('.');
            partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return partes.join('.');
        }
        for (const nombre of camposMonto) {
            const input = form.elements[nombre];
            input.type = 'text';
            input.inputMode = 'decimal';
            input.removeAttribute('min'); input.removeAttribute('step');
            input.pattern = '[0-9,]+([.][0-9]{1,2})?';
            let anterior = '', posicionAnterior = 0;
            input.addEventListener('beforeinput', event => {
                const pos = input.selectionStart;
                if (input.selectionStart === input.selectionEnd) {
                    if (event.inputType === 'deleteContentBackward' && input.value[pos-1] === ',')
                        input.setSelectionRange(Math.max(0,pos-2),pos);
                    if (event.inputType === 'deleteContentForward' && input.value[pos] === ',')
                        input.setSelectionRange(pos,pos+2);
                }
                anterior = input.value; posicionAnterior = input.selectionStart;
            });
            input.addEventListener('input', () => {
                const cursor = sinComas(input.value.slice(0,input.selectionStart)).length;
                const limpio = sinComas(input.value);
                if (!/^\d{0,9}(\.\d{0,2})?$/.test(limpio)) {
                    input.value = anterior; input.setSelectionRange(posicionAnterior,posicionAnterior); return;
                }
                input.value = formatoMonto(limpio);
                let posicion = 0, caracteres = 0;
                while (posicion < input.value.length && caracteres < cursor) {
                    if (input.value[posicion] !== ',') caracteres++;
                    posicion++;
                }
                input.setSelectionRange(posicion,posicion);
                anterior = input.value; posicionAnterior = posicion;
            });
            input.addEventListener('blur', () => {
                const limpio = sinComas(input.value);
                if (limpio && /^\d{1,9}(\.\d{0,2})?$/.test(limpio))
                    input.value = formatoMonto(Number(limpio).toFixed(2));
            });
        }

        let ultimaVersion = null;
        let campos = [];
        async function cargarTasas() {
            boton.disabled = true;
            const versiones = await solicitar('/api/tasas-descuentos');
            const ultima = versiones.at(-1);
            if (!ultima) throw Error('No se pudo cargar el historial de tasas.');
            ultimaVersion = ultima.id_tasa;
            campos = Object.keys(ultima.parametros);
            for (const campo of campos) form.elements[campo].value = camposMonto.has(campo) ? formatoMonto(ultima.parametros[campo]) : ultima.parametros[campo];
            const hoy = new Date();
            const mesActual = hoy.getFullYear()+'-'+String(hoy.getMonth()+1).padStart(2,'0')+'-01';
            const proxima = new Date([mesActual,ultima.vigente_desde].sort().pop()+'T12:00:00Z');
            proxima.setUTCMonth(proxima.getUTCMonth()+1);
            form.elements.vigente_desde.min = proxima.toISOString().slice(0,10);
            form.elements.vigente_desde.value = form.elements.vigente_desde.min;
            const cuerpo = document.getElementById('historialTasas');
            cuerpo.replaceChildren();
            for (const v of [...versiones].reverse()) {
                const tr = document.createElement('tr');
                for (const valor of [v.vigente_desde,v.parametros.afp,v.parametros.sfs,v.creado_por,v.motivo]) {
                    const td = document.createElement('td'); td.textContent = valor; tr.append(td);
                }
                const td = document.createElement('td'), detalle = document.createElement('details'), titulo = document.createElement('summary');
                titulo.textContent = 'Ver tasas'; detalle.append(titulo);
                const p = document.createElement('p'); p.className = 'tasas-detalle';
                p.textContent = campos.map(c => form.elements[c].parentElement.firstChild.textContent.trim()+': '+(camposMonto.has(c) ? formatoMonto(v.parametros[c]) : v.parametros[c])).join('\n');
                detalle.append(p);td.append(detalle);tr.append(td);cuerpo.append(tr);
            }
            boton.disabled = false;
        }
        try { await cargarTasas(); } catch(error) { aviso.textContent = error.message; }
        form.addEventListener('submit', async event => {
            event.preventDefault(); if (boton.disabled) return;
            boton.disabled = true; aviso.textContent = '';
            try {
                const parametros = Object.fromEntries(campos.map(c => [c,camposMonto.has(c) ? sinComas(form.elements[c].value) : form.elements[c].value]));
                const resultado = await solicitar('/api/tasas-descuentos','POST',{
                    vigente_desde:form.elements.vigente_desde.value,motivo:form.elements.motivo.value,
                    ultima_version:ultimaVersion,parametros
                });
                aviso.textContent = resultado.mensaje; form.elements.motivo.value = '';
                await cargarTasas();
            } catch(error) {aviso.textContent = error.message;}
            finally {boton.disabled = ultimaVersion === null;}
        });
    }

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
    dialogo.className='dialogo-editar-usuario';
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
    const permisosBox = document.createElement('fieldset');
    permisosBox.className = 'permisos-usuario';
    const tituloPermisos = document.createElement('legend');tituloPermisos.textContent = 'Permisos por acción';permisosBox.append(tituloPermisos);
    const notaPermisos = document.createElement('p');notaPermisos.textContent = 'El administrador conserva acceso completo.';permisosBox.append(notaPermisos);
    const checks = new Map();
    const grupos = new Map();
    for (const item of cuenta.catalogo_permisos || []) {
        if (!grupos.has(item.grupo)) {
            const grupo = document.createElement('div');grupo.className='permisos-grupo';
            const titulo = document.createElement('strong');titulo.textContent=item.grupo;grupo.append(titulo);permisosBox.append(grupo);grupos.set(item.grupo,grupo);
        }
        const label=document.createElement('label'), check=document.createElement('input'), texto=document.createElement('span');
        check.type='checkbox';check.value=item.id;texto.textContent=item.nombre;label.append(check,texto);grupos.get(item.grupo).append(label);checks.set(item.id,check);
        check.addEventListener('change',()=>{
            const modulo=item.id.split('.')[0];
            if(check.checked&&!item.id.endsWith('.ver'))checks.get(modulo+'.ver').checked=true;
            if(!check.checked&&item.id.endsWith('.ver'))for(const [id,c] of checks)if(id.startsWith(modulo+'.'))c.checked=false;
        });
    }
    const restablecer=document.createElement('button');restablecer.type='button';restablecer.textContent='Usar permisos del rol';permisosBox.append(restablecer);
    function pintarPermisos(lista,rol) {
        for(const [id,c] of checks){c.checked=rol==='admin'||lista.includes(id);c.disabled=rol==='admin';}
        notaPermisos.hidden=rol!=='admin';restablecer.disabled=rol==='admin';
    }
    const rolEdicion=dialogo.querySelector('#editarRol');
    rolEdicion.addEventListener('change',()=>pintarPermisos(cuenta.permisos_por_rol[rolEdicion.value],rolEdicion.value));
    restablecer.onclick=()=>pintarPermisos(cuenta.permisos_por_rol[rolEdicion.value],rolEdicion.value);
    formClave.insertBefore(permisosBox,dialogo.querySelector('#avisoClaveAdmin'));

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
            const resultado=await solicitar('/api/usuarios/'+destino,'PATCH',{usuario:dialogo.querySelector('#editarUsername').value.trim(),rol:dialogo.querySelector('#editarRol').value,nueva,confirmar,permisos_personales:[...checks].filter(([,c])=>c.checked).map(([id])=>id)});
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
                let seleccion = usuario.permisos_personales;
                if(typeof seleccion==='string')seleccion=JSON.parse(seleccion);
                pintarPermisos(seleccion || cuenta.permisos_por_rol[usuario.rol],usuario.rol);
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




// Visibilidad de contraseñas en formularios y ventanas de edición.
(() => {
    function iniciarVisibilidad() {
        const controles = new Map();
        function actualizar(campo, boton) {
            const visible = campo.type === 'text';
            const ingles = document.documentElement.lang === 'en';
            const texto = ingles ? (visible ? 'Hide password' : 'Show password') :
                (visible ? 'Ocultar contraseña' : 'Ver contraseña');
            boton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>' + (visible ? '<path d="m3 3 18 18"/>' : '') + '</svg>';
            boton.title = texto;
            boton.setAttribute('aria-label', texto);
            boton.setAttribute('aria-pressed', String(visible));
        }
        function incorporar(raiz) {
            const campos = [];
            if (raiz.matches?.('input[type="password"]')) campos.push(raiz);
            raiz.querySelectorAll?.('input[type="password"]').forEach(campo => campos.push(campo));
            campos.forEach(campo => {
                if (controles.has(campo)) return;
                const boton = document.createElement('button');
                boton.type = 'button';
                boton.className = 'alternar-contrasena';
                boton.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);display:flex;align-items:center;justify-content:center;width:32px;height:32px;margin:0;padding:4px;background:transparent;color:#aebbc5;border:0;border-radius:5px;cursor:pointer;z-index:2';
                const estilo = window.getComputedStyle(campo);
                const contenedor = document.createElement('span');
                contenedor.style.cssText = 'position:relative;display:block;width:100%;box-sizing:border-box';
                contenedor.style.marginTop = estilo.marginTop;
                contenedor.style.marginBottom = estilo.marginBottom;
                campo.parentNode.insertBefore(contenedor, campo);
                contenedor.appendChild(campo);
                campo.style.marginTop = '0';
                campo.style.marginBottom = '0';
                campo.style.width = '100%';
                campo.style.boxSizing = 'border-box';
                campo.style.paddingRight = '48px';
                const error = contenedor.parentNode.querySelector('.error-icon');
                if (error) {
                    error.style.right = '46px';
                    campo.style.paddingRight = '76px';
                }
                if (campo.id) boton.setAttribute('aria-controls', campo.id);
                controles.set(campo, boton);
                actualizar(campo, boton);
                contenedor.appendChild(boton);
                boton.addEventListener('click', () => {
                    campo.type = campo.type === 'password' ? 'text' : 'password';
                    actualizar(campo, boton);
                });
                campo.form?.addEventListener('reset', () => {
                    campo.type = 'password';
                    actualizar(campo, boton);
                });
            });
        }
        incorporar(document);
        new MutationObserver(cambios => {
            cambios.forEach(cambio => cambio.addedNodes.forEach(nodo => {
                if (nodo.nodeType === 1) incorporar(nodo);
            }));
            for (const [campo, boton] of controles) {
                if (!campo.isConnected) controles.delete(campo);
                else if (cambios.some(cambio => cambio.type === 'attributes')) actualizar(campo, boton);
            }
        }).observe(document.documentElement, {childList: true, subtree: true, attributes: true, attributeFilter: ['lang']});
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) controles.forEach((boton, campo) => {
                campo.type = 'password';
                actualizar(campo, boton);
            });
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciarVisibilidad);
    else iniciarVisibilidad();
})();
