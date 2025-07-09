
import React, { useEffect } from 'react';
import Logo from '../components/Logo'; // Import the new Logo component

const TelaSplash: React.FC = () => {
  console.log('--- TELASPLASH COMPONENT START --- Current Time:', new Date().toLocaleTimeString());
  
  useEffect(() => {
    console.log('--- TELASPLASH useEffect (mounted) --- Current Time:', new Date().toLocaleTimeString());
  }, []);

  return (
    <div
      className="h-screen w-screen fixed inset-0 flex flex-col items-center justify-center" // Removed background bg-stone-900
      role="status" 
      aria-live="polite"
      aria-label="RENZA Planejados - Carregando aplicativo" 
    >
      <Logo className="w-4/5 max-w-xs sm:max-w-sm md:max-w-md animate-pulse" /> {/* Use Logo component */}
      {/* Removed old h1 and p text elements */}
    </div>
  );
};

export default TelaSplash;
