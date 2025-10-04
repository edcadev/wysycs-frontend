'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Heart, Users, Leaf, Sprout, AlertTriangle, TrendingUp, Activity, Info, ArrowLeft } from 'lucide-react';
import D3ForestMap from '@/components/d3-forest-map';
import ForestAdoptionDialog from '@/components/forest-adoption-dialog';
import { forestsApi, firesApi } from '@/lib/api';
import { getHealthColor, getHealthBgColor, getHealthProgressColor, formatDateES } from '@/lib/forest-utils';
import Map  from "@/components/Maps/Map";
import { Forest } from "@/interfaces/Forest";


interface FireRisk {
  level: string;
  color: string;
  fires_detected: number;
  description: string;
  closest_fire_km?: number;
}

const ForestDetailView = () => {
  const params = useParams();
  const router = useRouter();
  const forestId = params.id as string;

  const [forest, setForest] = useState<Forest | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [fireRisk, setFireRisk] = useState<FireRisk | null>(null);
  const [adoptionDialogOpen, setAdoptionDialogOpen] = useState(false);

  useEffect(() => {
    fetchForestDetail();
  }, [forestId]);

  const fetchForestDetail = async () => {
    try {
      setLoading(true);
      const data = await forestsApi.getById(forestId);
      setForest(data);
    } catch (error) {
      console.error('Error al cargar el bosque:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeFireRisk = async () => {
    if (!forest) return;

    try {
      setAnalyzing(true);
      const data = await firesApi.analyzeRisk({
        lat: forest.latitude,
        lon: forest.longitude,
        radius_km: 50,
        days: 2,
      });
      setFireRisk(data.risk_assessment);
    } catch (error) {
      console.error('Error al analizar riesgo de incendio:', error);
    } finally {
      setAnalyzing(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del bosque...</p>
        </div>
      </div>
    );
  }

  if (!forest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700">No se pudo cargar la información del bosque</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header con navegación */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-700 hover:text-green-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Volver a bosques</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{forest.name}</h1>
                <div className="flex items-center gap-6 text-green-50">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {forest.latitude.toFixed(2)}°, {forest.longitude.toFixed(2)}°
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{forest.community}</span>
                  </div>
                </div>
              </div>

              {/* Health Badge */}
              <div className={`${getHealthBgColor(forest.health)} rounded-2xl px-6 py-4 text-center`}>
                <div className={`text-4xl font-bold ${getHealthColor(forest.health)}`}>
                  {forest.health}%
                </div>
                <div className="text-sm text-gray-600 font-medium mt-1">
                  Salud del Bosque
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 p-8 bg-gray-50">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Captura de CO₂</p>
                  <p className="text-2xl font-bold text-gray-900">{forest.co2_capture}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Sprout className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Especies</p>
                  <p className="text-2xl font-bold text-gray-900">{forest.species_count}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Comunidad</p>
                  <p className="text-lg font-bold text-gray-900">{forest.community}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Fun Facts */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Info className="h-6 w-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Datos Curiosos e Importantes
                </h2>
              </div>

              <div className="space-y-4">
                {forest.fun_facts.map((fact, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                  >
                    <div className="bg-white rounded-full p-2 shadow-sm">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-gray-700 flex-1 pt-1">{fact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fire Risk Analysis */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Análisis de Riesgo de Incendio
                  </h2>
                </div>
              </div>

              {!fireRisk ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-6">
                    Analiza el riesgo de incendio en tiempo real usando datos satelitales de la NASA
                  </p>
                  <button
                    onClick={analyzeFireRisk}
                    disabled={analyzing}
                    className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  >
                    {analyzing ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analizando...
                      </span>
                    ) : (
                      'Analizar Riesgo Ahora'
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <div
                    className="p-6 rounded-xl mb-4"
                    style={{ backgroundColor: `${fireRisk.color}20`, borderLeft: `4px solid ${fireRisk.color}` }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-4 py-2 rounded-full font-bold text-white"
                        style={{ backgroundColor: fireRisk.color }}
                      >
                        {fireRisk.level}
                      </span>
                      <span className="font-semibold text-gray-700">
                        {fireRisk.fires_detected} incendio(s) detectado(s)
                      </span>
                    </div>
                    <p className="text-lg text-gray-800 mt-3">{fireRisk.description}</p>
                    {fireRisk.closest_fire_km && (
                      <p className="text-sm text-gray-600 mt-2">
                        Incendio más cercano a {fireRisk.closest_fire_km.toFixed(2)} km
                      </p>
                    )}
                  </div>

                  <button
                    onClick={analyzeFireRisk}
                    disabled={analyzing}
                    className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Activity className="h-4 w-4" />
                    Actualizar análisis
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Adoption Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="h-8 w-8" />
                <h3 className="text-2xl font-bold">Conviértete en Guardián</h3>
              </div>

              <p className="text-green-50 mb-6">
                Adopta este bosque y contribuye directamente a su protección y conservación
              </p>

              <button
                onClick={() => setAdoptionDialogOpen(true)}
                className="w-full bg-white text-green-700 py-3 px-6 rounded-lg font-semibold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl"
              >
                Adoptar Bosque
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6" 
            style={{height: '500px', width: '100%', display:'grid', gridTemplateRows:'1fr 6fr 2fr'}}>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-green-600" />
                Mapa Interactivo
              </h3>

              <Map forests={[forest]}/>
              

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Coordenadas:</strong>
                </p>
                <p className="font-mono text-sm text-gray-800">
                  {forest.latitude.toFixed(4)}°, {forest.longitude.toFixed(4)}°
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Estado del Bosque
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Salud General</span>
                    <span className={`font-bold ${getHealthColor(forest.health)}`}>
                      {forest.health}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        forest.health >= 70 ? 'bg-green-500' :
                        forest.health >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${forest.health}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Fecha de registro</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateES(forest.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de adopción */}
      {forest && (
        <ForestAdoptionDialog
          open={adoptionDialogOpen}
          onOpenChange={setAdoptionDialogOpen}
          forestId={String(forest.id)}
          forestName={forest.name}
          onAdoptionSuccess={(email) => {
            console.log('Bosque adoptado exitosamente por:', email);
            // Aquí podrías redirigir al perfil del guardián o mostrar un mensaje de éxito
          }}
        />
      )}
    </div>
  );
};

export default ForestDetailView;
