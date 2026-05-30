import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

interface User {
  curp: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  telefono: string;
  rol: string;
}

interface ProfileViewProps {
  user: User;
  onProfileUpdate: (updatedUser: User) => void;
  onClose: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onProfileUpdate, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Estados locales con los datos actuales del usuario
  const [primerNombre, setPrimerNombre] = useState(user.primer_nombre || '');
  const [segundoNombre, setSegundoNombre] = useState(user.segundo_nombre || '');
  const [primerApellido, setPrimerApellido] = useState(user.primer_apellido || '');
  const [segundoApellido, setSegundoApellido] = useState(user.segundo_apellido || '');
  const [telefono, setTelefono] = useState(user.telefono || '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si navega como invitado, no permitir la edición en base de datos
    if (user.curp.startsWith('INVITADO')) {
      setError('Los usuarios invitados no pueden modificar perfiles.');
      return;
    }

    if (telefono.length !== 10) {
      setError('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/update_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curp: user.curp,
          primer_nombre: primerNombre.toUpperCase(),
          segundo_nombre: segundoNombre.toUpperCase(),
          primer_apellido: primerApellido.toUpperCase(),
          segundo_apellido: segundoApellido.toUpperCase(),
          telefono: telefono
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.mensaje);
        // Actualizar el estado global en App.tsx y el localStorage
        onProfileUpdate(data.usuario);
      } else {
        setError(data.error || 'Ocurrió un error al actualizar.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        
        {/* Cabecera del Perfil (Idéntica a tu Mockup 4) */}
        <div className="bg-[#003366] dark:bg-slate-950 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <div>
              <h3 className="font-bold text-base leading-none">Mi Perfil Ciudadano</h3>
              <p className="text-[11px] text-slate-300 mt-1">Verifica o actualiza tu información.</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors font-bold text-sm">
            ✕
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {error && <div className="p-3 bg-red-100 text-red-700 text-xs font-semibold rounded-xl text-center">{error}</div>}
          {successMsg && <div className="p-3 bg-green-100 text-green-700 text-xs font-semibold rounded-xl text-center">{successMsg}</div>}

          {/* Campo CURP - Bloqueado como especificaste en el diseño */}
          <div>
            <label className="block text-[11px] font-bold text-[#003366] dark:text-slate-300 mb-1 tracking-wider">CURP (IDENTIFICADOR PÚBLICO)</label>
            <input 
              type="text" 
              value={user.curp} 
              disabled 
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-sm uppercase select-none cursor-not-allowed"
            />
            {user.curp.startsWith('INVITADO') && (
              <p className="text-[10px] text-amber-600 font-medium mt-1">⚠️ Navegando en modo invitado temporal.</p>
            )}
          </div>

          {/* Nombres */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">PRIMER NOMBRE *</label>
              <input 
                type="text" 
                value={primerNombre} 
                onChange={(e) => setPrimerNombre(e.target.value)} 
                required
                className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm uppercase transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">SEGUNDO NOMBRE</label>
              <input 
                type="text" 
                value={segundoNombre} 
                onChange={(e) => setSegundoNombre(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm uppercase transition-colors"
              />
            </div>
          </div>

          {/* Apellidos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">PRIMER APELLIDO *</label>
              <input 
                type="text" 
                value={primerApellido} 
                onChange={(e) => setPrimerApellido(e.target.value)} 
                required
                className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm uppercase transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">SEGUNDO APELLIDO</label>
              <input 
                type="text" 
                value={segundoApellido} 
                onChange={(e) => setSegundoApellido(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm uppercase transition-colors"
              />
            </div>
          </div>

          {/* Teléfono / Contraseña */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">TELÉFONO MÓVIL *</label>
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))} 
              maxLength={10}
              required
              className="w-full border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm transition-colors"
            />
          </div>

          {/* Botonera de Control */}
          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="w-2/3 bg-[#FF8C00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm shadow-md"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileView;