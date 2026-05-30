import React, { useState } from 'react';
import { IncidentReport } from '../types';

interface Props {
  reports: IncidentReport[];
}

const MyReportsView: React.FC<Props> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'en_camino':
      case 'atendiendo':
        return <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">ATENDIENDO 🚒</span>;
      case 'finalizado':
        return <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">FINALIZADO ✅</span>;
      case 'sent':
      case 'recibido':
      default:
        return <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">RECIBIDO 📥</span>;
    }
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Cabecera de la sección */}
      <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-700 pb-3">
        <h2 className="text-2xl font-black text-[#003366] dark:text-slate-100 uppercase tracking-tight">Historial de Reportes</h2>
        <div className="h-1 w-16 bg-[#FF8C00] rounded-full"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Aquí puedes consultar el estado de los percances que has reportado.</p>
      </div>

      {/* Lista de Tarjetas */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">Aún no has realizado ningún reporte.</p>
            <p className="text-xs text-slate-300 dark:text-slate-500 mt-2">Tus reportes aparecerán aquí una vez que los envíes.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => setSelectedReport(report)}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-md hover:border-[#FF8C00] transition-all"
            >
              <div className="flex flex-col xs:flex-row">
                {/* Imagen miniatura */}
                {report.image && (
                  <div className="xs:w-24 h-24 xs:h-auto bg-slate-100 dark:bg-slate-700 shrink-0">
                    <img src={report.image} alt="Evidencia" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-2">
                    {getStatusBadge(report.status)}
                    <span className="text-[10px] font-bold text-slate-400">
                      {report.timestamp ? new Date(report.timestamp).toLocaleDateString() : 'Fecha no disp.'}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#003366] dark:text-slate-100 text-sm mt-1 line-clamp-2 uppercase">
                    {report.description}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">
                      {report.location?.manualAddress || (report.location?.latitude ? 'Ubicación Geográfica' : 'Sin dirección')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tarjeta de "SABÍAS QUE" al final */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-4 flex gap-4 items-center mt-6">
        <div className="bg-[#003366] text-white p-2 rounded-xl shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
        </div>
        <div>
          <h4 className="text-xs font-black text-[#003366] dark:text-blue-300 uppercase tracking-wider">¿Sabías que?</h4>
          <p className="text-[11px] text-blue-700 dark:text-slate-400 mt-0.5 leading-relaxed">Tus reportes ayudan a los agentes de Protección Civil a actuar más rápido ante desastres naturales.</p>
        </div>
      </div>

      {/* MODAL DE DETALLES DEL REPORTE */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
            
            {/* Header del Modal */}
            <div className="bg-[#003366] dark:bg-slate-950 p-4 text-white flex justify-between items-center shrink-0">
              <h3 className="font-bold text-sm tracking-wide">Detalles del Reporte</h3>
              <button onClick={() => setSelectedReport(null)} className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors font-bold text-sm">
                ✕
              </button>
            </div>

            {/* Contenido scrolleable del Modal */}
            <div className="overflow-y-auto p-0 flex-1">
              
              {/* Imagen Gigante */}
              {selectedReport.image ? (
                <div className="w-full h-48 bg-slate-200 dark:bg-slate-800">
                  <img src={selectedReport.image} alt="Evidencia" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-32 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs flex-col gap-2">
                  <span className="text-2xl">📷</span>
                  Sin imagen adjunta
                </div>
              )}

              <div className="p-5 space-y-6">
                
                {/* Fila: Estado y Fecha */}
                <div className="flex justify-between items-end border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 mb-1">PROGRESO DEL REPORTE</span>
                    {getStatusBadge(selectedReport.status)}
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-slate-400 mb-1">FECHA Y HORA</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {selectedReport.timestamp ? new Date(selectedReport.timestamp).toLocaleString() : 'No registrada'}
                    </span>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <span className="block text-[10px] font-bold text-[#003366] dark:text-slate-400 mb-2 flex items-center gap-1 tracking-wide">
                    📝 DESCRIPCIÓN DE LOS HECHOS
                  </span>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 uppercase leading-relaxed">
                    {selectedReport.description}
                  </div>
                </div>

                {/* Ubicación y GPS */}
                <div>
                  <span className="block text-[10px] font-bold text-[#003366] dark:text-slate-400 mb-2 flex items-center gap-1 tracking-wide">
                    📍 UBICACIÓN REPORTADA
                  </span>
                  <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/50 p-3 rounded-xl">
                    <div className="flex gap-3 items-center mb-3">
                      <div className="bg-[#FF8C00] text-white w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm">🗺️</div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Ubicación Registrada</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedReport.location?.manualAddress || 'Coordenadas enviadas'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Botón dinámico para abrir Google Maps */}
                    {selectedReport.location?.latitude && selectedReport.location?.longitude ? (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedReport.location.latitude},${selectedReport.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-orange-100 dark:border-slate-700 hover:border-[#FF8C00] transition-colors"
                      >
                        <span className="text-xs font-bold text-[#FF8C00] ml-1 flex items-center gap-1">
                          Ver en Mapa <span className="text-[10px]">↗</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono hidden xs:inline">
                          (Lat: {selectedReport.location.latitude.toFixed(4)}, Lng: {selectedReport.location.longitude.toFixed(4)})
                        </span>
                      </a>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic mt-2 text-center">Coordenadas exactas no proporcionadas</div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
              <button 
                onClick={() => setSelectedReport(null)}
                className="w-full bg-[#003366] text-white font-bold py-3 rounded-xl hover:bg-[#002244] transition-colors text-sm shadow-md"
              >
                CERRAR VISUALIZADOR
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MyReportsView;