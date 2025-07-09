import "./index.css";

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  // This error is critical and would prevent the app from loading at all.
  console.error("CRITICAL: Root element with ID 'root' not found in the DOM.");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("CRITICAL: Failed to render React application. This might be a contributor to Service Worker issues.", error);
  // Optionally, display a user-friendly message in the DOM
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Ocorreu um erro crítico ao carregar o aplicativo. Verifique o console para mais detalhes.</div>';
}




if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ SW registrado:', reg.scope))
      .catch(err => console.error('❌ Falha ao registrar SW:', err));
  });
}
