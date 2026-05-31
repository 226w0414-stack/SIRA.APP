import React, { useState } from 'react';

// Estructura de ejemplo para los usuarios (Esto luego vendrá de tu BD)
interface UserData {
  curp: string;
  nombre: string;
  telefono: string;
  rol: 'Ciudadano' | 'Administrador' | 'Invitado';
}

const mockUsers: UserData[] = [
  { curp: 'INVITADO-1777909721536', nombre: 'PEPE SANCHEZ TEPOLE', telefono: '1234567890', rol: 'Ciudadano' },
  { curp: 'DOHE030907HVZMRZA2', nombre: 'EZEQUIEL DOMINGUEZ HERNANDEZ', telefono: '2781150920', rol: 'Ciudadano' },
  { curp: 'TECNMADMIN', nombre: 'ADMINISTRADOR SISTEMA', telefono: 'N/A', rol: 'Administrador' },
];

const AdminUsersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'notificaciones'>('usuarios');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'Todos' | 'Ciudadanos' | 'Administradores' | 'Invitados'>('Todos');

  // Funciones de ejemplo
  const handleModify = (curp: string) => alert(`Modificar usuario: ${curp}`);
  const handleViewReports = (curp: string) => alert(`Viendo reportes de: ${curp}`);
  const handleMessage = (curp: string) => alert(`Mensaje directo a: ${curp}`);

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      
      {/* Cabecera del Centro de Control */}
      <div className="bg-[#002244] text-white p-5 rounded-2xl shadow-md border-t-4 border-[#FF8C00]">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-orange-400">📋</span> Centro de Control
        </h2>
        <p className="text-xs text-slate-300 mt-1">Administración directa de cuentas ciudadanas y permisos</p>
        
        {/* Pestañas de Navegación Interna */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-[#003366] p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('usuarios')}
            className={`py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'usuarios' ? 'bg-white text-[#002244]' : 'text-slate-300 hover:bg-[#002244]'}`}
          >
            👥 Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('notificaciones')}
            className={`py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === 'notificaciones' ? 'bg-[#FF8C00] text-white' : 'text-slate-300 hover:bg-[#002244]'}`}
          >
            ⚠️ Notificaciones
          </button>
        </div>
      </div>

      {/* CONTENIDO: PESTAÑA DE USUARIOS */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          
          {/* Barra de Búsqueda */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar por nombre, CURP o número de teléfono" 
              className="w-full bg-white border border-slate-200 p-3 pl-10 rounded-xl text-sm outline-none focus:border-[#FF8C00] shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros rápidos (Botones pill) */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['Todos', 'Ciudadanos', 'Administradores', 'Invitados'].map((role) => (
              <button 
                key={role}
                onClick={() => setFilterRole(role as any)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-colors ${filterRole === role ? 'bg-[#003366] text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Tabla de Usuarios */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Cabecera de la tabla (Oculta en móviles) */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase">
              <div className="col-span-3">Identificación / Celular</div>
              <div className="col-span-4">Nombre Completo</div>
              <div className="col-span-2">Rol</div>
              <div className="col-span-3 text-center">Acciones</div>
            </div>

            {/* Filas de Usuarios */}
            {mockUsers.map((u, i) => (
              <div key={i} className="flex flex-col md:grid md:grid-cols-12 gap-4 p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
                
                {/* Info Básica */}
                <div className="col-span-3">
                  <span className="text-xs font-bold text-[#003366] block truncate" title={u.curp}>{u.curp}</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">📞 {u.telefono}</span>
                </div>
                
                {/* Nombre */}
                <div className="col-span-4">
                  <span className="text-xs font-bold text-slate-700">{u.nombre}</span>
                </div>
                
                {/* Rol Badge */}
                <div className="col-span-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    u.rol === 'Administrador' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.rol}
                  </span>
                </div>
                
                {/* Botones de Acción */}
                <div className="col-span-3 flex gap-2 md:justify-end mt-2 md:mt-0">
                  <button onClick={() => handleModify(u.curp)} className="flex-1 md:flex-none px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold transition-colors">✏️ Modificar</button>
                  <button onClick={() => handleViewReports(u.curp)} className="flex-1 md:flex-none px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold transition-colors">📄 Reportes</button>
                  <button onClick={() => handleMessage(u.curp)} className="flex-none px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] transition-colors" title="Mensaje Directo">✉️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENIDO: PESTAÑA DE NOTIFICACIONES */}
      {activeTab === 'notificaciones' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-[#003366] font-black text-lg flex items-center gap-2">🔔 Enviar Nueva Notificación</h3>
            <p className="text-xs text-slate-500 mt-1">El mensaje aparecerá instantáneamente en la bandeja de los usuarios seleccionados.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("¡Alerta emitida!"); }}>
            
            {/* Destinatarios */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase">1. Destinatarios del Mensaje</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="bg-[#FF8C00] text-white p-3 rounded-xl font-bold text-sm shadow-md border-2 border-orange-500">
                  🌐 Global<br/><span className="text-[10px] font-normal">(Todos)</span>
                </button>
                <button type="button" className="bg-slate-100 text-slate-600 p-3 rounded-xl font-bold text-sm border-2 border-slate-200 hover:bg-slate-200 transition-colors">
                  👤 Usuarios<br/><span className="text-[10px] font-normal">Específicos</span>
                </button>
              </div>
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase">2. Mensaje de Alerta</label>
              <textarea 
                rows={4}
                placeholder="Escribe aquí el contenido de la notificación..."
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-[#FF8C00] resize-none"
                required
              ></textarea>
              <p className="text-[9px] text-slate-400 mt-1 text-right">RECOMENDACIÓN: SÉ BREVE Y CLARO.</p>
            </div>

            {/* Botón de Emisión */}
            <button type="submit" className="w-full bg-[#002244] text-white font-bold py-4 rounded-xl hover:bg-[#001122] transition-colors shadow-lg flex items-center justify-center gap-2">
              <span className="text-orange-500">⚠️</span> EMITIR NOTIFICACIÓN A TODOS
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminUsersView;