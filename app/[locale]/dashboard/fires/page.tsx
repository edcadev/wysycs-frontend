'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Flame,
  AlertTriangle,
  Search,
  MapPin,
  Calendar,
  Activity,
  TrendingUp,
  Info,
  RefreshCw,
  List,
  BarChart3,
} from "lucide-react"
import { DashboardHeader } from '@/components/dashboard-header'
import { firesApi } from '@/lib/api'

const FireHeatmap = dynamic(() => import('@/components/Maps/Heatmap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <RefreshCw className="h-8 w-8 animate-spin text-primary" />
    </div>
  ),
})

interface Fire {
  latitude: number
  longitude: number
  brightness: number
  confidence: string
  acquired_date: string
  acquired_time: string
}

interface Stats {
  total_fires: number
  high_confidence_fires: number
  average_brightness: string
}

interface RiskAnalysis {
  risk_assessment: {
    level: string
    description: string
    fires_detected: number
    closest_fire_km?: number
  }
  recommendations?: string[]
  fires?: Array<Fire & { distance_km: number }>
}

export default function FiresPage() {
  const t = useTranslations('fires')
  const tDashboard = useTranslations('dashboard')
  const [fires, setFires] = useState<Fire[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [days, setDays] = useState(2)
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null)
  const [searchCoords, setSearchCoords] = useState({ lat: '', lon: '', radius: '20' })

  const testLocations = [
    { name: 'Zona Crítica - Ucayali', lat: -8.3, lon: -75.6, desc: 'Incendio detectado' },
    { name: 'Madre de Dios', lat: -12.87, lon: -70.44, desc: 'Monitoreo activo' },
    { name: 'Ucayali Norte', lat: -7.86, lon: -71.73, desc: 'Alta actividad' },
    { name: 'San Martín', lat: -6.18, lon: -76.09, desc: 'Zona de vigilancia' },
  ]

  useEffect(() => {
    fetchFiresData()
  }, [days])

  const fetchFiresData = async () => {
    try {
      setLoading(true)
      const data = await firesApi.getPeruFires(days)
      
      const firesData = data.fires
      setFires(firesData)
      calculateStats(firesData)
    } catch (error) {
      console.error('Error fetching fires:', error)
      setFires([])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (firesData: Fire[]) => {
    if (!firesData || firesData.length === 0) {
      setStats({ total_fires: 0, high_confidence_fires: 0, average_brightness: '0' })
      return
    }

    const totalFires = firesData.length
    const highConfidenceFires = firesData.filter(
      (f) => f.confidence === 'high' || f.confidence === 'h'
    ).length
    const avgBrightness = (
      firesData.reduce((sum, f) => sum + (f.brightness || 0), 0) / totalFires
    ).toFixed(1)

    setStats({
      total_fires: totalFires,
      high_confidence_fires: highConfidenceFires,
      average_brightness: avgBrightness,
    })
  }

  const analyzeLocation = async (lat: number, lon: number, radius = 20) => {
    try {
      setAnalyzing(true)
      const data = await firesApi.analyzeRisk({
        lat,
        lon,
        radius_km: radius,
        days,
      })
      setRiskAnalysis(data)
    } catch (error) {
      console.error('Error analyzing location:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleQuickAnalysis = (location: { lat: number; lon: number }) => {
    analyzeLocation(location.lat, location.lon, 50)
  }

  const handleCustomSearch = () => {
    if (searchCoords.lat && searchCoords.lon) {
      analyzeLocation(
        parseFloat(searchCoords.lat),
        parseFloat(searchCoords.lon),
        parseInt(searchCoords.radius)
      )
    }
  }

  const getRiskColorClass = (level: string) => {
    switch (level) {
      case 'CRÍTICO':
        return 'border-destructive bg-destructive/5'
      case 'ALTO':
        return 'border-destructive/50 bg-destructive/5'
      case 'MODERADO':
        return 'border-yellow-500/50 bg-yellow-500/5'
      case 'BAJO':
        return 'border-green-500/50 bg-green-500/5'
      default:
        return 'border-muted'
    }
  }

  return (
    <>
      <DashboardHeader
        title={t('kpis.dataSource')}
        description={t('alerts.realtime')}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              NASA VIIRS
            </Badge>
            <Button onClick={fetchFiresData} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {t('analysis.updateAnalysis')}
            </Button>
          </div>
        }
      />

      <section className="container mx-auto px-6 py-6">
        {/* Selector de período */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              {t('period.title')}
            </CardTitle>
            <CardDescription>{t('period.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[1, 2, 3, 7, 10].map((d) => (
                <Button
                  key={d}
                  onClick={() => setDays(d)}
                  variant={days === d ? 'default' : 'outline'}
                  size="sm"
                >
                  {d} {d === 1 ? t('period.day') : t('period.days')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* KPIs Globales */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Flame className="h-4 w-4 text-destructive" />
                  {t('kpis.totalFires')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total_fires}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('kpis.detected')}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  {t('kpis.highConfidence')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.high_confidence_fires}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('kpis.confirmed')}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  {t('kpis.averageBrightness')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.average_brightness}K</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('kpis.temperature')}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  {t('kpis.dataSource')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">NASA VIIRS</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('kpis.satellite')}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alerta si hay incendios de alta confianza */}
        {stats && stats.high_confidence_fires > 0 && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div className="flex-1">
                <p className="font-semibold text-destructive">
                  {stats.high_confidence_fires} {t('alerts.highConfidence')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('alerts.requireMonitoring')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs de contenido */}
        <Tabs defaultValue="alertas" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="alertas" className='cursor-pointer'>
              <List className="h-4 w-4 mr-2" />
              {tDashboard('tabs.activeAlerts')}
            </TabsTrigger>
            <TabsTrigger value="analisis" className='cursor-pointer'>
              <Search className="h-4 w-4 mr-2" />
              {tDashboard('tabs.riskAnalysis')}
            </TabsTrigger>
            <TabsTrigger value="mapa" className='cursor-pointer'>
              <MapPin className="h-4 w-4 mr-2" />
              {tDashboard('tabs.map')}
            </TabsTrigger>
          </TabsList>

          {/* Tab: Alertas Activas */}
          <TabsContent value="alertas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-destructive" />
                  {t('alerts.activeFires')} ({fires.length})
                </CardTitle>
                <CardDescription>{t('alerts.realtime')}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('alerts.loading')}</p>
                  </div>
                ) : fires.length === 0 ? (
                  <div className="text-center py-12">
                    <Flame className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('alerts.noFires')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('table.location')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('table.brightness')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('table.confidence')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('table.date')}</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold">{t('table.time')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fires.slice(0, 20).map((fire, idx) => (
                            <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="py-3 px-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-destructive" />
                                  <span>
                                    {fire.latitude.toFixed(3)}, {fire.longitude.toFixed(3)}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <span className="font-semibold">{fire.brightness}</span>
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <Badge
                                  variant={
                                    fire.confidence === 'high' || fire.confidence === 'h'
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                >
                                  {fire.confidence === 'h' ? t('table.high') : fire.confidence === 'n' ? t('table.nominal') : fire.confidence === 'l' ? t('table.low') : fire.confidence}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{fire.acquired_date}</td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">{fire.acquired_time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {fires.length > 20 && (
                      <p className="text-center text-sm text-muted-foreground">
                        {t('table.showing')} 20 {t('table.of')} {fires.length} {t('table.totalFires')}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de la fuente */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">{t('source.title')}</p>
                    <p className="text-muted-foreground">{t('source.description')}</p>
                    <p className="text-muted-foreground mt-2">{t('source.updateFrequency')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Análisis de Riesgo */}
          <TabsContent value="analisis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  {t('analysis.title')}
                </CardTitle>
                <CardDescription>{t('analysis.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={t('analysis.latitude')}
                    value={searchCoords.lat}
                    onChange={(e) => setSearchCoords({...searchCoords, lat: e.target.value})}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={t('analysis.longitude')}
                    value={searchCoords.lon}
                    onChange={(e) => setSearchCoords({...searchCoords, lon: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder={t('analysis.radius')}
                    value={searchCoords.radius}
                    onChange={(e) => setSearchCoords({...searchCoords, radius: e.target.value})}
                  />
                  <Button onClick={handleCustomSearch} disabled={analyzing}>
                    {analyzing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {t('analysis.analyzing')}
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        {t('analysis.analyze')}
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t('analysis.testLocations')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {testLocations.map((location, idx) => (
                      <Card
                        key={idx}
                        className="cursor-pointer hover:shadow-md transition-all group"
                        onClick={() => handleQuickAnalysis(location)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm group-hover:text-primary transition-colors">
                            {location.name}
                          </CardTitle>
                          <CardDescription className="text-xs">{location.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-muted-foreground">
                            {location.lat}, {location.lon}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resultados del análisis */}
            {riskAnalysis && (
              <Card className={`border-2 ${getRiskColorClass(riskAnalysis.risk_assessment.level)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-destructive">
                        <AlertTriangle className="w-6 h-6 text-destructive-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {t('analysis.level')} {riskAnalysis.risk_assessment.level}
                        </CardTitle>
                        <CardDescription>{riskAnalysis.risk_assessment.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{riskAnalysis.risk_assessment.fires_detected}</div>
                      <p className="text-sm text-muted-foreground">{t('analysis.firesDetected')}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {riskAnalysis.risk_assessment.closest_fire_km && (
                    <Card className="bg-muted/50">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground mb-1">{t('analysis.closestFire')}</p>
                        <p className="text-2xl font-bold">
                          {riskAnalysis.risk_assessment.closest_fire_km.toFixed(2)} km
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {riskAnalysis.recommendations && riskAnalysis.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        {t('analysis.recommendations')}
                      </p>
                      {riskAnalysis.recommendations.map((rec, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground pl-6">
                          • {rec}
                        </p>
                      ))}
                    </div>
                  )}

                  {riskAnalysis.fires && riskAnalysis.fires.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">
                        {t('analysis.firesInArea')} ({riskAnalysis.fires.length}):
                      </p>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {riskAnalysis.fires.slice(0, 5).map((fire, idx) => (
                          <Card key={idx}>
                            <CardContent className="pt-4">
                              <div className="flex justify-between items-center gap-4 text-sm">
                                <span className="text-muted-foreground">
                                  {t('analysis.distance')} <strong className="text-foreground">{fire.distance_km.toFixed(2)} km</strong>
                                </span>
                                <span className="text-muted-foreground">
                                  {t('analysis.brightness')} <strong className="text-foreground">{fire.brightness}K</strong>
                                </span>
                                <Badge variant={fire.confidence === 'high' || fire.confidence === 'h' ? 'destructive' : 'outline'}>
                                  {fire.confidence === 'h' ? t('table.high') : fire.confidence}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Mapa - Placeholder */}
          <TabsContent value="mapa">
            <Card className="h-[600px] flex items-center justify-center">
              <div className="h-full w-full">
                <FireHeatmap fires={fires}/>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </>
  )
}
