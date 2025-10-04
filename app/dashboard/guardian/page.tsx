'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Mail,
  Leaf,
  Award,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Heart,
  ArrowLeft,
} from 'lucide-react';
import { guardianApi } from '@/lib/api';
import {
  getHealthProgressColor,
  getHealthLabel,
  getLevelColor,
  getLevelEmoji,
  getDaysSinceAdoption,
  formatDateES
} from '@/lib/forest-utils';

interface AdoptedForest {
  forest_id: string;
  forest_name: string;
  adoption_date: string;
  health?: number;
}

interface GuardianData {
  guardian_email: string;
  guardian_name: string;
  adopted_forests: AdoptedForest[];
  total_forests: number;
  total_points: number;
  guardian_level: string;
}

export default function GuardianProfilePage() {
  const router = useRouter();
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuardianData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guardianEmail) {
      setError('Por favor ingresa tu email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await guardianApi.getByEmail(guardianEmail);
      setGuardianData(data);
    } catch (err) {
      setError('No se encontró información del guardián con ese email');
      setGuardianData(null);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al dashboard
        </Button>

        {!guardianData ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Shield className="text-green-600 h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Perfil de Guardián</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ingresa tu email para ver tus bosques adoptados
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={fetchGuardianData} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email de guardián</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={guardianEmail}
                    onChange={(e) => setGuardianEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Ver mi perfil
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Guardian Header */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center">
                    <Shield className="text-green-600 h-10 w-10" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      {guardianData.guardian_name || 'Guardián'}
                    </h1>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {guardianData.guardian_email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGuardianData(null);
                      setGuardianEmail('');
                      setError(null);
                    }}
                    className="ml-auto"
                  >
                    Cambiar guardián
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="text-green-600 h-5 w-5" />
                        <span className="text-sm font-semibold text-gray-700">
                          Bosques Adoptados
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-green-700">
                        {guardianData.total_forests}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="text-amber-600 h-5 w-5" />
                        <span className="text-sm font-semibold text-gray-700">
                          Puntos Totales
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-amber-700">
                        {guardianData.total_points || 0}
                      </p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`bg-gradient-to-br border-2 ${getLevelColor(
                      guardianData.guardian_level
                    )}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="text-purple-600 h-5 w-5" />
                        <span className="text-sm font-semibold text-gray-700">Nivel</span>
                      </div>
                      <p className="text-xl font-bold text-purple-700">
                        {getLevelEmoji(guardianData.guardian_level)}{' '}
                        {guardianData.guardian_level || 'Sembrador'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Adopted Forests */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Mis Bosques Protegidos
              </h2>

              {guardianData.adopted_forests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Aún no has adoptado ningún bosque</p>
                    <Button onClick={() => router.push('/dashboard')}>
                      Explorar bosques
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {guardianData.adopted_forests.map((forest, idx) => (
                    <Card
                      key={idx}
                      className="hover:shadow-xl transition-shadow cursor-pointer"
                      onClick={() => router.push(`/dashboard/forests/${forest.forest_id}`)}
                    >
                      <div className={`h-2 ${getHealthProgressColor(forest.health)}`}></div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          {forest.forest_name}
                        </h3>

                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fecha de adopción:</span>
                            <span className="font-semibold">
                              {formatDateES(forest.adoption_date)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Días protegiendo:</span>
                            <span className="font-semibold text-green-600">
                              {getDaysSinceAdoption(forest.adoption_date)} días
                            </span>
                          </div>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-green-800 mb-1">
                            Estado del bosque:
                          </p>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getHealthProgressColor(forest.health)}`}
                            ></div>
                            <span className="text-sm text-green-700">
                              {getHealthLabel(forest.health)}
                            </span>
                          </div>
                        </div>

                        <Button variant="ghost" className="w-full mt-4">
                          Ver detalles →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
