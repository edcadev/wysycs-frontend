import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { routing } from '@/i18n/routing'

export const metadata: Metadata = {
  title: 'WYSYCS - Sistema de Monitoreo Global de Deforestación',
  description: 'Plataforma avanzada que utiliza datos satelitales de la NASA para detectar, monitorear y visualizar eventos de deforestación e incendios forestales en tiempo real a escala global.',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
