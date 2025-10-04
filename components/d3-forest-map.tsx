'use client';

import React, { useEffect, useRef } from 'react';

interface D3ForestMapProps {
  latitude: number;
  longitude: number;
  forestName: string;
  fireRisk?: {
    level: string;
    color: string;
    fires_detected: number;
  } | null;
}

const D3ForestMap: React.FC<D3ForestMapProps> = ({
  latitude,
  longitude,
  forestName,
  fireRisk
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Aquí iría la implementación de D3.js para el mapa interactivo
    // Por ahora, usaremos un mapa estático con leaflet o similar
  }, [latitude, longitude]);

  return (
    <div ref={mapRef} className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      {/* Mapa placeholder - se puede integrar con Leaflet, Mapbox o D3 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm font-medium text-gray-700">{forestName}</p>
          <p className="text-xs text-gray-500 mt-1">
            {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
          </p>
          {fireRisk && fireRisk.fires_detected > 0 && (
            <div className="mt-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: fireRisk.color }}
              >
                {fireRisk.fires_detected} incendio{fireRisk.fires_detected > 1 ? 's' : ''} detectado{fireRisk.fires_detected > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid de fondo para simular mapa */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {[...Array(64)].map((_, i) => (
            <div key={i} className="border border-gray-400"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default D3ForestMap;
