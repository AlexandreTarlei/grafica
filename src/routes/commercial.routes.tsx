/* eslint-disable react-refresh/only-export-components -- manifesto rotas cadastro */
import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

const SignUpPage = lazy(() =>
  import('@/modules/commercial/auth/SignUpPage').then((m) => ({ default: m.SignUpPage })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 p-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-48 w-full max-w-xl" />
    </div>
  )
}

export const signupRouteChild = {
  index: true,
  element: (
    <Suspense fallback={<RouteFallback />}>
      <SignUpPage />
    </Suspense>
  ),
} satisfies RouteObject
