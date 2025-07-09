import { ChecklistItem, Contract } from './types';

export const APP_NAME = "RENZA Planejados";
// Updated background image URL to the new user-provided link
export const BACKGROUND_IMAGE_URL = "https://i.ibb.co/RkVrc3vw/Background-Renza-1.png";
// Re-instating the logo URL constant based on the user's request to add the logo back.
// Using the last valid URL provided by the user.
export const LOGO_IMAGE_URL = "https://i.ibb.co/mr2LbjFK/RENZA-PLANEJADOS.png";

export const INITIAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'montagem_completa', label: 'Montagem completa e correta', satisfied: true },
  { id: 'sem_danos', label: 'Sem danos aparentes no móvel', satisfied: true },
  { id: 'local_limpo', label: 'Local limpo após a montagem', satisfied: true },
  { id: 'documentacao_entregue', label: 'Documentação e manuais entregues', satisfied: true },
  { id: 'cliente_orientado', label: 'Cliente orientado sobre uso e cuidados', satisfied: true },
];

const STANDARD_ITENS_VERIFICADOS = 'ABERTURA DE PORTAS E GAVETAS, E SUAS DEVIDAS REGULAGENS, PUXADORES E/OU FECHO TOQUE, EXTERNO E INTERNO DOS MÓVEL, FURAÇÕES NECESSÁRIAS NO MÓVEL E PASSAGENS DE CABOS EM GERAL.';
const STANDARD_DECLARACAO = 'DECLARO PARA OS DEVIDOS FINS E EFEITOS, QUE OS AMBIENTES LISTADOS NESTE TERMO DE ENTREGA, QUE ESTÃO IDENTIFICADOS NA LISTAGEM ACIMA COMO "SIM" NA COLUNA "ITENS OK", ESTÃO EM CONDIÇÕES ADEQUADAS E FORAM ENTREGUES DE ACORDO COM O CONTRATO, CONFORME CONSTA NAS ESPECIFICAÇÕES E IMAGENS, SEM APRESENTAR QUALQUER DEFEITO OU VÍCIO DO PRODUTO. OS AMBIENTES QUE ESTÃO IDENTIFICADOS NA LISTAGEM ACIMA COMO "NÃO" NA COLUNA "ITENS OK", DEVEM ESTAR LISTADOS NO DESCRITIVO DE ITENS PENDENTES.';

export const SAMPLE_CONTRACTS: Contract[] = [
  {
    id: 'contrato_001',
    dataContrato: '04/03/2024',
    inicioMontagem: '06/05/2024 - M',
    nomeContrato: 'TIAGO MACHADO',
    numeroContrato: '14838509999',
    finalMontagem: '10/05/2024',
    tecnicoResponsavel: 'SERGIO',
    responsavelEntregaMontagem: 'TIAGO MACHADO',
    telefone: '(51) 99125-9999',
    enderecoEntrega: {
      rua: 'RUA BRASIL',
      bairro: 'CENTRO',
      cidade: 'SÃO LEOPOLDO',
      uf: 'RS',
      cep: '92120-999',
    },
    itens: [
      {
        cod: 'AA',
        ambiente: 'COZINHA',
        itensVerificados: STANDARD_ITENS_VERIFICADOS,
        itensOk: true, // Finalized contract, keep boolean
      },
      {
        cod: 'AB',
        ambiente: 'HOME THEATER',
        itensVerificados: STANDARD_ITENS_VERIFICADOS,
        itensOk: true, // Finalized contract, keep boolean
      },
      {
        cod: 'AC',
        ambiente: 'CLOSET',
        itensVerificados: STANDARD_ITENS_VERIFICADOS,
        itensOk: false, // Finalized contract, keep boolean
      },
    ],
    declaracao: STANDARD_DECLARACAO,
    dataHoraAssinatura: '26/03/2025 15:30',
    nomeCompletoAssinatura: 'TIAGO MACHADO CLIENTE',
    cpfAssinatura: '123.456.789-00',
    assinaturaUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAACgRRKpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHySURBVHhe7dNPCsJAFIXhGU7qD5vVj7epX6+hpL241V1IKJMQE/kHsyEJAvNMJAnz7/OEJwZNVN2M1J0xP2yG7vY0j2b2us5Zt3GZjc7sT6rM+0dG9D23b3scH1L924uS5zZ7Zc+k+B/xgEAgCEBACAEAIKBAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEQCAICAEAIIRAIwkO/2x/u7yZtYf1u8M2/qP0KkL2pCpg/0PUAAAAASUVORK5CYII=', // Updated with a visible sample signature
    geradoEm: 'GERADO EM 26/03/2025 ÀS 16:06',
    paginaInfo: '1/2',
    itensPendentes: [
      { cod: 'AC', ambiente: "CLOSET", descricao: "Porta do armário desalinhada, necessita ajuste."}
    ],
    pagamento: {
      primeiraParcela: 1500.00,
      segundaParcela: 1000.50,
      valorTotal: 2500.50,
    }
  },
  {
    id: 'contrato_002',
    dataContrato: '15/01/2024',
    inicioMontagem: '01/02/2024 - M',
    nomeContrato: 'MARIA SILVA',
    numeroContrato: '14838509222',
    finalMontagem: '05/02/2024',
    tecnicoResponsavel: 'JOÃO PEREIRA',
    responsavelEntregaMontagem: 'MARIA SILVA',
    telefone: '(11) 98877-6655',
    enderecoEntrega: {
      rua: 'AV PAULISTA, 1000',
      bairro: 'BELA VISTA',
      cidade: 'SÃO PAULO',
      uf: 'SP',
      cep: '01310-100',
    },
    itens: [
      {
        cod: 'DA',
        ambiente: 'DORMITÓRIO CASAL',
        itensVerificados: STANDARD_ITENS_VERIFICADOS,
        itensOk: true, // Finalized contract, keep boolean
      },
      {
        cod: 'DB',
        ambiente: 'ESCRITÓRIO',
        itensVerificados: STANDARD_ITENS_VERIFICADOS,
        itensOk: true, // Finalized contract, keep boolean
      },
    ],
    declaracao: STANDARD_DECLARACAO,
    dataHoraAssinatura: '05/02/2024 18:00',
    nomeCompletoAssinatura: 'MARIA SILVA CLIENTE',
    cpfAssinatura: '987.654.321-00',
    assinaturaUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAACgRRKpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHySURBVHhe7dNPCsJAFIXhGU7qD5vVj7epX6+hpL241V1IKJMQE/kHsyEJAvNMJAnz7/OEJwZNVN2M1J0xP2yG7vY0j2b2us5Zt3GZjc7sT6rM+0dG9D23b3scH1L924uS5zZ7Zc+k+B/xgEAgCEBACAEAIKBAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEQCAICAEAIIRAIwkO/2x/u7yZtYf1u8M2/qP0KkL2pCpg/0PUAAAAASUVORK5CYII=', // Provide a sample signature to mark as finalized
    geradoEm: 'GERADO EM 05/02/2024 ÀS 18:05',
    paginaInfo: '1/1',
    itensPendentes: [], // Explicitly empty for no pending items
    pagamento: {
      primeiraParcela: 2000.00,
      segundaParcela: 1500.00,
      valorTotal: 3500.00,
    }
  },
  {
    id: 'contrato_003',
    dataContrato: '31/05/2025',
    inicioMontagem: '07/07/2025 - M',
    nomeContrato: 'VIVIAN RIBEIRO SANDER',
    numeroContrato: '14838502891',
    finalMontagem: '24/07/2025',
    tecnicoResponsavel: 'HILTON',
    responsavelEntregaMontagem: 'VIVIAN RIBeiro SANDER',
    telefone: '(51) 99335-2920',
    enderecoEntrega: {
      rua: 'RUA BELGICA, 175',
      bairro: 'MARECHAL RONDON',
      cidade: 'CANOAS',
      uf: 'RS',
      cep: '92022075',
    },
    itens: [
      { cod: 'AA', ambiente: 'COZINHA', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
      { cod: 'AB', ambiente: 'HOME THEATER', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
      { cod: 'AC', ambiente: 'LAVABO', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
      { cod: 'AD', ambiente: 'OFFICE', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
      { cod: 'AE', ambiente: 'DORMIT SUITE', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
      { cod: 'AF', ambiente: 'BANHO SUITE', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
      { cod: 'AG', ambiente: 'DORMIT MARTINA', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
      { cod: 'AH', ambiente: 'DORMIT CATARINA', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
      { cod: 'AI', ambiente: 'BANHO SOCIAL', itensVerificados: STANDARD_ITENS_VERIFICADOS, itensOk: undefined },
    ],
    declaracao: STANDARD_DECLARACAO,
    dataHoraAssinatura: undefined,
    nomeCompletoAssinatura: undefined,
    cpfAssinatura: undefined,
    assinaturaUrl: undefined,
    geradoEm: 'GERADO EM 02/06/2025 ÀS 18:24',
    paginaInfo: '1/1',
    itensPendentes: [],
    pagamento: {
      primeiraParcela: 5000.00,
      segundaParcela: 4500.00,
      valorTotal: 9500.00,
    }
  }
];
