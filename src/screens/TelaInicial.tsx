
import React from 'react';
import { Screen } from '../types';
import Button from '../components/Button';
import Logo from '../components/Logo'; // Import the new Logo component
// BACKGROUND_IMAGE_URL import is no longer needed here

interface TelaInicialProps {
  setCurrentScreen: (screen: Screen) => void;
}

const TelaInicial: React.FC<TelaInicialProps> = ({ setCurrentScreen }) => {
  return (
    <div 
      className="flex-grow flex flex-col items-center justify-center p-4 relative" // Removed bg-stone-900
      // Removed style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
      // Removed bg-cover bg-center classes
    >
      {/* This overlay will now sit on top of the global background image */}
      <div className="absolute inset-0 bg-black opacity-20"></div> {/* Opacity changed from 50 to 20 */}
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md text-center">
        <Logo className="w-full max-w-md mb-12" /> {/* Replace h1 with Logo component */}
        <div className="mt-8 sm:mt-12 space-y-6 w-full px-4">
          <Button variant="primary" onClick={() => setCurrentScreen(Screen.TelaNovoUsuario)} fullWidth size="lg">
            CRIAR CONTA
          </Button>
          <Button variant="light" onClick={() => setCurrentScreen(Screen.TelaLogin)} fullWidth size="lg">
            LOGIN
          </Button>
          {/* Removed "Criar Conta (Firebase Teste)" button */}
        </div>
      </div>
    </div>
  );
};

export default TelaInicial;