
import React from 'react';
import { IncidentReport } from '../types';

interface Props {
  reports: IncidentReport[];
}

const MyReportsView: React.FC<Props> = ({ reports }) => {
  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-[#003366] uppercase tracking-tight">Historial de Reportes</h2>
        <div className="h-1 w-16 bg-[#FF8C00] rounded-full"></div>
        <p className="text-slate-500 text-sm mt-2">Aquí puedes consultar el estado de los percances que has reportado.</p>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">Aún no has realizado ningún reporte.</p>
            <p className="text-xs text-slate-300 mt-2">Tus reportes aparecerán aquí una vez que los envíes.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-shadow">
              <div className="flex flex-col xs:flex-row">
                <div className="xs:w-24 h-24 xs:h-auto bg-slate-100">
                  <img src={report.image} alt="Evidencia" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      report.status === 'sent' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status === 'sent' ? 'Recibido' : 'Pendiente (Offline)'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(report.timestamp).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-[#003366] text-sm mt-1 line-clamp-2">{report.description}</h3>
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="truncate">
                      {report.location.manualAddress || (report.location.latitude ? 'Ubicación Geográfica' : 'Sin dirección')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 items-center">
        <div className="bg-[#003366] text-white p-2 rounded-xl">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
        </div>
        <div>
          <h4 className="text-xs font-black text-[#003366] uppercase">¿Sabías que?</h4>
          <p className="text-[11px] text-blue-700 mt-0.5">Tus reportes ayudan a los agentes de Protección Civil a actuar más rápido ante desastres naturales.</p>
        </div>
      </div>
    </div>
  );
};

export default MyReportsView;
