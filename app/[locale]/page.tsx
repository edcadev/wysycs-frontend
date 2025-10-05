"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  TrendingUp,
  Flame,
  MonitorOff,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function HomePage() {
  const t = useTranslations("landing");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { href: "#inicio", label: t("nav.home") },
    { href: "#problema", label: t("nav.problem") },
    { href: "#solucion", label: t("nav.solution") },
    { href: "#tecnologias", label: t("nav.technologies") },
    { href: "#equipo", label: t("nav.team") },
    { href: "#impacto", label: t("nav.impact") },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/wysycs-logo.SVG"
                alt="WYSYCS Logo"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                  WYSYCS
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight -mt-1">
                  What You See, You Can Save
                </span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <a
                href="#inicio"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t("nav.home")}
              </a>
              <a
                href="#problema"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t("nav.problem")}
              </a>
              <a
                href="#solucion"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t("nav.solution")}
              </a>
              <a
                href="#tecnologias"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t("nav.technologies")}
              </a>
              <a
                href="#equipo"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t("nav.team")}
              </a>
              <a
                href="#impacto"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {t("nav.impact")}
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex bg-transparent"
              >
                <Link href="/dashboard">
                  <Satellite className="mr-2 h-4 w-4" />
                  {t("nav.demo")}
                </Link>
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t("nav.openMenu")}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="top" className="w-full p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                        W
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        WYSCYS
                      </span>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                        className="text-base font-medium hover:text-primary transition-colors px-4 py-3 rounded-md hover:bg-accent"
                      >
                        {item.label}
                      </a>
                    ))}

                    <div className="pt-4 px-4">
                      <Button asChild className="w-full" size="default">
                        <Link href="/dashboard" onClick={closeMenu}>
                          <Satellite className="mr-2 h-4 w-4" />
                          {t("nav.accessDemo")}
                        </Link>
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
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
            {t("hero.badge")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t("hero.title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-8 max-w-4xl mx-auto">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/dashboard">
                <Globe className="mr-2 h-5 w-5" />
                {t("hero.liveDemoButton")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent"
            >
              <Link href="/dashboard">
                <BarChart3 className="mr-2 h-5 w-5" />
                {t("hero.exploreDataButton")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section id="problema" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("problem.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("problem.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-destructive/20">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-destructive mx-auto mb-4" />
                <CardTitle className="text-destructive">
                  {t("problem.deforestation.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("problem.deforestation.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-destructive/20">
              <CardHeader>
                <Flame className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-orange-400">
                  {t("problem.fires.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("problem.fires.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-destructive/20">
              <CardHeader>
                <MonitorOff className="h-12 w-12 text-cyan-700 mx-auto mb-4" />
                <CardTitle className="text-cyan-700">
                  {t("problem.monitoring.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("problem.monitoring.description")}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("solution.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("solution.subtitle")}
            </p>
          </div>

          <div className="mb-16 aspect-video">
            <Card className="overflow-hidden p-0">
              <Image
                src="/system-screenshot.png"
                alt="Dashboard screenshot"
                width={1600}
                height={1400}
              />
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Satellite className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-600">
                  {t("solution.satellite.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  {t("solution.satellite.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Map className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-600">
                  {t("solution.maps.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  {t("solution.maps.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-600">
                  {t("solution.realtime.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  {t("solution.realtime.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-green-600">
                  {t("solution.analysis.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  {t("solution.analysis.description")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              {t("solution.gallery.title")}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="overflow-hidden p-0">
                <Image
                  src="/data-analysis.png"
                  alt="Data analysis screenshot"
                  width={400}
                  height={600}
                />
              </Card>
              <Card className="overflow-hidden p-0">
                <Image
                  src="/fire-detection.png"
                  alt="Fire detection screenshot"
                  width={400}
                  height={600}
                />
              </Card>
              <Card className="overflow-hidden p-0">
                <Image
                  src="/global-view.png"
                  alt="Global view screenshot"
                  width={400}
                  height={600}
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="tecnologias" className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("technologies.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("technologies.subtitle")}
            </p>
          </div>

          <div className="mb-12">
            <Card className="overflow-hidden p-0">
              <Image
                src="/architecture-diagram.png"
                alt="Technology stack illustration"
                width={1600}
                height={800}
              />
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-accent" />
                  {t("technologies.frontend")}
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
                  {t("technologies.backend")}
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
                  {t("technologies.infrastructure")}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("team.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("team.subtitle")}
            </p>
          </div>

          <div className="mb-12">
            <Card className="overflow-hidden p-0">
              <Image
                src="/team.jpg"
                alt="Team photo"
                width={1600}
                height={1000}
              />
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/eduardo.jpeg" />
                  <AvatarFallback>EC</AvatarFallback>
                </Avatar>
                <CardTitle>Eduardo Cabanillas</CardTitle>
                <CardDescription>{t("team.eduardo.role")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("team.eduardo.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/stefano.jpeg" />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <CardTitle>Stéfano Solís</CardTitle>
                <CardDescription>{t("team.stefano.role")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("team.stefano.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/mathias.jpeg" />
                  <AvatarFallback>MP</AvatarFallback>
                </Avatar>
                <CardTitle>Mathías Pérez</CardTitle>
                <CardDescription>{t("team.mathias.role")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("team.mathias.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/miguel.jpeg" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <CardTitle>Miguel Alayo</CardTitle>
                <CardDescription>{t("team.miguel.role")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("team.miguel.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact & Goals */}
      <section
        id="impacto"
        className="py-20 bg-gradient-to-r from-primary/5 to-accent/5"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t("impact.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("impact.subtitle")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-accent/20">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>{t("impact.researchers.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("impact.researchers.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-accent/20">
              <CardHeader>
                <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>{t("impact.governments.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("impact.governments.description")}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-accent/20">
              <CardHeader>
                <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>{t("impact.public.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t("impact.public.description")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              <Link href="/dashboard">
                <Satellite className="mr-2 h-5 w-5" />
                {t("cta.platformButton")}
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Users className="mr-2 h-5 w-5" />
              {t("cta.contactButton")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{t("footer.title")}</h3>
            <p className="text-muted-foreground mb-6">{t("footer.subtitle")}</p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>{t("footer.copyright")}</span>
              <span>•</span>
              <span>{t("footer.nasa")}</span>
              <span>•</span>
              <span>{t("footer.openSource")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
