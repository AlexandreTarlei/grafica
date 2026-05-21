import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { GlobalFetchingBar } from '@/components/feedback/GlobalFetchingBar'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ErrorBoundary } from '@/core/ErrorBoundary'
import { createAppQueryClient } from '@/core/query-client'
import { TenantPlatformProvider } from '@/core/providers/TenantPlatformProvider'
import { TenantProvider } from '@/contexts/TenantContext'
import { ThemeProvider } from '@/contexts/ThemeContext'

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createAppQueryClient())

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <TenantProvider>
                <TenantPlatformProvider>
                  <GlobalFetchingBar />
                  {children}
                  <Toaster richColors position="top-right" closeButton />
                </TenantPlatformProvider>
              </TenantProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  )
}
