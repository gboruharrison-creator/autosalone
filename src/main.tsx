import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{ duration: 3000, style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' } }}
    />
  </HelmetProvider>
);