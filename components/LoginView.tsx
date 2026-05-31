import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

interface User {
  curp: string;
  primer_nombre: string;
  primer_apellido: string;
  rol: string;
}

interface Props {
  onLoginSuccess: (user: User) => void;
  onGuestAccess: () => void;
  onAdminAccess: () => void;
}

const LoginView: React.FC<Props> = ({ onLoginSuccess, onGuestAccess, onAdminAccess }) => {
  // Estados para controlar el flujo
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: CURP, 2: Login, 3: Registro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Datos del formulario
  const [curp, setCurp] = useState('');
  const [telefono, setTelefono] = useState('');
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');

  // Paso 1: Verificar si la CURP existe
  const handleVerificarCurp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (curp.length !== 18) {
      setError('La CURP debe tener exactamente 18 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'verificar', curp })
      });
      
      const data = await response.json();
      
      if (data.existe) {
        setStep(2); // Usuario existe, pedir teléfono (contraseña)
      } else {
        setStep(3); // Usuario nuevo, pedir datos de registro
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2 y 3: Registrar o Iniciar Sesión
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (telefono.length !== 10) {
      setError('El teléfono debe tener 10 dígitos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        accion: 'registrar_o_entrar',
        curp,
        telefono,
        primer_nombre: primerNombre,
        segundo_nombre: segundoNombre,
        primer_apellido: primerApellido,
        segundo_apellido: segundoApellido
      };

      const response = await fetch(`${API_BASE_URL}/auth.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        onLoginSuccess(data.usuario);
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Cabecera idéntica al diseño */}
      <div className="w-full max-w-md bg-[#003366] rounded-t-3xl p-6 text-center text-white shadow-lg">
        <h1 className="text-xl font-black tracking-widest">ALERTA VERACRUZ</h1>
        <p className="text-xs text-slate-300 mt-1">H. AYUNTAMIENTO</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-b-3xl p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          {/* Aquí iría tu logo, usamos un placeholder estilizado por ahora */}
          <div className="w-20 h-20 bg-orange-100 rounded-full border-4 border-[#FF8C00] flex items-center justify-center">
            <span className="text-2xl">🛡️</span>
          </div>
        </div>

        <h2 className="text-center text-xl font-bold text-[#003366] mb-2">IDENTIFICACIÓN</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg text-center">{error}</div>}

        {/* --- PEDIR CURP --- */}
        {step === 1 && (
          <form onSubmit={handleVerificarCurp} className="space-y-4">
            <p className="text-center text-sm text-slate-500 mb-6">Ingresa tu CURP para continuar con el reporte o ver tu historial.</p>
            
            <input
              type="text"
              placeholder="ESCRIBE TU CURP"
              className="w-full text-center uppercase tracking-widest border-2 border-slate-200 p-4 rounded-xl focus:border-[#FF8C00] outline-none transition-colors"
              value={curp}
              onChange={(e) => setCurp(e.target.value.toUpperCase())}
              maxLength={18}
              required
            />
            
            {/* Botón principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#003366] text-white font-bold py-4 rounded-xl hover:bg-[#002244] transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? 'Verificando...' : 'CONTINUAR'}
            </button>
            
            {/* Botón de Soporte Técnico */}
            <button
              type="button"
              onClick={() => alert("Módulo de soporte técnico en construcción.")}
              className="w-full bg-[#FFC107] text-[#003366] font-bold py-3 rounded-xl hover:bg-[#ffb300] transition-colors text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="text-sm">❓</span> ¿PROBLEMAS PARA ACCEDER? SOPORTE TÉC.
            </button>

            {/* Divisor Visual */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-[10px] font-bold tracking-widest uppercase">O entra como invitado</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Botón de Invitado */}
            <button 
              type="button" 
              onClick={onGuestAccess}
              className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors text-sm"
            >
              Continuar sin Identificación
            </button>

            {/* Enlace PC-ADMIN */}
            <div className="mt-6 pt-4 text-center">
              <button
                type="button"
                onClick={onAdminAccess}
                className="text-orange-600 font-bold text-[10px] tracking-widest uppercase hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <span className="text-sm">🔒</span> ACCESO PC-ADMIN
              </button>
            </div>
          </form>
        )}

        {/* --- LOGIN --- */}
        {step === 2 && (
          <form onSubmit={handleAuth} className="space-y-4">
            <p className="text-center text-sm text-slate-500 mb-6">¡Hola de nuevo! Ingresa tu teléfono para verificar tu identidad.</p>
            <div className="p-3 bg-slate-100 rounded-xl text-center text-slate-500 text-sm font-mono mb-4">
              CURP: {curp}
            </div>
            <input
              type="tel"
              placeholder="Teléfono móvil (10 dígitos)"
              className="w-full border-2 border-slate-200 p-4 rounded-xl focus:border-[#FF8C00] outline-none transition-colors"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8C00] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Accediendo...' : 'INICIAR SESIÓN'}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-slate-500 mt-4 hover:text-[#003366]">
              ← Cambiar CURP
            </button>
          </form>
        )}

        {/* --- REGISTRO --- */}
        {step === 3 && (
          <form onSubmit={handleAuth} className="space-y-4">
            <p className="text-center text-sm text-slate-500 mb-4">Por favor verifica o escribe tu nombre completo.</p>
            
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Primer Nombre *" className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm" value={primerNombre} onChange={(e) => setPrimerNombre(e.target.value.toUpperCase())} required />
              <input type="text" placeholder="Segundo Nombre" className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm" value={segundoNombre} onChange={(e) => setSegundoNombre(e.target.value.toUpperCase())} />
              <input type="text" placeholder="Primer Apellido *" className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm" value={primerApellido} onChange={(e) => setPrimerApellido(e.target.value.toUpperCase())} required />
              <input type="text" placeholder="Segundo Apellido" className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm" value={segundoApellido} onChange={(e) => setSegundoApellido(e.target.value.toUpperCase())} />
            </div>

            <input type="tel" placeholder="Teléfono Móvil (Será tu contraseña) *" className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-[#FF8C00] outline-none text-sm mt-2" value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))} maxLength={10} required />

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300">
                Regresar
              </button>
              <button type="submit" disabled={loading} className="w-2/3 bg-[#FF8C00] text-white font-bold py-3 rounded-xl hover:bg-orange-600 disabled:opacity-50">
                {loading ? 'Cargando...' : 'REGISTRAR Y ENTRAR'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginView;