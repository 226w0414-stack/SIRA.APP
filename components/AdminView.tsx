import React, { useState } from 'react';
import AdminUsersView from './AdminUsersView';
import { IncidentReport } from '../types';

interface Props {
  reports: IncidentReport[];
  onFinalize: (id: string) => void;
  onDispatch: (id: string) => void;
}

const AdminView: React.FC<Props> = ({ reports, onFinalize, onDispatch }) => {
  // Estado para controlar qué módulo del panel administrativo está activo
  const [activeModule, setActiveModule] = useState<'reportes' | 'soporte' | 'usuarios'>('reportes');

  // Helper para renderizar los estados del reporte
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'en_camino':
      case 'atendiendo':
        return <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">ATENDIENDO 🚒</span>;
      case 'sent':
      case 'recibido':
      default:
        return <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">RECIBIDO 📥</span>;
    }
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-500">
      
      {/* MENÚ DE NAVEGACIÓN ADMINISTRATIVA (TABS) */}
      <div className="bg-[#003366] p-2 rounded-2xl shadow-md border-b-4 border-[#FF8C00] flex justify-between items-center overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button 
            onClick={() => setActiveModule('reportes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${activeModule === 'reportes' ? 'bg-white text-[#003366]' : 'text-slate-300 hover:bg-[#002244]'}`}
          >
            <span>📄</span> Reportes
          </button>
          
          <button 
            onClick={() => setActiveModule('usuarios')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${activeModule === 'usuarios' ? 'bg-white text-[#003366]' : 'text-slate-300 hover:bg-[#002244]'}`}
          >
            <span>👥</span> Usuarios y Alertas
          </button>

          <button 
            onClick={() => setActiveModule('soporte')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${activeModule === 'soporte' ? 'bg-white text-[#003366]' : 'text-slate-300 hover:bg-[#002244]'}`}
          >
            <span>🎧</span> Soporte
          </button>
        </div>
      </div>

      {/* RENDERIZADO CONDICIONAL DE MÓDULOS */}

      {/* REPORTES CIUDADANOS */}
      {activeModule === 'reportes' && (
        <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold flex items-center gap-2 text-[#003366]">
              <span className="text-orange-500">🚨</span> Monitor de Percances
            </h2>
            <p className="text-sm text-slate-500 mt-1">Reportes ciudadanos en tiempo real</p>
          </div>

          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                <span className="text-4xl opacity-50 block mb-2">📭</span>
                <p className="text-slate-400 font-medium">No hay reportes recientes.</p>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                  
                  {/* Imagen del Reporte */}
                  {report.image && (
                    <div className="md:w-1/3 aspect-video md:aspect-auto bg-slate-100 shrink-0">
                      <img src={report.image} alt="Incidente" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        {getStatusBadge(report.status)}
                        <span className="text-xs font-bold text-slate-400">{report.timestamp ? new Date(report.timestamp).toLocaleString() : ''}</span>
                      </div>
                      
                      <h3 className="font-black text-[#003366] text-lg leading-tight uppercase mb-2">{report.description}</h3>
                      
                      <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <span className="text-[#FF8C00] shrink-0">📍</span>
                        <span className="font-medium">
                          {report.location?.manualAddress || (report.location?.latitude && report.location?.longitude ? `Lat: ${report.location.latitude.toFixed(4)}, Lng: ${report.location.longitude.toFixed(4)}` : 'Ubicación no disponible')}
                        </span>
                      </div>
                    </div>

                    {/* Botonera de Acción */}
                    <div className="mt-5 flex gap-3">
                      <button 
                        onClick={() => onDispatch(report.id)}
                        className="flex-1 bg-[#FF8C00] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#e67e00] transition-colors shadow-sm"
                      >
                        Despachar Unidad
                      </button>
                      <button 
                        onClick={() => onFinalize(report.id)}
                        className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors shadow-sm"
                      >
                        Finalizar / Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* USUARIOS Y NOTIFICACIONES */}
      {activeModule === 'usuarios' && (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <AdminUsersView />
        </div>
      )}

      {/* SOPORTE TÉCNICO */}
      {activeModule === 'soporte' && (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 animate-in slide-in-from-right-4 duration-300">
          <span className="text-4xl opacity-50 block mb-2">🛠️</span>
          <p className="text-[#003366] font-bold text-lg">Módulo de Soporte Técnico</p>
          <p className="text-slate-400 text-sm mt-1">Aquí se gestionarán las solicitudes de recuperación de cuentas ciudadanas.</p>
        </div>
      )}

    </div>
  );
};

export default AdminView;