import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Il "!" si chiama ASSERTION OPERATOR
// Serve a comunicare a TYPESCRIPT che l'elemento non è NULL.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
