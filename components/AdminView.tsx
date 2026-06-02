import React, { useState } from 'react';
import AdminUsersView from './AdminUsersView';
import { IncidentReport } from '../types';

interface Props {
  reports: IncidentReport[];
  onFinalize: (id: string) => void;
  onDispatch: (id: string) => void;
}

const AdminView: React.FC<Props> = ({ reports, onFinalize, onDispatch }) => {
  const [activeModule, setActiveModule] = useState<'reportes' | 'soporte' | 'usuarios'>('reportes');
  
  // ESTADO RESTAURADO: Para controlar el modal flotante
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'en_camino':
      case 'atendiendo':
        return <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">ATENDIENDO 🚒</span>;
      case 'finalizado':
        return <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">FINALIZADO ✅</span>;
      case 'sent':
      case 'recibido':
      default:
        return <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">RECIBIDO (PENDIENTE)</span>;
    }
  };

  // Función para cerrar el modal después de una acción
  const handleActionAndClose = (action: Function, id: string) => {
    action(id);
    setSelectedReport(null);
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500 relative">
      
      {/* MENÚ DE NAVEGACIÓN ADMINISTRATIVA */}
      <div className="bg-[#003366] dark:bg-slate-950 p-2 rounded-2xl shadow-md border-b-4 border-[#FF8C00] flex justify-between items-center overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button onClick={() => setActiveModule('reportes')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${activeModule === 'reportes' ? 'bg-white text-[#003366]' : 'text-slate-300 hover:bg-[#002244]'}`}>
            <span>📄</span> Reportes
          </button>
          <button onClick={() => setActiveModule('usuarios')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${activeModule === 'usuarios' ? 'bg-white text-[#003366]' : 'text-slate-300 hover:bg-[#002244]'}`}>
            <span>👥</span> Usuarios y Alertas
          </button>
          <button onClick={() => setActiveModule('soporte')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${activeModule === 'soporte' ? 'bg-white text-[#003366]' : 'text-slate-300 hover:bg-[#002244]'}`}>
            <span>🎧</span> Soporte
          </button>
        </div>
      </div>

      {/* MÓDULO 1: REPORTES CIUDADANOS */}
      {activeModule === 'reportes' && (
        <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
          
          {/* Barra de búsqueda (Mockup) */}
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-400">🔍</span>
            <input type="text" placeholder="Buscar por descripción, ubicación, CURP o folio" className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 pl-10 rounded-xl text-sm outline-none focus:border-[#FF8C00] shadow-sm"/>
          </div>

          <div className="space-y-6">
            {reports.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <span className="text-4xl opacity-50 block mb-2">📭</span>
                <p className="text-slate-400 font-medium">No hay reportes recientes.</p>
              </div>
            ) : (
              // RESTAURACIÓN DE LAS TARJETAS DINÁMICAS (Diseño vertical tipo Mockup 162854.png)
              reports.map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => setSelectedReport(report)}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-md hover:border-[#FF8C00] transition-all"
                >
                  {report.image ? (
                    <div className="w-full h-48 bg-slate-100 dark:bg-slate-700">
                      <img src={report.image} alt="Incidente" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">Sin imagen</div>
                  )}

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      {getStatusBadge(report.status)}
                      <span className="text-[10px] font-bold text-slate-400">
                        {report.timestamp ? new Date(report.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                    <h3 className="font-black text-[#003366] dark:text-slate-100 text-lg leading-tight uppercase mb-1">{report.description}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                      Reportado por CURP: <span className="font-bold">{report.informantName || 'INVITADO'}</span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MÓDULO 2 Y 3... */}
      {activeModule === 'usuarios' && <div className="animate-in slide-in-from-right-4"><AdminUsersView /></div>}
      {activeModule === 'soporte' && <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 animate-in slide-in-from-right-4"><span className="text-4xl block mb-2">🛠️</span><p className="text-[#003366] font-bold">Módulo de Soporte</p></div>}

      {/* ========================================================= */}
      {/* MODAL DETALLADO DE ADMINISTRADOR (Mockup 162916.png) */}
      {/* ========================================================= */}
      {selectedReport && activeModule === 'reportes' && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header del Modal */}
            <div className="bg-[#002244] p-4 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                <span>📋</span> Folio {selectedReport.id.slice(-6)}
              </h3>
              <button onClick={() => setSelectedReport(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors font-bold text-sm">✕</button>
            </div>

            {/* Contenido scrolleable */}
            <div className="overflow-y-auto p-0 flex-1 bg-slate-50 dark:bg-slate-900">
              {selectedReport.image && (
                <div className="w-full h-56 bg-slate-200 dark:bg-slate-800">
                  <img src={selectedReport.image} alt="Evidencia" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-5 space-y-6">
                
                {/* Control de Estado */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Panel de Control: Estado del Incidente</span>
                  <div className="flex justify-between items-center">
                    {getStatusBadge(selectedReport.status)}
                    {selectedReport.status !== 'en_camino' && (
                      <button 
                        onClick={() => handleActionAndClose(onDispatch, selectedReport.id)}
                        className="bg-[#003366] text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-[#FF8C00] transition-colors shadow-sm"
                      >
                        MARCAR ATENDIENDO 🚒
                      </button>
                    )}
                  </div>
                </div>

                {/* Descripción Ciudadana */}
                <div>
                  <span className="block text-[10px] font-bold text-[#003366] dark:text-slate-400 mb-2 uppercase tracking-wider">Descripción Ciudadana</span>
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 uppercase">
                    {selectedReport.description}
                  </div>
                </div>

                {/* Coordenadas y Despacho */}
                <div>
                  <span className="block text-[10px] font-bold text-[#003366] dark:text-slate-400 mb-2 uppercase tracking-wider">Coordenadas y Despacho</span>
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl">
                    <div className="flex gap-3 items-center mb-4">
                      <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0">📍</div>
                      <div>
                        <h4 className="font-bold text-sm text-[#003366] dark:text-blue-300">Ubicación GPS Satelital</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {selectedReport.location?.manualAddress || 'Coordenadas capturadas'}
                        </p>
                      </div>
                    </div>
                    
                    {selectedReport.location?.latitude && selectedReport.location?.longitude && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedReport.location.latitude},${selectedReport.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#002244] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#FF8C00] transition-colors flex items-center justify-center gap-2 shadow-md"
                      >
                        🗺️ RUTAR UNIDADES EN MAPS
                      </a>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="text-[10px] text-slate-500 font-mono text-center bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  Recibido el: {selectedReport.timestamp ? new Date(selectedReport.timestamp).toLocaleString() : 'N/A'}<br/>
                  Emisor CURP: {selectedReport.informantName || 'INVITADO'}
                </div>

              </div>
            </div>

            {/* Footer: Eliminar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <button 
                onClick={() => handleActionAndClose(onFinalize, selectedReport.id)}
                className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-xl hover:bg-red-600 hover:text-white transition-colors text-xs flex items-center justify-center gap-2"
              >
                🗑️ Eliminar Reporte Permanentemente
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;