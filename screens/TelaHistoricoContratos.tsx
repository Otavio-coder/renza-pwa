

import React from 'react';
import { Screen, Contract } from '../types';
import Button from '../components/Button';

interface TelaHistoricoContratosProps {
  setCurrentScreen: (screen: Screen) => void;
  contracts: Contract[];
  onViewContract: (contract: Contract) => void;
  onLogout: () => void;
}

const TelaHistoricoContratos: React.FC<TelaHistoricoContratosProps> = ({ setCurrentScreen, contracts, onViewContract, onLogout }) => {
  
  const getContractStatus = (contract: Contract): { text: string; colorClass: string } => {
    if (contract.assinaturaUrl) {
      if (contract.itensPendentes && contract.itensPendentes.length > 0) {
        return { text: 'Status: Finalizado com Pendência', colorClass: 'text-yellow-400' }; // Yellow-orange for pending
      }
      return { text: 'Status: Finalizado', colorClass: 'text-green-400' }; // Green for finalized
    }
    return { text: 'Status: Em Aberto', colorClass: 'text-amber-500' }; // Amber/Yellow for open
  };

  // Sort contracts: open ones first, then by date descending.
  const sortedContracts = [...contracts].sort((a, b) => {
    const aIsOpen = !a.assinaturaUrl;
    const bIsOpen = !b.assinaturaUrl;

    if (aIsOpen && !bIsOpen) return -1; // a (open) comes before b (closed)
    if (!aIsOpen && bIsOpen) return 1;  // b (open) comes before a (closed)

    // If both are open or both are closed, sort by dateContrato descending
    const dateA = new Date(a.dataContrato.split('/').reverse().join('-'));
    const dateB = new Date(b.dataContrato.split('/').reverse().join('-'));
    return dateB.getTime() - dateA.getTime();
  });


  const renderContractList = (list: Contract[], title: string, emptyMessage: string, titleColor: string) => (
    <>
      <h3 className={`text-xl font-semibold ${titleColor} mb-3 mt-4 pt-2 border-t border-stone-700`}>{title}</h3>
      {list.length === 0 ? (
        <p className="text-stone-400 text-center py-6">{emptyMessage}</p>
      ) : (
        <div className="space-y-4">
          {list.map(contract => {
            const status = getContractStatus(contract);
            return (
              <div key={contract.id} className="bg-stone-700 p-4 rounded-lg shadow hover:bg-stone-600 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-orange-400">{`Contrato Nº: ${contract.numeroContrato}`}</h4>
                    <p className="text-stone-300 text-sm">{`Cliente: ${contract.nomeContrato}`}</p>
                    <p className="text-stone-300 text-sm">{`Data: ${contract.dataContrato}`}</p>
                    <p className={`text-xs ${status.colorClass} mt-1 font-medium`}>{status.text}</p>
                  </div>
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={() => onViewContract(contract)}
                    className="mt-3 sm:mt-0"
                    aria-label={`Ver detalhes do contrato ${contract.numeroContrato}`}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  // Separate contracts for display sections (optional, could iterate once with sections)
  const openContracts = sortedContracts.filter(contract => !contract.assinaturaUrl);
  const finishedContractsAll = sortedContracts.filter(contract => !!contract.assinaturaUrl);


  return (
    <div className="flex-grow flex flex-col items-center p-4 sm:p-6"> {/* Removed bg-stone-900 */}
      <div className="w-full max-w-3xl bg-stone-800 p-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <button 
              onClick={() => setCurrentScreen(Screen.TelaOpcoes)} 
              className="text-stone-300 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-700"
              aria-label="Voltar para Opções"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
          </button>
          <h2 className="text-2xl font-bold text-white text-center flex-grow">Histórico de Contratos</h2>
        </div>

        {sortedContracts.length === 0 ? (
           <p className="text-stone-400 text-center py-10">Nenhum contrato encontrado no histórico.</p>
        ) : (
          <>
            {renderContractList(openContracts, "Contratos em Aberto", "Nenhum contrato em aberto.", "text-amber-300")}
            {renderContractList(finishedContractsAll, "Contratos Finalizados", "Nenhum contrato finalizado.", "text-green-300")}
          </>
        )}
      </div>
    </div>
  );
};

export default TelaHistoricoContratos;