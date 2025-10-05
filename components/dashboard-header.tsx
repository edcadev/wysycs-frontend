"use client"

import { ReactNode } from 'react'

interface DashboardHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground truncate">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
