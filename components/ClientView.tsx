
import React, { useState, useRef, useEffect } from 'react';
import { IncidentReport, LocationData } from '../types';
import ChatBot from './ChatBot';

interface Props {
  onReportSubmit: (report: IncidentReport) => void;
}

const ClientView: React.FC<Props> = ({ onReportSubmit }) => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationData>({ isManual: false });
  const [isLocating, setIsLocating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 1280;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
        setImage(compressedBase64); // Guardamos la versión ligera
      };
    };
    reader.readAsDataURL(file);
    }
  };

  const requestLocation = () => {
    setIsLocating(true);
    const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
    };
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            isManual: false
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setIsLocating(false);
          if (error.code === 1) alert("Permiso denegado. Revisa si Chrome tiene permiso de ubicación.");
          else if (error.code === 3) alert("Se agotó el tiempo de espera para obtener GPS.");
          else alert("Error de ubicación: " + error.message);
        },
        options
      );
    } else {
      setIsLocating(false);
      alert("Geolocalización no soportada en este dispositivo.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !name.trim() || !phone.trim()) {
      alert("Por favor completa todos los campos requeridos (Descripción, Nombre y Teléfono).");
      return;
    }

    if (!location.latitude && !location.manualAddress) {
      alert("Por favor indica la ubicación mediante GPS o dirección manual.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("El teléfono debe tener exactamente 10 dígitos numéricos.");
      return;
    }

    const report: IncidentReport = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      description,
      image: image,
      location,
      status: isOnline ? 'sent' : 'pending',
      severityAnalysis: '',
      informantName: name,
      informantPhone: phone
    };

    onReportSubmit(report);
    
    setImage(null);
    setDescription('');
    setLocation({ isManual: false });
    alert(isOnline ? "Reporte enviado con éxito." : "Reporte guardado localmente. Se enviará cuando recuperes conexión.");
  };

  return (
    <div className="p-4 space-y-6 animate-in slide-in-from-left-4 duration-300">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-[#003366] uppercase tracking-tight">Reportar Percance</h2>
        <div className="h-1 w-16 bg-[#FF8C00] rounded-full"></div>
      </div>

      {!isOnline && (
        <div className="bg-orange-100 border-l-4 border-[#FF8C00] text-orange-800 p-4 rounded-xl text-sm flex items-center gap-3 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF8C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div>
            <p className="font-bold uppercase text-xs">Modo Offline Activo</p>
            <p className="opacity-90">Tus reportes se guardarán y enviarán al recuperar internet.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 p-6 space-y-6">
        {/* Sección de Foto */}
        <div className="space-y-3">
          <label className="text-xs font-black text-[#003366] uppercase tracking-widest flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Evidencia Visual
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${image ? 'border-green-500 shadow-inner' : 'border-slate-300 hover:border-[#FF8C00] bg-slate-50'}`}
            style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {!image && (
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <span className="text-[#003366] font-black text-sm uppercase">Tomar Foto del Suceso</span>
                <p className="text-xs text-slate-400 mt-1">Obligatorio para procesar reporte</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleCapture}
            />
          </div>
        </div>

        {/* Sección de Descripción */}
        <div className="space-y-3">
          <label className="text-xs font-black text-[#003366] uppercase tracking-widest flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Descripción del Percance
          </label>
          <textarea
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-4 focus:ring-orange-100 focus:border-[#FF8C00] outline-none transition-all"
            placeholder="Describe brevemente qué pasó (ej. Inundación en Av. Díaz Mirón, cable de alta tensión suelto...)"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Sección de Ubicación */}
        <div className="space-y-3">
          <label className="text-xs font-black text-[#003366] uppercase tracking-widest flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Ubicación del Incidente
          </label>
          
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={requestLocation}
              disabled={isLocating}
              className={`flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-black transition-all shadow-sm border ${
                location.latitude 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-white text-[#003366] border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`p-1 rounded-full ${location.latitude ? 'bg-green-500 text-white' : 'bg-slate-100 text-[#003366]'}`}>
                {isLocating ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                )}
              </div>
              {isLocating ? 'Obteniendo coordenadas...' : location.latitude ? 'GPS Confirmado' : 'Usar mi ubicación actual'}
            </button>
            
            <div className="relative group">
              <input
                type="text"
                placeholder="O ingresa la dirección manualmente"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-12 text-sm focus:ring-4 focus:ring-orange-100 focus:border-[#FF8C00] outline-none transition-all"
                value={location.manualAddress || ''}
                onChange={(e) => setLocation({ ...location, manualAddress: e.target.value, isManual: true })}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-4 text-slate-400 group-focus-within:text-[#FF8C00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sección de Contacto */}
        <div className="space-y-4 bg-orange-50 p-4 rounded-2xl border border-orange-200">
          <h4 className="text-xs font-black text-orange-700 uppercase">Datos de Contacto</h4>
          <input 
            type="text" 
            placeholder="Tu Nombre Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-white focus:border-orange-500 outline-none"
            required
          />

          <input 
          type="tel" 
          placeholder="Tu Teléfono (10 dígitos)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={10}
          className="w-full p-3 rounded-xl border-2 border-white focus:border-orange-500 outline-none"
          required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#003366] hover:bg-[#002244] text-white font-black py-5 rounded-3xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Enviar Reporte Ahora
        </button>
      </form>

      <div className="bg-[#FF8C00]/10 border border-[#FF8C00]/20 rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#FF8C00] rounded-full flex items-center justify-center text-white font-black text-xs">!</div>
          <h3 className="font-black text-[#003366] uppercase text-xs tracking-wider">Aviso importante</h3>
        </div>
        <p className="text-[11px] text-[#003366]/70 leading-relaxed font-medium">
          Este sistema es para reportar percances urbanos. En caso de riesgo de vida inmediato, llame al 911. Hacer reportes falsos es un delito.
        </p>
      </div>

      // En tu ClientView.tsx
      <ChatBot 
          onLocationDetected={(lat, lng) => {
          setLocation({ latitude: lat, longitude: lng, isManual: false });
          }} 
      />
    </div>
  );
};

export default ClientView;
