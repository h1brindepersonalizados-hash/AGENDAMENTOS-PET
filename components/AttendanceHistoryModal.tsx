
import React, { useState, useRef } from 'react';
import { Pet } from '../types';
import PetReportForPDF from './PetReportForPDF';

// @ts-ignore
const { jsPDF } = window.jspdf;

interface AttendanceHistoryModalProps {
  pet: Pet;
  onClose: () => void;
}

const AttendanceHistoryModal: React.FC<AttendanceHistoryModalProps> = ({ pet, onClose }) => {
  const [date, setDate] = useState(new Date());
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const daysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"];

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => setDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setDate(new Date(year, month + 1, 1));

  const generatePDF = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPDF(true);

    try {
        // @ts-ignore
        const canvas = await html2canvas(reportRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`relatorio_${pet.name}_${month + 1}-${year}.pdf`);
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
        setIsGeneratingPDF(false);
    }
  };

  const attendanceMap = pet.attendance.reduce((acc, record) => {
    acc[record.date] = record.status;
    return acc;
  }, {} as Record<string, 'present' | 'absent'>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-indigo-800">Histórico de Presença de {pet.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="px-3 py-1 rounded bg-indigo-100 text-indigo-700">&lt;</button>
            <h3 className="font-semibold text-lg">{monthNames[month]} {year}</h3>
            <button onClick={handleNextMonth} className="px-3 py-1 rounded bg-indigo-100 text-indigo-700">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center">
            {daysOfWeek.map(day => <div key={day} className="font-bold text-gray-500 text-sm">{day}</div>)}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, day) => {
              const dayNumber = day + 1;
              const currentDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
              const status = attendanceMap[currentDate];
              let bgColor = 'bg-gray-100';
              if (status === 'present') bgColor = 'bg-green-200';
              else if (status === 'absent') bgColor = 'bg-red-200';

              return (
                <div key={dayNumber} className={`p-2 rounded-full ${bgColor}`}>
                  {dayNumber}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg space-x-3">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="px-6 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {isGeneratingPDF ? 'Gerando...' : 'Gerar Relatório PDF'}
          </button>
        </div>
      </div>
      
      {/* Hidden component for PDF rendering */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <PetReportForPDF ref={reportRef} pet={pet} date={date} />
      </div>
    </div>
  );
};

export default AttendanceHistoryModal;
