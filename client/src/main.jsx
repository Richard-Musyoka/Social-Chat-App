
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster 
      position="top-right" 
      toastOptions={{
        className: '',
        duration: 3000,
        closeButton: true, // Ensures close button is rendered
        style: {
          background: '#ffffff',
          color: '#000000',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '10px',
        },
      }} 
    />
  </>
)

