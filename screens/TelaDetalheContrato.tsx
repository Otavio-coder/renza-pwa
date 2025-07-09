
import React, { useState, useEffect, useRef } from 'react';
import { Screen, Contract, TelaDetalheContratoProps, ContractItemDetail } from '../types';
import Button from '../components/Button';
import Logo from '../components/Logo'; 
import jsPDF from 'jspdf';
import { LOGO_IMAGE_URL } from '../constants';

const toDataURL = (url: string) => fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
    })
    .then(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    }));

const COMPANY_DETAILS = {
  NAME: "GONÇALVES & GROFF LTDA",
  CNPJ: "28.942.011/0001-00",
  FONE: "51 3922-2001",
  ENDERECO_LINHA1: "Av. Farroupilha, 4398",
  ENDERECO_LINHA2: "Bairro Marechal Rondon",
  ENDERECO_LINHA3: "Canoas - RS"
};


const TelaDetalheContrato: React.FC<TelaDetalheContratoProps> = ({
  setCurrentScreen,
  contract,
  onLogout,
  onItemStatusChange,
  onFinalizeVerification,
  onReportIssueForItem,
  backNavigationTarget 
}) => {
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const prevContractIdRef = useRef<string | undefined>(undefined);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);

  const isFinalized = !!contract.assinaturaUrl;

  // Determine if all items have been marked SIM or NÃO
  const allItemsMarked = contract.itens.length === 0 || contract.itens.every(item => typeof item.itensOk === 'boolean');


  useEffect(() => {
    // This effect ensures the view scrolls to the top when a new contract is loaded.
    if (contract.id !== prevContractIdRef.current) {
      if (scrollableContainerRef.current) {
        scrollableContainerRef.current.scrollTop = 0;
      }
    }
    prevContractIdRef.current = contract.id;
    
    // Fetch logo for PDF generation
    let isMounted = true;
    if (LOGO_IMAGE_URL) {
      toDataURL(LOGO_IMAGE_URL)
        .then(dataUrl => {
          if (isMounted) setLogoDataUrl(dataUrl);
        })
        .catch(error => {
          console.error('Error fetching logo for PDF:', error);
          if (isMounted) setLogoDataUrl(null); // Fallback
        });
    } else {
      setLogoDataUrl(null);
    }
    return () => { isMounted = false; };

  }, [contract.id]);

  const handleItemInteraction = (itemCod: string, newStatus: boolean) => {
    if (isFinalized) return; 
    // onItemStatusChange will handle protocol generation. No navigation from here.
    onItemStatusChange(contract.id, itemCod, newStatus);
  };
  
  const handleFinalizeVerificationClick = () => {
    if (isFinalized) return;

    if (contract.itens.length > 0 && !allItemsMarked) {
        alert("Por favor, marque \"SIM\" ou \"NÃO\" para todos os itens antes de prosseguir.");
        return;
    }
    // App.tsx's onFinalizeVerification will handle navigation to TelaCaptura or TelaAssinatura
    onFinalizeVerification(contract.id);
  };
  

  const drawCommonPdfHeader = (doc: jsPDF, currentYPos: number, currentContract: Contract): number => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 7;
    let yPos = currentYPos;

    // --- Section 1: Company Details and Logo ---
    const sectionTopY = yPos;
    
    if (logoDataUrl) {
      try {
          const imgProps = doc.getImageProperties(logoDataUrl);
          const logoHeight = 18;
          const logoWidth = (imgProps.width * logoHeight) / imgProps.height;
          doc.addImage(logoDataUrl, 'PNG', margin, yPos, logoWidth, logoHeight);
      } catch (e) {
          console.error("Error adding logo to PDF, skipping.", e);
      }
    }
    
    doc.setFontSize(6.5);
    const companyDetailsX = pageWidth - margin - 45; 
    let companyY = sectionTopY; 
    doc.setFont(undefined, 'bold').text(COMPANY_DETAILS.NAME, companyDetailsX, companyY, { align: 'left', maxWidth: 40 }); companyY += 2.5;
    doc.setFont(undefined, 'normal');
    doc.text(`CNPJ ${COMPANY_DETAILS.CNPJ}`, companyDetailsX, companyY, { align: 'left', maxWidth: 40 }); companyY += 2.5;
    doc.text(`Fone: ${COMPANY_DETAILS.FONE}`, companyDetailsX, companyY, { align: 'left', maxWidth: 40 }); companyY += 2.5;
    doc.text(COMPANY_DETAILS.ENDERECO_LINHA1, companyDetailsX, companyY, { align: 'left', maxWidth: 40 }); companyY += 2.5;
    doc.text(COMPANY_DETAILS.ENDERECO_LINHA2, companyDetailsX, companyY, { align: 'left', maxWidth: 40 }); companyY += 2.5;
    doc.text(COMPANY_DETAILS.ENDERECO_LINHA3, companyDetailsX, companyY, { align: 'left', maxWidth: 40 });
    
    yPos = sectionTopY + 18 + 4; // Use fixed height for consistent layout


    // --- Section 2: Header Boxes ---
    const contentWidth = pageWidth - 2 * margin;
    const headerBoxHeight = 8;
    const colWidthThird = contentWidth / 3;

    doc.rect(margin, yPos, colWidthThird, headerBoxHeight);
    doc.setFontSize(6).text("DATA DO CONTRATO", margin + 1, yPos + 2.5);
    doc.setFontSize(8).text(currentContract.dataContrato || '', margin + colWidthThird / 2, yPos + 6, { align: 'center' });

    doc.rect(margin + colWidthThird, yPos, colWidthThird, headerBoxHeight);
    doc.setFontSize(7).setFont(undefined, 'bold');
    doc.text("TERMO DE ENTREGA - MÓVEIS PLANEJADOS", margin + colWidthThird + colWidthThird / 2, yPos + 4.5, { align: 'center', maxWidth: colWidthThird - 2 });
    doc.setFont(undefined, 'normal');

    doc.rect(margin + 2 * colWidthThird, yPos, colWidthThird, headerBoxHeight);
    doc.setFontSize(6).text("INÍCIO DA MONTAGEM", margin + 2 * colWidthThird + 1, yPos + 2.5);
    doc.setFontSize(8).text(currentContract.inicioMontagem || '', margin + 2 * colWidthThird + colWidthThird / 2, yPos + 6, { align: 'center' });
    yPos += headerBoxHeight;

    // --- Section 3: Contract Info Block ---
    const fieldHeightSmall = 7; 
    const labelOffsetY = 2; 
    const valueOffsetY = 5;  
    
    const infoCol1 = contentWidth * 0.45, infoCol2 = contentWidth * 0.18, infoCol3 = contentWidth * 0.18, infoCol4 = contentWidth * 0.19;
    doc.setFontSize(6);
    doc.rect(margin, yPos, infoCol1, fieldHeightSmall); doc.text("NOME CONTRATO", margin + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.nomeContrato || '', margin + 1, yPos + valueOffsetY, {maxWidth: infoCol1 - 2}); 
    doc.rect(margin + infoCol1, yPos, infoCol2, fieldHeightSmall); doc.setFontSize(6).text("CONTRATO Nº", margin + infoCol1 + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.numeroContrato || '', margin + infoCol1 + 1, yPos + valueOffsetY, {maxWidth: infoCol2-2}); 
    doc.rect(margin + infoCol1 + infoCol2, yPos, infoCol3, fieldHeightSmall); doc.setFontSize(6).text("FINAL MONTAGEM", margin + infoCol1 + infoCol2 + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.finalMontagem || '', margin + infoCol1 + infoCol2 + 1, yPos + valueOffsetY, {maxWidth: infoCol3-2});
    doc.rect(margin + infoCol1 + infoCol2 + infoCol3, yPos, infoCol4, fieldHeightSmall); doc.setFontSize(6).text("TÉCNICO RESPONSÁVEL", margin + infoCol1 + infoCol2 + infoCol3 + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.tecnicoResponsavel || '', margin + infoCol1 + infoCol2 + infoCol3 + 1, yPos + valueOffsetY, {maxWidth: infoCol4-2});
    yPos += fieldHeightSmall;

    doc.rect(margin, yPos, infoCol1, fieldHeightSmall); doc.setFontSize(6).text("RESPONSÁVEL P/ ENTREGA E MONTAGEM", margin + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.responsavelEntregaMontagem || '', margin + 1, yPos + valueOffsetY, {maxWidth: infoCol1 - 2});
    doc.rect(margin + infoCol1, yPos, infoCol2 + infoCol3, fieldHeightSmall); 
    doc.rect(margin + infoCol1 + infoCol2 + infoCol3, yPos, infoCol4, fieldHeightSmall); doc.setFontSize(6).text("TELEFONE", margin + infoCol1 + infoCol2 + infoCol3 + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.telefone || '', margin + infoCol1 + infoCol2 + infoCol3 + 1, yPos + valueOffsetY, {maxWidth: infoCol4-2});
    yPos += fieldHeightSmall;
    
    doc.rect(margin, yPos, contentWidth, fieldHeightSmall); doc.setFontSize(6).text("ENDEREÇO DE ENTREGA", margin + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.enderecoEntrega?.rua || '', margin + 1, yPos + valueOffsetY, {maxWidth: contentWidth -2});
    yPos += fieldHeightSmall;

    const addrCol1 = contentWidth * 0.45, addrCol2 = contentWidth * 0.25, addrCol3 = contentWidth * 0.08, addrCol4 = contentWidth * 0.22;
    doc.rect(margin, yPos, addrCol1, fieldHeightSmall); doc.setFontSize(6).text("BAIRRO", margin + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.enderecoEntrega?.bairro || '', margin + 1, yPos + valueOffsetY, {maxWidth: addrCol1 -2});
    doc.rect(margin + addrCol1, yPos, addrCol2, fieldHeightSmall); doc.setFontSize(6).text("CIDADE", margin + addrCol1 + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.enderecoEntrega?.cidade || '', margin + addrCol1 + 1, yPos + valueOffsetY, {maxWidth: addrCol2 -2});
    doc.rect(margin + addrCol1 + addrCol2, yPos, addrCol3, fieldHeightSmall); doc.setFontSize(6).text("UF", margin + addrCol1 + addrCol2 + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.enderecoEntrega?.uf || '', margin + addrCol1 + addrCol2 + 1, yPos + valueOffsetY, {maxWidth: addrCol3 -2});
    doc.rect(margin + addrCol1 + addrCol2 + addrCol3, yPos, addrCol4, fieldHeightSmall); doc.setFontSize(6).text("CEP", margin + addrCol1 + addrCol2 + addrCol3 + 1, yPos + labelOffsetY);
    doc.setFontSize(7.5).text(currentContract.enderecoEntrega?.cep || '', margin + addrCol1 + addrCol2 + addrCol3 + 1, yPos + valueOffsetY, {maxWidth: addrCol4 -2});
    yPos += fieldHeightSmall + 1;

    return yPos;
  };


  const handlePdfDownload = async () => {
    if (!contract) {
      alert("Nenhum contrato selecionado para gerar PDF.");
      return;
    }
    
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 7;
    const contentWidth = pageWidth - 2 * margin;
    const lineThickness = 0.2; 
    doc.setLineWidth(lineThickness);
    let yPos = margin;

    // --- PAGE 1 ---
    yPos = drawCommonPdfHeader(doc, yPos, contract);
    
    // --- Section 4: Items Table (Page 1) ---
    const tableColWidths = [contentWidth * 0.07, contentWidth * 0.23, contentWidth * 0.55, contentWidth * 0.15];
    const tableHeadersPage1 = ["CÓD", "AMBIENTE", "ITENS VERIFICADOS", "ITENS OK"];
    const headerRowHeight = 5;
    let currentX = margin;

    doc.setFontSize(6).setFont(undefined, 'bold');
    tableHeadersPage1.forEach((header, i) => {
      doc.setFillColor("#F3F4F6"); // Set fill color to fix black stripe issue
      doc.rect(currentX, yPos, tableColWidths[i], headerRowHeight, 'FD'); // Fill and draw
      doc.setTextColor(0,0,0);
      doc.text(header, currentX + tableColWidths[i]/2, yPos + 3.5, { align: 'center', maxWidth: tableColWidths[i]-1 });
      currentX += tableColWidths[i];
    });
    yPos += headerRowHeight;
    doc.setFont(undefined, 'normal').setTextColor(0,0,0); 

    const numRowsToRenderPage1 = 9; // Number of item rows on page 1
    const itemRowHeight = 10; // Increased row height for better spacing
    const checkboxSize = 2.5; 
    const checkboxTextOffsetY = 1.8;

    for (let i = 0; i < numRowsToRenderPage1; i++) {
      const item = i < contract.itens.length ? contract.itens[i] : null;
      currentX = margin;

      doc.rect(currentX, yPos, tableColWidths[0], itemRowHeight);
      doc.setFontSize(7).text(item?.cod || '', currentX + tableColWidths[0]/2 , yPos + itemRowHeight/2 + 2, { align: 'center'});
      currentX += tableColWidths[0];

      doc.rect(currentX, yPos, tableColWidths[1], itemRowHeight);
      doc.setFontSize(6.5).text(doc.splitTextToSize(item?.ambiente || '', tableColWidths[1]-2), currentX + 1.5, yPos + 4);
      currentX += tableColWidths[1];
      
      doc.rect(currentX, yPos, tableColWidths[2], itemRowHeight);
      let itemVerificadoText = item?.itensVerificados || '';
      if (item && item.itensOk === false && item.protocoloGerado) { // Check for explicit false
        itemVerificadoText += ` (PROTOCOLO: ${item.protocoloGerado})`;
      }
      doc.setFontSize(6).text(doc.splitTextToSize(itemVerificadoText, tableColWidths[2]-2), currentX + 1.5, yPos + 3.5);
      currentX += tableColWidths[2];

      doc.rect(currentX, yPos, tableColWidths[3], itemRowHeight);
      const itensOkCellX = currentX;
      const itensOkCellY = yPos;
      
      if (item) {
        const verticalOffsetInCell = 2.0; // To center the block of two checkboxes in the taller cell.
            
        // SIM checkbox
        const simY = itensOkCellY + verticalOffsetInCell;
        doc.rect(itensOkCellX + 3, simY, checkboxSize, checkboxSize); 
        doc.setFontSize(6).text("SIM", itensOkCellX + 3 + checkboxSize + 1, simY + checkboxTextOffsetY);
        if (item.itensOk === true) {
            doc.setFillColor(0, 0, 0); // Black fill
            doc.rect(itensOkCellX + 3, simY, checkboxSize, checkboxSize, 'F');
        }
        
        // NÃO checkbox
        const naoY = simY + checkboxSize + 1.5; // +1.5 for spacing between SIM and NÃO
        doc.rect(itensOkCellX + 3, naoY, checkboxSize, checkboxSize); 
        doc.setFontSize(6).text("NÃO", itensOkCellX + 3 + checkboxSize + 1, naoY + checkboxTextOffsetY);
        if (item.itensOk === false) {
            doc.setFillColor(0, 0, 0); // Black fill
            doc.rect(itensOkCellX + 3, naoY, checkboxSize, checkboxSize, 'F');
        }
      }
      yPos += itemRowHeight;
    }
    yPos += 1;

    // --- Section 5: Declaration (Page 1) ---
    doc.setFontSize(6);
    const declText = contract.declaracao || "DECLARO PARA OS DEVIDOS FINS E EFEITOS, QUE OS AMBIENTES LISTADOS NESTE TERMO DE ENTREGA, QUE ESTÃO IDENTIFICADOS NA LISTAGEM ACIMA COMO \"SIM\" NA COLUNA \"ITENS OK\", ESTÃO EM CONDIÇÕES ADEQUADAS E FORAM ENTREGUES DE ACORDO COM O CONTRATO, CONFORME CONSTA NAS ESPECIFICAÇÕES E IMAGENS, SEM APRESENTAR QUALQUER DEFEITO OU VÍCIO DO PRODUTO. OS AMBIENTES QUE ESTÃO IDENTIFICADOS NA LISTAGEM ACIMA COMO \"NÃO\" NA COLUNA \"ITENS OK\", DEVEM ESTAR LISTADOS NO DESCRITIVO DE ITENS PENDENTES.";
    const declarationLines = doc.splitTextToSize(declText, contentWidth - 2);
    const declarationBoxHeight = Math.max(12, declarationLines.length * 2.2 + 2); 
    doc.rect(margin, yPos, contentWidth, declarationBoxHeight);
    doc.text(declarationLines, margin + 1, yPos + 2.5);
    yPos += declarationBoxHeight + 2;

    // --- Section 6: Signature Area (Page 1) ---
    const sigFieldHeight = 7;
    const sigLabelY = yPos + 2;
    const sigValueY = yPos + 5;
    const sigLineY = yPos + 6; 
    const sigColWidth = contentWidth / 3;

    doc.setFontSize(6);
    doc.text("DATA E HORA", margin + 1, sigLabelY); doc.line(margin, sigLineY, margin + sigColWidth - 1, sigLineY);
    if(contract.dataHoraAssinatura) doc.setFontSize(7).text(contract.dataHoraAssinatura, margin + 1, sigValueY, {maxWidth: sigColWidth -2});

    doc.text("NOME COMPLETO", margin + sigColWidth + 1, sigLabelY); doc.line(margin + sigColWidth, sigLineY, margin + 2 * sigColWidth - 1, sigLineY);
    if(contract.nomeCompletoAssinatura) doc.setFontSize(7).text(contract.nomeCompletoAssinatura, margin + sigColWidth + 1, sigValueY, { maxWidth: sigColWidth - 2 });

    doc.text("CPF", margin + 2 * sigColWidth + 1, sigLabelY); doc.line(margin + 2 * sigColWidth, sigLineY, margin + 3 * sigColWidth, sigLineY);
    if(contract.cpfAssinatura) doc.setFontSize(7).text(contract.cpfAssinatura, margin + 2 * sigColWidth + 1, sigValueY, {maxWidth: sigColWidth -2});
    yPos = sigLineY + 2;

    doc.setFontSize(6).text("ASSINATURA", margin + 1, yPos + 2);
    const sigBoxY = yPos + 3;
    const sigBoxHeight = 12; 
    doc.line(margin, sigBoxY + sigBoxHeight, contentWidth + margin, sigBoxY + sigBoxHeight); 
    if (contract.assinaturaUrl && !contract.assinaturaUrl.startsWith("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAACgRRKpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHySURBVHhe7dNPCsJAFIXhGU7qD5vVj7epX6+hpL241V1IKJMQE/kHsyEJAvNMJAnz7/OEJwZNVN2M1J0xP2yG7vY0j2b2us5Zt3GZjc7sT6rM+0dG9D23b3scH1L924uS5zZ7Zc+k+B/xgEAgCEBACAEAIKBAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEQCAICAEAIIRAIwkO/2x/u7yZtYf1u8M2/qP0KkL2pCpg/0PUAAAAASUVORK5CYII=")) { // Check if not the sample blank signature
      try {
        const imgPropsSig = doc.getImageProperties(contract.assinaturaUrl);
        const sigHeight = sigBoxHeight - 1; 
        const sigWidth = Math.min((imgPropsSig.width * sigHeight) / imgPropsSig.height, contentWidth - 2);
        const sigX = margin + (contentWidth - sigWidth) / 2; 
        doc.addImage(contract.assinaturaUrl, 'PNG', sigX, sigBoxY + 0.5, sigWidth, sigHeight);
      } catch (e) { console.error("Error adding signature image to PDF:", e); }
    }
    yPos = sigBoxY + sigBoxHeight + 2;
    
    // --- Check if Page 2 is needed for PENDING ITEMS ---
    const pendingItemsForPdf = contract.itensPendentes?.filter(pi => pi.protocoloGerado || !pi.protocoloGerado); // Show all pending items regardless of protocol for listing. Protocol shown on pg1.
    const needsPage2 = contract.assinaturaUrl && pendingItemsForPdf && pendingItemsForPdf.length > 0;


    if (needsPage2 && pendingItemsForPdf) {
        doc.addPage();
        yPos = margin;
        // --- PAGE 2 ---
        yPos = drawCommonPdfHeader(doc, yPos, contract);
        yPos += 2; // Space before title

        // Title: DESCRITIVO DE ITENS PENDENTES
        doc.setFontSize(9).setFont(undefined, 'bold');
        doc.text("DESCRITIVO DE ITENS PENDENTES", pageWidth / 2, yPos, { align: 'center' });
        yPos += 6;
        doc.setFont(undefined, 'normal');

        // Pending Items Table (Page 2)
        const pendTableColWidthsPage2 = [contentWidth * 0.40, contentWidth * 0.60]; // Ambiente, Itens para Encaminhamento
        const pendTableHeadersPage2 = ["AMBIENTE", "ITENS PARA ENCAMINHAMENTO DE ASSISTÊNCIA TÉCNICA"];
        currentX = margin;

        doc.setFontSize(7).setFont(undefined, 'bold');
        pendTableHeadersPage2.forEach((header, i) => {
          doc.setFillColor("#F3F4F6"); // Set fill color to fix black stripe issue
          doc.rect(currentX, yPos, pendTableColWidthsPage2[i], headerRowHeight, 'FD');
          doc.setTextColor(0,0,0);
          doc.text(header, currentX + pendTableColWidthsPage2[i]/2, yPos + 3.5, { align: 'center', maxWidth: pendTableColWidthsPage2[i]-2 });
          currentX += pendTableColWidthsPage2[i];
        });
        yPos += headerRowHeight;
        doc.setFont(undefined, 'normal').setTextColor(0,0,0);

        const numRowsToRenderPage2 = 9; // Max pending items rows on page 2
        const pendItemRowHeight = 10; // Adjusted height for potentially longer text
        for (let i = 0; i < numRowsToRenderPage2; i++) { 
          const pendingItem = i < pendingItemsForPdf.length ? pendingItemsForPdf[i] : null;
          currentX = margin;

          doc.rect(currentX, yPos, pendTableColWidthsPage2[0], pendItemRowHeight);
          doc.setFontSize(6.5).text(doc.splitTextToSize(pendingItem?.ambiente || '', pendTableColWidthsPage2[0]-2), currentX + 1.5, yPos + pendItemRowHeight / 2 + 1);
          currentX += pendTableColWidthsPage2[0];
          
          doc.rect(currentX, yPos, pendTableColWidthsPage2[1], pendItemRowHeight);
          // Content for "ITENS PARA ENCAMINHAMENTO DE ASSISTÊNCIA TÉCNICA" is kept blank to match the form model
          doc.setFontSize(6.5).text('', currentX + 1, yPos + 3); // Empty string here
          yPos += pendItemRowHeight;
        }
        yPos += 3;

        // Simplified Signature Area for Page 2 (as in original form)
        const sigPage2LabelY = yPos + 2;
        const sigPage2LineY = yPos + 6;
        
        doc.setFontSize(6);
        doc.text("DATA E HORA", margin + 1, sigPage2LabelY); doc.line(margin, sigPage2LineY, margin + sigColWidth - 1, sigPage2LineY);
         if(contract.dataHoraAssinatura) doc.setFontSize(7).text(contract.dataHoraAssinatura, margin + 1, sigPage2LineY -1 , {maxWidth: sigColWidth -2});

        doc.text("NOME COMPLETO", margin + sigColWidth + 1, sigPage2LabelY); doc.line(margin + sigColWidth, sigPage2LineY, margin + 2 * sigColWidth - 1, sigPage2LineY);
        if(contract.nomeCompletoAssinatura) doc.setFontSize(7).text(contract.nomeCompletoAssinatura, margin + sigColWidth + 1, sigPage2LineY - 1, { maxWidth: sigColWidth - 2 });
        
        doc.text("CPF", margin + 2 * sigColWidth + 1, sigPage2LabelY); doc.line(margin + 2 * sigColWidth, sigPage2LineY, margin + 3 * sigColWidth, sigPage2LineY);
         if(contract.cpfAssinatura) doc.setFontSize(7).text(contract.cpfAssinatura, margin + 2 * sigColWidth + 1, sigPage2LineY -1, {maxWidth: sigColWidth -2});
        yPos = sigPage2LineY + 2;

        doc.setFontSize(6).text("ASSINATURA", margin + 1, yPos + 2);
        doc.line(margin, yPos + 3 + sigBoxHeight, contentWidth + margin, yPos + 3 + sigBoxHeight); // Line for signature
        if (contract.assinaturaUrl && !contract.assinaturaUrl.startsWith("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAyCAYAAACgRRKpAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHySURBVHhe7dNPCsJAFIXhGU7qD5vVj7epX6+hpL241V1IKJMQE/kHsyEJAvNMJAnz7/OEJwZNVN2M1J0xP2yG7vY0j2b2us5Zt3GZjc7sT6rM+0dG9D23b3scH1L924uS5zZ7Zc+k+B/xgEAgCEBACAEAIKBAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEUCBICAEAIKRAIAgIAQAgpEAgCAgBACCEQCAICAEAIIRAIwkO/2x/u7yZtYf1u8M2/qP0KkL2pCpg/0PUAAAAASUVORK5CYII=")) {
            try {
                const imgPropsSig = doc.getImageProperties(contract.assinaturaUrl);
                const sigHeight = sigBoxHeight - 1;
                const sigWidth = Math.min((imgPropsSig.width * sigHeight) / imgPropsSig.height, contentWidth - 2);
                const sigX = margin + (contentWidth - sigWidth) / 2;
                doc.addImage(contract.assinaturaUrl, 'PNG', sigX, yPos + 3 + 0.5, sigWidth, sigHeight);
            } catch (e) { console.error("Error adding signature image to PDF Page 2:", e); }
        }
    }


    // --- Footer & Page Numbering ---
    const totalPages = doc.getNumberOfPages(); // Use getNumberOfPages
    const generatedAtText = contract.geradoEm || `GERADO EM ${new Date().toLocaleDateString('pt-BR')} ÀS ${new Date().toLocaleTimeString('pt-BR')}`;
    
    for (let j = 1; j <= totalPages; j++) {
        doc.setPage(j);
        const footerY = doc.internal.pageSize.getHeight() - margin + 3; 
        doc.setFontSize(6);
        doc.text(generatedAtText, margin, footerY);
        doc.text(`Página ${j}/${totalPages}`, pageWidth - margin - 15, footerY, { align: 'left' });
    }

    doc.save(`contrato_renza_${contract.numeroContrato || 'SN'}.pdf`);
  };


  return (
    <div ref={scrollableContainerRef} className="flex-grow p-2 sm:p-4 overflow-y-auto bg-transparent">
      {/* Combined container for header and form, for unified scrolling and styling */}
      <div className="w-full max-w-5xl mx-auto rounded-xl shadow-2xl overflow-hidden bg-stone-800">
        {/* Header Bar - no longer sticky */}
        <div className="w-full flex items-center justify-between p-3">
            <button 
                onClick={() => setCurrentScreen(backNavigationTarget)} 
                className="text-stone-300 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-700"
                aria-label={`Voltar para ${Screen[backNavigationTarget].replace("Tela", "")}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center flex-grow">Detalhes do Contrato</h2>
            <button
              onClick={handlePdfDownload}
              className="text-stone-300 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-700 ml-2"
              aria-label="Gerar PDF do Contrato"
              disabled={!contract} 
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </button>
        </div>

        {/* Contract Form - White Background */}
        <div className="w-full bg-white text-black p-6 sm:p-8 print-container">
          
          {/* Section 1: Logo and Company Details */}
          <div className="flex justify-between items-start mb-6">
              <div className="pt-1">
                  <Logo className="max-w-[180px] sm:max-w-[200px] h-auto" />
              </div>
              <div className="text-xs leading-normal text-right text-gray-700">
                  <p className="font-bold text-black">{COMPANY_DETAILS.NAME}</p>
                  <p>CNPJ {COMPANY_DETAILS.CNPJ}</p>
                  <p>Fone: {COMPANY_DETAILS.FONE}</p>
                  <p>{COMPANY_DETAILS.ENDERECO_LINHA1}</p>
                  <p>{COMPANY_DETAILS.ENDERECO_LINHA2}</p>
                  <p>{COMPANY_DETAILS.ENDERECO_LINHA3}</p>
              </div>
          </div>
          
          {/* Section 2: Header fields */}
          <div className="grid grid-cols-3 border border-black text-black">
              <div className="border-r border-black p-3 space-y-1">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data do Contrato</div>
                  <div className="text-base sm:text-lg font-semibold">{contract.dataContrato}</div>
              </div>
              <div className="border-r border-black p-3 flex items-center justify-center">
                  <div className="font-bold text-center text-base sm:text-lg leading-tight">TERMO DE ENTREGA - MÓVEIS PLANEJADOS</div>
              </div>
              <div className="p-3 space-y-1">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Início da Montagem</div>
                  <div className="text-base sm:text-lg font-semibold">{contract.inicioMontagem}</div>
              </div>
          </div>

          {/* Section 3: Contract Info Block */}
          <div className="border-l border-r border-b border-black text-black">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <div className="p-3 border-b md:border-b-0 md:border-r border-black space-y-1"><div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nome Contrato</div><div className="text-base break-words">{contract.nomeContrato}</div></div>
                  <div className="p-3 border-b md:border-b-0 lg:border-r border-black space-y-1"><div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contrato Nº</div><div className="text-base">{contract.numeroContrato}</div></div>
                  <div className="p-3 border-b md:border-b-0 md:border-r border-black space-y-1"><div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Final Montagem</div><div className="text-base">{contract.finalMontagem}</div></div>
                  <div className="p-3 border-b md:border-b-0 border-black space-y-1"><div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Técnico Responsável</div><div className="text-base break-words">{contract.tecnicoResponsavel}</div></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-black">
                  <div className="p-3 border-b md:border-b-0 md:border-r border-black space-y-1"><div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Responsável p/ Entrega e Montagem</div><div className="text-base break-words">{contract.responsavelEntregaMontagem}</div></div>
                  <div className="p-3 border-b md:border-b-0 border-black space-y-1"><div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Telefone</div><div className="text-base">{contract.telefone}</div></div>
              </div>
              <div className="p-3 border-t border-black space-y-1">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Endereço de Entrega</div>
                  <div className="text-base break-words">{`${contract.enderecoEntrega?.rua || ''}, ${contract.enderecoEntrega?.bairro || ''}, ${contract.enderecoEntrega?.cidade || ''} - ${contract.enderecoEntrega?.uf || ''}, ${contract.enderecoEntrega?.cep || ''}`}</div>
              </div>
          </div>


          {/* Section 4: Items Table */}
          <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse border border-black text-black min-w-[700px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-black p-3 font-bold text-black w-[8%] text-sm uppercase">Cód</th>
                    <th className="border border-black p-3 font-bold text-black w-[22%] text-sm uppercase text-left">Ambiente</th>
                    <th className="border border-black p-3 font-bold text-black w-[50%] text-sm uppercase text-left">Itens Verificados</th>
                    <th className="border border-black p-3 font-bold text-black w-[20%] text-sm uppercase">Itens OK</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.itens.map((item) => { 
                    
                    let simButtonClasses = 'w-full px-4 py-2 text-sm rounded-lg transition-all duration-150 font-semibold';
                    let naoButtonClasses = 'w-full px-4 py-2 text-sm rounded-lg transition-all duration-150 font-semibold';

                    if (isFinalized) {
                      if (item.itensOk === true) {
                        simButtonClasses += ' bg-green-600 text-white cursor-default';
                        naoButtonClasses += ' bg-gray-200 text-gray-500 cursor-not-allowed';
                      } else if (item.itensOk === false) {
                        simButtonClasses += ' bg-gray-200 text-gray-500 cursor-not-allowed';
                        naoButtonClasses += ' bg-red-600 text-white cursor-default';
                      } else {
                          simButtonClasses += ' bg-gray-200 text-gray-500 cursor-not-allowed';
                          naoButtonClasses += ' bg-gray-200 text-gray-500 cursor-not-allowed';
                      }
                    } else { 
                      if (item.itensOk === true) {
                        simButtonClasses += ' bg-green-500 hover:bg-green-600 text-white ring-2 ring-green-600';
                        naoButtonClasses += ' bg-white text-gray-800 border border-gray-400 hover:bg-red-100';
                      } else if (item.itensOk === false) {
                        simButtonClasses += ' bg-white text-gray-800 border border-gray-400 hover:bg-green-100';
                        naoButtonClasses += ' bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-600';
                      } else {
                        simButtonClasses += ' bg-white text-gray-800 border border-gray-400 hover:bg-green-100';
                        naoButtonClasses += ' bg-white text-gray-800 border border-gray-400 hover:bg-red-100';
                      }
                    }

                    return (
                      <tr key={item.cod} className="bg-white hover:bg-gray-50">
                        <td className="border border-black p-3 text-center align-top text-base">{item.cod}</td>
                        <td className="border border-black p-3 align-top text-base font-medium">{item.ambiente}</td>
                        <td className="border border-black p-3 text-sm text-gray-800 align-top">
                          {item.itensVerificados}
                        </td>
                        <td className="border border-black p-2 text-center align-middle">
                          <div className="flex flex-col items-center justify-center gap-2">
                              <button
                                  className={simButtonClasses}
                                  onClick={() => handleItemInteraction(item.cod, true)}
                                  disabled={isFinalized}
                                  aria-label={`Marcar item ${item.cod} como SIM`}
                              >
                                  SIM
                              </button>
                              <button
                                  className={naoButtonClasses}
                                  onClick={() => handleItemInteraction(item.cod, false)}
                                  disabled={isFinalized}
                                  aria-label={`Marcar item ${item.cod} como NÃO`}
                              >
                                  NÃO
                              </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {contract.itens.length < 9 && Array.from({ length: 9 - contract.itens.length }).map((_, index) => (
                      <tr key={`empty-${index}`} className="h-16 bg-gray-50">
                          <td className="border border-black"></td>
                          <td className="border border-black"></td>
                          <td className="border border-black"></td>
                          <td className="border border-black"></td>
                      </tr>
                  ))}
                </tbody>
              </table>
          </div>


          {/* Section 5: Declaration */}
          <div className="border border-black p-4 my-6 text-base text-gray-800 leading-relaxed bg-gray-50 rounded-lg">
            <h4 className="font-bold text-black mb-2 text-lg">DECLARAÇÃO</h4>
            <p>{contract.declaracao}</p>
          </div>

          {/* Section 6: Signature Area */}
          <div className="border border-black p-4 text-black mt-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4">
                  <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data e Hora</div>
                      <div className="text-base mt-1 min-h-[1.5rem]">{contract.dataHoraAssinatura || 'N/A'}</div>
                  </div>
                   <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nome Completo</div>
                      <div className="text-base mt-1 min-h-[1.5rem] break-words">{contract.nomeCompletoAssinatura || 'N/A'}</div>
                  </div>
                   <div>
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">CPF</div>
                      <div className="text-base mt-1 min-h-[1.5rem]">{contract.cpfAssinatura || 'N/A'}</div>
                  </div>
              </div>
              <div className="mt-6">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assinatura</div>
                  <div className="mt-2 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center h-28">
                    {contract.assinaturaUrl ? (
                        <img src={contract.assinaturaUrl} alt="Assinatura" className="h-full w-auto object-contain p-2" />
                    ) : (
                        <div className="text-center text-gray-400 italic text-base">Pendente de Assinatura</div>
                    )}
                  </div>
              </div>
          </div>

          {/* Section 7: Footer */}
          <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
            <span>{contract.geradoEm || `GERADO EM ${new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}`}</span>
            <span>Página: {contract.paginaInfo || "1/1"}</span>
          </div>

          {!isFinalized && (
               <div className="mt-8 text-center bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-bold text-xl text-stone-800">Próximos Passos</h3>
                  <p className="text-stone-600 mt-1 mb-4">Após marcar todos os itens, finalize a verificação para prosseguir.</p>
                  <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={handleFinalizeVerificationClick}
                      disabled={!allItemsMarked}
                      aria-label="Prosseguir para finalização"
                  >
                      Finalizar Verificação
                  </Button>
                  { contract.itens.length > 0 && !allItemsMarked &&
                      <p className="text-red-600 text-sm mt-3">
                          Por favor, marque "SIM" ou "NÃO" para todos os itens para poder prosseguir.
                      </p>
                  }
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TelaDetalheContrato;
