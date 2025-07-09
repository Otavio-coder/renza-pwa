import React, { useState, useRef } from 'react';
import { Screen, TelaAssinaturaProps } from '../types'; 
import Button from '../components/Button';
import SignatureCanvas from '../components/SignatureCanvas';
import InputField from '../components/InputField'; 

const TelaAssinatura: React.FC<TelaAssinaturaProps> = ({ setCurrentScreen, onLogout, contract, onFinalizeContract, backNavigationTarget }) => {
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [signerName, setSignerName] = useState('');
  const [signerCpf, setSignerCpf] = useState('');
  
  const [documentPhotos, setDocumentPhotos] = useState<File[]>([]);
  const [documentPhotoPreviews, setDocumentPhotoPreviews] = useState<string[]>([]);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const documentPhotoInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSignature = (dataUrl: string) => {
    setSignatureDataUrl(dataUrl);
    if(error === "Por favor, colete a assinatura do cliente.") setError(''); // Clear signature-specific error
  };

  const handleDocumentPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);

      if (documentPhotos.length + files.length > 2) {
          setError('Você pode anexar no máximo 2 fotos do documento.');
          if(documentPhotoInputRef.current) documentPhotoInputRef.current.value = "";
          return;
      }

      let validationError = '';
      const readPromises: Promise<void>[] = [];

      files.forEach(file => {
        if (!file.type.startsWith('image/')) {
          validationError = 'Por favor, selecione um arquivo de imagem válido (ex: JPG, PNG).';
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
          validationError = 'O arquivo da foto do documento é muito grande (máx. 5MB).';
          return;
        }

        readPromises.push(new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            setDocumentPhotos(prev => [...prev, file]);
            setDocumentPhotoPreviews(prev => [...prev, reader.result as string]);
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }));
      });
      
      if(validationError) {
        setError(validationError);
      } else {
        Promise.all(readPromises).catch(() => setError("Erro ao ler um dos arquivos."));
        setError('');
      }
    }
    
    if(documentPhotoInputRef.current) documentPhotoInputRef.current.value = "";
  };

  const triggerDocumentPhotoInput = () => {
    documentPhotoInputRef.current?.click();
  };
  
  const removeDocumentPhoto = (indexToRemove: number) => {
    setDocumentPhotos(prevPhotos => prevPhotos.filter((_, index) => index !== indexToRemove));
    setDocumentPhotoPreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = () => {
    setError('');
    setIsLoading(true);
    if (!signerName.trim()) {
      setError("Por favor, informe o nome completo do assinante.");
      setIsLoading(false);
      return;
    }
    if (!/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(signerCpf.trim())) {
      setError("Por favor, informe um CPF válido.");
      setIsLoading(false);
      return;
    }
    if (!signatureDataUrl) {
      setError("Por favor, colete a assinatura do cliente.");
      setIsLoading(false);
      return;
    }
    if (documentPhotos.length === 0) {
      setError("Por favor, anexe pelo menos uma foto do documento.");
      setIsLoading(false);
      return;
    }

    const normalizedCpf = signerCpf.replace(/[.-]/g, '');

    console.log("Assinatura e dados submetidos:", { 
      contractId: contract.id, 
      signatureDataUrl, 
      signerName, 
      signerCpf: normalizedCpf,
      documentPhotoCount: documentPhotos.length,
    });
    onFinalizeContract(contract.id, signatureDataUrl, signerName, normalizedCpf, documentPhotos);
    // Navigation is handled by App.tsx after onFinalizeContract
  };

  const isActionDisabled = isLoading;

  return (
    <div className="flex-grow flex flex-col items-center p-4 sm:p-6"> 
      <div className="w-full max-w-2xl bg-stone-800 p-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6 pt-2">
            <button 
                onClick={() => !isActionDisabled && setCurrentScreen(backNavigationTarget)}
                className="text-stone-300 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-700"
                aria-label={`Voltar para ${Screen[backNavigationTarget].replace("Tela", "")}`}
                disabled={isActionDisabled}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
            <h2 className="text-2xl font-bold text-white text-center flex-grow">Assinatura do Cliente</h2>
        </div>

        <p className="text-stone-400 mb-6 text-center">
          Contrato Nº: <strong className="text-orange-400">{contract.numeroContrato}</strong>. Cliente: <strong className="text-orange-400">{contract.nomeContrato}</strong>.
          <br />
          Por favor, preencha os dados e colete a assinatura.
        </p>

        {error && <p className="text-red-400 text-sm bg-red-900 p-3 rounded-md text-center mb-4">{error}</p>}

        <div className="space-y-4 mb-6">
          <InputField
            id="signerName"
            label="Nome Completo do Assinante:"
            type="text"
            placeholder="Digite o nome completo"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            aria-label="Nome Completo do Assinante"
            disabled={isActionDisabled}
          />
          <InputField
            id="signerCpf"
            label="CPF do Assinante:"
            type="text"
            placeholder="Digite o CPF (ex: 123.456.789-00)"
            value={signerCpf}
            onChange={(e) => setSignerCpf(e.target.value)}
            aria-label="CPF do Assinante"
            maxLength={14} 
            disabled={isActionDisabled}
          />
        </div>

        {/* Document Photo Upload Section */}
        <div className="space-y-4 mb-6 pt-2">
            <h3 className="text-lg font-semibold text-white">Fotos do Documento</h3>
            <div className="bg-stone-700 p-4 rounded-lg">
                {documentPhotos.length === 0 ? (
                    <button
                        onClick={triggerDocumentPhotoInput}
                        disabled={isActionDisabled}
                        className="w-full p-6 bg-stone-800 rounded-lg flex flex-col items-center justify-center text-stone-400 hover:bg-stone-600 hover:text-white transition-colors border-2 border-dashed border-stone-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Anexar fotos do documento"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 01.205 9.21A4.5 4.5 0 016.75 19.5z" />
                        </svg>
                        <span className="font-semibold">Anexar Documento(s)</span>
                        <span className="text-xs mt-1">(Máximo: 2)</span>
                    </button>
                ) : (
                    <div className="flex flex-wrap gap-4 items-center">
                        {documentPhotoPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img src={preview} alt={`Prévia do documento ${index + 1}`} className="w-32 h-32 object-cover rounded-lg shadow-md" />
                                <button
                                    onClick={() => !isActionDisabled && removeDocumentPhoto(index)}
                                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 leading-none shadow-lg hover:bg-red-700 disabled:bg-red-400"
                                    aria-label={`Remover foto ${index + 1}`}
                                    disabled={isActionDisabled}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        ))}

                        {documentPhotos.length < 2 && (
                            <button
                                onClick={triggerDocumentPhotoInput}
                                disabled={isActionDisabled}
                                className="w-32 h-32 bg-stone-800 rounded-lg flex flex-col items-center justify-center text-stone-400 hover:bg-stone-600 hover:text-white transition-colors border-2 border-dashed border-stone-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                                aria-label="Anexar mais uma foto do documento"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                <span className="text-sm mt-1">Adicionar</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
        
        <input 
          type="file" 
          accept="image/*" 
          ref={documentPhotoInputRef} 
          onChange={handleDocumentPhotoChange} 
          className="hidden" 
          disabled={isActionDisabled}
          aria-label="Seletor de foto do documento"
          multiple
        />
        
        <h3 className="text-xl font-semibold text-white mb-3 text-center">Assinatura Digital</h3>
        <SignatureCanvas onSave={handleSaveSignature} width={500} height={200} disabled={isActionDisabled} />

        <Button variant="primary" onClick={handleSubmit} fullWidth className="mt-8" disabled={!!contract.assinaturaUrl || isActionDisabled}>
          {isLoading ? 'FINALIZANDO...' : (contract.assinaturaUrl ? "CONTRATO JÁ ASSINADO" : "Finalizar e Assinar")}
        </Button>
      </div>
    </div>
  );
};

export default TelaAssinatura;