// Sesión y menú compartidos por las páginas del sistema.
(async()=>{
    let cuenta;
    try {
        const r=await fetch('/api/sesion');
        if(!r.ok){location.href='/';return;}
        cuenta=await r.json();
    }catch{return;}
    const boton=document.getElementById('profileButton');
    const menu=document.getElementById('profileDropdown');
    if(boton && menu){
        const nombre=boton.querySelector('[data-i18n]');
        if(nombre){nombre.removeAttribute('data-i18n');nombre.textContent=cuenta.usuario;}
        const avatar=boton.querySelector('.profile-avatar');if(avatar)avatar.textContent=cuenta.usuario.slice(0,1).toUpperCase();
        boton.addEventListener('click',e=>{e.stopPropagation();menu.classList.toggle('active');});
        document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!boton.contains(e.target))menu.classList.remove('active');});
        const perfil=menu.querySelector('.profile-option');
        if(perfil){perfil.href='/html/cambiarContrasena.html';perfil.textContent='Cambiar contraseña';perfil.removeAttribute('data-i18n');}
        else {const a=document.createElement('a');a.href='/html/cambiarContrasena.html';a.className='profile-option';a.textContent='Cambiar contraseña';menu.prepend(a);}
    }
    if(cuenta.rol==='admin'){
        const nav=document.querySelector('.sidebar nav');
        if(nav){const a=document.createElement('a');a.href='/html/usuarios.html';a.textContent='Usuarios';if(location.pathname==='/html/usuarios.html'){nav.querySelectorAll('.active').forEach(e=>e.classList.remove('active'));a.className='active';}nav.insertBefore(a,nav.querySelector('.language-switch'));}
    }else{
        const paginas=cuenta.rol==='manager'?['empleados.html','asistencia.html']:['empleados.html','nomina.html'];
        document.querySelectorAll('.sidebar nav a[href^="/html/"]').forEach(a=>{if(!paginas.includes(a.pathname.split('/').pop()))a.style.display='none';});
        const estilo=document.createElement('style');
        estilo.textContent='.edit-button,#corregirFechaPago{display:none!important;}'+(cuenta.rol==='viewer'?'.btn-new-employee,#btnNuevaNomina,#modalNuevaNomina{display:none!important;}':'');
        document.head.append(estilo);
    }
    document.querySelectorAll('.logout-button').forEach(a=>a.addEventListener('click',async e=>{
        e.preventDefault();
        if(!confirm('¿Desea cerrar sesión?'))return;
        const r=await fetch('/api/logout',{method:'POST'});
        if(r.ok)location.href='/';
        else alert('No se pudo cerrar la sesión. Intente nuevamente.');
    }));
})();
