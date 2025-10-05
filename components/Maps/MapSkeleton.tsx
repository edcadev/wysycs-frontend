import { Card, CardContent } from "@/components/ui/card"
import { Loader2, MapPin } from "lucide-react"

interface MapSkeletonProps {
  message?: string
  showStats?: boolean
}

export function MapSkeleton({ message = "Cargando mapa...", showStats = false }: MapSkeletonProps) {
  return (
    <div className="relative h-full w-full bg-muted/20 rounded-lg overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-muted/20 to-muted/40 animate-pulse" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Center loading message */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Card className="bg-background/95 backdrop-blur border-primary/20 shadow-xl">
          <CardContent className="pt-6 pb-6 px-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="relative">
                <MapPin className="h-12 w-12 text-primary animate-bounce" />
                <Loader2 className="h-6 w-6 text-primary animate-spin absolute -bottom-1 -right-1" />
              </div>
              <div>
                <p className="font-semibold text-lg">{message}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Esto puede tomar unos segundos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optional stats skeleton */}
      {showStats && (
        <div className="absolute top-4 left-4 space-y-2 z-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-40 bg-background/80 backdrop-blur rounded-lg animate-pulse border border-border/50"
            />
          ))}
        </div>
      )}

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted overflow-hidden">
        <div
          className="h-full bg-primary animate-[shimmer_2s_ease-in-out_infinite]"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s ease-in-out infinite'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
