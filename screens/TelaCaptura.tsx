
import React, { useState, useRef, useEffect } from 'react';
import { Screen, TelaCapturaProps } from '../types';
import Button from '../components/Button';

// Icon components are defined here for use in the capture buttons.
const CameraIcon = ({ className = "w-7 h-7 mr-3" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.342 1.374l.82 1.327a3 3 0 002.34 1.373h.521a3.75 3.75 0 013.75 3.75v6.75a3.75 3.75 0 01-3.75-3.75h-13.5a3.75 3.75 0 01-3.75-3.75v-6.75a3.75 3.75 0 013.75-3.75h.521a3 3 0 002.34-1.373l.82-1.327a3 3 0 012.342-1.374zM12 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
);

const VideoIcon = ({ className = "w-7 h-7 mr-3" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V7.5h8.25a.75.75 0 0 1 0 1.5H3v7.06A.75.75 0 0 0 3.75 18h16.5a.75.75 0 0 0 .75-.75V7.5h-5.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H3.75A.75.75 0 0 0 3 6v10.06Z" clipRule="evenodd" />
    </svg>
);

const TelaCaptura: React.FC<TelaCapturaProps> = ({ 
  setCurrentScreen, 
  onLogout, 
  forItem,
  contract,
  onMediaSubmittedForItem,
  onGenericMediaSubmitted,
  capturedMedia,
  onMediaChange
}) => {
  const [pertoPreview, setPertoPreview] = useState<string | null>(null);
  const [longePreview, setLongePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [captureType, setCaptureType] = useState<'perto' | 'longe' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newPertoPreview = capturedMedia.perto ? URL.createObjectURL(capturedMedia.perto) : null;
    const newLongePreview = capturedMedia.longe ? URL.createObjectURL(capturedMedia.longe) : null;
    const newVideoPreview = capturedMedia.video ? URL.createObjectURL(capturedMedia.video) : null;

    setPertoPreview(newPertoPreview);
    setLongePreview(newLongePreview);
    setVideoPreview(newVideoPreview);

    return () => {
      if (newPertoPreview) URL.revokeObjectURL(newPertoPreview);
      if (newLongePreview) URL.revokeObjectURL(newLongePreview);
      if (newVideoPreview) URL.revokeObjectURL(newVideoPreview);
    };
  }, [capturedMedia.perto, capturedMedia.longe, capturedMedia.video]);
  
  const handleProceed = () => {
    if (!capturedMedia.perto || !capturedMedia.longe || !capturedMedia.video) {
        alert('É necessário anexar uma foto de perto, uma foto de longe e um vídeo para prosseguir.');
        return;
    }
    
    const files = [capturedMedia.perto, capturedMedia.longe, capturedMedia.video].filter((f): f is File => f !== null);
    
    if (forItem && onMediaSubmittedForItem) {
      onMediaSubmittedForItem(forItem.contractId, forItem.itemCod, files);
    } else if (onGenericMediaSubmitted) {
      onGenericMediaSubmitted(files);
    } else {
      console.warn("Media captured but no submission callback provided.");
      alert(`${files.length} arquivo(s) de mídia pronto(s), mas sem ação definida.`);
      setCurrentScreen(Screen.TelaOpcoes);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && captureType) {
      onMediaChange(captureType, file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setCaptureType(null);
  };

  const triggerFileInput = (type: 'perto' | 'longe' | 'video', accept: string, capture?: 'user' | 'environment') => {
    setCaptureType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      if (capture) {
        fileInputRef.current.capture = capture;
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.removeAttribute('multiple');
      fileInputRef.current.click();
    }
  };

  const removeMedia = (type: 'perto' | 'longe' | 'video') => {
    onMediaChange(type, null);
  };

  const allMediaCaptured = !!(capturedMedia.perto && capturedMedia.longe && capturedMedia.video);

  const renderCaptureOption = (
    type: 'perto' | 'longe' | 'video',
    title: string,
    IconComponent: React.ElementType,
    accept: string,
    capture?: 'user' | 'environment'
  ) => {
    const file = capturedMedia[type];
    let previewUrl: string | null = null;
    if (type === 'perto') previewUrl = pertoPreview;
    else if (type === 'longe') previewUrl = longePreview;
    else if (type === 'video') previewUrl = videoPreview;

    if (file && previewUrl) {
      return (
        <div className="w-full max-w-sm text-center p-3 bg-stone-700 rounded-lg shadow-md transition-all">
          <p className="font-semibold mb-2 text-white">{title}</p>
          {type === 'video' ? (
            <video src={previewUrl} controls className="w-full h-32 object-contain rounded-md bg-black"></video>
          ) : (
            <img src={previewUrl} alt={`Prévia de ${title}`} className="w-full h-32 object-cover rounded-md" />
          )}
          <div className="mt-3 flex justify-center gap-3">
            <Button variant="light" size="sm" onClick={() => triggerFileInput(type, accept, capture)}>
              Alterar
            </Button>
            <Button variant="ghost" size="sm" onClick={() => removeMedia(type)}>
              Remover
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <button
          onClick={() => triggerFileInput(type, accept, capture)}
          className="w-full max-w-sm font-bold py-3 px-4 rounded-full flex items-center justify-center text-lg transition-colors bg-amber-600 hover:bg-amber-700 text-white"
          aria-label={`Capturar ${title}`}
        >
          <IconComponent />
          {title}
        </button>
      );
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-stone-800 p-6 rounded-xl shadow-2xl text-white">
        <div className="flex items-center justify-start mb-4 relative h-10">
          <button 
              onClick={() => {
                if (forItem) {
                  setCurrentScreen(Screen.TelaDetalheContrato);
                } else {
                  setCurrentScreen(Screen.TelaOpcoes);
                }
              }}
              className="text-stone-300 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-700 absolute left-0 top-1/2 -translate-y-1/2"
              aria-label={forItem ? "Voltar para Detalhes do Contrato" : "Voltar para Opções"}
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
          </button>
        </div>
        
        {forItem && contract && (
          <div className="bg-stone-900/50 border border-amber-800 p-3 rounded-lg mb-6 text-center shadow">
            <p>Contrato: <strong className="font-semibold text-amber-300">{contract.numeroContrato}</strong></p>
            <p className="mt-1">Capturando mídia para o ambiente: <strong className="font-semibold text-amber-300">{forItem.ambienteName}</strong> (Item: {forItem.itemCod})</p>
          </div>
        )}

        <div className="w-full flex flex-col items-center space-y-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Capturar Mídia</h3>
          <p className="text-stone-400 mb-2">É necessário anexar uma mídia de cada tipo para prosseguir.</p>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          
          {renderCaptureOption('perto', 'Foto de Perto', CameraIcon, 'image/*', 'environment')}
          {renderCaptureOption('longe', 'Foto de Longe', CameraIcon, 'image/*')}
          {renderCaptureOption('video', 'Gravar Vídeo', VideoIcon, 'video/*', 'environment')}

          <div className="pt-4 w-full max-w-sm">
            <Button
              variant="primary"
              size="lg"
              onClick={handleProceed}
              disabled={!allMediaCaptured}
              fullWidth
            >
              Prosseguir
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TelaCaptura;
