"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
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
  Trophy,
  Target,
  Star,
} from "lucide-react";
import { guardianApi, gamificationApi } from "@/lib/api";
import {
  getHealthProgressColor,
  getHealthLabel,
  getLevelColor,
  getLevelEmoji,
  getDaysSinceAdoption,
  formatDateES,
} from "@/lib/forest-utils";

interface Forest {
  id: string;
  name: string;
  health: number;
  latitude: number;
  community: string;
  fun_facts: string[];
  longitude: number;
  created_at: string;
  co2_capture: string;
  species_count: number;
}

interface AdoptedForest {
  id: string;
  forest_id: string;
  adoption_date: string;
  forests: Forest;
  health_nasa: {
    ndvi_value: number;
    health_percentage: number;
    status: string;
    color: string;
    source: string;
    is_real_data: boolean;
    last_update: string;
  };
}

interface GuardianData {
  guardian_email: string;
  guardian_name: string;
  adopted_forests: AdoptedForest[];
  total_forests: number;
  total_points: number;
  guardian_level: string;
}

interface GuardianProgress {
  guardian_email: string;
  guardian_name: string;
  current_level: {
    name: string;
    emoji: string;
    points: number;
  };
  next_level: {
    name: string;
    points_needed: number;
    progress_percentage: number;
  } | null;
  forests_adopted: number;
}

interface LeaderboardEntry {
  rank: number;
  guardian_name: string;
  guardian_email: string;
  total_points: number;
  guardian_level: string;
  level_emoji: string;
  forests_count: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  total_guardians: number;
}

interface GlobalStats {
  total_adoptions: number;
  total_guardians: number;
  total_alerts_sent: number;
  level_distribution: {
    Sembrador: number;
    Protector: number;
    Guardián: number;
    "Líder Ancestral": number;
  };
}

export default function GuardianProfilePage() {
  const router = useRouter();
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [guardianProgress, setGuardianProgress] =
    useState<GuardianProgress | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuardianData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guardianEmail) {
      setError("Por favor ingresa tu email");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch guardian basic data
      const data = await guardianApi.getByEmail(guardianEmail);
      setGuardianData(data);

      // Fetch guardian progress for gamification
      const progress = await gamificationApi.getGuardianProgress(guardianEmail);
      setGuardianProgress(progress);
    } catch (err) {
      setError("No se encontró información del guardián con ese email");
      setGuardianData(null);
      setGuardianProgress(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard and global stats on component mount
  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        const [leaderboardData, statsData] = await Promise.all([
          gamificationApi.getLeaderboard(10),
          gamificationApi.getGlobalStats(),
        ]);
        setLeaderboard(leaderboardData);
        setGlobalStats(statsData);
      } catch (err) {
        console.error("Error al cargar datos de gamificación:", err);
      }
    };

    fetchGamificationData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
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
                      {guardianData.guardian_name || "Guardián"}
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
                      setGuardianProgress(null);
                      setGuardianEmail("");
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
                        <span className="text-sm font-semibold text-gray-700">
                          Nivel
                        </span>
                      </div>
                      <p className="text-xl font-bold text-purple-700">
                        {getLevelEmoji(guardianData.guardian_level)}{" "}
                        {guardianData.guardian_level || "Sembrador"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Gamification Stats - Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Guardian Progress Card */}
              {guardianProgress && (
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6 text-purple-600" />
                      Tu Progreso de Nivel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Nivel Actual</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {guardianProgress.current_level.emoji}{" "}
                          {guardianProgress.current_level.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {guardianProgress.current_level.points} puntos
                        </p>
                      </div>
                      {guardianProgress.next_level && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Próximo Nivel</p>
                          <p className="text-xl font-bold text-purple-700">
                            {guardianProgress.next_level.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Faltan {guardianProgress.next_level.points_needed}{" "}
                            puntos
                          </p>
                        </div>
                      )}
                    </div>

                    {guardianProgress.next_level && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progreso:{" "}
                            {guardianProgress.next_level.progress_percentage}%
                          </span>
                        </div>
                        <Progress
                          value={
                            guardianProgress.next_level.progress_percentage
                          }
                          className="h-3"
                        />
                      </div>
                    )}

                    {!guardianProgress.next_level && (
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <p className="text-amber-800 font-semibold flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          ¡Has alcanzado el nivel máximo!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Global Stats Card */}
              {globalStats && (
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-blue-600" />
                      Estadísticas de la Comunidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">
                          Total Adopciones
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {globalStats.total_adoptions}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">
                          Guardianes Activos
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {globalStats.total_guardians}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">
                          Alertas Enviadas
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          {globalStats.total_alerts_sent}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-gray-600 mb-1">
                          Distribución
                        </p>
                        <div className="flex gap-1 text-xs">
                          <span title="Sembrador">
                            🌱 {globalStats.level_distribution.Sembrador}
                          </span>
                          <span title="Protector">
                            🌳 {globalStats.level_distribution.Protector}
                          </span>
                          <span title="Guardián">
                            🦅 {globalStats.level_distribution.Guardián}
                          </span>
                          <span title="Líder Ancestral">
                            🏆{" "}
                            {globalStats.level_distribution["Líder Ancestral"]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content Grid - Forests and Leaderboard */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Adopted Forests - Left Column (2/3) */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Mis Bosques Protegidos
                </h2>

                {guardianData.adopted_forests.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">
                        Aún no has adoptado ningún bosque
                      </p>
                      <Button onClick={() => router.push("/dashboard")}>
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
                        onClick={() =>
                          router.push(`/dashboard/forests/${forest.forest_id}`)
                        }
                      >
                        <div
                          className={`h-2 ${getHealthProgressColor(
                            forest.health_nasa.health_percentage
                          )}`}
                        ></div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-3">
                            {forest.forests.name}
                          </h3>

                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Fecha de adopción:
                              </span>
                              <span className="font-semibold">
                                {formatDateES(forest.adoption_date)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Días protegiendo:
                              </span>
                              <span className="font-semibold text-green-600">
                                {getDaysSinceAdoption(forest.adoption_date)}{" "}
                                días
                              </span>
                            </div>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-green-800 mb-1">
                              Estado del bosque:
                            </p>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${getHealthProgressColor(
                                  forest.health_nasa.health_percentage
                                )}`}
                              ></div>
                              <span className="text-sm text-green-700">
                                {getHealthLabel(forest.health_nasa.health_percentage)}
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

              {/* Leaderboard - Right Column (1/3) */}
              {leaderboard && leaderboard.leaderboard.length > 0 && (
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Tabla de Líderes
                  </h2>
                  <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 sticky top-4">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Trophy className="h-5 w-5 text-amber-600" />
                        Top Guardianes
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {leaderboard.total_guardians} guardianes totales
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {leaderboard.leaderboard.map((entry) => {
                          const isCurrentGuardian =
                            guardianData?.guardian_email ===
                            entry.guardian_email;
                          return (
                            <div
                              key={entry.rank}
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                isCurrentGuardian
                                  ? "bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 shadow-md"
                                  : "bg-white border border-gray-200 hover:shadow-sm"
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {entry.rank === 1 && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white font-bold">
                                    👑
                                  </div>
                                )}
                                {entry.rank === 2 && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm">
                                    {entry.rank}
                                  </div>
                                )}
                                {entry.rank === 3 && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                                    {entry.rank}
                                  </div>
                                )}
                                {entry.rank > 3 && (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm">
                                    {entry.rank}
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <p className="font-bold text-sm text-gray-800 truncate">
                                    {entry.guardian_name}
                                  </p>
                                  {isCurrentGuardian && (
                                    <span className="text-xs bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded-full font-semibold">
                                      Tú
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600">
                                  {entry.level_emoji} {entry.guardian_level}
                                </p>
                              </div>

                              <div className="text-right flex-shrink-0">
                                <div className="flex items-center gap-1 text-amber-600 font-bold">
                                  <Star className="h-4 w-4 fill-amber-600" />
                                  <span className="text-sm">
                                    {entry.total_points}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                  {entry.forests_count} 🌳
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
