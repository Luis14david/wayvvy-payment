// Sesión y menú compartidos por las páginas del sistema.
(async()=>{
    let cuenta;
    try {
        const r=await fetch('/api/sesion');
        if(!r.ok){location.href='/';return;}
        cuenta=await r.json();
    }catch{return;}
    if(cuenta.rol!=='admin'){
        document.querySelectorAll('a[href="/html/cambiarContrasena.html"]').forEach(a=>a.closest('.settings-card')?.remove());
    }
    const boton=document.getElementById('profileButton');
    const menu=document.getElementById('profileDropdown');
    if(boton && menu){
        const nombre=boton.querySelector('[data-i18n]');
        if(nombre){nombre.removeAttribute('data-i18n');nombre.textContent=cuenta.usuario;}
        const avatar=boton.querySelector('.profile-avatar');if(avatar){
            const pintarFoto=foto=>{
                avatar.replaceChildren();
                if(foto && foto.startsWith('data:image/jpeg;base64,')){
                    const img=document.createElement('img');img.src=foto;img.alt='';
                    img.style.cssText='width:100%;height:100%;object-fit:cover;border-radius:50%;';avatar.append(img);
                }else avatar.textContent=cuenta.usuario.slice(0,1).toUpperCase();
            };
            pintarFoto(cuenta.foto_perfil);
            document.addEventListener('foto-perfil-actualizada',e=>pintarFoto(e.detail));
        }
        boton.addEventListener('click',e=>{e.stopPropagation();menu.classList.toggle('active');});
        document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!boton.contains(e.target))menu.classList.remove('active');});
        const perfil=menu.querySelector('.profile-option');
        if(perfil){perfil.href='/html/configuracion.html';perfil.textContent='Mi perfil';perfil.removeAttribute('data-i18n');}
        else {const a=document.createElement('a');a.href='/html/configuracion.html';a.className='profile-option';a.textContent='Mi perfil';menu.prepend(a);}
    }
    if(cuenta.rol==='admin'){
        const nav=document.querySelector('.sidebar nav');
        if(nav){const a=document.createElement('a');a.href='/html/usuarios.html';a.textContent='Usuarios';if(location.pathname==='/html/usuarios.html'){nav.querySelectorAll('.active').forEach(e=>e.classList.remove('active'));a.className='active';}nav.insertBefore(a,nav.querySelector('.language-switch'));}
    }else{
        const paginas=cuenta.paginas || [];
        document.querySelectorAll('.sidebar nav a[href^="/html/"]').forEach(a=>{if(!paginas.includes(a.pathname.split('/').pop()))a.style.display='none';});
        const acciones=new Set(cuenta.acciones || []);
        const reglas={
            'empleados.crear':'.btn-new-employee',
            'empleados.editar':'#empleadosBody .edit-button',
            'nomina.crear':'#btnNuevaNomina,#modalNuevaNomina,#btnGuardarCalculoNomina',
            'nomina.fecha':'#corregirFechaPago',
            'asistencia.guardar':'#btnGuardarHoras',
            'puestos.crear':'#puestoForm:not([data-id-puesto])',
            'puestos.editar':'.editar-puesto',
            'incentivos.crear':'#incentivoForm:not([data-id-incentivo])',
            'incentivos.editar':'.editar-incentivo',
            'incentivos.borrar':'.eliminar-incentivo'
        };
        const estilo=document.createElement('style');
        estilo.textContent=Object.entries(reglas).filter(([accion])=>!acciones.has(accion)).map(([,selector])=>selector+'{display:none!important;}').join('');
        document.head.append(estilo);
        if(!acciones.has('asistencia.guardar') && location.pathname.endsWith('/asistencia.html')){
            const bloquear=()=>document.querySelectorAll('input[type="number"]').forEach(input=>input.disabled=true);
            bloquear();new MutationObserver(bloquear).observe(document.body,{childList:true,subtree:true});
        }
    }
    document.querySelectorAll('.logout-button').forEach(a=>a.addEventListener('click',async e=>{
        e.preventDefault();
        if(!confirm('¿Desea cerrar sesión?'))return;
        const r=await fetch('/api/logout',{method:'POST'});
        if(r.ok)location.href='/';
        else alert('No se pudo cerrar la sesión. Intente nuevamente.');
    }));
})();
