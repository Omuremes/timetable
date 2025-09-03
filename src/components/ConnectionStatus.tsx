'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Wifi, WifiOff } from 'lucide-react';

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Простая проверка состояния Firebase (можно улучшить)
  useEffect(() => {
    const checkFirebase = () => {
      // Здесь можно добавить более сложную логику проверки
      setIsFirebaseConnected(isOnline);
    };

    checkFirebase();
  }, [isOnline]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg border border-gray-200 px-2 sm:px-3 py-2">
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
          ) : (
            <WifiOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
          )}
          <span className="text-xs text-gray-600 hidden sm:inline">
            {isOnline ? 'Онлайн' : 'Офлайн'}
          </span>
        </div>
        
        <div className="w-px h-3 sm:h-4 bg-gray-300" />
        
        <div className="flex items-center space-x-1">
          {isFirebaseConnected ? (
            <Cloud className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
          ) : (
            <CloudOff className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
          )}
          <span className="text-xs text-gray-600 hidden sm:inline">
            {isFirebaseConnected ? 'Синхронизация' : 'Нет связи'}
          </span>
        </div>
      </div>
    </div>
  );
}
