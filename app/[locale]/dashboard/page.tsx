"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  List,
  BarChart3,
  TreePine,
  Activity,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { forestsApi } from "@/lib/api";
import {
  getHealthBadgeClasses,
  getHealthLabel,
  getHealthProgressColor,
} from "@/lib/forest-utils";

import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/Maps/Map"), { ssr: false });

// Tipos basados en response_forests.json
interface Forest {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  health: number;
  co2_capture: string;
  species_count: number;
  community: string;
  fun_facts: string[];
  created_at: string;
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

interface GlobalStats {
  totalForests: number;
  averageHealth: number;
  totalCO2: string;
  totalSpecies: number;
  criticalForests: number;
  healthyForests: number;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [forests, setForests] = useState<Forest[]>([]);
    const [forestsMap, setForestsMap] = useState<Forest[]>([])
  const [selectedForest, setSelectedForest] = useState<Forest | null>(null);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [filter, setFilter] = useState<
    "all" | "critical" | "moderate" | "healthy"
  >("all");

  // Cargar datos de bosques desde la API
  useEffect(() => {
    fetchForests();
  }, []);

  const fetchForests = async () => {
    try {
      setLoading(true);
      const data = await forestsApi.getAll();
      setForests(data);
      setForestsMap(data)
      calculateGlobalStats(data);
    } catch (error) {
      console.error("Error al cargar bosques:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas globales
  const calculateGlobalStats = (forestsData: Forest[]) => {
    const totalForests = forestsData.length;
    const averageHealth = Math.round(
      forestsData.reduce((sum, f) => sum + f.health, 0) / totalForests
    );

    // Extraer números de CO2 y sumar
    const totalCO2Value = forestsData.reduce((sum, f) => {
      const match = f.co2_capture.match(/[\d,]+/);
      return sum + (match ? parseInt(match[0].replace(",", "")) : 0);
    }, 0);

    const totalSpecies = forestsData.reduce(
      (sum, f) => sum + f.species_count,
      0
    );
    const criticalForests = forestsData.filter((f) => f.health < 50).length;
    const healthyForests = forestsData.filter((f) => f.health >= 70).length;

    setGlobalStats({
      totalForests,
      averageHealth,
      totalCO2: `${totalCO2Value.toLocaleString()} ton/año`,
      totalSpecies,
      criticalForests,
      healthyForests,
    });
  };

  // Filtrar bosques según el nivel de salud
  const getFilteredForests = () => {
    switch (filter) {
      case "critical":
        return forests.filter((f) => f.health < 50);
      case "moderate":
        return forests.filter((f) => f.health >= 50 && f.health < 70);
      case "healthy":
        return forests.filter((f) => f.health >= 70);
      default:
        return forests;
    }
  };

  return (
    <>
      {/* KPIs Globales */}
      {globalStats && (
        <section className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-accent" />
                  {t('kpis.totalForests')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {globalStats.totalForests}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('kpis.monitored')}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  {t('kpis.averageHealth')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {globalStats.averageHealth}%
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${globalStats.averageHealth}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  {t('kpis.co2Captured')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{globalStats.totalCO2}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('kpis.annualCapture')}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-primary" />
                  {t('kpis.totalSpecies')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {globalStats.totalSpecies.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('kpis.biodiversity')}
                </p>
              </CardContent>
            </Card>
          </div>

        </section>
      )}

      {/* Tabs de contenido */}
      <section className="container mx-auto px-4 sm:px-6 pb-4 sm:pb-6">
        <Tabs defaultValue="mapa" className="w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="mapa" className="cursor-pointer flex-1 sm:flex-none">
                <MapPin className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('tabs.map')}</span>
              </TabsTrigger>
              <TabsTrigger value="lista" className="cursor-pointer flex-1 sm:flex-none">
                <List className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t('tabs.forestList')}</span>
              </TabsTrigger>
            </TabsList>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Badge
                variant={filter === "all" ? "default" : "outline"}
                className="cursor-pointer text-xs whitespace-nowrap"
                onClick={() => {setFilter("all"); setForestsMap(forests)}}
              >
                {t('tabs.all')} ({forests.length})
              </Badge>
              <Badge
                variant={filter === "critical" ? "default" : "outline"}
                className="cursor-pointer text-red-600 border-red-200 text-xs whitespace-nowrap"
                onClick={() => {setFilter("critical"); setForestsMap(forests.filter((f) => f.health < 50))}}
              >
                {t('tabs.critical')} ({forests.filter((f) => f.health < 50).length})
              </Badge>
              <Badge
                variant={filter === "moderate" ? "default" : "outline"}
                className="cursor-pointer text-yellow-600 border-yellow-200 text-xs whitespace-nowrap"
                onClick={() => {setFilter("moderate"); setForestsMap(forests.filter((f) => f.health >= 50 && f.health < 70))}}
              >
                {t('tabs.moderate')} (
                {forests.filter((f) => f.health >= 50 && f.health < 70).length})
              </Badge>
              <Badge
                variant={filter === "healthy" ? "default" : "outline"}
                className="cursor-pointer text-green-600 border-green-200 text-xs whitespace-nowrap"
                onClick={() => {setFilter("healthy"); setForestsMap(forests.filter((f) => f.health >= 70))}}
              >
                {t('tabs.healthy')} ({forests.filter((f) => f.health >= 70).length})
              </Badge>
            </div>
          </div>

          {/* Lista de Bosques */}
          <TabsContent value="lista" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {getFilteredForests().map((forest) => (
                  <Card
                    key={forest.id}
                    className="hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() =>
                      router.push(`/dashboard/forests/${forest.id}` as any)
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {forest.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {forest.community}
                          </CardDescription>
                        </div>
                        <Badge
                          className={getHealthBadgeClasses(
                            forest.health_nasa.health_percentage
                          )}
                        >
                          {getHealthLabel(forest.health_nasa.health_percentage)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Barra de salud */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            {t('forest.health')}
                          </span>
                          <span className="font-semibold">
                            {forest.health_nasa.health_percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${getHealthProgressColor(
                              forest.health_nasa.health_percentage
                            )}`}
                            style={{
                              width: `${forest.health_nasa.health_percentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Métricas */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t('forest.annualCO2')}</p>
                          <p className="font-semibold">{forest.co2_capture}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t('forest.species')}</p>
                          <p className="font-semibold">
                            {forest.species_count}
                          </p>
                        </div>
                      </div>

                      {/* Acción */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        {t('forest.viewDetails')}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Mapa */}
          <TabsContent value="mapa">
            <Card className="h-[600px] flex items-center justify-center">
              <div className="h-full w-full">
                  <Map zoom={5} forests={forestsMap} isLoading={loading}/>
                </div>
            </Card>
          </TabsContent>

          {/* Estadísticas - Placeholder */}
          {/* <TabsContent value="stats">
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t('forest.statisticalAnalysis')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('forest.comingSoon')}
                </p>
              </div>
            </Card>
          </TabsContent> */}
        </Tabs>
      </section>
    </>
  );
}
