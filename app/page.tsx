"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Satellite,
  Globe,
  BarChart3,
  Clock,
  Users,
  Zap,
  Database,
  Map,
  Shield,
  AlertTriangle,
  Menu,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                W
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                WYSCYS
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a href="#inicio" className="text-sm font-medium hover:text-primary transition-colors">
                Inicio
              </a>
              <a href="#problema" className="text-sm font-medium hover:text-primary transition-colors">
                Problema
              </a>
              <a href="#solucion" className="text-sm font-medium hover:text-primary transition-colors">
                Solución
              </a>
              <a href="#tecnologias" className="text-sm font-medium hover:text-primary transition-colors">
                Tecnologías
              </a>
              <a href="#equipo" className="text-sm font-medium hover:text-primary transition-colors">
                Equipo
              </a>
              <a href="#impacto" className="text-sm font-medium hover:text-primary transition-colors">
                Impacto
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button onClick={()=> router.push('/dashboard')} variant="outline" size="sm" className="hidden sm:inline-flex bg-transparent">
                <Satellite className="mr-2 h-4 w-4" />
                Demo
              </Button>
              <Button className="md:hidden" variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5"
      >
        <div className="absolute inset-0 bg-[url('/aerial-view-of-dense-forest-canopy.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative container mx-auto px-4 py-24 text-center">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            🌍 Hackathon Project 2025
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sistema de Monitoreo Global de Deforestación e Incendios Forestales
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-8 max-w-4xl mx-auto">
            Plataforma avanzada que utiliza datos satelitales de la NASA para detectar, monitorear y visualizar eventos
            de deforestación e incendios forestales en tiempo real a escala global.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              <Globe className="mr-2 h-5 w-5" />
              Ver Demo en Vivo
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <BarChart3 className="mr-2 h-5 w-5" />
              Explorar Datos
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problema" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">El Desafío Global</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Los bosques del mundo enfrentan amenazas sin precedentes. Necesitamos herramientas avanzadas para
              monitorear y responder a estos desafíos ambientales críticos.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-destructive/20">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <CardTitle className="text-destructive">Deforestación Acelerada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Pérdida de 10 millones de hectáreas de bosque anualmente a nivel mundial
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-destructive/20">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <CardTitle className="text-destructive">Incendios Forestales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aumento del 75% en incendios forestales en las últimas dos décadas
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-destructive/20">
              <CardHeader>
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <CardTitle className="text-destructive">Falta de Monitoreo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detección tardía de eventos críticos por falta de sistemas integrados
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section id="solucion" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestra Solución</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Una plataforma integral que combina datos satelitales de la NASA con tecnología avanzada para proporcionar
              monitoreo en tiempo real y análisis predictivo.
            </p>
          </div>

          <div className="mb-16">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <div className="text-center">
                  <Map className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Captura de Pantalla del Sistema</p>
                  <p className="text-sm text-muted-foreground/70">Dashboard principal con mapas interactivos</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Satellite className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Datos Satelitales NASA</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Integración directa con APIs de la NASA para datos actualizados cada 2 horas
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Map className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Mapas Interactivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Visualización geoespacial avanzada con capacidades de zoom y filtrado
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Tiempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Actualizaciones automáticas siguiendo los ciclos de captura satelital
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Análisis Temporal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Seguimiento de tendencias y patrones históricos de deforestación
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">Galería del Proyecto</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Análisis de Datos</p>
                  </div>
                </div>
              </Card>
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Detección de Incendios</p>
                  </div>
                </div>
              </Card>
              <Card className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center">
                    <Globe className="h-12 w-12 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Vista Global</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tecnologias" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Tecnologías Utilizadas</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stack tecnológico moderno y robusto para garantizar rendimiento, escalabilidad y confiabilidad.
            </p>
          </div>

          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="aspect-[16/9] bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <div className="text-center">
                  <Database className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Diagrama de Arquitectura</p>
                  <p className="text-sm text-muted-foreground/70">Flujo de datos y componentes del sistema</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-accent" />
                  Frontend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  Backend & APIs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">NASA APIs</Badge>
                  <Badge variant="secondary">REST APIs</Badge>
                  <Badge variant="secondary">WebSockets</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  Infraestructura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Vercel</Badge>
                  <Badge variant="secondary">PostgreSQL</Badge>
                  <Badge variant="secondary">Redis</Badge>
                  <Badge variant="secondary">Docker</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="equipo" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Nuestro Equipo</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un equipo multidisciplinario de desarrolladores, científicos de datos y especialistas en ciencias
              ambientales comprometidos con la conservación forestal.
            </p>
          </div>

          <div className="mb-12">
            <Card className="overflow-hidden">
              <div className="aspect-[21/9] bg-gradient-to-r from-primary/5 to-accent/5 flex items-center justify-center border-2 border-dashed border-muted-foreground/20">
                <div className="text-center">
                  <Users className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Foto del Equipo</p>
                  <p className="text-sm text-muted-foreground/70">Equipo trabajando en el hackathon</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/professional-developer-portrait.png" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <CardTitle>Ana Martínez</CardTitle>
                <CardDescription>Full Stack Developer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Especialista en React y Node.js con experiencia en aplicaciones geoespaciales
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/data-scientist-portrait.png" />
                  <AvatarFallback>CG</AvatarFallback>
                </Avatar>
                <CardTitle>Carlos González</CardTitle>
                <CardDescription>Data Scientist</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Experto en análisis de datos satelitales y algoritmos de detección de patrones
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/environmental-scientist-portrait.jpg" />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <CardTitle>Laura Rodríguez</CardTitle>
                <CardDescription>Científica Ambiental</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  PhD en Ciencias Forestales con 10 años de experiencia en conservación
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/ui-designer-portrait.png" />
                  <AvatarFallback>MV</AvatarFallback>
                </Avatar>
                <CardTitle>Miguel Vargas</CardTitle>
                <CardDescription>UI/UX Designer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Diseñador especializado en interfaces para aplicaciones científicas y ambientales
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact & Goals */}
      <section id="impacto" className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Impacto Esperado</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nuestro objetivo es democratizar el acceso a información crítica sobre el estado de los bosques mundiales
              y facilitar la toma de decisiones informadas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-accent/20">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Para Investigadores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acceso a datos actualizados para estudios en ciencias ambientales y climáticas
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-accent/20">
              <CardHeader>
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Para Gobiernos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Herramientas para políticas de protección ambiental y respuesta a emergencias
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-accent/20">
              <CardHeader>
                <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Para el Público</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Concienciación sobre el estado actual de los bosques y desafíos ambientales
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Únete a la Misión de Conservación Global</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Explora nuestra plataforma y descubre cómo la tecnología puede ayudar a proteger los bosques del mundo para
            las futuras generaciones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Satellite className="mr-2 h-5 w-5" />
              Acceder a la Plataforma
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Users className="mr-2 h-5 w-5" />
              Contactar al Equipo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Sistema de Monitoreo Forestal Global</h3>
            <p className="text-muted-foreground mb-6">
              Desarrollado para Hackathon 2025 • Powered by NASA Satellite Data
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>© 2025 Equipo ForestWatch</span>
              <span>•</span>
              <span>Datos proporcionados por NASA</span>
              <span>•</span>
              <span>Proyecto Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
