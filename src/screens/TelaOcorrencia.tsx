
import React, { useState, useRef } from 'react';
import { Screen, OcorrenciaData, TelaOcorrenciaProps, ContractItemDetail } from '../types'; // Import ContractItemDetail
import Button from '../components/Button';
// import Logo from '../components/Logo'; // Logo component removed

// Removed local TelaOcorrenciaProps interface

const TelaOcorrencia: React.FC<TelaOcorrenciaProps> = ({ setCurrentScreen, itemComProblema, contract, onOcorrenciaSubmit, onLogout }) => {
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => fileInputRef.current?.click();

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Por favor, descreva o problema.');
      return;
    }
    if (!itemComProblema) {
        alert('Erro: Item problemático não identificado.');
        setCurrentScreen(Screen.TelaOpcoes); 
        return;
    }

    const ocorrencia: OcorrenciaData = {
      itemId: itemComProblema.cod, 
      itemLabel: itemComProblema.ambiente, 
      description,
      photo,
    };
    onOcorrenciaSubmit(ocorrencia);
    // Alert and navigation handled by App.tsx typically for submissions
    // setCurrentScreen(Screen.TelaOpcoes); // This might be handled in onOcorrenciaSubmit's callback in App.tsx
  };

  const handlePdfDownload = () => {
    if (contract && itemComProblema && typeof contract.numeroContrato === 'string' && typeof itemComProblema.cod === 'string') {
      try {
        const message = `O PDF do contrato Nº ${contract.numeroContrato} (referente à ocorrência no item ${itemComProblema.cod} - ${itemComProblema.ambiente}) está pronto para download. Clique em "OK" para simular o salvamento do arquivo.`;
        alert(message);
      } catch (e) {
        console.error("Erro ao tentar exibir o alerta de download do PDF para ocorrência:", e);
        alert("Ocorreu um erro ao preparar a opção de download do PDF. Tente novamente.");
      }
    } else if (contract && itemComProblema) {
      console.warn("Tentativa de gerar PDF para ocorrência, mas dados do contrato ou item estão incompletos:", contract, itemComProblema);
      alert("Não é possível gerar o PDF: informações do contrato ou do item estão ausentes ou inválidas.");
    }
    else {
      alert("Nenhum contrato ou item específico associado a esta ocorrência para gerar PDF.");
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center p-4 sm:p-6"> {/* Removed bg-stone-900 */}
      <div className="w-full max-w-xl bg-stone-800 p-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6 pt-2"> 
            <button 
                onClick={() => {
                  setCurrentScreen(itemComProblema && contract ? Screen.TelaDetalheContrato : Screen.TelaOpcoes);
                }}
                className="text-stone-300 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-700"
                aria-label="Voltar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
            <h2 className="text-2xl font-bold text-white text-center flex-grow">Registrar Ocorrência</h2>
            <button
              onClick={handlePdfDownload}
              className="text-stone-300 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-700 ml-2"
              aria-label="Gerar PDF do Contrato da Ocorrência"
              disabled={!contract || !itemComProblema}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </button>
        </div>

        {itemComProblema && (
          <p className="text-amber-400 bg-amber-900 p-3 rounded-md mb-6 text-center">
            {contract && `Contrato Nº: ${contract.numeroContrato} - `}
            Registrando ocorrência para o ambiente: <strong className="font-semibold">{itemComProblema.ambiente}</strong> (Cód: {itemComProblema.cod})
          </p>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-300 mb-1">
              Descrição do Problema:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhe o problema encontrado..."
              rows={5}
              className="bg-stone-700 border border-stone-600 text-white placeholder-stone-400 text-md rounded-xl focus:ring-orange-500 focus:border-orange-500 block w-full p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1">
              Anexar Foto (Opcional):
            </label>
            <Button variant="ghost" onClick={triggerFileInput} fullWidth>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
              Selecionar Foto
            </Button>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              className="hidden" 
            />
            {photoPreview && (
              <div className="mt-4 text-center">
                <img src={photoPreview} alt="Prévia da foto" className="max-w-xs mx-auto h-auto rounded-lg shadow-md" />
                <Button 
                  variant="light" 
                  size="sm" 
                  onClick={() => {setPhoto(null); setPhotoPreview(null); if(fileInputRef.current) fileInputRef.current.value = "";}} 
                  className="mt-2"
                >
                  Remover Foto
                </Button>
              </div>
            )}
          </div>

          <Button variant="primary" onClick={handleSubmit} fullWidth>
            Enviar Chamado
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TelaOcorrencia;