import React, { useState } from 'react';

interface Props {
  onAdminLogin: (adminUser: any) => void;
  onCancel: () => void;
}

const AdminLoginView: React.FC<Props> = ({ onAdminLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulador de validación (Aquí luego puedes conectarlo a un login_admin.php)
    setTimeout(() => {
      if (username === 'TECNMADMIN' && password !== '') {
        // Login exitoso
        onAdminLogin({
          curp: 'TECNMADMIN',
          primer_nombre: 'Administrador',
          primer_apellido: 'Sistema',
          rol: 'admin'
        });
      } else {
        setError('Credenciales institucionales incorrectas.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* Cabecera */}
      <div className="w-full max-w-md bg-[#003366] dark:bg-slate-950 rounded-t-3xl p-6 text-center text-white shadow-lg border-b-4 border-[#FF8C00]">
        <h1 className="text-xl font-black tracking-widest">ALERTA VERACRUZ</h1>
        <p className="text-xs text-slate-300 mt-1">MÓDULO DE INTELIGENCIA</p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-b-3xl p-8 shadow-xl border border-t-0 border-slate-200 dark:border-slate-700">
        
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full border-4 border-red-500 flex items-center justify-center">
            <span className="text-2xl">🚨</span>
          </div>
        </div>

        <h2 className="text-center text-xl font-bold text-[#003366] dark:text-slate-100 mb-1">IDENTIFICACIÓN</h2>
        <p className="text-center text-[10px] font-bold text-red-600 dark:text-red-400 tracking-widest uppercase mb-6">
          PANEL ADMINISTRATIVO<br/><span className="text-slate-500 dark:text-slate-400">Solo personal autorizado</span>
        </p>
        
        {error && <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-bold rounded-lg text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Input Usuario Institucional */}
          <div>
            <label className="block text-[10px] font-bold text-[#003366] dark:text-slate-300 mb-1 tracking-wider uppercase">Usuario Institucional</label>
            <input
              type="text"
              placeholder="TECNMADMIN"
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:border-red-500 outline-none transition-colors text-sm font-mono uppercase"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
              required
            />
          </div>

          {/* Input Contraseña */}
          <div className="relative">
            <label className="block text-[10px] font-bold text-[#003366] dark:text-slate-300 mb-1 tracking-wider uppercase">Contraseña</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••"
              className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 p-3 rounded-xl focus:border-red-500 outline-none transition-colors text-sm font-mono"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </button>
          </div>

          {/* Botonera */}
          <div className="flex gap-3 mt-8 pt-4">
            <button 
              type="button" 
              onClick={onCancel}
              className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="w-2/3 bg-[#003366] text-white font-bold py-3 rounded-xl hover:bg-[#002244] transition-colors text-sm shadow-md disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'INICIAR SESIÓN'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AdminLoginView;