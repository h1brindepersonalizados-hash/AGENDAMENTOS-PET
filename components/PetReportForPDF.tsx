
import React, { forwardRef } from 'react';
import { Pet } from '../types';

interface PetReportProps {
  pet: Pet;
  date: Date;
}

const PetReportForPDF = forwardRef<HTMLDivElement, PetReportProps>(({ pet, date }, ref) => {
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const year = date.getFullYear();
  const month = date.getMonth();

  const filteredAttendance = pet.attendance
    .filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === year && recordDate.getMonth() === month;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div ref={ref} style={{ width: '800px', padding: '40px', fontFamily: 'sans-serif', backgroundColor: 'white' }}>
      <h1 style={{ fontSize: '28px', color: '#3730a3', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
        Relatório de Presença - {pet.name}
      </h1>
      <h2 style={{ fontSize: '20px', color: '#4f46e5', marginBottom: '30px' }}>
        {monthNames[month]} de {year}
      </h2>

      <div style={{ display: 'flex', gap: '30px', marginBottom: '30px' }}>
        <img src={pet.photoUrl} alt={pet.name} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>Dados do Pet</h3>
          <p><strong>Raça:</strong> {pet.breed}</p>
          <p><strong>Idade:</strong> {pet.age} anos</p>
          <p><strong>Dono(a):</strong> {pet.owner.name} ({pet.owner.phone})</p>
        </div>
      </div>

      <h3 style={{ fontSize: '22px', marginBottom: '15px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        Registros de Presença
      </h3>
      
      {filteredAttendance.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Data</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
            </tr>
            </thead>
            <tbody>
            {filteredAttendance.map(record => (
                <tr key={record.date}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(record.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd', color: record.status === 'present' ? 'green' : 'red' }}>
                    {record.status === 'present' ? 'Presente' : 'Ausente'}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      ) : (
        <p>Nenhum registro de presença para este mês.</p>
      )}

    </div>
  );
});

export default PetReportForPDF;
