

import React, { useState, useEffect } from 'react';
import { Screen, OcorrenciaData, User, Contract, TelaDetalheContratoProps, TelaAgendaProps, ContractItemDetail, TelaCapturaProps, TelaAssinaturaProps, TelaLoginProps, TelaNovoUsuarioProps } from './types';
import TelaSplash from './screens/TelaSplash';
import TelaInicial from './screens/TelaInicial';
import TelaNovoUsuario from './screens/TelaNovoUsuario';
import TelaLogin from './screens/TelaLogin';
import TelaOpcoes from './screens/TelaOpcoes';
import TelaCaptura from './screens/TelaCaptura';
import TelaAssinatura from './screens/TelaAssinatura';
import TelaOcorrencia from './screens/TelaOcorrencia';
import TelaHistoricoContratos from './screens/TelaHistoricoContratos';
import TelaDetalheContrato from './screens/TelaDetalheContrato';
import TelaAgenda from './screens/TelaAgenda';
import { SAMPLE_CONTRACTS, BACKGROUND_IMAGE_URL } from './constants'; 
// Firebase imports removed: import { auth, db, firebase } from './src/firebaseConfig';
// Firebase User type import removed: import type firebaseCompat from 'firebase/compat/app';


const App: React.FC = () => {
  console.log('--- APP COMPONENT START --- Current Time:', new Date().toLocaleTimeString());
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.TelaSplash);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [issueToReport, setIssueToReport] = useState<ContractItemDetail | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contracts, setContracts] = useState<Contract[]>(SAMPLE_CONTRACTS); 
  const [mediaCaptureContext, setMediaCaptureContext] = useState<{ contractId: string, itemCod: string, ambienteName: string } | null>(null);
  const [contractDetailBackTarget, setContractDetailBackTarget] = useState<Screen>(Screen.TelaHistoricoContratos);
  const [signatureBackTarget, setSignatureBackTarget] = useState<Screen>(Screen.TelaDetalheContrato);
  const [authInitialized, setAuthInitialized] = useState(false); // Simplified: true after splash
  
  // State for media capture flow, lifted up from TelaCaptura
  const [capturedMedia, setCapturedMedia] = useState<{ perto: File | null; longe: File | null; video: File | null }>({ perto: null, longe: null, video: null });

  // Simulate local user storage if needed for persistence across refreshes (optional)
  const [locallyRegisteredUsers, setLocallyRegisteredUsers] = useState<Map<string, {name: string, email: string, passwordHash: string, uid: string}>>(new Map());


  // Splash screen duration and initial auth check
  useEffect(() => {
    if (currentScreen === Screen.TelaSplash) {
      const timer = setTimeout(() => {
        setAuthInitialized(true); // Mark "auth" as initialized
        if (!isLoggedIn) { // Check local login state
          setCurrentScreen(Screen.TelaInicial);
        } else {
          setCurrentScreen(Screen.TelaOpcoes); 
        }
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [currentScreen, isLoggedIn]); // Removed authInitialized dependency as it's set above

  // Effect to clear captured media if the capture context is removed
  useEffect(() => {
    if (mediaCaptureContext === null) {
      clearCapturedMedia();
    }
  }, [mediaCaptureContext]);

  const handleMediaChange = (type: 'perto' | 'longe' | 'video', file: File | null) => {
    setCapturedMedia(prev => ({ ...prev, [type]: file }));
  };

  const clearCapturedMedia = () => {
    setCapturedMedia({ perto: null, longe: null, video: null });
  };

  const handleRegister = async (name: string, email: string, passwordInput: string): Promise<string | boolean> => {
    console.log("--- LOCAL REGISTER ATTEMPT ---", { name, email });
    
    // Simulate email already in use
    if (Array.from(locallyRegisteredUsers.values()).some(u => u.email === email)) {
      return "Este e-mail já está em uso (simulado). Tente outro.";
    }

    const newUserUid = `localUser_${Date.now()}`;
    // No need to create a User object here since we are not logging them in automatically.

    // Simulate storing user locally
    setLocallyRegisteredUsers(prev => new Map(prev).set(email, { name, email, passwordHash: passwordInput, uid: newUserUid})); // Storing plain password for demo, HASH in real app

    // DO NOT log the user in automatically after registration.
    // setCurrentUser(newUser);
    // setIsLoggedIn(true);
    
    alert(`Usuário "${name}" cadastrado com sucesso (simulado)! Por favor, faça o login para continuar.`);
    setCurrentScreen(Screen.TelaLogin); // Navigate to the login screen
    return true;
  };
  
  const handleLoginAttempt = async (email: string, passwordInput: string): Promise<string | boolean> => {
    console.log("--- LOCAL LOGIN ATTEMPT ---", { email });
    
    const storedUser = locallyRegisteredUsers.get(email);

    if (storedUser && storedUser.passwordHash === passwordInput) { // Plain text password check for demo
      const appUser: User = {
        uid: storedUser.uid,
        email: storedUser.email,
        displayName: storedUser.name,
      };
      setCurrentUser(appUser);
      setIsLoggedIn(true);
      alert('Login realizado com sucesso (simulado)!');
      setCurrentScreen(Screen.TelaOpcoes);
      return true;
    } else {
      return "E-mail ou senha inválidos (simulado).";
    }
  };

  const handleForgotPasswordRequest = async (email: string): Promise<string | boolean> => {
    console.log("--- LOCAL FORGOT PASSWORD ATTEMPT ---", { email });
    if (locallyRegisteredUsers.has(email) || Array.from(locallyRegisteredUsers.values()).some(u => u.email === email)) {
        alert(`Um e-mail de redefinição de senha foi enviado para ${email} (simulado).`);
        return true;
    }
    return "E-mail não encontrado (simulado).";
  };

  const handleLogout = async () => {
    console.log("--- LOCAL LOGOUT ---");
    setCurrentUser(null);
    setIsLoggedIn(false);
    setSelectedContract(null); 
    setMediaCaptureContext(null);
    setIssueToReport(null);
    clearCapturedMedia();
    setCurrentScreen(Screen.TelaInicial);
  };
  
  const handleOcorrenciaSubmit = (data: OcorrenciaData) => {
    console.log("Ocorrência Submetida (local simulation):", data);
    if(data.photo) {
      console.log("Photo to upload (simulated):", data.photo.name);
    }
    setIssueToReport(null); 
    alert('Ocorrência registrada com sucesso! (Simulado)');
    if (selectedContract) { 
      setCurrentScreen(Screen.TelaDetalheContrato);
    } else {
      setCurrentScreen(Screen.TelaOpcoes);
    }
  };

  const viewContractDetails = (contract: Contract) => {
    setContractDetailBackTarget(Screen.TelaHistoricoContratos);
    setSelectedContract(contract);
    setCurrentScreen(Screen.TelaDetalheContrato);
  };
  
  const handleViewContractDetailsFromAgenda = (contractToView: Contract) => {
    setContractDetailBackTarget(Screen.TelaAgenda);
    setSelectedContract(contractToView);
    setCurrentScreen(Screen.TelaDetalheContrato);
  };

  const handleItemStatusChange = (contractId: string, itemCod: string, newStatus: boolean) => {
    let protocolGeneratedMessage = "";
    
    const updatedContracts = contracts.map(c => {
      if (c.id === contractId) {
        const updatedItens = c.itens.map(item => {
          if (item.cod === itemCod) {
            let protocoloGerado = item.protocoloGerado;
            if (newStatus === false) { 
              if (!protocoloGerado) {
                protocoloGerado = `PROT-${c.numeroContrato}-${item.cod}-${Date.now().toString().slice(-6)}`;
                protocolGeneratedMessage = `Item "${item.ambiente}" marcado como PENDENTE. Protocolo gerado: ${protocoloGerado}.`;
              } else {
                 protocolGeneratedMessage = `Item "${item.ambiente}" continua PENDENTE. Protocolo existente: ${protocoloGerado}.`;
              }
            } else { 
              if (protocoloGerado) {
                protocolGeneratedMessage = `Item "${item.ambiente}" marcado como OK. Protocolo ${protocoloGerado} removido pois o item não está mais pendente.`;
                protocoloGerado = undefined; 
              } else {
                protocolGeneratedMessage = `Item "${item.ambiente}" marcado como OK.`;
              }
            }
            return { ...item, itensOk: newStatus, protocoloGerado };
          }
          return item;
        });
        return { ...c, itens: updatedItens };
      }
      return c;
    });
    setContracts(updatedContracts);

    const newlyUpdatedContract = updatedContracts.find(c => c.id === contractId);
    if (newlyUpdatedContract) {
        setSelectedContract(newlyUpdatedContract);
    }

    if(protocolGeneratedMessage) alert(protocolGeneratedMessage);
  };

  const handleFinalizeVerification = (contractId: string) => {
    setContracts(currentContracts => {
        const contractToProcess = currentContracts.find(c => c.id === contractId);
    
        if (!contractToProcess) {
            console.error("Contract not found for final verification:", contractId);
            alert("Erro: Não foi possível encontrar os dados do contrato para continuar. Retornando ao histórico.");
            setSelectedContract(null);
            setCurrentScreen(Screen.TelaHistoricoContratos);
            return currentContracts; 
        }
        
        setSelectedContract(contractToProcess); 

        const firstNaoItem = contractToProcess.itens.find(item => item.itensOk === false);

        if (firstNaoItem) {
            // If an item requires media, set the context and ensure the signature screen's
            // back button will return to the capture screen.
            setMediaCaptureContext({ 
                contractId: contractId, 
                itemCod: firstNaoItem.cod, 
                ambienteName: firstNaoItem.ambiente 
            });
            setSignatureBackTarget(Screen.TelaCaptura);
            setCurrentScreen(Screen.TelaCaptura);
        } else {
            // If no media is required, proceed directly to signature, and ensure the back
            // button returns to the contract details screen.
            setMediaCaptureContext(null);
            setSignatureBackTarget(Screen.TelaDetalheContrato);
            setCurrentScreen(Screen.TelaAssinatura);
        }

        return currentContracts;
    });
  };
  
 const handleMediaSubmittedForItem = (processedContractId: string, processedItemCod: string, files: File[]) => {
    console.log(`Media submitted for contract ${processedContractId}, item ${processedItemCod}:`, files.length, "files (simulated upload)");

    // Find the contract again just to show a relevant alert message.
    // The main `contracts` state is not mutated here.
    const contractForMedia = contracts.find(c => c.id === processedContractId);
    if (!contractForMedia) {
        console.error("Contract not found during media submission. Cannot proceed. Contract ID:", processedContractId);
        alert("Erro: Não foi possível encontrar os dados do contrato após o envio da mídia. Retornando ao histórico.");
        setCurrentScreen(Screen.TelaHistoricoContratos);
        return;
    }
  
    const itemForMedia = contractForMedia.itens.find(item => item.cod === processedItemCod);
    alert(`Mídia registrada para o item "${itemForMedia?.ambiente || 'Desconhecido'}" (Cód: ${processedItemCod}). Protocolo: ${itemForMedia?.protocoloGerado || 'N/A'}. (Simulado)`);
      
    // The signatureBackTarget has already been set correctly in handleFinalizeVerification.
    // We can now safely proceed to the signature screen.
    setCurrentScreen(Screen.TelaAssinatura);
  };

  const handleGenericMediaSubmitted = (files: File[]) => {
    console.log("Generic media captured (simulated):", files);
    alert(`${files.length} arquivo(s) de mídia pronto(s) para envio! (Simulado)`);
    setCurrentScreen(Screen.TelaOpcoes); 
  };

  const handleFinalizeContract = (
    contractId: string, 
    signatureUrl: string, 
    signerName: string, 
    signerCpf: string,
    documentPhotos: File[]
  ) => {
    console.log("Finalizing contract (local simulation):", {contractId, signerName, signerCpf, documentPhotoCount: documentPhotos.length});
    
    // The flow is complete, clear any related contexts
    setMediaCaptureContext(null);
    clearCapturedMedia();

    const simulatedDocumentPhotoUrls = documentPhotos.map((photo, index) => {
      const url = `simulated_local_path/contracts/${contractId}/documents/doc_${index + 1}_${photo.name}`;
      console.log(`Simulated document photo URL: ${url}`);
      return url;
    });

    let finalizedContract: Contract | undefined;

    setContracts(prevContracts => {
      const updated = prevContracts.map(c => {
        if (c.id === contractId) {
          const pendingItemsForContract = c.itens
            .filter(item => !item.itensOk) 
            .map(item => ({
              cod: item.cod,
              ambiente: item.ambiente,
              descricao: item.itensVerificados, 
              protocoloGerado: item.protocoloGerado 
            }));

          finalizedContract = {
            ...c,
            assinaturaUrl: signatureUrl, 
            nomeCompletoAssinatura: signerName,
            cpfAssinatura: signerCpf,
            dataHoraAssinatura: new Date().toLocaleString('pt-BR'),
            documentPhotoUrls: simulatedDocumentPhotoUrls,
            itensPendentes: pendingItemsForContract, 
          };
          return finalizedContract;
        }
        return c;
      });
      return updated;
    });

     if (finalizedContract) {
        setSelectedContract(finalizedContract);
    }

    let alertMessage = 'Contrato finalizado e assinado com sucesso! (Simulado)';
    if (documentPhotos.length > 0) {
      alertMessage += ` ${documentPhotos.length} foto(s) do documento anexada(s) (simulação).`;
    }
    alert(alertMessage);
    setCurrentScreen(Screen.TelaHistoricoContratos); 
  };

  const handleReportIssueForItem = (item: ContractItemDetail) => {
    setIssueToReport(item);
    setCurrentScreen(Screen.TelaOcorrencia);
  };

  const renderScreen = () => {
    console.log('--- APP renderScreen --- Current Screen:', Screen[currentScreen], 'Logged In:', isLoggedIn, 'Auth Initialized:', authInitialized, 'Current Time:', new Date().toLocaleTimeString());
    
    if (currentScreen === Screen.TelaSplash || !authInitialized) {
      return <TelaSplash />;
    }

    if (!isLoggedIn) {
      switch (currentScreen) {
        case Screen.TelaInicial:
          return <TelaInicial setCurrentScreen={setCurrentScreen} />;
        case Screen.TelaNovoUsuario:
          const novoUsuarioProps: TelaNovoUsuarioProps = {
            setCurrentScreen,
            onRegister: handleRegister,
          };
          return <TelaNovoUsuario {...novoUsuarioProps} />;
        case Screen.TelaLogin:
          const loginProps: TelaLoginProps = {
            setCurrentScreen,
            onLoginAttempt: handleLoginAttempt,
            onForgotPasswordRequest: handleForgotPasswordRequest,
          };
          return <TelaLogin {...loginProps} />;
        default: 
          console.warn('--- APP RENDER FALLBACK (not logged in) --- Redirecting to TelaInicial. Current Screen was:', Screen[currentScreen]);
          setCurrentScreen(Screen.TelaInicial); 
          return <TelaInicial setCurrentScreen={setCurrentScreen} />;
      }
    }

    // User is logged in
    switch (currentScreen) {
      case Screen.TelaOpcoes:
        return <TelaOpcoes setCurrentScreen={setCurrentScreen} onLogout={handleLogout} userFullName={currentUser?.displayName || currentUser?.email || undefined} />;
      case Screen.TelaCaptura:
        const contractForCapture = mediaCaptureContext && selectedContract && mediaCaptureContext.contractId === selectedContract.id 
                                   ? selectedContract 
                                   : (mediaCaptureContext ? contracts.find(c => c.id === mediaCaptureContext.contractId) : null);
        const capturaProps: TelaCapturaProps = {
            setCurrentScreen,
            onLogout: handleLogout,
            forItem: mediaCaptureContext,
            contract: contractForCapture,
            onMediaSubmittedForItem: handleMediaSubmittedForItem,
            onGenericMediaSubmitted: !mediaCaptureContext ? handleGenericMediaSubmitted : undefined,
            capturedMedia: capturedMedia,
            onMediaChange: handleMediaChange,
        };
        return <TelaCaptura {...capturaProps} />;
      case Screen.TelaAssinatura:
        if (selectedContract) {
            const assinaturaProps: TelaAssinaturaProps = {
                setCurrentScreen,
                onLogout: handleLogout,
                contract: selectedContract,
                onFinalizeContract: handleFinalizeContract,
                backNavigationTarget: signatureBackTarget,
            };
            return <TelaAssinatura {...assinaturaProps} />;
        }
        alert("Erro: Nenhum contrato selecionado para assinatura. Retornando ao histórico.");
        console.error("TelaAssinatura: selectedContract is null or undefined.");
        setCurrentScreen(Screen.TelaHistoricoContratos);
        return <TelaHistoricoContratos setCurrentScreen={setCurrentScreen} contracts={contracts} onViewContract={viewContractDetails} onLogout={handleLogout} />;
      case Screen.TelaOcorrencia:
        const ocorrenciaProps = {
            setCurrentScreen,
            itemComProblema: issueToReport,
            contract: selectedContract, 
            onOcorrenciaSubmit: handleOcorrenciaSubmit,
            onLogout: handleLogout
        };
        return <TelaOcorrencia {...ocorrenciaProps} />;
      case Screen.TelaHistoricoContratos:
        return <TelaHistoricoContratos setCurrentScreen={setCurrentScreen} contracts={contracts} onViewContract={viewContractDetails} onLogout={handleLogout} />;
      case Screen.TelaDetalheContrato:
        if (selectedContract) {
          const detailProps: TelaDetalheContratoProps = {
            setCurrentScreen,
            contract: selectedContract,
            onLogout: handleLogout, 
            onItemStatusChange: handleItemStatusChange,
            onFinalizeVerification: handleFinalizeVerification,
            onReportIssueForItem: handleReportIssueForItem, 
            backNavigationTarget: contractDetailBackTarget,
          };
          return <TelaDetalheContrato {...detailProps} />;
        }
        alert("Erro: Nenhum contrato selecionado para ver detalhes. Retornando ao histórico.");
        console.error("TelaDetalheContrato: selectedContract is null or undefined.");
        setCurrentScreen(Screen.TelaHistoricoContratos); 
        return <TelaHistoricoContratos setCurrentScreen={setCurrentScreen} contracts={contracts} onViewContract={viewContractDetails} onLogout={handleLogout} />;
      case Screen.TelaAgenda: 
        const agendaProps: TelaAgendaProps = {
            setCurrentScreen,
            onLogout: handleLogout,
            contracts: contracts, 
            onViewContractDetailsFromAgenda: handleViewContractDetailsFromAgenda,
        };
        return <TelaAgenda {...agendaProps} />;
      case Screen.TelaInicial: 
      case Screen.TelaLogin:    
      case Screen.TelaNovoUsuario: 
        setCurrentScreen(Screen.TelaOpcoes);
        return <TelaOpcoes setCurrentScreen={setCurrentScreen} onLogout={handleLogout} userFullName={currentUser?.displayName || currentUser?.email || undefined} />;
      default:
        console.warn('--- APP RENDER FALLBACK (logged in) --- Redirecting to TelaOpcoes. Current Screen was:', Screen[currentScreen]);
        setCurrentScreen(Screen.TelaOpcoes); 
        return <TelaOpcoes setCurrentScreen={setCurrentScreen} onLogout={handleLogout} userFullName={currentUser?.displayName || currentUser?.email || undefined} />;
    }
  };

  return (
    <div 
      className="flex-grow flex flex-col"
      style={{ 
        backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh' 
      }} 
    >
      {renderScreen()}
    </div>
  );
};

export default App;