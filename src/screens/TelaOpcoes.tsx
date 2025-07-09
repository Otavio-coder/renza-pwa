
import React from 'react';
import { Screen } from '../types';
import Button from '../components/Button';
import Logo from '../components/Logo'; // Import the new Logo component
// BACKGROUND_IMAGE_URL import is no longer needed here

interface TelaOpcoesProps {
  setCurrentScreen: (screen: Screen) => void;
  onLogout: () => void;
  userFullName?: string; 
}

const TelaOpcoes: React.FC<TelaOpcoesProps> = ({ setCurrentScreen, onLogout, userFullName }) => {
  let displayWelcomeName = 'Usuário';

  if (userFullName) {
    if (userFullName.includes('@') && userFullName.includes('.')) {
      displayWelcomeName = userFullName;
    } else {
      const nameParts = userFullName.trim().split(/\s+/);
      if (nameParts.length === 1) {
        displayWelcomeName = nameParts[0];
      } else if (nameParts.length > 1) {
        displayWelcomeName = `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
      } else {
        displayWelcomeName = 'Usuário';
      }
    }
  }

  return (
    <div 
      className="flex-grow flex flex-col items-center justify-center p-4 relative" // Removed bg-stone-900
      // Removed style={{ backgroundImage: `url(${BACKGROUND_IMAGE_URL})` }}
      // Removed bg-cover bg-center classes
    >
      {/* This overlay will now sit on top of the global background image */}
      <div className="absolute inset-0 bg-black opacity-30"></div> {/* Opacity changed from 60 to 30 */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md text-center">
        <Logo className="w-full max-w-sm mb-6" /> {/* Replace h1 with Logo component */}
        {displayWelcomeName && (
          <p className="text-xl text-stone-200 mt-4 mb-8"> 
            Bem-vindo(a), {displayWelcomeName}!
          </p>
        )}
        
        <div className="space-y-5 w-full px-4">
          <Button variant="secondary" onClick={() => setCurrentScreen(Screen.TelaAgenda)} fullWidth>
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" />
              </svg>
              AGENDA
            </span>
          </Button>
          <Button variant="secondary" onClick={() => setCurrentScreen(Screen.TelaHistoricoContratos)} fullWidth>
            <span className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
              </svg>
              HISTÓRICO DE CONTRATOS
            </span>
          </Button>
          <Button variant="secondary" onClick={() => alert('Histórico Financeiro - Em desenvolvimento')} fullWidth>
             <span className="flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-3">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V6.375c0-.621.504-1.125 1.125-1.125h.375m18 0h.375a1.125 1.125 0 0 0 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125h-.375m0 0h-4.5m0 0h-3.75m0 0h-3.75m0 0h-4.5m15 12v-3.375c0-.621-.504-1.125-1.125-1.125h-2.25c-.621 0-1.125.504-1.125 1.125V18m-12-3.75v3.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V15m12-3.75a3 3 0 0 1-3-3V4.5" />
               </svg>
               HISTÓRICO FINANCEIRO
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TelaOpcoes;
