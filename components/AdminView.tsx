
import React from 'react';
import { IncidentReport } from '../types';

interface Props {
  reports: IncidentReport[];
  onFinalize: (id: string) => void;
}

const AdminView: React.FC<Props> = ({ reports, onFinalize}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-[#003366] text-white p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Monitor de Percances
        </h2>
        <p className="text-sm opacity-80 mt-1">Reportes ciudadanos en tiempo real</p>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" />
            </svg>
            <p className="mt-4">No hay reportes recientes.</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3 aspect-video md:aspect-auto">
                <img src={report.image} alt="Incidente" className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${report.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {report.status === 'sent' ? 'Recibido' : 'Pendiente Sincronización'}
                  </span>
                  <span className="text-xs text-slate-400">{new Date(report.timestamp).toLocaleString()}</span>
                </div>
                <h3 className="font-bold text-[#003366] text-lg mb-1">{report.description}</h3>
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-[10px] font-black text-blue-800 uppercase">Informante:</p>
                  <p className="text-sm font-bold text-slate-700">{report.informantName}</p>
                  <p className="text-xs text-slate-500">📞 {report.informantPhone}</p>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-600 mt-3 bg-slate-50 p-2 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 text-[#FF8C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {report.location.latitude ? `${report.location.latitude}, ${report.location.longitude}` : ''}
                    {report.location.manualAddress && ` - ${report.location.manualAddress}`}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                   className="flex-1 bg-[#FF8C00] text-white text-xs font-bold py-2 rounded hover:bg-[#e67e00]"
                   >Despachar Unidad
                  </button>
                  <button
                    onClick={() => onFinalize(report.id)}
                    className="flex-1 bg-red-50 text-red-600 border border-red-200 text-xs font-bold py-2 rounded hover:bg-red-600 hover:text-white transition-all"
                    >Finalizar Reporte
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminView;
