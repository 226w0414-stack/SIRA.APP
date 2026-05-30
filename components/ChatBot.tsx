
import React, { useState, useRef, useEffect } from 'react';
import { getAiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

interface Props {
  onLocationFound?: (lat: number, lng: number) => void;
}

const ChatBot: React.FC<Props> = ({ onLocationFound }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¿En qué puedo ayudar? ¿Se cayó otro árbol?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: text.trim() };
    const newMessages = [...messages, userMsg];
    
    setInput('');
    setMessages(newMessages);
    setIsTyping(true);

    const aiResponse = await getAiResponse(newMessages);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse || "Lo siento, no pude procesar tu mensaje." }]);
  };

  const handleQuickAction = (text: string) => {
    handleSend(text);
  };

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { role: 'model', text }]);
  };

  // Dentro de tu componente ChatBot
  const handleLocationRequest = () => {
    addBotMessage("Solicitando acceso a tu GPS... por favor confirma el permiso en tu navegador.");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Aquí mandas las coordenadas al chat como si fuera un mensaje del usuario
          addBotMessage(`He recibido tu ubicación: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Ya la he registrado en tu reporte.`);
        
          if (onLocationFound) {
            onLocationFound(latitude, longitude);
          }
        },
        (error) => {
          console.error(error);
          addBotMessage("No pude acceder a tu ubicación. Por favor, asegúrate de darme permiso en el navegador.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else{
      addBotMessage("Tu dispositivo no soporta geolocalización.");
    }
  };

  const startListening = async () => {
    try {
      // 1. Verificar si el celular tiene el motor de voz disponible
      const available = await SpeechRecognition.available();
      
      if (available.available) {
        // 2. Pedir permiso para usar el micrófono en el teléfono
        const status = await SpeechRecognition.requestPermissions();
        if (status.speechRecognition !== 'granted') {
        alert("Se requieren permisos de micrófono para dictar.");
        return;
        }

        // 3. Comenzar a escuchar el audio en español
        SpeechRecognition.start({
          language: "es-MX",
          maxResults: 1,
          partialResults: false,
        });

        // 4. Capturar el resultado y ponerlo en el input del chat
        SpeechRecognition.addListener("partialResults", (data: any) => {
          if (data.matches && data.matches.length > 0) {
            // Cambia 'setInput' por la variable que uses para el texto del chat
            setInput(data.matches[0]); 
          }
        });
      } else {
        // FALLBACK: Si está en computadora (Netlify), usa el método tradicional
        const WebSpeech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!WebSpeech) {
          alert("Dictado por voz no soportado en este navegador.");
          return;
        }
        const recognition = new WebSpeech();
        recognition.lang = 'es-MX';
        recognition.onresult = (event: any) => {
          setInput(event.results[0][0].transcript);
        };
        recognition.start();
      }
    } catch (error) {
      console.error("Error en dictado por voz:", error);
    }
  };

  // Función principal de reproducción/pausa
  const handleToggleSpeech = (text: string, index: number) => {
    // Verificamos si el celular/navegador soporta la API
    if (!('speechSynthesis' in window)) {
      alert("Tu dispositivo no soporta la síntesis de voz nativa.");
      return;
    }

    // Si el usuario le da clic al botón mientras ya está hablando ese mismo mensaje, lo pausamos/detenemos
    if (isSpeaking && speakingIndex === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingIndex(null);
      return;
    }

    // Cancelamos cualquier audio anterior por seguridad
    window.speechSynthesis.cancel();

    // Configuramos la nueva voz
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-MX'; // Español de México
    utterance.rate = 1.0;     // Velocidad normal

    // Evento: Cuando el bot termina de hablar naturalmente
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    // Evento: Si ocurre un error
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingIndex(null);
    };

    // Activamos la voz y actualizamos los estados visuales
    setIsSpeaking(true);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Botón Flotante con branding de Veracruz */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 w-16 h-16 bg-[#FF8C00] text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-all hover:scale-110 active:scale-95 border-4 border-white"
        aria-label="Abrir asistente de IA"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="fixed inset-4 bottom-20 bg-white rounded-3xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Cabecera con colores de Protección Civil */}
          <div className="bg-[#003366] text-white p-5 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 border-2 border-[#FF8C00]">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjhGfi9MlZ3jVzjEh-a7wN9adjgEJ1dxN2aw&s" alt="PC" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-bold block text-sm">Asistente Civil IA</span>
                <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">Ayuntamiento de Veracruz</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Área de Mensajes */}
          <div ref={scrollRef} className="flex-1 p-5 overflow-auto space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                {/* Burbuja del mensaje */}
                <div className={`p-3 rounded-xl max-w-[85%] shadow-sm ${m.role === 'user' ? 'bg-[#FF8C00] text-white' : 'bg-slate-200 text-slate-800'}`}>
                  {/* Texto del mensaje */}
                  <p className="text-sm">{m.text}</p>
                  {/* BOTÓN DE VOZ */}
                  {m.role === 'model' && (
                    <button 
                      onClick={() => handleToggleSpeech(m.text, i)}
                      className="mt-2 text-xs flex items-center gap-1 bg-slate-300 hover:bg-slate-400 text-slate-700 py-1 px-2 rounded-lg transition-colors font-medium"
                      title="Escuchar respuesta"
                    >
                      {isSpeaking && speakingIndex === i ? (
                        <><span>⏹️</span></>
                      ) : (
                        <><span>🔊</span></>
                      )}
                    </button>
                  )}

              </div>
            </div>
          ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Sugerencias Rápidas */}
          <div className="px-4 py-3 border-t border-slate-100 flex gap-2 overflow-x-auto bg-white scrollbar-hide">
            <button
              onClick={handleLocationRequest}
              className="whitespace-nowrap px-4 py-2 rounded-full bg-blue-50 text-[#003366] text-xs font-black border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-2"
            >
            📍 Compartir mi ubicación
            </button>

            {['¿Se cayó un árbol?', 'Tengo una inundación', 'Cables sueltos', '¿Qué hago si hay Norte?'].map((txt) => (
              <button
                key={txt}
                onClick={() => handleQuickAction(txt)}
                className="whitespace-nowrap px-4 py-2 rounded-full bg-orange-50 text-[#003366] text-xs font-bold border border-orange-200 hover:bg-orange-100 transition-colors"
              >
                {txt}
              </button>
            ))}
          </div>

          {/* Barra de Entrada */}
          <div className="p-4 bg-white border-t border-slate-100 mb-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu duda aquí..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-14 h-14 bg-[#003366] text-white rounded-2xl flex items-center justify-center shadow-lg disabled:opacity-50 hover:bg-[#002244] active:scale-90 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
              <button onClick={startListening}> 🎤 </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-2 font-medium">En caso de emergencia vital llame siempre al 911</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
