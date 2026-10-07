import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Suppress WebSocket HMR connection error overlays in preview environment
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason &&
    (event.reason.message?.includes('WebSocket') ||
      event.reason?.includes?.('WebSocket') ||
      String(event.reason).includes('WebSocket'))
  ) {
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('WebSocket')) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
