import React, { useRef, useEffect, useState } from 'react';
import ActualSignaturePad from 'react-signature-canvas'; // Renamed import
import type { SignatureCanvasProps as LibSignaturePadProps } from 'react-signature-canvas'; // Type import for props
import Button from './Button';

interface SignatureCanvasWrapperProps { // Renamed own props interface for clarity
  onSave: (dataUrl: string) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

const SignatureCanvas: React.FC<SignatureCanvasWrapperProps> = ({ onSave, width: initialWidth = 500, height = 200, disabled = false }) => {
  const sigPadRef = useRef<ActualSignaturePad>(null);
  const [canvasWidth, setCanvasWidth] = useState(initialWidth);

  useEffect(() => {
    const calculateWidth = () => {
      // Use a more robust way to get parent width if available, or fallback
      const parentElement = sigPadRef.current?.getCanvas().parentElement?.parentElement; // The div containing the canvas and buttons
      if (parentElement) {
        const parentWidth = parentElement.offsetWidth;
        // Subtract padding/margins if any, here assuming 48px total (p-6 on parent = 24px*2)
        // Max width can also be applied
        return Math.min(parentWidth > 0 ? parentWidth - 48 : 300, initialWidth); 
      }
      return window.innerWidth > 600 ? initialWidth : window.innerWidth - 80; // Fallback
    };
    
    const newWidth = calculateWidth();
    setCanvasWidth(newWidth);

    // Optional: Resize listener if you want it to be dynamic beyond initial load
    // window.addEventListener('resize', () => setCanvasWidth(calculateWidth()));
    // return () => window.removeEventListener('resize', () => setCanvasWidth(calculateWidth()));

  }, [initialWidth]);


  const clearSignature = () => {
    sigPadRef.current?.clear();
  };

  const saveSignature = () => {
    if (sigPadRef.current?.isEmpty()) {
      alert("Por favor, forneça uma assinatura.");
      return;
    }
    const dataUrl = sigPadRef.current?.getTrimmedCanvas().toDataURL('image/png') || '';
    onSave(dataUrl);
  };

  // Explicitly define props for the library component
  const signaturePadProps: LibSignaturePadProps & { penColor: string } = {
    penColor: "black",
    canvasProps: { 
        width: canvasWidth, 
        height: height, 
        className: 'signature-canvas rounded-lg' 
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="bg-white border border-stone-400 rounded-lg shadow-md">
        <ActualSignaturePad
          ref={sigPadRef}
          {...signaturePadProps} // Spread the explicitly typed props
        />
      </div>
      <div className="mt-4 flex space-x-4">
        <Button variant="light" onClick={clearSignature} disabled={disabled}>Limpar</Button>
        <Button variant="primary" onClick={saveSignature} disabled={disabled}>Salvar Assinatura</Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;