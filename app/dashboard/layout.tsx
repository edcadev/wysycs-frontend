"use client"

import { ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  LayoutDashboard,
  MapPin,
  List,
  BarChart3,
  Settings,
  Flame,
  Bell,
  Download,
  RefreshCw,
  Shield,
  LucideIcon,
} from "lucide-react"

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  icon: LucideIcon
  href: string
  enabled: boolean
}

interface PageConfig {
  title: string
  description: string
}

// Configuración de navegación del sidebar
const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    enabled: true,
  },
  {
    label: 'Mapa Interactivo',
    icon: MapPin,
    href: '/dashboard/map',
    enabled: false,
  },
  {
    label: 'Lista de Bosques',
    icon: List,
    href: '/dashboard/forests',
    enabled: false,
  },
  {
    label: 'Perfil de Guardián',
    icon: Shield,
    href: '/dashboard/guardian',
    enabled: true,
  },
  {
    label: 'Estadísticas',
    icon: BarChart3,
    href: '/dashboard/stats',
    enabled: false,
  },
  {
    label: 'Alertas de Incendios',
    icon: Flame,
    href: '/dashboard/fires',
    enabled: true,
  },
  {
    label: 'Configuración',
    icon: Settings,
    href: '/dashboard/settings',
    enabled: false,
  },
]

// Configuración de títulos y descripciones por página
const PAGE_CONFIG: Record<string, PageConfig> = {
  '/dashboard': {
    title: 'Dashboard de Monitoreo',
    description: 'Visualización en tiempo real de bosques peruanos',
  },
  '/dashboard/fires': {
    title: 'Monitoreo de Incendios',
    description: 'Datos satelitales en tiempo real de NASA FIRMS',
  },
  '/dashboard/guardian': {
    title: 'Perfil de Guardián',
    description: 'Gestiona tus bosques adoptados',
  },
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleRefresh = () => {
    window.location.reload()
  }

  const currentPageConfig = PAGE_CONFIG[pathname] || PAGE_CONFIG['/dashboard']

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card/50 backdrop-blur sticky top-0 h-screen flex-shrink-0">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Image
              src="/wysycs-logo.SVG"
              alt="WYSYCS Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              WYSYCS
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Sistema de Monitoreo Forestal
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => item.enabled && router.push(item.href)}
                disabled={!item.enabled}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <Card className="bg-gradient-to-br from-accent/10 to-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Datos actualizados hace 2h
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        <DashboardHeader
          title={currentPageConfig.title}
          description={currentPageConfig.description}
          actions={
            <>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alertas (3)
              </Button>
            </>
          }
        />
        {children}
      </main>
    </div>
  )
}
