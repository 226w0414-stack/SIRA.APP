
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import ClientView from './components/ClientView';
import AdminView from './components/AdminView';
import MyReportsView from './components/MyReportsView';
import { IncidentReport } from './types';
import { API_BASE_URL } from './config';

const Navigation = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  // Si estamos en la vista de admin, mostramos una navegación diferente o simplificada
  if (isAdmin) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-[#002244] text-white border-t border-orange-500/50 z-50">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className="flex flex-col items-center flex-1 py-2 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-[10px] mt-1 uppercase font-bold text-orange-400">Cerrar Monitor</span>
          </Link>
        </div>
      </nav>
    );
  }

  // Navegación exclusiva para el CLIENTE
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#003366] text-white border-t border-[#FF8C00]/30 z-50">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center flex-1 py-2 transition-colors ${location.pathname === '/' ? 'bg-[#FF8C00] text-white' : 'text-slate-300 hover:text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="text-[10px] mt-1 uppercase font-bold">Reportar</span>
        </Link>
        <Link 
          to="/mis-reportes" 
          className={`flex flex-col items-center flex-1 py-2 transition-colors ${location.pathname === '/mis-reportes' ? 'bg-[#FF8C00] text-white' : 'text-slate-300 hover:text-white'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-[10px] mt-1 uppercase font-bold">Mis Reportes</span>
        </Link>
      </div>
    </nav>
  );
};

const Header = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <header className={`${isAdmin ? 'bg-[#002244]' : 'bg-[#003366]'} text-white p-4 shadow-md sticky top-0 z-50 flex items-center justify-between border-b-4 border-[#FF8C00]`}>
      <div className="flex items-center gap-3">
        <Link to="/" className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 border border-slate-200 shadow-inner">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjhGfi9MlZ3jVzjEh-a7wN9adjgEJ1dxN2aw&s" alt="PC Logo" className="w-full h-full object-contain" />
        </Link>
        <div>
          <h1 className="text-lg font-black leading-none tracking-tight">ALERTA VERACRUZ</h1>
          <p className="text-[9px] tracking-widest text-orange-400 font-bold mt-1 uppercase">
            {isAdmin ? 'MÓDULO DE INTELIGENCIA Y DESPACHO' : 'H. AYUNTAMIENTO DE VERACRUZ'}
          </p>
        </div>
      </div>
      <div className="text-right">
        {!isAdmin ? (
          <>
            <div className="text-[10px] uppercase font-bold text-orange-400">Emergencias</div>
            <a href="tel:911" className="text-xl font-black text-white active:text-orange-300 transition-colors">911</a>
          </>
        ) : (
          <div className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded">PC-ADMIN</div>
        )}
      </div>
    </header>
  );
};

const App: React.FC = () => {
  const [reports, setReports] = useState<IncidentReport[]>([]);

  useEffect(() => {
    const fetchReportsFromServer = async() => {
      try {
        const response = await fetch(`${API_BASE_URL}/sira_db/get_reports.php`);
        if (response.ok) {
          const data = await response.json();
          setReports(data);
        }
      } catch (error) {
        console.error("Error al cargar reportes de XAMPP:", error);
        const saved = localStorage.getItem('pc_veracruz_reports');
        if (saved) setReports(JSON.parse(saved));
      }
    };
    fetchReportsFromServer();
  }, []);

  const handleAddReport = async (newReport: IncidentReport) => {
    console.log("Enviando reporte:", newReport);
    try {
      const response = await fetch(`${API_BASE_URL}/sira_db/save_report.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReport)
      });
      
      const result = await response.json();

      if (response.ok) {
        const updated = [newReport, ...reports];
        setReports(updated);
        localStorage.setItem('pc_veracruz_reports', JSON.stringify(updated));
        alert("¡Reporte enviado y guardado en la base de datos de Protección Civil!");
      }
      else {
      alert("Error del servidor: " + result.error);
      }
    } catch (error) {
    console.error("Error de conexión:", error);
    alert("No se pudo conectar con el servidor. El reporte se guardó solo localmente.");
    }
  };

  const handleFinalizeReport = (id: string) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas finalizar este reporte? Esta acción no se puede deshacer.");
    if (confirmed) {
      const updated = reports.filter(report => report.id !== id);
      setReports(updated);
      localStorage.setItem('pc_veracruz_reports', JSON.stringify(updated));
      alert("El reporte ha sido finalizado y retirado del monitor.");
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col pb-16 bg-slate-50 selection:bg-orange-200">
        <Header />
        <main className="flex-1 overflow-auto max-w-2xl mx-auto w-full">
          <Routes>
            {/* Rutas del Cliente */}
            <Route path="/" element={<ClientView onReportSubmit={handleAddReport} />} />
            <Route path="/mis-reportes" element={<MyReportsView reports={reports} />} />
            
            {/* Ruta de Protección Civil (Oculta del menú del cliente) */}
            <Route
            path="/admin"
            element={<AdminView reports={reports} onFinalize={handleFinalizeReport} />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </HashRouter>
  );
};

export default App;
