import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Radio, Mic, Moon, Users, MapPin } from 'lucide-react';

export default function Home() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState(null);
  const [statusText, setStatusText] = useState("Aktivní ochranný štít OK");

  useEffect(() => {
    let timer;
    if (isEmergency && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isEmergency && countdown === 0) {
      setStatusText("POLICIE A ZÁCHRANKA BYLY ZALARMOVÁNY!");
      if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
    }
    return () => clearTimeout(timer);
  }, [isEmergency, countdown]);

  const triggerSOS = () => {
    if (!isEmergency) {
      setIsEmergency(true);
      setCountdown(5);
      setStatusText("Spouštím nouzový protokol...");
      if (navigator.vibrate) navigator.vibrate(200);
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          () => setStatusText("Chyba: Nepodařilo se získat GPS polohu")
        );
      }
    } else {
      setIsEmergency(false);
      setCountdown(5);
      setStatusText("Aktivní ochranný štít OK");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto justify-between p-6 bg-neutral-950 text-white select-none">
      
      <div className={`flex items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 ${
        isEmergency ? 'bg-red-950/50 border-red-500 text-red-400' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'
      }`}>
        {isEmergency ? <ShieldAlert className="animate-bounce" /> : <Shield />}
        <span className="font-semibold tracking-wide text-sm uppercase">{statusText}</span>
      </div>

      <div className="flex flex-col items-center justify-center my-auto relative">
        {isEmergency && (
          <div className="absolute w-72 h-72 rounded-full bg-red-600/20 animate-pulse-ring" />
        )}
        
        <button
          onClick={triggerSOS}
          className={`w-64 h-64 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-all duration-300 active:scale-95 z-10 ${
            isEmergency 
              ? 'bg-red-600 border-red-400 shadow-red-600/50' 
              : 'bg-neutral-900 border-neutral-800 shadow-black'
          }`}
        >
          {isEmergency ? (
            <div className="text-center">
              <span className="block text-6xl font-black mb-1">{countdown}</span>
              <span className="text-xs uppercase font-bold tracking-widest opacity-80">Kliknutím zrušíš</span>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center gap-2">
              <Radio size={48} className="text-red-500 animate-pulse" />
              <span className="text-4xl font-black text-red-500 tracking-wider">SOS</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">Podrž nebo stiskni</span>
            </div>
          )}
        </button>

        {location && (
          <div className="mt-6 flex items-center gap-2 text-xs text-neutral-400 bg-neutral-900/50 px-3 py-1.5 rounded-full border border-neutral-800">
            <MapPin size={12} className="text-emerald-500" />
            <span>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 active:bg-neutral-900 transition-colors">
          <Moon size={24} className="text-amber-500" />
          <div className="text-center">
            <span className="block text-xs font-bold">Režim doprovodu</span>
            <span className="text-[10px] text-neutral-500">Cesta domů ve tmě</span>
          </div>
        </button>

        <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 active:bg-neutral-900 transition-colors">
          <Mic size={24} className="text-blue-500" />
          <div className="text-center">
            <span className="block text-xs font-bold">Hlasová AI</span>
            <span className="text-[10px] text-neutral-500">První pomoc v uchu</span>
          </div>
        </button>
      </div>

    </div>
  );
}
