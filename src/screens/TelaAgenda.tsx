

import React, { useState, useEffect } from 'react';
import { Screen, TelaAgendaProps, Contract, Pagamento } from '../types';
import Button from '../components/Button';

interface Appointment {
  day: number;
  month: number; // 0-indexed (0 for January, 5 for June)
  year: number;
  clientName: string;
  technician: string;
  phone: string;
  status: 'preenchida' | 'reservada' | 'disponivel'; // 'disponivel' for days without contracts
  contractId: string; // Link back to the original contract
  // Adding fields needed for the detailed popup
  numeroContrato: string;
  inicioMontagem: string;
  finalMontagem: string;
  responsavelEntregaMontagem: string;
  pagamento?: Pagamento;
}

// Helper function to parse "DD/MM/YYYY - X" format
const parseContractDate = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const mainDatePart = dateStr.split(' - ')[0];
  const parts = mainDatePart.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null;
};

// Helper function to format date for agenda popup display "DD/MêsAbreviado"
const formatContractDateForAgendaPopup = (dateString: string): string => {
    if (!dateString || typeof dateString !== 'string') return '';
    const datePart = dateString.split(' - ')[0]; // Handle "DD/MM/YYYY - M"
    const parts = datePart.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const monthNamesShort = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${day}/${monthNamesShort[monthIndex]}`;
      }
    }
    return dateString; // Fallback
};


const TelaAgenda: React.FC<TelaAgendaProps> = ({ setCurrentScreen, onLogout, contracts, onViewContractDetailsFromAgenda }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to the current date
  const [derivedAppointments, setDerivedAppointments] = useState<Appointment[]>([]);
  
  const [clickedDay, setClickedDay] = useState<Date | null>(null);
  const [appointmentsForClickedDay, setAppointmentsForClickedDay] = useState<Appointment[]>([]);
  const [selectedSingleAppointmentInPopup, setSelectedSingleAppointmentInPopup] = useState<Appointment | null>(null);


  useEffect(() => {
    const newAppointments = contracts.map(contract => {
      const startDate = parseContractDate(contract.inicioMontagem);
      if (!startDate) return null;

      return {
        day: startDate.getDate(),
        month: startDate.getMonth(),
        year: startDate.getFullYear(),
        clientName: contract.nomeContrato,
        technician: contract.tecnicoResponsavel,
        phone: contract.telefone,
        status: contract.assinaturaUrl ? 'preenchida' : 'reservada',
        contractId: contract.id,
        // Add additional fields for the popup
        numeroContrato: contract.numeroContrato,
        inicioMontagem: contract.inicioMontagem, // Keep original for formatting
        finalMontagem: contract.finalMontagem, // Keep original for formatting
        responsavelEntregaMontagem: contract.responsavelEntregaMontagem,
        pagamento: contract.pagamento, // Pass payment details
      };
    }).filter(app => app !== null) as Appointment[];
    setDerivedAppointments(newAppointments);
  }, [contracts]);

  const DAYS_OF_WEEK_LABELS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isTodayDate = (day: number | null) => 
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const getAppointmentsForDay = (day: number | null): Appointment[] => {
    if (!day) return [];
    return derivedAppointments.filter(app => app.day === day && app.month === month && app.year === year);
  };
  
  const handleDayClick = (dayNumber: number | null) => {
    if (!dayNumber) return;

    const dateOfClickedDay = new Date(year, month, dayNumber);
    const apps = getAppointmentsForDay(dayNumber);

    setClickedDay(dateOfClickedDay);
    setAppointmentsForClickedDay(apps);

    if (apps.length === 1) {
      setSelectedSingleAppointmentInPopup(apps[0]);
    } else {
      setSelectedSingleAppointmentInPopup(null); // Will show list if apps.length > 1
    }
  };
  
  const handleSelectAppointmentFromPopupList = (appointment: Appointment) => {
    setSelectedSingleAppointmentInPopup(appointment);
  };

  const closePopup = () => {
    setClickedDay(null);
    setAppointmentsForClickedDay([]);
    setSelectedSingleAppointmentInPopup(null);
  };

  const getDayClasses = (day: number | null, appsOnDay: Appointment[]) => {
    let classes = 'py-2 px-1 border border-stone-700 rounded-md h-16 flex items-center justify-center cursor-pointer transition-colors text-sm ';

    if (day === null) {
      return classes + 'bg-stone-700 text-stone-600';
    }

    if (isTodayDate(day)) {
      classes += 'bg-orange-500 !text-white font-bold ';
    } else if (appsOnDay.length > 0) {
      if (appsOnDay.some(app => app.status === 'reservada')) {
        classes += 'bg-stone-600 text-white '; // Dark gray for 'reservada' (like image day 13)
      } else if (appsOnDay.every(app => app.status === 'preenchida')) {
        classes += 'bg-sky-400 !text-black '; // Light blue for 'preenchida'
      } else {
        classes += 'bg-green-500 !text-white '; // Fallback, though 'disponivel' is better for no apps
      }
    } else {
      classes += 'bg-green-500 !text-white '; // 'disponivel' (green)
    }

    if (clickedDay && clickedDay.getDate() === day && clickedDay.getMonth() === month && clickedDay.getFullYear() === year) {
        classes += 'border-2 border-orange-500 ring-1 ring-orange-500 ';
    } else {
      classes += 'hover:bg-stone-500 ';
    }
    return classes;
  };

  // Component for rendering each section in the popup, matching the image style
  const PopupDetailSection: React.FC<{
    label: string; 
    value?: string; // Value is optional, as it might be a button for CONTRATO
    isDateRow?: boolean; 
    dateLabel2?: string; 
    dateValue2?: string;
    children?: React.ReactNode; // For custom content like the clickable contract number
    isClickableValue?: boolean;
    onValueClick?: () => void;
    isPhoneNumber?: boolean; // New prop to identify phone number section
  }> = ({ label, value, isDateRow = false, dateLabel2, dateValue2, children, isClickableValue, onValueClick, isPhoneNumber = false }) => {
    
    const sanitizePhoneNumber = (phone: string | undefined) => {
      if (!phone) return '';
      return phone.replace(/[^\d+]/g, ''); // Removes non-digits except +
    };

    const whatsappLink = isPhoneNumber && value ? `https://wa.me/${sanitizePhoneNumber(value)}` : undefined;

    return (
      <div className="text-center py-2">
        {isDateRow ? (
          <div className="flex justify-around items-start mb-1">
            <div className="flex-1 text-center">
              <p className="text-xs text-stone-400 uppercase tracking-wider">{label}</p>
              <p className="text-xl font-semibold text-white mt-1">{value}</p>
            </div>
            <span className="text-stone-400 text-2xl mx-2 pt-3">|</span>
            <div className="flex-1 text-center">
              <p className="text-xs text-stone-400 uppercase tracking-wider">{dateLabel2}</p>
              <p className="text-xl font-semibold text-white mt-1">{dateValue2}</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-stone-400 uppercase tracking-wider">{label}</p>
            {children ? (
              <div className="mt-1">{children}</div>
            ) : isClickableValue && onValueClick ? (
              <button 
                onClick={onValueClick} 
                className="text-xl font-semibold text-orange-400 hover:text-orange-300 hover:underline mt-1 focus:outline-none"
                aria-label={`Ver detalhes do ${label.toLowerCase()}: ${value}`}
              >
                {value}
              </button>
            ) : isPhoneNumber && whatsappLink ? (
                 <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-semibold text-orange-400 hover:text-orange-300 hover:underline mt-1 focus:outline-none focus:ring-1 focus:ring-orange-300 rounded"
                    aria-label={`Contatar ${value} via WhatsApp`}
                  >
                    {value}
                  </a>
            ) : (
              <p className="text-xl font-semibold text-white mt-1">{value}</p>
            )}
          </>
        )}
        <hr className="border-t border-stone-600 mt-2 w-3/4 mx-auto" />
      </div>
    );
  };


  const handleContractNumberClick = () => {
    if (selectedSingleAppointmentInPopup) {
      const contractToView = contracts.find(c => c.id === selectedSingleAppointmentInPopup.contractId);
      if (contractToView && onViewContractDetailsFromAgenda) {
        onViewContractDetailsFromAgenda(contractToView);
        closePopup();
      } else {
        console.warn("Contract not found for ID:", selectedSingleAppointmentInPopup.contractId);
        alert("Não foi possível encontrar os detalhes deste contrato.");
      }
    }
  };


  return (
    <div className="flex-grow flex flex-col items-center p-4 sm:p-6 text-stone-200">
      <div className="w-full max-w-2xl bg-stone-800 p-6 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between mb-6 pt-2">
          <button 
              onClick={() => setCurrentScreen(Screen.TelaOpcoes)} 
              className="text-stone-300 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-700"
              aria-label="Voltar para Opções"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
          </button>
          <h2 className="text-2xl font-bold text-white text-center flex-grow">Agenda</h2>
        </div>

        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={prevMonth} aria-label="Mês anterior">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Button>
          <h3 className="text-xl font-semibold text-orange-400">{`${monthNames[month]} / ${year}`}</h3>
          <Button variant="ghost" size="sm" onClick={nextMonth} aria-label="Próximo mês">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS_OF_WEEK_LABELS.map(dayLabel => (
            <div key={dayLabel} className="font-medium text-stone-400 text-xs py-2">{dayLabel}</div>
          ))}
          {calendarDays.map((day, index) => {
            const appsOnDay = getAppointmentsForDay(day);
            return (
              <div
                key={index}
                className={getDayClasses(day, appsOnDay)}
                onClick={() => handleDayClick(day)}
                role="button"
                tabIndex={day ? 0 : -1}
                aria-label={day ? `Dia ${day} de ${monthNames[month]}${appsOnDay.length > 0 ? `, ${appsOnDay.length} agendamento(s)` : ', disponível'}` : 'Dia vazio'}
              >
                {day}
                {appsOnDay.length > 1 && <span className="absolute bottom-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-stone-300 mb-2">LEGENDA DE STATUS DOS AGENDAMENTOS</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-sky-400 mr-2"></div>Preenchida</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-yellow-400 mr-2"></div>Reservada</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>Disponível</div>
            <div className="flex items-center"><div className="w-3 h-3 rounded-sm bg-orange-500 mr-2"></div>Hoje</div>
          </div>
        </div>

        <p className="text-xs text-stone-500 mt-4 text-center">
          Clique em um dia agendado para ver detalhes do contrato.
        </p>
      </div>

      {/* Appointment Popup Modal */}
      {clickedDay && appointmentsForClickedDay.length > 0 && (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closePopup}
            role="dialog"
            aria-modal="true"
            aria-labelledby="appointment-popup-title"
        >
          <div 
            className="bg-stone-800 p-5 rounded-lg shadow-xl relative w-full max-w-sm border border-orange-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-500 rounded-l-lg"></div>
            <button 
                onClick={closePopup} 
                className="absolute top-2 right-2 text-stone-400 hover:text-white"
                aria-label="Fechar popup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            
            {!selectedSingleAppointmentInPopup && appointmentsForClickedDay.length > 1 ? (
              // Show list of appointments if multiple and none selected yet
              <div>
                <h3 id="appointment-popup-title" className="text-lg font-bold text-white mb-3 text-center">
                  Agendamentos para {clickedDay.toLocaleDateString('pt-BR')}
                </h3>
                <ul className="space-y-2 max-h-60 overflow-y-auto">
                  {appointmentsForClickedDay.map(app => (
                    <li key={app.contractId}>
                      <button 
                        onClick={() => handleSelectAppointmentFromPopupList(app)}
                        className="w-full text-left p-3 rounded-md bg-stone-700 hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                      >
                        <span className="font-semibold text-orange-400">{app.clientName}</span>
                        <br />
                        <span className="text-xs text-stone-300">Contrato: {app.numeroContrato}</span>
                        <br/>
                        <span className="text-xs text-stone-400">Técnico: <span className="font-medium text-stone-200">{app.technician || 'N/A'}</span></span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : selectedSingleAppointmentInPopup ? (
              // Show details of the selected (or only) appointment in the new format
              <div className="pt-2">
                 {/* Title removed to match image more closely which implies details are the focus */}
                <PopupDetailSection 
                    label="CONTRATO"
                    isClickableValue={true}
                    onValueClick={handleContractNumberClick}
                    value={selectedSingleAppointmentInPopup.numeroContrato + (selectedSingleAppointmentInPopup.numeroContrato.includes('- CF') ? '' : ' - CF')}
                />
                <PopupDetailSection 
                    label="DATA INÍCIO" 
                    value={formatContractDateForAgendaPopup(selectedSingleAppointmentInPopup.inicioMontagem)} 
                    isDateRow={true} 
                    dateLabel2="DATA FIM"
                    dateValue2={formatContractDateForAgendaPopup(selectedSingleAppointmentInPopup.finalMontagem)}
                />
                 <PopupDetailSection 
                    label="NOME CONTRATO" 
                    value={selectedSingleAppointmentInPopup.clientName} 
                />
                <PopupDetailSection 
                    label="NOME DO RESPONSÁVEL PELA ENTREGA E MONTAGEM" 
                    value={selectedSingleAppointmentInPopup.responsavelEntregaMontagem} 
                />
                 <PopupDetailSection 
                    label="FONE DO RESPONSÁVEL PELO PEDIDO" 
                    value={selectedSingleAppointmentInPopup.phone} 
                    isPhoneNumber={true}
                />
                {/* Payment Details Section */}
                {selectedSingleAppointmentInPopup.pagamento && (
                  <div className="pt-2">
                    <PopupDetailSection 
                      label="1ª PARTE DO PAGAMENTO"
                      value={`R$ ${selectedSingleAppointmentInPopup.pagamento.primeiraParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                    <PopupDetailSection 
                      label="2ª PARTE DO PAGAMENTO"
                      value={`R$ ${selectedSingleAppointmentInPopup.pagamento.segundaParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                     <PopupDetailSection 
                      label="VALOR TOTAL"
                      value={`R$ ${selectedSingleAppointmentInPopup.pagamento.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    />
                  </div>
                )}
              </div>
            ) : (
                // This case should ideally not be reached if appointmentsForClickedDay.length > 0
                // and the logic correctly sets selectedSingleAppointmentInPopup for single appointments.
                <p className="text-stone-400 text-center py-5">Nenhum agendamento selecionado.</p> 
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TelaAgenda;