
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

/*
// --- SERVICE WORKER REGISTRATION DISABLED ---
// The following block is commented out to prevent the persistent "InvalidStateError".
// This error is specific to the sandboxed development environment and is not critical
// for the application's core functionality at this stage.
// This code can be re-enabled for a production environment if needed.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      // We construct an absolute URL to avoid origin mismatch issues.
      const swUrl = `${window.location.origin}/service-worker.js`;
      navigator.serviceWorker.register(swUrl)
        .then((registration) => {
          console.log('Service Worker registration temporarily disabled, but would have registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed (post-load timeout):', error);
          if (error.name === 'InvalidStateError') {
            console.error("Registration failed: The document's state is not valid. Document readyState:", document.readyState);
          }
        });
    }, 0); // Use a 0ms timeout to defer execution to the next event loop cycle.
  });
}
*/
