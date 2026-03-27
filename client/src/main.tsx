import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/authProvider.tsx';
import { LoadingProvider } from './context/loadingProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider> 
      <LoadingProvider>
        <BrowserRouter> {/* to enable useNavigate in Header and 404 page */}
          <App />
        </BrowserRouter>
      </LoadingProvider>
    </AuthProvider>
  </StrictMode>,
)
