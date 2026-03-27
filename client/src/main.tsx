import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/authProvider.tsx';
import { LoadingProvider } from './context/loadingProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> 
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </AuthProvider>
  </StrictMode>,
)
