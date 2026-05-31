
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LoginView from './components/LoginView';
import ClientView from './components/ClientView';
import MyReportsView from './components/MyReportsView';
import AdminView from './components/AdminView';
import ProfileView from './components/ProfileView';
import AdminLoginView from './components/AdminLoginView';
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
        {/* BOTÓN SECRETO PARA ADMIN */}
        <Link 
          to="/admin" 
          onClick={(e) => {
            const pass = prompt("Clave:");
            if(pass !== "2125") e.preventDefault(); // Cancela el viaje si la clave es mal
          }}
          className="flex flex-col items-center flex-1 py-2 text-slate-400 opacity-20 hover:opacity-100"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[10px] mt-1">Admin</span>
        </Link>
      </div>
    </nav>
  );
};

const Header = ({ onOpenProfile }: { onOpenProfile: () => void }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Verificamos el tema guardado al cargar la cabecera
  useEffect(() => {
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (confirmar) {
      localStorage.removeItem('sira_user');
      window.location.reload();
    }
  };

  return (
    <header className={`${isAdmin ? 'bg-[#002244] dark:bg-slate-950' : 'bg-[#003366] dark:bg-slate-900'} text-white shadow-md sticky top-0 z-50 flex flex-col border-b-4 border-[#FF8C00] transition-colors duration-300`}>
      
      {/* Fila superior: Logo y 911 */}
      <div className="p-4 flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full border-2 border-[#FF8C00] flex items-center justify-center">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest leading-none">ALERTA VERACRUZ</h1>
            <p className="text-[10px] text-slate-300">
              {isAdmin ? 'MÓDULO DE INTELIGENCIA' : 'H. AYUNTAMIENTO'}
            </p>
          </div>
        </div>

        {/* Botón de Emergencias con enlace telefónico nativo */}
        {!isAdmin && (
          <a href="tel:911" className="bg-red-600 hover:bg-red-700 text-white font-black py-1 px-4 rounded-xl text-xl transition-colors shadow-lg flex items-center gap-1">
            <span className="text-sm font-normal mr-1 hidden sm:inline">EMERGENCIAS</span> 911
          </a>
        )}
      </div>

      {/* Fila inferior: Barra de herramientas (Mockup 3) */}
      <div className="bg-black/20 px-4 py-2 flex justify-between items-center text-sm w-full">
        <div className="flex gap-4">
          <button onClick={onOpenProfile} className="hover:text-[#FF8C00] transition-colors flex items-center gap-1">
            👤 <span className="hidden sm:inline">Perfil</span>
          </button>
          <button className="hover:text-[#FF8C00] transition-colors flex items-center gap-1 relative">
            🔔 <span className="hidden sm:inline">Avisos</span>
            {/* Indicador rojo de notificación */}
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-bold px-1 rounded-full">1</span>
          </button>
        </div>

        <div className="flex gap-4 items-center">
          <button onClick={toggleDarkMode} className="text-lg hover:scale-110 transition-transform" title="Alternar modo oscuro">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => window.location.reload()} className="hover:text-slate-300 transition-colors" title="Actualizar página">
            🔄
          </button>
          <button onClick={handleLogout} className="hover:text-red-400 transition-colors" title="Cerrar sesión">
            🚪
          </button>
        </div>
      </div>

    </header>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Comprueba si hay una sesión guardada cuando se abre la app
  useEffect(() => {
    const savedUser = localStorage.getItem('sira_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    const fetchReportsFromServer = async() => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_reports.php`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
        });
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
  
  // Función cuando el login es exitoso
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('sira_user', JSON.stringify(user));
  };

  const handleAdminLogin = (adminUser: any) => {
    setCurrentUser(adminUser);
    localStorage.setItem('sira_user', JSON.stringify(adminUser));
    // Redirección forzada usando HashRouter
    window.location.hash = '/admin'; 
  };

  // Función para modo invitado
  const handleGuestAccess = () => {
    const guestUser = { curp: 'INVITADO', rol: 'ciudadano', primer_nombre: 'Invitado' };
    setCurrentUser(guestUser);
    // No lo guardamos en localStorage para que la próxima vez vuelva a pedir login
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('sira_user', JSON.stringify(updatedUser));
  };

  const handleAddReport = async (newReport: IncidentReport) => {
    console.log("Enviando reporte:", newReport);
    try {
      const response = await fetch(`${API_BASE_URL}/save_report.php`, {
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

  const handleFinalizeReport = async (id: string) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas finalizar este reporte? Esta acción se borrará permanentemente de la base de datos.");
    
    if (confirmed) {
      try {
        // 1. Avisar al Backend (Render) que borre el registro en PostgreSQL
        const response = await fetch(`${API_BASE_URL}/delete_report.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // 2. Si el backend lo borró con éxito, actualizamos la pantalla
          const updated = reports.filter(report => report.id !== id);
          setReports(updated);
          
          // 3. Limpiamos también el localStorage para que todo coincida
          localStorage.setItem('pc_veracruz_reports', JSON.stringify(updated));
          
          alert("El reporte ha sido eliminado permanentemente de la base de datos.");
        } else {
          alert("Error al intentar borrar en el servidor: " + (result.error || "Desconocido"));
        }
      } catch (error) {
        console.error("Error de conexión al eliminar:", error);
        alert("No se pudo conectar con el servidor para eliminar el reporte.");
      }
    }
  };

  const handleDispatchUnit = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dispatch_unit.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        // Actualizamos el estado localmente para que cambie el color en pantalla
        setReports(prev => prev.map(r => r.id === id ? { ...r, estado: 'en_camino' } : r));
        alert("Unidad marcada como 'En Camino'.");
      }
    } catch (error) {
      console.error("Error al despachar:", error);
    }
  };

  return (
    <HashRouter>
      {!currentUser ? (
        // Si NO hay usuario, decidimos qué pantalla de login mostrar
        showAdminLogin ? (
          <AdminLoginView 
          onAdminLogin={handleAdminLogin} 
          onCancel={() => setShowAdminLogin(false)} 
          />
        ) : (
        <LoginView
        onLoginSuccess={handleLoginSuccess}
        onGuestAccess={handleGuestAccess}
        onAdminAccess={() => setShowAdminLogin(true)}
        />
        )
      ) : (
        <div className="min-h-screen flex flex-col pb-16 bg-slate-50 dark:bg-slate-900 dark:text-white selection:bg-orange-200 transition-colors duration-300">
          {/* Le pasamos la función al Header para que sepa cómo abrir el perfil */}
          <Header onOpenProfile={() => setIsProfileOpen(true)} />
          
          <main className="flex-1 overflow-auto max-w-2xl mx-auto w-full">
            <Routes>
              {/* Rutas del Cliente */}
              <Route path="/" element={<ClientView onReportSubmit={handleAddReport} />} />
              <Route path="/mis-reportes" element={<MyReportsView reports={reports} />} />
              {/* Ruta de Protección Civil (Oculta del menú del cliente) */}
              <Route
                path="/admin"
                element={<AdminView reports={reports} onFinalize={handleFinalizeReport} onDispatch={handleDispatchUnit} />} 
              />
            </Routes>
          </main>
          <Navigation />

          {/* RENDERIZADO CONDICIONAL DEL PERFIL */}
          {isProfileOpen && (
            <ProfileView 
              user={currentUser} 
              onProfileUpdate={handleProfileUpdate} 
              onClose={() => setIsProfileOpen(false)} 
            />
          )}

        </div>
      )}
    </HashRouter>
  );
};

export default App;