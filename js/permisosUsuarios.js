// Una sola lista de acciones para el servidor y las casillas del formulario.
const catalogo = [
 ['dashboard.ver','Dashboard','Ver resumen'],
 ['empleados.ver','Empleados','Ver empleados'],
 ['empleados.crear','Empleados','Crear empleados'],
 ['empleados.editar','Empleados','Editar empleados y tarifas'],
 ['asistencia.ver','Asistencia','Ver horas'],
 ['asistencia.guardar','Asistencia','Registrar y modificar horas'],
 ['nomina.ver','Nómina','Ver nóminas y cálculos'],
 ['nomina.crear','Nómina','Crear y guardar nóminas'],
 ['nomina.fecha','Nómina','Corregir fecha de pago'],
 ['incentivos.ver','Incentivos','Ver incentivos'],
 ['incentivos.crear','Incentivos','Crear incentivos'],
 ['incentivos.editar','Incentivos','Editar incentivos'],
 ['incentivos.borrar','Incentivos','Borrar incentivos'],
 ['reportes.ver','Reportes','Generar reportes y exportar PDF'],
 ['puestos.ver','Puestos','Ver puestos'],
 ['puestos.crear','Puestos','Crear puestos'],
 ['puestos.editar','Puestos','Editar puestos']
].map(([id,grupo,nombre])=>({id,grupo,nombre}));
const claves=catalogo.map(p=>p.id);
const predeterminados={admin:claves,manager:['empleados.ver','empleados.crear','asistencia.ver','asistencia.guardar'],viewer:['empleados.ver','nomina.ver']};
function validar(lista) {
 if(!Array.isArray(lista)||lista.length>claves.length||lista.some(p=>!claves.includes(p))||new Set(lista).size!==lista.length)
   throw Error('La selección de permisos no es válida.');
 for(const p of lista)if(!p.endsWith('.ver')&&!lista.includes(p.split('.')[0]+'.ver'))
   throw Error('Para modificar un módulo debe permitir también su consulta.');
 return [...lista];
}
function acciones(cuenta) {
 if(cuenta.rol==='admin')return [...claves];
 if(cuenta.permisos_personales==null)return [...(predeterminados[cuenta.rol]||[])];
 try{return validar(typeof cuenta.permisos_personales==='string'?JSON.parse(cuenta.permisos_personales):cuenta.permisos_personales)}catch{return []}
}
const mapaPaginas={
 'dashboard.html':'dashboard.ver','empleados.html':'empleados.ver','verEmpleado.html':'empleados.ver',
 'asistencia.html':'asistencia.ver','nomina.html':'nomina.ver','verNomina.html':'nomina.ver',
 'incentivos.html':'incentivos.ver','reportes.html':'reportes.ver','puestos.html':'puestos.ver'
};
function paginas(cuenta){return [...Object.entries(mapaPaginas).filter(([,accion])=>acciones(cuenta).includes(accion)).map(([p])=>p),'configuracion.html',...(cuenta.rol==='admin'?['usuarios.html','cambiarContrasena.html']:[])];}
function paginaPermitida(cuenta,pagina,query={}) {
 if(pagina==='ingresoDeEmpleado.html')return acciones(cuenta).includes(query.id?'empleados.editar':'empleados.crear');
 return paginas(cuenta).includes(pagina);
}
function apiPermitida(cuenta,metodo,ruta) {
 if(cuenta.rol==='admin')return true;
 const a=acciones(cuenta),tiene=(...p)=>p.some(x=>a.includes(x));
 if(metodo==='GET'){
   if(ruta==='/api/empleados')return tiene('empleados.ver','asistencia.ver','incentivos.ver','reportes.ver','dashboard.ver');
   if(/^\/api\/empleados\/\d+$/.test(ruta))return tiene('empleados.ver','reportes.ver');
   if(/^\/api\/empleados\/\d+\/tarifas$/.test(ruta))return tiene('empleados.ver');
   if(ruta==='/api/puestos'||ruta==='/api/estados-empleado')return tiene('puestos.ver','empleados.ver','dashboard.ver');
   if(ruta==='/api/asistencia')return tiene('asistencia.ver');
   if(ruta==='/api/configuracion-asistencia')return tiene('asistencia.ver');
   if(ruta==='/api/nominas')return tiene('nomina.ver','incentivos.ver','dashboard.ver');
   if(/^\/api\/nominas\/\d+(\/calculo-regular)?$/.test(ruta))return tiene('nomina.ver');
   if(ruta==='/api/incentivos'||ruta==='/api/nomina/conceptos')return tiene('incentivos.ver');
   if(['/api/reportes/horas','/api/reportes/calculo'].includes(ruta))return tiene('reportes.ver');
 }
 const reglas=[
 ['POST',/^\/registrar$/,'empleados.crear'],['PUT',/^\/api\/empleados\/\d+$/,'empleados.editar'],
 ['POST',/^\/api\/asistencia$/,'asistencia.guardar'],['POST',/^\/api\/nominas$/,'nomina.crear'],
 ['PATCH',/^\/api\/nominas\/\d+\/fecha-pago$/,'nomina.fecha'],
 ['POST',/^\/api\/nominas\/\d+\/calcular-guardar$/,'nomina.crear'],
 ['POST',/^\/api\/incentivos$/,'incentivos.crear'],['PUT',/^\/api\/incentivos\/\d+$/,'incentivos.editar'],['DELETE',/^\/api\/incentivos\/\d+$/,'incentivos.borrar'],
 ['POST',/^\/api\/puestos$/,'puestos.crear'],['PUT',/^\/api\/puestos\/\d+$/,'puestos.editar']
 ];
 return reglas.some(([m,patron,p])=>m===metodo&&patron.test(ruta)&&tiene(p));
}
module.exports={catalogo,predeterminados,acciones,validar,paginas,paginaPermitida,apiPermitida};
