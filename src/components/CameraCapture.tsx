
import React, { useRef } from 'react';

// The Button component is not used in this specific layout, custom styled buttons are used instead.

interface CameraCaptureProps {
  onFilesReady: (files: File[]) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onFilesReady }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesReady(Array.from(event.target.files));
      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = (accept: string, capture?: 'user' | 'environment') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept;
      if (capture) {
        fileInputRef.current.capture = capture;
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };

  const CameraIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.342 1.374l.82 1.327a3 3 0 002.34 1.373h.521a3.75 3.75 0 013.75 3.75v6.75a3.75 3.75 0 01-3.75-3.75h-13.5a3.75 3.75 0 01-3.75-3.75v-6.75a3.75 3.75 0 013.75-3.75h.521a3 3 0 002.34-1.373l.82-1.327a3 3 0 012.342-1.374zM12 15a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
    </svg>
  );

  const VideoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V7.5h8.25a.75.75 0 0 1 0 1.5H3v7.06A.75.75 0 0 0 3.75 18h16.5a.75.75 0 0 0 .75-.75V7.5h-5.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H3.75A.75.75 0 0 0 3 6v10.06Z" clipRule="evenodd" />
    </svg>
  );


  return (
    <div className="w-full flex flex-col items-center space-y-4 text-center">
      <h3 className="text-2xl font-bold text-white mb-2">Capturar Mídia</h3>
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple // Allow multiple files
      />
      
      {/* Action Buttons */}
      <button 
        onClick={() => triggerFileInput('image/*', 'environment')}
        className="w-full max-w-sm bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-4 rounded-full flex items-center justify-center text-lg transition-colors"
        aria-label="Tirar fotos de perto usando a câmera do dispositivo"
      >
        <CameraIcon className="w-7 h-7 mr-3" />
        Fotos de Perto
      </button>
      
      <button 
        onClick={() => triggerFileInput('image/*')}
        className="w-full max-w-sm bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-4 rounded-full flex items-center justify-center text-lg transition-colors"
        aria-label="Selecionar fotos de longe da galeria do dispositivo"
      >
        <CameraIcon className="w-7 h-7 mr-3" />
        Fotos de Longe
      </button>

      <button 
        onClick={() => triggerFileInput('video/*', 'environment')}
        className="w-full max-w-sm bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 px-4 rounded-full flex items-center justify-center text-lg transition-colors"
        aria-label="Gravar vídeos usando a câmera do dispositivo"
      >
        <VideoIcon className="w-7 h-7 mr-3" />
        Gravar Vídeo(s)
      </button>

    </div>
  );
};

export default CameraCapture;
