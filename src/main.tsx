import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './store/AppContext.tsx'
import { SupabaseAppProvider } from './store/SupabaseAppProvider.tsx'
import { AuthGate } from './store/AuthGate.tsx'
import { isSupabaseConfigured } from './lib/supabaseClient.ts'

const Providers = isSupabaseConfigured
  ? ({ children }: { children: ReactNode }) => (
      <AuthGate>
        <SupabaseAppProvider>{children}</SupabaseAppProvider>
      </AuthGate>
    )
  : AppProvider

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Providers>
        <App />
      </Providers>
    </HashRouter>
  </StrictMode>,
)
