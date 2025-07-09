

export enum Screen {
  TelaSplash,
  TelaInicial,
  TelaNovoUsuario,
  TelaLogin,
  TelaOpcoes,
  TelaCaptura,
  TelaAssinatura,
  TelaOcorrencia,
  TelaHistoricoContratos, // New screen for contract history
  TelaDetalheContrato,    // New screen for contract details
  TelaAgenda,              // New screen for Calendar/Agenda
  // TelaCriarConta removed
}

export interface ChecklistItem {
  id: string;
  label: string;
  satisfied: boolean;
}

export interface OcorrenciaData {
  itemId: string;
  itemLabel: string;
  description: string;
  photo?: File | null; // In Firestore, this would become a URL string
}

// Updated User interface to align with Firebase User
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  // photoURL?: string | null; // Optional, can be added if needed
}

// Interface for individual items within a contract (e.g., Cozinha, Closet)
export interface ContractItemDetail {
  cod: string; // Assuming 'cod' is unique within a contract's items
  ambiente: string;
  itensVerificados: string;
  itensOk: boolean | undefined; // Changed to allow undefined for unselected state
  protocoloGerado?: string; // To store the protocol number if item is marked "NÃO"
  // mediaUrls?: string[]; // For Firestore: to store URLs of photos/videos for this item
}

// Added based on user request to hold payment details
export interface Pagamento {
  primeiraParcela: number;
  segundaParcela: number;
  valorTotal: number;
}

// Interface for the full contract data
export interface Contract {
  id: string; // Unique identifier for the contract
  dataContrato: string;
  inicioMontagem: string;
  nomeContrato: string;
  numeroContrato: string;
  finalMontagem: string;
  tecnicoResponsavel: string;
  responsavelEntregaMontagem: string;
  telefone: string;
  enderecoEntrega: {
    rua: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  itens: ContractItemDetail[];
  declaracao: string;
  dataHoraAssinatura?: string;
  nomeCompletoAssinatura?: string;
  cpfAssinatura?: string;
  assinaturaUrl?: string; // URL or base64 string for the signature image. For Firestore, this will be a URL from Firebase Storage.
  documentPhotoUrls?: string[]; // Optional URLs for the attached document photos
  geradoEm: string;
  paginaInfo: string; // e.g., "1/2"
  
  // This seems to be missing from the provided file but is used in the code
  itensPendentes?: {
    cod: string;
    ambiente: string;
    descricao: string;
    protocoloGerado?: string;
  }[];

  // Added based on user request
  pagamento?: Pagamento;
}

// These props are used throughout the app but were missing from the incomplete types.ts file.
// Including them here for completeness, although they are not part of the user's direct change request.
export interface TelaNovoUsuarioProps {
  setCurrentScreen: (screen: Screen) => void;
  onRegister: (name: string, email: string, passwordInput: string) => Promise<string | boolean>;
}

export interface TelaLoginProps {
  setCurrentScreen: (screen: Screen) => void;
  onLoginAttempt: (email: string, passwordInput: string) => Promise<string | boolean>;
  onForgotPasswordRequest?: (email: string) => Promise<string | boolean>;
}

export interface TelaCapturaProps {
  setCurrentScreen: (screen: Screen) => void;
  onLogout: () => void;
  forItem?: { contractId: string, itemCod: string, ambienteName: string } | null;
  contract: Contract | null | undefined;
  onMediaSubmittedForItem?: (contractId: string, itemCod: string, files: File[]) => void;
  onGenericMediaSubmitted?: (files: File[]) => void;
  capturedMedia: { perto: File | null; longe: File | null; video: File | null; };
  onMediaChange: (type: 'perto' | 'longe' | 'video', file: File | null) => void;
}

export interface TelaAssinaturaProps {
    setCurrentScreen: (screen: Screen) => void;
    onLogout: () => void;
    contract: Contract;
    onFinalizeContract: (contractId: string, signatureUrl: string, signerName: string, signerCpf: string, documentPhotos: File[]) => void;
    backNavigationTarget: Screen;
}

export interface TelaOcorrenciaProps {
    setCurrentScreen: (screen: Screen) => void;
    itemComProblema: ContractItemDetail | null;
    contract: Contract | null;
    onOcorrenciaSubmit: (data: OcorrenciaData) => void;
    onLogout: () => void;
}

export interface TelaDetalheContratoProps {
  setCurrentScreen: (screen: Screen) => void;
  contract: Contract;
  onLogout: () => void;
  onItemStatusChange: (contractId: string, itemCod: string, newStatus: boolean) => void;
  onFinalizeVerification: (contractId: string) => void;
  onReportIssueForItem: (item: ContractItemDetail) => void;
  backNavigationTarget: Screen;
}

export interface TelaAgendaProps {
  setCurrentScreen: (screen: Screen) => void;
  onLogout: () => void;
  contracts: Contract[];
  onViewContractDetailsFromAgenda: (contractToView: Contract) => void;
}