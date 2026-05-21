import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { RealtimeProvider } from '@/realtime/RealtimeProvider'

export function RootLayout() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <Outlet />
      </RealtimeProvider>
    </AuthProvider>
  )
}
